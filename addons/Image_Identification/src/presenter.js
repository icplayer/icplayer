function AddonImage_Identification_create(){
    var presenter = function() {};

    var playerController;
    var eventBus;
    var isWCAGOn = false;

    presenter.isGradualShowAnswersActive = false;
    presenter.printableState = null;
    presenter.printableStateMode = 0;
    presenter.GSAcounter = 0;
    presenter.PRINTABLE_STATE_MODE = {
        EMPTY: 0,
        SHOW_ANSWERS: 1,
        SHOW_USER_ANSWERS: 2,
        CHECK_ANSWERS: 3
    };

    presenter.lastEvent = null;
    presenter.isDisabled = false;

    var CSS_CLASSES = {
        ELEMENT : "image-identification-element",
        SELECTED : "image-identification-element-selected",
        CORRECT : "image-identification-element-correct",
        EMPTY : "image-identification-element-empty",
        INCORRECT : "image-identification-element-incorrect",
        MOUSE_HOVER : "image-identification-element-mouse-hover",
        SHOW_ANSWERS : "image-identification-element-show-answers",
        MOUSE_HOVER_SELECTED: "image-identification-element-selected-mouse-hover",
        IS_DISABLED: "image-identification-element-disabled"
    };

    /**
     * @return {string}
     */
    function CSS_CLASSESToString() {
        return CSS_CLASSES.ELEMENT + " " + CSS_CLASSES.SELECTED + " " + CSS_CLASSES.CORRECT + " " +
            CSS_CLASSES.EMPTY + " " + CSS_CLASSES.INCORRECT + " " + CSS_CLASSES.MOUSE_HOVER + " " +
            CSS_CLASSES.SHOW_ANSWERS + " " + CSS_CLASSES.MOUSE_HOVER_SELECTED + " " + CSS_CLASSES.IS_DISABLED;
    }

    function clickLogic() {
        if(presenter.isDisabled){
            return;
        }

        if (presenter.configuration.isErrorCheckMode && (presenter.configuration.isActivity || presenter.configuration.isBlockedInErrorCheckingMode)) return;
        presenter.toggleSelectionState(true);
        applySelectionStyle(presenter.configuration.isSelected, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);

        var score = presenter.configuration.shouldBeSelected ? 1 : 0;
        if(score == 0 && presenter.configuration.blockWrongAnswers) {
            presenter.toggleSelectionState(false);
            applySelectionStyle(presenter.configuration.isSelected, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
        }
    }

    presenter.handleMouseActions = function() {
        var $element = presenter.$view.find('div:first');

        $element.hover(
            function() {
                if (presenter.configuration.isErrorCheckMode && (presenter.configuration.isActivity || presenter.configuration.isBlockedInErrorCheckingMode)) return;

                if (presenter.configuration.isHoverEnabled) {
                    $(this).removeClass(CSS_CLASSESToString());
                    $(this).addClass('image-identification-element-mouse-hover');
                    if(presenter.configuration.isSelected){
                        $(this).addClass('image-identification-element-selected-mouse-hover');
                    }
                    presenter.isDisabled ? presenter.disable() : presenter.enable();
                }
            },
            function() {
                if (presenter.configuration.isErrorCheckMode && (presenter.configuration.isActivity || presenter.configuration.isBlockedInErrorCheckingMode)) return;

                if (presenter.configuration.isHoverEnabled) {
                    $(this).removeClass(CSS_CLASSESToString());
                    $(this).addClass(presenter.configuration.isSelected ? CSS_CLASSES.SELECTED : CSS_CLASSES.ELEMENT);
                    presenter.isDisabled ? presenter.disable() : presenter.enable();
                }
            }
        );

        if (MobileUtils.isEventSupported('touchstart') || MobileUtils.isMobileUserAgent(window.navigator.userAgent)) {
            connectTouchHandlers($element);
        }

        connectClickHandlers($element);
    };

    function connectClickHandlers($element) {
        $element.on('mousedown', function (e) {
            e.preventDefault();
            e.stopPropagation();

            presenter.lastEvent = e;
        });

        $element.on ('mouseup', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if ( presenter.lastEvent.type != e.type ) {
                clickLogic();
            }
        });
    }

    function connectTouchHandlers($element) {
        $element.on('touchstart', function (e) {
            e.preventDefault();
            e.stopPropagation();

            presenter.lastEvent = e;
        });

        $element.on('touchend', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if ( presenter.lastEvent.type != e.type ) {
                clickLogic();
            }
        });
    }

    function setViewDimensions(model) {
        var viewDimensions = DOMOperationsUtils.getOuterDimensions(presenter.$view);
        var viewDistances = DOMOperationsUtils.calculateOuterDistances(viewDimensions);

        presenter.$view.css({
            width:(model.Width - viewDistances.horizontal) + 'px',
            height:(model.Height - viewDistances.vertical) + 'px'
        });
    }

    function loadImage(imageSrc, isPreview) {
        var image = document.createElement('img');
        var $image = $(image);
        $image.attr('src', imageSrc);
        $image.addClass(presenter.configuration.isSelected ? CSS_CLASSES.SELECTED : CSS_CLASSES.ELEMENT);
        presenter.$view.html(image);

        presenter.setVisibility(presenter.configuration.isVisibleByDefault || isPreview);

        if (presenter.configuration.altText !== undefined) {
            $image.attr("alt", presenter.configuration.altText);
        }

        $image.load(function () {
            var elementDimensions = DOMOperationsUtils.getOuterDimensions(this);
            var elementDistances = DOMOperationsUtils.calculateOuterDistances(elementDimensions);

            $(this).remove();

            var element = document.createElement('div');
            var innerElement = document.createElement('div');
            $(element).addClass(presenter.configuration.isSelected ? CSS_CLASSES.SELECTED : CSS_CLASSES.ELEMENT);
            $(element).css({
                width:(presenter.$view.width() - elementDistances.horizontal) + 'px',
                height:(presenter.$view.height() - elementDistances.vertical) + 'px'
            });

            $(innerElement).addClass('image-identification-background-image');
            $(innerElement).css({
                backgroundImage:"url('" + imageSrc + "')",
                width:$(element).width() + 'px',
                height:$(element).height() + 'px',
                color: 'rgba(0,0,0,0.0)'
            });

            $(element).html(innerElement);
            presenter.$view.html(element);

            if (!isPreview) {
                presenter.handleMouseActions();
            }

            presenter.configuration.isDisabled ? presenter.disable() : presenter.enable();

            presenter.$view.trigger("onLoadImageCallbackEnd", []);
            presenter.configuration.isImageLoaded = true;

            $(element).on("click", function(e){
                e.preventDefault();
                e.stopPropagation();
            });
        });
    }

    function presenterLogic(view, model, preview) {
        presenter.$view = $(view);
        model = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(model);

        setViewDimensions(model);

        if (ModelValidationUtils.isStringEmpty(presenter.configuration.imageSrc)) {
            return;
        }

        loadImage(presenter.configuration.imageSrc, preview);
        presenter.setTabindex(presenter.$view, presenter.configuration.isTabindexEnabled);

    }

    presenter.validateModel = function (model) {
        var newSpeechTexts = setSpeechTexts(model['speechTexts']);
        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        var isTabindexEnabled = ModelValidationUtils.validateBoolean(model["Is Tabindex Enabled"]);

        return {
            addonID: model.ID,
            isVisible: isVisible,
            isVisibleByDefault: isVisible,
            isSelected: false,
            imageSrc: model.Image,
            shouldBeSelected: ModelValidationUtils.validateBoolean(model.SelectionCorrect),
            isHoverEnabled: true,
            isActivity: !ModelValidationUtils.validateBoolean(model["Is not an activity"]),
            isBlockedInErrorCheckingMode: ModelValidationUtils.validateBoolean(model["Block in error checking mode"]),
            isErrorCheckMode: false,
            blockWrongAnswers: ModelValidationUtils.validateBoolean(model.blockWrongAnswers),
            isTabindexEnabled: isTabindexEnabled,
            altText: model["Alt text"],
            isDisabled: ModelValidationUtils.validateBoolean(model["Is Disabled"]),
            langTag: model["langAttribute"],
            speechTexts: newSpeechTexts
        };
    };

    presenter.upgradeModel = function (model) {
        return presenter.upgradeFrom_01(model);
    };

    presenter.upgradeFrom_01 = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["langAttribute"]) {
            upgradedModel["langAttribute"] = '';
        }

        if (!upgradedModel["speechTexts"]) {
            upgradedModel["speechTexts"] = {
                Selected: {Selected: 'Selected'},
                Deselected: {Deselected: 'Deselected'},
                Correct: {Correct: 'Correct'},
                Wrong: {Wrong: 'Wrong'}
            };
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
        var newSpeechTexts = {
            selected:  'selected',
            deselected: 'deselected',
            correct: 'correct',
            wrong: 'wrong'
        };

        if (!speechTexts) {
            return newSpeechTexts;
        }

        newSpeechTexts = {
            selected:     getSpeechTextProperty(speechTexts['Selected']['Selected'], newSpeechTexts.selected),
            deselected:   getSpeechTextProperty(speechTexts['Deselected']['Deselected'], newSpeechTexts.deselected),
            correct:      getSpeechTextProperty(speechTexts['Correct']['Correct'], newSpeechTexts.correct),
            wrong:        getSpeechTextProperty(speechTexts['Wrong']['Wrong'], newSpeechTexts.wrong)
        };

        return newSpeechTexts;
    }

    function applySelectionStyle(selected, selectedClass, unselectedClass) {
        var element = presenter.$view.find('div:first')[0];

        $(element).removeClass(CSS_CLASSESToString());
        $(element).addClass(selected ? selectedClass : unselectedClass);
    }

    presenter.executeCommand = function(name, params) {
        if (presenter.configuration.isActivity && presenter.configuration.isErrorCheckMode) return;

        var commands = {
            'select': presenter.select,
            'deselect': presenter.deselect,
            'isAllOK': presenter.isAllOK,
            'show': presenter.show,
            'hide': presenter.hide,
            'isSelected': presenter.isSelected,
            'markAsCorrect': presenter.markAsCorrect,
            'markAsWrong': presenter.markAsWrong,
            'markAsEmpty': presenter.markAsEmpty,
            'removeMark': presenter.removeMark,
            'showAnswers': presenter.showAnswers,
            'hideAnswers': presenter.hideAnswers,
            'disable': presenter.disable,
            'enable': presenter.enable
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.disable = function() {
        presenter.isDisabled = true;
        var $element = presenter.$view.find('div:first');
        $($element).addClass('image-identification-element-disabled');
    };

    presenter.enable = function() {
        presenter.isDisabled = false;
        var $element = presenter.$view.find('div:first');
        $($element).removeClass('image-identification-element-disabled');
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function() {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function(view, model){
        presenter.eventBus = playerController.getEventBus();
        addonID = model.ID;

        presenterLogic(view, model, false);

        var events = ['ShowAnswers', 'HideAnswers', 'GradualShowAnswers', 'GradualHideAnswers'];
        for (var i = 0; i < events.length; i++) {
            presenter.eventBus.addEventListener(events[i], this);
        }
    };

    presenter.reset = function() {
        presenter.configuration.isSelected = false;
        presenter.configuration.isErrorCheckMode = false;

        applySelectionStyle(false, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);

        if (presenter.configuration.isVisibleByDefault) {
            presenter.show();
        } else {
            presenter.hide();
        }

        presenter.configuration.isDisabled ? presenter.disable() : presenter.enable();
    };

    presenter.setWorkMode = function() {
        presenter.configuration.isErrorCheckMode = false;

        if (!presenter.configuration.isActivity) return;

        applySelectionStyle(presenter.configuration.isSelected, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);

        presenter.isDisabled ? presenter.disable() : presenter.enable()
    };

    presenter.setShowErrorsMode = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        presenter.configuration.isErrorCheckMode = true;

        if (!presenter.configuration.isActivity) return;

        if (presenter.configuration.isSelected) {
            applySelectionStyle(presenter.configuration.isSelected === presenter.configuration.shouldBeSelected, CSS_CLASSES.CORRECT, CSS_CLASSES.INCORRECT);
        } else {
            applySelectionStyle(true, CSS_CLASSES.EMPTY, CSS_CLASSES.ELEMENT);
        }

        presenter.isDisabled ? presenter.disable() : presenter.enable()
    };

    presenter.getErrorCount = function() {
        if (!presenter.configuration.isActivity) return 0;

        if (!presenter.configuration.shouldBeSelected) {
            return presenter.configuration.isSelected ? 1 : 0;
        }
        return 0;
    };

    presenter.getMaxScore = function() {
        if (!presenter.configuration.isActivity) return 0;

        if (presenter.configuration.shouldBeSelected) {
            return 1;
        } else {
            return 0;
        }
    };

    presenter.getScore = function() {
        if (!presenter.configuration.isActivity) return 0;

        if (presenter.configuration.shouldBeSelected) {
            return presenter.configuration.isSelected ? 1 : 0;
        }
        return 0;
    };

    presenter.getState = function() {
        return JSON.stringify({
            isSelected: presenter.configuration.isSelected,
            isVisible: presenter.configuration.isVisible,
            isDisabled: presenter.isDisabled
        });
    };

    function loadImageEndCallback() {
        applySelectionStyle(presenter.configuration.isSelected, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
        presenter.isDisabled ? presenter.disable() : presenter.enable();
        presenter.setVisibility(presenter.configuration.isVisible);
    }

    presenter.setState = function(stateString) {
        if (ModelValidationUtils.isStringEmpty(stateString)) return;

        var state = JSON.parse(stateString);
        presenter.configuration.isSelected = state.isSelected;
        presenter.configuration.isVisible = state.isVisible;

        presenter.$view.bind("onLoadImageCallbackEnd", function () {
            if(state.isDisabled !== undefined){
                presenter.isDisabled = state.isDisabled;
            }
            loadImageEndCallback();
        });

        if (presenter.configuration.isImageLoaded) {
            if(state.isDisabled !== undefined){
                presenter.isDisabled = state.isDisabled;
            }
            loadImageEndCallback();
        }
    };

    presenter.createEventData = function(isSelected, shouldBeSelected) {
        var score;
        if (presenter.configuration.isActivity){
            score = shouldBeSelected ? '1' : '0';
        } else {
            score = 0;
        }

        return {
            source : presenter.configuration.addonID,
            item : '',
            value : isSelected ? '1' : '0',
            score : score
        };
    };

    presenter.triggerSelectionEvent = function(isSelected, shouldBeSelected) {
        var eventData = this.createEventData(isSelected, shouldBeSelected);

        if (playerController != null) {
            playerController.getEventBus().sendEvent('ValueChanged', eventData);
        }
    };

    presenter.setPlayerController = function(controller) {
        playerController = controller;
    };

    presenter.select = function (dontSendEvent) {
        presenter.configuration.isSelected = true;
        if (!dontSendEvent) {
            presenter.triggerSelectionEvent(true, presenter.configuration.shouldBeSelected);
        }
        applySelectionStyle(true, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
    };

    presenter.deselect = function (dontSendEvent) {
        presenter.configuration.isSelected = false;
        if (!dontSendEvent) {
            presenter.triggerSelectionEvent(false, presenter.configuration.shouldBeSelected);
        }
        applySelectionStyle(false, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
    };

    presenter.toggleSelectionState = function(shouldSendEvent) {
        presenter.configuration.isSelected = !presenter.configuration.isSelected;

        if(shouldSendEvent){
            presenter.triggerSelectionEvent(presenter.configuration.isSelected, presenter.configuration.shouldBeSelected);
        }

        if (isWCAGOn) {
            var speechVoices = [];
            if (presenter.configuration.isSelected) {
                speechVoices.push(window.TTSUtils.getTextVoiceObject(presenter.configuration.speechTexts.selected));
            } else {
                speechVoices.push(window.TTSUtils.getTextVoiceObject(presenter.configuration.speechTexts.deselected));
            }
            speak(speechVoices);
        }
    };

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
    };

    presenter.isSelected = function () {
        return presenter.configuration.isSelected;
    };

    presenter.markAsCorrect = function() {
        presenter.configuration.isHoverEnabled = false;
        presenter.configuration.isMarked = true;

        // Selection can be changed only in activity mode.
        // When module is not in activity mode we want to be able to restore selection after removing mark classes
        if (presenter.configuration.isActivity) {
            presenter.configuration.isSelected = true;
        }

        applySelectionStyle(true, CSS_CLASSES.CORRECT, CSS_CLASSES.ELEMENT);
    };

    presenter.markAsWrong = function() {
        presenter.configuration.isHoverEnabled = false;
        presenter.configuration.isMarked = true;

        // Selection can be changed only in activity mode.
        // When module is not in activity mode we want to be able to restore selection after removing mark classes
        if (presenter.configuration.isActivity) {
            presenter.configuration.isSelected = true;
        }

        applySelectionStyle(true, CSS_CLASSES.INCORRECT, CSS_CLASSES.ELEMENT);
    };

    presenter.markAsEmpty = function() {
        presenter.configuration.isHoverEnabled = false;
        presenter.configuration.isMarked = true;

        applySelectionStyle(true, CSS_CLASSES.EMPTY, CSS_CLASSES.ELEMENT);
    };

    presenter.removeMark = function() {
        if (!presenter.configuration.isMarked) return;

        presenter.configuration.isHoverEnabled = true;
        presenter.configuration.isMarked = false;

        // Selection can be changed only in activity mode.
        // When module is not in activity mode we want to be able to restore selection after removing mark classes
        if (presenter.configuration.isActivity) {
            presenter.configuration.isSelected = true;
        }

        applySelectionStyle(presenter.configuration.isSelected, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
    };

    presenter.getActivitiesCount = function () {
        if(presenter.configuration.shouldBeSelected) {
            return 1;
        }
        return 0;
    }

    presenter.onEventReceived = function (eventName, data) {
        if (eventName === "ShowAnswers") {
            presenter.showAnswers();
        } else if (eventName === "HideAnswers") {
            presenter.hideAnswers();
        } else if(eventName === "GradualShowAnswers") {
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

    function applySelectionStyleShowAnswers (style){
        var element = presenter.$view.find('div:first')[0];
        $(element).addClass(style);
    }

    function applySelectionStyleHideAnswers (style){
        var element = presenter.$view.find('div:first')[0];

        $(element).removeClass(style);
    }

    presenter.hideStudentAnswersForGSA = function () {
        presenter.isShowAnswersActive = true;
        presenter.configuration.isErrorCheckMode = true;

        presenter.$view.find('.image-identification-element-selected').removeClass(CSS_CLASSES.SELECTED).addClass("image-identification-element was-selected");
    }

    presenter.showAnswers = function () {
        if(!presenter.configuration.isActivity){
            return;
        }

        presenter.isShowAnswersActive = true;

        presenter.configuration.isErrorCheckMode = true;

        presenter.$view.find('.image-identification-element-incorrect').removeClass(CSS_CLASSES.INCORRECT).addClass("image-identification-element was-selected");
        presenter.$view.find('.image-identification-element-correct').removeClass(CSS_CLASSES.CORRECT).addClass("image-identification-element was-selected");

        if(presenter.configuration.shouldBeSelected){
            applySelectionStyleShowAnswers(CSS_CLASSES.SHOW_ANSWERS);
        }else{
            presenter.$view.find('.image-identification-element-selected').removeClass(CSS_CLASSES.SELECTED).addClass("image-identification-element was-selected");
        }
    };

    presenter.hideAnswers = function () {
        if(!presenter.configuration.isActivity || !presenter.isShowAnswersActive) {
            return;
        }

        presenter.configuration.isErrorCheckMode = false;

        applySelectionStyleHideAnswers(CSS_CLASSES.SHOW_ANSWERS);

         var elementWasSelected = presenter.$view.find('.was-selected');
         $(elementWasSelected).addClass(CSS_CLASSES.SELECTED).removeClass("was-selected");

        presenter.isShowAnswersActive = false;
        presenter.GSAcounter = 0;
    };

    presenter.keyboardController = function(keycode, isShiftKeyDown, event) {
        event.preventDefault();

        if (keycode === window.KeyboardControllerKeys.SPACE) {
            clickLogic();
        } else if (keycode === window.KeyboardControllerKeys.ENTER) {
            presenter.readAltText();
        }
    };

    presenter.setTabindex = function (element, isTabindexEnabled) {
        var tabindexValue = isTabindexEnabled ? "0" : "-1";
        element.attr("tabindex", tabindexValue);
    };

    presenter.readAltText = function() {
        var speechVoices = [];
        speechVoices.push(window.TTSUtils.getTextVoiceObject(presenter.configuration.altText, presenter.configuration.langTag));

        if( (presenter.configuration.isSelected && !presenter.isShowAnswersActive) || (presenter.isShowAnswersActive && presenter.configuration.shouldBeSelected)) {
            speechVoices.push(window.TTSUtils.getTextVoiceObject(presenter.configuration.speechTexts.selected));
        }

        if( presenter.$view.find('.' + CSS_CLASSES.CORRECT).size() > 0) {
            speechVoices.push(window.TTSUtils.getTextVoiceObject(presenter.configuration.speechTexts.correct));
        } else if( presenter.$view.find('.' + CSS_CLASSES.INCORRECT).size() > 0) {
            speechVoices.push(window.TTSUtils.getTextVoiceObject(presenter.configuration.speechTexts.wrong));
        }
        speak(speechVoices);
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

    presenter.isEnterable = function() {return false};

    function isPrintableEmptyAnswersStateMode () {
        return presenter.printableStateMode === presenter.PRINTABLE_STATE_MODE.EMPTY;
    }
    function isPrintableShowAnswersStateMode () {
        return presenter.printableStateMode === presenter.PRINTABLE_STATE_MODE.SHOW_ANSWERS;
    }
    function isPrintableShowUserAnswersStateMode () {
        return presenter.printableStateMode === presenter.PRINTABLE_STATE_MODE.SHOW_USER_ANSWERS;
    }

    function chosePrintableStateMode(showAnswers) {
        if (presenter.printableState) {
            presenter.printableStateMode = showAnswers ? presenter.PRINTABLE_STATE_MODE.CHECK_ANSWERS : presenter.PRINTABLE_STATE_MODE.SHOW_USER_ANSWERS;
        }
        else {
            presenter.printableStateMode = showAnswers ? presenter.PRINTABLE_STATE_MODE.SHOW_ANSWERS : presenter.PRINTABLE_STATE_MODE.EMPTY;
        }        
    }

    function setViewAndImgClasses(viewClass, imageClass, $img, $checkbox) {
        const prefix = 'printable-image-identification';
        const viewClassName = `${prefix}-${viewClass}`;
        const imageClassName = `${prefix}-${imageClass}`;
        $checkbox.addClass(viewClassName);
        $img.addClass(imageClassName);
    }

    presenter.setPrintableState = function(state) {
        if (state === null || ModelValidationUtils.isStringEmpty(state))
            return;
        presenter.printableState = JSON.parse(state);
    }

    presenter.getPrintableHTML = function (model, showAnswers) {
        chosePrintableStateMode(showAnswers);
        model = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(model);
        presenter.$view = $("<div></div>");
        presenter.$view.attr("id", presenter.configuration.addonID);
        presenter.$view.addClass("printable_addon_Image_Identification");

        loadImage(presenter.configuration.imageSrc, true);
        const $img = presenter.$view.find('.image-identification-element');
        $img.removeClass('image-identification-element');

        presenter.$view.prepend("<div class='checkbox-identifier'></div>")
        const $checkbox = presenter.$view.find('.checkbox-identifier')
        $checkbox.removeClass('checkbox-identifier');

        if (isPrintableEmptyAnswersStateMode()) {          
            setViewAndImgClasses('empty-div', 'empty-img', $img, $checkbox);                               // EMPTY STATE
        } else if (isPrintableShowAnswersStateMode()) {                                             // SHOW ANSWERS
            if (presenter.configuration.shouldBeSelected) {
                setViewAndImgClasses('selected-answer-div', 'selected-answer-img', $img, $checkbox);
            } else {
                setViewAndImgClasses('empty-answer-div', 'empty-answer-img', $img, $checkbox);
            }
        } else if (isPrintableShowUserAnswersStateMode()) {                                           // SHOW USER ANSWERS
            if (presenter.printableState.isSelected) {
                setViewAndImgClasses('selected-user-answer-div', 'selected-user-answer-img', $img, $checkbox);
            } else {
                setViewAndImgClasses('empty-user-answer-div', 'empty-user-answer-img', $img, $checkbox);
            }
        } else {                                                                                        // CHECK USER ANSWERS
            if (!presenter.printableState.isSelected && !presenter.configuration.shouldBeSelected) {
                setViewAndImgClasses('empty-correct-answer-div', 'empty-correct-answer-img', $img, $checkbox);
            } else if (!presenter.printableState.isSelected && presenter.configuration.shouldBeSelected) {
                setViewAndImgClasses('empty-incorrect-answer-div', 'empty-incorrect-answer-img', $img, $checkbox);
            } else if (presenter.printableState.isSelected && presenter.configuration.shouldBeSelected) {
                setViewAndImgClasses('selected-correct-answer-div', 'selected-correct-answer-img', $img, $checkbox);
            } else {
                setViewAndImgClasses('selected-incorrect-answer-div', 'selected-incorrect-answer-img', $img, $checkbox);
            }
        }

        return presenter.$view[0].outerHTML;
    };

    return presenter;
}
