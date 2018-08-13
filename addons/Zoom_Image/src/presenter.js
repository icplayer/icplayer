function AddonZoom_Image_create() {

    var presenter = function() {};
    var eventBus;
    var playerController = null;
    var isWCAGOn = false;
    var oldFocus = null;
    presenter.isOpened = false;

    function setup_presenter() {
        presenter.$player = null;
        presenter.view = null;
        presenter.$view = null;
        presenter.$image = null;
        presenter.removeOpenedDialog = null;
        presenter.bigImageCreated = null;
        presenter.bigImageLoaded = null;
        presenter.createPopUp = null;
    }

    setup_presenter();

    function setSmallImage(url) {
        var $image = $('<img class="small">');
        $image.attr("src", url);
        $image.attr("height", presenter.configuration.height);
        $image.attr("width", presenter.configuration.width);
        $image.attr("alt", presenter.configuration.alt);
        presenter.$view.find("div.content").append($image);
        if ( presenter.configuration.isTabindexEnabled) {$image.attr('tabindex', '0');}
    }

    presenter.ERROR_CODES = {
        IMAGE01: "Property Full Screen image and Page image cannot be empty"
    };

    function returnErrorObject(ec) { return { isValid: false, errorCode: ec }; }

    function returnCorrectObject(v) { return { isValid: true, value: v }; }

    function parseImage(image) {
        if (ModelValidationUtils.isStringWithPrefixEmpty(image, "/file/")) {
            return returnErrorObject("IMAGE01");
        }

        return returnCorrectObject(image);
    }

    presenter.setPlayerController = function(controller) {
        playerController = controller;
        eventBus = controller.getEventBus();
    };

    presenter.validateModel = function(model) {

        setSpeechTexts(model['speechTexts']);
        var validatedBigImage = parseImage(model["Full Screen image"]);
        if (!validatedBigImage.isValid) {
            return returnErrorObject(validatedBigImage.errorCode);
        }

        var validatedSmallImage = parseImage(model["Page image"]);
        if (!validatedSmallImage.isValid) {
            return returnErrorObject(validatedSmallImage.errorCode);
        }

        var isVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);

        var isTabindexEnabled = ModelValidationUtils.validateBoolean(model['Is Tabindex Enabled']);

        return {
            bigImage: validatedBigImage.value,
            smallImage: validatedSmallImage.value,
            ID: model.ID,
            width: parseInt(model["Width"], 10),
            height: parseInt(model["Height"], 10),
            isVisible: isVisible,
            isVisibleByDefault: isVisible,
            isValid: true,
            alt: model['Alternative text'],
            isTabindexEnabled: isTabindexEnabled,
            langTag: model['langAttribute']
        }
    };

    presenter.presenterLogic = function(view, model, isPreview) {
        presenter.view = view;
        presenter.$view = $(view);

        model = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return false;
        }

        setSmallImage(presenter.configuration.smallImage);

        if (!isPreview) {
            presenter.eventType = MobileUtils.isMobileUserAgent(navigator.userAgent) ? "touchend" : "click";
            presenter.$view.find(".icon").on(presenter.eventType, presenter.createPopUp);
            presenter.setVisibility(presenter.configuration.isVisible);
        }

        presenter.view.addEventListener('DOMNodeRemoved', function onDOMNodeRemoved(ev) {
            if (ev.target === this) {
                presenter.destroy();
            }
        });

        return false;
    };

    presenter.upgradeModel = function (model) {
        return presenter.upgradeFrom_01(model);
    };

    presenter.upgradeFrom_01 = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["speechTexts"]) {
            upgradedModel["speechTexts"] = {
                Closed: {Closed: 'closed'}
            };
        }

        if (!upgradedModel["langAttribute"]) {
            upgradedModel["langAttribute"] = '';
        }

        return upgradedModel;
    };

    function getSpeechTextProperty (rawValue, defaultValue) {
        var value = rawValue.trim();

        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }

        return value;
    }

    function setSpeechTexts (speechTexts) {
        presenter.speechTexts = {
            closed:  'closed'
        };

        if (!speechTexts) {
            return;
        }

        presenter.speechTexts = {
            closed:    getSpeechTextProperty(speechTexts['Closed']['Closed'], presenter.speechTexts.closed)
        };
    }

    presenter.destroy = function () {
        presenter.view.removeEventListener('DOMNodeRemoved', presenter.destroy);
        presenter.$view.find(".icon").off(presenter.eventType, presenter.createPopUp);
        if (presenter.$image !== null) {
            presenter.$image.off();
        }
        setup_presenter();
        setup_presenter = null;

    };

    presenter.run = function(view, model) {
        presenter.$view = $(view);
        presenter.presenterLogic(view, model, false);
    };

    presenter.createPreview = function(view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
        presenter.configuration.isVisible = isVisible;
    };

    function calculateImageSize(image) {
        var $player;
        if(document.getElementById('_icplayer') != null){
            $player = $('#_icplayer');
        }else{
            $player = $('.ic_page_panel');
        }

        var dialog = {};
        var x = image.width;
        var y = image.height;
        var xProportion = x / $player.width();
        var yProportion = y / $player.height();

        if (xProportion < 1 && yProportion < 1) {
            dialog.width = x;
            dialog.height = y;
        } else if (xProportion > yProportion) {
            dialog.width = $player.width();
            dialog.height = y / xProportion;
        } else {
            dialog.height = $player.height();
            dialog.width = x / yProportion;
        }

        return dialog;
    }

    function sendEvent(value) {
        var eventData = {
            source: presenter.configuration.ID,
            value: value
        };
        eventBus.sendEvent('ValueChanged', eventData);
    }

    presenter.removeOpenedDialog = function (e) {
        if(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        $(".zoom-image-wraper").remove();
        $(".big").remove();
        sendEvent(0);
        presenter.isOpened = false;
    };

    presenter.bigImageCreated = function() {
        var $close = $('<div class="close-button-ui-dialog">');
        $close.on('click', presenter.removeOpenedDialog);

        $(this).parents(".ui-dialog").append($close);

        var $closeCross= $('<div class="close-cross-ui-dialog">');
        $closeCross.html('&times;');
        $(this).parents(".ui-dialog").children(".close-button-ui-dialog").append($closeCross);

        $(this).parents(".ui-dialog:first").find(".ui-dialog-titlebar").css("display", "none");
        $(this).parents(".ui-dialog").css("padding", 0);
        $(this).parents(".ui-dialog").css("border", 0);
        $(this).parents(".ui-dialog:first").find(".ui-dialog-content").css("padding", 0);
        sendEvent(1);
    };

    presenter.bigImageLoaded = function(){
        if(document.getElementById('_icplayer') != null){
            presenter.$player  = document.getElementById('_icplayer');
        }else{
            presenter.$player  = document.getElementsByClassName('ic_page_panel');
        }

        var dialogSize = calculateImageSize(this);

        presenter.$image.appendTo(presenter.$view);

        if(!oldFocus && isWCAGOn && $.browser.mozilla) {
            // This hack is meant to prevent issues between TTS and NVDA on Firefox
            // When the dialog is created, jquery.ui changes browser focus, causing NVDA to speak
            // simultaneously with TTS. In order to prevent that, jQuery.focus() function is temporarily disabled
            // and then restored after dialog has been created
            oldFocus = $.fn.focus;
            $.fn.focus = function () {
                return this;
            };
        }
        presenter.$image.dialog({
            height: dialogSize.height,
            width: dialogSize.width,
            modal: true,
            resizable: false,
            draggable: false,
            show: {
                effect: "fade",
                duration: 1000
            },
            position: {
                my: "center",
                at: "center",
                of: presenter.$player
            },
            create: presenter.bigImageCreated,
            open: function() {
                $('.ui-widget-overlay').on(presenter.eventType, presenter.removeOpenedDialog);
            }
        });
        presenter.$image.parent().wrap("<div class='zoom-image-wraper'></div>");
        presenter.$image.on(presenter.eventType, presenter.removeOpenedDialog);

        if(oldFocus) {
            // Restoring jQuery.focus() after the hack meant to prevent issues between TTS and NVDA on Firefox
            $.fn.focus = oldFocus;
            oldFocus = null;
        }
    };

    presenter.createPopUp = function createPopUp(e) {
        if(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        presenter.$image = $("<img class='big' src='" + presenter.configuration.bigImage + "' alt='"+presenter.configuration.alt+"'>");
        presenter.$image.on("load", presenter.bigImageLoaded);
        presenter.isOpened = true;
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.reset = function() {
        presenter.configuration.isVisibleByDefault ? presenter.show() : presenter.hide();
    };

    presenter.getState = function () {
        return JSON.stringify({
            isVisible: presenter.configuration.isVisible
        });
    };

    presenter.upgradeStateForVisibility = function (parsedState) {
        if (parsedState.isVisible == undefined) {
            parsedState.isVisible = true;
        }

        return parsedState;
    };

    presenter.upgradeState = function(parsedState) {
        return presenter.upgradeStateForVisibility(parsedState);
    };

    presenter.setState = function (state) {
        if (!state) {
            return;
        }

        var parsedState = JSON.parse(state),
            upgradedState = presenter.upgradeState(parsedState);

        presenter.setVisibility(upgradedState.isVisible);
    };

     presenter.handleSpace = function(keyCode){
        $(document).on('keydown', function(e){
           if(keyCode == 32 || keyCode == 27 || keyCode == 38 || keyCode == 40) { // Space, esc, up, down buttons
               e.preventDefault();
           }$(this).off('keydown');
        });
    };

    presenter.keyboardController = function(keyCode, isShift) {
         presenter.handleSpace(keyCode);
         if (keyCode === 13 && !isShift) { // Enter button
            if (!presenter.isOpened) {
                presenter.createPopUp();
            }
            presenter.readAltText();
        }

        if (keyCode === 27 || keyCode === 9) { // ESC or TAB button
            presenter.removeOpenedDialog();
            presenter.$view.removeClass('ic_active_module');
            if (keyCode === 27) {
                presenter.readClosed();
            } else {
                playerController.getKeyboardController().moveActiveModule(isShift);
            }
        }
    };

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.setWCAGStatus = function (isOn) {
        isWCAGOn = isOn;
    };

    function speak (data) {
        var tts = presenter.getTextToSpeechOrNull(playerController);

        if (tts && isWCAGOn) {
            tts.speak(data);
        }
    }

    presenter.readAltText = function() {
        var speechVoices = [];
        speechVoices.push(window.TTSUtils.getTextVoiceObject(presenter.configuration.alt, presenter.configuration.langTag));
        speak(speechVoices);
    };

    presenter.readClosed = function() {
        var speechVoices = [];
        speechVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.closed));
        speak(speechVoices);
    };

    presenter.isEnterable = function() {return presenter.isOpened};

    return presenter;
}