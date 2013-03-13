function Addongraph_create(){
    var presenter = function(){};

    presenter.data              = [];
    presenter.answers           = [];
    presenter.seriesColors      = [];
    presenter.drawingXPosition  = null;
    presenter.absoluteRange     = null;
    presenter.chartInner        = null;
    presenter.axisXLine         = null;
    presenter.interactiveStep   = null;
    presenter.axisYMinimumValue = null;
    presenter.axisYMaximumValue = null;
    presenter.eventBus          = null;
    presenter.playerController  = null;
    presenter.errorMode         = false;
    presenter.interactive       = false;

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

    /**
     * jQuery-csv - jQuery CSV Parser
     * http://code.google.com/p/jquery-csv/
     *
     * (c) 2012 Evan Plaice
     *
     * Permission is hereby granted, free of charge, to any person
     * obtaining a copy of this software and associated documentation
     * files (the "Software"), to deal in the Software without restriction,
     * including without limitation the rights to use, copy, modify, merge,
     * publish, distribute, sublicense, and/or sell copies of the Software,
     * and to permit persons to whom the Software is furnished to do so,
     * subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall
     * be included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
     * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
     * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
     * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
     * DEALINGS IN THE SOFTWARE.
     */
    presenter.loadCSVParser = function () {
        if (typeof($.csv2Array) == "undefined") {
            RegExp.escape = function (s) {
                return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
            };
            (function ($) {
                $.csvDefaults = {separator:',', delimiter:'"', escaper:'"', skip:0, headerLine:1, dataLine:2};
                $.csvEntry2Array = function (csv, meta) {
                    var meta = (meta !== undefined ? meta : {});
                    var separator = 'separator'in meta ? meta.separator : $.csvDefaults.separator;
                    var delimiter = 'delimiter'in meta ? meta.delimiter : $.csvDefaults.delimiter;
                    var escaper = 'escaper'in meta ? meta.escaper : $.csvDefaults.escaper;
                    separator = RegExp.escape(separator);
                    delimiter = RegExp.escape(delimiter);
                    escaper = RegExp.escape(escaper);
                    var reValid = /^\s*(?:Y[^YZ]*(?:ZY[^YZ]*)*Y|[^XYZ\s]*(?:\s+[^XYZ\s]+)*)\s*(?:X\s*(?:Y[^YZ]*(?:ZY[^YZ]*)*Y|[^XYZ\s]*(?:\s+[^XYZ\s]+)*)\s*)*$/;
                    reValid = RegExp(reValid.source.replace(/X/g, separator));
                    reValid = RegExp(reValid.source.replace(/Y/g, delimiter));
                    reValid = RegExp(reValid.source.replace(/Z/g, escaper));
                    var reValue = /(?!\s*$)\s*(?:Y([^YZ]*(?:ZY[^YZ]*)*)Y|([^XYZ\s]*(?:\s+[^XYZ\s]+)*))\s*(?:X|$)/g;
                    reValue = RegExp(reValue.source.replace(/X/g, separator), 'g');
                    reValue = RegExp(reValue.source.replace(/Y/g, delimiter), 'g');
                    reValue = RegExp(reValue.source.replace(/Z/g, escaper), 'g');
                    if (!reValid.test(csv)) {
                        return null;
                    }
                    var output = [];
                    csv.replace(reValue, function (m0, m1, m2) {
                        if (m1 !== undefined) {
                            var reDelimiterUnescape = /ED/g;
                            reDelimiterUnescape = RegExp(reDelimiterUnescape.source.replace(/E/, escaper), 'g');
                            reDelimiterUnescape = RegExp(reDelimiterUnescape.source.replace(/D/, delimiter), 'g');
                            output.push(m1.replace(reDelimiterUnescape, delimiter));
                        } else if (m2 !== undefined) {
                            output.push(m2);
                        }
                        return'';
                    });
                    var reEmptyLast = /S\s*$/;
                    reEmptyLast = RegExp(reEmptyLast.source.replace(/S/, separator));
                    if (reEmptyLast.test(csv)) {
                        output.push('');
                    }
                    return output;
                };
                $.array2CSVEntry = function (array, meta) {
                    var meta = (meta !== undefined ? meta : {});
                    var separator = 'separator'in meta ? meta.separator : $.csvDefaults.separator;
                    var delimiter = 'delimiter'in meta ? meta.delimiter : $.csvDefaults.delimiter;
                    var escaper = 'escaper'in meta ? meta.escaper : $.csvDefaults.escaper;
                    var output = []
                    for (i in array) {
                        output.push(array[i]);
                    }
                    return output;
                };
                $.csv2Array = function (csv, meta) {
                    var meta = (meta !== undefined ? meta : {});
                    var separator = 'separator'in meta ? meta.separator : $.csvDefaults.separator;
                    var delimiter = 'delimiter'in meta ? meta.delimiter : $.csvDefaults.delimiter;
                    var escaper = 'escaper'in meta ? meta.escaper : $.csvDefaults.escaper;
                    var skip = 'skip'in meta ? meta.skip : $.csvDefaults.skip;
                    var output = [];
                    var lines = csv.split(/\r\n|\r|\n/g);

                    for (var i in lines) {
                        if (!lines.hasOwnProperty(i)) continue;
                        if (i < skip) continue;

                        var line = $.csvEntry2Array(lines[i], {delimiter:delimiter, separator:separator, escaper:escaper, });
                        output.push(line);
                    }
                    return output;
                };
                $.csv2Dictionary = function (csv, meta) {
                    var meta = (meta !== undefined ? meta : {});
                    var separator = 'separator'in meta ? meta.separator : $.csvDefaults.separator;
                    var delimiter = 'delimiter'in meta ? meta.delimiter : $.csvDefaults.delimiter;
                    var escaper = 'escaper'in meta ? meta.escaper : $.csvDefaults.escaper;
                    var headerLine = 'headerLine'in meta ? meta.headerLine : $.csvDefaults.headerLine;
                    var dataLine = 'dataLine'in meta ? meta.dataLine : $.csvDefaults.dataLine;
                    var lines = csv.split(/\r\n|\r|\n/g);
                    var headers = $.csvEntry2Array(lines[(headerLine - 1)]);
                    var output = [];
                    for (var i in lines) {
                        if (!lines.hasOwnProperty(i)) continue;
                        if (i < (dataLine - 1)) continue;

                        var line = $.csvEntry2Array(lines[i], {delimiter:delimiter, separator:separator, escaper:escaper});
                        var lineDict = {};
                        for (var j in headers) {
                            lineDict[headers[j]] = line[j];
                        }
                        output.push(lineDict);
                    }
                    return output;
                };
            })(jQuery);
        }
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

        presenter.eventBus.sendEvent('ValueChanged', {
            'source': presenter.configuration.ID,
            'item'  : valueId + ' ' + direction,
            'value' : newValue + '',
            'score' : score
        });
    };


    presenter.areAllBarsValid = function() {
        var r = true;
        presenter.$view.find('.graph_value_container').each(function(i, e) {
            if(presenter.answers[i] != parseFloat($(e).attr('current-value'))) {
                r = false;
            }
        });

        return r;
    };


    presenter.setShowErrorsMode = function() {
        presenter.errorMode = true;

        if(presenter.interactive) {
            presenter.$view.find('.graph_value_element_interactive, .graph_column_container_below, .graph_column_container_above').css('cursor', 'default');

            presenter.$view.find('.graph_value_container').each(function(index, element) {
                if(presenter.answers[index] != parseFloat($(element).attr('current-value'))) {
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

        if(presenter.interactive) {
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
        var r = 0;
        presenter.$view.find('.graph_value_container').each(function(i, e) {
            if(presenter.answers[i] == parseFloat($(e).attr('current-value'))) {
                r++
            }
        });

        return r;
    };

    presenter.getMaxScore = function() {
        return presenter.answers.length;
    };

    presenter.getErrorCount = function() {
        return presenter.getMaxScore() - presenter.getScore();
    };


    presenter.redrawValueContainers = function () {
        var valueContainers = presenter.$view.find('.graph_value_container');
        var currentValueContainer;

        for (var i = 0; i < presenter.data.length; i++) {
            for (var j = 0; j < presenter.data[i].length; j++) {
                currentValueContainer = $(valueContainers[i * presenter.data[i].length + j]);
                currentValueContainer.attr('current-value', presenter.data[i][j]);
                presenter.redrawGraphValue(currentValueContainer);
            }
        }
    };

    presenter.reset = function() {
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
            'isVisible' : presenter.configuration.isVisible
        };
        return JSON.stringify(state);
    };


    presenter.setState = function(stateString) {
        var state = JSON.parse(stateString);
        var valueContainers = presenter.$view.find('.graph_value_container');
        var currentValueContainer;
        var r = state.r;

        for(var i = 0; i < r.length; i++) {
            currentValueContainer = $(valueContainers[i]);
            currentValueContainer.attr('current-value', parseFloat(r[i]));
            presenter.redrawGraphValue(currentValueContainer);
        }

        if (state.isVisible) {
            presenter.show();
        } else {
            presenter.hide();
        }
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.show = function() {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide' : presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    function prepareAndSendEvent(direction, changedBarIndex, currentValue, newValue, valueContainer) {
        var wasAllValidBeforeChange = presenter.areAllBarsValid();
        var wasThisValidBeforeChange = presenter.answers[changedBarIndex] == currentValue;
        var willAllBeValidAfterChange = presenter.areAllBarsValid();
        var willThisBeValidAfterChange = presenter.answers[changedBarIndex] == newValue;

        presenter.sendOverallScoreEvent(direction,
            valueContainer.attr('value-id'),
            newValue,
            wasAllValidBeforeChange,
            wasThisValidBeforeChange,
            willAllBeValidAfterChange,
            willThisBeValidAfterChange
        );
    }

    presenter.increaseGraphValue = function(eventData) {
        if(presenter.errorMode) return;
        if (presenter.configuration.mouseData.wasDragged) {
            presenter.configuration.mouseData.wasDragged = false;
            return false;
        }

        var valueContainer = $(eventData.target).parent().find('.graph_value_container');

        var changedBarIndex = presenter.$view.find('.graph_series .graph_value_container').index(valueContainer);
        var currentValue = parseFloat(valueContainer.attr('current-value'));
        var newValue = currentValue + presenter.interactiveStep;

        if(newValue > presenter.axisYMaximumValue) {
            return;
        }

        valueContainer.attr('current-value', newValue);
        presenter.redrawGraphValue(valueContainer);

        if (currentValue === newValue) return;

        prepareAndSendEvent("increase", changedBarIndex, currentValue, newValue, valueContainer);
    };

    presenter.decreaseGraphValue = function(eventData) {
        if(presenter.errorMode) return;
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

        var changedBarIndex = presenter.$view.find('.graph_series .graph_value_container').index(valueContainer);
        var currentValue = parseFloat(valueContainer.attr('current-value'));
        var newValue = currentValue - presenter.interactiveStep;

        if(newValue < presenter.axisYMinimumValue) {
            return;
        }

        valueContainer.attr('current-value', newValue);
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

    function triggerColumnContainerClickHandler() {
        if (presenter.configuration.mouseData.isColumnContainerTriggerIncrease) {
            presenter.increaseGraphValue(presenter.configuration.mouseData.columnContainerEventData);
        } else {
            presenter.decreaseGraphValue(presenter.configuration.mouseData.columnContainerEventData);
        }
    }

    function mouseUpCallback () {
        if(presenter.errorMode) return;

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
            halfOfValueHigh = (columnContainerHeight / presenter.axisYMaximumValue) / 2;
        } else {
            halfOfValueHigh = (columnContainerHeight / Math.abs(presenter.axisYMinimumValue)) / 2;
        }

        if (height < halfOfValueHigh) {
            newValue = 0;
        } else if (height >= columnContainerHeight - halfOfValueHigh) {
            newValue = isAboveXAxis($element) ? presenter.axisYMaximumValue : presenter.axisYMinimumValue;
        } else {
            var maxValue = isAboveXAxis($element) ? presenter.axisYMaximumValue : Math.abs(presenter.axisYMinimumValue);
            newValue = presenter.whichPoint(height, maxValue, columnContainerHeight, presenter.interactiveStep);
            if (!isAboveXAxis($element)) {
                newValue = -1 * newValue;
            }
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
        this.$view = $(view);
        presenter.initialize(view, model, false);
    };

    presenter.createPreview = function(view, model) {
        presenter.initialize(view, model, true);
    };

    presenter.validateModel = function (model) {
        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);

        return {
            isError: false,
            ID: model.ID,
            isVisible: isVisible,
            isVisibleByDefault: isVisible
        };
    };

    presenter.initialize = function(view, model, preview) {
        // Initialize custom libraries
        presenter.loadCSVParser();

        presenter.$view = $(view);
        presenter.configuration = presenter.validateModel(model);

        presenter.setVisibility(presenter.configuration.isVisible);

        // Initialize mouse data
        presenter.configuration.mouseData = {
            isMouseDown : false,
            oldPosition : { y : 0 },
            isMouseDragged : false
        };


        // Read data
        presenter.data = $.csv2Array(model['Data']);

        var currentValue;
        var maximumValue = null;
        var minimumValue = null;
        var i;
        var j;
        var validRows    = 0;
        var columnsCount = null;
        var barsCount    = 0;


        // Validate data and find maximum value
        for(i = 0; i < presenter.data.length; i++) {
            // Ensure that rows have valid syntax
            if(presenter.data[i] === null) {
                presenter.showErrorMessage(presenter.ERROR_MESSAGES.DATA_ROW_MALFORMED, { row : i + 1 });
                return;
            }

            // Skip empty rows
            if(presenter.data[i].length === 0) {
                continue;
            }
            validRows++;

            // Ensure that rows have valid amount of columns
            if(presenter.data[i].length < 1) {
                presenter.showErrorMessage(presenter.ERROR_MESSAGES.DATA_ROW_NOT_ENOUGH_COLUMNS, { row : i + 1 });
                return;
            }

            if(columnsCount === null) {
                columnsCount = presenter.data[i].length;
            } else if(columnsCount != presenter.data[i].length) {
                presenter.showErrorMessage(presenter.ERROR_MESSAGES.DATA_ROW_DIFFERENT_COLUMNS_COUNT, { row : i + 1 });
                return;
            }

            // Save min/max value and ensure that data is numeric
            for(j = 0; j < presenter.data[i].length; j++) {
                currentValue = parseFloat(presenter.data[i][j]);
                if(isNaN(currentValue)) {
                    presenter.showErrorMessage(presenter.ERROR_MESSAGES.DATA_ROW_VALUE_NOT_NUMERIC, { row : i + 1, column : j, value : presenter.data[i][j] });
                    return;
                }

                if(maximumValue === null || currentValue > maximumValue) {
                    maximumValue = currentValue;
                }

                if(minimumValue === null || currentValue < minimumValue) {
                    minimumValue = currentValue;
                }
            }

            // Count amount of bars
            barsCount += presenter.data[i].length;
        }

        presenter.axisYMaximumValue = parseFloat(model['Y axis maximum value']);
        if(isNaN(presenter.axisYMaximumValue)) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES.AXIS_Y_MAXIMUM_VALUE_NOT_NUMERIC);
            return;
        }

        presenter.axisYMinimumValue = parseFloat(model['Y axis minimum value']);
        if(isNaN(presenter.axisYMinimumValue)) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES.AXIS_Y_MINIMUM_VALUE_NOT_NUMERIC);
            return;
        }


        if(presenter.axisYMaximumValue < maximumValue) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES.AXIS_Y_MAXIMUM_VALUE_TOO_SMALL, { value: maximumValue, range : presenter.axisYMaximumValue });
            return;
        }

        if(presenter.axisYMinimumValue > minimumValue) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES.AXIS_Y_MINIMUM_VALUE_TOO_BIG, { value: minimumValue, range : presenter.axisYMinimumValue });
            return;
        }

        if((presenter.axisYMaximumValue > 0 && presenter.axisYMinimumValue > 0) || (presenter.axisYMaximumValue < 0 && presenter.axisYMinimumValue < 0)) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES.AXIS_Y_DOES_NOT_INCLUDE_ZERO);
            return;
        }


        var axisYGridStep = parseFloat(model['Y axis grid step']);
        if(isNaN(axisYGridStep)) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES.AXIS_Y_GRID_STEP_NOT_NUMERIC);
            return;
        }


        if(model['Series colors'].length != columnsCount) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES.SERIES_COLORS_AMOUNT_INVALID);
            return;
        }


        var showXAxisBarsDescriptions = typeof(model['Show X axis bars descriptions']) != 'undefined' && model['Show X axis bars descriptions'] === 'True';
        var showXAxisSeriesDescriptions = typeof(model['Show X axis series descriptions']) != 'undefined' && model['Show X axis series descriptions'] === 'True';

        var xAxisBarsDescriptions = [];
        if(showXAxisBarsDescriptions && typeof(model['X axis bars descriptions']) != 'undefined') {
            for(i = 0; i < model['X axis bars descriptions'].length; i++) {
                xAxisBarsDescriptions.push(model['X axis bars descriptions'][i]['Description']);
            }
        }

        var xAxisSeriesDescriptions = [];
        if(showXAxisSeriesDescriptions && typeof(model['X axis series descriptions']) != 'undefined') {
            for(i = 0; i < model['X axis series descriptions'].length; i++) {
                xAxisSeriesDescriptions.push(model['X axis series descriptions'][i]['Description']);
            }
        }


        if(showXAxisBarsDescriptions && xAxisBarsDescriptions.length != barsCount) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES.AXIS_X_BARS_DESCRIPTIONS_AMOUNT_INVALID, { bars: barsCount, descriptions: xAxisBarsDescriptions.length });
            return;
        }

        if(showXAxisSeriesDescriptions && xAxisSeriesDescriptions.length != validRows) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES.AXIS_X_SERIES_DESCRIPTIONS_AMOUNT_INVALID, { series: validRows, descriptions: xAxisSeriesDescriptions.length });
            return;
        }




        for(i = 0; i < model['Series colors'].length; i++) {
            presenter.seriesColors.push(model['Series colors'][i]['Color']);
        }

        presenter.interactive = model['Interactive'] === 'True' && !preview;
        if(presenter.interactive) {
            presenter.interactiveStep = parseFloat(model['Interactive step']);
            if(isNaN(presenter.interactiveStep)) {
                presenter.showErrorMessage(presenter.ERROR_MESSAGES.INTERACTIVE_STEP_NOT_NUMERIC);
                return;
            }

            if(presenter.interactiveStep <= 0) {
                presenter.showErrorMessage(presenter.ERROR_MESSAGES.INTERACTIVE_STEP_NOT_POSITIVE);
                return;
            }
        }

        if(model['Interactive'] === 'True') {
            for(i = 0; i < model['Answers'].length; i++) {
                presenter.answers.push(parseFloat(model['Answers'][i]['Answer']));
            }

            if(presenter.answers.length != barsCount) {
                presenter.showErrorMessage(presenter.ERROR_MESSAGES.ANSWERS_AMOUNT_INVALID, { answers: presenter.answers.length, bars: barsCount });
                return;
            }

            for(i = 0; i < model['Answers'].length; i++) {
                if(isNaN(presenter.answers[i])) {
                    presenter.showErrorMessage(presenter.ERROR_MESSAGES.ANSWER_NOT_NUMERIC, { answer: i+1 });
                    return;
                }
            }

        }

        // Draw graph's containers
        var outerContainer  = $('<div class="graph_container_outer"></div>');
        presenter.$view.append(outerContainer);

        var innerContainer  = $('<div class="graph_container_inner"></div>');
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
            top   : (axisYDescription.height() + 4) + 'px',
            right : (axisXDescription.width()  + 4) + 'px'
        });
        innerContainer.append(chartOuter);

        // Draw grid descriptions and adjust them to the right
        var gridDescription;
        var maximumGridDescriptionWidth = null;
        var currentGridDescriptionWidth;

        for(i = axisYGridStep; i <= presenter.axisYMaximumValue; i += axisYGridStep) {
            gridDescription = $('<div class="graph_grid_description"></div>');
            gridDescription.addClass('graph_grid_description_' + new String(i).toString().replace('.', '_'));
            gridDescription.text(i);
            innerContainer.append(gridDescription);
            currentGridDescriptionWidth = gridDescription.width();
            if(maximumGridDescriptionWidth === null || currentGridDescriptionWidth > maximumGridDescriptionWidth) {
                maximumGridDescriptionWidth = currentGridDescriptionWidth;
            }
        }

        for(i = -1 * axisYGridStep; i >= presenter.axisYMinimumValue; i -= axisYGridStep) {
            gridDescription = $('<div class="graph_grid_description"></div>');
            gridDescription.addClass('graph_grid_description_' + new String(i).toString().replace('.', '_'));
            gridDescription.text(i);
            innerContainer.append(gridDescription);
            currentGridDescriptionWidth = gridDescription.width();
            if(maximumGridDescriptionWidth === null || currentGridDescriptionWidth > maximumGridDescriptionWidth) {
                maximumGridDescriptionWidth = currentGridDescriptionWidth;
            }
        }

        presenter.$view.find('.graph_grid_description').css('width', maximumGridDescriptionWidth + 'px');

        // Draw inner chart container and set its position using
        // Y axis descriptions' width plus 4px margin
        var xAxisDescriptionMargin = 0;
        if(showXAxisBarsDescriptions) {
            xAxisDescriptionMargin += 20;
        }

        if(showXAxisSeriesDescriptions) {
            xAxisDescriptionMargin += 20;
        }

        presenter.chartInner = $('<div class="graph_chart_inner"></div>');
        presenter.chartInner.css({
            left  : (maximumGridDescriptionWidth + 4) + 'px',
            bottom: (xAxisDescriptionMargin) + 'px'
        });
        chartOuter.append(presenter.chartInner);




        // Calculate position of axis X, grid & interactive step
        presenter.absoluteRange = presenter.axisYMaximumValue - presenter.axisYMinimumValue;
        var absoluteXPosition = presenter.absoluteRange - presenter.axisYMaximumValue;

        presenter.drawingXPosition = presenter.chartInner.height() * absoluteXPosition / presenter.absoluteRange;
        var drawingGridStep = presenter.chartInner.height() * axisYGridStep / presenter.absoluteRange;


        // Move Y axis descriptions to the right place and draw grid
        var grid = $('<div class="graph_grid"></div>');
        presenter.chartInner.append(grid);

        var currentGridBlock;
        for(i = axisYGridStep; i <= presenter.axisYMaximumValue; i += axisYGridStep) {
            currentGridBlock = $('<div class="graph_grid_block graph_grid_block_above"></div>');
            grid.append(currentGridBlock);
            currentGridBlock.css({
                height: (drawingGridStep - parseInt(currentGridBlock.css('borderTopWidth'))) + 'px',
                bottom: presenter.drawingXPosition - drawingGridStep + (drawingGridStep * i / axisYGridStep)
            });

            presenter.$view.find('.graph_grid_description_' + new String(i).toString().replace('.', '_')).each(function(index, element) {
                $(element).css({
                    bottom: (presenter.drawingXPosition + (drawingGridStep * i / axisYGridStep) - $(element).height() / 2 + xAxisDescriptionMargin) + 'px'
                });
            });
        }


        for(i = -1 * axisYGridStep; i >= presenter.axisYMinimumValue; i -= axisYGridStep) {
            currentGridBlock = $('<div class="graph_grid_block graph_grid_block_below"></div>');
            grid.append(currentGridBlock);
            currentGridBlock.css({
                height: (drawingGridStep - parseInt(currentGridBlock.css('borderBottomWidth'))) + 'px',
                bottom: presenter.drawingXPosition + (drawingGridStep * i / axisYGridStep)
            });

            presenter.$view.find('.graph_grid_description_' + new String(i).toString().replace('.', '_')).each(function(index, element) {
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
        while(serieWidth % columnsCount !== 0) {
            serieWidth--;
        }

        var columnWidth = (100.0 / columnsCount) + '%';


        var series = $('<div class="graph_series"></div>');
        presenter.axisXLine.before(series);


        for(i = 0; i < presenter.data.length; i++) {
            // Skip empty rows
            if(presenter.data[i].length === 0) {
                continue;
            }

            serieContainer = $('<div class="graph_serie_container"></div>');
            serieContainer.css('width', serieWidth);

            serieElement = $('<div class="graph_serie_element graph_serie_size"></div>');
            serieContainer.append(serieElement);


            if(showXAxisSeriesDescriptions) {
                serieDescription = $('<div class="graph_serie_description"></div>');
                serieDescription.text(xAxisSeriesDescriptions[i]);
                serieElement.append(serieDescription);

                if(showXAxisBarsDescriptions) {
                    serieDescription.css('bottom', '-40px');
                } else {
                    serieDescription.css('bottom', '-20px');
                }
            }


            for(j = 0; j < presenter.data[i].length; j++) {
                columnContainer = $('<div class="graph_column_container"></div>');
                columnContainer.css('width', columnWidth);

                if(presenter.interactive) {
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
                if(presenter.interactive) {
                    valueElement.addClass('graph_value_element_interactive');
                    valueElement.click(presenter.decreaseGraphValue);
                }

                valueElement.css('backgroundColor', presenter.seriesColors[j]);

                valueContainer.attr('current-value', presenter.data[i][j]);
                valueContainer.attr('value-id', i + ' ' + j);
                valueContainer.append(valueElement);

                if(presenter.interactive) {
                    $(valueContainer).mousedown(mouseDownCallback);
                    valueContainer[0].ontouchstart = touchStartCallback;
                }

                if(showXAxisBarsDescriptions) {
                    columnDescription = $('<div class="graph_column_description graph_value_size"></div>');
                    columnDescription.text(xAxisBarsDescriptions[i*columnsCount + j]);
                    columnContainer.append(columnDescription);
                }

                presenter.redrawGraphValue(valueContainer);
                columnContainer.append(valueContainer);

                if(presenter.interactive) {
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
        if(axisYDescriptionLeft < 0) {
            axisYDescriptionLeft = 0;
        }
        axisYDescription.css('left', axisYDescriptionLeft + 'px');
    };

    return presenter;
}