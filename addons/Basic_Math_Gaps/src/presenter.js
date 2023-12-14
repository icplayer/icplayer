function AddonBasic_Math_Gaps_create(){

    var presenter = function(){};

    presenter.eventBus = null;
    presenter.playerController = null;
    presenter.gapsContainer = null;
    presenter.widgetsFactory = null;
    presenter.lastDraggedItem = null;

    presenter.setPlayerController = function (controller) {
        this.playerController = controller;
    };

    presenter.setEventBus = function(wrappedEventBus) {
        presenter.eventBus = wrappedEventBus;
    };

    presenter.getErrorObject = function (errorCode) {
        return {
            'isError' : true,
            'errorCode' : errorCode
        };
    };

    presenter.errorCodes = {
        'E01' : 'Left side is not equal to Right side.',
        'E02' : 'A space can NOT be a decimal separator.',
        'E03' : 'Gaps Definition can NOT be blank',
        'E04' : 'Gap width must be positive integer',
        'E05' : 'Sign must be other than =, [, ]',
        'E06' : 'Equation needs \'=\' sign to be a equation'
    };

    presenter.createPreview = function(view, model){
        runLogic(view, model, true);
    };

    presenter.run = function(view, model){
        runLogic(view, model, false);

        presenter.setOnEventListeners();
    };

    presenter.setOnEventListeners = function () {
        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
        presenter.eventBus.addEventListener('ItemSelected', this);
        presenter.eventBus.addEventListener('ItemConsumed', this);
    };

    presenter.upgradeModel = function (model) {
        var nModel = presenter.upgradeGapType(model);
        nModel = presenter.upgradeNumericKeyboard(nModel);
        return presenter.upgradeUserActionEvents(nModel);
    };

    presenter.upgradeGapType = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if(model.gapType == undefined) {
            upgradedModel["gapType"] = "Editable";
        }

        return upgradedModel;
    };

    presenter.upgradeNumericKeyboard = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if(model.useNumericKeyboard === undefined) {
            upgradedModel["useNumericKeyboard"] = "False";
            }

        return upgradedModel;
    };

    presenter.upgradeUserActionEvents = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if (model['userActionEvents'] === undefined) {
            upgradedModel['userActionEvents'] = 'False';
        }

        return upgradedModel;
    };

    function deleteCommands() {
        delete presenter.getState;
        delete presenter.setState;
        delete presenter.getScore;
        delete presenter.getMaxScore;
        delete presenter.disable;
        delete presenter.enable;
    }

    function runLogic(view, model, isPreview) {
        var upgradedModel = presenter.upgradeModel(model);

        presenter.configuration = presenter.validateModel(upgradedModel);
        presenter.$view = $(view);

        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(presenter.$view.find('.basic-math-gaps-container'), presenter.errorCodes, presenter.configuration.errorCode);

            deleteCommands();
            return;
        }

        presenter.gapsContainer = new presenter.GapsContainerObject();
        presenter.widgetsFactory = new presenter.ObjectFactory();
        presenter.valueChangeObserver = new presenter.ValueChangeObserver();

        if (isPreview) {
            presenter.eventBus = function () {};
        }

        presenter.createGaps();
        if (!isPreview) {
            presenter.addFocusOutEventListener();
            presenter._addSendEventHandler();
        }

        presenter.$view.find('input').click(function(e) {
            e.stopPropagation();
        });

        presenter.setWrapperCss();

        presenter.setVisibility(presenter.configuration.isVisible || isPreview);
    }

    presenter.createGaps = function () {
        presenter.widgetsFactory.produce(
            presenter.ObjectFactory.PRODUCTION_TYPE.GAP_CONTAINER,
            presenter.configuration.gapsDefinition
        );

        presenter.lastDraggedItem = {};
    };

    presenter.setWrapperCss = function () {
        presenter.$view.find('.basic-math-gaps-wrapper :input').each(function(){
            if (presenter.configuration.gapWidth != '') {
                $(this).css("width", presenter.configuration.gapWidth);
            }
        });
    };

    presenter.addFocusOutEventListener = function () {
        if (presenter.configuration.isDisabled) {
            return;
        }

        presenter._addFocusOutEventListener();
    };

    presenter._addSendEventHandler = function () {
        var inputs = presenter.$view.find('input');
        inputs.on("BMG:send_event", function () {
            var item = presenter.$view.find('input').index( this),
                value = $(this).val().trim(),
                score = (($(this).val().trim() == presenter.configuration.gapsValues[item]) || (presenter.reconvertSign(presenter.configuration.Signs, $(this).val().trim()) == presenter.configuration.gapsValues[item]));

            if (presenter.configuration.isEquation
                && filterInputs(function(element) { return $(element).val().length > 0; }).length != presenter.$view.find('input').length ) {
                return;
            }

            presenter.sendEvent(item, value, score);
        });
    };

    presenter._addFocusOutEventListener = function () {
        var inputs = presenter.$view.find('input');

        if (!presenter.configuration.userActionsEventsEnabled) {
            inputs.focusout(function () {
                $(this).trigger("BMG:send_event");
            });
        }
    };


    function escapeRegexSpecialCharacters(value) {
        return (value + '').replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // escape regex special characters
    }

    function convertDecimalSeparator(value, from, to) {
        if (from == '.') {
            return value;
        }
        var escaped = escapeRegexSpecialCharacters(from);
        return value.replace(new RegExp(escaped, 'g'), to);
    }

    function getValueOfSingleElement(element, isGap, shouldParse) {
        var getGapValuePattern = /\[(.+)\]/,
            isDigitPattern = /\d+/;

        element = isGap ? getGapValuePattern.exec(element)[1] : element.replace(/[\[\]']+/g, '');

        if (isDigitPattern.test(element) && shouldParse) {
            return parseInt(element, 10);
        } else {
            return element;
        }
    }

    // this is for situation when user pass for example: 1 1/2,
    // which from math point of view is an addition but the addition sign should NOT be displayed
    function checkIsHiddenAddition(list, index) {
        var isDigitPattern = /\d+/;
        if ( index >= list.length ) {
            return false;
        }

        if ( isDigitPattern.test(list[index]) && isDigitPattern.test(list[index + 1]) ) {
            return true;
        }

        return false;
    }

    presenter.convertSign = function (signs, value) {
        if (typeof (signs) == "undefined") {
            signs = {Addition: "", Subtraction: "", Division: "", Multiplication: ""};
        }

        if (value === "*" && signs['Multiplication'] !== "") {
            return signs['Multiplication'];
        }
        else if (value === "/" && signs['Division'] !== "") {
            return signs['Division'];
        }
        else if (value === "+" && signs['Addition'] !== "") {
            return signs['Addition'];
        }
        else if (value === "-" && signs['Subtraction'] !== "") {
            return signs['Subtraction'];
        }
        else {
            return value;
        }
    };

    presenter.reconvertSign = function (signs, value) {
        if (typeof (signs) == "undefined") {
            return value;
        }

        switch(value) {
            case signs['Multiplication']:
                return "*";
            case signs['Division']:
                return "/";
            case signs['Addition']:
                return "+";
            case signs['Subtraction']:
                return "-";
            default:
                return value;
        }
    };

    presenter.removeEmptyStringsFromArray = function (stringArray) {
        var resultArray = [];

        var arrayLen = stringArray.length;
        for(var i = 0; i < arrayLen; i++) {
            if (!ModelValidationUtils.isStringEmpty(stringArray[i])) {
                resultArray.push(stringArray[i]);
            }
        }

        return resultArray;
    };

    presenter.validateGapsDefinition = function(model, isEquation, separator, signs) {
        if (model['gapsDefinition'].length === 0) {
            return presenter.getErrorObject('E03');
        }

        var validatedGapsDefinition = [],
            isGapPattern = /^\[.+\]$/,
            splittedGapsBySpace = model['gapsDefinition'].split(' '),
            isFractionPattern = /\d+\]*\/\[*\d+/,
            leftSide = '',
            rightSide = '',
            isLeft = true,
            gapsValues = [];


        splittedGapsBySpace = presenter.removeEmptyStringsFromArray(splittedGapsBySpace);

        $.each(splittedGapsBySpace, function(i) {
            var valueBeforeConvert = splittedGapsBySpace[i],
                value = presenter.convertSign(signs, valueBeforeConvert),
                isGap = isGapPattern.test(value),
                isFraction = isFractionPattern.test(value);

            var gapType = isGap ? presenter.ObjectFactory.PRODUCTION_TYPE.EDITABLE_INPUT_GAP :
                presenter.ObjectFactory.PRODUCTION_TYPE.ELEMENT_GAP;

            var singleElement = {
                gapType: gapType,
                originalForm: value,
                beforeConvert: getValueOfSingleElement(valueBeforeConvert, isGap, false),
                isGap: isGap,
                isFraction: isFraction,
                parsed: getValueOfSingleElement(value, isGap, true),
                notParsed: getValueOfSingleElement(value, isGap, false),
                isHiddenAdditionAfter: checkIsHiddenAddition(splittedGapsBySpace, i)
            };

            if (isFraction) {
                var numerator = value.split('/')[0],
                    denominator = value.split('/')[1],
                    isNumeratorGap = isGapPattern.test(numerator),
                    isDenominatorGap = isGapPattern.test(denominator);

                if (!isGap) {
                    isNumeratorGap = isGapPattern.test(numerator);
                    isDenominatorGap = isGapPattern.test(denominator);
                } else {
                    isNumeratorGap = true;
                    isDenominatorGap = true;
                    numerator += ']';
                    denominator = '[' + denominator;
                }

                singleElement.fraction = {
                    numerator: {
                        isGap: isNumeratorGap,
                        originalForm: numerator,
                        parsed: getValueOfSingleElement(numerator, isNumeratorGap, true),
                        notParsed: getValueOfSingleElement(numerator, isNumeratorGap, false)
                    },
                    denominator: {
                        isGap: isDenominatorGap,
                        originalForm: denominator,
                        parsed: getValueOfSingleElement(denominator, isDenominatorGap, true),
                        notParsed: getValueOfSingleElement(denominator, isDenominatorGap, false)
                    }
                };

                singleElement.gapType = presenter.ObjectFactory.PRODUCTION_TYPE.FRACTION_GAP;

                if(isNumeratorGap) {
                    gapsValues.push(singleElement.fraction.numerator.notParsed);
                }

                if(isDenominatorGap) {
                    gapsValues.push(singleElement.fraction.denominator.notParsed);
                }

            } else if(singleElement.isGap) {
                gapsValues.push(singleElement.notParsed);
            }

            validatedGapsDefinition.push(singleElement);

            if (singleElement.notParsed == '=') {
                isLeft = false;
                return true; // continue in jQuery.each
            }

            if (isLeft) {
                leftSide += singleElement.beforeConvert;
                if (singleElement.isHiddenAdditionAfter) {
                    leftSide += '+';
                }
            } else {
                rightSide += singleElement.beforeConvert;
                if (singleElement.isHiddenAdditionAfter) {
                    rightSide += '+';
                }
            }
        });

        if (isEquation) {
            leftSide = convertDecimalSeparator(leftSide, separator, '.');
            rightSide = convertDecimalSeparator(rightSide, separator, '.');

            try {
                var leftSideEvaluated = eval(leftSide).toFixed(2),
                rightSideEvaluated = eval(rightSide).toFixed(2);
            } catch (_) {
                return presenter.getErrorObject('E06');
            }

            if(leftSideEvaluated != rightSideEvaluated) {
                return presenter.getErrorObject('E01');
            }
        }

        return {
            'isError' : false,
            'allElements' : validatedGapsDefinition,
            'gapsValues' : gapsValues,
            'leftSide' : isEquation && splittedGapsBySpace.length > 0 ? leftSideEvaluated : leftSide,
            'rightSide' : isEquation && splittedGapsBySpace.length > 0 ? rightSideEvaluated : rightSide
        }
    };

    presenter.validateDecimalSeparator = function(separator) {
        var spacePattern = /(\s)/;

        if (spacePattern.test(separator)) {
            return presenter.getErrorObject('E02');
        }

        return {
            'isError' : false,
            'value' : separator.length > 0 ? separator : '.'
        };
    };

    presenter.validateGapWidth = function(gapWidth) {
        if (typeof gapWidth == "undefined" || gapWidth == 0) {
            gapWidth = '34';
        }

        if (gapWidth < 0 || isNaN(gapWidth)) {
            return presenter.getErrorObject('E04');
        }

        return {
            'isError' : false,
            'value' : gapWidth
        }
    };

    presenter.validateSigns = function(signs) {
        var availableFields = ["Addition", "Subtraction", "Division", "Multiplication"];

        if (typeof signs == "undefined") {
            signs = [{Addition: "", Subtraction: "", Division: "", Multiplication: ""}];
        }

        var regexp = new RegExp("[\=\\[\\]]");

        for (var i = 0; i < availableFields.length; i++) {
            var field = availableFields[i];
            if (regexp.test(signs[0][field])) {
                return presenter.getErrorObject('E05');
            }
        }

        return {
            'isError' : false,
            'value' : signs[0]
        }
    };

    presenter.validateGapType = function (model) {
        if(model.gapType === "Draggable") {
            return { value: true };
        }

        return { value: false };
    };

    presenter.onDestroy = function () {
        this.$view.off();
        presenter.$view.find('input').off();
    };

    presenter.validateModel = function(model) {

        var validatedIsEquation = ModelValidationUtils.validateBoolean(model['isEquation']),
            validatedIsDisabled = ModelValidationUtils.validateBoolean(model['isDisabled']),
            validatedIsActivity = !(ModelValidationUtils.validateBoolean(model['isNotActivity'])),
            validatedIsVisible = ModelValidationUtils.validateBoolean(model['Is Visible']),
            validatedUseNumericKeyboard = ModelValidationUtils.validateBoolean(model['useNumericKeyboard']),
            validatedUserActionEvents = ModelValidationUtils.validateBoolean(model['userActionEvents']);

        var validatedDecimalSeparator = presenter.validateDecimalSeparator(model['decimalSeparator']);

        if (validatedDecimalSeparator.isError) {
            return validatedDecimalSeparator;
        }

        var validatedGapWidth = presenter.validateGapWidth(model['gapWidth']);

        if (validatedGapWidth.isError) {
            return validatedGapWidth;
        }

        var validatedSigns = presenter.validateSigns(model['Signs']);

        if (validatedSigns.isError) {
            return validatedSigns;
        }

        var validatedGapsDefinition = presenter.validateGapsDefinition(model, validatedIsEquation, validatedDecimalSeparator.value, validatedSigns.value);
        if (validatedGapsDefinition.isError) {
            return validatedGapsDefinition;
        }

        var validatedGapType = presenter.validateGapType(model);

        return {
            'isError' : false,
            'gapsDefinition' : validatedGapsDefinition.allElements,
            'gapsValues' : validatedGapsDefinition.gapsValues,
            'isEquation' : validatedIsEquation,
            'addonID' : model.ID,
            'rightValue' : validatedGapsDefinition.rightSide,
            'leftValue' : validatedGapsDefinition.leftSide,
            'isActivity' : validatedIsActivity,
            'isNotActivity': !validatedIsActivity,
            'isDisabled' : validatedIsDisabled,
            'isDisabledByDefault': validatedIsDisabled,
            'isVisibleByDefault' : validatedIsVisible,
            'isVisible' : validatedIsVisible,
            'decimalSeparator' : validatedDecimalSeparator.value,
            'gapWidth' : validatedGapWidth.value,
            'isDraggable': validatedGapType.value,
            'Signs' : validatedSigns.value,
            'useNumericKeyboard' : validatedUseNumericKeyboard,
            'userActionsEventsEnabled': validatedUserActionEvents
        }
    };

    presenter.isErrorsMode = false;

    presenter.setShowErrorsMode = function () {
        if(!presenter.isErrorsMode) {
            presenter.gapsContainer.check();
            presenter.isErrorsMode = true;
        }
    };

    presenter.setWorkMode = function() {
        if (presenter.isErrorsMode) {
            presenter.gapsContainer.check();
            presenter.isErrorsMode = false;
        }
    };

    presenter.reset = function(){
        presenter.gapsContainer.reset();

        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        presenter.configuration.isDisabled = presenter.configuration.isDisabledByDefault;
        presenter.isErrorsMode = false;
    };

    presenter.areValuesInEquation = function (userValuesInGaps, correctGapsValues) {
        correctGapsValues = [].concat(correctGapsValues);
        var len = userValuesInGaps.length;

        for (var i = 0; i < len; i++) {
            if (correctGapsValues.indexOf(userValuesInGaps[i]) === -1) {
                return false;
            } else {
                var index = correctGapsValues.indexOf(userValuesInGaps[i]);
                correctGapsValues.splice(index, 1);
            }
        }

        return true;
    };

    presenter.isEquationCorrect = function (validatedScore) {
        var isCorrect = presenter.isEquationCorrectWrapper(validatedScore);
        var valuesAreInEquation = presenter.areValuesInEquationWrapper();

        return (isCorrect && valuesAreInEquation);
    };

    function getReconvertedUserExpression () {
        return presenter.reconvertExpression(getUserExpression().split(' '));
    }

    function getConvertedUserGapsValues () {
        var gapsValues = presenter.reconvertExpression(presenter.gapsContainer.getValues());

        return gapsValues.split(' ');
    }

    presenter.areValuesInEquationWrapper = function () {
        return presenter.areValuesInEquation(getConvertedUserGapsValues(), presenter.configuration.gapsValues);
    };


    presenter.isEquationCorrectWrapper = function (validatedScore) {
        return validatedScore.isSameResultOnBothSides
            && validatedScore.leftEvaluated == presenter.configuration.leftValue
            && validatedScore.rightEvaluated == presenter.configuration.rightValue;
    };

    presenter.getErrorCount = function(){
        const wasShowAnswersActive = presenter.configuration.isShowAnswersActive;
        if (presenter.configuration.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        const errorCount = _getErrorCount();
        wasShowAnswersActive && presenter.showAnswers();
        return errorCount;
    };

    function _getErrorCount () {
        if (presenter.cantCheck()) {
            return 0;
        }

        var validated = presenter.validateScore();

        if (presenter.configuration.isEquation) {
            if(!presenter.gapsContainer.areAllGapsFilled()){
                return 0;
            }

            return equationGetErrorCount(validated);
        } else {
            return presenter.gapsContainer.getNonEmptyGapsNumber() - validated.validGapsCount;
        }
    }

    function equationGetErrorCount (validated) {
        if (presenter.isEquationCorrect(validated) ) {
            return 0;
        }

        return 1;
    }

    function filterInputs(testFunction) {
        return $.grep(presenter.$view.find('input'), function(element) { return testFunction(element) });
    }

    presenter.getMaxScore = function(){
        if (presenter.configuration.isNotActivity) {
            return 0;
        }

        if (presenter.configuration.isEquation) {
            return 1;
        }

        return presenter.gapsContainer.getMaxScore();
    };

    function getUserExpression() {
        function getValueFromChild($gap) {
            var gapID = $gap.attr("id");
            var gapValue = presenter.gapsContainer.getValueByID(gapID);

            return value = gapValue;
        }

        var result = '';

        $.each(presenter.$view.find('.basic-math-gaps-container').children(), function() {
            var elements = [$(this)];

            if (elements[0].hasClass('fraction-container')) {
                var container = elements[0];
                elements = [];
                elements.push(container.find('.numerator').children());
                elements.push($('<span class="element">/</span>'));
                elements.push(container.find('.denominator').children());
            }

            $.each(elements, function() {
                var $element = $(this),
                    value = '';

                if ($element.is('input')) {
                    var gapID = $element.attr("id");
                    var gapValue = presenter.gapsContainer.getValueByID(gapID);
                    value = gapValue + ' ';
                } else if ($element.hasClass("draggableContainer")) {
                    var child = $element.find(":first-child");
                    value = getValueFromChild(child) + ' ';
                } else {
                    value = $element.text() + ' ';
                }
                result += convertDecimalSeparator(value, presenter.configuration.decimalSeparator, '.');
            });
        });

        return result.trim();
    }

    presenter.reconvertExpression = function(splittedUserExpression) {
        var convertedSign,
            reconvertedExpression = '';

        $.each(splittedUserExpression, function(i) {
            convertedSign = presenter.reconvertSign(presenter.configuration.Signs, splittedUserExpression[i]);
            reconvertedExpression += convertedSign + " ";
        });

        return reconvertedExpression.trim();
    };

    presenter.getValidGapsCount = function (valuesArray) {
        var isValid = true;
        var validGapsCount = 0;

        valuesArray.forEach(function (value, index) {
            if (presenter.configuration.gapsValues[index] != presenter.reconvertSign(presenter.configuration.Signs, value)) {
                isValid = false;
            } else if (value.length > 0) {
                validGapsCount++;
            }
        });

        return {
            isValid: isValid,
            validGapsCount: validGapsCount
        }
    };

    presenter.getStringReconvertedUserExpression = function () {
        return getReconvertedUserExpression().split(' ').reduce(function (result, element) {
            return result + element;
        }, '');
    };

    presenter.validateScore = function () {
        var validatedGapsCount = presenter.getValidGapsCount(presenter.gapsContainer.getValues());

        var reconvertedExpression = presenter.getStringReconvertedUserExpression();

        var splitted = reconvertedExpression.split('=');

        if (presenter.configuration.isEquation && splitted.length > 1 && filterInputs(function(element) { return $(element).val().length == 0; }).length == 0) {
            try {
                var userExpressionLeft = splitted[0];
                var userExpressionRight = splitted[1];
                var leftEvaluated = eval(userExpressionLeft).toFixed(2);
                var rightEvaluated = eval(userExpressionRight).toFixed(2);
                var isSameResultOnBothSides = leftEvaluated == rightEvaluated;
            } catch (_) {
                leftEvaluated = "";
                rightEvaluated = "";
                isSameResultOnBothSides = false;
            }
        }

        return {
            'isValid' : validatedGapsCount.isValid,
            'isSameResultOnBothSides' : isSameResultOnBothSides,
            'leftEvaluated' : leftEvaluated,
            'rightEvaluated' : rightEvaluated,
            'validGapsCount' : validatedGapsCount.validGapsCount
        };
    };

    presenter.getScore = function () {
        const wasShowAnswersActive = presenter.configuration.isShowAnswersActive;
        if (presenter.configuration.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        const score = _getScore();
        wasShowAnswersActive && presenter.showAnswers();
        return score;
    };

    function _getScore() {
        if (presenter.cantCheck()) {
            return 0;
        }

        var validated = presenter.validateScore();

        if (presenter.configuration.isEquation) {
            if(!presenter.gapsContainer.areAllGapsFilled()){
                return 0;
            }

            if (presenter.isEquationCorrect(validated) ) {
                return 1;
            }

            return 0;
        } else {
            return validated.validGapsCount;
        }
    }

    presenter.cantCheck = function () {
        if (presenter.configuration.isNotActivity
        || presenter.configuration.isDisabled
        || presenter.gapsContainer.areAllGapsEmpty()) {
            return true;
        }

        return false;
    };

    presenter.getState = function(){
        const wasShowAnswersActive = presenter.configuration.isShowAnswersActive;
        if (presenter.configuration.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        var state = {
            'values' : presenter.gapsContainer.getValues(),
            'sources': presenter.gapsContainer.getSources(),
            'isVisible' : presenter.configuration.isVisible,
            'isDisabled' : presenter.configuration.isDisabled,
            'droppedElements' : presenter.gapsContainer.getDroppedElements()
        };

        wasShowAnswersActive && presenter.showAnswers();
        return JSON.stringify(state);
    };

    presenter.upgradeState = function (state) {
        if (state.sources == undefined) {
             return presenter.upgradeSources(state);
        }

        return state;
    };

    presenter.upgradeSources = function (state) {
        var upgradedState = {};
        jQuery.extend(true, upgradedState, state); // Deep copy of model object

        upgradedState["sources"] = upgradedState.values.map(function () {
            return "";
        });

        return upgradedState;
    };

    presenter.setDisabledInSetState = function (isDisabled) {
        if (presenter.configuration.isDisabledByDefault && !isDisabled) {
            presenter.gapsContainer.unlock();
        } else if (!presenter.configuration.isDisabledByDefault && isDisabled) {
            presenter.gapsContainer.lock();
        } else if (presenter.configuration.isDisabledByDefault && isDisabled) {
            presenter.gapsContainer.lock();
        }

        presenter.configuration.isDisabled = isDisabled;
    };

    presenter.upgradeDroppedElements = function (state) {
        var upgradedState = {};
        jQuery.extend(true, upgradedState, state); // Deep copy of model object

        upgradedState["droppedElements"] = upgradedState.values.map(function () {
            return "";
        });

        return upgradedState;
    };

    presenter.upgradeStateDroppedElements = function (state) {
        if(state.droppedElements == undefined){
            return presenter.upgradeDroppedElements(state);
        }
        return state;
    };

    presenter.setState = function(stateString){
        var state = JSON.parse(stateString);

        var upgradedState = presenter.upgradeState(state);
        upgradedState = presenter.upgradeStateDroppedElements(upgradedState);

        presenter.gapsContainer.setState(upgradedState.values, upgradedState.sources, upgradedState.droppedElements);

        presenter.configuration.isVisible = upgradedState.isVisible;
        presenter.setDisabledInSetState(upgradedState.isDisabled);

        presenter.setVisibility(upgradedState.isVisible);
    };

    presenter.isAttempted = function() {
	if(!presenter.configuration.isActivity || presenter.gapsContainer.areAllGapsFilled()){
		return true;
	} else {
		return false;
	}
    };
    
    presenter.show = function() {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.find('.basic-math-gaps-wrapper').css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.disable = function() {
        presenter.configuration.isDisabled = true;

        presenter.gapsContainer.lock();
    };

    presenter.enable = function() {
        if (presenter.configuration.isDisabled) {
            presenter.gapsContainer.unlock();
            presenter.configuration.isDisabled = false;
        }
    };

    presenter.isAllOK = function() {
        var score = presenter.getScore();
        return score == presenter.getMaxScore() && score != 0;
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'disable' : presenter.disable,
            'enable' : presenter.enable,
            'isAllOK' : presenter.isAllOK,
            'getView' : presenter.getView,
	    'isAttempted' : presenter.isAttempted
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.getView = function() {
        return this.$view;
    };

    presenter.createEventData = function (item, value, score) {
        if (presenter.configuration.isEquation) {
            score = presenter.isAllOK() ? 1 : 0;
            value = '';
            item = 'all';
        } else {
            score = score ? 1 : 0;
            value.toString();
            item = (item + 1).toString();
        }

        return {
            'source': presenter.configuration.addonID,
            'item': item,
            'value': value,
            'score': score
        };
    };

    presenter.sendEvent = function(item, value, score) {
        var eventData = presenter.createEventData(item, value, score);
        presenter.eventBus.sendEvent('ValueChanged', eventData);

        if (presenter.isAllOK() && !presenter.configuration.isEquation) presenter.sendAllOKEvent();
    };

    presenter.sendAllOKEvent = function () {
        var eventData = {
            'source': presenter.configuration.addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.onEventReceived = function (eventName, eventData) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }

        if (eventName == "ItemSelected") {
            presenter.lastDraggedItem = eventData;
        }

        if (eventName == "ItemConsumed") {
            presenter.lastDraggedItem = {};
        }
    };

    presenter.showAnswers = function () {
        if (presenter.configuration.isActivity) {
            presenter.isErrorsMode = false;
            presenter.gapsContainer.showAnswers();
        }
    };

    presenter.hideAnswers = function () {
        if (!presenter.configuration.isShowAnswersActive) {
            return;
        }

        presenter.gapsContainer.hideAnswers();
        presenter.isErrorsMode = false;
    };

    presenter.parseItemValue = function (item) {
    	return item.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/__(.*?)__/g, "<i>$1</i>").replace(/__(.*?)_/g, "<i>$1_</i>").replace(/\*\*(.*?)\*/g, "<b>$1*</b>").replace(/_(.*?)__/g, "_$1").replace(/\*(.*?)\*\*/g, "*$1");
    };

    presenter.GapsContainerObject = function () {
        this._gaps = {};
        this._gapsOrderArray = [];
    };

    presenter.GapsContainerObject.prototype.getGapIndexByID = function (htmlID) {
        return this._gapsOrderArray.indexOf(htmlID);
    };

    presenter.GapsContainerObject.prototype.getValues = function () {
        return this._gapsOrderArray.map(function (element) {
            return this._gaps[element].getValue();
        }, this);
    };

    presenter.GapsContainerObject.prototype.getMaxScore = function () {
        return this._gapsOrderArray.length;
    };

    presenter.GapsContainerObject.prototype.getSources = function () {
        return this._gapsOrderArray.map(function (gapID){
            return this._gaps[gapID].getSource();
        }, this);
    };

    presenter.GapsContainerObject.prototype.getDroppedElements = function () {
        return this._gapsOrderArray.map(function (gapID){
            return this._gaps[gapID].getDroppedElement();
        }, this);
    };

    presenter.GapsContainerObject.prototype.areAllGapsEmpty = function () {
        var reducedValue = this.getValues().reduce(function (previousElement, currentElement) {
            return previousElement + currentElement;
        });

        return (reducedValue === "");
    };

    presenter.GapsContainerObject.prototype.setState = function (valuesArray, sourcesArray, droppedElementsArray) {
        this._gapsOrderArray.forEach(function (gapID, index) {
            if (presenter.configuration.isDraggable) {
                this._gaps[gapID].setState(valuesArray[index], sourcesArray[index], droppedElementsArray[index]);
            } else {
                this._gaps[gapID].value = valuesArray[index];
                this._gaps[gapID].source = sourcesArray[index];
                this._gaps[gapID].$view.val(valuesArray[index]);
            }

            if (valuesArray[index] == "") {
                this._gaps[gapID].destroyDraggableProperty();
            }else{
                this.addGapFilled(gapID);
            }

        }, this);
    };

    presenter.GapsContainerObject.prototype.addGapFilled = function (gapID){
        this._gaps[gapID].removeCssClass("gapEmpty");
        this._gaps[gapID].addCssClass("gapFilled");
        this._gaps[gapID].notifyEdit();
    };

    presenter.GapsContainerObject.prototype.showAnswers = function () {
        this._gapsOrderArray.forEach(function (gapID) {
            this._gaps[gapID].showAnswers();
        }, this);
    };

    presenter.GapsContainerObject.prototype.hideAnswers = function () {
        this._gapsOrderArray.forEach(function (gapID) {
            this._gaps[gapID].hideAnswers();
        }, this);
    };

    presenter.GapsContainerObject.prototype.canSendEvent = function () {
        if (presenter.configuration.isEquation) {
            return this.getNonEmptyGapsNumber() == this._gapsOrderArray.length;
        }

        return true;
    };

    presenter.GapsContainerObject.prototype.check = function (isSetShow) {
        this._gapsOrderArray.forEach(function (gapID) {
            this._gaps[gapID].check(isSetShow);
        }, this);
    };

    presenter.GapsContainerObject.prototype.lock = function () {
        this._gapsOrderArray.forEach(function (element) {
            this._gaps[element].lock();
        }, this);
    };

    presenter.GapsContainerObject.prototype.unlock = function () {
        this._gapsOrderArray.forEach(function (element) {
            this._gaps[element].unlock();
        }, this);
    };

    presenter.GapsContainerObject.prototype.reset = function () {
        this._gapsOrderArray.forEach(function (gapID) {
            this._gaps[gapID].reset();
            this._gaps[gapID].removeCssClass("gapFilled");
            this._gaps[gapID].removeCssClass("gapEmpty");
        }, this);
    };

    presenter.GapsContainerObject.prototype.getNonEmptyGapsNumber = function () {
        return this.getValues().filter(function (value) {
            return value.length > 0;
        }).length;
    };

    presenter.GapsContainerObject.prototype.areAllGapsFilled = function () {
        return (this.getNonEmptyGapsNumber() == this._gapsOrderArray.length);
    };

    presenter.GapsContainerObject.prototype.addGap = function (gap) {
        var gapID = gap.getObjectID();

        this._gapsOrderArray.push(gapID);

        this._gaps[gapID] = gap;
    };

    presenter.GapsContainerObject.prototype.getValueByID = function (gapID) {
        return this._gaps[gapID].getValue();
    };

    presenter.getCSSConfiguration = function () {
        if (presenter.configuration.isEquation) {
            return {
                showAnswers: 'bmg_show-answers'
            };
        } else {
            return {
                correct: "correct",
                wrong: "wrong",
                showAnswers: 'bmg_show-answers'
            };
        }
    }

    presenter.GapUtils = function (configuration) {
        DraggableDroppableObject.call(this, configuration, presenter.getCSSConfiguration());

        this.valueChangeObserver = presenter.valueChangeObserver;
    };

    presenter.GapUtils.prototype = Object.create(DraggableDroppableObject.prototype);
    presenter.GapUtils.constructor = presenter.GapUtils;

    presenter.GapUtils.prototype.addClassToContainer = function () {
        presenter.$view.find('.basic-math-gaps-container').addClass("basic_math_gaps_check");
    };

    presenter.GapUtils.prototype.removeClassFromContainer = function () {
        presenter.$view.find('.basic-math-gaps-container').removeClass("basic_math_gaps_check");
    };

    presenter.GapUtils.prototype.removeClassInEquation = function () {
        presenter.$view.find('.basic-math-gaps-container').removeClass('correct wrong');
    };

    presenter.GapUtils.prototype.getClassName = function () {
        if (presenter.isEquationCorrect(presenter.validateScore())) {
            return "correct";
        } else {
            return "wrong";
        }
    };

    presenter.GapUtils.prototype.addClassInEquation = function () {
        if (presenter.gapsContainer.areAllGapsFilled()) {
            presenter.$view.find('.basic-math-gaps-container').addClass(this.getClassName());
        }
    };

    presenter.GapUtils.prototype.shouldNotAddCssClassInEquation = function (valueFunction) {
        return presenter.configuration.isNotActivity
        || presenter.configuration.isDisabled
        || presenter.gapsContainer.areAllGapsEmpty();
    };
    
    presenter.GapUtils.prototype.shouldNotAddCssClass = function () {
        return presenter.configuration.isNotActivity
        || presenter.configuration.isDisabled
        || this.isEmpty();
    };

    presenter.GapUtils.prototype.setCss = function (containerCssFunction, equationFunction, notEquationFunction) {
        containerCssFunction();

        if (presenter.configuration.isEquation) {
            if (this.shouldNotAddCssClassInEquation()) {
                return;
            }
            equationFunction.call(this);
        } else {
            if (this.shouldNotAddCssClass()) {
                return;
            }
            notEquationFunction.call(this);
        }
    };

    presenter.GapUtils.prototype.isEmpty = function () {
        return this.getValue() == "";
    }

    presenter.GapUtils.prototype.onBlock = function () {
        if (!presenter.configuration.isDisabled) {
            this.lock();
            if(this.isEmpty()){
                this.addCssClass("gapEmpty");
            }
        }
    };

    presenter.GapUtils.prototype.onUnblock = function () {
        if (!presenter.configuration.isDisabled) {
            this.unlock();
            this.removeCssClass("gapEmpty");
        }
    };

    presenter.GapUtils.prototype.onShowAnswers = function () {
        presenter.configuration.isShowAnswersActive = true;

        if (presenter.configuration.isDisabled) {
            this.setViewValue(this.showAnswersValue);
        } else {
            DraggableDroppableObject.prototype.onShowAnswers.call(this);
        }
    };

    presenter.GapUtils.prototype.onHideAnswers = function () {
        presenter.configuration.isShowAnswersActive = false;

        if (presenter.configuration.isDisabled) {
            this.setViewValue(this.value);
        } else {
            DraggableDroppableObject.prototype.onHideAnswers.call(this);
        }
    };

    presenter.GapUtils.prototype.onReset = function () {
        DraggableDroppableObject.prototype.onReset.call(this);

        if (presenter.configuration.isDisabledByDefault && !presenter.configuration.isDisabled) {
            this.lock();
        } else if (!presenter.configuration.isDisabledByDefault && presenter.configuration.isDisabled) {
            this.unlock();
        }
    };

    presenter.GapUtils.prototype.onCorrect = function () {
        this.onBlock();
    };

    presenter.GapUtils.prototype.onUnCorrect = function () {
        this.onUnblock();
    };

    presenter.GapUtils.prototype.onWrong = function () {
        this.onBlock();
    };

    presenter.GapUtils.prototype.onUnWrong = function () {
        this.onUnblock();
    };

    presenter.GapUtils.prototype.setCssOnCorrect = function () {
        this.setCss(this.addClassToContainer, this.addClassInEquation, DraggableDroppableObject.prototype.setCssOnCorrect);
    };

    presenter.GapUtils.prototype.setCssOnUnCorrect = function () {
        this.setCss(this.removeClassFromContainer, this.removeClassInEquation, DraggableDroppableObject.prototype.setCssOnUnCorrect);
    };

    presenter.GapUtils.prototype.setCssOnWrong = function () {
        this.setCss(this.addClassToContainer, this.addClassInEquation, DraggableDroppableObject.prototype.setCssOnWrong);
    };

    presenter.GapUtils.prototype.setCssOnUnWrong = function () {
        this.setCss(this.removeClassFromContainer, this.removeClassInEquation, DraggableDroppableObject.prototype.setCssOnUnWrong);
    };

    presenter.GapUtils.prototype.isCorrect = function () {
        if (presenter.configuration.isEquation) {
            return presenter.isEquationCorrect(presenter.validateScore());
        } else {
            return DraggableDroppableObject.prototype.isCorrect.call(this);
        }
    };


    presenter.EditableInputGap = function (htmlID, correctAnswer) {
        var configuration = {
            addonID: presenter.configuration.addonID,
            objectID: htmlID,
            eventBus: presenter.eventBus,
            getSelectedItem: presenter.getSelectedItem,

            showAnswersValue: correctAnswer,

            createView: presenter.EditableInputGap.prototype.createView,
            connectEvents: presenter.EditableInputGap.prototype.connectEvents,
            setViewValue: presenter.EditableInputGap.prototype.setViewValue
        };

        presenter.GapUtils.call(this, configuration);
    };

    presenter.EditableInputGap.prototype = Object.create(presenter.GapUtils.prototype);
    presenter.EditableInputGap.constructor = presenter.EditableInputGap;

    presenter.EditableInputGap.prototype.connectEvents = function () {
        this.$view.on("input", this.onEdit.bind(this));
        this.$view.on('keyup', this.onKeyUp.bind(this));
        this.$view.on("keypress", this.onKeyPress.bind(this));
        this.$view.off('change').bind('change', this.onEdit.bind(this));
    };

    presenter.EditableInputGap.prototype.createView = function () {
        var inputType = "text";
        if (presenter.configuration.useNumericKeyboard) {
            inputType = "tel";
        }
        var $inputGap = $('<input type="' + inputType + '" value="" id="' + this.objectID + '" />');
        $inputGap.css({
            width: presenter.configuration.gapWidth + "px"
        });
        if ((presenter.configuration.useNumericKeyboard)) {
            $inputGap.attr("step", "any");
        }
        $inputGap.attr("autocomplete", "off");
        return $inputGap;
    };

    presenter.EditableInputGap.prototype.onKeyUp = function(event) {
        event.stopPropagation();
        if (presenter.configuration.useNumericKeyboard) {
            var newText = String(event.target.value);
            var pattern = StringUtils.getNumericPattern();
            if (newText.length > 0 && !newText.match(pattern)) {
                var patternWithoutLastCharacter = pattern.slice(0, -1);
                var regExp = RegExp(patternWithoutLastCharacter);
                var match = regExp.exec(newText);

                if (match) {
                    this.setViewValue(match[0]);
                } else {
                    this.setViewValue("");
                }
            }
        }
    };

    presenter.EditableInputGap.prototype.onKeyPress = function(event) {
        event.stopPropagation();
        if (presenter.configuration.useNumericKeyboard) {
            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
            var selectionStartIdx = event.target.selectionStart;
            var selectionEndIdx = event.target.selectionEnd;
            var oldText = String(event.target.value);
            var newText = oldText.substring(0, selectionStartIdx)
                            + key
                            + oldText.substring(selectionEndIdx);
            var pattern = StringUtils.getNumericPattern();
            if (!newText.match(pattern)) {
                event.preventDefault();
            }
        }
    };

    presenter.EditableInputGap.prototype.onEdit = function (event) {
        this.notifyEdit();
        this.value = this.getValue();

        if(presenter.configuration.isDisabled) {
            return;
        }

        if (presenter.configuration.userActionsEventsEnabled) {
            presenter.$view.find("#" + this.getObjectID()).trigger("BMG:send_event");
        }
    };

    presenter.EditableInputGap.prototype.lock = function () {
        this.$view.attr('disabled','disabled');
        this.$view.addClass('disabled');
    };

    presenter.EditableInputGap.prototype.unlock = function () {
        this.$view.removeAttr('disabled');
        this.$view.removeClass('disabled');
    };

    presenter.EditableInputGap.prototype.getValue = function () {
        return this.$view.val().trim();
    };

    presenter.EditableInputGap.prototype.setViewValue = function (value) {
        return this.$view.val(value);
    };

    presenter.EditableInputGap.prototype.getSource = function () {
        return "";
    };

    presenter.EditableInputGap.prototype.onShowAnswers = function () {
        this.value = this.getValue();
        presenter.GapUtils.prototype.onShowAnswers.call(this);
    };

    presenter.DraggableDroppableGap = function (htmlID, correctAnswer) {
        var configuration = {
            addonID: presenter.configuration.addonID,
            objectID: htmlID,
            eventBus: presenter.eventBus,
            getSelectedItem: presenter.getSelectedItem,

            showAnswersValue: correctAnswer,

            fillGap: presenter.DraggableDroppableGap.prototype.fillGap,
            makeGapEmpty: presenter.DraggableDroppableGap.prototype.makeGapEmpty
        };


        presenter.GapUtils.call(this, configuration);

        this.$view.css({
            width: presenter.configuration.gapWidth + "px",
            display: 'inline-block'
        });

        this.addCssClass("draggable-gap");
    };

    presenter.DraggableDroppableGap.prototype = Object.create(presenter.GapUtils.prototype);
    presenter.DraggableDroppableGap.parent = presenter.GapUtils.prototype;
    presenter.DraggableDroppableGap.constructor = presenter.DraggableDroppableGap;


    presenter.DraggableDroppableGap.prototype.fillGap = function (selectedItem) {
        DraggableDroppableObject.prototype.fillGap.call(this, selectedItem);
        this.notify();
        this.addCssClass("gapFilled");
        this.removeCssClass("gapEmpty")
    };

    presenter.DraggableDroppableGap.prototype.makeGapEmpty = function () {
        DraggableDroppableObject.prototype.makeGapEmpty.call(this);
        this.notify();
        this.removeCssClass("gapFilled");
    };

    presenter.DraggableDroppableGap.prototype.notify = function () {
        this.valueChangeObserver.notify(this.getValueChangeEventData());
    };

    presenter.DraggableDroppableGap.prototype.getValueChangeEventData = function () {
        return {
            htmlID: this.getObjectID(),
            value: this.getValue(),
            isCorrect: this.getValue() == this.showAnswersValue
        };
    };

    presenter.ElementGapObject = function (value) {
        this._value = value;
        this.$view = this._createView();
    };


    presenter.ElementGapObject.prototype._createView = function () {
        return $('<span class="element">' + this._value + '</span>');
    };

    presenter.ElementGapObject.prototype.getView = function () {
        return $('<span class="element">' + this._value + '</span>');
    };

    presenter.getSelectedItem = function () {
        var item = presenter.lastDraggedItem;

        presenter.onEventReceived("ItemSelected", {});

        return item;
    };


    presenter.FractionGapObject = function (id) {
        this._id = id;
        this._$mainContainer;
        this._$numeratorContainer;
        this._$denominatorContainer;
        this._numerator;
        this._denominator;
        this._numeratorValue;
        this._denominatorValue;

        this._createContainers();
    };

    presenter.FractionGapObject.prototype.constructor = presenter.FractionGapObject;

    presenter.FractionGapObject.prototype._createContainers = function () {
        this._$mainContainer = $('<span class="fraction-container"></span>');
        this._$numeratorContainer = $('<span class="numerator"></span>');
        this._$denominatorContainer = $('<span class="denominator"></span>');
    };

    presenter.FractionGapObject.prototype.createElementNumerator = function (value) {
        this._numerator = presenter.widgetsFactory.produce(presenter.ObjectFactory.PRODUCTION_TYPE.ELEMENT_GAP, value);

        this._numeratorValue = value;
    };

    presenter.FractionGapObject.prototype.createElementDenominator = function (value) {
        this._denominator = presenter.widgetsFactory.produce(presenter.ObjectFactory.PRODUCTION_TYPE.ELEMENT_GAP, value);

        this._denominatorValue = value;
    };

    presenter.FractionGapObject.prototype.setDisplayInlineBlock = function (gap) {
        gap.getView().css({
            display: "inline-block"
        });
    };

    presenter.FractionGapObject.prototype.createGapNumerator = function (type, data) {
         this._numerator = presenter.widgetsFactory.produce(type, this._getNominatorProductionData(data));
    };

    presenter.FractionGapObject.prototype.createGapDenominator = function (type, data) {
         this._denominator = presenter.widgetsFactory.produce(type, this._getDenominatorProductionData(data));
    };

    presenter.FractionGapObject.prototype._getNominatorProductionData = function (data) {
        return {
            id: this._id + "-numerator",
            width: presenter.configuration.gapWidth,
            correctAnswer: data.correctAnswerNumerator
        };
    };

    presenter.FractionGapObject.prototype._getDenominatorProductionData = function (data) {
        return {
            id: this._id + "-denominator",
            width: presenter.configuration.gapWidth,
            correctAnswer: data.correctAnswerDenominator
        };
    };

    presenter.FractionGapObject.prototype.getView = function () {
        return this._$mainContainer;
    };

    presenter.FractionGapObject.prototype.joinNumeratorDenominator = function () {
        this._$numeratorContainer.append(this._numerator.getView());
        this._$denominatorContainer.append(this._denominator.getView());

        this._$mainContainer.append(this._$numeratorContainer).append(this._$denominatorContainer);
    };

    presenter.FractionGapObject.prototype.getNumerator = function () {
        return this._numerator;
    };

    presenter.FractionGapObject.prototype.getDenominator = function () {
        return this._denominator;
    };

    presenter.ObjectFactory = function () {
        this.gapsFactory = new presenter.GapsFactoryObject();
        this.gapsContainerFactory = new presenter.GapsContainerFactoryObject();
    };

    presenter.ObjectFactory.PRODUCTION_TYPE = {
        EDITABLE_INPUT_GAP: 0,
        FRACTION_GAP: 1,
        ELEMENT_GAP: 2,
        DRAGGABLE_MATH_GAP: 3,
        GAP_CONTAINER: 4
    };

    presenter.ObjectFactory.prototype.produce = function (type, data) {
        var producedItem;

        switch (type) {
            case presenter.ObjectFactory.PRODUCTION_TYPE.EDITABLE_INPUT_GAP:
                producedItem = this.gapsFactory.produce(presenter.ObjectFactory.PRODUCTION_TYPE.EDITABLE_INPUT_GAP, data);
                break;
            case presenter.ObjectFactory.PRODUCTION_TYPE.FRACTION_GAP:
                producedItem = this.gapsFactory.produce(presenter.ObjectFactory.PRODUCTION_TYPE.FRACTION_GAP, data);
                break;
            case presenter.ObjectFactory.PRODUCTION_TYPE.ELEMENT_GAP:
                producedItem = this.gapsFactory.produce(presenter.ObjectFactory.PRODUCTION_TYPE.ELEMENT_GAP, data);
                break;
            case presenter.ObjectFactory.PRODUCTION_TYPE.DRAGGABLE_MATH_GAP:
                producedItem = this.gapsFactory.produce(presenter.ObjectFactory.PRODUCTION_TYPE.DRAGGABLE_MATH_GAP, data);
                break;
            case presenter.ObjectFactory.PRODUCTION_TYPE.GAP_CONTAINER:
                producedItem = this.gapsContainerFactory.produce(data);
                break;
        }

        return producedItem;
    };

    presenter.FractionBuilderObject = function () {};

    presenter.FractionBuilderObject.prototype = Object.create(presenter.ObjectFactory.prototype);
    presenter.FractionBuilderObject.prototype.constructor = presenter.FractionBuilderObject;

    presenter.FractionBuilderObject.prototype.produce = function (data) {
        var fraction = this._produceFractionObject(data);

        this._setNumerator(fraction, data);
        this._setDenominator(fraction, data);


        fraction.setDisplayInlineBlock(fraction.getNumerator());
        fraction.setDisplayInlineBlock(fraction.getDenominator());

        fraction.joinNumeratorDenominator();

        return fraction;
    };

    presenter.FractionBuilderObject.prototype._produceFractionObject = function (data) {
        return new presenter.FractionGapObject(data.fractionID);
    };

    presenter.FractionBuilderObject.prototype._setNumerator = function (fraction, data) {
        if (data.fraction.numerator.isGap) {
            if (presenter.configuration.isDraggable) {
                fraction.createGapNumerator(presenter.ObjectFactory.PRODUCTION_TYPE.DRAGGABLE_MATH_GAP, data);
            } else {
                fraction.createGapNumerator(presenter.ObjectFactory.PRODUCTION_TYPE.EDITABLE_INPUT_GAP, data);}

        } else {
            fraction.createElementNumerator(data.fraction.numerator.parsed);
        }
    };

    presenter.FractionBuilderObject.prototype._setDenominator = function (fraction, data) {
        if (data.fraction.denominator.isGap) {
            if (presenter.configuration.isDraggable) {
                fraction.createGapDenominator(presenter.ObjectFactory.PRODUCTION_TYPE.DRAGGABLE_MATH_GAP, data);
            } else {
                fraction.createGapDenominator(presenter.ObjectFactory.PRODUCTION_TYPE.EDITABLE_INPUT_GAP, data);
            }
        } else {
            fraction.createElementDenominator(data.fraction.denominator.parsed);
        }
    };


    presenter.GapsFactoryObject = function () {
        this._fractionBuilder = new presenter.FractionBuilderObject();
    };

    presenter.GapsFactoryObject.prototype = Object.create(presenter.ObjectFactory.prototype);
    presenter.GapsFactoryObject.prototype.constructor = presenter.GapsFactoryObject;

    presenter.GapsFactoryObject.prototype.produce = function (type, data) {
        switch (type) {
            case presenter.ObjectFactory.PRODUCTION_TYPE.EDITABLE_INPUT_GAP:
                return this.produceEditableInputGap(data);
                break;
            case presenter.ObjectFactory.PRODUCTION_TYPE.DRAGGABLE_MATH_GAP:
                return this.produceDraggableMathGap(data);
            case presenter.ObjectFactory.PRODUCTION_TYPE.ELEMENT_GAP:
                return this.produceElementGap(data);
            case presenter.ObjectFactory.PRODUCTION_TYPE.FRACTION_GAP:
                return this.produceFractionGap(data);
                break;
        }
    };

    presenter.GapsFactoryObject.prototype.produceEditableInputGap = function (data) {
        return new presenter.EditableInputGap(data.id, data.correctAnswer);
    };

    presenter.GapsFactoryObject.prototype.produceDraggableMathGap = function (data) {
        return new presenter.DraggableDroppableGap(data.id, data.correctAnswer);
    };

    presenter.GapsFactoryObject.prototype.produceElementGap = function (value) {
        return new presenter.ElementGapObject(value);
    };

    presenter.GapsFactoryObject.prototype.produceFractionGap = function (data) {
        return this._fractionBuilder.produce(data);
    };

    presenter.GapsContainerFactoryObject = function () {};

    presenter.GapsContainerFactoryObject.prototype = Object.create(presenter.ObjectFactory.prototype);
    presenter.GapsContainerFactoryObject.prototype.constructor = presenter.GapsContainerFactoryObject;

    presenter.GapsContainerFactoryObject.prototype.getFractionIndexIncrement = function (dataElement) {
        var increment = 0;

        if (dataElement.fraction.denominator.isGap) {
            increment++;
        }

        if (dataElement.fraction.numerator.isGap) {
            increment++;
        }

        return increment;
    };

    function wrapItemInContainer(item) {
        var $container = $('<div></div>');
        $container.css({
            height: "50px",
            'text-align': 'center',
            float: 'left',
            display: 'inline-block'
        });
        $container.addClass("draggableContainer");
        $container.append(item.getView());

        return $container
    }

    function setFractionCssToMainContainer($mainContainer) {
        $mainContainer.addClass('hasFractions');
        $mainContainer.find(".draggableContainer").css({
            'margin-top': "15px"
        });
    }

    presenter.GapsContainerFactoryObject.prototype.produce = function (data) {
        var container = presenter.$view.find('.basic-math-gaps-container');
        var hasFractions = false;


        var dataIndex;
        var elementIndex;
        var draggable = false;
        for(dataIndex = 0, elementIndex = 0; dataIndex < data.length; dataIndex += 1) {
            var dataElement = data[dataIndex];
            var item;

            switch (dataElement.gapType) {
                case presenter.ObjectFactory.PRODUCTION_TYPE.EDITABLE_INPUT_GAP:
                    item = this._produceGap(this._getGapData(elementIndex));
                    elementIndex++;
                    presenter.gapsContainer.addGap(item);
                    draggable = true;
                    break;
                case presenter.ObjectFactory.PRODUCTION_TYPE.ELEMENT_GAP:
                    item = this._produceElementGap(dataElement);
                    break;
                case presenter.ObjectFactory.PRODUCTION_TYPE.FRACTION_GAP:
                    item = this._produceFractionGap(dataElement, this._getElementId(elementIndex), elementIndex);
                    elementIndex += this.getFractionIndexIncrement(dataElement);
                    this._addFractionGap(item, dataElement);
                    hasFractions = true;
                    break;
            }


            if (draggable) {
                var $wrappedItem = wrapItemInContainer(item);
                container.append($wrappedItem);
                draggable = false;
            } else {
                container.append(item.getView());
            }

            if (dataElement.isHiddenAdditionAfter) {
                container.append($('<span class="hidden-addition">+</span>'));
            }
        }

        if (presenter.configuration.isDisabledByDefault) {
            presenter.gapsContainer.lock();
        }

        if (hasFractions) {
            setFractionCssToMainContainer(container);
        }
    };

    presenter.GapsContainerFactoryObject.prototype._addFractionGap = function (fractionGap, gapDefinition) {

        if (gapDefinition.fraction.numerator.isGap) {
            presenter.gapsContainer.addGap(fractionGap.getNumerator());
        }

        if (gapDefinition.fraction.denominator.isGap) {
            presenter.gapsContainer.addGap(fractionGap.getDenominator());
        }
    };

    presenter.GapsContainerFactoryObject.prototype._produceFractionGap = function (data, id, elementIndex) {
        data.fractionID = id;

        if (data.fraction.numerator.isGap) {
            data["correctAnswerNumerator"] = presenter.convertSign(presenter.configuration.Signs, presenter.configuration.gapsValues[elementIndex]);
            elementIndex++;
        }

        if (data.fraction.denominator.isGap) {
            data["correctAnswerDenominator"] = presenter.convertSign(presenter.configuration.Signs, presenter.configuration.gapsValues[elementIndex]);
        }

        return presenter.widgetsFactory.produce(presenter.ObjectFactory.PRODUCTION_TYPE.FRACTION_GAP, data);
    };

    presenter.GapsContainerFactoryObject.prototype._produceElementGap = function (data) {
        return presenter.widgetsFactory.produce(presenter.ObjectFactory.PRODUCTION_TYPE.ELEMENT_GAP, data.originalForm);
    };


    presenter.GapsContainerFactoryObject.prototype._produceGap = function (data) {
        var gap;

        if (presenter.configuration.isDraggable) {
            gap = presenter.widgetsFactory.produce(presenter.ObjectFactory.PRODUCTION_TYPE.DRAGGABLE_MATH_GAP, data);
        } else {
            gap = presenter.widgetsFactory.produce(presenter.ObjectFactory.PRODUCTION_TYPE.EDITABLE_INPUT_GAP, data);
        }

        return gap;
    };

    presenter.GapsContainerFactoryObject.prototype._getGapData = function (index) {
        return {
            id: this._getElementId(index),
            width: presenter.configuration.gapWidth,
            value: "",
            source: "",
            correctAnswer: presenter.convertSign(presenter.configuration.Signs, presenter.configuration.gapsValues[index])
        };
    };

    presenter.GapsContainerFactoryObject.prototype._getElementId = function (index) {
        return (presenter.configuration.addonID + "-" + index);
    };

    presenter.ValueChangeObserver = function () {};

    presenter.ValueChangeObserver.prototype.notify = function (data) {
        var eventData = presenter.createEventData(presenter.gapsContainer.getGapIndexByID(data.htmlID), data.value, data.isCorrect);

        if (!presenter.gapsContainer.canSendEvent()) {
            return;
        }

        presenter.eventBus.sendEvent('ValueChanged', eventData);
        if (presenter.isAllOK() && !presenter.configuration.isEquation) presenter.sendAllOKEvent();
    };

    return presenter;
}

AddonBasic_Math_Gaps_create.__supported_player_options__ = {
    interfaceVersion: 2
};
