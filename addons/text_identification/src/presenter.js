function Addontext_identification_create() {

    function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }

    var presenter = function() {};

    var viewContainer;
    var isHoverEnabled = true;
    
    presenter.playerController = null;
    presenter.eventBus = null;
    presenter.lastEvent = null;
    presenter.isDisabled = false;
    presenter.keyboardControllerObject = null;
    presenter.printableState = null;
    presenter.printableStateMode = null;
    presenter.GSAcounter = 0;
    
    var CSS_CLASSES = {
        ELEMENT : "text-identification-element",
        SELECTED : "text-identification-element-selected",
        CORRECT : "text-identification-element-correct",
        INCORRECT : "text-identification-element-incorrect",
        EMPTY : 'text-identification-element-empty',
        MOUSE_HOVER_SELECTED : "text-identification-element-mouse-hover-selected",
        MOUSE_HOVER : "text-identification-element-mouse-hover",
        SHOW_ANSWERS : "text-identification-element-show-answers",
        PRINTABLE: "printable_addon_Text_Identification",
        PRINTABLE_WRAPPER: "printable_addon_Text_Identification-wrapper",
        PRINTABLE_SELECTED: "printable_addon_Text_Identification-selected",
        PRINTABLE_SHOW_ANSWERS: "printable_addon_Text_Identification-show-answers",
        PRINTABLE_SHOW_USER_ANSWERS: "printable_addon_Text_Identification-show-user-answers",
        PRINTABLE_CORRECT : "printable_addon_Text_Identification-correct",
        PRINTABLE_CORRECT_ANSWER: "printable_addon_Text_Identification-correct-answer",
        PRINTABLE_INCORRECT_ANSWER: "printable_addon_Text_Identification-incorrect-answer"
    };

    function CSS_CLASSESToString() {
        return CSS_CLASSES.ELEMENT + " " + CSS_CLASSES.SELECTED + " " + CSS_CLASSES.CORRECT + " " +
            CSS_CLASSES.INCORRECT + " " + CSS_CLASSES.EMPTY + " " + CSS_CLASSES.MOUSE_HOVER + " " + CSS_CLASSES.MOUSE_HOVER_SELECTED+ " " + CSS_CLASSES.SHOW_ANSWERS;
    }

    presenter.executeUserEventCode = function () {
        if (presenter.playerController == null) return;

        if (!presenter.isSelected()) {
            if (presenter.configuration.onDeselected) {
                presenter.playerController.getCommands().executeEventCode(presenter.configuration.onDeselected);
            }
        } else {
            if (presenter.configuration.onSelected) {
                presenter.playerController.getCommands().executeEventCode(presenter.configuration.onSelected);
            }
        }
    };

    presenter.triggerSelectionChangeEvent = function() {
        if (presenter.playerController == null) return;

        presenter.playerController.getEventBus().sendEvent('ValueChanged', this.createEventData());
    };

    presenter.clickHandler = function (e) {
        if(presenter.isDisabled){
            return;
        }
        if (e) {
            e.stopPropagation();
        }
        if (presenter.configuration.isErrorCheckMode) return;
        presenter.configuration.isSelected = !presenter.configuration.isSelected;
        presenter.applySelectionStyle(presenter.isSelected(), CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
        presenter.executeUserEventCode();
        presenter.triggerSelectionChangeEvent();
        if (presenter.isAllOK()) sendAllOKEvent();

        var score = presenter.configuration.shouldBeSelected ? 1 : 0;
        if(score == 0 && presenter.configuration.blockWrongAnswers) {
            presenter.configuration.isSelected = !presenter.configuration.isSelected;
            presenter.applySelectionStyle(presenter.isSelected(), CSS_CLASSES.MOUSE_HOVER_SELECTED, CSS_CLASSES.ELEMENT);
        }
    };

    function handleMouseActions() {
        var $element = viewContainer.find('div.text-identification-container');
        if (!MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            $element.hover(
                function () {
                    if (!presenter.configuration.isErrorCheckMode && isHoverEnabled) {
                        $(this).removeClass(CSS_CLASSESToString());
                        $(this).addClass(presenter.isSelected() ? CSS_CLASSES.MOUSE_HOVER_SELECTED : CSS_CLASSES.MOUSE_HOVER);
                    }
                },
                function () {
                    if (!presenter.configuration.isErrorCheckMode && isHoverEnabled) {
                        $(this).removeClass(CSS_CLASSESToString());
                        $(this).addClass(presenter.isSelected() ? CSS_CLASSES.SELECTED : CSS_CLASSES.ELEMENT);
                    }
                }
            );
        }

        if (presenter.configuration.enableScroll) {
            var posDiff = 0;
            var lastScreenPos = {X: 0, Y: 0};

            $element.on('touchstart', function (e) {
                e.stopPropagation();
                posDiff = 0;
                var temp = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] || e.originalEvent.targetTouches[0];
                lastScreenPos.X = temp.screenX;
                lastScreenPos.Y = temp.screenY;
            });

            $element.on('touchend', function (e) {
                e.stopPropagation();
                if (posDiff < 15) {
                    presenter.clickHandler(e);
                }
            });

            $element.on('touchmove', function (e) {
                e.stopPropagation();
                var temp = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] || e.originalEvent.targetTouches[0];
                posDiff += Math.abs(lastScreenPos.X - temp.screenX) + Math.abs(lastScreenPos.Y - temp.screenY);
                lastScreenPos.X = temp.screenX;
                lastScreenPos.Y = temp.screenY;
            });

        } else {
            $element.on('touchstart', function (e) {
                e.preventDefault();

                presenter.lastEvent = e;
            });

            $element.on('touchend', function (e) {
                e.preventDefault();
                if (presenter.lastEvent.type != e.type) {
                    presenter.clickHandler(e);
                }
            });
        }

        if (!MobileUtils.isMobileUserAgent(navigator.userAgent)){
            $element.click(presenter.clickHandler);
        }
    }

    presenter.upgradeModel = function (model) {
        var upgradedModel = presenter.upgradeShouldSendEventsOnCommands(model);
        upgradedModel = upgradeModelEnableScrollProperty(upgradedModel);
        upgradedModel = presenter.upgradeTTS(upgradedModel);
        return upgradedModel;
    };

    function upgradeModelEnableScrollProperty(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if(!upgradedModel['enableScroll']){
            upgradedModel['enableScroll'] = false;
        }

        return upgradedModel;
    }

    presenter.upgradeShouldSendEventsOnCommands = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (model.shouldSendEventsOnCommands === undefined) {
            upgradedModel["shouldSendEventsOnCommands"] = "false";
        }

        return upgradedModel;
    };

    presenter.upgradeTTS = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (model['langAttribute'] === undefined) {
            upgradedModel['langAttribute'] = '';
        }

        return upgradedModel;
    };

    presenter.getSpeechTexts = function (model) {
       var speechTexts = model['Speech texts'];
       presenter.selectedSpeechText = 'Selected';
       presenter.deselectedSpeechText = 'Deselected';
       presenter.correctSpeechText = "Correct";
       presenter.incorrectSpeechText = "Incorrect";

        if (speechTexts !== undefined && speechTexts !== '') {
            if (speechTexts['Selected']['selected'] !== '' && speechTexts['Selected']['selected'] !== undefined) {
                presenter.selectedSpeechText = speechTexts['Selected']['selected'];
            }

            if (speechTexts['Deselected']['deselected'] !== '' && speechTexts['Deselected']['deselected'] !== undefined) {
                presenter.deselectedSpeechText = speechTexts['Deselected']['deselected'];
            }

            if (!ModelValidationUtils.isArrayElementEmpty(speechTexts['Correct']['correct'])) {
                presenter.correctSpeechText = speechTexts['Correct']['correct'];
            }

            if (!ModelValidationUtils.isArrayElementEmpty(speechTexts['Incorrect']['incorrect'])) {
                presenter.incorrectSpeechText = speechTexts['Incorrect']['incorrect'];
            }
        }
    };

    presenter.validateModel = function (model) {
        return {
            addonID: model.ID,
            onSelected: model.onSelected,
            onDeselected: model.onDeselected,
            shouldBeSelected: ModelValidationUtils.validateBoolean(model.SelectionCorrect),
            isSelected: false,
            isErrorCheckMode: false,
            blockWrongAnswers: ModelValidationUtils.validateBoolean(model.blockWrongAnswers),
            shouldSendEventsOnCommands: ModelValidationUtils.validateBoolean(model.shouldSendEventsOnCommands),
            isTabindexEnabled: ModelValidationUtils.validateBoolean(model["Is Tabindex Enabled"]),
            enableScroll: ModelValidationUtils.validateBoolean(model['enableScroll']),
        };
    };

    presenter.centerElements = function ($text, $container) {
        $.when(presenter.mathJaxProcessEnded).then(function () {
            var contentWidth = parseInt($text.css('width'), 10),
                contentHeight = parseInt($text.css('height'), 10),
                containerWidth = parseInt(viewContainer.css('width'), 10),
                containerHeight = parseInt(viewContainer.css('height'), 10);

            $text.css({
                left: Math.round((containerWidth - contentWidth) / 2) + 'px',
                top: Math.round((containerHeight - contentHeight) / 2) + 'px'
            });

            $container.css({
                width: containerWidth + 'px',
                height: containerHeight + 'px'
            });
        });
    };

    function presenterLogic(view, model, isPreview) {
        presenter.registerMathJaxListener(isPreview);

        viewContainer = $(view);
        presenter.$view = $(view);
        presenter.currentPageId = presenter.$view.parent('.ic_page').attr('id');
        var textSrc = model.Text ? model.Text : "";
        presenter.moduleID = model.ID;
        model = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(model);

        presenter.getSpeechTexts(model);
        presenter.langTag = model['langAttribute'];

        presenter.isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        presenter.isVisibleByDefault = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        presenter.setVisibility(presenter.isVisible || isPreview);

        var container = $('<div class="text-identification-container"></div>');
        container.addClass(presenter.isSelected() ? CSS_CLASSES.SELECTED : CSS_CLASSES.ELEMENT);

        presenter.setTabindex(container,presenter.configuration.isTabindexEnabled);

        var text = $('<div class="text-identification-content"></div>');
        if (isPreview) {
            text.html(window.TTSUtils.parsePreviewAltText(textSrc));
        } else {
            text.html(presenter.textParser.parse(textSrc));
        }
        container.append(text);

        viewContainer.append(container);
        presenter.centerElements(text, container);

        if (!isPreview) handleMouseActions();
        presenter.buildKeyboardController();
    }

    presenter.setVisibility = function (isVisible) {
        $(presenter.$view).css('visibility', isVisible ? 'visible' : 'hidden');
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
        presenter.isVisible = false;
    };

    presenter.show = function () {
        presenter.setVisibility(true);
        presenter.isVisible = true;
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
        presenter.textParser = new TextParserProxy(controller.getTextParser());
    };

    /**
     * @param controller (PrintableController)
     */
    presenter.setPrintableController = function (controller) {
        presenter.textParser = new TextParserProxy(controller.getTextParser());
    }

    presenter.applySelectionStyle = function (selected, selectedClass, unselectedClass) {
        var element = viewContainer.find('div:first')[0];

        $(element).removeClass(CSS_CLASSESToString());
        $(element).addClass(selected ? selectedClass : unselectedClass);
    };

    presenter.select = function () {
        var wasSelected = presenter.configuration.isSelected;

        presenter.configuration.isSelected = true;
        presenter.executeUserEventCode();
        presenter.applySelectionStyle(true, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);

        if (!wasSelected && presenter.configuration.shouldSendEventsOnCommands) {
            this.triggerSelectionChangeEvent();
        }

    };

    presenter.deselect = function () {
        var wasSelected = presenter.configuration.isSelected;

        presenter.configuration.isSelected = false;
        presenter.executeUserEventCode();
        presenter.applySelectionStyle(false, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);

        if (wasSelected && presenter.configuration.shouldSendEventsOnCommands) {
            this.triggerSelectionChangeEvent();
        }
    };

    presenter.isSelected = function () {
        return presenter.configuration.isSelected;
    };

    presenter.markAsCorrect = function() {
        isHoverEnabled = false;
        presenter.configuration.isSelected = true;
        presenter.applySelectionStyle(true, CSS_CLASSES.CORRECT, CSS_CLASSES.ELEMENT);
    };

    presenter.markAsWrong = function() {
        isHoverEnabled = false;
        presenter.configuration.isSelected = true;
        presenter.applySelectionStyle(true, CSS_CLASSES.INCORRECT, CSS_CLASSES.ELEMENT);
    };

    presenter.markAsEmpty = function() {
        isHoverEnabled = false;
        presenter.applySelectionStyle(true, CSS_CLASSES.EMPTY, CSS_CLASSES.ELEMENT);
    };

    function sendAllOKEvent() {
        var eventData = {
            'source': presenter.moduleID,
            'item': 'all',
            'value': '',
            'score': ''
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    }

    presenter.executeCommand = function(name, params) {
        if (presenter.configuration.isErrorCheckMode) return;

        var commands = {
            'select': presenter.select,
            'deselect': presenter.deselect,
            'isSelected': presenter.isSelected,
            'markAsCorrect': presenter.markAsCorrect,
            'markAsWrong': presenter.markAsWrong,
            'markAsEmpty': presenter.markAsEmpty,
            'isAllOK': presenter.isAllOK,
            'show': presenter.show,
            'hide': presenter.hide,
            'disable': presenter.disable,
            'enable': presenter.enable
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.disable = function() {
        presenter.isDisabled = true;
        var $element = viewContainer.find('div.text-identification-container');
        $element.addClass("text-identification-element-disabled");
    };

    presenter.enable = function() {
        presenter.isDisabled = false;
        var $element = viewContainer.find('div.text-identification-container');
        $element.removeClass("text-identification-element-disabled");
    };

    presenter.registerMathJaxListener = function (isPreview) {
        var mathJaxDeferred = new jQuery.Deferred();
        presenter.mathJaxProcessEndedDeferred = mathJaxDeferred;
        presenter.mathJaxProcessEnded = mathJaxDeferred.promise();

        MathJax.Hub.Register.MessageHook("End Process", function (message) {
            // We're listening for "End Process" that was fired for ic_page into which addon was inserted.
            // This way we're not reacting on events from other page in Book View.
            if (isPreview || ($(message[1]).hasClass('ic_page') && $(message[1]).is('#' + presenter.currentPageId))) {
                presenter.mathJaxProcessEndedDeferred.resolve();
            }
        });
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function(view, model){
        presenterLogic(view, model, false);

        var events = ['ShowAnswers', 'HideAnswers', 'GradualShowAnswers', 'GradualHideAnswers'];
        for (var i = 0; i < events.length; i++) {
            presenter.eventBus.addEventListener(events[i], this);
        }
    };

    presenter.reset = function() {
        presenter.configuration.isSelected = false;
        presenter.configuration.isErrorCheckMode = false;
        isHoverEnabled = true;
        presenter.applySelectionStyle(presenter.isSelected(), CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
        presenter.setVisibility(presenter.isVisibleByDefault);
        presenter.isVisible = presenter.isVisibleByDefault;
    };

    presenter.setWorkMode = function() {
        presenter.configuration.isErrorCheckMode = false;

        presenter.applySelectionStyle(presenter.isSelected(), CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
    };

    presenter.setShowErrorsMode = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        presenter.configuration.isErrorCheckMode = true;

        if (presenter.isSelected()) {
            presenter.applySelectionStyle(presenter.isSelected() === presenter.configuration.shouldBeSelected, CSS_CLASSES.CORRECT, CSS_CLASSES.INCORRECT);
        } else {
            presenter.applySelectionStyle(true, CSS_CLASSES.EMPTY, CSS_CLASSES.ELEMENT)
        }
    };

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
    };

    presenter.getErrorCount = function() {
        return !presenter.configuration.shouldBeSelected && presenter.isSelected() ? 1 : 0;
    };

    presenter.getMaxScore = function() {
        return presenter.configuration.shouldBeSelected ? 1 : 0;
    };

    presenter.getScore = function() {
        return presenter.configuration.shouldBeSelected && presenter.isSelected() ? 1 : 0;
    };

    presenter.getState = function() {
        //return presenter.isSelected() ? 'True' : 'False';

        return JSON.stringify({
            isSelected: presenter.isSelected() ? 'True' : 'False',
            isVisible: presenter.isVisible,
            isDisabled: presenter.isDisabled
        });
    };

    presenter.setState = function(state) {
        var serializeIsSelected, parsedState;
        if (state.indexOf("}") > -1 && state.indexOf("{") > -1){
            parsedState = JSON.parse(state);
            serializeIsSelected = parsedState.isSelected;
        }else{
            serializeIsSelected = state;
            parsedState = undefined;
        }

        presenter.configuration.isSelected = serializeIsSelected.toString() === "True";

        presenter.applySelectionStyle(presenter.isSelected(), CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);

        if(parsedState){
            if(parsedState.isVisible != undefined){
                presenter.setVisibility(parsedState.isVisible);
                presenter.isVisible = parsedState.isVisible;
            }

            if(parsedState.isDisabled != undefined){
                presenter.isDisabled = parsedState.isDisabled;
            }
        }
    };

    presenter.createEventData = function() {
        return {
            'source' : presenter.configuration.addonID,
            'item' : '1',
            'value' : presenter.isSelected() ? '1' : '0',
            'score' : presenter.configuration.shouldBeSelected ? '1' : '0'
        }
    };

    presenter.getActivitiesCount = function () {
        if(presenter.configuration.shouldBeSelected) 
            return 1;
        return 0;
    }

    presenter.onEventReceived = function (eventName, data) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        } else if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        } else if (eventName === "GradualShowAnswers") {
            presenter.GSAcounter++;
            if (!presenter.isGradualShowAnswersActive) {
                presenter.isGradualShowAnswersActive = true;
            }
            if(presenter.GSAcounter === 1) presenter.hideStudentAnswersForGSA();
            if (data.moduleID === presenter.configuration.addonID) {
                presenter.showAnswers();
            }
        } else if (eventName === "GradualHideAnswers") {
            presenter.hideAnswers();
            presenter.isGradualShowAnswersActive = false;
        }
    };

    function applySelectionStyleShowAnswers (style) {
        var element = presenter.$view.find('div:first')[0];
        $(element).addClass(style);
    }

    function applySelectionStyleHideAnswers (style) {
        var element = presenter.$view.find('div:first')[0];

        $(element).removeClass(style);
        $(element).removeClass(CSS_CLASSES.EMPTY).addClass(CSS_CLASSES.ELEMENT);
    }

    presenter.hideStudentAnswersForGSA = function () {
        presenter.isShowAnswersActive = true;
        presenter.configuration.isErrorCheckMode = true;
        
        presenter.$view.find('.text-identification-element-selected').removeClass(CSS_CLASSES.SELECTED).addClass("text-identification-element was-selected");
    }

    presenter.showAnswers = function () {
        presenter.isShowAnswersActive = true;
        presenter.configuration.isErrorCheckMode = true;
        
        presenter.$view.find('.text-identification-element-incorrect').removeClass(CSS_CLASSES.INCORRECT).addClass("text-identification-element was-selected");
        presenter.$view.find('.text-identification-element-correct').removeClass(CSS_CLASSES.CORRECT).addClass("text-identification-element was-selected");

        if(presenter.configuration.shouldBeSelected){
            applySelectionStyleShowAnswers(CSS_CLASSES.SHOW_ANSWERS);
        }else{
            presenter.$view.find('.text-identification-element-selected').removeClass(CSS_CLASSES.SELECTED).addClass("text-identification-element was-selected");
        }
    };

    presenter.hideAnswers = function () {
        if (!presenter.isShowAnswersActive) {
            return;
        }

        presenter.configuration.isErrorCheckMode = false;

        applySelectionStyleHideAnswers(CSS_CLASSES.SHOW_ANSWERS);

        var elementWasSelected = presenter.$view.find('.was-selected');
        $(elementWasSelected).addClass(CSS_CLASSES.SELECTED).removeClass("was-selected");

        presenter.isShowAnswersActive = false;
        presenter.GSAcounter = 0;
    };

    function TextIdentificationKeyboardController (elements, columnsCount) {
        KeyboardController.call(this, elements, columnsCount);
    }

    TextIdentificationKeyboardController.prototype = Object.create(window.KeyboardController.prototype);
    TextIdentificationKeyboardController.prototype.constructor = TextIdentificationKeyboardController;

    TextIdentificationKeyboardController.prototype.enter = function (event) {
        KeyboardController.prototype.enter.call(this, event);

        presenter.readElement();
    };

    TextIdentificationKeyboardController.prototype.getTarget = function (element, willBeClicked) {
        return $(element);
    };

    TextIdentificationKeyboardController.prototype.select = function (event) {
        event.preventDefault();
        presenter.clickHandler(event);

        if (!presenter.isShowAnswersActive && !presenter.configuration.isErrorCheckMode) {
            presenter.readSelected();
        }
    };


    presenter.keyboardController = function(keycode, isShiftKeyDown, event) {
        this.keyboardControllerObject.handle(keycode, isShiftKeyDown, event);
    };

    presenter.buildKeyboardController = function () {
        var element = $(presenter.$view).find('.text-identification-container');

        presenter.keyboardControllerObject = new TextIdentificationKeyboardController(element, 1);
    };

    presenter.readSelected = function () {
        var text, voiceObject;

        if (presenter.isShowAnswersActive) {
            text = presenter.configuration.shouldBeSelected ? presenter.selectedSpeechText : presenter.deselectedSpeechText;
        } else {
            text = presenter.configuration.isSelected ? presenter.selectedSpeechText : presenter.deselectedSpeechText;
        }

        voiceObject = getTextVoiceObject(text);

        speak([voiceObject]);
    };

    presenter.readElement = function () {
        var voiceObjects = window.TTSUtils.getTextVoiceArrayFromElement(presenter.$view.find('.text-identification-content'), presenter.langTag);

        var selectedTextObject = getTextVoiceObject(presenter.selectedSpeechText);

        if (!presenter.isShowAnswersActive && !presenter.configuration.isErrorCheckMode && presenter.configuration.isSelected) {
            voiceObjects.push(selectedTextObject);
        } else if (presenter.isShowAnswersActive && presenter.configuration.isErrorCheckMode && presenter.configuration.shouldBeSelected) {
            voiceObjects.push(selectedTextObject);
        }

        // correctness should be read only when check mode is active and addon is selected
        if (!presenter.isShowAnswersActive && presenter.configuration.isErrorCheckMode &&  presenter.configuration.isSelected) {
            voiceObjects.push(selectedTextObject);

            var isAnswerCorrect = presenter.configuration.isSelected === presenter.configuration.shouldBeSelected;
            var isAnswerCorrectText = isAnswerCorrect ? presenter.correctSpeechText : presenter.incorrectSpeechText;
            voiceObjects.push(getTextVoiceObject(isAnswerCorrectText));
        }

        speak(voiceObjects, presenter.langTag);
    };

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.setTabindex = function (element, isTabindexEnabled) {
        var tabindexValue = isTabindexEnabled ? "0" : "-1";
        element.attr("tabindex", tabindexValue);
    };

    function speak (voiceObjects) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts) {
            tts.speak(voiceObjects);
        }
    }

    presenter.PRINTABLE_STATE_MODE = {
        EMPTY: 0,
        SHOW_ANSWERS: 1,
        SHOW_USER_ANSWERS: 2,
        CHECK_ANSWERS: 3
    };

    presenter.setPrintableState = function(state) {
        if (state === null || ModelValidationUtils.isStringEmpty(state))
            return;

        var serializedIsSelected, parsedState;
        if (state.indexOf("}") > -1 && state.indexOf("{") > -1) {
            parsedState = JSON.parse(state);
            serializedIsSelected = parsedState.isSelected;
        } else {
            parsedState = undefined;
            serializedIsSelected = state;
        }

        presenter.printableState = {};
        presenter.printableState.isSelected = serializedIsSelected.toString() === "True";
        if (parsedState) {
            if(parsedState.isVisible !== undefined)
                presenter.printableState.isVisible = parsedState.isVisible;

            if(parsedState.isDisabled !== undefined)
                presenter.printableState.isDisabled = parsedState.isDisabled;
        }
    }

    presenter.getPrintableHTML = function (model, showAnswers) {
        const text = setUpLogicForPrintable(model);
        setUpPresenterViewForPrintable();
        chosePrintableStateMode(showAnswers);
        addHTMLRepresentationAccordingToPrintableStateMode(text);
        presenter.printableStateMode = null;
        return presenter.$view[0].outerHTML;
    };

    function setUpLogicForPrintable(model) {
        presenter.moduleID = model.ID;
        model = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(model);
        return presenter.textParser.parse(model.Text);
    }

    function setUpPresenterViewForPrintable() {
        presenter.$view = $('<div></div>');
        presenter.$view.addClass(CSS_CLASSES.PRINTABLE);
    }

    function chosePrintableStateMode(showAnswers) {
        if (presenter.printableState) {
            if (showAnswers)
                presenter.printableStateMode = presenter.PRINTABLE_STATE_MODE.CHECK_ANSWERS;
            else
                presenter.printableStateMode = presenter.PRINTABLE_STATE_MODE.SHOW_USER_ANSWERS;
        } else {
            if (showAnswers)
                presenter.printableStateMode = presenter.PRINTABLE_STATE_MODE.SHOW_ANSWERS;
            else
                presenter.printableStateMode = presenter.PRINTABLE_STATE_MODE.EMPTY;
        }
    }

    function addHTMLRepresentationAccordingToPrintableStateMode(text) {
        switch (presenter.printableStateMode) {
            case presenter.PRINTABLE_STATE_MODE.CHECK_ANSWERS:
                addHTMLRepresentationForCheckAnswersPrintableStateMode(text);
                break;
            case presenter.PRINTABLE_STATE_MODE.SHOW_USER_ANSWERS:
                addHTMLRepresentationForShowUserAnswersPrintableStateMode(text);
                break;
            case presenter.PRINTABLE_STATE_MODE.SHOW_ANSWERS:
                addHTMLRepresentationForShowAnswersPrintableStateMode(text);
                break;
            case presenter.PRINTABLE_STATE_MODE.EMPTY:
                addHTMLRepresentationForEmptyPrintableStateMode(text);
                break;
        }
    }

    function addHTMLRepresentationForCheckAnswersPrintableStateMode(text) {
        var $wrapper = createPrintableAddonWrapper(text);
        if (presenter.printableState.isSelected)
            $wrapper.addClass(CSS_CLASSES.PRINTABLE_SELECTED);
        presenter.$view.append($wrapper);
        addHTMLRepresentingCorrectnessOfAnswer();
    }

    function addHTMLRepresentingCorrectnessOfAnswer() {
        if (presenter.printableState.isSelected) {
            var $element = $('<div></div>');

            if (presenter.configuration.shouldBeSelected)
                $element.addClass(CSS_CLASSES.PRINTABLE_CORRECT_ANSWER)
            else
                $element.addClass(CSS_CLASSES.PRINTABLE_INCORRECT_ANSWER)

            presenter.$view.append($element);
        }
    }

    function addHTMLRepresentationForShowUserAnswersPrintableStateMode(text) {
        var $wrapper = createPrintableAddonWrapper(text);
        $wrapper.addClass(CSS_CLASSES.PRINTABLE_SHOW_USER_ANSWERS);
        if (presenter.printableState.isSelected)
            $wrapper.addClass(CSS_CLASSES.PRINTABLE_SELECTED);
        presenter.$view.append($wrapper);
    }

    function addHTMLRepresentationForShowAnswersPrintableStateMode(text) {
        var $wrapper = createPrintableAddonWrapper(text);
        $wrapper.addClass(CSS_CLASSES.PRINTABLE_SHOW_ANSWERS);
        if (presenter.configuration.shouldBeSelected)
            $wrapper.addClass(CSS_CLASSES.PRINTABLE_CORRECT);
        presenter.$view.append($wrapper);
    }

    function addHTMLRepresentationForEmptyPrintableStateMode(text) {
        var $wrapper = createPrintableAddonWrapper(text);
        presenter.$view.append($wrapper);
    }

    function createPrintableAddonWrapper(text) {
        var $wrapper = $('<div></div>');
        $wrapper.addClass(CSS_CLASSES.PRINTABLE_WRAPPER);
        var textSrc = text ? text : "";
        $wrapper.html(textSrc);
        return $wrapper;
    }

    return presenter;
}
