function AddonEditableWindow_create() {

    var presenter = function () {
    };

    presenter.configuration = {
        playerController: null,
        eventBus: null,
        timeouts: [],
        view: null,
        model: null,
        isIframeLoaded: false,
        isTinyMceLoaded: false,
        isTinyMceFilled: false,
        contentLoadingLock: false,
        iframeContent: null,
        editor: null,
        textareaId: null,
        isVisible: true,
        hasHtml: false,
        hasVideo: false,
        hasAudio: false,
        heightOffset: 110,
        widthOffset: 22,
        minHeight: 300,
        maxHeight: 10000,
        minWidth: 300,
        maxWidth: 950,
        state: {
            isInitialized: false,
            content: null
        }
    };

    // these values are numbers and won't have "px" ending
    presenter.temporaryState = {
        isFullScreen: false,
        scrollTop: 0,
        addonFullScreenHeight: 0,
        addonTop: 0,
        addonLeft: 0,
        addonWidth: 0,
        addonHeight: 0
    };

    presenter.run = function (view, model) {
        presenter.configuration.view = view;
        // container is the div that will be draggable and resizable
        presenter.configuration.container = view.getElementsByClassName(presenter.cssClasses.container.getName())[0];
        presenter.configuration.$container = $(presenter.configuration.container);

        view.addEventListener('DOMNodeRemoved', presenter.destroy);

        var upgradedModel = presenter.upgradeModel(model);
        presenter.configuration.model = presenter.validModel(upgradedModel);

        if (presenter.configuration.model.isValid) {
            presenter.configuration.container.style.width = presenter.configuration.model.width + 'px';
            presenter.configuration.container.style.height = presenter.configuration.model.height + 'px';

            presenter.configuration.textareaId = presenter.configuration.model.id + "-textarea";
            presenter.configuration.hasHtml = presenter.configuration.model.indexFile !== "";
            presenter.configuration.hasAudio = presenter.configuration.model.audioFile !== "";
            presenter.configuration.hasVideo = presenter.configuration.model.videoFile !== "";
            presenter.temporaryState.iFrameOffset = window.iframeSize.frameOffset || 0;

            presenter.init();
            presenter.hide();
        } else {
            $(view).html(presenter.configuration.model.errorMessage);
        }
    };

    presenter.init = function () {
        var $view = $(presenter.configuration.view);
        var $container = presenter.configuration.$container;
        var hasHtml = presenter.configuration.hasHtml;
        var textareaId = presenter.configuration.textareaId;
        var title = presenter.configuration.model.title;
        var headerStyle = presenter.configuration.model.headerStyle;
        var $header = $container.find(".header");
        var $headerText = $container.find(".header-text");
        var disableResizeHeight = presenter.configuration.model.disableResizeHeight;

        $headerText.text(title);
        $header.addClass(headerStyle);

        if (presenter.configuration.hasVideo) {
            presenter.handleVideoContent();
            presenter.configuration.hasHtml = false;
            presenter.configuration.hasAudio = false;
        } else {
            $container.find(".video-wrapper").remove();
        }

        if (presenter.configuration.hasAudio) {
            presenter.handleAudioContent();
        } else {
            $container.find("audio").remove();
        }

        if (presenter.configuration.hasHtml) {
            presenter.handleHtmlContent();
        } else {
            $view.find(".content-iframe").remove();
            $view.find("textarea").remove();
        }

        $container.css("z-index", "1");

        if (disableResizeHeight) {
            var moduleHeight = presenter.configuration.model.height;
            presenter.configuration.minHeight = moduleHeight;
            presenter.configuration.maxHeight = moduleHeight;
        }

        // containment option disallows moving window outside of specifed dom element
        $container.draggable({
            cancel: 'video',
            containment: 'document',
            start: function () {
                presenter.show();
            },
            drag: presenter.updateButtonMenuPosition,
            stop: presenter.updateButtonMenuPosition
        });

        $container.resizable({
            minHeight: presenter.configuration.minHeight,
            maxHeight: presenter.configuration.maxHeight,
            minWidth: presenter.configuration.minWidth,
            maxWidth: presenter.configuration.maxWidth,
            resize: function (event, ui) {
                presenter.changeViewPositionToFixed();
                presenter.updateButtonMenuPosition();
                if (hasHtml) {
                    var heightOffset = presenter.configuration.heightOffset;
                    var widthOffset = presenter.configuration.widthOffset;
                    var newHeight = ui.size.height - heightOffset;
                    var newWidth = ui.size.width - widthOffset;
                    tinymce.get(textareaId).theme.resizeTo(newWidth, newHeight);
                }
            },
            start: function (event, ui) {
                if (hasHtml) {
                    $container.find("iframe").css("visibility", "hidden")
                }
            },
            stop: function (event, ui) {
                presenter.changeViewPositionToFixed();
                presenter.updateButtonMenuPosition();
                if (hasHtml) {
                    $container.find("iframe").css("visibility", "visible")
                }
            },
        });

        presenter.addHandlers($view);
    };


    // because draggable prevents event bubbling, button wasn't clickable on android
    // menu with buttons is now outside of draggable container and its position needs to be updated when container changes position or size
    presenter.updateButtonMenuPosition = function () {
        var $view = $(presenter.configuration.view);
        var $buttonMenu = $view.find(presenter.cssClasses.buttonMenu.getSelector());
        // selector needs to be scoped to addon id, otherwise if more than one addon were added to lesson then it wouldn't properly position buttonMenu
        var buttonParentSelector = '#' + presenter.configuration.model.id + ' ' + presenter.cssClasses.container.getSelector();

        $buttonMenu.position({
            my: "left top",
            at: "right top",
            of: buttonParentSelector,
            collision: "fit"
        });
    };

    presenter.addHandlers = function ($view) {
        $view.find(presenter.cssClasses.closeButton.getSelector()).click(presenter.closeButtonClickedCallback);
        $view.find(presenter.cssClasses.fullScreenButton.getSelector()).click(presenter.fullScreenButtonClickedCallback);
        $view.find(presenter.cssClasses.wrapper.getSelector()).click(presenter.viewClickedCallback);
    };

    presenter.viewClickedCallback = function () {
        presenter.show();
    };

    presenter.closeButtonClickedCallback = function () {
        var $view = presenter.configuration.$container;
        var $button = $view.find(presenter.cssClasses.fullScreenButton.getSelector());
        if (presenter.temporaryState.isFullScreen) {
            presenter.closeFullScreen($view, $button);
        }

        presenter.hide();
    };

    presenter.fullScreenButtonClickedCallback = function () {
        var $view = presenter.configuration.$container;
        var $button = $(presenter.configuration.view).find(presenter.cssClasses.fullScreenButton.getSelector());

        if (presenter.temporaryState.isFullScreen) {
            presenter.closeFullScreen($view, $button);
        } else {
            presenter.openFullScreen($view, $button);
        }

        presenter.updateButtonMenuPosition();
    };

    presenter.openFullScreen = function ($view, $button) {
        // so height of the window will take whole available space
        var height = window.iframeSize.windowInnerHeight || presenter.configuration.model.width;

        presenter.temporaryState.isFullScreen = true;

        presenter.saveViewPropertiesToState($view);
        $view.height(height);
        presenter.addFullScreenClasses($view, $button);

        presenter.updateFullScreenWindowTop();
        presenter.resizeTinyMce($view.width(), height);
    };

    presenter.closeFullScreen = function ($view, $button) {
        presenter.temporaryState.isFullScreen = false;

        presenter.setViewPropertiesFromState($view);
        presenter.removeFullScreenClasses($view, $button);
        presenter.resizeTinyMce($view.width(), $view.height());
    };

    // save current size and position to state
    presenter.saveViewPropertiesToState = function ($view) {
        presenter.temporaryState.addonWidth = $view.width();
        presenter.temporaryState.addonHeight = $view.height();
        presenter.temporaryState.addonTop = $view.position().top;
        presenter.temporaryState.addonLeft = $view.position().left;
    };

    // restore size and position before going full screen, also add current scroll value so window is visible at once
    presenter.setViewPropertiesFromState = function ($view) {
        $view.width(presenter.temporaryState.addonWidth);
        $view.height(presenter.temporaryState.addonHeight);
        $view.css({
            top: presenter.temporaryState.addonTop + presenter.temporaryState.scrollTop,
            left: presenter.temporaryState.addonLeft
        });
    };

    presenter.addFullScreenClasses = function ($view, $button) {
        $button.removeClass(presenter.cssClasses.openFullScreenButton.getName());
        $button.addClass(presenter.cssClasses.closeFullScreenButton.getName());
        $view.addClass(presenter.cssClasses.containerFullScreen.getName());

        $view.resizable('disable');
        $view.draggable('disable');
    };

    presenter.removeFullScreenClasses = function ($view, $button) {
        $button.removeClass(presenter.cssClasses.closeFullScreenButton.getName());
        $button.addClass(presenter.cssClasses.openFullScreenButton.getName());
        $view.removeClass(presenter.cssClasses.containerFullScreen.getName());

        $view.resizable('enable');
        $view.draggable('enable');
    };

    presenter.resizeTinyMce = function (width, height) {
        if (presenter.configuration.isTinyMceLoaded && presenter.configuration.editor) {
            // tinymce can be smaller than whole window
            width -= presenter.configuration.widthOffset;
            height -= presenter.configuration.heightOffset;
            presenter.configuration.editor.theme.resizeTo(width, height);
        }
    };

    // during scroll window needs to be repositioned, so it blocks whole lesson view
    presenter.updateFullScreenWindowTop = function () {
        var $view = presenter.configuration.$container;
        var top = presenter.temporaryState.scrollTop;
        var properties = {
            top: top
        };

        // this is needed when embedding page has header and iFrame is not at the top of the page
        if (top > presenter.temporaryState.iFrameOffset) {
            properties.top = (top - presenter.temporaryState.iFrameOffset) + 'px';
        }

        // on android scroll down/up can hide/show navbar which adds/subtracts available height
        if (MobileUtils.isMobileUserAgent(window.navigator.userAgent)) {
            properties.height = window.iframeSize.windowInnerHeight || presenter.configuration.model.width;
        }

        $view.css(properties);
        presenter.updateButtonMenuPosition();
    };

    presenter.handleVideoContent = function () {
        var $view = $(presenter.configuration.view);
        var audioSource = presenter.configuration.model.videoFile;
        var $videoElement = $view.find("video");
        $videoElement.attr("src", audioSource);
    };

    presenter.handleAudioContent = function () {
        var $view = $(presenter.configuration.view);
        var $container = presenter.configuration.$container;
        var audioSource = presenter.configuration.model.audioFile;
        var $audioElement = $view.find("audio");
        $audioElement.attr("src", audioSource);
        presenter.configuration.heightOffset += 35;
    };

    // jQuery changes position of element to absolute when it is both resizable and draggable after resize
    presenter.changeViewPositionToFixed = function () {
        presenter.configuration.container.style.position = 'fixed';
    };

    presenter.handleHtmlContent = function () {
        var height = presenter.configuration.model.height;
        var width = presenter.configuration.model.width;
        var indexFile = presenter.configuration.model.indexFile;
        var textareaId = presenter.configuration.textareaId;
        var $view = $(presenter.configuration.view);

        var iframe = $view.find(".content-iframe");
        var separator = (indexFile.indexOf("?") === -1) ? "?" : "&";
        var source = indexFile + separator + "no_gcs=true";

        iframe.attr("onload", function () {
            presenter.configuration.isIframeLoaded = true;
        });
        iframe.attr("src", source);

        $view.css("z-index", "1");

        var textarea = $view.find("textarea");
        textarea.attr("id", textareaId);

        var widthOffset = presenter.configuration.widthOffset;
        var heightOffset = presenter.configuration.heightOffset;

        tinymce.init({
            selector: "#" + textareaId,
            plugins: "textcolor link",
            toolbar: "backcolor",
            language: "fr_FR_pure",
            textcolor_map: [
                "ffff00", "Yellow",
                "87ceeb", "Blue",
                "ffb6c1", "Red",
                "90ee90", "Green",
                "ffffff", "White"
            ],
            custom_colors: false,
            statusbar: false,
            menubar: false,
            height: height - heightOffset,
            width: width - widthOffset,
            setup: function (editor) {
                if (!presenter.configuration.model.editingEnabled) {
                    editor.on('keydown keypress keyup', function (e) {
                        e.preventDefault();
                    });
                }
            }
        }).then(function (editors) {
            presenter.configuration.editor = editors[0];
            presenter.configuration.isTinyMceLoaded = true;
        });

        var timeout = setTimeout(function () {
            presenter.fetchIframeContent(function (content) {
                var isInitialized = presenter.configuration.state.isInitialized;
                if (!isInitialized) {
                    presenter.configuration.contentLoadingLock = true;
                    presenter.fillActiveTinyMce(content);
                    presenter.configuration.state.isInitialized = true;
                    presenter.configuration.state.content = content;
                    presenter.configuration.contentLoadingLock = false;
                }
                presenter.removeIframe();
            });
        }, 3000);
        presenter.configuration.timeouts.push(timeout);
    };

    presenter.createPreview = function (view, model) {
        presenter.configuration.view = view;
        presenter.configuration.model = presenter.validModel(model);

        if (!presenter.configuration.model.isValid) {
            $(view).html(presenter.configuration.model.errorMessage);
        }
    };

    presenter.setState = function (state) {
        var contentLoadingLock = presenter.configuration.contentLoadingLock;
        if (contentLoadingLock) {
            var timeout = setTimeout(function (state) {
                presenter.setState(state);
            }, 1000);

            presenter.configuration.timeouts.push(timeout);
        } else {
            handleState(state);
        }
    };

    function handleState(state) {
        presenter.configuration.contentLoadingLock = true;
        presenter.configuration.state = JSON.parse(state);

        var isInitialized = presenter.configuration.state.isInitialized;
        var content = presenter.configuration.state.content;

        if (isInitialized) {
            presenter.fillActiveTinyMce(content);
        }
        presenter.configuration.contentLoadingLock = false;
    };

    presenter.getState = function () {
        var editor = presenter.configuration.editor;
        var isTinyMceLoaded = presenter.configuration.isTinyMceLoaded;
        var isTinyMceFilled = presenter.configuration.isTinyMceFilled;
        if (isTinyMceLoaded && isTinyMceFilled) {
            presenter.configuration.state.content = editor.getContent({format: 'raw'});
        }

        return JSON.stringify(presenter.configuration.state);
    };

    presenter.upgradeModel = function (model) {
        return presenter.addDisableResizeHeight(model);
    };

    presenter.addDisableResizeHeight = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!model['disableResizeHeight') {
            upgradedModel['disableResizeHeight'] = 'False';
        }

        return upgradedModel;
    };

    presenter.validModel = function (model) {
        var indexFile = model['index'];
        var audioFile = model['audio'];
        var videoFile = model['video'];

        if (indexFile === "" && audioFile === "" && videoFile === "") {
            return presenter.generateValidationError("Content cannot be undefined.");
        }

        var fileList = [];

        var originalFileList = model["fileList"];
        for (var i = 0; i < originalFileList.length; i++) {
            var entity = originalFileList[i];
            if (entity.id != "" && entity.file != "") {
                fileList.push(entity);
            }
        }

        return {
            isValid: true,
            id: model['ID'],
            fileList: fileList,
            height: model['Height'],
            width: model['Width'],
            top: model['Top'],
            left: model['Left'],
            right: model['Right'],
            bottom: model['Bottom'],
            indexFile: model['index'],
            audioFile: model['audio'],
            videoFile: model['video'],
            title: model['title'] ? model['title'] : "",
            headerStyle: model['headerStyle'] ? model['headerStyle'] : "",
            editingEnabled: ModelValidationUtils.validateBoolean(model["editingEnabled"]),
            disableResizeHeight: ModelValidationUtils.validateBoolean(model["disableResizeHeight"])
        }
    };

    presenter.generateValidationError = function (message) {
        return {
            isValid: false,
            errorMessage: message
        }
    };

    presenter.fetchIframeContent = function (callback) {
        var view = presenter.configuration.view;
        var isIframeLoaded = presenter.configuration.isIframeLoaded;

        if (isIframeLoaded) {
            var content = $(view).find(".content-iframe").contents().find("body").html();
            if (content == null || content == "") {
                var timeout = setTimeout(function () {
                    presenter.fetchIframeContent(callback);
                }, 1000);
                presenter.configuration.timeouts.push(timeout);
            } else {
                presenter.configuration.iframeContent = content;
                callback(content);

                var $view = $(presenter.configuration.view);
                $view.find(".addon-editable-reset-button").click(function () {
                    presenter.reset();
                });
            }
        } else {
            var timeout = setTimeout(function (callback) {
                presenter.fetchIframeContent(callback)
            }, 1000);

            presenter.configuration.timeouts.push(timeout);
        }
    };

    presenter.fillActiveTinyMce = function (content) {
        var isTinyMceLoaded = presenter.configuration.isTinyMceLoaded;

        if (isTinyMceLoaded) {
            var timeout = setTimeout(function () {
                presenter.fillTinyMce(content);
            }, 1000);

            presenter.configuration.timeouts.push(timeout);
        } else {
            var timeout = setTimeout(function () {
                presenter.fillActiveTinyMce(content);
            }, 1000);

            presenter.configuration.timeouts.push(timeout);
        }
    };

    presenter.fillTinyMce = function (content) {
        var fileList = presenter.configuration.model.fileList;
        var documentContent = new DOMParser().parseFromString(content, 'text/html');
        var textareaId = presenter.configuration.textareaId;

        for (var i = 0; i < fileList.length; i++) {
            var entity = fileList[i];
            var node = documentContent.getElementById(entity.id);
            if (node != null && node !== undefined) {
                node.src = entity.file;
            }
        }

        var parsedContent = documentContent.getElementsByTagName("body")[0].innerHTML;
        tinymce.get(textareaId).getBody().innerHTML = parsedContent;
        presenter.linkAnchors();

        presenter.configuration.isTinyMceFilled = true;
    };

    presenter.linkAnchors = function () {
        var $view = $(presenter.configuration.view);
        var $anchors = $view.find("iframe").contents().find("a");
        for (var i = 0; i < $anchors.length; i++) {
            var anchor = $anchors[i];
            anchor.style.cursor = "pointer";
            anchor.addEventListener("click", function () {
                var anchorElement = document.createElement("a");
                anchorElement.href = anchor.href;
                anchorElement.target = '_blank';
                var anchorEvent = document.createEvent("MouseEvents");
                anchorEvent.initEvent("click", false, true);
                anchorElement.dispatchEvent(anchorEvent);
            });
        }
    };

    presenter.removeIframe = function () {
        $(presenter.configuration.view).find(".content-iframe").remove();
    };

    presenter.centerPosition = function () {
        var $view = presenter.configuration.$container;
        var width = $view.width();
        var availableWidth = presenter.getAvailableWidth();

        var scrollY = presenter.temporaryState.scrollTop;

        var topOffset = scrollY + 25;
        var leftOffset = (availableWidth - width) / 2;

        $view.css({
            top: topOffset + 'px',
            left: leftOffset + 'px',
            right: "",
            bottom: ""
        });

        presenter.updateButtonMenuPosition();
    };

    presenter.getAvailableWidth = function () {
        return $(window).width();
    };

    presenter.show = function () {
        var view = presenter.configuration.view;
        var eventBus = presenter.configuration.eventBus;
        var id = presenter.configuration.model.id;
        var $view = $(view);

        presenter.configuration.isVisible = true;

        $view.style("z-index", "3");
        $view.show();
        presenter.updateButtonMenuPosition();

        eventBus.sendEvent('ValueChanged', {
            'source': id,
            'item': '',
            'value': 'move-editable-windows',
            'score': ''
        });
    };

    presenter.openPopup = function () {
        presenter.show();
        presenter.centerPosition();
    };

    presenter.hide = function () {
        presenter.configuration.isVisible = false;
        $(presenter.configuration.view).hide();
        presenter.stopAudio();
        presenter.stopVideo();
    };

    presenter.isVisible = function () {
        return presenter.configuration.isVisible;
    };

    presenter.setPlayerController = function (controller) {
        presenter.configuration.playerController = controller;
        presenter.configuration.eventBus = presenter.configuration.playerController.getEventBus();
        presenter.configuration.eventBus.addEventListener('ValueChanged', this);
        presenter.configuration.eventBus.addEventListener('ScrollEvent', this);
    };

    presenter.onEventReceived = function (eventName, eventData) {
        if (eventName === 'ValueChanged') {
            presenter.handleValueChanged(eventData);
        } else if (eventName === 'ScrollEvent') {
            presenter.handleScrollEvent(eventData);
        }
    };

    presenter.handleValueChanged = function (eventData) {
        var value = eventData.value;
        var source = eventData.source;
        var id = presenter.configuration.model.id;
        var view = presenter.configuration.view;
        var $view = $(view);

        if (value === "move-editable-windows" && source !== id) {
            $view.style("z-index", "1");
        }
    };

    presenter.handleScrollEvent = function (eventData) {
        var scrollValue = eventData.value;
        presenter.temporaryState.scrollTop = parseInt(scrollValue, 10);

        if (presenter.temporaryState.isFullScreen) {
            presenter.updateFullScreenWindowTop();
        }
    };

    presenter.stopAudio = function () {
        if (presenter.configuration.hasAudio) {
            var $view = $(presenter.configuration.view);
            var audioElement = $view.find("audio")[0];
            audioElement.pause();
            audioElement.currentTime = 0;
        }
    };

    presenter.stopVideo = function () {
        if (presenter.configuration.hasVideo) {
            var $view = $(presenter.configuration.view);
            var audioElement = $view.find("video")[0];
            audioElement.pause();
            audioElement.currentTime = 0;
        }
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'isVisible': presenter.isVisible,
            'centerPosition': presenter.centerPosition,
            'openPopup': presenter.openPopup,
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.reset = function () {
        var iframeContent = presenter.configuration.iframeContent;
        var isTinyMceLoaded = presenter.configuration.isTinyMceLoaded;
        var isContentLoadingLocked = presenter.configuration.contentLoadingLock;

        if (isTinyMceLoaded && !isContentLoadingLocked) {
            presenter.configuration.contentLoadingLock = true;
            presenter.fillTinyMce(iframeContent);
            presenter.configuration.state.isInitialized = true;
            presenter.configuration.state.content = iframeContent;
            presenter.configuration.contentLoadingLock = false;
        }
    };

    // On the mCourser, each addon is called twice on the first page.
    // Removing the addon before loading the library causes a problem with second loading.
    presenter.destroy = function (event) {
        if (event.target === presenter.configuration.view) {
            presenter.configuration.view.removeEventListener('DOMNodeRemoved', presenter.destroy);

            presenter.removeCallbacks();

            var timeouts = presenter.configuration.timeouts;
            for (var i = 0; i < timeouts.length; i++) {
                clearTimeout(timeouts[i]);
            }

            try {
                presenter.configuration.editor.destroy();
            } catch (e) {
                console.log(presenter.configuration.model.id + ": cannot to destroy editor.")
            }

            try {
                tinymce.remove();
            } catch (e) {
                console.log(presenter.configuration.model.id + ": cannot to remove tinymce.")
            }

            $(presenter.configuration.view).off();
            presenter.configuration.$container = null;
            presenter.configuration.container = null;
            presenter.configuration = null;
        }
    };

    presenter.removeCallbacks = function () {
        $view.off('click', presenter.cssClasses.closeButton.getSelector(), presenter.closeButtonClickedCallback);
        $view.off('click', presenter.cssClasses.fullScreenButton.getSelector(), presenter.fullScreenButtonClickedCallback);
        $view.off('click', presenter.cssClasses.wrapper.getSelector(), presenter.viewClickedCallback);
    };

    // small util class for aggregating classes and getting their selectors
    presenter.CssClass = function CssClass(name) {
        this.name = name;
    };

    presenter.CssClass.prototype.getSelector = function () {
        return "." + this.name;
    };

    presenter.CssClass.prototype.getName = function () {
        return this.name;
    };

    presenter.cssClasses = {
        container: new presenter.CssClass("addon-editable-window-container"),
        containerFullScreen: new presenter.CssClass("addon-editable-window-container-full-screen"),
        closeButton: new presenter.CssClass("addon-editable-close-button"),
        fullScreenButton: new presenter.CssClass("addon-editable-full-screen-button"),
        openFullScreenButton: new presenter.CssClass("addon-editable-open-full-screen-button"),
        closeFullScreenButton: new presenter.CssClass("addon-editable-close-full-screen-button"),
        wrapper: new presenter.CssClass("addon-editable-window-wrapper"),
        buttonMenu: new presenter.CssClass("addon-editable-buttons-menu")
    };

    return presenter;
}
