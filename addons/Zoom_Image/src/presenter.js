function AddonZoom_Image_create() {

    var presenter = function() {};
    var eventBus;
    var playerController = null;
    var isWCAGOn = false;
    var oldFocus = null;
    var backgroundColorStyle;
    var opacity;

    function setup_presenter() {
        presenter.view = null;
        presenter.$view = null;
        presenter.$image = null;
        presenter.removeOpenedDialog = null;
        presenter.bigImageCreated = null;
        presenter.bigImageLoaded = null;
        presenter.createPopUp = null;
        presenter.isOpened = false;
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

        MutationObserverService.createDestroyObserver(presenter.configuration.ID, presenter.destroy, presenter.view);
        MutationObserverService.setObserver();

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
            closed: getSpeechTextProperty(speechTexts['Closed']['Closed'], presenter.speechTexts.closed)
        };
    }

    presenter.destroy = function (event) {
        if (event.target !== presenter.view) {
            return;
        }
        if (presenter.isOpened) {
            presenter.removeOpenedDialog();
            presenter.$image.dialog("close");
        }
        presenter.unbindEvents();

        setup_presenter();
        setup_presenter = null;
    };

    presenter.unbindEvents = function () {
        presenter.$view.find(".icon").off(presenter.eventType, presenter.createPopUp);
        if (presenter.$image !== null) {
            if (presenter.isOpened) {
                presenter.$view.find('.close-button-ui-dialog').off('click', presenter.removeOpenedDialog);
            }
            presenter.$image.off();
        }
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

    function calculateImageSizeAndPosition(image) {
        var $player;
        if (document.getElementById('_icplayer') != null){
            $player = $('#_icplayer');
        } else{
            $player = $('.ic_page_panel');
        }

        var dialog = {};
        var x = image.width;
        var y = image.height;
        var playerWidth = $player[0].getBoundingClientRect()?.width || $player.width();
        var playerHeight = $player[0].getBoundingClientRect()?.height || $player.height();
        var xProportion = x / playerWidth;
        var yProportion = y / playerHeight;

        if (xProportion < 1 && yProportion < 1) {
            dialog.width = x;
            dialog.height = y;
        } else if (xProportion > yProportion) {
            dialog.width = playerWidth;
            dialog.height = y / xProportion;
        } else {
            dialog.height = playerHeight;
            dialog.width = x / yProportion;
        }

        dialog.left = window.PositioningUtils.calculateLeftForPopupToBeCentred(dialog.width);
        dialog.top = window.PositioningUtils.calculateTopForPopupToBeCentred(dialog.height);

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
        $('.ui-widget-overlay').css("opacity", opacity);
        $('.ui-widget-overlay').css("background", backgroundColorStyle);
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
        var dialogSizeAndPosition = calculateImageSizeAndPosition(this);

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
            height: dialogSizeAndPosition.height,
            width: dialogSizeAndPosition.width,
            position: [dialogSizeAndPosition.left, dialogSizeAndPosition.top],
            modal: true,
            resizable: false,
            draggable: false,
            show: {
                effect: "fade",
                duration: 1000
            },
            create: presenter.bigImageCreated,
            open: function(event, ui) {
                opacity = $('.ui-widget-overlay').css("opacity");
                backgroundColorStyle = $('.ui-widget-overlay').css("background");
                $('.ui-widget-overlay').css("background", "black");
                $('.ui-widget-overlay').css("opacity", "0.7");
                $('.ui-widget-overlay').on(presenter.eventType, presenter.removeOpenedDialog);

                const dialogElement = $(event.target).closest('.ui-dialog')[0];
                const dialogElementBoundingClientRect = dialogElement.getBoundingClientRect();
                const newWidth = dialogElementBoundingClientRect.width;
                const newHeight = dialogElementBoundingClientRect.height;
                dialogElement.style.left = window.PositioningUtils.calculateLeftForPopupToBeCentred(newWidth) + "px";
                dialogElement.style.top = window.PositioningUtils.calculateTopForPopupToBeCentred(newHeight) + "px";
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

    presenter.keyboardController = function(keyCode, isShift, event) {
         if (keyCode == window.KeyboardControllerKeys.SPACE ||
             keyCode == window.KeyboardControllerKeys.ESC ||
             keyCode == window.KeyboardControllerKeys.ARROW_UP ||
             keyCode == window.KeyboardControllerKeys.ARROW_DOWN)
         {
             event.preventDefault();
         }

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

    presenter.getPrintableHTML = function (model, showAnswers) {
        model = presenter.upgradeModel(model);
        var $root = $('<div></div>');
        $root.attr('id',model.ID);
        $root.addClass('printable_addon_Zoom_Image');


        var $img = $('<img></img>');
        $img.attr('src', model['Full Screen image']);
        $root.append($img);
        return $root[0].outerHTML;
    };

    return presenter;
}
