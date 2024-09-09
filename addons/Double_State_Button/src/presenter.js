function AddonDouble_State_Button_create(){
    var presenter = function() {};

    var playerController;
    var isMouseDown = false;
    var isTouchDown = false;
    var isMouseBlocked = false;
    var isWCAGOn = false;

    presenter.lastEvent = null;
    presenter.speechTexts = {};

    var CSS_CLASSES = {
        ELEMENT : "doublestate-button-element",
        MOUSE_HOVER : "doublestate-button-element-mouse-hover",
        MOUSE_CLICK : "doublestate-button-element-mouse-click",
        SELECTED : "doublestate-button-element-selected",
        SELECTED_MOUSE_HOVER : "doublestate-button-element-selected-mouse-hover",
        SELECTED_MOUSE_CLICK : "doublestate-button-element-selected-mouse-click"
    };

    var DEFAULT_TTS_PHRASES = {
        SELECT_BUTTON: "selected",
        DESELECT_BUTTON: "deselected",
        DISABLED_BUTTON: "disabled"
    };

    const ERROR_MESSAGES = {
        INVALID_FILE: 'Invalid SVG file',
    };

    function CSS_CLASSESToString() {
        return CSS_CLASSES.ELEMENT + " " + CSS_CLASSES.MOUSE_HOVER + " " + CSS_CLASSES.MOUSE_CLICK + " " +
            CSS_CLASSES.SELECTED + " " + CSS_CLASSES.SELECTED_MOUSE_HOVER + " " + CSS_CLASSES.SELECTED_MOUSE_CLICK;
    }

    presenter.DISPLAY_CONTENT_TYPE = {
        NONE: 0,
        TEXT: 1,
        IMAGE: 2,
        BOTH: 3
    };

    presenter.upgradeModel = function(model) {
        var upgradedModel = presenter.upgradeDisable(model);
        upgradedModel = presenter.addImageAlternativeText(upgradedModel);
        upgradedModel = presenter.addLangTag(upgradedModel);
        upgradedModel = presenter.addTTS(upgradedModel);
        upgradedModel = presenter.addRenderSVGAsHTML(upgradedModel);
        upgradedModel = presenter.addOmitTextInTTS(upgradedModel);

        return upgradedModel;
    };

    presenter.upgradeDisable = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["Disable"]) {
            upgradedModel["Disable"] = "False";
        }

        return upgradedModel;
    };

    presenter.addImageAlternativeText = function(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!model["imageAlternativeText"])
            upgradedModel["imageAlternativeText"] = "";

        if (!model["imageSelectedAlternativeText"])
            upgradedModel["imageSelectedAlternativeText"] = "";

        return upgradedModel;
    };

    presenter.addLangTag = function AddonTable_addLangTag(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!model['langAttribute']) {
            upgradedModel['langAttribute'] =  '';
        }

        return upgradedModel;
    };

    presenter.addTTS = function(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);


        if (!model["speechTexts"]) {
            upgradedModel["speechTexts"] = {
                selectButton: {selectButton: DEFAULT_TTS_PHRASES.SELECT_BUTTON},
                deselectButton: {deselectButton: DEFAULT_TTS_PHRASES.DESELECT_BUTTON},
                speechTextDisabled: {speechTextDisabled: "False"}
            };
        }

        if (!upgradedModel['speechTexts'].hasOwnProperty('disabledButton')) {
            presenter.useWithoutDisable= true;
            upgradedModel['speechTexts']['disabledButton'] = {disabledButton: DEFAULT_TTS_PHRASES.DISABLED_BUTTON};
        }

        return upgradedModel;
    };

    presenter.addRenderSVGAsHTML = function (model) {
        const upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if(!model.hasOwnProperty('renderSVGAsHTML')) {
            upgradedModel['renderSVGAsHTML'] = 'False';
        }

        return upgradedModel;
    };

    presenter.addOmitTextInTTS = function (model) {
        const upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if(!model.hasOwnProperty('omitTextInTTS')) {
            upgradedModel['omitTextInTTS'] = 'False';
        }

        return upgradedModel;
    };


    presenter.executeUserEventCode = function (eventCode) {
        playerController.getCommands().executeEventCode(eventCode);
    };

    presenter.clickHandler = function(event) {
        if (event !== undefined) {
            event.stopPropagation();
        }

        if (presenter.configuration.isErrorMode && !presenter.configuration.enableCheckMode) {
            return;
        }

        var eventCode;

        if(!presenter.configuration.isDisabled) {
            presenter.configuration.isSelected = !presenter.configuration.isSelected;
            eventCode = presenter.isSelected() ? presenter.configuration.selected.event : presenter.configuration.deselected.event;
            presenter.executeUserEventCode(eventCode);
            presenter.setElementSelection();
            presenter.updateLaTeX();
            presenter.sendEventData();
        }
    };

    function handleTouchActions() {
        var element = presenter.$view.find('div[class*=doublestate-button-element]:first');

        element.on('touchstart', touchStartEventHandler);
        element.on('touchend', touchEndEventHandler);
    }

    function touchStartEventHandler(e) {
        isMouseBlocked = true;
        e.preventDefault();
        e.stopPropagation();
        presenter.lastEvent = e;
        isTouchDown = true;
    }

    function touchEndEventHandler(e) {
        e.preventDefault();
        if (isTouchDown) {
            if ( presenter.lastEvent.type != e.type ) {
                presenter.clickHandler(e);
            }
            isTouchDown = false;
        }
    }

    function handleMouseActions() {
        const $element = presenter.$view.find('div[class*=doublestate-button-element]:first');

        $element.on('mousedown', (e) => mouseDownEventHandler(e));
        $element.on('click', (e) => clickEventHandler(e));
        $element.on('mouseup', (e) => mouseUpEventHandler(e));

        $element.hover(
            function() {
                $(this).removeClass(CSS_CLASSESToString());
                $(this).addClass(presenter.isSelected() ? CSS_CLASSES.SELECTED_MOUSE_HOVER : CSS_CLASSES.MOUSE_HOVER);
            },
            function() {
                $(this).removeClass(CSS_CLASSESToString());
                $(this).addClass(presenter.isSelected() ? CSS_CLASSES.SELECTED : CSS_CLASSES.ELEMENT);
            }
        );
    }

    function mouseDownEventHandler(e) {
        if (!isMouseBlocked) {
            e.preventDefault();
            e.stopPropagation();
            presenter.lastEvent = e;
            isMouseDown = true;
        }
    }

    function clickEventHandler(e){
        e.stopPropagation();
    }

    function mouseUpEventHandler(e) {
        if (!isMouseBlocked) {
            e.preventDefault();
            e.stopPropagation();
            if (isMouseDown) {
                if (presenter.lastEvent.type != e.type) {
                    presenter.clickHandler(e);
                }
                isMouseDown = false;
            }
        }
    }

    function setElementsDimensions(model, wrapper, element) {
        var viewDimensions = DOMOperationsUtils.getOuterDimensions(presenter.$view);
        var viewDistances = DOMOperationsUtils.calculateOuterDistances(viewDimensions);
        presenter.$view.css({
            width:(model.Width - viewDistances.horizontal) + 'px',
            height:(model.Height - viewDistances.vertical) + 'px'
        });

        DOMOperationsUtils.setReducedSize(presenter.$view, wrapper);
        DOMOperationsUtils.setReducedSize(wrapper, element);
    }

    function createImageElement(element, shouldDisplayImage = true) {
        var imageElement = document.createElement('img');
        $(imageElement).addClass('doublestate-button-image');
        $(imageElement).attr('src', presenter.isSelected() ? presenter.configuration.selected.image : presenter.configuration.deselected.image);

        if(!shouldDisplayImage) {
            hideImageElement(element);
        }

        $(element).append(imageElement);
    }

    function createSVGElement(element) {
        const url = presenter.isSelected() ? presenter.configuration.selected.image : presenter.configuration.deselected.image;
        const sanitizeUrl = window.xssUtils.sanitize(url);

        $.ajax({
            url: sanitizeUrl,
            success: function (data) {
                onLoadCompleted(data, element);
            },
            error: function () {
                presenter.showErrorMessage();
            },
            dataType: 'xml'
        });
    }

    function createSVGElementFromCSSUrl(element) {
        setTimeout(() => {
            const _el = presenter.$view.find('div[class*=doublestate-button-element]:first');
            if (!_el) { return; }

            const url = _el.css('background-image');
            const sanitizeUrl = getURLFromAbsolutePath(url);

            $.ajax({
                url: sanitizeUrl,
                success: function (data) {
                    removeImageElement(element);
                    onLoadCompleted(data, element);
                },
                error: function (err) {
                    presenter.showErrorMessage(err);
                }
            });
        }, 200);
    }

    function getURLFromAbsolutePath(absolutePath) {
        const regExp = new RegExp(".*\\.com(\\/)file");
        const urlMatch = absolutePath.match(regExp);
        const startURLIndex = urlMatch[0].lastIndexOf('/');
        const endURLIndex = absolutePath.lastIndexOf('"');

        return absolutePath.slice(startURLIndex, endURLIndex);
    }

    function removeImageElement(element) {
        const imageElement = $(element).find('doublestate-button-element');
        const $imageElement = $(imageElement.context);
        $imageElement.attr('style', 'background-image: none !important');
    }

    function hideImageElement(element) {
        const imageElement = $(element).find('doublestate-button-element');
        const $imageElement = $(imageElement.context);
        $imageElement.attr('style', 'visibility: hidden !important');
    }

    function onLoadCompleted(data, element) {
        const svgElement = $(data).find('svg');
        if (svgElement.length === 0) {
            presenter.showErrorMessage();
            return;
        }

        const svgWidth = getElementWidth(svgElement);
        const svgHeight = getElementHeight(svgElement);

        svgElement.attr('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight);
        svgElement.attr('width', '100%');
        svgElement.attr('height', '100%');

        const svgData = data.childNodes;
        $(element).html(svgData);
        createTextElement(element);
    }

    function getElementWidth(HTMLElement) {
        const width = HTMLElement.attr('width');
        const widthFromRectTag = HTMLElement.find('rect').attr('width');

        if (width) {
            return width.replace('px', '');
        } else if (widthFromRectTag) {
            return widthFromRectTag.replace('px', '');
        } else {
            return presenter.configuration.width;
        }
    }

    function getElementHeight(HTMLElement) {
        const height = HTMLElement.attr('width');
        const heightFromRectTag = HTMLElement.find('rect').attr('width');

        if (height) {
            return height.replace('px', '');
        } else if (heightFromRectTag) {
            return heightFromRectTag.replace('px', '');
        } else {
            return presenter.configuration.height;
        }
    }

    presenter.showErrorMessage = function() {
        const errorContainer = '<p>' + ERROR_MESSAGES.INVALID_FILE + '</p>';

        presenter.$view.html(errorContainer);
    };

    function createTextElement(element) {
        var textElement = document.createElement('span');
        $(textElement).addClass('doublestate-button-text');
        const buttonText = presenter.getSanitizedButtonTextValue();
        $(textElement).html(buttonText);
        $(element).append(textElement);
    }

    function createElements(wrapper) {
        const element = document.createElement('div');
        const atLeastOneImgIsAvailable = presenter.configuration.selected.image || presenter.configuration.deselected.image;
        $(element).addClass(presenter.isSelected() ? CSS_CLASSES.SELECTED : CSS_CLASSES.ELEMENT);

        if (!atLeastOneImgIsAvailable && presenter.configuration.renderSVGAsHTML) {
            createImageElement(element, false);
            createSVGElementFromCSSUrl(element);
        } else if (atLeastOneImgIsAvailable && presenter.configuration.renderSVGAsHTML) {
            createSVGElement(element);
        } else {
            createImageElement(element);
            createTextElement(element);
        }

        wrapper.append(element);

        return element;
    }

    function presenterLogic(view, model, preview) {
        presenter.$view = $(view);
        presenter.view = view;
        presenter.wrapper = presenter.$view.find('.doublestate-button-wrapper:first')[0];
        presenter.$wrapper = $(presenter.wrapper);


        var upgradedModel = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(upgradedModel);

        var element = createElements(presenter.$wrapper);

        setElementsDimensions(model, presenter.$wrapper, element);
        presenter.setElementSelection();
        presenter.toggleDisable(presenter.configuration.isDisabled);
        presenter.setVisibility(presenter.configuration.isVisible);
        presenter.setTabindex(presenter.$wrapper, presenter.configuration.isTabindexEnabled);

        if (!preview) {
            handleTouchActions();
            handleMouseActions();
            presenter.addKeyboardListeners();
            MutationObserverService.createDestroyObserver(presenter.configuration.addonID, presenter.destroy, presenter.view);
            MutationObserverService.setObserver();
        }
    }

    presenter.addKeyboardListeners = function () {
        presenter.wrapper.addEventListener("keydown", presenter.handleKeyboardEvents);
    };

    presenter.handleKeyboardEvents = function AddonDouble_State_Button_handleKeyboardEvents(event) {
        if (window.KeyboardControllerKeys.ENTER === event.keyCode ||
            window.KeyboardControllerKeys.SPACE === event.keyCode
        )   {
            event.preventDefault();
            presenter.clickHandler();
        }
    };


    function applySelectionStyle(className) {
        var element = presenter.$view.find('div[class*=doublestate-button-element]:first');

        $(element).removeClass(CSS_CLASSESToString());
        $(element).addClass(className);
    }

    presenter.setElementSelection = function() {
        var element = presenter.$view.find('div[class*=doublestate-button-element]:first');
        var displayContent = presenter.isSelected() ? presenter.configuration.selected.displayContent : presenter.configuration.deselected.displayContent;

        var textElement = $(element).find('.doublestate-button-text');
        const buttonText = presenter.getSanitizedButtonTextValue();
        textElement.html(buttonText);

        var imageElement = $(element).find('.doublestate-button-image');
        imageElement.attr('src', presenter.isSelected() ? presenter.configuration.selected.image : presenter.configuration.deselected.image);

        switch (displayContent) {
            case presenter.DISPLAY_CONTENT_TYPE.NONE:
                $(textElement).hide();
                $(imageElement).hide();
                break;
            case presenter.DISPLAY_CONTENT_TYPE.TEXT:
                $(textElement).show();
                $(imageElement).hide();
                break;
            case presenter.DISPLAY_CONTENT_TYPE.IMAGE:
                $(imageElement).show();
                $(textElement).hide();
                break;
            case presenter.DISPLAY_CONTENT_TYPE.BOTH:
                $(imageElement).show();
                $(textElement).show();
                break;
        }

        applySelectionStyle(presenter.isSelected() ? CSS_CLASSES.SELECTED : CSS_CLASSES.ELEMENT);

    };

    presenter.getSanitizedButtonTextValue = function () {
        const text = presenter.isSelected() ? presenter.configuration.selected.text : presenter.configuration.deselected.text
        return window.xssUtils.sanitize(text);
    }

    presenter.updateLaTeX = function () {
        var textElement = presenter.$view.find('.doublestate-button-text')[0];
        presenter.mathJaxProcessEnded.then(function () {
                MathJax.CallBack.Queue().Push(function () {MathJax.Hub.Typeset(textElement)});
        });
    };

    presenter.select = function () {
        if(!presenter.configuration.isSelected){
            presenter.configuration.isSelected = true;
            presenter.setElementSelection();
            presenter.updateLaTeX();
        }
    };

    presenter.deselect = function () {
        if(presenter.configuration.isSelected){
            presenter.configuration.isSelected = false;
            presenter.setElementSelection();
            presenter.updateLaTeX();
        }
    };

    presenter.isSelected = function () {
        return presenter.configuration.isSelected;
    };

    presenter.executeCommand = function(name) {
        if (presenter.configuration.isErrorMode) return;

        var commands = {
            'select': presenter.select,
            'deselect': presenter.deselect,
            'show': presenter.show,
            'hide': presenter.hide,
            'enable': presenter.enable,
            'disable': presenter.disable,
            'isSelected': presenter.isSelected
        };

        Commands.dispatch(commands, name, [], presenter);
    };

    presenter.isIE9 = function (userAgent) {
        userAgent = userAgent.toLowerCase();

        if (userAgent.indexOf('msie') != -1) {
            return parseInt(userAgent.split('msie')[1], 10) == 9;
        }

        return false;
    };

    presenter.setVisibility = function(isVisible) {
        if(presenter.isIE9(navigator.userAgent)) {
            presenter.$view.css('display', isVisible ? 'block' : "none");
        }

        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.setPlayerController = function(controller) {
        playerController = controller;
        var eventBus = playerController.getEventBus();

        var mathJaxDeferred = new jQuery.Deferred();
        presenter.mathJaxProcessEndedDeferred = mathJaxDeferred;
        presenter.mathJaxProcessEnded = mathJaxDeferred.promise();

        MathJax.Hub.Register.MessageHook("End Process", function (message) {
            if ($(message[1]).hasClass('ic_page')) {
                if(presenter.mathJaxProcessEndedDeferred.state() != 'resolved'){
                    presenter.mathJaxProcessEndedDeferred.resolve();
                }
            }
        });

        eventBus.addEventListener('ShowAnswers', this);
        eventBus.addEventListener('HideAnswers', this);
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function(view, model){
        presenterLogic(view, model, false);
    };

    presenter.show = function() {
        if (!presenter.configuration.isVisible) {
            presenter.setVisibility(true);
            presenter.configuration.isVisible = true;
            presenter.setElementSelection();
            presenter.updateLaTeX();
        }
    };

    presenter.hide = function() {
        if (presenter.configuration.isVisible) {
            presenter.setVisibility(false);
            presenter.configuration.isVisible = false;
            presenter.setElementSelection();
            presenter.updateLaTeX();
        }
    };

    presenter.isEnabledInGSAMode = function () {
        return presenter.configuration.enableCheckMode;
    }

    presenter.enable = function() {
        if (presenter.configuration.isDisabled) {
            presenter.toggleDisable(false);
            presenter.setElementSelection();
            presenter.updateLaTeX();
        }
    };

    presenter.disable = function() {
        if (!presenter.configuration.isDisabled) {
            presenter.toggleDisable(true);
            presenter.setElementSelection();
            presenter.updateLaTeX();
        }
    };

    presenter.toggleDisable = function(disable) {
        var element = presenter.$view.find('div[class*=doublestate-button-element]:first');

        if(disable) {
            element.addClass("disable");
        } else {
            element.removeClass("disable");
        }

        presenter.configuration.isDisabled = disable;
    };

    presenter.reset = function() {
        presenter.configuration.isSelected = presenter.configuration.isSelectedByDefault;
        presenter.configuration.isErrorMode = false;

        presenter.setElementSelection();

        if (presenter.configuration.isVisibleByDefault) {
            presenter.show();
        } else {
            presenter.hide();
        }

        presenter.toggleDisable(presenter.configuration.isDisabledByDefault);
        presenter.updateLaTeX();
    };

    presenter.getState = function() {
        return JSON.stringify({
            isVisible: presenter.configuration.isVisible,
            isSelected: presenter.configuration.isSelected,
            isDisabled: presenter.configuration.isDisabled
        });
    };

    presenter.setState = function(state) {
        if (ModelValidationUtils.isStringEmpty(state)) {
            return;
        }

        var parsedState = JSON.parse(state);

        if (parsedState.isVisible) {
            presenter.show();
        } else {
            presenter.hide();
        }

        presenter.toggleDisable(parsedState.isDisabled);

        presenter.configuration.isSelected = parsedState.isSelected;
        presenter.setElementSelection();
    };

    presenter.validateString = function (imageSrc) {
        var isEmpty = ModelValidationUtils.isStringEmpty(imageSrc);

        return {
            isEmpty: isEmpty,
            value: isEmpty ? "" : imageSrc
        };
    };

    presenter.determineDisplayContent = function(text, image) {
        var displayContent = presenter.DISPLAY_CONTENT_TYPE.NONE;
        if (!text.isEmpty && image.isEmpty) {
            displayContent = presenter.DISPLAY_CONTENT_TYPE.TEXT;
        } else if (text.isEmpty && !image.isEmpty) {
            displayContent = presenter.DISPLAY_CONTENT_TYPE.IMAGE;
        } else if (!text.isEmpty && !image.isEmpty) {
            displayContent = presenter.DISPLAY_CONTENT_TYPE.BOTH;
        }

        return displayContent;
    };

    presenter.validateModel = function (model) {
        var text = presenter.validateString(model.Text);
        var image = presenter.validateString(model.Image);
        var selectedText = presenter.validateString(model["Text selected"]);
        var selectedImage = presenter.validateString(model["Image selected"]);
        var imageAlternativeText = presenter.validateString(model["imageAlternativeText"]);
        var imageSelectedAlternativeText = presenter.validateString(model["imageSelectedAlternativeText"]);
        var langTag = presenter.validateString(model["langAttribute"]);

        var isDisabled = ModelValidationUtils.validateBoolean(model.Disable);
        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        var isSelected = ModelValidationUtils.validateBoolean(model.isSelected);
        var isTabindexEnabled = ModelValidationUtils.validateBoolean(model["Is Tabindex Enabled"]);
        var enableCheckMode = ModelValidationUtils.validateBoolean(model["Do not block in check mode"]);
        var renderSVGAsHTML = ModelValidationUtils.validateBoolean(model.renderSVGAsHTML);
        var omitTextInTTS = ModelValidationUtils.validateBoolean(model.omitTextInTTS);
        var width = +model.Width;
        var height = +model.Height;

        presenter.setSpeechTexts(model['speechTexts']);

        return {
            addonID: model.ID,
            selected: {
                text: selectedText.value,
                image: selectedImage.value,
                imageAlternativeText: imageSelectedAlternativeText.value,
                event: model.onSelected,
                displayContent: presenter.determineDisplayContent(selectedText, selectedImage)
            },
            deselected: {
                text: text.value,
                image: image.value,
                imageAlternativeText: imageAlternativeText.value,
                event: model.onDeselected,
                displayContent: presenter.determineDisplayContent(text, image)
            },
            isSelected: isSelected,
            isSelectedByDefault: isSelected,
            isDisabled: isDisabled,
            isDisabledByDefault: isDisabled,
            isVisible: isVisible,
            isVisibleByDefault: isVisible,
            isErrorMode: false,
            isTabindexEnabled: isTabindexEnabled,
            enableCheckMode: enableCheckMode,
            langTag: langTag,
            renderSVGAsHTML: renderSVGAsHTML,
            width: width,
            height: height,
            omitTextInTTS: omitTextInTTS
        };
    };

    presenter.setSpeechTexts = function (speechTexts) {
        speechTexts = getSpeechTexts(speechTexts);

        presenter.speechTexts = {
            selectButton: getSpeechTextProperty(speechTexts.selectButton.selectButton, DEFAULT_TTS_PHRASES.SELECT_BUTTON),
            deselectButton: getSpeechTextProperty(speechTexts.deselectButton.deselectButton, DEFAULT_TTS_PHRASES.DESELECT_BUTTON),
            speechTextDisabled: ModelValidationUtils.validateBoolean(speechTexts.speechTextDisabled.speechTextDisabled),
            disabledButton: getSpeechTextProperty(speechTexts.disabledButton.disabledButton, DEFAULT_TTS_PHRASES.DISABLED_BUTTON)
        };
    };

    function getSpeechTexts (speechTexts) {
        if (!speechTexts) {
            speechTexts = {
                selectButton: {selectButton: DEFAULT_TTS_PHRASES.SELECT_BUTTON},
                deselectButton: {deselectButton: DEFAULT_TTS_PHRASES.DESELECT_BUTTON},
                speechTextDisabled: {speechTextDisabled: "False"}
            };
        }

        if (!speechTexts.hasOwnProperty('disabledButton')) {
            speechTexts['disabledButton'] = {disabledButton: DEFAULT_TTS_PHRASES.DISABLED_BUTTON}
        }

        return speechTexts;
    }

    function getSpeechTextProperty(value, defaultValue) {
        if (value === undefined || value === null || value.trim() === '')
            return defaultValue;
        return value.trim();
    }

    presenter.createEventData = function() {
        return {
            source : presenter.configuration.addonID,
            item : '',
            value : presenter.isSelected() ? '1' : '0',
            score : ''
        };
    };

    presenter.sendEventData = function () {
        var eventData = presenter.createEventData();
        if (playerController !== null) {
            playerController.getEventBus().sendEvent('ValueChanged', eventData);
        }
    };

    presenter.setShowErrorsMode = function () {
        presenter.configuration.isErrorMode = true;
    };

    presenter.setWorkMode = function () {
        presenter.configuration.isErrorMode = false;
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") {
            presenter.configuration.isErrorMode = true;
        }

        if (eventName == "HideAnswers") {
            presenter.configuration.isErrorMode = false;
        }
    };

    presenter.keyboardController = function (keyCode, isShift, event) {
        if (event) {
            event.stopPropagation();

            if (keyCode === window.KeyboardControllerKeys.SPACE ||
                keyCode === window.KeyboardControllerKeys.ARROW_UP ||
                keyCode === window.KeyboardControllerKeys.ARROW_DOWN ||
                keyCode === window.KeyboardControllerKeys.ESCAPE
            ) {
                event.preventDefault();
            }
        }

        if (keyCode === window.KeyboardControllerKeys.ENTER) {
            if (isWCAGOn)
                presenter.speakEnterAction();
        }

        if (keyCode == window.KeyboardControllerKeys.SPACE) {
            presenter.clickHandler();
            if(presenter.canSpeakSpaceAction())
                presenter.speakSpaceAction();
        }
    };

    presenter.canSpeakSpaceAction = function() {
        return isWCAGOn && !presenter.configuration.isErrorMode && !presenter.configuration.enableCheckMode && !presenter.speechTexts.speechTextDisabled;
    };

    presenter.speakEnterAction = function() {
        var textVoices = [];
        var lang = presenter.configuration.langTag.value;

        if (presenter.configuration.isSelected) {
            if (!presenter.configuration.omitTextInTTS) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.configuration.selected.text, lang));
            }

            var imageAlternativeText = presenter.configuration.selected.imageAlternativeText;
            if (imageAlternativeText)
                textVoices.push(window.TTSUtils.getTextVoiceObject(imageAlternativeText));

            textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.selectButton));
        } else {
            if (!presenter.configuration.omitTextInTTS) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.configuration.deselected.text, lang));
            }
            var imageAlternativeText = presenter.configuration.deselected.imageAlternativeText;
            if (imageAlternativeText)
                textVoices.push(window.TTSUtils.getTextVoiceObject(imageAlternativeText))
        }

        if (presenter.configuration.isDisabled && !presenter.useWithoutDisable) {
            textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.disabledButton))
        }

        speak(textVoices);
    };

    presenter.speakSpaceAction = function() {
        var textVoices = [];
        if (presenter.configuration.isDisabled && !presenter.useWithoutDisable) {
            textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.disabledButton))
        } else {
            if (presenter.configuration.isSelected) {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.selectButton));
            } else {
                textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.deselectButton));
            }
        }

        speak(textVoices);
    };

    presenter.setTabindex = function (element, isTabindexEnabled) {
        var tabindexValue = isTabindexEnabled ? "0" : "-1";
        element.attr("tabindex", tabindexValue);
    };

    presenter.setWCAGStatus = function (isOn) {
        isWCAGOn = isOn;
    };

    function speak (data) {
        var tts = presenter.getTextToSpeechOrNull(playerController);
        if (tts) {
            tts.speak(data);
        }
    }

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.getTitlePostfix = function () {
        if(presenter.configuration.isSelected) {
            return presenter.speechTexts.selected;
        } else {
            return ''
        }
    };

    presenter.destroy = function(event) {
        if (event.target === presenter.view) {
            presenter.wrapper.removeEventListener("keydown", presenter.handleKeyboardEvents);

            var element = presenter.$view.find('div[class*=doublestate-button-element]:first');
            element.off("touchstart", touchStartEventHandler);
            element.off("touchend", touchEndEventHandler);

            element.off("mousedown", mouseDownEventHandler);
            element.off("click", clickEventHandler);
            element.off("mouseup", mouseUpEventHandler);
        }
    };

    return presenter;
}
