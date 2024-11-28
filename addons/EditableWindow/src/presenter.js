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
        addonFullScreenHeight: 0,
        addonHeight: 0,
        addonLeft: 0,
        addonTop: 0,
        addonWidth: 0,
        isFullScreen: false,
        scaleInfo: {
            scaleX: 1.0,
            scaleY: 1.0
        },
        scrollTop: 0
    };

    presenter.jQueryElementsCache = {
        $buttonMenu: undefined,
        $container: undefined,
        $fixedContainer: undefined,
        $fullscreenButton: undefined,
        $view: undefined
    };

    presenter.isKeyboardNavDeactivationBlocked = false;
    presenter.isEditAreaInScrollableMode = false;

    presenter.keys = {
        ARROW_UP: 38,
        ARROW_DOWN: 40
    };

    presenter.DEFAULT_TTS_PHRASES = {
        openFullscreen: "Open fullscreen",
        closeFullscreen: "Close fullscreen",
        closeWindow: "Close window",
        textTool: "Text highlighting tool",
        highlightSelect: "Highlight selected text",
        pickAColor: "Pick a color for highlighting",
        yellow: "Yellow",
        blue: "Blue",
        red: "Red",
        green: "Green",
        white: "White",
        noColor: "No color",
        reset: "Reset",
        image: "Image",
        audio: "Audio",
        video: "Video",
    };

    presenter.initJQueryCache = function($view) {
        presenter.jQueryElementsCache.$fullscreenButton = $view.find(presenter.cssClasses.fullScreenButton.getSelector());
        presenter.jQueryElementsCache.$buttonMenu = $view.find(presenter.cssClasses.buttonMenu.getSelector());
        presenter.jQueryElementsCache.$container = $view.find(presenter.cssClasses.container.getSelector());
        presenter.jQueryElementsCache.$fixedContainer = $view.find(presenter.cssClasses.fixedContainer.getSelector());
        presenter.jQueryElementsCache.$view = $view;
    };

    presenter.run = function (view, model) {
        presenter.configuration.view = view;
        // container is the div that will be draggable and resizable
        presenter.configuration.container = view.getElementsByClassName(presenter.cssClasses.container.getName())[0];
        presenter.initJQueryCache($(view));

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
        var $view = presenter.jQueryElementsCache.$view;
        var $container = presenter.jQueryElementsCache.$container;
        var hasHtml = presenter.configuration.hasHtml;
        var textareaId = presenter.configuration.textareaId;
        var title = presenter.configuration.model.title;
        var headerStyle = presenter.configuration.model.headerStyle;
        var $header = $container.find(".header");
        var $headerText = $container.find(".header-text");
        var disableResizeHeight = presenter.configuration.model.disableResizeHeight;

        $headerText.text(title);
        $header.addClass(headerStyle);
        if (presenter.configuration.model.isTextEditorContent) {
            presenter.handleTextContent();
            presenter.configuration.hasVideo = false;
            presenter.configuration.hasAudio = false;
            presenter.configuration.hasHtml = false;
        }

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
        } else if (!presenter.configuration.model.isTextEditorContent) {
            $view.find(".content-iframe").remove();
            $view.find("textarea").remove();
        }

        $container.css("z-index", "1");

        if (disableResizeHeight) {
            var moduleHeight = presenter.configuration.model.height;
            presenter.configuration.minHeight = moduleHeight;
            presenter.configuration.maxHeight = moduleHeight;
        }

        // containment option disallows moving window outside of specified dom element
        $container.draggable({
            cancel: 'video, audio',
            start: function (event, ui) {
                presenter.show();
                presenter.updateScaleInfo();

                ui.helper.css('position', 'absolute'); // it removes mini jump on the beginning of dragging
                ui.position.top = ui.offset.top / presenter.temporaryState.scaleInfo.scaleX;
                ui.position.let = ui.offset.left / presenter.temporaryState.scaleInfo.scaleY;
            },
            drag: presenter.updateMenuPosition,
            stop: presenter.updateMenuPosition
        });

        $container.resizable({
            minHeight: presenter.configuration.minHeight,
            maxHeight: presenter.configuration.maxHeight,
            minWidth: presenter.configuration.minWidth,
            maxWidth: presenter.configuration.maxWidth,
            resize: function (event, ui) {
                presenter.updateButtonMenuPosition();
                if (hasHtml || presenter.configuration.model.isTextEditorContent) {
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
                presenter.updateButtonMenuPosition();
                if (hasHtml) {
                    $container.find("iframe").css("visibility", "visible")
                }
            }
        });

        presenter.addHandlers($view);
        presenter.buildKeyboardController();
        presenter.setUpKeyboardNavigationStyling();
        presenter.setSpeechTexts(presenter.configuration.model.speechTexts);
    };

    presenter.updateScaleInfo = function AddonEditableWindow_getScaleInfo() {
        presenter.temporaryState.scaleInfo = presenter.configuration.playerController.getScaleInformation();
    };

    /**
     * @param event
     * @param ui
     * @param ui.helper
     * @param ui.position
     * @param ui.position.top
     * @param ui.position.left
     * @param ui.offset
     */
    presenter.updateMenuPosition = function AddonEditableWindow_updateMenuPosition(event, ui) {
        ui.position.top = ui.position.top / presenter.temporaryState.scaleInfo.scaleX;
        ui.position.left = ui.position.left / presenter.temporaryState.scaleInfo.scaleY;

        presenter.updateButtonMenuPosition();
    };

    // because draggable prevents event bubbling, button wasn't clickable on android
    // menu with buttons is now outside of draggable container and its position needs to be updated when container changes position or size
    presenter.updateButtonMenuPosition = function () {
        // selector needs to be scoped to addon id, otherwise if more than one addon were added to lesson then it wouldn't properly position $buttonMenu
        var $buttonParent = $('#' + presenter.configuration.model.id + ' ' + presenter.cssClasses.container.getSelector());
        var $buttonMenu = presenter.jQueryElementsCache.$buttonMenu;

        // icons are positioned by setting right and top css values, so div which wraps icons must be placed in top right corner of menu
        var rightWindowBorder = parseInt($buttonParent.css('left'), 10) + $buttonParent.width();
        var topWindowBorder = parseInt($buttonParent.css('top'), 10);

        $buttonMenu.css({
            top: topWindowBorder,
            left: rightWindowBorder
        });
    };

    presenter.addHandlers = function ($view) {
        $view.find(presenter.cssClasses.closeButton.getSelector()).click(presenter.closeButtonClickedCallback);
        $view.find(presenter.cssClasses.fullScreenButton.getSelector()).click(presenter.fullScreenButtonClickedCallback);
        $view.find(presenter.cssClasses.wrapper.getSelector()).click(presenter.viewClickedCallback);

        // scaling will break fixed positioning, but mobile views aren't placed in iframe so, player won't be updating scroll position
        if (MobileUtils.isMobileUserAgent(window.navigator.userAgent)) {
           window.addEventListener('scroll', presenter.handleScroll);
        }
    };

    presenter.viewClickedCallback = function () {
        presenter.show();
    };

    presenter.closeButtonClickedCallback = function () {
        if (presenter.temporaryState.isFullScreen) {
            var $view = presenter.jQueryElementsCache.$container;

            presenter.closeFullScreen($view);
        }

        presenter.hide();
    };

    presenter.fullScreenButtonClickedCallback = function () {
        var $view = presenter.jQueryElementsCache.$container;

        if (presenter.temporaryState.isFullScreen) {
            presenter.closeFullScreen($view);
        } else {
            presenter.openFullScreen($view);
        }

        presenter.updateButtonMenuPosition();
    };

    presenter.openFullScreen = function ($view) {
        presenter.updateScaleInfo();
        // so height of the window will take whole available space
        var height = (window.iframeSize.windowInnerHeight || window.innerHeight) / presenter.temporaryState.scaleInfo.scaleY;
        var width = window.innerWidth / presenter.temporaryState.scaleInfo.scaleX;

        presenter.temporaryState.isFullScreen = true;

        presenter.saveViewPropertiesToState($view);
        $view.height(height);
        $view.width(width);
        presenter.addFullScreenClasses($view);

        presenter.updateFullScreenWindowTop();
        presenter.resizeTinyMce($view.width(), height);
    };

    presenter.closeFullScreen = function ($view) {
        presenter.temporaryState.isFullScreen = false;

        presenter.setViewPropertiesFromState($view);
        presenter.removeFullScreenClasses($view);
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

    presenter.addFullScreenClasses = function ($view) {
        presenter.jQueryElementsCache.$fixedContainer.addClass(presenter.cssClasses.containerFullScreen.getName());
        presenter.jQueryElementsCache.$fullscreenButton.removeClass(presenter.cssClasses.openFullScreenButton.getName());
        presenter.jQueryElementsCache.$fullscreenButton.addClass(presenter.cssClasses.closeFullScreenButton.getName());
        $view.addClass(presenter.cssClasses.containerFullScreen.getName());

        $view.resizable('disable');
        $view.draggable('disable');
    };

    presenter.removeFullScreenClasses = function ($view) {
        presenter.jQueryElementsCache.$fixedContainer.removeClass(presenter.cssClasses.containerFullScreen.getName());
        presenter.jQueryElementsCache.$fullscreenButton.removeClass(presenter.cssClasses.closeFullScreenButton.getName());
        presenter.jQueryElementsCache.$fullscreenButton.addClass(presenter.cssClasses.openFullScreenButton.getName());

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
        var $view = presenter.jQueryElementsCache.$container;
        var top = presenter.temporaryState.scrollTop;
        var properties = {
            top: top
        };

        // this is needed when embedding page has header and iFrame is not at the top of the page
        if (top > presenter.temporaryState.iFrameOffset && presenter.temporaryState.scaleInfo.scaleY === 1.0) {
            properties.top = (top - presenter.temporaryState.iFrameOffset) + 'px';
        }

        // on android scroll down/up can hide/show navbar which adds/subtracts available height
        if (MobileUtils.isMobileUserAgent(window.navigator.userAgent)) {
            properties.height = (window.iframeSize.windowInnerHeight || window.innerHeight) / presenter.temporaryState.scaleInfo.scaleY;
        }

        $view.css(properties);
        presenter.updateButtonMenuPosition();
    };

    presenter.handleVideoContent = function () {
        var $view = $(presenter.configuration.view);
        if (window.navigator.onLine || presenter.configuration.model.videoFile.indexOf("file:/") == 0) {
            var audioSource = presenter.configuration.model.videoFile;
            var $videoElement = $view.find("video");
            $videoElement.attr("src", audioSource);
            Object.defineProperty($videoElement[0], 'isPlaying', {
                get: function() {
                    return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
                }
            });
        } else {
            presenter.configuration.hasVideo = false;
            var $wrapper = $view.find('.offline-video-message');
            $wrapper.html(presenter.configuration.model.offlineMessage);
            $wrapper.css("display", "block");
        }
    };

    presenter.handleAudioContent = function () {
        var $view = $(presenter.configuration.view);
        var $container = presenter.jQueryElementsCache.$container;
        var audioSource = presenter.configuration.model.audioFile;
        var $audioElement = $view.find("audio");
        $audioElement.attr("src", audioSource);
        Object.defineProperty($audioElement[0], 'isPlaying', {
            get: function() {
                return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
            }
        });
        presenter.configuration.heightOffset += 35;
    };

    presenter.handleTextContent = function () {
        var height = presenter.configuration.model.height - presenter.configuration.heightOffset;
        var width = presenter.configuration.model.width - presenter.configuration.widthOffset;
        var textareaId = presenter.configuration.textareaId;
        var $view = $(presenter.configuration.view);
        $view.css("z-index", "1");

        var textarea = $view.find("textarea");
        textarea.attr("id", textareaId);

        presenter.createTinyMceAsync(textareaId, height, width);

        presenter.fillActiveTinyMce(presenter.configuration.model.textEditor, function (content) {
            setTextAreaInnerHTML(textareaId, content);

            presenter.configuration.iframeContent = content;
            $view.find(".addon-editable-reset-button").click(function () {
                    presenter.reset();
            });
        });
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

        presenter.createTinyMceAsync(textareaId, height - heightOffset, width - widthOffset);

        var timeout = setTimeout(function () {
            presenter.fetchIframeContent(function (content) {
                var isInitialized = presenter.configuration.state.isInitialized;
                if (!isInitialized) {
                    presenter.configuration.contentLoadingLock = true;
                    presenter.fillActiveTinyMce(content, presenter.fillTinyMce);
                    presenter.configuration.state.isInitialized = true;
                    presenter.configuration.state.content = content;
                    presenter.configuration.contentLoadingLock = false;
                }
                presenter.removeIframe();
            });
        }, 3000);
        presenter.configuration.timeouts.push(timeout);
    };

    presenter.createTinyMceAsync = function (areaId, height, width) {
        tinymce.init({
            selector: "#" + areaId,
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
            height: height,
            width: width,
            setup: function (editor) {
                if (!presenter.configuration.model.editingEnabled) {
                    editor.on('keydown keypress keyup', function (e) {
                        e.preventDefault();
                    });
                }
            },
            readonly: !presenter.configuration.model.editingEnabled
        }).then(function (editors) {
            presenter.configuration.editor = editors[0];
            presenter.configuration.isTinyMceLoaded = true;
        });
    }

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
            presenter.fillActiveTinyMce(content, presenter.fillTinyMce);
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
        var upgradedModel = presenter.addDisableResizeHeight(model);
        upgradedModel = presenter.addOfflineMessage(upgradedModel);
        upgradedModel = presenter.addIsTextEditorContent(upgradedModel);
        upgradedModel = presenter.upgradeLangTag(upgradedModel);
        return presenter.upgradeSpeechTexts(upgradedModel);
    };

    presenter.addDisableResizeHeight = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!model['disableResizeHeight']) {
            upgradedModel['disableResizeHeight'] = "False";
        }

        return upgradedModel;
    };

    presenter.addOfflineMessage = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!model['offlineMessage']) {
            upgradedModel['offlineMessage'] = "This video is not available offline. Please connect to the Internet to watch it.";
        }

        return upgradedModel;
    };

    presenter.addIsTextEditorContent = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!model['isTextEditorContent']) {
            upgradedModel['isTextEditorContent'] = "False";
        }

        return upgradedModel;
    };

    presenter.upgradeLangTag = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!model['langAttribute']) {
            upgradedModel['langAttribute'] = "";
        }

        return upgradedModel;
    };

    presenter.upgradeSpeechTexts = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!model['speechTexts']) {
             upgradedModel['speechTexts'] = {
                openFullscreen: {openFullscreen: ""},
                closeFullscreen: {closeFullscreen: ""},
                closeWindow: {closeWindow: ""},
                textTool: {textTool: ""},
                highlightSelect: {highlightSelect: ""},
                pickAColor: {pickAColor: ""},
                yellow: {yellow: ""},
                blue: {blue: ""},
                red: {red: ""},
                green: {green: ""},
                white: {white: ""},
                noColor: {noColor: ""},
                reset: {reset: ""},
                image: {image: ""},
                audio: {audio: ""},
                video: {video: ""}
             };
        }

        return upgradedModel;
    };

    presenter.validModel = function (model) {
        var indexFile = model['index'];
        var audioFile = model['audio'];
        var videoFile = model['video'];
        var text = model['textEditor'];

        var isTextEditorContent = ModelValidationUtils.validateBoolean(model['isTextEditorContent']);
        var textEmpty = !isTextEditorContent || text === "";

        if (textEmpty && indexFile === "" && audioFile === "" && videoFile === "") {
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
            disableResizeHeight: ModelValidationUtils.validateBoolean(model["disableResizeHeight"]),
            offlineMessage: model["offlineMessage"],
            textEditor: model['textEditor'],
            isTextEditorContent: isTextEditorContent,
            speechTexts: model['speechTexts'],
            langAttribute: model['langAttribute']
        }
    };

    presenter.setSpeechTexts = function EditableWindow_setSpeechTexts (speechTexts) {
        presenter.speechTexts = {
            openFullscreen: presenter.DEFAULT_TTS_PHRASES.openFullscreen,
            closeFullscreen: presenter.DEFAULT_TTS_PHRASES.closeFullscreen,
            closeWindow: presenter.DEFAULT_TTS_PHRASES.closeWindow,
            textTool: presenter.DEFAULT_TTS_PHRASES.textTool,
            highlightSelect: presenter.DEFAULT_TTS_PHRASES.highlightSelect,
            pickAColor: presenter.DEFAULT_TTS_PHRASES.pickAColor,
            yellow: presenter.DEFAULT_TTS_PHRASES.yellow,
            blue: presenter.DEFAULT_TTS_PHRASES.blue,
            red: presenter.DEFAULT_TTS_PHRASES.red,
            green: presenter.DEFAULT_TTS_PHRASES.green,
            white: presenter.DEFAULT_TTS_PHRASES.white,
            noColor: presenter.DEFAULT_TTS_PHRASES.noColor,
            reset: presenter.DEFAULT_TTS_PHRASES.reset,
            image: presenter.DEFAULT_TTS_PHRASES.image,
            audio: presenter.DEFAULT_TTS_PHRASES.audio,
            video: presenter.DEFAULT_TTS_PHRASES.video
        };

        if (!speechTexts || $.isEmptyObject(speechTexts)) {
            return;
        }

        presenter.speechTexts = {
            openFullscreen: TTSUtils.getSpeechTextProperty(
                speechTexts.openFullscreen.openFullscreen,
                presenter.speechTexts.openFullscreen),
            closeFullscreen: TTSUtils.getSpeechTextProperty(
                speechTexts.closeFullscreen.closeFullscreen,
                presenter.speechTexts.closeFullscreen),
            closeWindow: TTSUtils.getSpeechTextProperty(
                speechTexts.closeWindow.closeWindow,
                presenter.speechTexts.closeWindow),
            textTool: TTSUtils.getSpeechTextProperty(
                speechTexts.textTool.textTool,
                presenter.speechTexts.textTool),
            highlightSelect: TTSUtils.getSpeechTextProperty(
                speechTexts.highlightSelect.highlightSelect,
                presenter.speechTexts.highlightSelect),
            pickAColor: TTSUtils.getSpeechTextProperty(
                speechTexts.pickAColor.pickAColor,
                presenter.speechTexts.pickAColor),
            yellow: TTSUtils.getSpeechTextProperty(
                speechTexts.yellow.yellow,
                presenter.speechTexts.yellow),
            blue: TTSUtils.getSpeechTextProperty(
                speechTexts.blue.blue,
                presenter.speechTexts.blue),
            red: TTSUtils.getSpeechTextProperty(
                speechTexts.red.red,
                presenter.speechTexts.red),
            green: TTSUtils.getSpeechTextProperty(
                speechTexts.green.green,
                presenter.speechTexts.green),
            white: TTSUtils.getSpeechTextProperty(
                speechTexts.white.white,
                presenter.speechTexts.white),
            noColor: TTSUtils.getSpeechTextProperty(
                speechTexts.noColor.noColor,
                presenter.speechTexts.noColor),
            reset: TTSUtils.getSpeechTextProperty(
                speechTexts.reset.reset,
                presenter.speechTexts.reset),
            image: TTSUtils.getSpeechTextProperty(
                speechTexts.image.image,
                presenter.speechTexts.image),
            audio: TTSUtils.getSpeechTextProperty(
                speechTexts.audio.audio,
                presenter.speechTexts.audio),
            video: TTSUtils.getSpeechTextProperty(
                speechTexts.video.video,
                presenter.speechTexts.video)
        };
    };

    presenter.generateValidationError = function (message) {
        return {
            isValid: false,
            errorMessage: message
        }
    };

    presenter.fetchIframeContent = function (callback) {
        var $view = presenter.jQueryElementsCache.$view;
        var isIframeLoaded = presenter.configuration.isIframeLoaded;

        if (isIframeLoaded) {
            var content = $view.find(".content-iframe").contents().find("body").html();
            if (content == null || content == "") {
                var timeout = setTimeout(function () {
                    presenter.fetchIframeContent(callback);
                }, 1000);
                presenter.configuration.timeouts.push(timeout);
            } else {
                presenter.configuration.iframeContent = content;
                callback(content);

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

    presenter.fillActiveTinyMce = function (content, fillCallback) {
        var isTinyMceLoaded = presenter.configuration.isTinyMceLoaded;

        if (isTinyMceLoaded) {
            var timeout = setTimeout(function () {
                fillCallback.apply(null, [content]);
            }, 1000);

            presenter.configuration.timeouts.push(timeout);
        } else {
            var timeout = setTimeout(function () {
                presenter.fillActiveTinyMce(content, fillCallback);
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

        var newContent = documentContent.getElementsByTagName("body")[0].innerHTML;
        setTextAreaInnerHTML(textareaId, newContent);

        presenter.getStyles();


        presenter.linkAnchors();

        presenter.configuration.isTinyMceFilled = true;
    };

    function setTextAreaInnerHTML(textareaId, content) {
        tinymce.get(textareaId).getBody().innerHTML = presenter.textParser.parse(content);
    }

    presenter.getStyles = function() {
        var indexUrl = presenter.configuration.model.indexFile;
        $.get(indexUrl).then(
            presenter.gettingIndexSuccess,
            presenter.gettingIndexError
        );
    };

    presenter.gettingIndexSuccess = function(html) {
        var headContent = new DOMParser().parseFromString(html, 'text/html');
        var styles = [];

        presenter.configuration.model.fileList.forEach(function (entity) {
            var node = headContent.getElementById(entity.id);

            if (node !== null && node !== undefined && node.rel === 'stylesheet') {
                   styles.push(entity.file);
            }
        });

        presenter.addStyles(styles);
    };

    presenter.gettingIndexError = function() {
        console.error("Couldn't load index of document");
    };

    presenter.addStyles = function(styles) {
        var tinymceEditorHead = tinymce.get(presenter.configuration.textareaId).contentDocument.head;
        styles.forEach(function(styleFile) {
            var link = document.createElement("link");
            link.href = styleFile;
            link.type = 'text/css';
            link.rel = 'stylesheet';
            tinymceEditorHead.appendChild(link);
        });
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
        var $view = presenter.jQueryElementsCache.$container;
        var width = $view.width();
        var availableWidth = presenter.getAvailableWidth();

        var scrollY = presenter.temporaryState.scrollTop;
        if (scrollY == 0 && presenter.configuration.playerController) {
            scrollY = presenter.configuration.playerController.iframeScroll();
        }

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

    presenter.setPositionRelative = function () {
        var $view = presenter.jQueryElementsCache.$container;
        var top = parseInt(presenter.configuration.model.top) + presenter.configuration.heightOffset;
        var left = presenter.configuration.model.left;

        $view.css({
            top: top + 'px',
            left: left + 'px',
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
        presenter.disableWCAGIfTTSOrKeyboardNav();
        presenter.configuration.isVisible = false;
        $(presenter.configuration.view).hide();
        presenter.stopAudio();
        presenter.stopVideo();

        var eventBus = presenter.configuration.eventBus;
        var id = presenter.configuration.model.id;
        eventBus.sendEvent('ValueChanged', {
            'source': id,
            'item': '',
            'value': 'close',
            'score': ''
        });
    };

    presenter.disableWCAGIfTTSOrKeyboardNav = function EditableWindow_disableWCAGIfTTSOrKeyboardNav() {
        const $element = $($(presenter.configuration.view).find(".addon_EditableWindow").context);
        if ($element.hasClass(presenter.cssClasses.selectedModule.getName()) || $element.hasClass(presenter.cssClasses.activeModule.getName())) {
            presenter.dispatchEscapeKeydownEvent();
            presenter.dispatchShiftTabKeydownEvent();
            const realElement = $(presenter.configuration.view).find(presenter.cssClasses.wrapper.getSelector());
            $(realElement[0]).removeClass(presenter.cssClasses.selectedModuleFake.getName());
            $(realElement[0]).removeClass(presenter.cssClasses.activeModuleFake.getName());
        }
    };

    presenter.dispatchEscapeKeydownEvent = function EidtableWindow_dispatchEscapeKeydownEvent () {
        const event = new KeyboardEvent('keydown', {
            code: 'Esc',
            key: 'Esc',
            charCode: 27,
            keyCode: 27,
            bubbles: true
        });
        //document.body is used instead of document, because in KeyboardNavigationController listeners are set to RootPanel, which is document.body
        document.body.dispatchEvent(event);
    };

    presenter.dispatchShiftTabKeydownEvent = function EditableWindow_dispatchShiftTabKeydownEvent () {
        const event = new KeyboardEvent('keydown', {
            code: 'Tab',
            key: 'Tab',
            charCode: 9,
            keyCode: 9,
            bubbles: true,
            shiftKey: true
        });
        //document.body is used instead of document, because in KeyboardNavigationController listeners are set to RootPanel, which is document.body
        document.body.dispatchEvent(event);
    };

    presenter.isVisible = function () {
        return presenter.configuration.isVisible;
    };

    presenter.setPlayerController = function (controller) {
        presenter.configuration.playerController = controller;
        presenter.textParser = new TextParserProxy(controller.getTextParser());

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

    presenter.handleScroll = function() {
        presenter.updateScaleInfo();
        var scale = presenter.temporaryState.scaleInfo.scaleY;

        if (presenter.temporaryState.scaleInfo.scaleY !== 1) {
            presenter.updateScrollTop(window.pageYOffset / scale);
        }
    };

    presenter.handleScrollEvent = function (eventData) {
        var scrollValue = parseInt(eventData.value, 10);

        presenter.updateScrollTop(scrollValue);
    };

    presenter.updateScrollTop = function(value) {
        presenter.temporaryState.scrollTop = value ;

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

    presenter.pauseOrPlayElement = function EditableWindow_pauseOrPlayElement(element) {
        if(!element.hasOwnProperty('isPlaying')) {
            console.error("EditableWindow_pauseOrPlayElement - element does not have isPlaying property!");
            return;
        }

        if(element.isPlaying) {
            element.pause();
        } else {
            element.play();
        }
    };

    presenter.pauseOrPlayAudio = function EditableWindow_pauseOrPlayAudio() {
        var $view = $(presenter.configuration.view);
        var audio = $view.find("audio")[0];
        presenter.pauseOrPlayElement(audio);
    };

    presenter.pauseOrPlayVideo = function EditableWindow_pauseOrPlayVideo() {
        var $view = $(presenter.configuration.view);
        var video = $view.find("video")[0];
        presenter.pauseOrPlayElement(video);
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

    presenter.onDestroy = function () {
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
        presenter.configuration.container = null;
        presenter.configuration = null;
        presenter.jQueryElementsCache = null;
    };

    presenter.removeCallbacks = function () {
        var $view = $(presenter.configuration.view);
        $view.off('click', presenter.cssClasses.closeButton.getSelector(), presenter.closeButtonClickedCallback);
        $view.off('click', presenter.cssClasses.fullScreenButton.getSelector(), presenter.fullScreenButtonClickedCallback);
        $view.off('click', presenter.cssClasses.wrapper.getSelector(), presenter.viewClickedCallback);

        window.removeEventListener('scroll', presenter.handleScroll);
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
        fixedContainer: new presenter.CssClass("addon-editable-window-fixed-container"),
        container: new presenter.CssClass("addon-editable-window-container"),
        containerFullScreen: new presenter.CssClass("addon-editable-window-container-full-screen"),
        closeButton: new presenter.CssClass("addon-editable-close-button"),
        fullScreenButton: new presenter.CssClass("addon-editable-full-screen-button"),
        openFullScreenButton: new presenter.CssClass("addon-editable-open-full-screen-button"),
        closeFullScreenButton: new presenter.CssClass("addon-editable-close-full-screen-button"),
        wrapper: new presenter.CssClass("addon-editable-window-wrapper"),
        buttonMenu: new presenter.CssClass("addon-editable-buttons-menu"),
        selectedModule: new presenter.CssClass("ic_selected_module"),
        activeModule: new presenter.CssClass("ic_active_module"),
        selectedModuleFake: new presenter.CssClass("selected_module_fake"),
        activeModuleFake: new presenter.CssClass("active_module_fake"),
    };

    function EditableWindowKeyboardController (elements, columnsCount) {
        KeyboardController.call(this, elements, columnsCount);
    };

    EditableWindowKeyboardController.prototype = Object.create(window.KeyboardController.prototype);
    EditableWindowKeyboardController.prototype.constructor = EditableWindowKeyboardController;

    presenter.buildKeyboardController = function EditableWindow_buildKeyboardController () {
        presenter.keyboardControllerObject = new EditableWindowKeyboardController(presenter.getElementsForKeyboardNavigation(), 1);
    };

    presenter.setUpKeyboardNavigationStyling = function EditableWindow_setUpKeyboardNavigationStyling () {
        var element = $(presenter.configuration.view).find(".addon_EditableWindow");
        var $element = $(element.context);
        var oldStyles = $element.attr("style") || "";
        var newStyles = oldStyles + " outline: none !important; box-shadow: none !important";
        $element.attr('style', newStyles);
    };

    /**
     * Method to select or activate module.
     * This method is executed by class KeyboardNavigationController.
     *
     * @param className CSS class name to add to the view
     *
     * @return undefined
     */
    presenter.selectAsActive = function (className) {
        const view = presenter.configuration.view;
        const windowWrapper = $(view).find(presenter.cssClasses.wrapper.getSelector())[0];

        view.classList.add(className);
        if (className === presenter.cssClasses.selectedModule.getName()) {
            windowWrapper.classList.add(presenter.cssClasses.selectedModuleFake.getName());
            if (!presenter.isWCAGOn) {
                windowWrapper.focus();
            }
        }
        if (className === presenter.cssClasses.activeModule.getName()) {
            windowWrapper.classList.add(presenter.cssClasses.activeModuleFake.getName());
        }
    }

    /**
     * Method to deselect or deactivate module.
     * This method is executed by class KeyboardNavigationController.
     *
     * @param className CSS class name to remove from the view
     *
     * @return undefined
     */
    presenter.deselectAsActive = function (className) {
        const view = presenter.configuration.view;
        const windowWrapper = $(view).find(presenter.cssClasses.wrapper.getSelector())[0];

        view.classList.remove(className);
        if (className === presenter.cssClasses.selectedModule.getName()) {
            windowWrapper.classList.remove(presenter.cssClasses.selectedModuleFake.getName());
            if (!presenter.isWCAGOn) {
                windowWrapper.blur();
            }
        }
        if (className === presenter.cssClasses.activeModule.getName()) {
            windowWrapper.classList.remove(presenter.cssClasses.activeModuleFake.getName());
        }
    }

    presenter.getElementsForKeyboardNavigation = function EditableWindow_getElementsForKeyboardNavigation() {
        let fullscreenElement = $(presenter.configuration.view).find(".addon-editable-full-screen-button");
        let elements = $(presenter.configuration.view).find(".addon-editable-close-button, .mce-btn, .mce-edit-area, .addon-editable-reset-button, .video-wrapper, audio");
        return $.merge(fullscreenElement, elements);
    };

    presenter.keyboardController = function EditableWindow_keyboardController (keycode, isShiftKeyDown, event) {
        presenter.keyboardControllerObject.handle(keycode, isShiftKeyDown, event);
    };

    EditableWindowKeyboardController.prototype.getTarget = function (element) {
        return $(element);
    };

    EditableWindowKeyboardController.prototype.switchElement = function (move) {
        KeyboardController.prototype.switchElement.call(this, move);
        this.readCurrentElement();
    };

    EditableWindowKeyboardController.prototype.switchToFirstVisibleElement = function () {
        for(let i=0; i<this.keyboardNavigationElementsLen; i++) {
            const element = this.keyboardNavigationElements[i];
            if(this.isElementHidden(element)) {
                this.lastVisibleElementIndex = i;
                this.keyboardNavigationCurrentElementIndex = i;
                this.keyboardNavigationCurrentElement = element;
                this.mark(element);
                return;
            }
        }
    };

    EditableWindowKeyboardController.prototype.nextElement = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.switchElement(1);

        if(this.isElementHidden(this.getCurrentElement())) {
            this.nextElement(event);
        }
    };

    EditableWindowKeyboardController.prototype.previousElement = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.switchElement(-1);

        if(this.isElementHidden(this.getCurrentElement())) {
            this.previousElement(event);
        }
    };

    EditableWindowKeyboardController.prototype.isElementHidden = function (element) {
        const elementHeight = element[0].offsetHeight;
        const elementWidth = element[0].offsetWidth;
        const isDisplayed = $(element).css('display') !== 'none';
        const isVisible = $(element).css('visibility') === 'visible';

        return elementHeight === 0 || elementWidth === 0 || !isDisplayed || !isVisible;
    };

    EditableWindowKeyboardController.prototype.getCurrentElement = function () {
		return this.getTarget(this.keyboardNavigationCurrentElement, false);
	};

    EditableWindowKeyboardController.prototype.enter = function EditableWindow_enter (event) {
        KeyboardController.prototype.enter.call(this, event);
        if(this.keyboardNavigationCurrentElementIndex === 0) {
            KeyboardController.prototype.setElements.call(this, presenter.getElementsForKeyboardNavigation());
        }
        this.readCurrentElement();
    };

    EditableWindowKeyboardController.prototype.setElements = function EditableWindow_setElements (elements) {
        KeyboardController.prototype.setElements.call(this, elements);

        if (this.keyboardNavigationActive) {
            this.switchToFirstVisibleElement();
        }
    }

    EditableWindowKeyboardController.prototype.select = function EditableWindow_select (event) {
        const element = this.getTarget(this.keyboardNavigationCurrentElement);
        if ($(element).hasClass("mce-btn") && presenter.configuration.model.editingEnabled) {
            presenter.isKeyboardNavDeactivationBlocked = true;
            KeyboardController.prototype.setElements.call(this, presenter.getMceBtnElements());
            document.activeElement.blur();
            this.readCurrentElement();
        } else if(presenter.isColorHighlightElement()) {
            element[0].click();
            document.activeElement.blur();
        } else if(presenter.isColorPickElement()) {
            presenter.closeAllColorPickPanels();
            element[0].click();
            KeyboardController.prototype.setElements.call(this, presenter.getColorPaletteElements());
            this.readCurrentElement();
        } else if(presenter.isInsideColorPick()) {
            element[0].childNodes[0].click();
            document.activeElement.blur();
            KeyboardController.prototype.setElements.call(this, presenter.getMceBtnElements());
            KeyboardController.prototype.markCurrentElement.call(this, 1);
            this.readCurrentElement();
        } else if(element.hasClass("mce-edit-area") && presenter.configuration.model.editingEnabled) {
            presenter.configuration.editor.execCommand('mceCodeEditor');
        } else if(element.hasClass("mce-edit-area") && !presenter.configuration.model.editingEnabled) {
            presenter.handleEditAreaScrolling(element);
        } else if(element.hasClass("addon-editable-close-button")) {
            element.click();
        } else if(element[0].nodeName === "AUDIO") {
            presenter.pauseOrPlayAudio();
        } else if(element.hasClass("video-wrapper")) {
            presenter.pauseOrPlayVideo();
        } else {
            element.click();
        }
    };

    EditableWindowKeyboardController.prototype.escape = function (event) {
        if (presenter.isInsideColorPick()) {
            KeyboardController.prototype.setElements.call(this, presenter.getMceBtnElements());
            KeyboardController.prototype.markCurrentElement.call(this, 1);
            this.getTarget(this.keyboardNavigationCurrentElement)[0].click();
            this.readCurrentElement();
        } else if (presenter.isInsideMceBtn()) {
            KeyboardController.prototype.setElements.call(this, presenter.getElementsForKeyboardNavigation());
            KeyboardController.prototype.markCurrentElement.call(this, 2);
            this.readCurrentElement();
        } else if (presenter.isEditAreaInScrollableMode) {
            presenter.escapeEditAreaScrollableMode();
        } else {
            presenter.isKeyboardNavDeactivationBlocked = false;
            KeyboardController.prototype.escape.call(this, event);
        }
    };

    presenter.getMceBtnElements = function EditableWindow_getMceBtnElements() {
        return $(presenter.configuration.view).find(".mce-btn")[0].childNodes;
    };

    presenter.getColorPaletteElements = function EditableWindow_getColorPaletteElements() {
        return $(".mce-floatpanel:visible").find(".mce-grid-cell");
    };

    presenter.closeAllColorPickPanels = function EditableWindow_closeAllColorPickPanels() {
        $(".mce-colorbutton.mce-active").each(function () {
            const element = $(this);
            element[0].childNodes[1].click();
        });
    };

    presenter.isInsideMceBtn = function EditableWindow_isInsideMceBtn() {
        return presenter.keyboardControllerObject.keyboardNavigationElements.length === 2;
    };

    presenter.isColorHighlightElement = function EditableWindow_isColorHighlightElement() {
        return presenter.isInsideMceBtn() &&
            presenter.keyboardControllerObject.keyboardNavigationCurrentElement === presenter.keyboardControllerObject.keyboardNavigationElements[0];
    };

    presenter.isColorPickElement = function EditableWindow_isColorPickElement() {
          return presenter.isInsideMceBtn() &&
            presenter.keyboardControllerObject.keyboardNavigationCurrentElement === presenter.keyboardControllerObject.keyboardNavigationElements[1];
    };

    presenter.isInsideColorPick = function EditableWindow_isInsideColorPick() {
        return presenter.keyboardControllerObject.keyboardNavigationElements.length === 6 &&
            $(presenter.keyboardControllerObject.getTarget(presenter.keyboardControllerObject.keyboardNavigationCurrentElement)).hasClass("mce-grid-cell");
    };

    presenter.isDeactivationBlocked = function EditableWindow_isDeactivationBlocked() {
        return presenter.isKeyboardNavDeactivationBlocked;
    };

    presenter.handleEditAreaScrolling = function EditableWindow_handleEditAreaScrolling (element) {
        const editorIframe = element[0].childNodes[0];
        const content = (editorIframe.contentDocument || editorIframe.contentWindow.document).documentElement;
        if (!isContentScrollable(content)) {
            return;
        };

        presenter.isKeyboardNavDeactivationBlocked = true;
        presenter.isEditAreaInScrollableMode = true;
        presenter.keyboardControllerObject.setElements($(presenter.configuration.view).find(".mce-edit-area"));
        presenter.overrideKeyUpAndDownHandlers(content);
    };

    function isContentScrollable(content) {
        return content.scrollHeight > content.clientHeight;
    };

    presenter.overrideKeyUpAndDownHandlers = function EditableWindow_overrideKeyUpAndDownHandlers(content) {
        this.keyboardControllerObject.mapping[presenter.keys.ARROW_UP] = function () {content.scrollTop -= 10; };
        this.keyboardControllerObject.mapping[presenter.keys.ARROW_DOWN] = function () {content.scrollTop += 10; };
    };

    presenter.restoreDefualtKeyUpAndDownHandlers = function EditableWindow_restoreDefualtKeyUpAndDownHandlers () {
        this.keyboardControllerObject.mapping[presenter.keys.ARROW_UP] = this.keyboardControllerObject.previousRow;
        this.keyboardControllerObject.mapping[presenter.keys.ARROW_DOWN] = this.keyboardControllerObject.nextRow;
    };

    presenter.escapeEditAreaScrollableMode = function EditableWindow_escapeEditAreaScrollableMode () {
        this.keyboardControllerObject.setElements(presenter.getElementsForKeyboardNavigation());
        this.keyboardControllerObject.markCurrentElement(3);
        presenter.isEditAreaInScrollableMode = false;
        presenter.restoreDefualtKeyUpAndDownHandlers();
    };
    
    EditableWindowKeyboardController.prototype.readCurrentElement = function () {
        let text = "";
        const element = this.getTarget(this.keyboardNavigationCurrentElement);

        if (element.hasClass("addon-editable-open-full-screen-button")) {
            text = presenter.speechTexts.openFullscreen;
        } else if(element.hasClass("addon-editable-close-full-screen-button")) {
            text = presenter.speechTexts.closeFullscreen;
        } else if(element.hasClass("addon-editable-close-button")) {
            text = presenter.speechTexts.closeWindow;
        } else if(element.hasClass("mce-btn")) {
            text = presenter.speechTexts.textTool;
        } else if(presenter.isColorHighlightElement()) {
            text = presenter.speechTexts.highlightSelect;
        } else if(presenter.isColorPickElement()) {
            text = presenter.speechTexts.pickAColor;
        } else if(presenter.isInsideColorPick()) {
            const key = presenter.getTTSKeyBasedOnColor(element);
            text = presenter.speechTexts[key];
        } else if(element.hasClass("mce-edit-area")) {
            text = presenter.getContentToRead();
        } else if(element.hasClass("addon-editable-reset-button")) {
            text = presenter.speechTexts.reset;
        } else if(element[0].nodeName === "AUDIO") {
            text = presenter.speechTexts.audio;
        } else if(element.hasClass("video-wrapper")) {
            text = presenter.speechTexts.video;
        }

        presenter.speak(text);
    };

    //images are temporarily replaced with it's alt text wrapped in paragraph in purpose to getContent with text- this allows to avoid manual parsing HTML
    //after all, originalContent is being restored to editor
    presenter.getContentToRead = function EditableWindow_getContentToRead () {
        const rawHTMLContent = presenter.configuration.editor.getContent({format : 'raw'});
        const regex = /<img .*?alt="(.*?)".*?>/gm;
        const contentWithoutImages = rawHTMLContent.replace(regex, `<p>${presenter.speechTexts.image} $1</p>`);
        const sanitizedContent = window.xssUtils.sanitize(contentWithoutImages);
        return window.TTSUtils.getTextVoiceArrayFromElement($(sanitizedContent), presenter.configuration.model.langAttribute);
    };

    presenter.getTTSKeyBasedOnColor = function EditableWindow_getTTSKeyBasedOnColor (element) {
        if (this.keyboardControllerObject.keyboardNavigationElementsLen -1 === this.keyboardControllerObject.keyboardNavigationCurrentElementIndex) {
            return "noColor";
        }
        return $(element[0].childNodes[0]).attr("title").toLowerCase();
    };

    presenter.speak = function EditableWindow_speak(data) {
        var tts = presenter.getTextToSpeechOrNull(presenter.configuration.playerController);
        if (tts && presenter.isWCAGOn) {
            tts.speak(data);
        }
    };

    presenter.setWCAGStatus = function EditableWindow_setWCAGStatus(isWCAGOn) {
        presenter.isWCAGOn = isWCAGOn;
    };

    presenter.getTextToSpeechOrNull = function EditableWindow_getTextToSpeechOrNull(playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    return presenter;
}

AddonEditableWindow_create.__supported_player_options__ = {
    interfaceVersion: 2
};
