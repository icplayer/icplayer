function AddonLine_Number_create() {
    function log(s) {
        console.log(s);
    }

    var presenter = function () {};

    presenter.configuration = {};

    presenter.errorCodes = {
        'MIN01' : 'Min value cannot be empty.',
        'MIN02' : 'Min value must be a number.',
        'MAX01' : 'Max value cannot be empty.',
        'MAX02' : 'Max value must be a number',
        'MIN/MAX01' : 'Min value cannot be lower than Max value.',
        'RAN01' : 'One or more ranges are invalid.',
        'STEP01' : 'The value in Step property is invalid.',
        'VAL01' : 'One or more X axis values are invalid.'
    };

    presenter.CLICKED_POSITION = {
        START: 1,
        MIDDLE: 2,
        END: 3
    };

    presenter.run = function(view, model) {
        presenter.$view = $(view);
        presenter.$view.disableSelection();

        presenter.configuration = presenter.readConfiguration(model);

        if (presenter.configuration.isError) {
            return DOMOperationsUtils.showErrorMessage(presenter.$view, presenter.errorCodes, presenter.configuration.errorCode)
        }

        presenter.createSteps();
        drawRangeFromList(presenter.configuration.shouldDrawRanges);
    };

    function calculateStepWidth(xAxisValues) {
        var xAxisWidth = presenter.$view.find('#x-axis').width() - 1;

        return xAxisWidth / (xAxisValues.length - 1);
    }

    function getXAxisValues() {
        var configuration = presenter.configuration;
        var xAxisValues = [];

        for (var i = configuration.min; i <= configuration.max; i += configuration.step) {
            xAxisValues.push(i);
        }
        return xAxisValues;
    }

    function setClickedRanges(e) {
        var ranges = presenter.configuration.drawnRangesData.ranges;
        var value = $(e.target).attr('value');

        presenter.configuration.mouseData.clickedRanges = [];

        $.each(ranges, function() {
            if ( $.inArray(value, this.values) >= 0  ) {
                presenter.configuration.mouseData.clickedRanges.push(this);
            }
        });
    }

    function isEndOfCurrentSelectedRange() {
        return presenter.configuration.mouseData.clickedRanges[0].start.element[0] == presenter.configuration.mouseData.clickedRanges[0].end.element[0];
    }

    function eraseCurrentSelectedRange(clickArea) {
        var stepLine = $(clickArea).parent();
        stepLine.find('.selectedRange').remove();
        stepLine.find('.rangeImage').remove();
        presenter.configuration.mouseData.clickedRanges = [];
    }


    function shortenFromLeft() {
        var drawnRange = presenter.configuration.mouseData.clickedRanges.start.element.find('.selectedRange');
        var rangeImage = presenter.configuration.mouseData.clickedRanges.start.element.find('.rangeImage');
        var startValue = presenter.configuration.mouseData.clickedRanges.start.value;
        var clickedElementRange = presenter.configuration.mouseData.clickedRanges;

        var start = parseFloat(clickedElementRange.start.element.css('left'));
        var end = parseFloat(clickedElementRange.end.element.css('left'));
        var difference = Math.abs(start - end);

        var clickArea = presenter.$view.find('.clickArea[value=' + (startValue + 1) + ']');

        var newStartElement = clickArea.parent();
        var newDrawnRange = drawnRange.clone(true);

        if (presenter.configuration.mouseData.isInRange) {
            newDrawnRange.css({
                'width' : (difference - presenter.configuration.stepWidth) + 2 + 'px'
            });
        }
        drawnRange.remove();
        newStartElement.append(newDrawnRange);
        rangeImage.remove();

        addEndRangeImage(newStartElement, true);

        presenter.configuration.mouseData.clickedRanges.start.element = newStartElement;
        presenter.configuration.mouseData.clickedRanges.start.value = (startValue + 1);

        if (isEndOfCurrentSelectedRange()) {
            eraseCurrentSelectedRange(clickArea);
        }
    }

    function setWhichPartOfRangeWasClicked(e) {
        var range = presenter.configuration.mouseData.clickedRanges[0];
        presenter.configuration.mouseData.clickedPosition = null;

        if (range.start.element[0] == $(e.target).parent()[0]) {
            presenter.configuration.mouseData.clickedPosition = presenter.CLICKED_POSITION.START;
        }

        else if (range.end.element[0] == $(e.target).parent()[0]) {
            presenter.configuration.mouseData.clickedPosition = presenter.CLICKED_POSITION.END;
        }

        else {
            presenter.configuration.mouseData.clickedPosition = presenter.CLICKED_POSITION.MIDDLE;
        }
    }

    function setMouseDown() {
        presenter.configuration.mouseData.isMouseDown = true;
    }

    function isIncludeImageClicked(e) {
        return $(e.target).parent().find('.rangeImage').length > 0;
    }

    function removeRange(range, removeIncludeImages) {
        var stepLine = range.start.element;
        $(stepLine).find('.selectedRange').remove();
        presenter.configuration.mouseData.clickedRanges = [];

        var index = presenter.configuration.drawnRangesData.ranges.indexOf(range);
        var removed = presenter.configuration.drawnRangesData.ranges.splice(index, 1);


        if (removeIncludeImages && removed.length > 0) {
            var start = removed[0].start.element;
            var end = removed[0].end.element;

            $(start).find('.rangeImage').remove();
            $(end).find('.rangeImage').remove();
        }
        var removedValues = [];
        $.each(range.values, function() {
            var value = parseInt(this, 10);
            var index = presenter.configuration.drawnRangesData.values.indexOf(value);
            removedValues.concat(presenter.configuration.drawnRangesData.values.splice(index, 1));
        });

    }

    function splitRange(range, e) {
        removeRange(range, false);
        var clickedArea = $(e.target);

        var firstRange = {
            'start' : range.start,
            'end' : {
                'element' : clickedArea.parent(),
                'value' : clickedArea.attr('value'),
                'include' : false
            }
        };

        var secondRange = {
            'start' : firstRange.end,
            'end' : range.end
        };

        drawRangeFromList([firstRange, secondRange]);
    }

    function joinRanges() {
        var ranges = presenter.configuration.mouseData.clickedRanges;
        var firstRange, secondRange;

        if (ranges[0].start.value < ranges[1].start.value) {
            firstRange = ranges[0];
            secondRange = ranges[1];
        } else {
            firstRange = ranges[1];
            secondRange = ranges[0];
        }

        log('join')
        log(ranges)
        log(firstRange)
        log(secondRange)

        $.each(ranges, function() {
            removeRange(this, true);
        });

        var joinedRange = {
            'start' : firstRange.start,
            'end' : secondRange.end
        };

        drawRangeFromList([joinedRange]);
    }

    function setWhichElementWasClicked(e) {
        presenter.configuration.mouseData.clickedElement = $(e.target);
    }

    function addRangeFromElement(element) {

        var start = {
            'element' : $(element).parent(),
            'value' : $(element).attr('value'),
            'include' : true
        };
        var end = start;
        var values = [start.value];
        var range = {
            start: start,
            end: end,
            values: values
        };

        presenter.configuration.drawnRangesData.ranges.push( range );

        var value = parseInt( $(element).attr('value'), 10 );
        if ( presenter.configuration.drawnRangesData.values.indexOf( value ) == -1 ) {
            presenter.configuration.drawnRangesData.values.push( value );
        }
    }

    function isStartSameAsEnd(range) {
        return range.values.length == 1;
    }

    function createClickArea(element, value) {
        var clickArea = $('<div></div>');
        var selectedRange = $('<div></div>');

        selectedRange.addClass('selectedRange');
        clickArea.addClass('clickArea');

        $(element).append(clickArea);
        clickArea.attr('value', value);

        clickArea.on('contextmenu', function (e) {
            e.preventDefault();
        });

        clickArea.on('mousedown', function (e){
            setMouseDown();
            setClickedRanges(e);

            if ( presenter.isClickedInExistingRange(e) ) {
                setWhichPartOfRangeWasClicked(e);
            } else {
                setWhichElementWasClicked(e);
            }

        });

        clickArea.on('mouseup', function (e){

            if ( presenter.configuration.mouseData.isMouseMoved ) {
                drawRangeFromList([presenter.configuration.rangeToDraw]);
                presenter.configuration.rangeToDraw = null;
            } else {
                var range = presenter.configuration.mouseData.clickedRanges[0];
                if ( presenter.isClickedInExistingRange(e) ) {

                    if ( isIncludeImageClicked(e) ) {

                        if ( isStartSameAsEnd(range) ) {
                            removeRange(range, true);
                        }

                        else if ( presenter.configuration.mouseData.clickedRanges.length == 2 ) {
                            joinRanges();
                        }

                        else {
                            var shouldInclude = true;
                            var imageWrapper = null;

                            if ( presenter.configuration.mouseData.clickedPosition == presenter.CLICKED_POSITION.START) {
                                shouldInclude = !range.start.include;
                                imageWrapper = range.start.element.find('.rangeImage');
                                presenter.configuration.mouseData.clickedRanges[0].start.include = shouldInclude;
                            } else {
                                shouldInclude = !range.end.include;
                                imageWrapper = range.end.element.find('.rangeImage');
                                presenter.configuration.mouseData.clickedRanges[0].end.include = shouldInclude;
                            }

                            toggleIncludeImage(imageWrapper, shouldInclude);
                        }

                    } else {
                        splitRange(range, e);
                    }

                } else {
                    addEndRangeImage( $(e.target).parent(), true );
                    addRangeFromElement( presenter.configuration.mouseData.clickedElement );
                }

            }

            presenter.configuration.mouseData.isMouseDown = false;
            presenter.configuration.mouseData.isMouseMoved = false;
        });

        clickArea.on('mouseenter', function(e) {
            if (presenter.configuration.mouseData.isMouseDown) {
                presenter.configuration.mouseData.isMouseMoved = true;

                var start = {
                    element: $(presenter.configuration.mouseData.clickedElement).parent(),
                    value: presenter.configuration.mouseData.clickedElement.attr('value'),
                    include: true
                };

                var end = {
                    element: $(e.target).parent(),
                    value: $(e.target).attr('value'),
                    include: true
                };

                var range = {
                    start: start,
                    end: end
                };

                presenter.configuration.rangeToDraw = range;
            }
        });

        presenter.$view.on('mouseup', function (e){
            presenter.$view.find('.current').removeClass('current');
            presenter.configuration.mouseData.isMouseDown = false;
        });

        var clickAreaWidth = presenter.configuration.stepWidth - (presenter.configuration.stepWidth / 4);
        clickArea.css({
            'width' : clickAreaWidth,
            'left' : - (clickAreaWidth / 2) + 'px'
        });

        moveYAxisClickArea();
    }

    presenter.isClickedInExistingRange = function( e ) {
        var value = $(e.target).attr('value');

        return $.inArray( parseInt(value, 10), presenter.configuration.drawnRangesData.values ) >= 0;
    };

    presenter.isValueInRange = function( value, range, takeExcludeIntoConsideration ) {
        var start, end;
        if (takeExcludeIntoConsideration) {
            start = range.start.include ? range.start.value : range.start.value + 1;
            end = range.end.include ? range.end.value + 1 : range.end.value;
        } else {
            start = range.start.value;
            end = range.end.value + 1;
        }

        for( var i = start; i < end; i++ ) {
            if ( i == value ) {
                return true;
            }
        }
        return false;
    };

    function toggleIncludeImage(imageWrapper, shouldInclude) {
        if (shouldInclude) {
            imageWrapper.addClass('include');
            imageWrapper.removeClass('exclude');
        } else {
            imageWrapper.addClass('exclude');
            imageWrapper.removeClass('include');
        }
    }

    function excludeElementFromRange(element, range) {
        var rangeStartImage = range.start.element.find('.rangeImage');
        var rangeEndImage = range.end.element.find('.rangeImage');

        if (element.parent()[0] == range.start.element[0] && !presenter.configuration.mouseData.isMouseDown) {
            range.start.include = !range.start.include;
            toggleIncludeImage(rangeStartImage, range.start.include);

        } else if (element.parent()[0] == range.end.element[0] && !presenter.configuration.mouseData.isMouseDown) {
            range.end.include = !range.end.include;
            toggleIncludeImage(rangeEndImage, range.end.include);

        } else {
            var currentRanges = presenter.configuration.drawnRangesData.ranges;
            var currentIndex = 0;

            $.each(presenter.configuration.drawnRangesData.ranges, function(i) {
                if ( presenter.isValueInRange(element.parent().find('.clickArea').attr('value'), this, false) ) {
                    currentIndex = i;
                }
            });

            var first = {
                start : {
                    element: currentRanges[currentIndex].start.element,
                    include: currentRanges[currentIndex].start.include,
                    value: currentRanges[currentIndex].start.element.find('.clickArea').attr('value')
                },
                end: {
                    element: element.parent(),
                    include: false,
                    value: element.parent().find('.clickArea').attr('value')
                },
                shouldDrawRange: true
            };

            var second = {
                start : {
                    element: element.parent(),
                    include: false,
                    value: element.parent().find('.clickArea').attr('value')
                },
                end: {
                    element: currentRanges[currentIndex].end.element,
                    include: currentRanges[currentIndex].end.include,
                    value: currentRanges[currentIndex].end.element.find('.clickArea').attr('value')
                },
                shouldDrawRange: true
            };

            presenter.configuration.drawnRangesData.ranges.splice(currentIndex, 1, first, second);

            clearDrawnElements();
            drawRangeFromList(presenter.configuration.drawnRangesData.ranges);
        }
    }

    function clearDrawnElements() {
        $.each(presenter.configuration.drawnRangesData.ranges, function() {
            var currentDrawnElement = this.start.element.find('.selectedRange');
            currentDrawnElement.remove();
        });
    }

    function drawRangeFromEvent(e) {
        if (presenter.configuration.drawnRangesData.isDrawn) {
            var currentElement = $(e.target);
            var value = currentElement.attr('value');

            return;
        }
        var startElement = presenter.$view.find('.current').parent();
        var endElement = $(e.target).parent();
        var start = parseFloat(startElement.css('left'));
        var end = parseFloat(endElement.css('left'));
        var difference = Math.abs(start - end);
        var currentSelectedRange = presenter.$view.find('.current');
        currentSelectedRange.css('width', difference + 2 + 'px');

        var drawnRange = {
            start : { element: startElement, include: true, value: startElement.find('.clickArea').attr('value') },
            end: { element: endElement, include: true, value: endElement.find('.clickArea').attr('value') }
        };

        presenter.configuration.drawnRangesData.ranges[0] = drawnRange;

        if (start > end) {
            currentSelectedRange.css('left', - (difference) + 'px');
        }

    }

    function drawRangeFromList(rangesList) {
        $.each(rangesList, function(i) {
            var startElement = presenter.$view.find('.clickArea[value=' + this.start.value + ']').parent();
            var endElement = presenter.$view.find('.clickArea[value=' + this.end.value + ']').parent();

            if (!this.start.element || !this.end.element) {
                presenter.configuration.shouldDrawRanges[i].start.element = startElement;
                presenter.configuration.shouldDrawRanges[i].end.element = endElement;
            }

            var start = parseFloat($(startElement).css('left'));
            var end = parseFloat(endElement.css('left'));
            var difference = Math.abs(start - end);
            var range = $('<div></div>');
            range.addClass('selectedRange');
            range.css('width', difference + 2 + 'px');
            startElement.append(range);

            if (start > end) {
                range.css('left', - (difference) + 'px');
            }

            presenter.configuration.drawnRangesData.ranges.push(this);

            addEndRangeImages(startElement, endElement, this.start.include, this.end.include);
            setDrawnRangeValues(this);
        });
    }

    function setDrawnRangeValues(range) {
        range.values = [];
        var startValue = Math.min(range.start.value, range.end.value);
        var endValue = Math.max(range.start.value, range.end.value);

        for ( var i = startValue; i <= endValue; i++ ) {
            if (presenter.configuration.drawnRangesData.values.indexOf(i) == -1) {
                presenter.configuration.drawnRangesData.values.push(i);
            }
            range.values.push(i);
        }
    }

    function addEndRangeImages(startElement, endElement, includeStart, includeEnd) {
        addEndRangeImage(endElement, includeEnd);

        if (startElement[0] != endElement[0]) {
            addEndRangeImage(startElement, includeStart);
        }
    }

    function addEndRangeImage(element, include) {
        element.find('.rangeImage').remove();
        var imageContainer = $('<div></div>');
        imageContainer.addClass('rangeImage');
        imageContainer.addClass(include ? 'include' : 'exclude');
        element.append(imageContainer);

    }

    presenter.createSteps = function () {
        var xAxisValues = getXAxisValues();
        presenter.configuration.stepWidth = calculateStepWidth(xAxisValues);
        var isDrawOnlyChosen = presenter.configuration.axisXValues.length > 0;

        for (var i = 0; i < xAxisValues.length; i++) {
            var stepLine = $('<div></div>');
            stepLine.addClass('stepLine');

            if (xAxisValues[i] == 0) {
                var innerHeight = presenter.$view.find('#inner').height();
                var yAxis = presenter.$view.find('#y-axis');
                var xAxis = presenter.$view.find('#x-axis');

                yAxis.height(innerHeight);
                yAxis.css({
                    'top' : - (innerHeight / 2),
                    'left' : presenter.configuration.stepWidth * i
                });
                xAxis.append(yAxis);
            } else {
                var text = $('<div></div>');
                text.addClass('stepText');
                text.html(xAxisValues[i]);
                text.css('left', - new String(xAxisValues[i]).length * (4) + 'px');


                if (isDrawOnlyChosen && presenter.configuration.showAxisXValues) {
                    if ($.inArray(xAxisValues[i], presenter.configuration.axisXValues) !== -1) {
                        stepLine.append(text);
                    }
                } else if (presenter.configuration.showAxisXValues) {
                    stepLine.append(text);
                }

            }

            stepLine.css('left', presenter.configuration.stepWidth * i);
            createClickArea(stepLine, xAxisValues[i]);
            presenter.$view.find('#x-axis').append(stepLine);
        }
    };

    function moveYAxisClickArea() {
        var yAxisClickArea = $('#y-axis .clickArea');
        yAxisClickArea.css('top', ($('#y-axis').height() / 2) - 50 + 'px');
    }

    function checkIsMinLowerThanMax(min, max) {
        var parsedMin = parseInt(min, 10);
        var parsedMax = parseInt(max, 10);
        return parsedMin < parsedMax;
    }

    presenter.readConfiguration = function(model) {
        var isMinEmpty = ModelValidationUtils.isStringEmpty(model['Min']);

        if(isMinEmpty) {
            return {
                'isError' : true,
                'errorCode' : 'MIN01'
            }
        }

        var isMaxEmpty = ModelValidationUtils.isStringEmpty(model['Max']);

        if(isMaxEmpty) {
            return {
                'isError' : true,
                'errorCode' : 'MAX01'
            }
        }

        var isMinLowerThanMax = checkIsMinLowerThanMax(model['Min'], model['Max']);

        if(!isMinLowerThanMax) {
            return {
                'isError' : true,
                'errorCode' : 'MIN/MAX01'
            }
        }

        var validatedMin = ModelValidationUtils.validateInteger(model['Min']);
        var validatedMax = ModelValidationUtils.validateInteger(model['Max']);
        var min, max;

        if(validatedMin.isValid) {
            min = validatedMin.value;
        } else {
            return {
                'isError' : true,
                'errorCode' : 'MIN02'
            }
        }

        if(validatedMax.isValid) {
            max = validatedMax.value;
        } else {
            return {
                'isError' : true,
                'errorCode' : 'MAX02'
            }
        }

        var rangesList = Helpers.splitLines(model['Ranges']);
//        var rangesList = model['Ranges'].split(/[\n\r]+/);
        var rangesPattern = /(\(|<){1}[(?P \d)-]+,[(?P \d)-]+(\)|>){1},[ ]*(0|1){1}/i; // matches i.e. (1, 0), 0 or <2, 15), 1
        var validatedShouldDrawRanges = [];
        var validatedOtherRanges = [];

        $.each(rangesList, function(i) {
            var rangeString = this.toString();

            if( !rangesPattern.test(rangeString) ) {
                return {
                    'isError' : true,
                    'errorCode' : 'RAN01'
                }
            }

            var regexResult = rangesPattern.exec(rangeString)[0];
            var brackets = regexResult.match(/[\(\)<>]+/g);
            var onlyNumbersAndCommas = regexResult.replace(/[ \(\)<>]*/g, '');
            var onlyNumbers = onlyNumbersAndCommas.split(',');
            var min = onlyNumbers[0];
            var max = onlyNumbers[1];
            var minInclude = brackets[0] == '<';
            var maxInclude = brackets[1] == '>';
            var shouldDrawRange = onlyNumbers[2] == '1';

            if(!checkIsMinLowerThanMax(min, max)) {
                return {
                    'isError' : true,
                    'errorCode' : 'MIN/MAX01'
                }
            }

            var validatedRange = {
                start: { value : parseInt(min, 10), include: minInclude, element: null },
                end: { value: parseInt(max, 10), include: maxInclude, element: null }
            };

            if (shouldDrawRange) {
                validatedShouldDrawRanges.push(validatedRange);
            } else {
                validatedOtherRanges.push(validatedRange);
            }

        });

        var validatedIsActivity = ModelValidationUtils.validateBoolean(model['Is Activity']);
        var validatedStep = { value : 1 };

        if ( model['Step'] ) {
            validatedStep = ModelValidationUtils.validateIntegerInRange(model['Step'], 50, 1);

            if (!validatedStep.isValid) {
                return {
                    'isError' : true,
                    'errorCode' : 'STEP01'
                }
            }
        }

        var validatedAxisXValues = [];

        if (model['Axis X Values'] !== '') {
            var splittedValues = model['Axis X Values'].split(',');
            for (var i = 0; i < splittedValues.length; i++) {
                var value = splittedValues[i].replace(' ', '');
                var validatedValue = ModelValidationUtils.validateIntegerInRange(value, max, min);

                if (!validatedValue.isValid) {
                    return {
                        'isError' : true,
                        'errorCode' : 'VAL01'
                    }
                }

                validatedAxisXValues.push(validatedValue.value);
            }
        }

        var validatedShowAxisXValues = ModelValidationUtils.validateBoolean(model['Show Axis X Values']);

        return {
            'isError' : false,
            'min' : min,
            'max' : max,
            'shouldDrawRanges' : validatedShouldDrawRanges,
            'otherRanges' : validatedOtherRanges,
            'isActivity' : validatedIsActivity,
            'step' : validatedStep.value,
            'showAxisXValues' : validatedShowAxisXValues,
            'axisXValues' : validatedAxisXValues,
            'mouseData' : {
                'isMouseDown' : false,
                'isMouseMoved' : false,
                'isInRange' : false,
                'clickedRanges' : []
            },
            'drawnRangesData' : {
                'isDrawn' : false,
                'ranges' : [],
                'values' : []
            }
        }
    };

    return presenter;
}       