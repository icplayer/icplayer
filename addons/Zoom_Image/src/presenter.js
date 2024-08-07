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

        presenter.view.addEventListener('DOMNodeRemoved', presenter.destroy);

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
        presenter.view.removeEventListener('DOMNodeRemoved', presenter.destroy);
        presenter.$view.find(".icon").off(presenter.eventType, presenter.createPopUp);
        if (presenter.$image !== null) {
            if (presenter.isOpened) {
                presenter.$view.find('.close-button-ui-dialog').off('click', presenter.removeOpenedDialog);
            }
            presenter.$image.off();
        }
    }

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
        var scrollInformation = getScrollInformation();
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
                of: playerController.isPlayerInCrossDomain() ? window : window.top
            },
            create: presenter.bigImageCreated,
            open: function(event, ui) {
                opacity = $('.ui-widget-overlay').css("opacity");
                backgroundColorStyle = $('.ui-widget-overlay').css("background");
                $('.ui-widget-overlay').css("background", "black");
                $('.ui-widget-overlay').css("opacity", "0.7");
                $('.ui-widget-overlay').on(presenter.eventType, presenter.removeOpenedDialog);

                const dialogElement = $(event.target).closest('.ui-dialog')[0];
                if (!!scrollInformation) {
                    adjustDialogPosition(dialogElement, scrollInformation);
                }
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

    function getScrollInformation() {
        const isIOS = MobileUtils.isSafariMobile(window.navigator.userAgent);
        const isMAuthorOnIOS = isIOS && isMAuthor();
        if (playerController.isPlayerInCrossDomain() || (window.frameElement === null && !isMAuthorOnIOS)) {
            return null;
        }

        const $defaultScrollElement = $(window.parent.document.documentElement);
        const $mAuthorFullScreenScrollElement = $defaultScrollElement.find('#content-view');
        const $mCourserScrollElement = $defaultScrollElement.find('#lesson-view > div > div');
        const $scrollElements = [$defaultScrollElement, $mAuthorFullScreenScrollElement, $mCourserScrollElement];
        if (isMAuthorOnIOS) {
            const $mAuthorMobileScrollElement = $(window.document.documentElement);
            $scrollElements.push($mAuthorMobileScrollElement);
        }

        let maxScrollTop = 0;
        let $scrollElement = null;
        try {
            for (let i = 0; i < $scrollElements.length; i++) {
                let elementScrollTop = $scrollElements[i].scrollTop();
                if (elementScrollTop !== null && elementScrollTop >= maxScrollTop) {
                    maxScrollTop = elementScrollTop;
                    $scrollElement = $scrollElements[i];
                }
            }
        } catch(e) {}
        if ($scrollElement === null) {
            return null;
        }

        return {
            scrollTop: maxScrollTop,
            scrollElement: $scrollElement[0]
        };
    }

    function isMAuthor() {
        const names = ["lorepo", "mauthor"];
        const origin = window.origin;
        return names.some((name) => origin.includes(name));
    }

    function adjustDialogPosition(dialogElement, scrollInformation) {
        if (!!window.frameElement) {
            dialogElement.style.left = calculatePopupLeft(dialogElement) + "px";
        }
        dialogElement.style.top = calculatePopupTop(dialogElement, scrollInformation) + "px";
        scrollInformation.scrollElement.scrollTo({top: scrollInformation.scrollTop});
    }

    function calculatePopupTop(dialogElement, scrollInformation) {
        let availableHeight = window.top.innerHeight;
        let offsetTop = scrollInformation.scrollTop;
        if (!!window.frameElement) {
            const frameScale = getFrameScale();
            if (frameScale !== 1) {
                availableHeight /= frameScale;
                offsetTop = offsetTop/frameScale - window.iframeSize.frameOffset;
            }
        }

        const dialogHeight = dialogElement.getBoundingClientRect().height;
        const halfOfEmptySpace = (availableHeight - dialogHeight)/2;
        return halfOfEmptySpace + offsetTop;
    }

    function calculatePopupLeft(dialogElement) {
        const availableWidth = window.top.innerWidth < window.frameElement.offsetWidth
            ? window.top.innerWidth
            : window.frameElement.offsetWidth;
        const dialogWidth = dialogElement.offsetWidth;
        const scaleInfo = playerController.getScaleInformation();
        return (availableWidth - dialogWidth) / 2 * scaleInfo.baseScaleX;
    }

    /**
     * The mAuthor's and mCourser's methods (e.g. Full screen) do not set a scale information in a player, despite
     * setting CSS's transform scale on iframe with player. Gets iframe' scale.
     *
     * @method getFrameScale
     * @return {number} Scale on iframe with player
     */
    function getFrameScale(){
        const matrixScale = getComputedStyle(window.frameElement).transform;
        if (!matrixScale || !matrixScale.includes('matrix')) {
            return 1;
        }

        const matrix = matrixScale.replace('matrix(', '').split(',');
        return +matrix[0];
    }

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
    }

    return presenter;
}