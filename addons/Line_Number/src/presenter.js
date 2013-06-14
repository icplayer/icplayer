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
        END: 3,
        NONE: 4
    };

    presenter.run = function(view, model) {
        presenter.$view = $(view);
        presenter.$view.disableSelection();
        presenter.configuration = presenter.readConfiguration(model);

        if (presenter.configuration.isError) {
            return DOMOperationsUtils.showErrorMessage(presenter.$view, presenter.errorCodes, presenter.configuration.errorCode)
        }

        presenter.createSteps();
        drawRanges(presenter.configuration.shouldDrawRanges);
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
        var value = $(e).attr('value');
        presenter.configuration.mouseData.clickedRanges = [];

        $.each(ranges, function() {
            if ( $.inArray(value, this.values) >= 0  ) {
                presenter.configuration.mouseData.clickedRanges.push(this);
            }
        });

    }

    function getRangesThatMouseIsAbove(e) {
        var drawnRanges = presenter.configuration.drawnRangesData.ranges;
        var ranges = [];
        var value = $(e).attr('value');

        $.each(drawnRanges, function() {
            if ( $.inArray(value, this.values) >= 0   ) {
                ranges.push(this);
            }
        });

        return ranges;
    }

    function getClickedRangePosition(e) {
        var range = presenter.configuration.mouseData.clickedRanges[0];

        if (range.start.element[0] == $(e).parent()[0]) {
            return presenter.CLICKED_POSITION.START;
        }

        else if (range.end.element[0] == $(e).parent()[0]) {
            return presenter.CLICKED_POSITION.END;
        }

        else {
            return presenter.CLICKED_POSITION.MIDDLE;
        }
    }

    function removeRange(range, removeIncludeImages) {
        var stepLine = range.start.element;
        $(stepLine).find('.selectedRange').remove();
        if (!range.values) { range.values = [] }

        var index = presenter.configuration.drawnRangesData.ranges.indexOf(range);

        if (index >= 0) {
            var removed = presenter.configuration.drawnRangesData.ranges.splice(index, 1);

            if (removeIncludeImages && removed.length > 0) {
                var start = removed[0].start.element;
                var end = removed[0].end.element;

                $(start).find('.rangeImage').remove();
                $(end).find('.rangeImage').remove();
                $(start).find('.selectedRange').remove();
            }
        }

        $.each(range.values, function() {
            var value = parseInt(this, 10);
            var index = presenter.configuration.drawnRangesData.values.indexOf(value);
            presenter.configuration.drawnRangesData.values.splice(index, 1);
        });

    }

    function splitRange(range, e) {
        removeRange(range, false);
        var clickedArea = $(e);

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

        drawRanges([firstRange, secondRange]);
    }

    function joinRanges(ranges) {
        var firstRange, secondRange;
        var min = 1000, max = -1000;

        $.each(ranges, function() {
            if (this.end.value > max) {
                max = this.end.value;
                secondRange = this;
            }

            if (this.start.value < min) {
                min = this.start.value;
                firstRange = this;
            }
        });

        $.each(ranges, function() {
            removeRange(this, true);
        });

        var joinedRange = {
            'start' : firstRange.start,
            'end' : secondRange.end
        };

        drawRanges([joinedRange]);

        return joinedRange;
    }

    function setClicks(e) {
        var element = $(e);
        var position;

        if ( presenter.isMouseAboveExistingRange(e) ) {
            position = getClickedRangePosition(e);
        } else {
            position = presenter.CLICKED_POSITION.NONE;
        }

        var click = {
            element: element,
            position: position,
            time: new Date().getTime()
        };

        presenter.configuration.mouseData.clicks.push( click );
    }

    function isValueInDrawnRanges(value) {
        return $.inArray(value, presenter.configuration.drawnRangesData.values) >= 0;
    }

    function displayCurrentMousePosition(e) {
        presenter.$view.find('.currentMousePosition').remove();
        var circle = $('<div></div>');
        circle.addClass('currentMousePosition');
        $(e).parent().append(circle);
    }

    function hideCurrentMousePosition() {
        presenter.$view.find('.currentMousePosition').remove();
    }

    function createClickArea(element, value) {
        var clickArea = $('<div></div>');
        var selectedRange = $('<div></div>');

        selectedRange.addClass('selectedRange');
        clickArea.addClass('clickArea');

        $(element).append(clickArea);
        clickArea.attr('value', value);

        clickArea.on('mouseleave', function () {
            hideCurrentMousePosition();
        });

        clickArea.on('mouseenter', function (e) {
            e.preventDefault();
            displayCurrentMousePosition($(e.target));
        });

        clickArea.on('contextmenu', function (e) {
            e.preventDefault();
        });

        clickArea.on('touchstart', function (e){
            e.preventDefault();
            presenter.configuration.touchData.lastEvent = e;
        });

        clickArea.on('touchend', function (e){
            e.preventDefault();

            if ( presenter.configuration.touchData.lastEvent.type != e.type ) {
                var eventData = event.touches[0] || event.changedTouches[0];
                clickLogic(eventData.target);
            }

        });

        clickArea.css({
            'width' : presenter.configuration.stepWidth,
            'left' : - (presenter.configuration.stepWidth / 2) + 'px'
        });

        clickArea.on('click', function(e) {
            e.preventDefault();
            var eventTarget = $(e.target);
            clickLogic(eventTarget);
        });

        moveYAxisClickArea();
    }

    function clickLogic(eventTarget) {
        if (presenter.configuration.isShowErrorsMode) { return false; }

        setClickedRanges(eventTarget);

        setClicks(eventTarget);

        if ( presenter.configuration.mouseData.clicks.length == 1
            && presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.NONE ) {

            addEndRangeImage(presenter.configuration.mouseData.clicks[0].element.parent(), true);
            var element = presenter.configuration.mouseData.clicks[0].element;
            var range = {
                start: createRangeElement(element.parent(), element.attr('value'), true),
                end: createRangeElement(element.parent(), element.attr('value'), true)
            };
            setRangeValues(range, true);
            presenter.configuration.drawnRangesData.ranges.push(range);


        } else if ( presenter.configuration.mouseData.clicks.length == 2
            && presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.NONE
            && presenter.configuration.mouseData.clicks[1].position == presenter.CLICKED_POSITION.NONE ) {

            var firstClick = presenter.configuration.mouseData.clicks[0].element;
            var secondClick = presenter.configuration.mouseData.clicks[1].element;
            var range = null;

            if ( firstClick.attr('value') > secondClick.attr('value') ) {

                range = {
                    start: createRangeElement(secondClick.parent(), secondClick.attr('value'), true),
                    end: createRangeElement(firstClick.parent(), firstClick.attr('value'), true)
                };

                removeRangesBetweenRange(range);
                drawRanges([range]);

            } else if ( firstClick.attr('value') < secondClick.attr('value') ) {

                range = {
                    start: createRangeElement(firstClick.parent(), firstClick.attr('value'), true),
                    end: createRangeElement(secondClick.parent(), secondClick.attr('value'), true)
                };

                removeRangesBetweenRange(range);
                drawRanges([range]);

            } else {

                var rangeImage = firstClick.parent().find('.rangeImage');

                if ( rangeImage.hasClass('include') ) {
                    rangeImage.remove();
                } else {
                    rangeImage.removeClass('exclude');
                    rangeImage.addClass('include');
                }

            }

            presenter.configuration.mouseData.clicks = [];

        } else if ( presenter.configuration.mouseData.clicks.length == 2
            && presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.NONE
            && presenter.configuration.mouseData.clicks[1].position != presenter.CLICKED_POSITION.NONE ) {

            var timeDiff = presenter.configuration.mouseData.clicks[1].time - presenter.configuration.mouseData.clicks[0].time;

            if ( timeDiff < 250 && timeDiff > 0 ) {

                presenter.configuration.mouseData.clicks = [];

            } else {

                var firstClick = presenter.configuration.mouseData.clicks[0].element;
                var secondClick = presenter.configuration.mouseData.clicks[1].element;


                if ( firstClick.attr('value') > secondClick.attr('value') ) {

                    range = {
                        start: createRangeElement(secondClick.parent(), secondClick.attr('value'), true),
                        end: createRangeElement(firstClick.parent(), firstClick.attr('value'), true)
                    };

                } else if ( firstClick.attr('value') < secondClick.attr('value') ) {

                    range = {
                        start: createRangeElement(firstClick.parent(), firstClick.attr('value'), true),
                        end: createRangeElement(secondClick.parent(), secondClick.attr('value'), true)
                    };

                }

                var joinedRange = joinRanges([range, presenter.configuration.mouseData.clickedRanges[0]]);

                removeRangesBetweenRange(joinedRange);

                presenter.configuration.mouseData.clicks = [];

            }

        } else if ( presenter.configuration.mouseData.clickedRanges.length == 2 ) {

            joinRanges( presenter.configuration.mouseData.clickedRanges );

            presenter.configuration.mouseData.clicks = [];

        } else if ( presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.END
            || presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.START ){

            if (presenter.configuration.mouseData.clicks.length == 1) {

                var selectedRange = presenter.configuration.mouseData.clickedRanges[0].start.element.find('.selectedRange');
                selectedRange.addClass('currentSelectedRange');

            } else {

                var firstClick = presenter.configuration.mouseData.clicks[0].element;
                var secondClick = presenter.configuration.mouseData.clicks[1].element;
                var newRange;

                if ( presenter.configuration.mouseData.clicks[1].position == presenter.CLICKED_POSITION.MIDDLE ) {
                    var clickedRange = presenter.configuration.mouseData.clickedRanges[0];

                    if ( presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.START ) {

                        newRange = {
                            start: createRangeElement( secondClick.parent(), secondClick.attr('value'), firstClick.parent().find('.rangeImage').hasClass('include') ),
                            end: createRangeElement( clickedRange.end.element, clickedRange.end.value, clickedRange.end.include )
                        };

                    } else if ( presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.END ) {

                        newRange = {
                            end: createRangeElement( secondClick.parent(), secondClick.attr('value'), firstClick.parent().find('.rangeImage').hasClass('include') ),
                            start: createRangeElement( clickedRange.start.element, clickedRange.start.value, clickedRange.start.include )
                        };

                    }

                    removeRange(clickedRange, true);
                    drawRanges([newRange]);

                } else if ( presenter.configuration.mouseData.clicks[1].position == presenter.CLICKED_POSITION.NONE ) {

                    var joinedRange;

                    if ( firstClick.attr('value') > secondClick.attr('value') ) {

                        newRange = {
                            start: createRangeElement(secondClick.parent(), secondClick.attr('value'), true),
                            end: createRangeElement(firstClick.parent(), firstClick.attr('value'), true)
                        };

                        joinedRange = joinRanges( [newRange, getRangeByValue( firstClick.attr('value') )] );

                    } else if ( firstClick.attr('value') < secondClick.attr('value') ) {

                        newRange = {
                            start: createRangeElement(firstClick.parent(), firstClick.attr('value'), true ),
                            end: createRangeElement(secondClick.parent(), secondClick.attr('value'), true )
                        };

                        joinedRange = joinRanges( [newRange, getRangeByValue( firstClick.attr('value') )] );

                    }

                    removeRangesBetweenRange(joinedRange);


                } else if ( presenter.configuration.mouseData.clicks[0].position == presenter.configuration.mouseData.clicks[1].position
                    && presenter.configuration.mouseData.clicks[0].element[0] == presenter.configuration.mouseData.clicks[1].element[0] ) {

                    var imageWrapper = firstClick.parent().find('.rangeImage');
                    var shouldInclude = !imageWrapper.hasClass('include');
                    var index = presenter.configuration.drawnRangesData.ranges.indexOf(presenter.configuration.mouseData.clickedRanges[0]);

                    if ( presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.START ) {

                        presenter.configuration.drawnRangesData.ranges[index].start.include = shouldInclude;

                    } else if ( presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.END ) {

                        presenter.configuration.drawnRangesData.ranges[index].end.include = shouldInclude;

                    }

                    toggleIncludeImage( imageWrapper, shouldInclude );

                    presenter.$view.find('.currentSelectedRange').removeClass('currentSelectedRange');

                } else if ( presenter.configuration.mouseData.clicks[0].element[0] != presenter.configuration.mouseData.clicks[1].element[0]
                    && (presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.END
                    || presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.START)
                    && (presenter.configuration.mouseData.clicks[1].position == presenter.CLICKED_POSITION.END
                    || presenter.configuration.mouseData.clicks[1].position == presenter.CLICKED_POSITION.START) ) {

                    var joinedRange = joinRanges([ getRangeByValue( firstClick.attr('value') ), getRangeByValue( secondClick.attr('value') ) ]);

                    removeRangesBetweenRange(joinedRange);
                }


                presenter.configuration.mouseData.clicks = [];

            }


        } else if ( presenter.configuration.mouseData.clicks.length == 1
            && presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.MIDDLE ) {

            splitRange( presenter.configuration.mouseData.clickedRanges[0], eventTarget );

            presenter.configuration.mouseData.clicks = [];
        }

    }

    function removeRangesBetweenRange(range) {
        var currentRanges = [];
        currentRanges = currentRanges.concat(presenter.configuration.drawnRangesData.ranges);

        for( var i = 0; i < currentRanges.length; i++) {
            var drawnRange = currentRanges[i];
            if (range.start.value < drawnRange.start.value && range.end.value > drawnRange.start.value) {
                removeRange(drawnRange, true);
            }
        }

    }

    function getRangeByValue(value) {
        value = parseInt(value, 10);
        var range = null;

        $.each(presenter.configuration.drawnRangesData.ranges, function() {

            if ( this.values.indexOf(value) >= 0 ) {
                range = this;
                return false;
            }

        });

        return range;
    }

    function createRangeElement(element, value, include) {
        return {
            element: element,
            value: value,
            include: include
        }
    }

    presenter.isMouseAboveExistingRange = function( e ) {
        var value = $(e).attr('value');
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

    function drawRanges(ranges) {

        $.each(ranges, function(i) {
            var startValue = Math.min(this.start.value, this.end.value);
            var endValue = Math.max(this.start.value, this.end.value);
            var startElement = presenter.$view.find('.clickArea[value=' + startValue + ']').parent();
            var endElement = presenter.$view.find('.clickArea[value=' + endValue + ']').parent();
            var start = parseFloat($(startElement).css('left'));
            var end = parseFloat(endElement.css('left'));
            var difference = Math.abs(start - end);
            var range = $('<div></div>');

            if (!this.start.element || !this.end.element) {
                presenter.configuration.shouldDrawRanges[i].start.element = startElement;
                presenter.configuration.shouldDrawRanges[i].end.element = endElement;
            }

            range.addClass('selectedRange');
            range.css('width', difference + 2 + 'px');
            startElement.append(range);

            if (start > end) {
                range.css('left', - (difference) + 'px');
            }

            presenter.configuration.drawnRangesData.ranges.push(this);

            setRangeValues(this, true);
            addEndRangeImages(startElement, endElement, this.start.include, this.end.include);

        });
    }

    function setRangeValues(range, shouldAddToDrawn) {
        range.values = [];
        var startValue = Math.min(range.start.value, range.end.value);
        var endValue = Math.max(range.start.value, range.end.value);

        for ( var i = startValue; i <= endValue; i++ ) {
            range.values.push(i);
            if (shouldAddToDrawn) {
                presenter.configuration.drawnRangesData.values.push(i);
            }
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
        return imageContainer;
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

    presenter.getState = function () {
        $.each(presenter.configuration.drawnRangesData.ranges, function() {
            this.start.element = null;
            this.end.element = null;
        });

        var state = {
            drawnRangesData: presenter.configuration.drawnRangesData
        };

        return JSON.stringify(state);
    };

    presenter.setState = function (stateString) {
        var state = JSON.parse(stateString);
        var rangesToDraw = state['drawnRangesData'].ranges;

        $.each(rangesToDraw, function() {
            this.start.element = presenter.$view.find('.clickArea[value="' + this.start.value + '"]').parent();
            this.end.element = presenter.$view.find('.clickArea[value="' + this.end.value + '"]').parent();
        });

        $.each(presenter.configuration.shouldDrawRanges, function() {
           removeRange(this, true);
        });

        drawRanges(rangesToDraw);
    };

    presenter.reset = function() {
        var rangesToRemove = [];
        rangesToRemove = rangesToRemove.concat(presenter.configuration.drawnRangesData.ranges);

        $.each(rangesToRemove, function() {
            removeRange(this, true);
        });

        drawRanges(presenter.configuration.shouldDrawRanges);

        presenter.configuration.mouseData.clicks = [];
    };

    presenter.setShowErrorsMode = function() {
        presenter.configuration.isShowErrorsMode = true;
        var correctRanges = getCorrectSelectedRanges();

        $.each(correctRanges, function() {
            this.start.element.find('.selectedRange').addClass('correct');
        });

    };

    presenter.setWorkMode = function() {
        presenter.configuration.isShowErrorsMode = false;

        presenter.$view.find('.correct').removeClass('correct');

    };

    presenter.getScore = function() {
        var correctRanges = getCorrectSelectedRanges();
        return correctRanges.length;
    };

    presenter.getMaxScore = function () {
        return presenter.configuration.otherRanges.length;
    };

    presenter.getErrorCount = function () {
        var correctRanges = getCorrectSelectedRanges();
        return presenter.configuration.otherRanges.length - correctRanges.length;
    };

    function getCorrectSelectedRanges() {
        var correctSelectedRanges = [];

        $.each( presenter.configuration.drawnRangesData.ranges, function() {
            var drawnRange = this;
            $.each( presenter.configuration.otherRanges, function() {
                setRangeValues(this);
                if (compareRanges(this, drawnRange)) {
                    correctSelectedRanges.push(drawnRange);
                }
            });
        });

        return correctSelectedRanges;
    }

    function compareRanges(rangeA, rangeB) {
        return (compareArray(rangeA.values, rangeB.values)
            && rangeA.start.include == rangeB.start.include
            && rangeA.end.include == rangeB.end.include)
    }

    function compareArray(arrA, arrb) {
        var i = arrA.length;
        if (i != arrb.length) return false;

        while ( i-- ) {
            if (arrA[i] !== arrb[i]) return false;
        }

        return true;
    }

    presenter.validateRanges = function (model) {
        var rangesList = Helpers.splitLines(model['Ranges']);
        var rangesPattern = /(\(|<){1}[(?P \d)-]+,[(?P \d)-]+(\)|>){1},[ ]*(0|1){1}/i; // matches i.e. (1, 0), 0 or <2, 15), 1
        var validatedShouldDrawRanges = [];
        var validatedOtherRanges = [];
        var isError = false,
            errorCode;

        $.each(rangesList, function() {
            var rangeString = this.toString();

            if( !rangesPattern.test(rangeString) ) {
                isError = true;
                errorCode = 'RAN01';

                return false; // Breaks jQuery.each loop
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
                isError = true;
                errorCode = 'MIN/MAX01';

                return false; // Breaks jQuery.each loop
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

            return true; // jQuery.each continue statement
        });

        return {
            isError: isError,
            errorCode: errorCode,
            shouldDrawRanges : validatedShouldDrawRanges,
            otherRanges : validatedOtherRanges
        };
    };

    presenter.readConfiguration = function(model) {
        if(ModelValidationUtils.isStringEmpty(model['Min'])) {
            return { 'isError' : true, 'errorCode' : 'MIN01' };
        }

        if(ModelValidationUtils.isStringEmpty(model['Max'])) {
            return { 'isError' : true, 'errorCode' : 'MAX01' };
        }

        if(!checkIsMinLowerThanMax(model['Min'], model['Max'])) {
            return { 'isError' : true, 'errorCode' : 'MIN/MAX01' };
        }

        var validatedMin = ModelValidationUtils.validateInteger(model['Min']);
        var validatedMax = ModelValidationUtils.validateInteger(model['Max']);
        var min, max;

        if (!validatedMin.isValid) {
            return { 'isError': true, 'errorCode': 'MIN02' };
        }

        min = validatedMin.value;

        if (!validatedMax.isValid) {
            return { 'isError': true, 'errorCode': 'MAX02' };
        }

        max = validatedMax.value;

        var ranges = presenter.validateRanges(model);

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
            'shouldDrawRanges' : ranges.shouldDrawRanges,
            'otherRanges' : ranges.otherRanges,
            'isActivity' : validatedIsActivity,
            'step' : validatedStep.value,
            'showAxisXValues' : validatedShowAxisXValues,
            'axisXValues' : validatedAxisXValues,
            'mouseData' : {
                'clickedRanges' : [],
                'clicks' : []
            },
            'drawnRangesData' : {
                'isDrawn' : false,
                'ranges' : [],
                'values' : []
            },
            'touchData' : {
                'lastEvent' : null
            },
            'isShowErrorsMode' : false

        }
    };

    return presenter;
}       