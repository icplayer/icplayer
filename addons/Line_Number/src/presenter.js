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
        presenter.configuration.isPreview = false;

        if (presenter.configuration.isError) {
            return DOMOperationsUtils.showErrorMessage(presenter.$view, presenter.errorCodes, presenter.configuration.errorCode)
        }

        presenter.createSteps();
        presenter.bindInfinityAreas();

        drawRanges(presenter.configuration.shouldDrawRanges);
    };

    presenter.bindInfinityAreas = function() {
        var infinityLeft = $('.infinity-left');
        var infinityRight = $('.infinity-right');

        infinityLeft.on('touchstart', function (e){
            e.preventDefault();
            presenter.configuration.touchData.lastEvent = e;
        });

        infinityLeft.on('touchend', function (e){
            e.preventDefault();

            if ( presenter.configuration.touchData.lastEvent.type != e.type ) {
                var eventData = event.touches[0] || event.changedTouches[0];
                clickLogic(eventData.target);
            }

        });

        infinityLeft.on('click', function(e) {
            e.preventDefault();
            var eventTarget = $(e.target);
            clickLogic(eventTarget);
        });

        infinityRight.on('touchstart', function (e){
            e.preventDefault();
            presenter.configuration.touchData.lastEvent = e;
        });

        infinityRight.on('touchend', function (e){
            e.preventDefault();

            if ( presenter.configuration.touchData.lastEvent.type != e.type ) {
                var eventData = event.touches[0] || event.changedTouches[0];
                clickLogic(eventData.target);
            }

        });

        infinityRight.on('click', function(e) {
            e.preventDefault();
            var eventTarget = $(e.target);
            clickLogic(eventTarget);
        });
    };

    presenter.createPreview = function (view, model) {
        presenter.$view = $(view);
        presenter.$view.disableSelection();
        presenter.configuration = presenter.readConfiguration(model);
        presenter.configuration.isPreview = true;

        if (presenter.configuration.isError) {
            return DOMOperationsUtils.showErrorMessage(presenter.$view, presenter.errorCodes, presenter.configuration.errorCode)
        }

        presenter.createSteps();
        drawRanges(presenter.configuration.shouldDrawRanges);

        if (!presenter.configuration.isVisibleByDefault) {
            presenter.hide();
        }
    };

    function calculateStepWidth(xAxisValues) {
        var xAxisWidth = presenter.$view.find('.x-axis').width() - 1;

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
        var value = parseRangeStartOrEnd($(e).attr('value'));
        presenter.configuration.mouseData.clickedRanges = [];

        $.each(ranges, function() {
            if ( $.inArray(value, this.values) >= 0  ) {
                presenter.configuration.mouseData.clickedRanges.push(this);
            }
        });

    }

    function getClickedRangePosition(e) {
        var range = presenter.configuration.mouseData.clickedRanges[0];

        if ( $(e).attr('value') == '-INF' ) {
            return presenter.CLICKED_POSITION.START;
        }

        else if ( $(e).attr('value') == 'INF' ) {
            return presenter.CLICKED_POSITION.END;
        }

        else if (range.start.element[0] == $(e).parent()[0]) {
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
                var start = parseElement(removed[0].start.element);
                var end = parseElement(removed[0].end.element);
                $(start).find('.rangeImage').remove();
                $(end).find('.rangeImage').remove();
                $(start).find('.selectedRange').remove();
            }
        }

        $.each(range.values, function() {
            var value = parseRangeStartOrEnd(this);
            var index = presenter.configuration.drawnRangesData.values.indexOf(value);
            presenter.configuration.drawnRangesData.values.splice(index, 1);
        });

    }

    function splitRange(range, e) {
        removeRange(range, false);
        var clickedArea = $(e);

        var firstRange = {
            'start' : range.start,
            'end' : createRangeElement(clickedArea, clickedArea.attr('value'), false)
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

        removeRangesBetweenRange(joinedRange);

        drawRanges([joinedRange]);

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

        if (!presenter.configuration.isPreview) {
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

        }

        clickArea.css({
            'width' : presenter.configuration.stepWidth,
            'left' : - (presenter.configuration.stepWidth / 2) + 'px'
        });

        if (!presenter.configuration.isPreview) {
            clickArea.on('click', function (e) {
                e.preventDefault();
                var eventTarget = $(e.target);
                clickLogic(eventTarget);
            });
        }

        moveYAxisClickArea();
    }

    function isFirstClick() {
        return presenter.configuration.mouseData.clicks.length == 1;
    }

    function isSecondClick() {
        return presenter.configuration.mouseData.clicks.length == 2;
    }

    function areBothClicksNone() {
        return presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.NONE
            && presenter.configuration.mouseData.clicks[1].position == presenter.CLICKED_POSITION.NONE;
    }

    function isFirstClickNoneAndSecondNotNone() {
        return presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.NONE
        && presenter.configuration.mouseData.clicks[1].position != presenter.CLICKED_POSITION.NONE;
    }

    function isOneRangeStartAndOtherRangeEndClicked() {
        return presenter.configuration.mouseData.clickedRanges.length == 2;
    }

    function isClickedStartOrEnd() {
        return presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.END
        || presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.START;
    }

    function isClickedMiddle() {
        return presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.MIDDLE;
    }

    function isFirstStartOrEndAndSecondMiddleClicked() {
        return presenter.configuration.mouseData.clicks[1].position == presenter.CLICKED_POSITION.MIDDLE
            && isClickedStartOrEnd();
    }

    function isFirstStartOrEndAndSecondNoneClicked() {
        return presenter.configuration.mouseData.clicks[1].position == presenter.CLICKED_POSITION.NONE
            && isClickedStartOrEnd();
    }

    function isTheSameRangeEndOrStartClickedInBothClicks() {
        return presenter.configuration.mouseData.clicks[0].position == presenter.configuration.mouseData.clicks[1].position
        && presenter.configuration.mouseData.clicks[0].element[0] == presenter.configuration.mouseData.clicks[1].element[0];
    }

    function isBothClicksTheSameRangeStartOrEnd() {
        return presenter.configuration.mouseData.clicks[0].element[0] != presenter.configuration.mouseData.clicks[1].element[0]
            && (presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.END
            || presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.START)
            && (presenter.configuration.mouseData.clicks[1].position == presenter.CLICKED_POSITION.END
            || presenter.configuration.mouseData.clicks[1].position == presenter.CLICKED_POSITION.START);
    }

    function clickLogic(eventTarget) {
        if (presenter.configuration.isShowErrorsMode) { return false; }

        setClickedRanges(eventTarget);

        setClicks(eventTarget);

        log(presenter.configuration.mouseData)

        var firstClick = presenter.configuration.mouseData.clicks[0];

        if ( isFirstClick() ) {

            if ( firstClick.position == presenter.CLICKED_POSITION.NONE ) {

                var value = parseRangeStartOrEnd(presenter.configuration.mouseData.clicks[0].element.attr('value'));

                if ( !isValueInfinity(value) ) {
                    addEndRangeImage(presenter.configuration.mouseData.clicks[0].element.parent(), true);

                }

            }

            else if ( isOneRangeStartAndOtherRangeEndClicked() ) {

                joinRanges( presenter.configuration.mouseData.clickedRanges );

                presenter.configuration.mouseData.clicks = [];

            }

            else if ( isClickedStartOrEnd() ) {

                var selectedRange = presenter.configuration.mouseData.clickedRanges[0].start.element.find('.selectedRange');
                selectedRange.addClass('currentSelectedRange');

            }

            else if ( isClickedMiddle() ) {

                splitRange( presenter.configuration.mouseData.clickedRanges[0], eventTarget );

                presenter.configuration.mouseData.clicks = [];

            }

        }

        else if ( isSecondClick() ) {

            var secondClick = presenter.configuration.mouseData.clicks[1];
            var newRange;
            var firstValue = parseRangeStartOrEnd(firstClick.element.attr('value'));
            var secondValue = parseRangeStartOrEnd(secondClick.element.attr('value'));

            if ( areBothClicksNone() ) {

                var timeDiff = presenter.configuration.mouseData.clicks[1].time - presenter.configuration.mouseData.clicks[0].time;

                if ( timeDiff < 250 && timeDiff > 0 ) {

                    newRange = {
                        start: createRangeElement(firstClick.element, firstValue, true),
                        end: createRangeElement(firstClick.element, firstValue, true)
                    };
                    setRangeValues(newRange, true);
                    presenter.configuration.drawnRangesData.ranges.push(newRange);

                } else {

                    if ( firstValue > secondValue ) {

                        newRange = {
                            start: createRangeElement(secondClick.element, secondValue, true),
                            end: createRangeElement(firstClick.element, firstValue, true)
                        };

                        removeRangesBetweenRange(newRange);
                        drawRanges([newRange]);

                    } else if ( firstValue < secondValue ) {

                        newRange = {
                            start: createRangeElement(firstClick.element, firstValue, true),
                            end: createRangeElement(secondClick.element, secondValue, true)
                        };


                        removeRangesBetweenRange(newRange);
                        drawRanges([newRange]);

                    } else {

                        var rangeImage = firstClick.element.parent().find('.rangeImage');

                        if ( rangeImage.hasClass('include') ) {
                            rangeImage.remove();
                        } else {
                            rangeImage.removeClass('exclude');
                            rangeImage.addClass('include');
                        }

                    }
                }

                presenter.configuration.mouseData.clicks = [];

            }

            else if ( isFirstClickNoneAndSecondNotNone() ) {

                if ( firstValue >  secondValue) {

                    newRange = {
                        start: createRangeElement(secondClick.element, secondValue, true),
                        end: createRangeElement(firstClick.element, firstValue, true)
                    };

                } else if ( firstValue < secondValue ) {

                    newRange = {
                        start: createRangeElement(firstClick.element, firstValue, true),
                        end: createRangeElement(secondClick.element, secondValue, true)
                    };

                }

                joinRanges([newRange, presenter.configuration.mouseData.clickedRanges[0]]);

                presenter.configuration.mouseData.clicks = [];

            }

            else if ( isFirstStartOrEndAndSecondMiddleClicked() ) {

                var clickedRange = presenter.configuration.mouseData.clickedRanges[0];

                if ( firstClick.position == presenter.CLICKED_POSITION.START ) {

                    newRange = {
                        start: createRangeElement( secondClick.element, secondValue, firstClick.element.parent().find('.rangeImage').hasClass('include') ),
                        end: createRangeElement( clickedRange.end.element, clickedRange.end.value, clickedRange.end.include )
                    };

                } else if ( firstClick.position == presenter.CLICKED_POSITION.END ) {

                    newRange = {
                        end: createRangeElement( secondClick.element, secondValue, firstClick.element.parent().find('.rangeImage').hasClass('include') ),
                        start: createRangeElement( clickedRange.start.element, clickedRange.start.value, clickedRange.start.include )
                    };

                }

                removeRange(clickedRange, true);
                drawRanges([newRange]);

                presenter.configuration.mouseData.clicks = [];

            }

            else if ( isFirstStartOrEndAndSecondNoneClicked() ) {

                if ( firstValue > secondValue ) {

                    newRange = {
                        start: createRangeElement(secondClick.element, secondValue, true),
                        end: createRangeElement(firstClick.element, firstValue, true)
                    };

                    joinRanges( [newRange, getRangeByValue( firstValue )] );

                } else if ( firstValue < secondValue ) {

                    newRange = {
                        start: createRangeElement(firstClick.element, firstValue, true ),
                        end: createRangeElement(secondClick.element, secondValue, true )
                    };

                    joinRanges( [newRange, getRangeByValue( firstValue )] );

                }

                presenter.configuration.mouseData.clicks = [];

            }

            else if ( isTheSameRangeEndOrStartClickedInBothClicks() ) {

                var imageWrapper = firstClick.element.parent().find('.rangeImage');
                var shouldInclude = !imageWrapper.hasClass('include');
                var index = presenter.configuration.drawnRangesData.ranges.indexOf(presenter.configuration.mouseData.clickedRanges[0]);

                if ( shouldInclude ) {

                    if ( presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.START ) {

                        presenter.configuration.drawnRangesData.ranges[index].start.include = shouldInclude;

                    } else if ( presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.END ) {

                        presenter.configuration.drawnRangesData.ranges[index].end.include = shouldInclude;

                    }

                    toggleIncludeImage( imageWrapper, shouldInclude );

                } else {

                    removeRange( presenter.configuration.drawnRangesData.ranges[index], true );
                    imageWrapper.remove();

                }

                presenter.$view.find('.currentSelectedRange').removeClass('currentSelectedRange');

                presenter.configuration.mouseData.clicks = [];

            }

            else if ( isBothClicksTheSameRangeStartOrEnd() ) {

                var firstClickRange = getRangeByValue( firstValue );
                var secondClickRange = getRangeByValue( secondValue );

                if ( compareRanges(firstClickRange, secondClickRange) ) {
                    removeRange(firstClickRange, true);

                } else {
                    joinRanges([ getRangeByValue( firstValue ), getRangeByValue( secondValue ) ]);

                }

                presenter.configuration.mouseData.clicks = [];

            }

        }

    }

    function removeRangesBetweenRange(range) {
        var currentRanges = [];
        currentRanges = currentRanges.concat(presenter.configuration.drawnRangesData.ranges);

        for( var i = 0; i < currentRanges.length; i++) {
            var drawnRange = currentRanges[i];
            var drawnStartValue = drawnRange.start.value;
            var drawnEndValue = drawnRange.end.value;

            if ( drawnStartValue == -Infinity ) {
                drawnStartValue = presenter.configuration.min;
            }

            if ( drawnEndValue == Infinity ) {
                drawnEndValue = presenter.configuration.max;
            }

            if ( range.start.value < drawnEndValue && range.end.value > drawnStartValue ) {
                removeRange(drawnRange, true);
            }
        }

    }

    function getRangeByValue(value) {
        value = parseRangeStartOrEnd(value);
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
        if (element.hasClass('clickArea')) {
            element = element.parent();
        }
        return {
            element: parseElement(element),
            value: parseRangeStartOrEnd(value),
            include: include
        }
    }

    presenter.isMouseAboveExistingRange = function( e ) {
        var value = parseRangeStartOrEnd($(e).attr('value'));
        return $.inArray( value, presenter.configuration.drawnRangesData.values ) >= 0;
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
            var isEndInfinity = isValueInfinity(endValue);
            var isStartInfinity = isValueInfinity(startValue);
            var startElement, endElement;

            if ( isStartInfinity ) {
                startElement = presenter.$view.find('.clickArea[value=' + presenter.configuration.min + ']').parent();
            } else {
                startElement = presenter.$view.find('.clickArea[value=' + startValue + ']').parent();
            }

            if ( isEndInfinity ) {
                endElement = presenter.$view.find('.clickArea[value=' + presenter.configuration.max + ']').parent();
            } else {
                endElement = presenter.$view.find('.clickArea[value=' + endValue + ']').parent();
            }

            var start = parseFloat($(startElement).css('left'));
            var end = parseFloat(endElement.css('left'));
            var difference = Math.abs(start - end);
            var range = $('<div></div>');

            if (!this.start.element || !this.end.element) {
                this.start.element = startElement;
                this.end.element = endElement;
            }

            range.addClass('selectedRange');

            if ( isStartInfinity && isEndInfinity ) {
                range.addClass(isStartInfinity ? 'infinityBoth' : '');
            } else {
                range.addClass(isStartInfinity ? 'infinityLeft' : '');
                range.addClass(isEndInfinity ? 'infinityRight' : '');
            }
            range.css('width', difference + 2 + 'px');
            startElement.append(range);

            if (start > end) {
                range.css('left', - (difference) + 'px');
            }

            presenter.configuration.drawnRangesData.ranges.push(this);

            setRangeValues(this, true);

            addEndRangeImages(this, startElement, endElement, isStartInfinity, isEndInfinity);

        });
    }

    function isValueInfinity(value) {
        return ( value == -Infinity
            || value == Infinity )
    }

    function setRangeValues(range, shouldAddToDrawn) {
        range.values = [];
        var startValue = Math.min(range.start.value, range.end.value);
        var endValue = Math.max(range.start.value, range.end.value);

        if (startValue == -Infinity) {
            range.values.push(-Infinity);
            if (shouldAddToDrawn) {
                presenter.configuration.drawnRangesData.values.push(-Infinity);
            }
            startValue = presenter.configuration.min;
        }

        if (endValue == Infinity) {
            range.values.push(Infinity);
            if (shouldAddToDrawn) {
                presenter.configuration.drawnRangesData.values.push(Infinity);
            }
            endValue = presenter.configuration.max;
        }

        for ( var i = startValue; i <= endValue; i++ ) {
            range.values.push(i);

            if (shouldAddToDrawn) {
                presenter.configuration.drawnRangesData.values.push(i);
            }
        }
    }

    function addEndRangeImages(range, startElement, endElement, isStartInfinity, isEndInfinity) {

        if ( !isEndInfinity ) {
            addEndRangeImage( endElement, range.end.include );
        } else {
            addInfinityBox( startElement );
        }

        if ( startElement[0] != endElement[0] ) {

            if ( !isStartInfinity ) {
                addEndRangeImage( startElement, range.start.include );
            } else {
                addInfinityBox( startElement );
            }

        }
    }

    function addInfinityBox( element ) {
        // TODO
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
                var innerHeight = presenter.$view.find('.inner').height();
                var yAxis = presenter.$view.find('.y-axis');
                var xAxis = presenter.$view.find('.x-axis');

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
            presenter.$view.find('.x-axis').append(stepLine);
        }
    };

    function moveYAxisClickArea() {
        var yAxisClickArea = $('.y-axis .clickArea');
        yAxisClickArea.css('top', ($('.y-axis').height() / 2) - 50 + 'px');
    }

    function checkIsMinLowerThanMax(min, max) {
        var parsedMin = parseRangeStartOrEnd(min);
        var parsedMax = parseRangeStartOrEnd(max);
        return parsedMin < parsedMax;
    }

    presenter.getState = function () {
        $.each(presenter.configuration.drawnRangesData.ranges, function() {
            this.start.element = null;
            this.end.element = null;
        });

        return JSON.stringify({
            drawnRangesData: presenter.configuration.drawnRangesData,
            isVisible: presenter.configuration.isVisible
        });
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

        presenter.configuration.isCurrentlyVisible = state.isVisible;
        presenter.setVisibility(state.isVisible);
    };

    presenter.reset = function() {
        var rangesToRemove = [];
        rangesToRemove = rangesToRemove.concat(presenter.configuration.drawnRangesData.ranges);

        $.each(rangesToRemove, function() {
            removeRange(this, true);
        });

        drawRanges(presenter.configuration.shouldDrawRanges);

        presenter.configuration.mouseData.clicks = [];

        presenter.configuration.isCurrentlyVisible = presenter.configuration.isVisibleByDefault;
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
    };

    presenter.setShowErrorsMode = function() {
        presenter.configuration.isShowErrorsMode = true;
        var validated = validateDrawnRanges();

        $.each(validated.correct, function() {
            this.start.element.find('.selectedRange').addClass('correct');
        });

        $.each(validated.wrong, function() {
            this.start.element.find('.selectedRange').addClass('wrong');
        });

    };

    presenter.setWorkMode = function() {
        presenter.configuration.isShowErrorsMode = false;

        presenter.$view.find('.correct').removeClass('correct');
        presenter.$view.find('.wrong').removeClass('wrong');
    };

    presenter.getScore = function() {
        var validated = validateDrawnRanges();
        return validated.correct.length;
    };

    presenter.getMaxScore = function () {
        return presenter.configuration.otherRanges.length + presenter.configuration.shouldDrawRanges.length;
    };

    presenter.getErrorCount = function () {
        var validated = validateDrawnRanges();
        return presenter.configuration.otherRanges.length - validated.correct.length;
    };

    function validateDrawnRanges() {
        var correctSelectedRanges = [];
        var wrongSelectedRanges = [];
        var ranges = presenter.configuration.otherRanges.concat(presenter.configuration.shouldDrawRanges);

        $.each( presenter.configuration.drawnRangesData.ranges, function() {
            var drawnRange = this;

            $.each( ranges, function() {
                setRangeValues(this, false);

                if (compareRanges(this, drawnRange)) {
                    correctSelectedRanges.push(drawnRange);
                }
            });

            if (correctSelectedRanges.indexOf(drawnRange) == -1) {
                wrongSelectedRanges.push(drawnRange)
            }
        });

        return  {
            correct: correctSelectedRanges,
            wrong: wrongSelectedRanges
        }
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

    function parseElement( element ) {
        switch (element) {
            case element.find('.infinity-left').length > 0:
                return presenter.$view.find('.clickArea[value="' + presenter.configuration.min + '"]').parent();
            case element.find('.infinity-right').length > 0:
                return presenter.$view.find('.clickArea[value="' + presenter.configuration.max + '"]').parent();
            default:
                return element;
        }
    }

    function parseRangeStartOrEnd (value) {

        if ( value == '-INF' || value == -Infinity ) {
            return -Infinity;
        }
        else if ( value == 'INF' || value == Infinity ) {
            return Infinity;
        }
        else {
            return parseInt(value, 10);
        }
    }

    presenter.validateRanges = function (ranges) {
        var rangesList = Helpers.splitLines(ranges);
        var rangesPattern = /(\(|<){1}[(?P \d|(-){1}INF)-]+,[(?P \d|(-){1}INF)-]+(\)|>){1},[ ]*(0|1){1}/i; // matches i.e. (1, 0), 0 or <2, 15), 1, <-INF, 10)
        var validatedShouldDrawRanges = [];
        var validatedOtherRanges = [];
        var isError = false,
            errorCode = '';

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
            var min = parseRangeStartOrEnd(onlyNumbers[0]);
            var max = parseRangeStartOrEnd(onlyNumbers[1]);
            var minInclude = brackets[0] == '<' || min == -Infinity;
            var maxInclude = brackets[1] == '>' || max == Infinity;
            var shouldDrawRange = onlyNumbers[2] == '1';

            if ((min > max) ||
                (min == Infinity && max == Infinity) ||
                (min == -Infinity && max == -Infinity)
                ) {
                isError = true;
                errorCode = 'MIN/MAX01';

                return false; // Breaks jQuery.each loop
            }

            var validatedRange = {
                start: { value : min, include: minInclude, element: null },
                end: { value: max, include: maxInclude, element: null }
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

        var ranges = presenter.validateRanges(model['Ranges']);

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
        var isVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);

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
            'isShowErrorsMode' : false,
            isCurrentlyVisible: isVisible,
            isVisibleByDefault: isVisible
        }
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'drawRange' : presenter.drawRange
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.children('div').css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function () {
        presenter.configuration.isCurrentlyVisible = true;
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        presenter.configuration.isCurrentlyVisible = false;
        presenter.setVisibility(false);
    };

    presenter.drawRange = function (rangeList) {
        var rangeString = rangeList.join('\n\r');
        var validatedRanges = presenter.validateRanges(rangeString);

        $.each(validatedRanges.shouldDrawRanges, function() {
            removeRangesBetweenRange(this);
        });

        drawRanges(validatedRanges.shouldDrawRanges);

    };

    return presenter;
}       