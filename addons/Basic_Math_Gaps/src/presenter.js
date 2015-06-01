function AddonBasic_Math_Gaps_create(){

    var presenter = function(){};

    presenter.eventBus = null;
    presenter.playerController = null;
    presenter.gapsContainer = null;
    presenter.widgetsFactory = null;
    presenter.lastDraggedItem = null;

    presenter.setPlayerController = function (controller) {
        this.playerController = controller;
        presenter.eventBus = this.playerController.getEventBus();
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
    };

    presenter.upgradeModel = function (model) {
        return presenter.upgradeGapType(model);
    };

    presenter.upgradeGapType = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if(model.gapType == undefined) {
            upgradedModel["gapType"] = "Editable";
        }

        return upgradedModel;
    };

    function runLogic(view, model, isPreview) {
        var upgradedModel = presenter.upgradeModel(model);


        presenter.$view = $(view);
        presenter.configuration = presenter.validateModel(upgradedModel);

        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(presenter.$view.find('.basic-math-gaps-container'), presenter.errorCodes, presenter.configuration.errorCode);
            return;
        }

        presenter.gapsContainer = new presenter.GapsContainerObject();
        presenter.widgetsFactory = new presenter.ObjectFactory();


        presenter.createGaps();

        if (!isPreview) presenter.addFocusOutEventListener();

        presenter.$view.find('input').click(function(e) {
            e.stopPropagation();
        });

        presenter.setWrapperCss();

        presenter.setVisibility(presenter.configuration.isVisible);
    }

    presenter.createGaps = function () {
        presenter.widgetsFactory.produce(
            presenter.ObjectFactory.PRODUCTION_TYPE.GAP_CONTAINER,
            presenter.configuration.gapsDefinition
        );

        if (presenter.configuration.isDisabled) {
            presenter.gapsContainer.block();
        }
    };

    presenter.setWrapperCss = function () {
        presenter.$view.find('.basic-math-gaps-wrapper :input').each(function(){
            if (presenter.configuration.gapWidth != '') {
                $(this).css("width", presenter.configuration.gapWidth);
            }
        });
    };

    presenter.addFocusOutEventListener = function () {
        if(presenter.configuration.isDisabled) {
            return;
        }

        presenter._addFocusOutEventListener();

    };

    presenter._addFocusOutEventListener = function () {
        var inputs = presenter.$view.find('input');

        inputs.focusout(function() {
            var item = presenter.$view.find('input').index( this),
                value = $(this).val(),
                score = (($(this).val() == presenter.configuration.gapsValues[item]) || (presenter.reconvertSign(presenter.configuration.Signs, $(this).val()) == presenter.configuration.gapsValues[item]));

            if (presenter.configuration.isEquation && filterInputs(function(element) { return $(element).val().length > 0; }).length != presenter.$view.find('input').length ) { return; }
            presenter.sendEvent(item, value, score);
        });
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

    presenter.errorCodes = {
        'E01' : 'Left side is not equal to Right side.',
        'E02' : 'A space can NOT be a decimal separator.',
        'E03' : 'Gaps Definition can NOT be blank',
        'E04' : 'Gap width must be positive integer',
        'E05' : 'Sign must be other than =, [, ]'
    };

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
    };

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

    presenter.validateGapsDefinition = function(model, isEquation, separator, signs) {
    	if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        if (model['gapsDefinition'].length === 0) {
            return {
                isError: true,
                errorCode: 'E03'
            }
        }

        var validatedGapsDefinition = [],
            isGapPattern = /^\[.+\]$/,
            splittedGapsBySpace = model['gapsDefinition'].split(' '),
            isFractionPattern = /\d+\]*\/\[*\d+/,
            leftSide = '',
            rightSide = '',
            isLeft = true,
            gapsValues = [];

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
                    isNumeratorGap = isGapPattern.test(numerator),
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

            var leftSideEvaluated = eval(leftSide).toFixed(2),
                rightSideEvaluated = eval(rightSide).toFixed(2);

            if(leftSideEvaluated != rightSideEvaluated) {
                return {
                    'isError' : true,
                    'errorCode' : 'E01'
                }
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
            return {
                'isError' : true,
                'errorCode' : 'E02'
            }
        }

        return {
            'isError' : false,
            'value' : separator.length > 0 ? separator : '.'
        };
    };

    presenter.validateGapWidth = function(gapWidth) {
        if (typeof gapWidth == "undefined" || gapWidth == 0) {
            gapWidth = '';
        }

        if (gapWidth < 0 || isNaN(gapWidth)) {
            return {
                'isError' : true,
                'errorCode' : 'E04'
            }
        }

        return {
            'isError' : false,
            'value' : gapWidth
        }
    };

    presenter.validateSigns = function(signs) {
        if (typeof signs == "undefined") {
            signs = [{Addition: "", Subtraction: "", Division: "", Multiplication: ""}];
        }

        var regexp = new RegExp("[\=\\[\\]]");

        for (var i = 0; i < Object.keys(signs[0]).length; i++) {
            if (regexp.test(signs[0][Object.keys(signs[0])[i]])) {
                return {
                    'isError' : true,
                    'errorCode' : 'E05'
                };
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

    presenter.validateModel = function(model) {

        var validatedIsEquation = ModelValidationUtils.validateBoolean(model['isEquation']),
            validatedIsDisabled = ModelValidationUtils.validateBoolean(model['isDisabled']),
            validatedIsActivity = !(ModelValidationUtils.validateBoolean(model['isNotActivity'])),
            validatedIsVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);

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
            'isDisabled' : validatedIsDisabled,
            'isVisibleByDefault' : validatedIsVisible,
            'isVisible' : validatedIsVisible,
            'decimalSeparator' : validatedDecimalSeparator.value,
            'gapWidth' : validatedGapWidth.value,
            'isDraggable': validatedGapType.value,
            'Signs' : validatedSigns.value
        }
    };

    presenter.setClassWhenCheck = function(isAddClass) {
        if (presenter.configuration.isEquation) {
            var $container = presenter.$view.find('.basic-math-gaps-container');

            if($container.hasClass('basic_math_gaps_check')) {
                $container.removeClass("basic_math_gaps_check");
            } else if (isAddClass) {
                $container.addClass("basic_math_gaps_check");
            }
        }
    };

    presenter._setShowErrorsModeEditable = function(inputs){
        var inputs = presenter.$view.find('input');

        $.each(inputs, function() {
            $(this).attr('disabled', 'disabled');
            $(this).addClass('disabled');
        });

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        presenter.setClassWhenCheck(true);

        if (canNOTCheckScore() || areInputsAllEmpty(inputs)
            || (presenter.configuration.isEquation
            && filterInputs(function(element) { return $(element).val().length > 0; }).length != presenter.$view.find('input').length)) {
            return;
        }

        var validated = validateScore();

        if (presenter.configuration.isEquation) {

            var container = presenter.$view.find('.basic-math-gaps-container');

            if (!validated.userExpressionValid) {
                $(container).addClass('wrong');
                return;
            }

            if ( !isEquationCorrect(validated) ) {
                $(container).addClass('wrong');
                return;
            }

            $(container).addClass('correct');
        } else {

            $.each(inputs, function(i) {
                var shouldBeValue = presenter.configuration.gapsValues[i],
                    currentValue = presenter.reconvertSign(presenter.configuration.Signs, $(this).val());

                    if (shouldBeValue == currentValue) {
                        $(this).addClass('correct');
                    } else if (currentValue.length > 0) {
                        $(this).addClass('wrong');
                    }
            });

        }
    };

    presenter.setShowErrorsMode = function () {
        if (presenter.configuration.isDraggable) {
            presenter._setShowErrorsModeDraggable();
        } else {
            presenter._setShowErrorsModeEditable();
        }
    };

    presenter._setShowErrorsModeDraggable = function () {
        presenter.gapsContainer.block();

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        presenter.setClassWhenCheck(true);

        if (!presenter.configuration.isActivity || presenter.gapsContainer.areAllGapsEmpty()) {
            return;
        }

        var validated = validateScore();

        if (presenter.configuration.isEquation) {

            var container = presenter.$view.find('.basic-math-gaps-container');

            if (!validated.userExpressionValid) {
                $(container).addClass('wrong');
                return;
            }

            if ( !isEquationCorrect(validated) ) {
                $(container).addClass('wrong');
                return;
            }

            $(container).addClass('correct');
        } else {
            presenter.gapsContainer.setShowErrorsModeClasses();
        }
    };

    presenter.setWorkMode = function(){
        if (presenter.configuration.isDisabled) {
            return;
        }

        if (presenter.configuration.isDraggable) {
            presenter.gapsContainer.setWorkModeClasses();
            presenter.gapsContainer.unblock();
        } else {
            presenter.setClassWhenCheck(false);

            var inputs = presenter.$view.find('input');
            inputs.attr('disabled', false);
            inputs.removeClass('correct wrong disabled');
            presenter.$view.find('.basic-math-gaps-container').removeClass('correct wrong');
        }

    };

    presenter.reset = function(){
        if (presenter.configuration.isDisabled) {
            return;
        }

        presenter.setWorkMode();
        presenter.gapsContainer.reset();


        if(typeof(presenter.userAnswers) !== "undefined") {
        	presenter.userAnswers.splice(0,presenter.userAnswers.length);
        }

        presenter.$view.find('.basic-math-gaps-container').removeClass('correct wrong');

        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
    };

    function isEquationCorrect(validatedScore) {
        return validatedScore.isSameResultOnBothSides
            && validatedScore.leftEvaluated == presenter.configuration.leftValue
            && validatedScore.rightEvaluated == presenter.configuration.rightValue;
    }

    presenter.getErrorCount = function(){
    	if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        if (canNOTCheckScore() || areInputsAllEmpty()) {
            return 0;
        }

        var validated = validateScore();

        if (presenter.configuration.isEquation) {
            if (!validated.userExpressionValid) {
                return 1;
            }

            if ( !isEquationCorrect(validated) ) {
                return 1;
            }

            return 0;
        } else {
            return filterInputs(function(element) { return $(element).val().length > 0; }).length - validated.validGapsCount;
        }

    };

    function filterInputs(testFunction) {
        return $.grep(presenter.$view.find('input'), function(element) { return testFunction(element) });
    }

    presenter.getMaxScore = function(){
    	if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        if (presenter.configuration.isEquation && presenter.configuration.isActivity) {
            return 1;
        } else if (presenter.configuration.isActivity) {
            return presenter.gapsContainer.getMaxScore();
        } else {
            return 0;
        }
    };

    function getUserExpression() {
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
                    value = $element.val() + ' ';
                } else {
                    value = $element.text() + ' ';
                }

                result += convertDecimalSeparator(value, presenter.configuration.decimalSeparator, '.');
            });
        });
        return result.trim();
    }

    function areInputsAllEmpty(inputs) {
        var allEmpty = true;

        if (inputs == undefined) {
            inputs = presenter.$view.find('input');
        }

        $.each(inputs, function() {
            if($(this).val().length > 0) {
                allEmpty = false;
            }
        });

        return allEmpty;
    }

    presenter.reconvertExpression = function(splittedUserExpression) {
        var convertedSign,
            reconvertedExpression = '';

        $.each(splittedUserExpression, function(i) {
            convertedSign = presenter.reconvertSign(presenter.configuration.Signs, splittedUserExpression[i]);
            reconvertedExpression += convertedSign;
        });

        return reconvertedExpression;
    };

    function getValuesArray () {
        if (presenter.configuration.isDraggable) {
            return getValuesFromSpans();
        }

        return getValuesFromAllGaps();
    }

    function getValuesFromSpans() {
        return presenter.gapsContainer.getValues();
    }

    function validateScore() {

        var valuesArray = getValuesArray();

        var isValid = true;
        var validGapsCount = 0;

        valuesArray.forEach(function (value, index) {
            if (presenter.configuration.gapsValues[index] != presenter.reconvertSign(presenter.configuration.Signs, value)) {
                isValid = false;
            } else if (value.length > 0) {
                validGapsCount++;
            }
        });

        var userExpression = getUserExpression(),
            splitted,
            splittedUserExpression = userExpression.split(' '),
            userExpressionValid = false;

        var reconvertedExpression = presenter.reconvertExpression(splittedUserExpression);

        splitted = reconvertedExpression.split('=');

        if (presenter.configuration.isEquation && splitted.length > 1 && filterInputs(function(element) { return $(element).val().length == 0; }).length == 0) {
            try {
                var userExpressionLeft = splitted[0],
                    userExpressionRight = splitted[1],
                    leftEvaluated = eval(userExpressionLeft).toFixed(2),
                    rightEvaluated = eval(userExpressionRight).toFixed(2),
                    isSameResultOnBothSides = leftEvaluated == rightEvaluated;

                userExpressionValid = true;

            } catch (_) {
                userExpressionValid = false;
            }

        }

        return {
            'userExpressionValid' : userExpressionValid,
            'isValid' : isValid,
            'isSameResultOnBothSides' : isSameResultOnBothSides,
            'leftEvaluated' : leftEvaluated,
            'rightEvaluated' : rightEvaluated,
            'validGapsCount' : validGapsCount
        }
    }

    function canNOTCheckScore() {
        return !presenter.configuration.isActivity || presenter.configuration.isDisabled;
    }

    presenter._getScore = function(){
    	if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        var validated = validateScore();

        if (presenter.configuration.isEquation) {
            if (!validated.userExpressionValid) {
                return 0;
            }

            if ( !isEquationCorrect(validated) ) {
                return 0;
            }

            return 1;

        } else {
            return validated.validGapsCount;
        }
    };

    presenter.getScore = function () {
        if (canNOTCheckScore()) {
            return 0;
        }

        if (!presenter.configuration.isDraggable) {
            if (areInputsAllEmpty()) {
                return 0;
            }
        }

        var score = presenter._getScore();

        return score;
    };

    function getValuesFromAllGaps() {
        if (presenter.configuration.isDraggable) {
            return presenter.gapsContainer.getValues();
        }

        return getValuesFromAllInputs();
    }

    function getValuesFromAllInputs() {
        var values = [];
        $.each(presenter.$view.find('input'), function() {
            values.push($(this).val());
        });
        return values;
    }

    function setValuesForAllInputs(values) {
        $.each(presenter.$view.find('input'), function(i) {
            $(this).val(values[i]);
        });
    }

    presenter.getState = function(){
        var state = {
            'values' : getValuesFromAllGaps(),
            'sources': presenter.gapsContainer.getSources(),
            'isVisible' : presenter.configuration.isVisible,
            'isDisabled' : presenter.configuration.isDisabled
        };

    	if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
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

    presenter.setState = function(stateString){
        var state = JSON.parse(stateString);

        var upgradedState = presenter.upgradeState(state);

        if (presenter.configuration.isDraggable) {
            presenter.gapsContainer.setState(upgradedState.values);
        } else {
            setValuesForAllInputs(upgradedState.values);
        }

        presenter.configuration.isVisible = upgradedState.isVisible;
        presenter.configuration.isDisabled = upgradedState.isDisabled;

        presenter.setVisibility(upgradedState.isVisible);
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

        if (presenter.configuration.isDraggable) {
            presenter.gapsContainer.block();
        } else {
            presenter.setInputsDisabledOption(true);
        }
    };

    presenter.getDisabledOption = function (booleanValue) {
        if (booleanValue) {
            return 'disabled';
        }

        return false;
    };

    presenter.setInputsDisabledOption = function (booleanValue) {
        $.each(presenter.$view.find('input'), function() {
            $(this).attr('disabled', presenter.getDisabledOption(booleanValue));

            if (booleanValue) {
                $(this).addClass('disabled');
            } else {
                $(this).removeClass('disabled');
            }
        });
    };

    presenter.enable = function() {
        presenter.configuration.isDisabled = false;
        if (presenter.configuration.isDraggable) {
            presenter.gapsContainer.unblock();
        } else {
            presenter.setInputsDisabledOption(false);
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
            'getView' : presenter.getView
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

        if (presenter.isAllOK() && !presenter.configuration.isEquation) sendAllOKEvent();
    };

    function sendAllOKEvent() {
        var eventData = {
            'source': presenter.configuration.addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    }

    presenter.onEventReceived = function (eventName, eventData) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }

        if (eventName == "ItemSelected") {
            var draggedItem = presenter.widgetsFactory.produce(
                presenter.ObjectFactory.PRODUCTION_TYPE.DRAGGED_ITEM, eventData
            );

            presenter.lastDraggedItem = draggedItem;
        }
    };
    
    presenter.showAnswers = function () {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        if (presenter.configuration.isActivity) {
            presenter.setWorkMode();
            presenter.isShowAnswersActive = true;
            presenter.gapsContainer.block();
            presenter.gapsContainer.showAnswers();
        }
    };
    
    presenter.hideAnswers = function () {
        presenter.isShowAnswersActive = false;
        presenter.gapsContainer.unblock();
        presenter.gapsContainer.hideAnswers();
    };

    presenter.parseItemValue = function (item) {
    	if(item.indexOf("**") > -1 || item.indexOf("__") > -1){
    		return item.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/__(.*?)__/g, "<i>$1</i>").replace(/__(.*?)_/g, "<i>$1_</i>").replace(/\*\*(.*?)\*/g, "<b>$1*</b>").replace(/_(.*?)__/g, "_$1").replace(/\*(.*?)\*\*/g, "*$1");
    	}else{
    		return item;
    	}
    };

    presenter.GapsContainerObject = function () {
        this._gaps = {};
        this._gapsOrderArray = [];
    };

    presenter.GapsContainerObject.prototype.getGapById = function (id) {
        return this._gaps[id];
    };

    presenter.GapsContainerObject.prototype.triggerGapDropHandler = function (id) {
        this.getGapById(id).actualGap.dropHandler();
    };

    presenter.GapsContainerObject.prototype.triggerGapClickHandler = function (id) {
        this.getGapById(id).actualGap.clickHandler();
    };

    presenter.GapsContainerObject.prototype.getValues = function () {
        return this._gapsOrderArray.map(function (element) {
            return this._gaps[element].actualGap.getValue();
        }, this);
    };

    presenter.GapsContainerObject.prototype.getMaxScore = function () {
        return this._gapsOrderArray.length;
    };

    presenter.GapsContainerObject.prototype.getSources = function () {
        return this._gapsOrderArray.map(function (gapID){
            return this._gaps[gapID].actualGap.getSource();
        }, this);
    };

    presenter.GapsContainerObject.prototype.getScoreForEventByGapID = function (gapID, value) {
        var index = this._gapsOrderArray.indexOf(gapID);

        var scoreBoolean = (value === presenter.configuration.gapsValues[index] ||
        (presenter.reconvertSign(presenter.configuration.Signs, value) == presenter.configuration.gapsValues[index]));

        if (scoreBoolean) {
            return 1;
        }

        return 0;
    };

    presenter.GapsContainerObject.prototype.getGapIndexByID = function (gapID) {
        return (this._gapsOrderArray.indexOf(gapID) + 1);
    };

    presenter.GapsContainerObject.prototype.areAllGapsEmpty = function () {
        var reducedValue = this.getValues().reduce(function (previousElement, currentElement) {
            return previousElement + currentElement;
        });

        return (reducedValue === "");
    };

    presenter.GapsContainerObject.prototype.showAnswers = function () {
        this._gapsOrderArray.map(function (gapID) {
            return this._gaps[gapID];
        }, this).forEach(function (gap, index) {
            gap.actualGap.setValue(
                presenter.convertSign(presenter.configuration.Signs, presenter.configuration.gapsValues[index])
            );

            gap.$actualView.addClass('bmg_show-answers');
        });
    };

    presenter.GapsContainerObject.prototype.hideAnswers = function () {
        this._gapsOrderArray.forEach(function (gapID) {
            this._gaps[gapID].actualGap.hideAnswers();
            this._gaps[gapID].$actualView.removeClass('bmg_show-answers');
        }, this);
    };

    presenter.GapsContainerObject.prototype.setShowErrorsModeClasses = function () {
        this._gapsOrderArray.forEach(function (gapID, index) {
            var gap = this._gaps[gapID];

            var shouldBeValue = presenter.configuration.gapsValues[index];
            var currentValue = presenter.reconvertSign(presenter.configuration.Signs, gap.actualGap.getValue());


            if (shouldBeValue == currentValue) {
                gap.$actualView.addClass('correct');
            } else {
                gap.$actualView.addClass('wrong');
            }
        }, this);
    };

    presenter.GapsContainerObject.prototype.setWorkModeClasses = function () {
        presenter.setClassWhenCheck(false);
        presenter.$view.find('.basic-math-gaps-container').removeClass('correct wrong');


        this._gapsOrderArray.forEach(function (gapID) {
            var gap = this._gaps[gapID];
            gap.$actualView.removeClass('correct wrong disabled')

        }, this);
    };

    presenter.GapsContainerObject.prototype.block = function () {
        this._gapsOrderArray.forEach(function (element) {
            this._gaps[element].actualGap.block();
        }, this);
    };

    presenter.GapsContainerObject.prototype.unblock = function () {
        this._gapsOrderArray.forEach(function (element) {
            this._gaps[element].actualGap.unblock();
        }, this);
    };

    presenter.GapsContainerObject.prototype.reset = function () {
        this._gapsOrderArray.forEach(function (gapID) {
            this._gaps[gapID].actualGap.reset();
        }, this);
    };

    presenter.GapsContainerObject.prototype.showActualView = function (id) {
        var handlerGaps = this.getGapById(id);

        var $viewToReplace = handlerGaps.actualGap.getView();


        handlerGaps.$actualView.replaceWith($viewToReplace).remove();
        handlerGaps.$actualView = $viewToReplace;

        handlerGaps.actualGap.connectEventsToReplacedView($viewToReplace);
    };

    presenter.GapsContainerObject.prototype.addGap = function (gap) {
        var id = gap.getId();

        this._gapsOrderArray.push(id);

        this._gaps[id] = {
            baseGap: gap,
            actualGap: gap,
            $actualView: gap.getView()
        };
    };

    presenter.GapsContainerObject.prototype.setState = function (valuesArray) {
        this._gapsOrderArray.forEach(function (element, index) {
            if (valuesArray[index] == "") {
                this._replaceWithEmptyGap(index);
            } else {
                this._replaceWithDraggableGap(valuesArray[index], "", index);
            }
        }, this);
    };

    presenter.GapsContainerObject.prototype._replaceWithEmptyGap = function (index) {
        var gapID = this._gapsOrderArray[index];

        var gap = this._gaps[gapID];


        var data = {
            id: gap.actualGap.getId(),
            width: presenter.configuration.gapWidth,
            float: gap.actualGap.getFloat()
        };


        var producedEmptyGap = presenter.widgetsFactory.produce(presenter.ObjectFactory.PRODUCTION_TYPE.DRAGGABLE_EMPTY_GAP, data);

        this.replaceActualGapWithId(gapID, producedEmptyGap);
        this.showActualView(gapID);
    };

    presenter.GapsContainerObject.prototype._replaceWithDraggableGap = function (value, source, index) {
        var gapID = this._gapsOrderArray[index];

        var gap = this._gaps[gapID];


        var data = {
            id: gap.actualGap.getId(),
            className: gap.actualGap.getClassName(),
            value: value,
            source: source,
            width: presenter.configuration.gapWidth,
            float: gap.actualGap.getFloat()
        };


        var producedGap = presenter.widgetsFactory.produce(presenter.ObjectFactory.PRODUCTION_TYPE.DRAGGABLE_MATH_GAP, data);

        this.replaceActualGapWithId(gapID, producedGap);
        this.showActualView(gapID);
    };

    presenter.GapsContainerObject.prototype.addFractionGap = function (gap) {
        this.addGap(gap.getNumerator());
        this.addGap(gap.getDenominator());
    };

    presenter.GapsContainerObject.prototype.replaceActualGapWithId = function (id, newGap) {
        this._gaps[id].actualGap = newGap;
    };

    presenter.GapsContainerObject.prototype.replaceActualGapWithBaseById = function (id) {
        var baseGap = this._gaps[id].baseGap;

        this._gaps[id].actualGap = baseGap;
    };

    presenter.GapObject = function (id, width, float, value, source, className) {
        this.id = id;
        this._className = className || "";
        this.width = width || 30;
        this._float = float || true;
        this._source = source || "";
        this._value = value || "";
        this._$view = this._createView();
        this._connectEvents(this._$view);
    };

    presenter.GapObject.prototype.getWidth = function () {
        return this.width;
    };

    presenter.GapObject.prototype.reset = function () {
        return this.setValue("");
    };

    presenter.GapObject.prototype.getFloat = function () {
        return this._float;
    };

    presenter.GapObject.prototype.getClassName = function () {
        return this._className;
    };

    presenter.GapObject.prototype.getSource = function () {
        return this._source;
    };

    presenter.GapObject.prototype._createView = function () {
        var $inputGap = $('<input type="text" value="" id="' + this.id + '" />');

        return $inputGap;
    };

    presenter.GapObject.prototype.setValue = function (value) {
        this._userAnswer = this._$view.val();
        this._$view.val(value);
    };

    presenter.GapObject.prototype.hideAnswers = function () {
        this._$view.val(this._userAnswer);
    };

    presenter.GapObject.prototype.setDisabledAttributeAndClass = function () {
        this._$view.attr('disabled', 'disabled');
        this._$view.addClass('disabled');
    };

    presenter.GapObject.prototype.getId = function () {
        return this.id;
    };

    presenter.GapObject.prototype._connectEvents = function ($view) {
        $view.click(function (event) {
            event.stopPropagation();
            event.preventDefault();

        });
    };

    presenter.GapObject.prototype.block = function () {
        this._$view.attr('disabled', true);
    };

    presenter.GapObject.prototype.unblock = function () {
        this._$view.attr('disabled', false);
    };

    presenter.GapObject.prototype.connectEventsToReplacedView = function ($view) {
        this._connectEvents($view);
    };

    presenter.GapObject.prototype.getValue = function () {
        return this._$view.val();
    };

    presenter.GapObject.prototype.setDroppableDisabledOption = function (booleanValue) {
        this._$view.droppable( "option", "disabled", booleanValue);
    };

    presenter.GapObject.prototype.clickHandler = function () {
    };

    presenter.GapObject.prototype.dropHandler = function () {
        presenter.lastDraggedItem.fillGap(this);
    };

    presenter.GapObject.prototype.getView = function () {
        return this._$view;
    };

    presenter.GapObject.prototype.sendItemReturnedEvent = function () {
        var eventData = {
            'item': this._source,
            'value': this._value,
            type: this._type
        };

        presenter.eventBus.sendEvent('ItemReturned', eventData);
    };

    presenter.GapObject.prototype.sendValueChangedEvent = function () {
        presenter.eventBus.sendEvent('ValueChanged', {
            source: presenter.configuration.addonID,
            value: this._value,
            score: presenter.gapsContainer.getScoreForEventByGapID(this.id, this._value),
            item: presenter.gapsContainer.getGapIndexByID(this.id)
        });

        if (presenter.isAllOK() && !presenter.configuration.isEquation) sendAllOKEvent();
    };


    presenter.ElementGapObject = function (value) {
        this._value = value;
        this._$view = this._createView();
    };

    presenter.ElementGapObject.prototype = Object.create(presenter.GapObject.prototype);
    presenter.ElementGapObject.prototype.constructor = presenter.ElementGapObject;

    presenter.ElementGapObject.prototype._createView = function () {
        return $('<span class="element">' + this._value + '</span>');
    };

    presenter.ElementGapObject.prototype.setDisabledAttributeAndClass = function () {};


    presenter.DraggableEmptyGap = function (id, width, float) {
        presenter.GapObject.call(this, id, width, float);
    };

    presenter.DraggableEmptyGap.prototype = Object.create(presenter.GapObject.prototype);
    presenter.DraggableEmptyGap.prototype.constructor = presenter.DraggableEmptyGap;

    presenter.DraggableEmptyGap.prototype._createView = function () {
        var $span = $('<span></span>');
        $span.attr('id', this.id);
        $span.addClass("ui-droppable");
        $span.addClass("ui-widget-content");
        $span.css({
            width: this.width + "px",
            display: "inline-block",
            height: "20px"
        });

        if (this._float) {
            $span.css({
                float: 'left'
            });
        }

        return $span;
    };

    presenter.DraggableEmptyGap.prototype.getValue = function () {
        return "";
    };

    presenter.DraggableEmptyGap.prototype.setValue = function (value) {
        this._$view.html(value);
    };

    presenter.DraggableEmptyGap.prototype.hideAnswers = function () {
        this._$view.html("");
    };

    presenter.DraggableEmptyGap.prototype._connectEvents = function ($view) {
        $view.droppable({
            drop: function (event, ui) {
                event.stopPropagation();
                event.preventDefault();
                var id = $(this).attr("id");
                presenter.gapsContainer.triggerGapDropHandler(id);
            }
        });
    };

    presenter.DraggableEmptyGap.prototype.block = function () {
        this.setDroppableDisabledOption(true);
    };

    presenter.DraggableEmptyGap.prototype.unblock = function () {
        this.setDroppableDisabledOption(false);
    };


    presenter.DraggableMathGapObject = function (id, width, float, value, source, className) {
        presenter.GapObject.call(this, id, width, float, value, source, className);
        this._type = "string";
    };


    presenter.DraggableMathGapObject.prototype = Object.create(presenter.GapObject.prototype);
    presenter.DraggableMathGapObject.prototype.constructor = presenter.DraggableMathGapObject;
    presenter.DraggableMathGapObject.prototype.parent = presenter.GapObject.prototype;

    presenter.DraggableMathGapObject.prototype.getValue = function () {
        return this._value;
    };

    presenter.DraggableMathGapObject.prototype.setValue = function (value) {
        this._$view.html(value);
    };

    presenter.DraggableMathGapObject.prototype.reset = function (value) {
        this.setValue("");
        this._$view.draggable("disable");
    };


    presenter.DraggableMathGapObject.prototype.hideAnswers = function () {
        this._$view.html(this._value);
    };

    presenter.DraggableMathGapObject.prototype._createView = function () {
        var $span = $('<span></span>');
        $span.attr('id', this.id);
        $span.addClass(this._className);
        $span.addClass("gap-object");
        $span.addClass("ui-draggable");
        $span.addClass("ui-widget-content");
        $span.css({
            width: this.width + "px",
            display: "inline-block",
            'text-align': "center"
        });

        $span.text(this._value);
        $span.draggable({
            revert: true,
            revertDuration: 300
        });

        if (this._float) {
            $span.css({
                float: 'left'
            });
        }

        return $span;
    };

    presenter.DraggableMathGapObject.prototype._connectEvents = function ($view) {
        this.bindClickHandler($view);

        $view.droppable({
            drop: function (event, ui) {
                event.stopPropagation();
                event.preventDefault();
                var id = $(this).attr("id");
                presenter.gapsContainer.triggerGapDropHandler(id);
            }
        });
    };

    presenter.DraggableMathGapObject.prototype.bindClickHandler = function ($view) {
        $view.click(function (event) {
            event.stopPropagation();
            event.preventDefault();
            var id = $(this).attr("id");
            presenter.gapsContainer.triggerGapClickHandler(id);
        });
    };

    presenter.DraggableMathGapObject.prototype.block = function () {
        this._$view.unbind("click");
        this.setDroppableDisabledOption(true);
    };

    presenter.DraggableMathGapObject.prototype.unblock = function () {
        this.bindClickHandler(this._$view);
        this.setDroppableDisabledOption(false);
    };

    presenter.DraggableMathGapObject.prototype.clickHandler = function () {
        this.sendItemReturnedEvent();
        presenter.gapsContainer.replaceActualGapWithBaseById(this.id);

        presenter.gapsContainer.showActualView(this.id)
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

    presenter.FractionGapObject.prototype = Object.create(presenter.GapObject.prototype);
    presenter.FractionGapObject.prototype.parent = presenter.GapObject.prototype;
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

    presenter.FractionGapObject.prototype.createGapNumerator = function (type) {
         this._numerator = presenter.widgetsFactory.produce(type, this._getNominatorProductionData());
    };

    presenter.FractionGapObject.prototype.createGapDenominator = function (type) {
         this._denominator = presenter.widgetsFactory.produce(type, this._getDenominatorProductionData());
    };

    presenter.FractionGapObject.prototype.changeCSSFloatProperty = function () {
        this._numerator.getView().css({
            float: 'none'
        });

        this._denominator.getView().css({
            float: 'none'
        });
    };

    presenter.FractionGapObject.prototype._getNominatorProductionData = function () {
        return {
            id: this._id + "-numerator",
            width: presenter.configuration.gapWidth
        };
    };

    presenter.FractionGapObject.prototype._getDenominatorProductionData = function () {
        return {
            id: this._id + "-denominator",
            width: presenter.configuration.gapWidth
        };
    };

    presenter.FractionGapObject.prototype.addDisabledAttributeAndClassNumerator = function () {
        this._numerator.setDisabledAttributeAndClass();
    };

    presenter.FractionGapObject.prototype.addDisabledAttributeAndClassDenominator = function () {
        this._denominator.setDisabledAttributeAndClass();
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
        this.draggedItemFactory = new presenter.DraggedItemFactoryObject();
        this.gapsContainerFactory = new presenter.GapsContainerFactoryObject();
    };

    presenter.ObjectFactory.PRODUCTION_TYPE = {
        EDITABLE_INPUT_GAP: 0,
        FRACTION_GAP: 1,
        ELEMENT_GAP: 2,
        DRAGGED_ITEM: 3,
        DRAGGABLE_MATH_GAP: 4,
        GAP_CONTAINER: 5,
        DRAGGABLE_EMPTY_GAP: 6
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
            case presenter.ObjectFactory.PRODUCTION_TYPE.DRAGGABLE_EMPTY_GAP:
                producedItem = this.gapsFactory.produce(presenter.ObjectFactory.PRODUCTION_TYPE.DRAGGABLE_EMPTY_GAP, data);
                break;
            case presenter.ObjectFactory.PRODUCTION_TYPE.DRAGGED_ITEM:
                producedItem = this.draggedItemFactory.produce(data);
                break;
            case presenter.ObjectFactory.PRODUCTION_TYPE.GAP_CONTAINER:
                producedItem = this.gapsContainerFactory.produce(data);
                break;
        }
        
        return producedItem;
    };

    presenter.FractionBuilderObject = function () {

    };

    presenter.FractionBuilderObject.prototype = Object.create(presenter.ObjectFactory.prototype);
    presenter.FractionBuilderObject.prototype.constructor = presenter.FractionBuilderObject;

    presenter.FractionBuilderObject.prototype.produce = function (data) {
        var fraction = this._produceFractionObject(data);

        this._setNumerator(fraction, data);
        this._setDenominator(fraction, data);

        this._setDisabled(fraction);
        fraction.changeCSSFloatProperty();

        fraction.joinNumeratorDenominator();

        return fraction;
    };

    presenter.FractionBuilderObject.prototype._setDisabled = function (fraction) {
        if (presenter.configuration.isDisabled) {
            fraction.addDisabledAttributeAndClassDenominator();
            fraction.addDisabledAttributeAndClassNumerator();
        }
    };

    presenter.FractionBuilderObject.prototype._produceFractionObject = function (data) {
        return new presenter.FractionGapObject(data.fractionID);
    };

    presenter.FractionBuilderObject.prototype._setNumerator = function (fraction, data) {
        if (data.fraction.numerator.isGap) {
            if (presenter.configuration.isDraggable) {
                fraction.createGapNumerator(presenter.ObjectFactory.PRODUCTION_TYPE.DRAGGABLE_EMPTY_GAP);
            } else {
                fraction.createGapNumerator(presenter.ObjectFactory.PRODUCTION_TYPE.EDITABLE_INPUT_GAP);
            }
        } else {
            fraction.createElementNumerator(data.fraction.numerator.parsed);
        }
    };

    presenter.FractionBuilderObject.prototype._setDenominator = function (fraction, data) {
        if (data.fraction.denominator.isGap) {
            if (presenter.configuration.isDraggable) {
                fraction.createGapDenominator(presenter.ObjectFactory.PRODUCTION_TYPE.DRAGGABLE_EMPTY_GAP);
            } else {
                fraction.createGapDenominator(presenter.ObjectFactory.PRODUCTION_TYPE.EDITABLE_INPUT_GAP);
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
            case presenter.ObjectFactory.PRODUCTION_TYPE.FRACTION_GAP:
                return this.produceFractionGap(data);
                break;
            case presenter.ObjectFactory.PRODUCTION_TYPE.DRAGGABLE_MATH_GAP:
                return this.produceDraggableMathGap(data);
            case presenter.ObjectFactory.PRODUCTION_TYPE.DRAGGABLE_EMPTY_GAP:
                return this.produceDraggableEmptyGap(data);
                break;
            case presenter.ObjectFactory.PRODUCTION_TYPE.ELEMENT_GAP:
                return this.produceElementGap(data);
                break;
        }
    };

    presenter.GapsFactoryObject.prototype.produceEditableInputGap = function (data) {
        return new presenter.GapObject(data.id, data.width);
    };

    presenter.GapsFactoryObject.prototype.produceDraggableMathGap = function (data) {
        return new presenter.DraggableMathGapObject(
            data.id,  data.width, data.float, data.value, data.source, data.className
        );
    };

    presenter.GapsFactoryObject.prototype.produceElementGap = function (value) {
        return new presenter.ElementGapObject(value);
    };

    presenter.GapsFactoryObject.prototype.produceDraggableEmptyGap = function (data) {
        return new presenter.DraggableEmptyGap( data.id, data.width, data.float);
    };

    presenter.GapsFactoryObject.prototype.produceFractionGap = function (data) {
        return this._fractionBuilder.produce(data);
    };

    presenter.GapsContainerFactoryObject = function () {};

    presenter.GapsContainerFactoryObject.prototype = Object.create(presenter.ObjectFactory.prototype);
    presenter.GapsContainerFactoryObject.prototype.constructor = presenter.GapsContainerFactoryObject;

    presenter.GapsContainerFactoryObject.prototype.produce = function (data) {
        var container = presenter.$view.find('.basic-math-gaps-container');
        var hasFractions = false;

        data.forEach(function (element, index) {
            var item;

            switch (element.gapType) {
                case presenter.ObjectFactory.PRODUCTION_TYPE.EDITABLE_INPUT_GAP:
                    item = this._produceNormalGap(this._getNormalGapData(index));
                    presenter.gapsContainer.addGap(item);
                    break;
                case presenter.ObjectFactory.PRODUCTION_TYPE.FRACTION_GAP:
                    item = this._produceFractionGap(element, this._getElementId(index));
                    presenter.gapsContainer.addFractionGap(item);
                    hasFractions = true;
                    break;
                case presenter.ObjectFactory.PRODUCTION_TYPE.ELEMENT_GAP:
                    item = this._produceElementGap(element);
                    break;
            }

            container.append(item.getView());

            if (element.isHiddenAdditionAfter) {
                container.append($('<span class="hidden-addition">+</span>'));
            }

        }, this);

        if (hasFractions) {
            container.addClass('hasFractions');
        }
    };

    presenter.GapsContainerFactoryObject.prototype._produceNormalGap = function (data) {
        var gap;

        data.float = true;

        if (presenter.configuration.isDraggable) {
            gap = presenter.widgetsFactory.produce(presenter.ObjectFactory.PRODUCTION_TYPE.DRAGGABLE_EMPTY_GAP, data);
        } else {
            gap = presenter.widgetsFactory.produce(presenter.ObjectFactory.PRODUCTION_TYPE.EDITABLE_INPUT_GAP, data);
        }

        if (presenter.configuration.isDisabled) {
            gap.setDisabledAttributeAndClass();
        }

        return gap;
    };

    presenter.GapsContainerFactoryObject.prototype._getNormalGapData = function (index) {
        return {
            id: this._getElementId(index),
            width: presenter.configuration.gapWidth,
            float: true
        };
    };

    presenter.GapsContainerFactoryObject.prototype._produceElementGap = function (data) {
        return presenter.widgetsFactory.produce(presenter.ObjectFactory.PRODUCTION_TYPE.ELEMENT_GAP, data.originalForm);
    };

    presenter.GapsContainerFactoryObject.prototype._getElementId = function (index) {
        return (presenter.configuration.addonID + "-" + index);
    };

    presenter.GapsContainerFactoryObject.prototype._produceFractionGap = function (data, id) {
        data.fractionID = id;

        return presenter.widgetsFactory.produce(presenter.ObjectFactory.PRODUCTION_TYPE.FRACTION_GAP, data);
    };
    
    presenter.DraggedItemFactoryObject = function () {};
    
    presenter.DraggedItemFactoryObject.prototype = Object.create(presenter.ObjectFactory.prototype);
    presenter.DraggedItemFactoryObject.prototype.constructor = presenter.DraggedItemFactoryObject;
    presenter.DraggedItemFactoryObject.prototype.produce = function (data) {
        data = this._validateEventData(data);

        switch (data.type) {
            case "string":
                return this.produceTextItem(data);
                break;
            default:
                return this.produceNullItem();
                break;
        }
    };

    presenter.DraggedItemFactoryObject.prototype._validateEventData = function (data) {
        if (data.type === undefined) {
            data.type = "NullObject";
            return data;
        }

        if (data.value === undefined) {
            data.type = "NullObject";
            return data;
        }

        if (data.item === undefined) {
            data.type = "NullObject";
            return data;
        }

        return data;
    };
    
    presenter.DraggedItemFactoryObject.prototype.produceTextItem = function (data) {
        return new presenter.TextItem(data.item, data.value, data.item);
    };

    presenter.DraggedItemFactoryObject.prototype.produceNullItem = function () {
        return new presenter.NullItemObject();
    };

    presenter.DraggedItem = function (parent, value, source) {
        this.parent = parent;
        this.value = value;
        this.source = source;
        this._type = "";
    };

    presenter.DraggedItem.prototype.getView = function () {
        return this._$view;
    };

    presenter.DraggedItem.prototype.sendItemConsumedEvent = function () {
        var eventData = {
            'item': this.source,
            'value': this.value,
            type: this._type
        };

        presenter.eventBus.sendEvent('ItemConsumed', eventData);
    };

    presenter.DraggedItem.prototype.fillGap = function () {
        return "NotImplementedError";
    };
    
    presenter.NullItemObject = function () {};

    presenter.NullItemObject.prototype = Object.create(presenter.DraggedItem.prototype);
    presenter.NullItemObject.prototype.sendItemConsumedEvent = function () {};

    presenter.NullItemObject.prototype.fillGap = function (gapToFill) {

    };

    presenter.TextItem = function (parent, value, source) {
        presenter.DraggedItem.call(this, parent, value, source);
        this._type = "string";
    };

    presenter.TextItem.prototype = Object.create(presenter.DraggedItem.prototype);
    presenter.TextItem.prototype.parent = presenter.DraggedItem.prototype;
    presenter.TextItem.prototype.constructor = presenter.TextItem;

    presenter.TextItem.prototype.fillGap = function (gapToFill) {
        this.sendItemConsumedEvent();

        var gapID = gapToFill.getId();


        var fillingGap = this.getFillingGap(
            gapID,
            gapToFill.getClassName(),
            gapToFill.getWidth(),
            gapToFill.getFloat()
        );

        presenter.gapsContainer.replaceActualGapWithId(gapID, fillingGap);
        presenter.gapsContainer.showActualView(gapID);
        fillingGap.sendValueChangedEvent();
    };

    presenter.TextItem.prototype.getFillingGap = function (id, className, width, float) {
        return presenter.widgetsFactory.produce(
            presenter.ObjectFactory.PRODUCTION_TYPE.DRAGGABLE_MATH_GAP,
            {
                id: id,
                className: className,
                width: width,
                value: presenter.parseItemValue(this.value),
                source: this.source,
                float: float
            }
        );
    };

    return presenter;
}