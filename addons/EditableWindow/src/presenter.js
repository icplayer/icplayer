function AddonEditableWindow_create() {

    let presenter = function () {
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
        heightOffset: 90,
        widthOffset: 2,
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
        } else {
            $(view).html(presenter.configuration.model.errorMessage);
        }
    };

    presenter.init = function () {
        let $view = $(presenter.configuration.view);
        let hasHtml = presenter.configuration.hasHtml;
        let textareaId = presenter.configuration.textareaId;

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
                    let heightOffset = presenter.configuration.heightOffset;
                    let widthOffset = presenter.configuration.widthOffset;
                    let newHeight = ui.size.height - heightOffset;
                    let newWidth = ui.size.width - widthOffset;
                    tinymce.get(textareaId).theme.resizeTo(newWidth, newHeight);
                }
            }
        });

        $view.find(".close-button").click(function () {
            presenter.hide();
        });

        $view.find(".header").click(function () {
            presenter.show();
        });
    };

    presenter.handleVideoContent = function () {
        let $view = $(presenter.configuration.view);
        let audioSource = presenter.configuration.model.videoFile;
        let $videoElement = $view.find("video");
        $videoElement.attr("src", audioSource);
    };

    presenter.handleAudioContent = function () {
        let $view = $(presenter.configuration.view);
        let audioSource = presenter.configuration.model.audioFile;
        let $audioElement = $view.find("audio");
        $audioElement.attr("src", audioSource);
        presenter.configuration.heightOffset += 35;
    };

    presenter.handleHtmlContent = function () {
        let height = presenter.configuration.model.height;
        let width = presenter.configuration.model.width;
        let indexFile = presenter.configuration.model.indexFile;
        let textareaId = presenter.configuration.textareaId;
        let $view = $(presenter.configuration.view);

        let iframe = $view.find(".content-iframe");
        let separator = (indexFile.indexOf("?") === -1) ? "?" : "&";
        let source = indexFile + separator + "no_gcs=true";

        iframe.attr("onload", function () {
            presenter.configuration.isIframeLoaded = true;
        });
        iframe.attr("src", source);

        $view.css("z-index", "1");

        let textarea = $view.find("textarea");
        textarea.attr("id", textareaId);

        let widthOffset = presenter.configuration.widthOffset;
        let heightOffset = presenter.configuration.heightOffset;

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

        let timeout = setTimeout(function () {
            presenter.fetchIframeContent(function (content) {
                let isInitialized = presenter.configuration.state.isInitialized;
                if (!isInitialized) {
                    presenter.configuration.contentLoadingLock = true;
                    presenter.fillActiveTinyMce(content);
                    presenter.configuration.state.isInitialized = true;
                    presenter.configuration.state.content = content;
                    presenter.configuration.contentLoadingLock = false;
                }
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
        let contentLoadingLock = presenter.configuration.contentLoadingLock;
        if (contentLoadingLock) {
            let timeout = setTimeout(function (state) {
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

        let isInitialized = presenter.configuration.state.isInitialized;
        let content = presenter.configuration.state.content;

        if (isInitialized) {
            presenter.fillActiveTinyMce(content);
        }
        presenter.configuration.contentLoadingLock = false;
    }

    presenter.getState = function () {
        let editor = presenter.configuration.editor;
        let isTinyMceLoaded = presenter.configuration.isTinyMceLoaded;
        let isTinyMceFilled = presenter.configuration.isTinyMceFilled;
        if (isTinyMceLoaded && isTinyMceFilled) {
            presenter.configuration.state.content = editor.getContent({format: 'raw'});
        }

        return JSON.stringify(presenter.configuration.state);
    };

    presenter.validModel = function (model) {
        let indexFile = model['index'];
        let audioFile = model['audio'];
        let videoFile = model['video'];

        if (indexFile === "" && audioFile === "" && videoFile === "") {
            return presenter.generateValidationError("Content cannot be undefined.");
        }

        let fileList = [];

        let originalFileList = model["fileList"];
        for (let i = 0; i < originalFileList.length; i++) {
            let entity = originalFileList[i];
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
        let view = presenter.configuration.view;
        let isIframeLoaded = presenter.configuration.isIframeLoaded;

        if (isIframeLoaded) {
            let content = $(view).find(".content-iframe").contents().find("body").html();
            callback(content);
        } else {
            let timeout = setTimeout(function (callback) {
                presenter.fetchIframeContent(callback)
            }, 1000);

            presenter.configuration.timeouts.push(timeout);
        }
    };

    presenter.fillActiveTinyMce = function (content) {
        let isTinyMceLoaded = presenter.configuration.isTinyMceLoaded;

        if (isTinyMceLoaded) {
            let timeout = setTimeout(function () {
                presenter.fillTinyMce(content);
            }, 1000);

            presenter.configuration.timeouts.push(timeout);
        } else {
            let timeout = setTimeout(function () {
                presenter.fillActiveTinyMce(content);
            }, 1000);

            presenter.configuration.timeouts.push(timeout);
        }
    };

    presenter.fillTinyMce = function (content) {
        let fileList = presenter.configuration.model.fileList;
        let documentContent = new DOMParser().parseFromString(content, 'text/html');
        let textareaId = presenter.configuration.textareaId;

        for (let i = 0; i < fileList.length; i++) {
            let entity = fileList[i];
            let node = documentContent.getElementById(entity.id);
            if (node != null && node !== undefined) {
                node.src = entity.file;
            }
        }

        let parsedContent = documentContent.getElementsByTagName("body")[0].innerHTML;
        tinymce.get(textareaId).getBody().innerHTML = parsedContent;
        presenter.configuration.isTinyMceFilled = true;
        presenter.removeIframe();
    };

    presenter.removeIframe = function () {
        $(presenter.configuration.view).find(".content-iframe").remove();
    };

    presenter.centerPosition = function () {
        let $view = $(presenter.configuration.view);
        let width = $(".addon-editable-window-wrapper").width();
        let icPageWidth = $(".ic_page").width();
        let scrollY = window.parent !== undefined ? window.parent.scrollY : window.scrollY;

        let topOffset = scrollY + 25;
        let leftOffset = (icPageWidth - width) / 2;

        $view.css({top: topOffset, left: leftOffset, right: "", bottom: ""});
    };

    presenter.show = function () {
        let view = presenter.configuration.view;
        let eventBus = presenter.configuration.eventBus;
        let id = presenter.configuration.model.id;
        let $view = $(view);

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
        let value = eventData.value;
        let source = eventData.source;
        let id = presenter.configuration.model.id;
        let view = presenter.configuration.view;
        let $view = $(view);

        if (value === "move-editable-windows" && source !== id) {
            $view.style("z-index", "1");
        }
    };

    presenter.executeCommand = function (name, params) {
        let commands = {
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

            let timeouts = presenter.configuration.timeouts;
            for (let i = 0; i < timeouts.length; i++) {
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