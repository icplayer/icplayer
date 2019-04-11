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
        editor: null,
        textareaId: null,
        isVisible: true,
        hasHtml: false,
        hasVideo: false,
        hasAudio: false,
        heightOffset: 110,
        widthOffset: 22,
        minHeight: 300,
        minWidth: 300,
        state: {
            isInitialized: false,
            content: null
        }
    };

    presenter.run = function (view, model) {
        presenter.configuration.view = view;
        presenter.configuration.view.addEventListener('DOMNodeRemoved', presenter.destroy);
        presenter.configuration.model = presenter.validModel(model);

        if (presenter.configuration.model.isValid) {
            presenter.configuration.textareaId = presenter.configuration.model.id + "-textarea";
            presenter.configuration.hasHtml = presenter.configuration.model.indexFile !== "";
            presenter.configuration.hasAudio = presenter.configuration.model.audioFile !== "";
            presenter.configuration.hasVideo = presenter.configuration.model.videoFile !== "";
            presenter.init();
            presenter.hide();
        } else {
            $(view).html(presenter.configuration.model.errorMessage);
        }
    };

    presenter.init = function () {
        var $view = $(presenter.configuration.view);
        var hasHtml = presenter.configuration.hasHtml;
        var textareaId = presenter.configuration.textareaId;

        if (presenter.configuration.hasVideo) {
            presenter.handleVideoContent();
            presenter.configuration.hasHtml = false;
            presenter.configuration.hasAudio = false;
        } else {
            $view.find(".video-wrapper").remove();
        }

        if (presenter.configuration.hasAudio) {
            presenter.handleAudioContent();
        } else {
            $view.find("audio").remove();
        }

        if (presenter.configuration.hasHtml) {
            presenter.handleHtmlContent();
        } else {
            $view.find(".content-iframe").remove();
            $view.find("textarea").remove();
        }

        $view.css("z-index", "1");

        $view.draggable({
            start: function () {
                presenter.show();
            }
        });

        $view.resizable({
            minHeight: presenter.configuration.minHeight,
            minWidth: presenter.configuration.minWidth,
            resize: function (event, ui) {
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
                    $view.find("iframe").css("visibility", "hidden")
                }
            },
            stop: function (event, ui) {
                if (hasHtml) {
                    $view.find("iframe").css("visibility", "visible")
                }
            },
        });

        $view.find(".close-button").click(function () {
            presenter.hide();
        });

        $view.find(".header").click(function () {
            presenter.show();
        });
    };

    presenter.handleVideoContent = function () {
        var $view = $(presenter.configuration.view);
        var audioSource = presenter.configuration.model.videoFile;
        var $videoElement = $view.find("video");
        $videoElement.attr("src", audioSource);
    };

    presenter.handleAudioContent = function () {
        var $view = $(presenter.configuration.view);
        var audioSource = presenter.configuration.model.audioFile;
        var $audioElement = $view.find("audio");
        $audioElement.attr("src", audioSource);
        presenter.configuration.heightOffset += 35;
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
            plugins: "textcolor colorpicker",
            toolbar: "backcolor",
            statusbar: false,
            menubar: false,
            height: height - heightOffset,
            width: width - widthOffset,
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
    }

    presenter.getState = function () {
        var editor = presenter.configuration.editor;
        var isTinyMceLoaded = presenter.configuration.isTinyMceLoaded;
        var isTinyMceFilled = presenter.configuration.isTinyMceFilled;
        if (isTinyMceLoaded && isTinyMceFilled) {
            presenter.configuration.state.content = editor.getContent({format: 'raw'});
        }

        return JSON.stringify(presenter.configuration.state);
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
                callback(content);
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
        presenter.configuration.isTinyMceFilled = true;
    };

    presenter.removeIframe = function () {
        $(presenter.configuration.view).find(".content-iframe").remove();
    };

    presenter.centerPosition = function () {
        var $view = $(presenter.configuration.view);
        var width = $view.find(".addon-editable-window-wrapper").width();
        var icPageWidth = $(".ic_page").width();

        var scrollY;
        try {
            scrollY = window.parent.scrollY !== undefined ? window.parent.scrollY : window.scrollY;
        } catch (e) {
            scrollY = 0;
            console.error(e.errorMessage);
        }

        var topOffset = scrollY + 25;
        var leftOffset = (icPageWidth - width) / 2;

        $view.css({top: topOffset, left: leftOffset, right: "", bottom: ""});
    };

    presenter.show = function () {
        var view = presenter.configuration.view;
        var eventBus = presenter.configuration.eventBus;
        var id = presenter.configuration.model.id;
        var $view = $(view);

        presenter.configuration.isVisible = true;

        $view.style("z-index", "3");
        $view.show();

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
    };

    presenter.onEventReceived = function (eventName, eventData) {
        var value = eventData.value;
        var source = eventData.source;
        var id = presenter.configuration.model.id;
        var view = presenter.configuration.view;
        var $view = $(view);

        if (value === "move-editable-windows" && source !== id) {
            $view.style("z-index", "1");
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

    presenter.destroy = function (event) {
        if (event.target === presenter.configuration.view) {
            presenter.configuration.view.removeEventListener('DOMNodeRemoved', presenter.destroy);

            var timeouts = presenter.configuration.timeouts;
            for (var i = 0; i < timeouts.length; i++) {
                clearTimeout(timeouts[i]);
            }

            if (presenter.configuration.editor != null) {
                presenter.configuration.editor.destroy();
            }
            $(presenter.configuration.view).off();
            presenter.configuration = null;
        }
    };

    return presenter;
}