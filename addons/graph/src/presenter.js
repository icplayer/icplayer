function Addongraph_create(){

    /*
    *KNOWN ISSUES:
    *       Invalid properties values (Data, Y grid step, Y max, Y min values):
    *           addon graph uses functions with errors - parseInt & parseFloat. It creates situations where user could
    *           type in properties fields digits with strings, and graph still shows up as valid. Changing validation to
    *           be too much accurate can break backward compatibility
    *
    *       Answers greater than Y max / lower than Y min:
    *           Answers validation is invalid. It allows create graphs where answer is greater or lower than YMax/YMin.
    *           Changing this validation can break backward compatibility, graph addon have to allow such invalid situations.
    *
    *       Y grid step greater than Y max:
    *           Y grid step validation is also invalid. Allows situations where grid is greater then Y max, it should
    *           just show nothing, no grid & no Y axis values.
    *
    *       Model validation flow:
    *          Logic of parsing & validating properties requires some properties be checked and parsed at first.
    *          Don't changeflow of model validation.
    *
    */
    var presenter = function(){};

    presenter.drawingXPosition  = null;
    presenter.absoluteRange     = null;
    presenter.chartInner        = null;
    presenter.axisXLine         = null;
    presenter.eventBus          = null;
    presenter.playerController  = null;
    presenter.errorMode         = false;
    presenter.isStarted         = false;
    presenter.isGradualShowAnswersActive = false;
    presenter.GSAcounter        = 0;
    presenter.currentData       = [];

    presenter.$view             = null;
    presenter.configuration     = {};
    var minimumValueGraph;


    presenter.ERROR_MESSAGES = {
        DATA_ROW_NOT_ENOUGH_COLUMNS:      "Row %row% in data contains not enough columns, minimum amount of columns is 2 - first indicates X axis description, second and further contain values",
        DATA_ROW_MALFORMED:               "Row %row% is not valid CSV - check its syntax",
        DATA_ROW_VALUE_NOT_NUMERIC:       "Value \"%value%\" of column %column% of row %row% is not numeric",
        DATA_ROW_DIFFERENT_COLUMNS_COUNT: "Row %row% contains different amount of columns than previous rows",
        AXIS_Y_MAXIMUM_VALUE_NOT_NUMERIC: "Y axis maximum value is not numeric",
        AXIS_Y_MINIMUM_VALUE_NOT_NUMERIC: "Y axis minimum value is not numeric",
        AXIS_Y_MAXIMUM_VALUE_TOO_SMALL:   "Cannot fit graph into view container - Y axis maximum value of %range% is smaller than maximum value %value% passed with the data",
        AXIS_Y_MINIMUM_VALUE_TOO_BIG:     "Cannot fit graph into view container - Y axis minimum value of %range% is bigger than minimum value %value% passed with the data",
        AXIS_Y_DOES_NOT_INCLUDE_ZERO:     "Invalid Y axis minimum & maximum value - graph should contain value of zero",
        AXIS_Y_GRID_STEP_NOT_NUMERIC:     "Y axis grid step is not numeric",
        SERIES_COLORS_AMOUNT_INVALID:     "Amount of Series colors is different that amount of columns in the data",
        INTERACTIVE_STEP_NOT_NUMERIC:     "Interactive step is not numeric",
        INTERACTIVE_STEP_NOT_POSITIVE:    "Interactive step is not a positive integer",
        ANSWER_NOT_NUMERIC:               "Answer \"%answer%\" is not numeric",
        ANSWERS_AMOUNT_INVALID:           "Amount of answers (%answers%) has to be equal amount of bars (%bars%)",
        AXIS_X_SERIES_DESCRIPTIONS_AMOUNT_INVALID: "Amount of X axis series descriptions (%descriptions%) has to be equal to amount of series (%series%)",
        AXIS_X_BARS_DESCRIPTIONS_AMOUNT_INVALID:   "Amount of X axis bars descriptions (%descriptions%) has to be equal to amount of bars (%bars%)",
        YAV_01: "Y axis values have to be float numbers.",
        YAV_02: "Cyclic value can't be zero number in Y axis values property.",
        YAV_03: "Y axis values can't be greater than Y maximum value.",
        YAV_04: "Y axis values can't be lower than Y minimum value.",
        YAV_05: "Cyclic value can't be negative number in Y axis values property.",
        YAV_06: "Y axis values can't have duplicated numbers"
    };

    presenter.CSS_CLASSES = {
        SHOW_EXAMPLE : 'graph_show_example'
    };

    presenter.showErrorMessage = function(message, substitutions) {
        var errorContainer;
        if(typeof(substitutions) == 'undefined') {
            errorContainer = '<p>' + message + '</p>';
        } else {
            var messageSubst = message;
            for(var key in substitutions) {
                messageSubst = messageSubst.replace('%' + key + '%', substitutions[key]);
            }
            errorContainer = '<p>' + messageSubst + '</p>';
        }

        presenter.$view.html(errorContainer);
    };

    presenter.redrawGraphValue = function(valueContainer) {
        var currentValue = parseFloat(valueContainer.attr('current-value'));
        var valueElement = valueContainer.find('.graph_value_element');

        if(currentValue >= 0) {
            valueElement.removeClass('graph_value_element_negative').addClass('graph_value_element_positive');
            valueContainer.css({
                bottom: (presenter.drawingXPosition - Math.round(presenter.axisXLine.height() / 2)) + 'px',
                height: parseFloat(currentValue / presenter.absoluteRange) * 100 + '%',
                top: ''
            });

        } else if (currentValue < 0) {
            valueElement.removeClass('graph_value_element_positive').addClass('graph_value_element_negative');
            valueContainer.css({
                height: parseFloat(currentValue * -1 / presenter.absoluteRange) * 100 + '%',
                top: (presenter.chartInner.height() - presenter.drawingXPosition + Math.round(presenter.axisXLine.height() / 2)) + 'px',
                bottom: ''
            });
        }
    };


    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };


    presenter.areAllOk = function(currentGridValues) {
        for (var i = 0; i < currentGridValues.length; i++) {
            if (currentGridValues[i].indexOf(false) !== -1) {
                return false;
            }
        }

        return true;
    };

    presenter.sendOverallScoreEvent = function(direction, valueId, newValue, wasAllValidBeforeChange, wasThisValidBeforeChange, willAllBeValidAfterChange, willThisBeValidAfterChange) {
        var score =
            (wasAllValidBeforeChange    ? 'BEFORE_ALL_VALID '  : 'BEFORE_ALL_INVALID ') +
                (wasThisValidBeforeChange   ? 'BEFORE_THIS_VALID ' : 'BEFORE_THIS_INVALID ') +
                (willAllBeValidAfterChange  ? 'AFTER_ALL_VALID '   : 'AFTER_ALL_INVALID ') +
                (willThisBeValidAfterChange ? 'AFTER_THIS_VALID'   : 'AFTER_THIS_INVALID');

        var parsedValue = '' + newValue;
        if (presenter.configuration.isDecimalSeparatorSet) {
            parsedValue = parsedValue.replace('.', presenter.configuration.decimalSeparator);
        }

        presenter.eventBus.sendEvent('ValueChanged', {
            'source': presenter.configuration.ID,
            'item'  : valueId + ' ' + direction,
            'value' : parsedValue,
            'score' : score
        });

        presenter.configuration.results[valueId.split(' ')[0]][valueId.split(' ')[1]] = willThisBeValidAfterChange;

        presenter.eventBus.sendEvent('ValueChanged', {
            'source': presenter.configuration.ID,
            'item': valueId,
            'value': parsedValue,
            'score': willThisBeValidAfterChange ? '1' : '0'
        });

        if (presenter.areAllOk(presenter.configuration.results)) {
            presenter.eventBus.sendEvent('ValueChanged', {
                'source': presenter.configuration.ID,
                'item': 'all',
                'value': '',
                'score': ''
            });
        }

    };

    presenter.areAllBarsValid = function() {
        var r = true;
        presenter.$view.find('.graph_value_container').each(function(i, e) {
            if(presenter.configuration.answers[i] != parseFloat($(e).attr('current-value'))) {
                r = false;
            }
        });

        return r;
    };

    presenter.setShowErrorsMode = function() {
        if( presenter.isShowAnswersActive){
            presenter.hideAnswers();
        }

        if( presenter.isGradualShowAnswersActive){
            presenter.gradualHideAnswers();
        }

        presenter.errorMode = true;
        if (!presenter.isStarted || presenter.configuration.isNotActivity) {
            return 0;
        }

        presenter.configuration.shouldCalcScore = true;

        if(presenter.configuration.isInteractive) {
            presenter.$view.find('.graph_value_element_interactive, .graph_column_container_below, .graph_column_container_above').css('cursor', 'default');

            presenter.$view.find('.graph_value_container').each(function(index, element) {
                if (!presenter.configuration.exampleAnswers[index]) {
                    presenter.handleCheckingAnswers(index, element);
                }
            });
        }
    };

    presenter.handleCheckingAnswers = function (index, element) {
        if (presenter.configuration.answers[index] != parseFloat($(element).attr('current-value'))) {
            $(element).find('.graph_value_element').addClass('graph_value_element_invalid');
            $(element).find('.graph_value_element_positive').addClass('graph_value_element_positive_invalid');
            $(element).find('.graph_value_element_negative').addClass('graph_value_element_negative_invalid');
        } else {
            $(element).find('.graph_value_element').addClass('graph_value_element_valid');
            $(element).find('.graph_value_element_positive').addClass('graph_value_element_positive_valid');
            $(element).find('.graph_value_element_negative').addClass('graph_value_element_negative_valid');
        }
    };

    presenter.setWorkMode = function() {
        presenter.errorMode = false;
        presenter.configuration.shouldCalcScore = true;

        if(presenter.configuration.isInteractive) {
            presenter.$view.find('.graph_value_element_interactive, .graph_column_container_below, .graph_column_container_above').css('cursor', '');

            var classesToRemove =
                [ 'graph_value_element_invalid', 'graph_value_element_positive_invalid', 'graph_value_element_negative_invalid',
                    'graph_value_element_valid',   'graph_value_element_positive_valid',   'graph_value_element_negative_valid' ];

            for(var i = 0; i < classesToRemove.length; i++) {
                presenter.$view.find('.' + classesToRemove[i]).removeClass(classesToRemove[i]);
            }
        }
    };

    presenter.calcScore = function () {
        var score = 0;
        presenter.$view.find('.graph_value_container').each(function(index, element) {
            if(presenter.configuration.answers[index] == parseFloat($(element).attr('current-value'))) {
                score++
            }
        });

        return score;
    };

    presenter.getScore = function() {
        if (presenter.configuration.isNotActivity || !presenter.configuration.shouldCalcScore || !presenter.isStarted) {
            return 0;
        }

        return presenter.calcScore();
    };

    presenter.getMaxScore = function() {
        if (presenter.configuration.isNotActivity) return 0;
        const examples = presenter.configuration.exampleAnswers.filter(Boolean).length;

        return presenter.configuration.answers.length - examples;
    };

    presenter.getErrorCount = function() {
        if (presenter.configuration.isNotActivity || !presenter.configuration.shouldCalcScore || !presenter.isStarted) {
            return 0;
        }

        return presenter.getMaxScore() - presenter.getScore();
    };

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
    };

    presenter.redrawValueContainers = function () {
        var valueContainers = presenter.$view.find('.graph_value_container');
        var currentValueContainer;

        for (var i = 0; i < presenter.configuration.data.length; i++) {
            for (var j = 0; j < presenter.configuration.data[i].length; j++) {
                currentValueContainer = $(valueContainers[i * presenter.configuration.data[i].length + j]);
                currentValueContainer.attr('current-value', presenter.configuration.data[i][j]);
                presenter.redrawGraphValue(currentValueContainer);
            }
        }
    };

    presenter.reset = function() {
        presenter.isStarted = false;
        presenter.configuration.shouldCalcScore = true;
        presenter.isShowAnswersActive = false;
        presenter.isGradualShowAnswersActive = false;
        presenter.currentData = [];
        presenter.GSAcounter = 0;

        presenter.redrawValueContainers();

        presenter.configuration.isVisible = presenter.configuration.isVisibleByDefault;
        presenter.setVisibility(presenter.configuration.isVisible);

        presenter.setWorkMode();

        presenter.removeShowAnswersClass();
        presenter.drawExampleAnswers();
    };

    presenter.removeShowAnswersClass = function () {
        presenter.$view.find(".graph_value_container").each(function (index, element) {
            $(element).parent().find('.graph_column_container_interactive').removeClass("graph_column_container_show_answers");
            $(element).removeClass("graph_show_answers");
        });
    };


    presenter.getState = function() {
        var r = [];
        presenter.$view.find('.graph_value_container').each(function(index, element) {
            r.push(parseFloat($(element).attr('current-value')));
        });
        var state = {
            'r' : r,
            'isVisible' : presenter.configuration.isVisible,
            shouldCalcScore: presenter.configuration.shouldCalcScore,
            isStarted: presenter.isStarted
        };
        return JSON.stringify(state);
    };


    presenter.setState = function(stateString) {
        var state = JSON.parse(stateString),
            valueContainers = presenter.$view.find('.graph_value_container'),
            currentValueContainer,
            r = state.r, i,
            shouldCalcScore = state.shouldCalcScore;

        for (i = 0; i < r.length; i++) {
            currentValueContainer = $(valueContainers[i]);
            currentValueContainer.attr('current-value', parseFloat(r[i]));
            presenter.redrawGraphValue(currentValueContainer);
        }

        presenter.setVisibility(state.isVisible);
        presenter.configuration.isVisible = state.isVisible;
        presenter.configuration.shouldCalcScore = shouldCalcScore;
        presenter.isStarted = state.isStarted;
        presenter.drawExampleAnswers();
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
        presenter.configuration.shouldCalcScore = true;
    };

    presenter.show = function() {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
        presenter.configuration.shouldCalcScore = true;
    };

    presenter.getValue = function (index) {
        presenter.configuration.shouldCalcScore = true;

        var maxIndex = presenter.$view.find('.graph_column_container').length;

        if (!ModelValidationUtils.validateIntegerInRange(index, maxIndex, 1).isValid) return;

        var $column = presenter.$view.find('.graph_column_container:eq(' + (index - 1) + ') .graph_value_container');

        return parseFloat($column.attr('current-value'));
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide' : presenter.hide,
            'getValue': presenter.getValue,
            'isAllOK': presenter.isAllOK
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    function prepareAndSendEvent(direction, changedBarIndex, currentValue, newValue, valueContainer) {
        var wasAllValidBeforeChange = presenter.areAllBarsValid();
        var wasThisValidBeforeChange = presenter.configuration.answers[changedBarIndex] == currentValue;
        var willAllBeValidAfterChange = presenter.areAllBarsValid();
        var willThisBeValidAfterChange = presenter.configuration.answers[changedBarIndex] == newValue;

        presenter.sendOverallScoreEvent(direction,
            valueContainer.attr('value-id'),
            newValue,
            wasAllValidBeforeChange,
            wasThisValidBeforeChange,
            willAllBeValidAfterChange,
            willThisBeValidAfterChange
        );
    }

    presenter.getProperPrecision = function (number1, number2) {
        var number1Precision = 0, number2Precision = 0;

        if (('' + number1).split('.')[1]) {
            number1Precision = ('' + number1).split('.')[1].length;
        }

        if (('' + number2).split('.')[1]) {
            number2Precision = ('' + number2).split('.')[1].length;
        }

        return Math.max(number1Precision, number2Precision);
    };

    presenter.increaseGraphValue = function(eventData) {
        eventData.stopPropagation();
        const valueContainer = $(eventData.target).parent().find('.graph_value_container');
        const changedBarIndex = presenter.$view.find('.graph_series .graph_value_container').index(valueContainer);
        const isExampleAnswer = presenter.configuration.exampleAnswers[changedBarIndex];

        if (presenter.shouldStopAction() || isExampleAnswer) { return; }

        presenter.configuration.shouldCalcScore = true;
        if (presenter.configuration.mouseData.wasDragged) {
            presenter.configuration.mouseData.wasDragged = false;
            return false;
        }

        var currentValue = parseFloat(valueContainer.attr('current-value')),
            minInteractivePoint = presenter.getMinimumInteractivePoint(valueContainer.attr('value-id')),
            newValue, newValuePrecision;

        if (currentValue == presenter.configuration.axisYMinimumValue && minInteractivePoint !== currentValue) {
            // Special case when current value is minimum and can not match with those calculated with interactive step
            newValue = minInteractivePoint;
            newValuePrecision = presenter.getProperPrecision(minInteractivePoint, presenter.configuration.interactiveStep);
        } else {
            newValue = currentValue + presenter.configuration.interactiveStep;
            newValuePrecision = presenter.getProperPrecision(currentValue, presenter.configuration.interactiveStep);
        }

        if(newValue > presenter.configuration.axisYMaximumValue) return;

        valueContainer.attr('current-value', newValue.toFixed(newValuePrecision));
        presenter.redrawGraphValue(valueContainer);

        if (currentValue === newValue) return;

        prepareAndSendEvent("increase", changedBarIndex, currentValue, newValue, valueContainer);
    };

    presenter.decreaseGraphValue = function(eventData) {
        eventData.stopPropagation();

        if (presenter.shouldStopAction() || presenter.isExample(eventData)) { return; }

        presenter.configuration.shouldCalcScore = true;
        if (presenter.configuration.mouseData.wasDragged) {
            presenter.configuration.mouseData.wasDragged = false;
            return false;
        }

        var valueContainer;
        if($(eventData.target).parent().hasClass('graph_value_container')) {
            // Clicked in bar
            valueContainer = $(eventData.target).parent();
        } else {
            // Clicked below bar
            valueContainer = $(eventData.target).parent().find('.graph_value_container');
        }

        var changedBarIndex = presenter.$view.find('.graph_series .graph_value_container').index(valueContainer),
            currentValue = parseFloat(valueContainer.attr('current-value')),
            maxInteractivePoint = presenter.getMaximumInteractivePoint(valueContainer.attr('value-id')),
            newValue, newValuePrecision,
            isExample = presenter.configuration.exampleAnswers[changedBarIndex];

        if (isExample) { return; }

        if (currentValue == presenter.configuration.axisYMaximumValue && maxInteractivePoint !== currentValue) {
            // Special case when current value is maximum and can not match with those calculated with interactive step
            newValue = maxInteractivePoint;
            newValuePrecision = presenter.getProperPrecision(maxInteractivePoint, presenter.configuration.interactiveStep);
        } else {
            newValue = currentValue - presenter.configuration.interactiveStep;
            newValuePrecision = presenter.getProperPrecision(currentValue, presenter.configuration.interactiveStep);
        }

        if(newValue < presenter.configuration.axisYMinimumValue) return;

        var splittedStep = presenter.configuration.axisYGridStep.toString().split('.'),
            precision;
        if(splittedStep[1]){
            precision = splittedStep[1].length;
            valueContainer.attr('current-value', newValue.toFixed(precision));
        }else{
            valueContainer.attr('current-value', newValue.toFixed(newValuePrecision));
        }

        presenter.redrawGraphValue(valueContainer);

        if (currentValue === newValue) return;

        prepareAndSendEvent("decrease", changedBarIndex, currentValue, newValue, valueContainer);
    };

    presenter.isExample = function (event) {
        return event.srcElement.offsetParent.className.includes(presenter.CSS_CLASSES.SHOW_EXAMPLE)
    };

    function getValueElement() {
        var $element;

        if (presenter.configuration.mouseData.$element.hasClass('graph_value_element')) {
            $element = presenter.configuration.mouseData.$element;
        } else {
            $element = presenter.configuration.mouseData.$element.parent().find('.graph_value_element');
        }

        return $element;
    }

    function isAboveXAxis($element) {
        return $element.hasClass('graph_value_element_positive');
    }

    function getColumnContainer($valueElement) {
        var containerClassName = '.graph_column_container_' + (isAboveXAxis($valueElement) ? 'above' : 'below');
        return $valueElement.parent().parent().find(containerClassName);
    }

    function isMoreThanOneFingerGesture(event) {
        return (event.touches.length || event.changedTouches.length) > 1;
    }

    function mouseDownCallback (eventData) {
        if (presenter.shouldStopAction() || presenter.isExample(eventData)) { return; }

        presenter.configuration.mouseData.isMouseDown = true;
        presenter.configuration.mouseData.wasMouseDown = true;
        presenter.configuration.mouseData.wasDragged = false;
        presenter.configuration.mouseData.oldPosition.y = eventData.pageY;
        presenter.configuration.mouseData.$element = $(eventData.target);

        var $container = getValueElement().parent();

        presenter.configuration.mouseData.currentValue = parseFloat($container.attr('current-value'));
    }

    function touchStartCallback (event) {
        if (isMoreThanOneFingerGesture(event)) {
            presenter.configuration.mouseData.wasDragged = true;
            return;
        }

        event.preventDefault();

        var touch = event.touches[0] || event.changedTouches[0];
        mouseDownCallback(touch);
    }

    function columnContainerMouseDownCallback (eventData) {
        if (presenter.shouldStopAction() || presenter.isExample(eventData)) { return; }

        presenter.configuration.shouldCalcScore = true;
        presenter.configuration.mouseData.$element = $(eventData.target);
        var $element = getValueElement(), currentValue = parseFloat($element.parent().attr('current-value'));

        if (currentValue === 0) {
            presenter.configuration.mouseData.wasMouseDown = true;
            presenter.configuration.mouseData.isMouseDown = true;
            presenter.configuration.mouseData.wasDragged = false;
            presenter.configuration.mouseData.oldPosition.y = eventData.pageY;
            presenter.configuration.mouseData.$element = $element;
            presenter.configuration.mouseData.currentValue = currentValue;
        }
    }

    function columnContainerTouchStartCallback (event) {
        if (isMoreThanOneFingerGesture(event)) {
            presenter.configuration.mouseData.wasDragged = true;
            return;
        }

        event.preventDefault();

        var touch = event.touches[0] || event.changedTouches[0];

        presenter.configuration.mouseData.isColumnContainerTouchTriggered = true;
        presenter.configuration.mouseData.isColumnContainerTriggerIncrease = $(touch.target).hasClass('graph_column_container_above');
        presenter.configuration.mouseData.columnContainerEventData = touch;

        columnContainerMouseDownCallback(touch);
    }

    presenter.whichPoint = function (position, maximumValue, containerHeight, step) {
        var snapPointsCount = Math.floor(maximumValue / step), halfOfValueHigh = (containerHeight / (maximumValue / step)) / 2;

        if (position < halfOfValueHigh) {
            return 0;
        } else if (position >= containerHeight - halfOfValueHigh) {
            return maximumValue;
        } else {
            for (var i = 1; i <= snapPointsCount; i++) {
                var snapPoint = 2 * halfOfValueHigh * i;
                if (position >= snapPoint - halfOfValueHigh && position < snapPoint + halfOfValueHigh) return i * step;
            }
        }
    };

    presenter.getInitialData = function (valueID) {
        var series = parseInt(valueID.split(' ')[0], 10),
            index = parseInt(valueID.split(' ')[1], 10);

        return parseFloat(presenter.configuration.data[series][index]);
    };

    presenter.getMaximumInteractivePoint = function (valueID) {
        var initialData = presenter.getInitialData(valueID),
            interactiveStep = presenter.configuration.interactiveStep,
            maxYValue = presenter.configuration.axisYMaximumValue,
            maxPoint = initialData;

        while (maxPoint + interactiveStep <= maxYValue) {
            maxPoint += interactiveStep;
        }

        return maxPoint
    };

    presenter.getMinimumInteractivePoint = function (valueID) {
        var initialData = presenter.getInitialData(valueID),
            interactiveStep = presenter.configuration.interactiveStep,
            minYValue = presenter.configuration.axisYMinimumValue,
            minPoint = initialData;

        while (minPoint - interactiveStep >= minYValue) {
            minPoint -= interactiveStep;
        }

        return minPoint
    };

    function triggerColumnContainerClickHandler() {
        if (presenter.configuration.mouseData.isColumnContainerTriggerIncrease) {
            presenter.increaseGraphValue(presenter.configuration.mouseData.columnContainerEventData);
        } else {
            presenter.decreaseGraphValue(presenter.configuration.mouseData.columnContainerEventData);
        }
    }

    function mouseUpCallback (eventData) {
        if (presenter.shouldStopAction() || presenter.isExample(eventData)) { return; }

        presenter.isStarted = true;
        presenter.configuration.shouldCalcScore = true;

        if (!presenter.configuration.mouseData.isMouseDown) {
            if (presenter.configuration.mouseData.isColumnContainerTouchTriggered) {
                triggerColumnContainerClickHandler();
            }
            return;
        }

        presenter.configuration.mouseData.isMouseDown = false;
        if (!presenter.configuration.mouseData.wasDragged) {
            if (presenter.configuration.mouseData.isColumnContainerTouchTriggered) {
                triggerColumnContainerClickHandler();
            }
            return;
        }

        var $element = getValueElement();
        var $container = $element.parent(), height = $container.height();

        var valueContainer = presenter.configuration.mouseData.$element.parent(),
            columnContainer = getColumnContainer($element),
            columnContainerHeight = columnContainer.height(),
            newValue;

        var halfOfValueHigh;
        if (isAboveXAxis($element)) {
            halfOfValueHigh = (columnContainerHeight / presenter.configuration.axisYMaximumValue) / 2;
        } else {
            halfOfValueHigh = (columnContainerHeight / Math.abs(presenter.configuration.axisYMinimumValue)) / 2;
        }

        if (height < halfOfValueHigh) {
            newValue = 0;
        } else if (height >= columnContainerHeight - halfOfValueHigh) {
            newValue = isAboveXAxis($element) ? presenter.configuration.axisYMaximumValue : presenter.configuration.axisYMinimumValue;
        } else {
            var maxValue = isAboveXAxis($element) ? presenter.configuration.axisYMaximumValue : Math.abs(presenter.configuration.axisYMinimumValue);
            newValue = presenter.whichPoint(height, maxValue, columnContainerHeight, presenter.configuration.interactiveStep);
            if (!isAboveXAxis($element)) {
                newValue = -1 * newValue;
            }

        }

        var splittedStep = presenter.configuration.axisYGridStep.toString().split('.');

        if(splittedStep[1]){
            var precision = splittedStep[1].length;
            $container.attr('current-value', newValue.toFixed(precision));
        }else{
            $container.attr('current-value', newValue);
        }

        presenter.redrawGraphValue(valueContainer);

        if (presenter.configuration.mouseData.currentValue !== newValue) {
            var direction = presenter.configuration.mouseData.currentValue < newValue ? "increase" : "decrease";
            var changedBarIndex = presenter.$view.find('.graph_series .graph_value_container').index(valueContainer);
            prepareAndSendEvent(direction, changedBarIndex, presenter.configuration.mouseData.currentValue, newValue, $container);
        }

        presenter.configuration.mouseData.isMouseDown = false;
        presenter.configuration.mouseData.oldPosition = { y:0 };
    }

    function touchEndCallback (event) {
        if (isMoreThanOneFingerGesture(event)) {
            presenter.configuration.mouseData.wasDragged = true;
            return;
        }

        event.preventDefault();

        mouseUpCallback();
    }

    function mouseMoveCallback (eventData) {
        if (presenter.configuration.mouseData.isMouseDown !== true || presenter.shouldStopAction() ||
            presenter.isExample(eventData)) {
            return;
        }

        presenter.configuration.shouldCalcScore = true;
        presenter.configuration.mouseData.wasDragged = true;

        var $element = getValueElement();
        var $container = $element.parent();
        var height = $container.height();
        var columnContainerHeight = getColumnContainer($element).height();
        var distance = presenter.configuration.mouseData.oldPosition.y - eventData.pageY;

        if (!isAboveXAxis($element)) {
            distance = -1 * distance;
        }

        presenter.configuration.mouseData.oldPosition.y = eventData.pageY;

        $container.css('height', (height + distance) + 'px');
        if (height + distance > columnContainerHeight) {
            $container.css('height', columnContainerHeight + 'px');
        }

        if ($container.height() < 1 && minimumValueGraph < 0) {
            if (isAboveXAxis($element)) {
                $container.css({
                    top: (presenter.chartInner.height() - presenter.drawingXPosition + Math.round(presenter.axisXLine.height() / 2)) + 'px',
                    bottom: ''
                });
                $element.removeClass('graph_value_element_positive').addClass('graph_value_element_negative');
            } else {
                $container.css({
                    bottom: (presenter.drawingXPosition - Math.round(presenter.axisXLine.height() / 2)) + 'px',
                    top: ''
                });
                $element.removeClass('graph_value_element_negative').addClass('graph_value_element_positive');
            }
        }
    }

    function touchMoveCallback (event) {
        if (isMoreThanOneFingerGesture(event)) {
            presenter.configuration.mouseData.wasDragged = true;
            return;
        }

        event.preventDefault();

        var touch = event.touches[0] || event.changedTouches[0];
        mouseMoveCallback(touch);
    }

    presenter.upgradeModel = function (model) {
        const upgradedModel = presenter.upgradeAxisYValues(model);
        return presenter.upgradeOfExampleAnswers(upgradedModel);
    };

    presenter.upgradeAxisYValues = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if(model["Y axis values"] == undefined) {
            upgradedModel["Y axis values"] = "";
        }

        return upgradedModel;
    };

    presenter.upgradeOfExampleAnswers = function (model) {
        let upgradedModel = {};
        const modelAnswers = model['Answers'];
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        modelAnswers.forEach((modelAnswer, index) => {
            if (!modelAnswer.hasOwnProperty('Example')) {
                upgradedModel['Answers'][index]['Example'] = "False";
            }
        });

        return upgradedModel;
    };


    presenter.run = function(view, model) {
        const events = ['ShowAnswers', 'GradualShowAnswers', 'HideAnswers', 'GradualHideAnswers'];
        presenter.initialize(view, model, false);

        events.forEach(event => presenter.eventBus.addEventListener(event, this));
    };

    presenter.getActivitiesCount = function () {
        const examples = presenter.configuration.exampleAnswers.filter(Boolean).length;

        return presenter.$view.find(".graph_value_container").length - examples;
    };

    presenter.createPreview = function(view, model) {
        presenter.initialize(view, model, true);
    };

    presenter.validateAxisYMaximumValue = function (model, isDecimalSeparatorSet, decimalSeparator) {
        // Y-axis maximum value
        var modelYAxisMaximumValue = model['Y axis maximum value'];

        if (isDecimalSeparatorSet) {
            modelYAxisMaximumValue = modelYAxisMaximumValue.replace(decimalSeparator, '.');
        }
        var axisYMaximumValue = ModelValidationUtils.validateFloat(modelYAxisMaximumValue);
        if (!axisYMaximumValue.isValid) {
            return { isValid: false, errorCode: 'AXIS_Y_MAXIMUM_VALUE_NOT_NUMERIC' };
        }

        return {isValid: true, value: axisYMaximumValue.parsedValue};
    };

    presenter.validateAxisYMinimumValue = function (model, isDecimalSeparatorSet, decimalSeparator) {
        //Y-axis minimum value
        var modelYAxisMinimumValue = model['Y axis minimum value'];
        minimumValueGraph = model['Y axis minimum value'];

        if (isDecimalSeparatorSet) {
            modelYAxisMinimumValue = modelYAxisMinimumValue.replace(decimalSeparator, '.');
        }
        var axisYMinimumValue = ModelValidationUtils.validateFloat(modelYAxisMinimumValue);
        if (!axisYMinimumValue.isValid) {
            return { isValid: false, errorCode: 'AXIS_Y_MINIMUM_VALUE_NOT_NUMERIC' };
        }

        return {isValid: true, value: axisYMinimumValue.parsedValue};
    };

    presenter.validateAxisYRange = function (axisYMaximumValue, axisYMinimumValue) {
        if((axisYMaximumValue > 0 && axisYMinimumValue > 0) ||
            (axisYMaximumValue < 0 && axisYMinimumValue < 0)) {

            return { isValid: false, errorCode: 'AXIS_Y_DOES_NOT_INCLUDE_ZERO' };
        }

        return {isValid: true};
    };

    presenter.validateAxisYGridStep = function (model, isDecimalSeparatorSet, decimalSeparator) {
         var modelYAxisGridStep = model['Y axis grid step'];
        if (isDecimalSeparatorSet) {
            modelYAxisGridStep = modelYAxisGridStep.replace(decimalSeparator, '.');
        }

        var axisYGridStep = ModelValidationUtils.validateFloat(modelYAxisGridStep);
        if(!axisYGridStep.isValid) {
            return { isValid: false, errorCode: 'AXIS_Y_GRID_STEP_NOT_NUMERIC' };
        }

        return { isValid: true, value: axisYGridStep.parsedValue};

    };

    presenter.validateInteractiveStep = function (model, isDecimalSeparatorSet, decimalSeparator) {
        var isInteractive = ModelValidationUtils.validateBoolean(model['Interactive']);
        var interactiveStep;

        if(isInteractive) {
            var modelInteractiveStep = model['Interactive step'];
            if (isDecimalSeparatorSet) {
                modelInteractiveStep = modelInteractiveStep.replace(decimalSeparator, '.');
            }

            interactiveStep = ModelValidationUtils.validateFloat(modelInteractiveStep);
            if(!interactiveStep.isValid) {
                return { isValid: false, errorCode: 'INTERACTIVE_STEP_NOT_NUMERIC' };
            }

            if(interactiveStep.parsedValue <= 0) {
                return { isValid: false, errorCode: 'INTERACTIVE_STEP_NOT_POSITIVE' };
            }

            interactiveStep = interactiveStep.parsedValue;
        }

        return {isValid: true, interactiveStep: interactiveStep, isInteractive: isInteractive};
    };


    presenter.validateModel = function (model) {
        var decimalSeparator = model["Decimal separator"];
        var isDecimalSeparatorSet = !ModelValidationUtils.isStringEmpty(decimalSeparator);

        var validatedAxisYMaximumValue = presenter.validateAxisYMaximumValue(model, isDecimalSeparatorSet, decimalSeparator);
        if(!validatedAxisYMaximumValue.isValid) {
            return validatedAxisYMaximumValue;
        }

        var validatedAxisYMinimumValue = presenter.validateAxisYMinimumValue(model, isDecimalSeparatorSet, decimalSeparator);
        if (!validatedAxisYMinimumValue.isValid) {
            return validatedAxisYMinimumValue;
        }

        var validatedAxisYRange = presenter.validateAxisYRange(validatedAxisYMaximumValue.value, validatedAxisYMinimumValue.value);
        if (!validatedAxisYRange.isValid) {
            return validatedAxisYRange;
        }

        // Y-axis grid step
        var validatedAxisYGridStep = presenter.validateAxisYGridStep(model, isDecimalSeparatorSet, decimalSeparator);
        if (!validatedAxisYGridStep.isValid) {
            return validatedAxisYGridStep;
        }

        // Interactive (step) mode
        var validatedInteractiveStep = presenter.validateInteractiveStep(model, isDecimalSeparatorSet,
            decimalSeparator);

        if (!validatedInteractiveStep.isValid) {
            return validatedInteractiveStep;
        }
        var isInteractive = validatedInteractiveStep.isInteractive;

        var isNotActivity;
        try {
            isNotActivity = (model['isNotActivity'].toLowerCase() === 'true');
        } catch (_) {
            isNotActivity = false;
        }
        var parsedColors = presenter.parseColors(model);

        var graphConfiguration = {
            "isDecimalSeparatorSet": isDecimalSeparatorSet,
            "decimalSeparator": decimalSeparator,
            "Series colors": parsedColors,
            "axisYMaximumValue": validatedAxisYMaximumValue.value,
            "axisYMinimumValue": validatedAxisYMinimumValue.value
        };
        // Data
        var validatedData = presenter.validateData(model, graphConfiguration);

        if(!validatedData.isValid) {
            return validatedData
        }

        var validatedAxisXBarsDescriptions = presenter.validateAxisXBarsDescriptions(model, validatedData.value.barsCount);

        if(!validatedAxisXBarsDescriptions.isValid) {
            return validatedAxisXBarsDescriptions
        }

        var validatedAxisXSeriesDescriptions = presenter.validateAxisXSeriesDescriptions(model, validatedData.value.validRows);
        if (!validatedAxisXSeriesDescriptions.isValid) {
            return validatedAxisXSeriesDescriptions;
        }

        if (isInteractive) {
            var validatedAnswers = presenter.validateAnswers(model['Answers'], validatedData.value.barsCount);
            if (!validatedAnswers.isValid) {
                return validatedAnswers;
            }
            var results = presenter.parseResults(validatedData.value.parsedData, validatedAnswers.answers);

        } else {
            var validatedAnswers = {answers: []};
            var results = [];
        }

        const validatedExampleAnswers = presenter.validateExampleAnswers(model['Answers']);

        var validatedAxisYValues = presenter.validateAxisYValues(model, validatedAxisYMaximumValue.value,
            validatedAxisYMinimumValue.value, isDecimalSeparatorSet);

        if (!validatedAxisYValues.isValid) {
            return validatedAxisYValues;
        }

        return {
            isValid: true,
            ID: model.ID,
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            isVisibleByDefault: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            isNotActivity: isNotActivity,
            shouldCalcScore: false,
            decimalSeparator: decimalSeparator,
            isDecimalSeparatorSet: isDecimalSeparatorSet,
            axisYMaximumValue: validatedAxisYMaximumValue.value,
            axisYMinimumValue: validatedAxisYMinimumValue.value,
            axisYGridStep: validatedAxisYGridStep.value,
            data: validatedData.value.parsedData,
            isInteractive: isInteractive,
            interactiveStep: validatedInteractiveStep.interactiveStep,
            mouseData: {
                isMouseDown : false,
                oldPosition : { y : 0 },
                isMouseDragged : false
            },
            showXAxisBarsDescriptions: validatedAxisXBarsDescriptions.value.showXAxisBarsDescriptions,
            axisXBarsDescriptions: validatedAxisXBarsDescriptions.value.axisXBarsDescriptions,
            showXAxisSeriesDescriptions: validatedAxisXSeriesDescriptions.value.showXAxisSeriesDescriptions,
            axisXSeriesDescriptions: validatedAxisXSeriesDescriptions.value.axisXSeriesDescriptions,
            seriesColors: parsedColors,
            barsCount: validatedData.value.barsCount,
            columnsCount: validatedData.value.columnsCount,
            validRows: validatedData.value.validRows,
            results: results,
            answers: validatedAnswers.answers,
            exampleAnswers: validatedExampleAnswers,
            axisYValues: {fixedValues: validatedAxisYValues.fixedValues, cyclicValues: validatedAxisYValues.cyclicValues}
        };
    };

    presenter.parseResults = function (data, answers) {
        var results = [];

        var k = 0;
        var i, j;

        for (i=0; i < data.length; i++) {
            var a = [];
            for (j = 0; j < data[i].length; j++) {
                a.push(parseInt(answers[k++]) ===  parseInt(data[i][j]));
            }

            results.push(a);
        }

        return results;
    };

    presenter.parseAxisXBarsDescriptions = function (model, showXAxisBarsDescriptions) {
        var i;
        var xAxisBarsDescriptions = [];

        if (showXAxisBarsDescriptions && typeof(model['X axis bars descriptions']) != 'undefined') {
            for (i = 0; i < model['X axis bars descriptions'].length; i++) {
                xAxisBarsDescriptions.push(model['X axis bars descriptions'][i]['Description']);
            }
        }

        return xAxisBarsDescriptions;
    };

    presenter.parseAxisXSeriesDescriptions = function (model,showXAxisSeriesDescriptions) {
        var xAxisSeriesDescriptions = [];
        var i;
        if (showXAxisSeriesDescriptions && typeof(model['X axis series descriptions']) != 'undefined') {
            for (i = 0; i < model['X axis series descriptions'].length; i++) {
                xAxisSeriesDescriptions.push(model['X axis series descriptions'][i]['Description']);
            }
        }

        return xAxisSeriesDescriptions;
    };

    presenter.validateData = function(model, graphConfiguration) {

        var parsedData = presenter.parseData(model, graphConfiguration.isDecimalSeparatorSet, graphConfiguration.decimalSeparator);

        // Read data
        var currentValue;
        var maximumValue = null;
        var minimumValue = null;
        var row, column;
        var validRows = 0;
        var columnsCount = null;
        var barsCount = 0;

        // Validate data and find maximum value
        for (row = 0; row < parsedData.length; row++) {
            // Ensure that rows have valid syntax
            if (parsedData[row] === null) {
                return {isValid: false, errorCode: "DATA_ROW_MALFORMED", errorMessageSubstitutions: { row: row + 1 }};
            }

            // Skip empty rows
            if (parsedData[row].length === 0) {
                continue;
            }
            validRows++;
            // Ensure that rows have valid amount of columns
            if (parsedData[row].length < 1) {
                return {isValid: false, errorCode: "DATA_ROW_NOT_ENOUGH_COLUMNS", errorMessageSubstitutions: { row: row + 1 }};
            }

            if (columnsCount === null) {
                columnsCount = parsedData[row].length;
            } else if (columnsCount != parsedData[row].length) {
                return {isValid: false, errorCode: "DATA_ROW_DIFFERENT_COLUMNS_COUNT", errorMessageSubstitutions:  { row: row + 1 }};
            }

            // Save min/max value and ensure that data is numeric
            for (column = 0; column < parsedData[row].length; column++) {
                currentValue = parseFloat(parsedData[row][column]);

                if (isNaN(currentValue)) {
                    return {isValid: false, errorCode: "DATA_ROW_VALUE_NOT_NUMERIC", errorMessageSubstitutions: { row: row + 1, column: column, value: parsedData[row][column] }};
                }

                if (maximumValue === null || currentValue > maximumValue) {
                    maximumValue = currentValue;
                }

                if (minimumValue === null || currentValue < minimumValue) {
                    minimumValue = currentValue;
                }

                parsedData[row][column] = currentValue;
            }
            // Count amount of bars
            barsCount += parsedData[row].length;
        }

        if (graphConfiguration.axisYMaximumValue < maximumValue) {
            return {isValid: false, errorCode: 'AXIS_Y_MAXIMUM_VALUE_TOO_SMALL', errorMessageSubstitutions: { value: maximumValue, range: graphConfiguration.axisYMaximumValue }};
        }

        if (graphConfiguration.axisYMinimumValue > minimumValue) {
            return {isValid: false, errorCode: "AXIS_Y_MINIMUM_VALUE_TOO_BIG", errorMessageSubstitutions:  { value: minimumValue, range: graphConfiguration.axisYMinimumValue}};
        }

        if (graphConfiguration["Series colors"].length != columnsCount) {
            return {isValid: false, errorCode: "SERIES_COLORS_AMOUNT_INVALID"}
        }

        return {
            isValid: true,
            value: {
                maximumValue: maximumValue,
                minimumValue: minimumValue,
                validRows: validRows,
                barsCount: barsCount,
                columnsCount: columnsCount,
                parsedData: parsedData
            }
        };
    };

    presenter.parseColors = function(model) {
        var colors = [];

        var i;
        for (i = 0; i < model['Series colors'].length; i++) {
            colors.push(model['Series colors'][i]['Color']);
        }

        return colors;
    };

    presenter.parseData = function(model, isDecimalSeparatorSet, decimalSeparator) {
        var data = $.csv2Array(model['Data']);

        try {
            if (isDecimalSeparatorSet) {
                for (var i= 0; i < data.length; i++) {
                    for (var j= 0; j < data[i].length; j++) {
                        data[i][j] = data[i][j].replace(decimalSeparator, '.');
                    }
                }
            }
        } catch ( _ ) {
            //when user inputs invalid csv syntax in data property, data is null
            //it creates error which shows popup in lesson & editor
            //this error is validated in validateData
            return data
        }

        return data;
    };

    presenter.validateAxisXBarsDescriptions = function(model, barsCount) {
        var showXAxisBarsDescriptions = typeof(model['Show X axis bars descriptions']) != 'undefined' &&
            model['Show X axis bars descriptions'] === 'True';

        var parsedXAxisBarsDescriptions = presenter.parseAxisXBarsDescriptions(model, showXAxisBarsDescriptions);

        if (showXAxisBarsDescriptions && parsedXAxisBarsDescriptions.length != barsCount) {
            return {isValid: false, errorCode: "AXIS_X_BARS_DESCRIPTIONS_AMOUNT_INVALID",
                errorMessageSubstitutions:{ bars: barsCount, descriptions: parsedXAxisBarsDescriptions.length }};
        }

        return {
            isValid: true,
            value: {
                showXAxisBarsDescriptions: showXAxisBarsDescriptions,
                axisXBarsDescriptions: parsedXAxisBarsDescriptions
            }
        };
    };

    presenter.validateAxisXSeriesDescriptions = function(model, validRows) {
        var showXAxisSeriesDescriptions = typeof(model['Show X axis series descriptions']) != 'undefined' &&
            model['Show X axis series descriptions'] === 'True';
        var parsedXAxisSeriesDescriptions = presenter.parseAxisXSeriesDescriptions(model, showXAxisSeriesDescriptions);

        if (showXAxisSeriesDescriptions && parsedXAxisSeriesDescriptions.length != validRows) {
            return {isValid: false, errorCode: "AXIS_X_SERIES_DESCRIPTIONS_AMOUNT_INVALID",
                errorMessageSubstitutions: { series: validRows, descriptions: parsedXAxisSeriesDescriptions.length }};
        }

        return {
            isValid: true,
            value: {
                showXAxisSeriesDescriptions: showXAxisSeriesDescriptions,
                axisXSeriesDescriptions: parsedXAxisSeriesDescriptions
            }
        }
    };

    presenter.isFloat = function (value) {
        value = value.trim();
        if (ModelValidationUtils.isStringEmpty(value)) {
            return false;
        }

        if (value.charAt(0) == "+") {
            return false;
        }

        var too_many_zeroes = /^0{2,}/;
        if (too_many_zeroes.test(value)) {
            return false;
        }

        if ( value == "-0") {
            return false;
        }

        if (value.charAt(0) == "-") {
            value = value.slice(1, value.length);
        }

        var i, commas_number = 0;
        var digits = /[0-9]/;

        for(i = 0; i < value.length; i++) {
            if (value.charAt(i) == ".") {
                if (commas_number == 1) {
                    return false;
                }
                commas_number ++;
            } else {
                if (digits.test(value.charAt(i))) {
                    continue;
                } else {
                    return false;
                }
            }
        }

        return true;
    };

    presenter.checkIfValueInAxisRange = function (value, yMax, yMin) {
        if (value > yMax) {
            return {isValid: false, errorCode: "YAV_03"};
        }

        if (value < yMin) {
            return {isValid: false, errorCode: "YAV_04"};
        }

        return {isValid: true, value: value};
    };

    presenter.checkCyclicValue = function (value, yMax, yMin) {
        if (!presenter.isFloat(value)) {
            return {isValid: false, errorCode: "YAV_01"};
        }

        value = parseFloat(value);

        if (value == 0) {
            return {isValid: false, errorCode: "YAV_02"};
        }

        if (value < 0) {
            return {isValid: false, errorCode: "YAV_05"};
        }


        var validatedValue = presenter.checkIfValueInAxisRange(value, yMax, yMin);

        return validatedValue;
    };

    presenter.checkFixedValue = function (value, yMax, yMin) {
        if (!presenter.isFloat(value)) {
            return {isValid: false, errorCode: "YAV_01"};
        } else {
            var validatedValue = presenter.checkIfValueInAxisRange(parseFloat(value), yMax, yMin);
        }

        return validatedValue;
    };

    presenter.createAxisYValues = function (fixedValues, cyclicValues, yMax, yMin) {
        var values = [];
        var i;

        if (fixedValues == undefined && cyclicValues == undefined) {
            cyclicValues = [presenter.configuration.axisYGridStep];
        }

        if (fixedValues != undefined) {
            for(i = 0; i < fixedValues.length; i++) {
                values.push(fixedValues[i]);
            }
        }

        if (cyclicValues != undefined) {

            for(i = 0; i < cyclicValues.length; i++) {
                var step = cyclicValues[i];

                var splittedStep = step.toString().split('.');

                var value;
                if(splittedStep[1]){
                    var commaLength = splittedStep[1].length;
                    for(value = step; value.toFixed(commaLength) <= yMax; value += step) {
                        values.push(value.toFixed(commaLength));
                    }
                }else{
                    for(value = step; value <= yMax; value += step) {
                        values.push(value);
                    }
                }

                for(value = -step; value >= yMin; value -= step) {
                    values.push(value);
                }
            }
        }

        return values;
    };

    presenter.validateAxisYValues = function(model, yMax, yMin, isDecimalSeparatorSet) {
        var values = model["Y axis values"];
        var i;

        var parsedAxisYValues = {isValid: true, fixedValues: undefined, cyclicValues: undefined};

        if (ModelValidationUtils.isStringEmpty(values.trim())) {
            return parsedAxisYValues;
        }

        values = values.split(";");

        if(isDecimalSeparatorSet) {
            for(i = 0; i < values.length; i++) {
                values[i] = values[i].replace(model["Decimal separator"], '.');
            }
        }

        for(i = 0; i < values.length; i++) {
            var value = values[i].trim();
            var endChar = value.length - 1;
            var validatedValue;

            if(value.charAt(endChar) == "*") {
                validatedValue = presenter.checkCyclicValue(value.slice(0, endChar), yMax, yMin);

                if (!validatedValue.isValid) {
                    return validatedValue;
                }

                if (parsedAxisYValues.cyclicValues == undefined) {
                    parsedAxisYValues.cyclicValues = [];
                }

                if (parsedAxisYValues.cyclicValues.indexOf(validatedValue.value) == -1) {
                    parsedAxisYValues.cyclicValues.push(validatedValue.value);
                    continue;
                }

                return {isValid: false, errorCode: "YAV_06"};

            } else {
                validatedValue = presenter.checkFixedValue(value, yMax, yMin);

                if (!validatedValue.isValid) {
                    return validatedValue;
                }

                if (parsedAxisYValues.fixedValues == undefined) {
                    parsedAxisYValues.fixedValues = [];
                }

                if (parsedAxisYValues.fixedValues.indexOf(validatedValue.value) == -1) {
                    parsedAxisYValues.fixedValues.push(validatedValue.value);
                    continue;
                }

                return {isValid: false, errorCode: "YAV_06"};
            }
        }

        return parsedAxisYValues;
    };

    presenter.validateAnswers = function (answers, barsCount) {
        var validatedAnswers = [], i;

        for (i = 0; i < answers.length; i++) {
            var answer = answers[i]['Answer'];

            if (presenter.configuration.isDecimalSeparatorSet) {
                answer = answer.replace(presenter.configuration.decimalSeparator, '.');
            }

            var parseAnswer = parseFloat(answer);
            if (isNaN(parseAnswer)) {
                return { isValid: false, errorCode: 'ANSWER_NOT_NUMERIC', errorMessageSubstitutions: { answer: i + 1 } };
            }

            validatedAnswers.push(parseAnswer);
        }

        if (validatedAnswers.length != barsCount) {
            return { isValid: false, errorCode: 'ANSWERS_AMOUNT_INVALID', errorMessageSubstitutions: { answers: validatedAnswers.length, bars: barsCount } };
        }

        return {
            isValid: true,
            answers: validatedAnswers
        };
    };

    presenter.validateExampleAnswers = function (answers) {
        const exampleAnswers = [];
        if (!answers) { return exampleAnswers; }
        answers.forEach(answer => {
            exampleAnswers.push(ModelValidationUtils.validateBoolean(answer['Example']));
        });

        return exampleAnswers;
    }

    presenter.drawGrid = function (grid) {
        var axisYGridStep = presenter.configuration.axisYGridStep;
        var drawingGridStep = presenter.chartInner.height() * axisYGridStep / presenter.absoluteRange;
        var i;


        for (i = axisYGridStep; i <= presenter.configuration.axisYMaximumValue; i += axisYGridStep) {
            var currentGridBlock = $('<div class="graph_grid_block graph_grid_block_above"></div>');
            grid.append(currentGridBlock);
            currentGridBlock.css({
                height: (drawingGridStep - parseInt(currentGridBlock.css('borderTopWidth'))) + 'px',
                bottom: presenter.drawingXPosition - drawingGridStep + (drawingGridStep * i / axisYGridStep)
            });
        }


        for (i = -1 * axisYGridStep; i >= presenter.configuration.axisYMinimumValue; i -= axisYGridStep) {
            currentGridBlock = $('<div class="graph_grid_block graph_grid_block_below"></div>');
            grid.append(currentGridBlock);
            currentGridBlock.css({
                height: (drawingGridStep - parseInt(currentGridBlock.css('borderBottomWidth'))) + 'px',
                bottom: presenter.drawingXPosition + (drawingGridStep * i / axisYGridStep)
            });
        }

        return grid;
    };

    presenter.createGridDescriptions = function (innerContainer) {
        var gridDescription, gridDescriptionText;
        var maximumGridDescriptionWidth = null;
        var currentGridDescriptionWidth;
        var i;

        var fixedValues = presenter.configuration.axisYValues.fixedValues;
        var cyclicValues = presenter.configuration.axisYValues.cyclicValues;
        var yMax = presenter.configuration.axisYMaximumValue;
        var yMin = presenter.configuration.axisYMinimumValue;
        var values = presenter.createAxisYValues(fixedValues, cyclicValues, yMax, yMin);


        for (i = 0; i < values.length; i++) {
            gridDescription = $('<div class="graph_grid_description"></div>');
            gridDescription.addClass('graph_grid_description_' + ("" + values[i]).toString().replace('.', '_'));
            gridDescriptionText = "" + values[i];
            if (presenter.configuration.isDecimalSeparatorSet) {
                gridDescriptionText = gridDescriptionText.replace('.', presenter.configuration.decimalSeparator);
            }
            gridDescription.text(gridDescriptionText);
            innerContainer.append(gridDescription);

            currentGridDescriptionWidth = gridDescription.width();
            if (maximumGridDescriptionWidth === null || currentGridDescriptionWidth > maximumGridDescriptionWidth) {
                maximumGridDescriptionWidth = currentGridDescriptionWidth;
            }
        }

        presenter.$view.find('.graph_grid_description').css('width', maximumGridDescriptionWidth + 'px');

        return { maximumGridDescriptionWidth: maximumGridDescriptionWidth , axisYValues: values};
    };

    presenter.positionAxisYValues = function (values, xAxisDescriptionMargin) {
        var i, containerHeight = presenter.chartInner.height();

        for (i = 0; i < values.length; i++) {
            //rescale every value to 0 - positive, and calculate what percentage of height they are
            var descriptionElementHeight = (values[i] - presenter.configuration.axisYMinimumValue) ;
            descriptionElementHeight = (descriptionElementHeight / presenter.absoluteRange) * containerHeight;

            presenter.$view.find('.graph_grid_description_' + String(values[i]).toString().replace('.', '_')).each(function (index, element) {
                $(element).css({
                    bottom: (descriptionElementHeight - ($(element).height() / 2) + xAxisDescriptionMargin) + 'px'
                });
            });
        }
    };

    presenter.deleteCommands = function () {
        delete presenter.getMaxScore;
        delete presenter.getScore;
        delete presenter.setState;
        delete presenter.getState;
        delete presenter.getValue;
    };

    presenter.initialize = function(view, model, isPreview) {
        presenter.$view = $(view);
        var upgradedModel = presenter.upgradeModel(model);
        var validatedModel = presenter.validateModel(upgradedModel);

        presenter.configuration = validatedModel;

        if (!validatedModel.isValid) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES[validatedModel.errorCode], validatedModel.errorMessageSubstitutions);
            presenter.deleteCommands();
            return;
        }

        presenter.setVisibility(presenter.configuration.isVisible || isPreview);

        if (isPreview) presenter.configuration.isInteractive = false;

        presenter.drawGraph(view, model);
        presenter.drawExampleAnswers();
    };

    presenter.drawGraph = function (view, model) {
        // Read data
        var i, j;
        var validRows = presenter.configuration.validRows;
        var columnsCount = presenter.configuration.columnsCount;

        var showXAxisBarsDescriptions = presenter.configuration.showXAxisBarsDescriptions;
        var showXAxisSeriesDescriptions = presenter.configuration.showXAxisSeriesDescriptions;

        var xAxisBarsDescriptions = presenter.configuration.axisXBarsDescriptions;
        var xAxisSeriesDescriptions = presenter.configuration.axisXSeriesDescriptions;



        // Draw graph's containers
        var outerContainer = $('<div class="graph_container_outer"></div>');
        presenter.$view.append(outerContainer);

        var innerContainer = $('<div class="graph_container_inner"></div>');
        outerContainer.append(innerContainer);

        // Draw axis descriptions
        var axisYDescription = $('<div class="graph_axis_description graph_axis_y_description"></div>');
        axisYDescription.text(model['Y axis description']);
        innerContainer.append(axisYDescription);

        var axisXDescription = $('<div class="graph_axis_description graph_axis_x_description"></div>');
        axisXDescription.text(model['X axis description']);
        innerContainer.append(axisXDescription);


        // Draw outer chart container and set its position using
        // Y axis description's height and X axis description's width
        // plus 4px margin
        var chartOuter = $('<div class="graph_chart_outer"></div>');
        chartOuter.css({
            top: (axisYDescription.height() + 4) + 'px',
            right: (axisXDescription.width() + 4) + 'px'
        });
        innerContainer.append(chartOuter);

        // Create axis Y Values
        var gridDescriptionsObject = presenter.createGridDescriptions(innerContainer);
        var maximumGridDescriptionWidth = gridDescriptionsObject.maximumGridDescriptionWidth;
        var axisYValues = gridDescriptionsObject.axisYValues;

        // Draw inner chart container and set its position using
        // Y axis descriptions' width plus 4px margin
        var xAxisDescriptionMargin = 0;
        if (showXAxisBarsDescriptions) {
            xAxisDescriptionMargin += 20;
        }

        if (showXAxisSeriesDescriptions) {
            xAxisDescriptionMargin += 20;
        }

        presenter.chartInner = $('<div class="graph_chart_inner"></div>');
        presenter.chartInner.css({
            left: (maximumGridDescriptionWidth + 4) + 'px',
            bottom: (xAxisDescriptionMargin) + 'px'
        });
        chartOuter.append(presenter.chartInner);


        // Calculate position of axis X, grid & interactive step
        presenter.absoluteRange = presenter.configuration.axisYMaximumValue - presenter.configuration.axisYMinimumValue;
        var absoluteXPosition = presenter.absoluteRange - presenter.configuration.axisYMaximumValue;

        presenter.drawingXPosition = presenter.chartInner.height() * absoluteXPosition / presenter.absoluteRange;

        // Move Y axis descriptions to the right place and draw grid
        var grid = $('<div class="graph_grid"></div>');
        presenter.chartInner.append(grid);

        grid = presenter.drawGrid(grid);
        presenter.positionAxisYValues(axisYValues, xAxisDescriptionMargin);

        // Draw axis X
        presenter.axisXLine = $('<div class="graph_axis_x_line graph_axis_line"></div>');
        presenter.chartInner.append(presenter.axisXLine);
        presenter.axisXLine.css('bottom', (presenter.drawingXPosition - Math.round(presenter.axisXLine.height() / 2)) + 'px');

        var axisXArrow = $('<div class="graph_axis_x_arrow graph_axis_arrow"></div>');
        presenter.chartInner.append(axisXArrow);


        // Prepare drawing of the graph itself
        var serieContainer;
        var serieElement;
        var columnContainer;
        var columnContainerBelow;
        var columnContainerAbove;
        var valueContainer;
        var valueElement;
        var columnDescription;
        var serieDescription;

        var serieWidth = Math.round(parseInt(presenter.chartInner.width() / validRows));

        // Adjust serieWidth to previous value that divides by columnsCount without rest
        while (serieWidth % columnsCount !== 0) {
            serieWidth--;
        }

        var columnWidth = (100.0 / columnsCount) + '%';

        var series = $('<div class="graph_series"></div>');
        presenter.axisXLine.before(series);


        for (i = 0; i < presenter.configuration.data.length; i++) {
            // Skip empty rows
            if (presenter.configuration.data[i].length === 0) {
                continue;
            }

            serieContainer = $('<div class="graph_serie_container"></div>');
            serieContainer.css('width', serieWidth);

            serieElement = $('<div class="graph_serie_element graph_serie_size"></div>');
            serieContainer.append(serieElement);


            if (showXAxisSeriesDescriptions) {
                serieDescription = $('<div class="graph_serie_description"></div>');
                serieDescription.text(xAxisSeriesDescriptions[i]);
                serieElement.append(serieDescription);

                if (showXAxisBarsDescriptions) {
                    serieDescription.css('bottom', '-40px');
                } else {
                    serieDescription.css('bottom', '-20px');
                }
            }


            for (j = 0; j < presenter.configuration.data[i].length; j++) {
                columnContainer = $('<div class="graph_column_container"></div>');
                columnContainer.css('width', columnWidth);

                if (presenter.configuration.isInteractive) {
                    columnContainerBelow = $('<div class="graph_value_size graph_column_container_interactive graph_column_container_below"></div>');
                    columnContainerAbove = $('<div class="graph_value_size graph_column_container_interactive graph_column_container_above"></div>');
                    columnContainer.append(columnContainerBelow);
                    columnContainer.append(columnContainerAbove);
                    columnContainerBelow.css('top', (presenter.chartInner.height() - presenter.drawingXPosition) + 'px');
                    columnContainerAbove.css('bottom', presenter.drawingXPosition + 'px');

                    columnContainerAbove.click(presenter.increaseGraphValue);
                    columnContainerBelow.click(presenter.decreaseGraphValue);
                }

                valueContainer = $('<div class="graph_value_container"></div>');

                valueElement = $('<div class="graph_value_element graph_value_size"></div>');
                if (presenter.configuration.isInteractive) {
                    valueElement.addClass('graph_value_element_interactive');
                    valueElement.click(presenter.decreaseGraphValue);
                }

                valueElement.css('backgroundColor', presenter.configuration.seriesColors[j]);

                valueContainer.attr('current-value', presenter.configuration.data[i][j]);
                valueContainer.attr('value-id', i + ' ' + j);
                valueContainer.append(valueElement);

                if (presenter.configuration.isInteractive) {
                    $(valueContainer).mousedown(mouseDownCallback);
                    valueContainer[0].ontouchstart = touchStartCallback;
                }

                if (showXAxisBarsDescriptions) {
                    columnDescription = $('<div class="graph_column_description graph_value_size"></div>');
                    columnDescription.text(xAxisBarsDescriptions[i * columnsCount + j]);
                    columnContainer.append(columnDescription);
                }

                presenter.redrawGraphValue(valueContainer);
                columnContainer.append(valueContainer);

                if (presenter.configuration.isInteractive) {
                    $(columnContainer).mousedown(columnContainerMouseDownCallback);
                    columnContainer[0].ontouchstart = columnContainerTouchStartCallback;
                    $(columnContainer).mouseup(mouseUpCallback);
                    columnContainer[0].ontouchend = touchEndCallback;
                    $(columnContainer).mousemove(mouseMoveCallback);
                    columnContainer[0].ontouchmove = touchMoveCallback;
                }

                serieElement.append(columnContainer);
            }

            series.append(serieContainer);
        }

        // Move axis X description & arrow to right place
        axisXDescription.css('bottom', (presenter.drawingXPosition - Math.round(axisXDescription.height() / 2) + xAxisDescriptionMargin) + 'px');
        axisXArrow.css('bottom', (presenter.drawingXPosition - parseInt(axisXArrow.css('borderLeftWidth'))) + 'px');

        // Draw axis Y
        var axisYLine = $('<div class="graph_axis_y_line graph_axis_line"></div>');
        presenter.chartInner.append(axisYLine);

        var axisYArrow = $('<div class="graph_axis_y_arrow graph_axis_arrow"></div>');
        presenter.chartInner.append(axisYArrow);

        // Move axis Y description & arrow to right place
        var axisYDescriptionLeft = parseInt(presenter.chartInner.css('left')) - Math.round(axisYDescription.width() / 2);
        if (axisYDescriptionLeft < 0) {
            axisYDescriptionLeft = 0;
        }
        axisYDescription.css('left', axisYDescriptionLeft + 'px');
    };

    presenter.drawExampleAnswers = function () {
        const isAnyExampleAnswer = presenter.configuration.exampleAnswers.some(answer => answer === true);
        if (!isAnyExampleAnswer) {
            return;
        }

        presenter.configuration.exampleAnswers.forEach((answer, index) => {
            if (answer) {
                const graphAnswers = presenter.$view.find(".graph_value_container");

                presenter.addAnswerToGraph(index, $(graphAnswers[index]), true);
            }
        })
    }

    presenter.onEventReceived = function (eventName, eventData) {
        switch (eventName) {
            case 'GradualShowAnswers':
                presenter.gradualShowAnswers(eventData);
                break;

            case 'ShowAnswers':
                presenter.showAnswers();
                break;

            case 'HideAnswers':
                presenter.hideAnswers();
                break;

            case 'GradualHideAnswers':
                presenter.gradualHideAnswers();
                break;
        }
    };

    presenter.showAnswers = function () {
        if (presenter.configuration.isNotActivity) return;

        if (presenter.errorMode){
            presenter.setWorkMode();
        }

        presenter.isShowAnswersActive = true;
        presenter.currentData = [];
        presenter.setCurrentState();

        presenter.$view.find(".graph_value_container").each(function (index, element) {
            const isExample = presenter.configuration.exampleAnswers[index];
            if (!isExample) {
                presenter.addAnswerToGraph(index, element);
            }
        });
    };

    presenter.hideAnswers = function () {
        if (presenter.configuration.isNotActivity || !presenter.isShowAnswersActive) {
            return;
        }

        presenter.$view.find(".graph_value_container").each(function (index, element) {
            presenter.removeAnswerFromGraph(index, element);
        });

        presenter.isShowAnswersActive = false;
        presenter.drawExampleAnswers();
    };

    presenter.gradualShowAnswers = function (eventData) {
        if (eventData.moduleID !== presenter.configuration.ID) return;

        if (presenter.errorMode){
            presenter.setWorkMode();
        }

        let itemIndex = parseInt(eventData.item, 10);
        const graphAnswers = presenter.$view.find(".graph_value_container");
        presenter.isGradualShowAnswersActive = true;

        itemIndex = itemIndex < presenter.GSAcounter ? presenter.GSAcounter : itemIndex;
        if (presenter.configuration.exampleAnswers[presenter.GSAcounter]) {
            itemIndex += 1;
        }

        presenter.setCurrentState();
        presenter.addAnswerToGraph(itemIndex, $(graphAnswers[itemIndex]));

        presenter.GSAcounter = ++itemIndex;
        presenter.isGradualShowAnswersActive = true;
    }
    
    presenter.gradualHideAnswers = function () {
        if (presenter.configuration.isNotActivity || !presenter.isGradualShowAnswersActive) {
            return;
        }

        presenter.$view.find(".graph_value_container").each(function (index, element) {
            presenter.removeAnswerFromGraph(index, element);
        });

        presenter.isGradualShowAnswersActive = false;
        presenter.currentData = [];
        presenter.GSAcounter = 0;
        presenter.drawExampleAnswers();
    }

    presenter.setCurrentState = function () {
        presenter.$view.find(".graph_value_container").each(function (index, element) {
            presenter.currentData[index] = $(element).attr("current-value");
        });
    }

    presenter.shouldStopAction = function () {
        // check if the column is example or not
        return presenter.isDisplayingAnswers() || presenter.errorMode;
    }

    presenter.isDisplayingAnswers = function () {
        return presenter.isShowAnswersActive || presenter.isGradualShowAnswersActive;
    }

    presenter.addAnswerToGraph = function (index, element, isExample = false) {
        const currentValue = presenter.configuration.answers[index],
            valueContainer = $(element),
            $columnContainer = valueContainer.parent('').find('.graph_column_container_interactive');
        if(currentValue >= 0) {
            valueContainer.css({
                bottom: (presenter.drawingXPosition - Math.round(presenter.axisXLine.height() / 2)) + 'px',
                height: parseFloat(currentValue / presenter.absoluteRange) * 100 + '%',
                top: ''
            });
        } else {
            valueContainer.css({
                height: parseFloat(currentValue * -1 / presenter.absoluteRange) * 100 + '%',
                top: (presenter.chartInner.height() - presenter.drawingXPosition + Math.round(presenter.axisXLine.height() / 2)) + 'px',
                bottom: ''
            });
        }

        if (isExample) {
            $columnContainer.addClass('graph_column_container_show_example_answers');
            valueContainer.addClass('graph_show_example_answers');
        } else {
            $columnContainer.addClass('graph_column_container_show_answers');
            valueContainer.addClass('graph_show_answers');
        }
    }

    presenter.removeAnswerFromGraph = function (index, element) {
        const currentValue = presenter.currentData[index],
            valueContainer = $(element),
            $columnContainer = valueContainer.parent('').find('.graph_column_container_interactive');

        if(currentValue >= 0) {
            valueContainer.css({
                bottom: (presenter.drawingXPosition - Math.round(presenter.axisXLine.height() / 2)) + 'px',
                height: parseFloat(currentValue / presenter.absoluteRange) * 100 + '%',
                top: ''
            });
        } else if (currentValue < 0) {
            valueContainer.css({
                height: parseFloat(currentValue * -1 / presenter.absoluteRange) * 100 + '%',
                top: (presenter.chartInner.height() - presenter.drawingXPosition + Math.round(presenter.axisXLine.height() / 2)) + 'px',
                bottom: ''
            });
        }
        $columnContainer.removeClass('graph_column_container_show_answers');
        valueContainer.removeClass('graph_show_answers');
    }

    return presenter;
}