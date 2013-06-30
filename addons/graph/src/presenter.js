function Addongraph_create(){
    var presenter = function(){};

    presenter.seriesColors      = [];
    presenter.drawingXPosition  = null;
    presenter.absoluteRange     = null;
    presenter.chartInner        = null;
    presenter.axisXLine         = null;
    presenter.eventBus          = null;
    presenter.playerController  = null;
    presenter.errorMode         = false;

    presenter.$view             = null;
    presenter.configuration     = {};

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
        AXIS_X_BARS_DESCRIPTIONS_AMOUNT_INVALID:   "Amount of X axis bars descriptions (%descriptions%) has to be equal to amount of bars (%bars%)"
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


        if(currentValue > 0) {
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
        } else {
            valueElement.removeClass('graph_value_element_positive').removeClass('graph_value_element_negative');
            valueContainer.css({
                height: 0,
                top: (presenter.chartInner.height() - presenter.drawingXPosition + Math.round(presenter.axisXLine.height() / 2)) + 'px',
                bottom: ''
            });
        }
    };


    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
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
        presenter.errorMode = true;
        presenter.configuration.shouldCalcScore = true;

        if(presenter.configuration.isInteractive) {
            presenter.$view.find('.graph_value_element_interactive, .graph_column_container_below, .graph_column_container_above').css('cursor', 'default');

            presenter.$view.find('.graph_value_container').each(function(index, element) {
                if(presenter.configuration.answers[index] != parseFloat($(element).attr('current-value'))) {
                    $(element).find('.graph_value_element').addClass('graph_value_element_invalid');
                    $(element).find('.graph_value_element_positive').addClass('graph_value_element_positive_invalid');
                    $(element).find('.graph_value_element_negative').addClass('graph_value_element_negative_invalid');
                } else {
                    $(element).find('.graph_value_element').addClass('graph_value_element_valid');
                    $(element).find('.graph_value_element_positive').addClass('graph_value_element_positive_valid');
                    $(element).find('.graph_value_element_negative').addClass('graph_value_element_negative_valid');
                }
            });
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

    presenter.getScore = function() {
        if (!presenter.configuration.shouldCalcScore) return 0;

        var score = 0;
        presenter.$view.find('.graph_value_container').each(function(index, element) {
            if(presenter.configuration.answers[index] == parseFloat($(element).attr('current-value'))) {
                score++
            }
        });

        return score;
    };

    presenter.getMaxScore = function() {
        return presenter.configuration.answers.length;
    };

    presenter.getErrorCount = function() {
        if (!presenter.configuration.shouldCalcScore) return 0;

        return presenter.getMaxScore() - presenter.getScore();
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
        presenter.configuration.shouldCalcScore = true;

        presenter.redrawValueContainers();

        presenter.configuration.isVisible = presenter.configuration.isVisibleByDefault;
        presenter.setVisibility(presenter.configuration.isVisible);

        presenter.setWorkMode();
    };


    presenter.getState = function() {
        var r = [];
        presenter.$view.find('.graph_value_container').each(function(index, element) {
            r.push(parseFloat($(element).attr('current-value')));
        });
        var state = {
            'r' : r,
            'isVisible' : presenter.configuration.isVisible,
            shouldCalcScore: presenter.configuration.shouldCalcScore
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
            'getValue': presenter.getValue
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
        if(presenter.errorMode) return;

        presenter.configuration.shouldCalcScore = true;
        if (presenter.configuration.mouseData.wasDragged) {
            presenter.configuration.mouseData.wasDragged = false;
            return false;
        }

        var valueContainer = $(eventData.target).parent().find('.graph_value_container');

        var changedBarIndex = presenter.$view.find('.graph_series .graph_value_container').index(valueContainer),
            currentValue = parseFloat(valueContainer.attr('current-value')),
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
        if(presenter.errorMode) return;

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
            newValue, newValuePrecision;

        if (currentValue == presenter.configuration.axisYMaximumValue && maxInteractivePoint !== currentValue) {
            // Special case when current value is maximum and can not match with those calculated with interactive step
            newValue = maxInteractivePoint;
            newValuePrecision = presenter.getProperPrecision(maxInteractivePoint, presenter.configuration.interactiveStep);
        } else {
            newValue = currentValue - presenter.configuration.interactiveStep;
            newValuePrecision = presenter.getProperPrecision(currentValue, presenter.configuration.interactiveStep);
        }

        if(newValue < presenter.configuration.axisYMinimumValue) return;

        valueContainer.attr('current-value', newValue.toFixed(newValuePrecision));
        presenter.redrawGraphValue(valueContainer);

        if (currentValue === newValue) return;

        prepareAndSendEvent("decrease", changedBarIndex, currentValue, newValue, valueContainer);
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
        if(presenter.errorMode) return;

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
        if(presenter.errorMode) return;

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

    function mouseUpCallback () {
        if(presenter.errorMode) return;

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

        var $element = getValueElement(), $container = $element.parent(), height = $container.height();

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

            var initialValue = presenter.getInitialData($container.attr('value-id'));
            newValue = initialValue + newValue;
        }

        $container.attr('current-value', newValue);
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
        if(presenter.errorMode) return;
        if (presenter.configuration.mouseData.isMouseDown !== true) return;

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

        if ($container.height() < 1) {
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

    presenter.run = function(view, model) {
        presenter.initialize(view, model, false);
    };

    presenter.createPreview = function(view, model) {
        presenter.initialize(view, model, true);
    };

    presenter.validateModel = function (model) {
        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        var decimalSeparator = model["Decimal separator"],
            isDecimalSeparatorSet = !ModelValidationUtils.isStringEmpty(decimalSeparator);

        // Data
        var data = $.csv2Array(model['Data']);

        if (isDecimalSeparatorSet) {
            for (var i= 0; i < data.length; i++) {
                for (var j= 0; j < data[i].length; j++) {
                    data[i][j] = data[i][j].replace(decimalSeparator, '.');
                }
            }
        }

        // Y-axis maximum value
        var modelYAxisMaximumValue = model['Y axis maximum value'];
        if (isDecimalSeparatorSet) {
            modelYAxisMaximumValue = modelYAxisMaximumValue.replace(decimalSeparator, '.');
        }
        var axisYMaximumValue = ModelValidationUtils.validateFloat(modelYAxisMaximumValue);
        if (!axisYMaximumValue.isValid) {
            return { isValid: false, errorCode: 'AXIS_Y_MAXIMUM_VALUE_NOT_NUMERIC' };
        }

        // Y-axis minimum value
        var modelYAxisMinimumValue = model['Y axis minimum value'];
        if (isDecimalSeparatorSet) {
            modelYAxisMinimumValue = modelYAxisMinimumValue.replace(decimalSeparator, '.');
        }
        var axisYMinimumValue = ModelValidationUtils.validateFloat(modelYAxisMinimumValue);
        if (!axisYMinimumValue.isValid) {
            return { isValid: false, errorCode: 'AXIS_Y_MINIMUM_VALUE_NOT_NUMERIC' };
        }

        if((axisYMaximumValue.parsedValue > 0 && axisYMinimumValue.parsedValue > 0) ||
            (axisYMaximumValue.parsedValue < 0 && axisYMinimumValue.parsedValue < 0)) {

            return { isValid: false, errorCode: 'AXIS_Y_DOES_NOT_INCLUDE_ZERO' };
        }

        // Y-axis grid step
        var modelYAxisGridStep = model['Y axis grid step'];
        if (isDecimalSeparatorSet) {
            modelYAxisGridStep = modelYAxisGridStep.replace(decimalSeparator, '.');
        }

        var axisYGridStep = ModelValidationUtils.validateFloat(modelYAxisGridStep);
        if(!axisYGridStep.isValid) {
            return { isValid: false, errorCode: 'AXIS_Y_GRID_STEP_NOT_NUMERIC' };
        }

        // Interactive (step) mode
        var isInteractive = ModelValidationUtils.validateBoolean(model['Interactive']),
            interactiveStep;

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

        return {
            isValid: true,
            ID: model.ID,
            isVisible: isVisible,
            isVisibleByDefault: isVisible,
            shouldCalcScore: false,
            decimalSeparator: decimalSeparator,
            isDecimalSeparatorSet: isDecimalSeparatorSet,
            axisYMaximumValue: axisYMaximumValue.parsedValue,
            axisYMinimumValue: axisYMinimumValue.parsedValue,
            axisYGridStep: axisYGridStep.parsedValue,
            data: data,
            isInteractive: isInteractive,
            interactiveStep: interactiveStep,
            mouseData: {
                isMouseDown : false,
                oldPosition : { y : 0 },
                isMouseDragged : false
            }
        };
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

    presenter.drawGridDescriptions = function (innerContainer) {
        var gridDescription, gridDescriptionText;
        var maximumGridDescriptionWidth = null;
        var currentGridDescriptionWidth;

        var axisYGridStep = presenter.configuration.axisYGridStep;

        for (i = axisYGridStep; i <= presenter.configuration.axisYMaximumValue; i += axisYGridStep) {
            gridDescription = $('<div class="graph_grid_description"></div>');
            gridDescription.addClass('graph_grid_description_' + ("" + i).toString().replace('.', '_'));
            gridDescriptionText = "" + i;
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

        for (i = -1 * axisYGridStep; i >= presenter.configuration.axisYMinimumValue; i -= axisYGridStep) {
            gridDescription = $('<div class="graph_grid_description"></div>');
            gridDescription.addClass('graph_grid_description_' + ("" + i).toString().replace('.', '_'));
            gridDescriptionText = "" + i;
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

        return { maximumGridDescriptionWidth: maximumGridDescriptionWidth };
    };

    presenter.initialize = function(view, model, isPreview) {
        presenter.$view = $(view);
        presenter.configuration = presenter.validateModel(model);

        if (!presenter.configuration.isValid) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES[presenter.configuration.errorCode]);
            return;
        }

        presenter.setVisibility(presenter.configuration.isVisible);

        // Read data
        var currentValue;
        var maximumValue = null;
        var minimumValue = null;
        var i;
        var j;
        var validRows = 0;
        var columnsCount = null;
        var barsCount = 0;


        // Validate data and find maximum value
        for (i = 0; i < presenter.configuration.data.length; i++) {
            // Ensure that rows have valid syntax
            if (presenter.configuration.data[i] === null) {
                presenter.showErrorMessage(presenter.ERROR_MESSAGES.DATA_ROW_MALFORMED, { row: i + 1 });
                return;
            }

            // Skip empty rows
            if (presenter.configuration.data[i].length === 0) {
                continue;
            }
            validRows++;

            // Ensure that rows have valid amount of columns
            if (presenter.configuration.data[i].length < 1) {
                presenter.showErrorMessage(presenter.ERROR_MESSAGES.DATA_ROW_NOT_ENOUGH_COLUMNS, { row: i + 1 });
                return;
            }

            if (columnsCount === null) {
                columnsCount = presenter.configuration.data[i].length;
            } else if (columnsCount != presenter.configuration.data[i].length) {
                presenter.showErrorMessage(presenter.ERROR_MESSAGES.DATA_ROW_DIFFERENT_COLUMNS_COUNT, { row: i + 1 });
                return;
            }

            // Save min/max value and ensure that data is numeric
            for (j = 0; j < presenter.configuration.data[i].length; j++) {
                currentValue = parseFloat(presenter.configuration.data[i][j]);
                if (isNaN(currentValue)) {
                    presenter.showErrorMessage(presenter.ERROR_MESSAGES.DATA_ROW_VALUE_NOT_NUMERIC, { row: i + 1, column: j, value: presenter.configuration.data[i][j] });
                    return;
                }

                if (maximumValue === null || currentValue > maximumValue) {
                    maximumValue = currentValue;
                }

                if (minimumValue === null || currentValue < minimumValue) {
                    minimumValue = currentValue;
                }
            }

            // Count amount of bars
            barsCount += presenter.configuration.data[i].length;
        }

        if (presenter.configuration.axisYMaximumValue < maximumValue) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES.AXIS_Y_MAXIMUM_VALUE_TOO_SMALL, { value: maximumValue, range: presenter.configuration.axisYMaximumValue });
            return;
        }

        if (presenter.configuration.axisYMinimumValue > minimumValue) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES.AXIS_Y_MINIMUM_VALUE_TOO_BIG, { value: minimumValue, range: presenter.configuration.axisYMinimumValue });
            return;
        }


        if (model['Series colors'].length != columnsCount) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES.SERIES_COLORS_AMOUNT_INVALID);
            return;
        }


        var showXAxisBarsDescriptions = typeof(model['Show X axis bars descriptions']) != 'undefined' && model['Show X axis bars descriptions'] === 'True';
        var showXAxisSeriesDescriptions = typeof(model['Show X axis series descriptions']) != 'undefined' && model['Show X axis series descriptions'] === 'True';

        var xAxisBarsDescriptions = [];
        if (showXAxisBarsDescriptions && typeof(model['X axis bars descriptions']) != 'undefined') {
            for (i = 0; i < model['X axis bars descriptions'].length; i++) {
                xAxisBarsDescriptions.push(model['X axis bars descriptions'][i]['Description']);
            }
        }

        var xAxisSeriesDescriptions = [];
        if (showXAxisSeriesDescriptions && typeof(model['X axis series descriptions']) != 'undefined') {
            for (i = 0; i < model['X axis series descriptions'].length; i++) {
                xAxisSeriesDescriptions.push(model['X axis series descriptions'][i]['Description']);
            }
        }


        if (showXAxisBarsDescriptions && xAxisBarsDescriptions.length != barsCount) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES.AXIS_X_BARS_DESCRIPTIONS_AMOUNT_INVALID, { bars: barsCount, descriptions: xAxisBarsDescriptions.length });
            return;
        }

        if (showXAxisSeriesDescriptions && xAxisSeriesDescriptions.length != validRows) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES.AXIS_X_SERIES_DESCRIPTIONS_AMOUNT_INVALID, { series: validRows, descriptions: xAxisSeriesDescriptions.length });
            return;
        }


        for (i = 0; i < model['Series colors'].length; i++) {
            presenter.seriesColors.push(model['Series colors'][i]['Color']);
        }

        if (presenter.configuration.isInteractive) {
            var validatedAnswers = presenter.validateAnswers(model['Answers'], barsCount);
            if (!validatedAnswers.isValid) {
                presenter.showErrorMessage(presenter.ERROR_MESSAGES[validatedAnswers.errorCode], validatedAnswers.errorMessageSubstitutions);
                return;
            }

            presenter.configuration.answers = validatedAnswers.answers;

        }

        if (isPreview) presenter.configuration.isInteractive = false;

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

        // Draw grid descriptions and adjust them to the right
        var maximumGridDescriptionWidth = presenter.drawGridDescriptions(innerContainer).maximumGridDescriptionWidth;

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
        var axisYGridStep = presenter.configuration.axisYGridStep;

        presenter.drawingXPosition = presenter.chartInner.height() * absoluteXPosition / presenter.absoluteRange;
        var drawingGridStep = presenter.chartInner.height() * axisYGridStep / presenter.absoluteRange;


        // Move Y axis descriptions to the right place and draw grid
        var grid = $('<div class="graph_grid"></div>');
        presenter.chartInner.append(grid);

        var currentGridBlock;
        for (i = axisYGridStep; i <= presenter.configuration.axisYMaximumValue; i += axisYGridStep) {
            currentGridBlock = $('<div class="graph_grid_block graph_grid_block_above"></div>');
            grid.append(currentGridBlock);
            currentGridBlock.css({
                height: (drawingGridStep - parseInt(currentGridBlock.css('borderTopWidth'))) + 'px',
                bottom: presenter.drawingXPosition - drawingGridStep + (drawingGridStep * i / axisYGridStep)
            });

            presenter.$view.find('.graph_grid_description_' + String(i).toString().replace('.', '_')).each(function (index, element) {
                $(element).css({
                    bottom: (presenter.drawingXPosition + (drawingGridStep * i / axisYGridStep) - $(element).height() / 2 + xAxisDescriptionMargin) + 'px'
                });
            });
        }


        for (i = -1 * axisYGridStep; i >= presenter.configuration.axisYMinimumValue; i -= axisYGridStep) {
            currentGridBlock = $('<div class="graph_grid_block graph_grid_block_below"></div>');
            grid.append(currentGridBlock);
            currentGridBlock.css({
                height: (drawingGridStep - parseInt(currentGridBlock.css('borderBottomWidth'))) + 'px',
                bottom: presenter.drawingXPosition + (drawingGridStep * i / axisYGridStep)
            });

            presenter.$view.find('.graph_grid_description_' + String(i).toString().replace('.', '_')).each(function (index, element) {
                $(element).css({
                    bottom: (presenter.drawingXPosition + (drawingGridStep * i / axisYGridStep) - $(element).height() / 2 + xAxisDescriptionMargin) + 'px'
                });
            });
        }

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

                valueElement.css('backgroundColor', presenter.seriesColors[j]);

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

    return presenter;
}