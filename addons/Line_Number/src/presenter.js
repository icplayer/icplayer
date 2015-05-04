function AddonLine_Number_create() {
    /*
        KNOWN ISSUES:
            PROPERTIES:
                Axis X Values:
                    0* - due to backward compatybility it should be treaten as 1*

            (04.13.2015) CLICK & DRAWING RANGES LOGIC:
                Due to logic of drawing ranges, presenter.configuration.max should be set before creating steps as a max
                value from field values. Changing this logic will break user click logic, which will not draw range to
                infinity right.


     */

    var presenter = function () {};

    var eventBus,
        playerController;

    presenter.configuration = {};

    presenter.singleDot = {
        value: -1,
        element: null
    };

    presenter.maxElement = function (array) {
        if (array.length == 0) {
            throw "Empty array";
        }

        var max = array[0];
        array.forEach(function (elem){
            if (elem > max) {
                max = elem;
            }
        });

        return max;
    };

    presenter.errorCodes = {
        'MIN01' : 'Min value cannot be empty.',
        'MIN02' : 'Min value must be a number.',
        'MIN03' : 'Min value does not fit the separator.',
        'MAX01' : 'Max value cannot be empty.',
        'MAX02' : 'Max value must be a number',
        'MAX03' : 'Max value does not fit the separator.',
        'MAX04' : 'Max value must be within xAxisValues. Suggested value: {{lastValue}} or {{lastValuePlusStep}}.',
        'MIN/MAX01' : 'Min value cannot be greater than Max value.',
        'RAN01' : 'One or more ranges are invalid.',
        'RAN02' : 'One or more ranges are invalid. Please make sure, that all ranges start/end can be displayed on X axis.',
        'STEP01' : 'The value in Step property is invalid.',
        'STEP02' : 'The value in Step does not fit the separator.',
        'STEP03' : 'The value in step property have to be greater than 0',
        'VAL01' : 'One or more X axis values are invalid.',
        'VAL02' : 'One or more X axis do not fit the separator.',
        'OOR01' : 'Can not resolve which range is currently selected.',
        'DSE01' : 'Semicolon is a reserved symbol.',
        'AXV_01': "Axis X cyclic values have to be greater or equal than 0.",
        'AXV_02': "Axis X fixed values have to be greater or equal than Min.",
        'AXV_03': "Axis X fixed values have to be lower or equal than Max.",
        'AXV_04': "Axis X Values property can have only number values.",
        'AXV_05': "Axis X Valuese property cant have duplicates."
    };

    presenter.CLICKED_POSITION = {
        START: 1,
        MIDDLE: 2,
        END: 3,
        NONE: 4
    };

    presenter.run = function(view, model) {
        presenter.presenterLogic(view, model, false);

        eventBus.addEventListener('ShowAnswers', this);
        eventBus.addEventListener('HideAnswers', this);
    };

    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.removeZIndexes = function () {
        var selector = '.outer .infinity-left, .outer .infinity-right, .x-axis, .rangeImage, .addon_Line_Number .currentMousePosition, .clickArea, .selectedRange';
        presenter.$view.find(selector).css('z-index', '0');
    };

    presenter.presenterLogic = function (view, model, isPreview) {
        presenter.$view = $(view);
        presenter.$view.disableSelection();
        presenter.configuration = presenter.validateModel(model);

        presenter.configuration.isPreview = isPreview;

        if ( presenter.configuration.isError ) {
            return DOMOperationsUtils.showErrorMessage(presenter.$view, presenter.errorCodes, presenter.configuration.errorCode);
        }

        presenter.createSteps();

        if ( !isPreview && !presenter.configuration.isDisabled ) {
            presenter.bindInfinityAreas();
        }

        presenter.drawRanges(presenter.configuration.shouldDrawRanges);

        presenter.configuration.isInitialDraw = false;

        if ( !presenter.configuration.isVisibleByDefault ) {
            presenter.hide();
        }

        if ( isPreview ) {
            // z-index in Editor breaks down properties popups
            presenter.removeZIndexes();
        }
    };

    presenter.bindInfinityAreas = function() {
        var infinityLeft = presenter.$view.find('.infinity-left');
        var infinityRight = presenter.$view.find('.infinity-right');

        if (MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            infinityLeft.on('touchstart', function (e) {
                e.stopPropagation();
                e.preventDefault();

                presenter.configuration.touchData.lastEvent = e;
            });

            infinityLeft.on('touchend', function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (presenter.configuration.touchData.lastEvent.type != e.type) {
                    var eventData = event.touches[0] || event.changedTouches[0];
                    clickLogic(eventData.target);
                }

            });
        }
        else {
            infinityLeft.on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                clickLogic($(e.target));
            });
        }

        infinityLeft.hover(function() {
            infinityLeft.addClass('infinity-hover');
        }, function() {
            infinityLeft.removeClass('infinity-hover');
        });

        if (MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            infinityRight.on('touchstart', function (e) {
                e.stopPropagation();
                e.preventDefault();
                presenter.configuration.touchData.lastEvent = e;
            });

            infinityRight.on('touchend', function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (presenter.configuration.touchData.lastEvent.type != e.type) {
                    var eventData = event.touches[0] || event.changedTouches[0];
                    clickLogic(eventData.target);
                }
            });
        }
        else {
            infinityRight.on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                clickLogic($(e.target));
            });
        }

        infinityRight.hover(function () {
            infinityRight.addClass('infinity-hover');
        }, function () {
            infinityRight.removeClass('infinity-hover');
        });
    };

    function calculateStepWidth(xAxisValues) {
        var xAxisWidth = presenter.$view.find('.x-axis').width();
        return xAxisWidth / (xAxisValues.length + 1);
    }

    function parseValueWithStepPrecision(value) {
        return parseFloat(value.toFixed(presenter.configuration.step.precision));
    }

    function setClickedRanges(e) {
        var ranges = presenter.configuration.drawnRangesData.ranges,
            value = parseRangeStartOrEnd($(e).attr('value'), presenter.configuration.separator);

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
        } else if ( $(e).attr('value') == 'INF' ) {
            return presenter.CLICKED_POSITION.END;
        } else if (range.start.element[0] == $(e).parent()[0]) {
            return presenter.CLICKED_POSITION.START;
        } else if (range.end.element[0] == $(e).parent()[0]) {
            return presenter.CLICKED_POSITION.END;
        } else {
            return presenter.CLICKED_POSITION.MIDDLE;
        }
    }

    presenter.removeRange = function(range, removeIncludeImages) {
        getSelectedRange(range).remove();
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
            var value = parseRangeStartOrEnd(this, presenter.configuration.separator);
            var index = presenter.configuration.drawnRangesData.values.indexOf(value);
            presenter.configuration.drawnRangesData.values.splice(index, 1);
        });

    };

    function splitRange(range, e) {

        presenter.removeRange(range, false);
        var clickedArea = $(e);

        var firstRange = {
            'start' : range.start,
            'end' : createRangeElement(clickedArea, clickedArea.attr('value'), false)
        };

        var secondRange = {
            'start' : firstRange.end,
            'end' : range.end
        };

        presenter.drawRanges([firstRange, secondRange]);
    }

    function joinRanges(ranges) {
        var firstRange, secondRange;
        var min = 1000,
            max = -1000;

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
            presenter.removeRange(this, true);
        });

        var joinedRange = {
            'start' : firstRange.start,
            'end' : secondRange.end
        };

        removeRangesBetweenRange(joinedRange);

        presenter.drawRanges([joinedRange]);

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
            time: (new Date()).getTime()
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

        var width = presenter.configuration.stepWidth, left = - (presenter.configuration.stepWidth / 2) + 'px';

        if ( value == presenter.configuration.min || value == presenter.configuration.max ) {
            width = width / 2;
        }

        if ( value == presenter.configuration.min ) {
            left = 0;
        }

        if ( value == presenter.configuration.max ) {
            left = - width;
        }

        clickArea.css({
            'width' : width,
            'left' : left
        });

    }

    function bindClickAreaListeners(clickArea) {
        removeAllClickListeners();

        if (MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            clickArea.on('touchstart', function (e) {
                e.stopPropagation();
                e.preventDefault();

                presenter.configuration.touchData.lastEvent = e;
            });

            clickArea.on('touchend', function (e) {
                e.stopPropagation();
                e.preventDefault();

                if ( presenter.configuration.touchData.lastEvent.type != e.type ) {
                    var eventData = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] || e.originalEvent.targetTouches[0];
                    clickLogic(eventData.target);
                }
            });

            clickArea.on('click', function (e) {
                e.stopPropagation();
            });
        }
        else {
            clickArea.on('mouseleave', function (e) {
                e.stopPropagation();
                hideCurrentMousePosition();
            });

            clickArea.on('mouseenter', function (e) {
                e.stopPropagation();
                e.preventDefault();
                displayCurrentMousePosition($(e.target));
            });

            clickArea.on('contextmenu', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });

            clickArea.on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                clickLogic($(e.target));
            });
        }
    }

    function removeAllClickListeners() {
        var clickArea = presenter.$view.find('.clickArea');
        var infinityLeft = presenter.$view.find('.infinity-left');
        var infinityRight = presenter.$view.find('.infinity-right');
        var listeners = 'mouseleave mouseenter contextmenu touchstart touchend click';

        clickArea.off(listeners);
        infinityRight.off(listeners);
        infinityLeft.off(listeners);
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

    function areTwoClickedRanges() {
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
            && isClickedStartOrEnd()
            && isBothClicksTheSameRange()
    }

    function isFirstStartOrEndAndSecondNoneClicked() {
        return presenter.configuration.mouseData.clicks[1].position == presenter.CLICKED_POSITION.NONE
            && isClickedStartOrEnd();
    }

    // toggle include image when this situation happens
    function isTheSameRangeEndOrStartClickedInBothClicks() {
        return presenter.configuration.mouseData.clicks[0].position == presenter.configuration.mouseData.clicks[1].position
            && presenter.configuration.mouseData.clicks[0].element[0] == presenter.configuration.mouseData.clicks[1].element[0];
    }

    // this is when range should be deleted when both clicks were on the same range or joined when 1st/2nd click is on different range
    function isBothClicksTheSameRangeStartOrEnd() {
        return presenter.configuration.mouseData.clicks[0].element[0] != presenter.configuration.mouseData.clicks[1].element[0]
            && (presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.END
            || presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.START)
            && (presenter.configuration.mouseData.clicks[1].position == presenter.CLICKED_POSITION.END
            || presenter.configuration.mouseData.clicks[1].position == presenter.CLICKED_POSITION.START);
    }

    function isBothClicksTheSameRange() {
        var firstClickRange = getRangeByValue( presenter.configuration.mouseData.clicks[0].element.attr('value') );
        var secondClickRange = getRangeByValue( presenter.configuration.mouseData.clicks[1].element.attr('value') );
        return compareRanges(firstClickRange, secondClickRange);
    }

    function setCurrentClickedRange() {
        var first, second;

        if ( presenter.configuration.mouseData.twoClickedRangesCount == 1 ) {

            if ( presenter.configuration.mouseData.clickedRanges[0].start.value > presenter.configuration.mouseData.clickedRanges[1].start.value ) {
                first = presenter.configuration.mouseData.clickedRanges[1];
                second = presenter.configuration.mouseData.clickedRanges[0];
            } else {
                first = presenter.configuration.mouseData.clickedRanges[0];
                second = presenter.configuration.mouseData.clickedRanges[1];
            }
        } else {
            if ( presenter.configuration.mouseData.clickedRanges[0].start.value > presenter.configuration.mouseData.clickedRanges[1].start.value ) {
                first = presenter.configuration.mouseData.clickedRanges[0];
                second = presenter.configuration.mouseData.clickedRanges[1];
            } else {
                first = presenter.configuration.mouseData.clickedRanges[1];
                second = presenter.configuration.mouseData.clickedRanges[0];
            }
        }

        presenter.configuration.mouseData.clickedRanges = [first, second];
    }

    function resetClicks() {

        if ( presenter.configuration.notCurrentSelectedRange ) {
            if ( presenter.configuration.mouseData.twoClickedRangesCount == 1 ) {
                addEndRangeImage( presenter.configuration.notCurrentSelectedRange.start.element, false );
            } else if ( presenter.configuration.mouseData.twoClickedRangesCount == 2 ) {
                addEndRangeImage( presenter.configuration.notCurrentSelectedRange.end.element, false );
            }
        }

        presenter.$view.find('.currentSelectedRange').removeClass('currentSelectedRange');

        presenter.configuration.mouseData.clicks = [];
        presenter.configuration.mouseData.twoClickedRangesCount = 0;
        presenter.configuration.notCurrentSelectedRange = null;
    }

    function getSelectedRange(range) {
        var selectedRange;

        if ( isValueInfinity(range.start.value) ) {
            selectedRange = presenter.$view.find('.clickArea[value="' + presenter.configuration.min + '"]').parent().find('.selectedRange');
        } else {
            selectedRange = range.start.element.find('.selectedRange');
        }

        return selectedRange;
    }

    function isLineNumberDisabled () {
        return ((presenter.configuration.isActivity && presenter.configuration.isShowErrorsMode) ||
                 presenter.configuration.isDisabled);
    }

    function clickLogic(eventTarget) {
        if (isLineNumberDisabled() || presenter.isShowAnswersActive) {
            return;
        }

        if (presenter.configuration.mouseData.twoClickedRangesCount > 3) {
            presenter.configuration.mouseData.twoClickedRangesCount = 0;
        }

        setClickedRanges(eventTarget);
        setClicks(eventTarget);

        var firstClick = presenter.configuration.mouseData.clicks[0];

        if (isFirstClick()) {
            if (firstClick.position == presenter.CLICKED_POSITION.NONE) {
                var value = parseRangeStartOrEnd(presenter.configuration.mouseData.clicks[0].element.attr('value'),
                                                 presenter.configuration.separator);
                presenter.singleDot = {
                    value: value,
                    element: firstClick.element
                };

                if (!isValueInfinity(value)) {
                    addEndRangeImage(presenter.configuration.mouseData.clicks[0].element.parent(), true);
                }
            } else if (areTwoClickedRanges()) {
                presenter.configuration.mouseData.twoClickedRangesCount++;

                if (presenter.configuration.mouseData.twoClickedRangesCount == 1) {
                    var selectedRange = getSelectedRange(presenter.configuration.mouseData.clickedRanges[0]);
                    selectedRange.addClass('currentSelectedRange');
                }

                presenter.configuration.notCurrentSelectedRange = presenter.configuration.mouseData.clickedRanges[1];
            } else if (isClickedStartOrEnd()) {
                var clickedRange = presenter.configuration.mouseData.clickedRanges[0],
                    selectedRange = getSelectedRange(clickedRange);

                selectedRange.addClass('currentSelectedRange');
            } else if (isClickedMiddle()) {
                splitRange(presenter.configuration.mouseData.clickedRanges[0], eventTarget);
                resetClicks();
            }
        } else if (isSecondClick()) {
            presenter.singleDot = {
                value: -1,
                element: null
            };
            var secondClick = presenter.configuration.mouseData.clicks[1];
            var firstValue = parseRangeStartOrEnd(firstClick.element.attr('value'), presenter.configuration.separator);
            var secondValue = parseRangeStartOrEnd(secondClick.element.attr('value'), presenter.configuration.separator);
            var newRange;

            if (areBothClicksNone()) {
                var timeDiff = presenter.configuration.mouseData.clicks[1].time - presenter.configuration.mouseData.clicks[0].time;
                if (timeDiff < 250 && timeDiff > 0) {
                    newRange = {
                        start: createRangeElement(firstClick.element, firstValue, true),
                        end: createRangeElement(firstClick.element, firstValue, true)
                    };
                    setRangeValues(newRange, true);
                    addToDrawnRanges(newRange);
                } else {
                    if (firstValue > secondValue) {
                        newRange = {
                            start: createRangeElement(secondClick.element, secondValue, true),
                            end: createRangeElement(firstClick.element, firstValue, true)
                        };
                        removeRangesBetweenRange(newRange);
                        presenter.drawRanges([newRange]);
                    } else if (firstValue < secondValue) {
                        newRange = {
                            start: createRangeElement(firstClick.element, firstValue, true),
                            end: createRangeElement(secondClick.element, secondValue, true)
                        };
                        removeRangesBetweenRange(newRange);
                        presenter.drawRanges([newRange]);
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
                resetClicks();

            } else if (isFirstClickNoneAndSecondNotNone()) {
                if (firstValue >  secondValue) {
                    newRange = {
                        start: createRangeElement(secondClick.element, secondValue, true),
                        end: createRangeElement(firstClick.element, firstValue, true)
                    };
                } else if (firstValue < secondValue) {
                    newRange = {
                        start: createRangeElement(firstClick.element, firstValue, true),
                        end: createRangeElement(secondClick.element, secondValue, true)
                    };
                }
                joinRanges([newRange, presenter.configuration.mouseData.clickedRanges[0]]);
                resetClicks();

            } else if (isFirstStartOrEndAndSecondMiddleClicked()) {
                var clickedRange = presenter.configuration.mouseData.clickedRanges[0];

                if (firstClick.position == presenter.CLICKED_POSITION.START) {
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
                presenter.removeRange(clickedRange, true);
                presenter.drawRanges([newRange]);
                resetClicks();

            } else if (areTwoClickedRanges()) {
                presenter.configuration.mouseData.twoClickedRangesCount++;

                if (presenter.configuration.mouseData.twoClickedRangesCount == 2) {
                    var currentSelectedRange = getSelectedRange(presenter.configuration.mouseData.clickedRanges[0]);
                    var selectedRange = getSelectedRange(presenter.configuration.mouseData.clickedRanges[1]);
                    selectedRange.addClass('currentSelectedRange');
                    currentSelectedRange.removeClass('currentSelectedRange');
                    presenter.configuration.mouseData.clicks = presenter.configuration.mouseData.clicks.slice(0, 1);
                    presenter.configuration.mouseData.clicks[0].position = presenter.CLICKED_POSITION.START;
                    presenter.configuration.notCurrentSelectedRange = presenter.configuration.mouseData.clickedRanges[0];
                } else if (presenter.configuration.mouseData.twoClickedRangesCount == 3) {
                    joinRanges( presenter.configuration.mouseData.clickedRanges );
                    resetClicks();
                } else {
                    presenter.removeRange(getRangeByValue( firstValue ), true);
                    addEndRangeImage(secondClick.element.parent(), false);
                    resetClicks();
                }

                setCurrentClickedRange();

            } else if ( isFirstStartOrEndAndSecondNoneClicked() ) {
                if ( firstValue > secondValue ) {
                    newRange = {
                        start: createRangeElement(secondClick.element, secondValue, firstClick.element.parent().find('.rangeImage').hasClass('include')),
                        end: createRangeElement(firstClick.element, firstValue, firstClick.element.parent().find('.rangeImage').hasClass('include'))
                    };

                    joinRanges( [newRange, getRangeByValue( firstValue )] );
                } else if ( firstValue < secondValue ) {
                    newRange = {
                        start: createRangeElement(firstClick.element, firstValue, firstClick.element.parent().find('.rangeImage').hasClass('include') ),
                        end: createRangeElement(secondClick.element, secondValue, firstClick.element.parent().find('.rangeImage').hasClass('include') )
                    };

                    joinRanges( [newRange, getRangeByValue( firstValue )] );
                }

                resetClicks();

            } else if ( isTheSameRangeEndOrStartClickedInBothClicks() ) {
                var imageWrapper = firstClick.element.parent().find('.rangeImage');
                var shouldInclude = !imageWrapper.hasClass('include');
                var index = presenter.configuration.drawnRangesData.ranges.indexOf(presenter.configuration.mouseData.clickedRanges[0]);

                if ( presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.START ) {
                    presenter.configuration.drawnRangesData.ranges[index].start.include = shouldInclude;
                } else if ( presenter.configuration.mouseData.clicks[0].position == presenter.CLICKED_POSITION.END ) {
                    presenter.configuration.drawnRangesData.ranges[index].end.include = shouldInclude;
                }

                if (!(firstClick.element.hasClass('infinity-right') || firstClick.element.hasClass('infinity-left'))) {
                    toggleIncludeImage( imageWrapper, shouldInclude );
                }

                if ( presenter.configuration.drawnRangesData.ranges[index].values.length == 1 ) {
                    presenter.removeRange( presenter.configuration.drawnRangesData.ranges[index], true );
                    imageWrapper.remove();
                }

                presenter.$view.find('.currentSelectedRange').removeClass('currentSelectedRange');
                if (!(presenter.configuration.drawnRangesData.ranges[index] === undefined) && !presenter.isShowAnswersActive) {
                    var rangeString = presenter.convertRangeToString(presenter.configuration.drawnRangesData.ranges[index]);
                    var eventData = presenter.createEventData(rangeString, false, checkIsRangeCorrect(presenter.configuration.drawnRangesData.ranges[index]));

                    eventBus.sendEvent('ValueChanged', eventData);
                }

                if ( presenter.allRangesCorrect() && !presenter.isShowAnswersActive) {
                    var eventData = presenter.createAllOKEventData();
                    eventBus.sendEvent('ValueChanged', eventData);
                }

                resetClicks();

            } else if (isBothClicksTheSameRangeStartOrEnd()) {
                var firstClickRange = getRangeByValue( firstValue );
                var secondClickRange = getRangeByValue( secondValue );

                if ( compareRanges(firstClickRange, secondClickRange)) {
                    presenter.removeRange(firstClickRange, true);

                    var rangeString = presenter.convertRangeToString(firstClickRange);
                    var eventData = presenter.createEventData(rangeString, true, !checkIsRangeCorrect(firstClickRange));
                    eventBus.sendEvent('ValueChanged', eventData);

                    if ( presenter.allRangesCorrect() ) {
                        var eventData = presenter.createAllOKEventData();
                        eventBus.sendEvent('ValueChanged', eventData);
                    }
                } else {
                    joinRanges([ getRangeByValue( firstValue ), getRangeByValue( secondValue ) ]);
                }
                resetClicks();

            } else {
                resetClicks();
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
                presenter.removeRange(drawnRange, true);
            }
        }

    }

    function getRangeByValue(value) {
        value = parseRangeStartOrEnd(value, presenter.configuration.separator);
        var ranges = [];

        $.each(presenter.configuration.drawnRangesData.ranges, function() {
            if ( this.values.indexOf(value) >= 0 ) {
                ranges.push(this);
            }

            return true;
        });

        if (ranges.length == 2) {

            if (presenter.configuration.mouseData.twoClickedRangesCount == 1) {

                return ranges[0];

            } else if (presenter.configuration.mouseData.twoClickedRangesCount == 2) {

                return ranges[1];

            }

        } else if (ranges.length == 1) {

            return ranges[0];

        } else {

            presenter.configuration.isError = true;
            presenter.configuration.errorCode = 'OOR01';
            return null;

        }
    }

    function createRangeElement(element, value, include) {
        if (element.hasClass('clickArea')) {
            element = element.parent();
        }
        return {
            element: parseElement(element),
            value: parseRangeStartOrEnd(value, presenter.configuration.separator),
            include: include
        }
    }

    presenter.isMouseAboveExistingRange = function(e) {
        var value = parseRangeStartOrEnd($(e).attr('value'), presenter.configuration.separator);
        return $.inArray( value, presenter.configuration.drawnRangesData.values ) >= 0;
    };

    presenter.isValueInRange = function(value, range, takeExcludeIntoConsideration) {

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

    function getStartElement(isStartInfinity, startValue) {
        var startElement;

        if ( isStartInfinity ) {
            startElement = presenter.$view.find('.clickArea[value="' + presenter.configuration.min + '"]').parent();
        } else {
            startElement = presenter.$view.find('.clickArea[value="' + startValue + '"]').parent();
        }

        return startElement;
    }

    function getEndElement(isEndInfinity, endValue) {
        var endElement;

        if ( isEndInfinity ) {
            endElement = presenter.$view.find('.clickArea[value="' + presenter.configuration.max + '"]').parent();
        } else {
            endElement = presenter.$view.find('.clickArea[value="' + endValue + '"]').parent();
        }

        return endElement;
    }

    presenter.drawRanges = function(ranges) {

        $.each(ranges, function() {

            var startValue = Math.min(this.start.value, this.end.value);
            var endValue = Math.max(this.start.value, this.end.value);

            var isEndInfinity = isValueInfinity(endValue);
            var isStartInfinity = isValueInfinity(startValue);
            var startElement = getStartElement(isStartInfinity, startValue);
            var endElement = getEndElement(isEndInfinity, endValue);

            if (!this.start.element || !this.end.element) {
                this.start.element = startElement;
                this.end.element = endElement;
            }

            if ( startValue == endValue ) {
                setRangeValues(this, true);
                addToDrawnRanges(this);
                addEndRangeImage(endElement, true);

                // if start and end values are the same, that means range is a single point, so it should not draw range

                return false;
            }

            var start = parseFloat($(startElement).css('left'));
            var end = parseFloat(endElement.css('left'));
            var difference =  Math.abs(start - end);
            var range = $('<div></div>');

            range.addClass('selectedRange');

            addInfinityClass(isStartInfinity, isEndInfinity, range);

            // when range is ending in infinity then it should be wider because there is space between arrowhead and last step line
            // + 2 is because stepLine is 2 px width
            var width = calculateRangeWidth(isEndInfinity, isStartInfinity, difference);

            range.css('width', width);
            startElement.append(range);

            if (start > end) {
                range.css('left', - (difference) + 'px');
            }

            if (isStartInfinity) {
                range.css('left', -presenter.configuration.stepWidth + 'px');
            }

            addToDrawnRanges(this);

            setRangeValues(this, true);

            addEndRangeImages(this, startElement, endElement, isStartInfinity, isEndInfinity);

        });

    };

    function addInfinityClass(isStartInfinity, isEndInfinity, range) {
        if ( isStartInfinity && isEndInfinity ) {
            range.addClass(isStartInfinity ? 'infinityBoth' : '');
        } else {
            range.addClass(isStartInfinity ? 'infinityLeft' : '');
            range.addClass(isEndInfinity ? 'infinityRight' : '');
        }
    }

    function calculateRangeWidth(isEndInfinity, isStartInfinity, difference) {
        var width;

        if (isEndInfinity && isStartInfinity) {
            width = difference + (presenter.configuration.stepWidth * 2) + 'px';
        } else if (isEndInfinity) {
            width = (difference + presenter.configuration.stepWidth) + 'px';
        } else if (isStartInfinity) {
            width = (difference + presenter.configuration.stepWidth + 2) + 'px';
        } else {
            width = difference + 2 + 'px';
        }

        return width;
    }

    function isValueInfinity(value) {
        return ( value == -Infinity || value == Infinity )
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

        var stepValue = presenter.configuration.step;

        for ( var i = startValue; i <= endValue; i += stepValue ) {
            range.values.push(i);

            if (shouldAddToDrawn) {
                presenter.configuration.drawnRangesData.values.push(i);
            }
        }
    }

    function addEndRangeImages(range, startElement, endElement, isStartInfinity, isEndInfinity) {

        if ( !isEndInfinity ) {
            addEndRangeImage( endElement, range.end.include );
        }

        if ( !isStartInfinity ) {
            addEndRangeImage( startElement, range.start.include );
        }

    }

    function convertNdashToMinus(value) {
        return new String(value).replace('&ndash;', '-');
    }

    presenter.convertRangeToString = function( range ) {
        var startInclude = range.start.include ? '<' : '(';
        var endInclude = range.end.include ? '>' : ')';
        var startValue = isValueInfinity(range.start.value) ? '-INF' : convertNdashToMinus(range.start.value);
        var endValue = isValueInfinity(range.end.value) ? 'INF' : convertNdashToMinus(range.end.value);

        return startInclude +
            transformValueToDisplayVersion(startValue, false) +
            '; ' +
            transformValueToDisplayVersion(endValue, false) + endInclude;
    };

    function addEndRangeImage(element, include) {

        var currentImages = element.find('.rangeImage');
        currentImages.remove();

        var imageContainer = $('<div></div>');
        imageContainer.addClass('rangeImage');

        imageContainer.addClass(include ? 'include' : 'exclude');
        element.append(imageContainer);

        if(!presenter.hideAnswerClicked && !presenter.isShowAnswersActive){
            presenter.parentLeft = imageContainer.parent().css('left');
        }

        return imageContainer;
    }

    presenter.getElementPosition = function (value, axisXWidth, absoluteXRange, axisMin) {
        return ((value - axisMin) / absoluteXRange) * (axisXWidth - (presenter.configuration.stepWidth * 2));
    };

    function getStepText(element) {
        var $text = $('<div></div>');
        $text.addClass('stepText');
        $text.html( transformValueToDisplayVersion( element, true ) );
        $text.css('left', - ((element.toString())).length * (4) + 'px');

        return $text;
    }

    function getStepLine() {
        var $stepLine = $('<div></div>');
        $stepLine.addClass('stepLine');

        return $stepLine
    }

    function appendTextToStepLine($stepLine, element) {
        var $text = getStepText(element);

        $stepLine.append($text);
    }

    function appendStepLineToAxis($stepLine) {
        presenter.$view.find('.x-axis').append($stepLine);
    }

    function positionStepLineOnAxis($stepLine, element, configuration) {
        var position = presenter.getElementPosition(element, configuration.axisXWidth, configuration.axisAbsoluteRange,
                                                    configuration.axisMin);

        $stepLine.css({
            'left': (position + presenter.configuration.stepWidth) + 'px'
        });
    }

    function isMultiplicationOfCyclicValues (value) {
        function isMultiplication (element) { return (this % element) == 0;}

        var elementIndex = presenter.configuration.axisXFieldValues.indexOf(value);

        return (presenter.configuration.axisXValues.cyclicValues.filter(isMultiplication, elementIndex).length > 0);
    }

    function checkCustomValues(element) {
        var isCustomValue = false;

        isCustomValue = isMultiplicationOfCyclicValues(element);

        if(!isCustomValue) {
            isCustomValue = (presenter.configuration.axisXValues.fixedValues.indexOf(element) != -1)
        }

        return isCustomValue;
    }

    function shouldAppendTextToStepLine(element, configuration) {
        if (configuration.showAxisXValues) {
            if(configuration.customValuesSet) {
                return checkCustomValues(element)
            }

            return true;
        }

        return false;
    }

    presenter.createStep = function (element) {
        //function for array.forEach, this is binded to object with lineNumber configuration
        /*
            this = {axisXWidth: float, axisMin: float, axisAbsoluteRange: float}
        */

        var $stepLine = getStepLine();
        positionStepLineOnAxis($stepLine, element, this);

        if(shouldAppendTextToStepLine(element, this)) {
            appendTextToStepLine($stepLine, element);
        }

        createClickArea($stepLine, element);

        appendStepLineToAxis($stepLine);
    };

    presenter.createAxisXCustomValues = function () {
        var min = presenter.configuration.min;
        var max = presenter.configuration.max;

        var values = presenter.configuration.axisXValues.fixedValues.concat([]);
        var cyclicValues = presenter.configuration.axisXValues.cyclicValues;

        function createValues (element) {
            var precision = presenter.getNumberPrecision(element);
            var step = element;
            var values = [];

            for(var i = step; i <= max; i += step) {
                values.push(presenter.changeNumberToPrecision(i, precision));
            }

            for(i = step * -1; i >= min; i -= step ) {
                values.push(presenter.changeNumberToPrecision(i, precision));
            }

            return values;
        }

        cyclicValues = cyclicValues.map(createValues);
        for(var i = 0; i < cyclicValues.length; i++) {
            values = values.concat(cyclicValues[i]);
        }

        values = values.filter(function (element){
            if (this.indexOf(element) == -1) {
                this.push(element);
                return true;
            }

            return false;
        }, []);

        if(values.indexOf(0) == -1) values.push(0);

        return values;
    };

    presenter.getAxisConfigurationForCreatingSteps = function () {
        var configuration = {
            axisXWidth: presenter.$view.find('.x-axis').width(),
            axisMin: presenter.configuration.min,
            axisAbsoluteRange: presenter.configuration.max - presenter.configuration.min,
            showAxisXValues: presenter.configuration.showAxisXValues
        };

        if (presenter.configuration.isCustomAxisXValuesSet) {
            configuration.customValuesSet = presenter.configuration.isCustomAxisXValuesSet;
            configuration.customValues = presenter.createAxisXCustomValues();
        }

        return configuration;
    };

    presenter.setStepWidthInConfiguration = function () {
        presenter.configuration.stepWidth = calculateStepWidth(presenter.configuration.axisXFieldValues);
    };

    function setMaxValueInConfiguration () {
        presenter.configuration.max = presenter.maxElement(presenter.configuration.axisXFieldValues);//max()
    }

    presenter.setOnClickAreaListeners = function () {
        if (!presenter.configuration.isPreview && !presenter.configuration.isDisabled) {
            bindClickAreaListeners(presenter.$view.find('.clickArea'));
        }
    };

    presenter.createSteps = function () {
        setMaxValueInConfiguration();
        presenter.setStepWidthInConfiguration();

        presenter.configuration.axisXFieldValues.forEach(presenter.createStep, presenter.getAxisConfigurationForCreatingSteps());

        presenter.setOnClickAreaListeners();
    };

    function transformValueToDisplayVersion(value, shouldReplaceMinus) {
        var transformed = ('' + value).replace('.', presenter.configuration.separator);
        if (shouldReplaceMinus) {
            transformed = transformed.replace('-', '&ndash;');
        }

        return transformed;
    }

    function checkIsMinLowerThanMax(min, max) {
        var parsedMin = parseRangeStartOrEnd(min, presenter.configuration.separator);
        var parsedMax = parseRangeStartOrEnd(max, presenter.configuration.separator);
        return parsedMin < parsedMax;
    }

    presenter.getState = function () {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        $.each(presenter.configuration.drawnRangesData.ranges, function() {
            this.start.element = null;
            this.end.element = null;
        });

        return JSON.stringify({
            drawnRangesData: presenter.configuration.drawnRangesData,
            isVisible: presenter.configuration.isCurrentlyVisible,
            isDisabled: presenter.configuration.isDisabled
        }, function (key, value) {
            if (value === Infinity) return "Infinity";
            else if (value === -Infinity) return "-Infinity";
            else if (value !== value) return "NaN";
            else return value;
        });
    };

    presenter.redrawRanges = function (rangesToDraw) {
        $.each(rangesToDraw, function () {
            this.start.element = presenter.$view.find('.clickArea[value="' + this.start.value + '"]').parent();
            this.end.element = presenter.$view.find('.clickArea[value="' + this.end.value + '"]').parent();
        });

        $.each(presenter.configuration.shouldDrawRanges, function () {
            presenter.removeRange(this, true);
        });

        presenter.drawRanges(rangesToDraw);
    };

    presenter.setState = function (state) {
        if (ModelValidationUtils.isStringEmpty(state)) return;

        var parsedState = JSON.parse(state,
            function (key, value) {
                if (value === "Infinity") return Infinity;
                else if (value === "-Infinity") return -Infinity;
                else if (value === "NaN") return NaN;
                else return value;
            });

        presenter.redrawRanges(parsedState.drawnRangesData.ranges);

        presenter.configuration.isCurrentlyVisible = parsedState.isVisible;
        presenter.setVisibility(parsedState.isVisible);

        presenter.configuration.isDisabled = parsedState.isDisabled;
    };

    presenter.reset = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        var rangesToRemove = [].concat(presenter.configuration.drawnRangesData.ranges);

        $.each(rangesToRemove, function() {
            presenter.removeRange(this, true);
        });

        presenter.drawRanges(presenter.configuration.shouldDrawRanges);

        presenter.configuration.mouseData.clicks = [];

        presenter.configuration.isCurrentlyVisible = presenter.configuration.isVisibleByDefault;
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);

        presenter.configuration.isShowErrorsMode = false;
        presenter.configuration.isDisabled = presenter.configuration.isDisabledByDefault;

        // removing all single dots
        presenter.$view.find('.rangeImage').remove();
        presenter.leftShowAnswers = false;
        presenter.parentLeft = false;
    };

    presenter.setShowErrorsMode = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        if (presenter.configuration.isActivity && !presenter.configuration.isDisabled) {
            // change single dot to point on axis
            if (presenter.singleDot.value != -1) {
                var newRange = {
                    start: createRangeElement(presenter.singleDot.element, presenter.singleDot.value, true),
                    end: createRangeElement(presenter.singleDot.element, presenter.singleDot.value, true)
                };
                setRangeValues(newRange, true);
                addToDrawnRanges(newRange);
            }

            presenter.configuration.isShowErrorsMode = true;
            var validated = validateDrawnRanges();

            $.each(validated.correct, function() {
                getSelectedRange(this).addClass('correct');
                addCorrectnessClassToRangeEnds(this, 'correct');
            });

            $.each(validated.wrong, function() {
                getSelectedRange(this).addClass('wrong');
                addCorrectnessClassToRangeEnds(this, 'wrong');
            });

            if (presenter.configuration.mouseData.clicks.length > 0) {
                presenter.configuration.mouseData.clicks[0].element.parent().find('.rangeImage').remove();
            }

            resetClicks();
        }
    };

    function addCorrectnessClassToRangeEnds(range, includePrefix) {
        var startImage = range.start.element.find('.rangeImage ');
        var endImage = range.end.element.find('.rangeImage');

        if( startImage.hasClass('include') ) {
            startImage.removeClass('include');
            startImage.addClass(includePrefix + 'RangeInclude');
        } else {
            startImage.removeClass('exclude');
            startImage.addClass(includePrefix + 'RangeExclude');
        }

        if( endImage.hasClass('include') ) {
            endImage.removeClass('include');
            endImage.addClass(includePrefix + 'RangeInclude');
        } else {
            endImage.removeClass('exclude');
            endImage.addClass(includePrefix + 'RangeExclude');
        }
    }

    presenter.setWorkMode = function() {
        if ( presenter.configuration.isActivity && !presenter.configuration.isDisabled ) {
            presenter.configuration.isShowErrorsMode = false;

            presenter.$view.find('.correct').removeClass('correct');
            presenter.$view.find('.wrong').removeClass('wrong');
            presenter.$view.find('.correctRangeExclude, .wrongRangeExclude').removeClass('correctRangeExclude wrongRangeExclude').addClass('exclude');
            presenter.$view.find('.correctRangeInclude, .wrongRangeInclude').removeClass('correctRangeInclude wrongRangeInclude').addClass('include');
        }
    };

    presenter.getScore = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        resetClicks();

        if (!presenter.configuration.isActivity) {
            return 0;
        }

        var validated = validateDrawnRanges();
        return validated.correct.length;
    };

    presenter.getMaxScore = function () {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        if (!presenter.configuration.isActivity) {
            return 0;
        }

        return presenter.configuration.otherRanges.length + presenter.configuration.shouldDrawRanges.length;
    };

    presenter.getErrorCount = function () {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        if (!presenter.configuration.isActivity) {
            return 0;
        }

        var validated = validateDrawnRanges();
        return validated.wrong.length;
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

    function checkIsRangeCorrect( range ) {
        var ranges = presenter.configuration.otherRanges.concat(presenter.configuration.shouldDrawRanges);
        var isCorrect = false;

        setRangeValues(range, false);

        $.each( ranges, function() {
            setRangeValues(this, false);
            if ( compareRanges(this, range) ) {
                isCorrect = true;
                return false; // breaks each loop
            }
        });

        return isCorrect;
    }

    function addToDrawnRanges ( range ) {
        presenter.configuration.drawnRangesData.ranges.push( range );

        if ( !presenter.configuration.isPreview && !presenter.configuration.isInitialDraw && !presenter.isShowAnswersActive) {
            var rangeString = presenter.convertRangeToString(range);
            var isRangeCorrect = checkIsRangeCorrect(range);
            var eventData = presenter.createEventData(rangeString, false, isRangeCorrect);
            eventBus.sendEvent('ValueChanged', eventData);

            if ( presenter.allRangesCorrect() ) {
                var eventData = presenter.createAllOKEventData();
                eventBus.sendEvent('ValueChanged', eventData);
            }
        }
    }

    presenter.allRangesCorrect = function() {
        return presenter.getScore() - presenter.getMaxScore() == 0 && presenter.getErrorCount() == 0;
    };

    function compareRanges(rangeA, rangeB) {
        return (compareArray(rangeA.values, rangeB.values) && rangeA.start.include == rangeB.start.include && rangeA.end.include == rangeB.end.include)
    }

    function compareArray(arrA, arrB) {
        var i = arrA.length;
        if (i != arrB.length) return false;

        while ( i-- ) {
            if (arrA[i] !== arrB[i]) return false;
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

    function parseRangeStartOrEnd (value, separator) {

        if ( value == '-INF' || value == -Infinity ) {
            return -Infinity;
        }
        else if ( value == 'INF' || value == Infinity ) {
            return Infinity;
        }
        else {
            var parsedValue = presenter.parseValueWithSeparator(value, separator);
            return parseFloat( parsedValue );
        }
    }

    presenter.validateDecimalSeparator = function (decimalSeparator) {
        if ( ModelValidationUtils.isStringEmpty(decimalSeparator) ) {
            return {value: '.', isValid: true};
        }

        if ( $.trim(decimalSeparator) == ';' ) {
            return {value: null, isValid: false, errorCode: 'DSE01'};
        }

        return {value: decimalSeparator, isValid: true};
    };

    presenter.validateRanges = function (ranges, separator) {
        if (separator == undefined) {
            separator = '.';
        }

        var rangesList = Helpers.splitLines(ranges);
        separator = escapeRegexSpecialCharacters(separator);
        var rangesPattern = new RegExp('(\\(|<){1}[(?P \\d|(-){1}INF' + separator + ')-]+;[(?P \\d|(-){1}INF' + separator + ')-]+(\\)|>){1};[ ]*(0|1){1}', 'i'); // matches i.e. (1; 0); 0 or <2; 15); 1, <-INF; 10); 1, <1.5; 2.5); 0
//        var rangesPattern = /(\(|<){1}[(?P \d|(-){1}INF\.)-]+;[(?P \d|(-){1}INF\.)-]+(\)|>){1};[ ]*(0|1){1}/i;
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
            var onlyNumbers = onlyNumbersAndCommas.split(';');
            var min = parseRangeStartOrEnd(onlyNumbers[0], separator);
            var max = parseRangeStartOrEnd(onlyNumbers[1], separator);
            var minInclude = brackets[0] == '<' || min == -Infinity;
            var maxInclude = brackets[1] == '>' || max == Infinity;
            var shouldDrawRange = onlyNumbers[2] == '1';

            if ( (min > max)
                || (min == Infinity && max == Infinity)
                || (min == -Infinity && max == -Infinity) ) {

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
            isValid: true,
            isError: isError,
            errorCode: errorCode,
            shouldDrawRanges : validatedShouldDrawRanges,
            otherRanges : validatedOtherRanges
        };
    };

    presenter.validateRangesWithAxisXField = function (ranges, axisXFieldValues) {
        var allRanges = ranges.otherRanges.concat(ranges.shouldDrawRanges);


        function checkRange(range) {
            if ( (axisXFieldValues.indexOf(range.start.value) == -1 || axisXFieldValues.indexOf(range.end.value) == -1)
                && (!isValueInfinity(range.start.value) && !isValueInfinity(range.end.value) )) {

                presenter.configuration.isError = true;
                DOMOperationsUtils.showErrorMessage(presenter.$view, presenter.errorCodes, 'RAN02');

                return false;
            }

            return true;
        }

        if (!allRanges.every(checkRange)) {
            return presenter.getErrorObject("RAN02");
        }

        var lastElement = presenter.maxFromArray(axisXFieldValues);
        if ( axisXFieldValues.indexOf(lastElement) == -1 ) {
            presenter.configuration.isError = true;
            DOMOperationsUtils.showErrorMessage(presenter.$view, presenter.errorCodes, 'MAX04');
        }

        return {isValid: true, value: allRanges};
    };

    presenter.maxFromArray = function (array_of_numbers) {
        if (array_of_numbers.length == 0) {throw "ValueError: maxFromArray() arg is an empty array";}

        var max = array_of_numbers[0];

        for(var i = 0; i < array_of_numbers.length; i++){
            if (array_of_numbers[i] > max) {max = array_of_numbers[i];}
        }

        return max;
    };

    presenter.minFromArray = function (array_of_numbers) {
        if (array_of_numbers.length == 0) {throw "ValueError: minFromArray() arg is an empty array";}

        var min = array_of_numbers[0];

        for(var i = 0; i < array_of_numbers.length; i++){
            if (array_of_numbers[i] < min) {min = array_of_numbers[i];}
        }

        return min;
    };

    function escapeRegexSpecialCharacters(value) {
        return (value + '').replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // escape regex special characters
    }

    presenter.validateValueWithSeparator = function (value, separator) {
        var escapedSeparator = escapeRegexSpecialCharacters(separator);

        var pattern = new RegExp('^(-{0,1}\\d+)' + escapedSeparator + '{0,1}\\d*$', 'i');

        if ( pattern.test(value) ) {
            return {
                'isValid' : true,
                'value' : presenter.parseValueWithSeparator(value, separator),
                'precision' : getPrecision(value, separator)
            }
        } else {
            return {
                'isValid' : false,
                'value' : null
            }
        }
    };

    function getPrecision(value, separator) {
        var splitted = value.split(separator);
        if ( splitted.length == 1 ) {
            return 0;
        } else {
            return splitted[1].length;
        }
    }

    presenter.parseValueWithSeparator = function (value, separator) {
        return (value + '').replace(separator, '.');
    };

    presenter.getErrorObject = function (errorCode) {
        return {isValid: false, errorCode: errorCode, isError: true};
    };

    presenter.validateMin = function (model, separator) {
        if(ModelValidationUtils.isStringEmpty(model['Min'])) {
            return presenter.getErrorObject("MIN01");
        }

        var validatedMinWithSeparator = presenter.validateValueWithSeparator(model['Min'], separator);
        if(!validatedMinWithSeparator.isValid) {
            return presenter.getErrorObject("MIN03");
        }

        validatedMinWithSeparator = ModelValidationUtils.validateFloat( validatedMinWithSeparator.value );
        if ( !validatedMinWithSeparator.isValid) {
            return presenter.getErrorObject("MIN02");
        }


        return {isValid: true, value: validatedMinWithSeparator.parsedValue};
    };

    presenter.validateMax = function (model, separator) {
        if( ModelValidationUtils.isStringEmpty(model['Max']) ) {
            return presenter.getErrorObject("MAX01");
        }

        var validatedMaxWithSeparator = presenter.validateValueWithSeparator(model['Max'], separator);

        if(!validatedMaxWithSeparator.isValid) {
            return presenter.getErrorObject("MAX03");
        }

        validatedMaxWithSeparator = ModelValidationUtils.validateFloat( validatedMaxWithSeparator.value );
        if ( !validatedMaxWithSeparator.isValid ) {
            return presenter.getErrorObject("MAX02");
        }

        return {isValid: true, value: validatedMaxWithSeparator.parsedValue};
    };

    presenter.validateModel = function(model) {
        var separator = presenter.validateDecimalSeparator(model['Decimal Separator']);

        if (!separator.isValid) {
            return presenter.getErrorObject("DSE01");
        }

        var validatedMin = presenter.validateMin(model, separator.value);
        if ( !validatedMin.isValid ) {
            return validatedMin;
        }

        var validatedMax = presenter.validateMax(model, separator.value);
        if ( !validatedMax.isValid ) {
            return validatedMax;
        }

        if( !checkIsMinLowerThanMax(validatedMin.value, validatedMax.value) ) {
            return presenter.getErrorObject("MIN/MAX01");
        }

        var validatedStep = presenter.validateStep(model, separator, validatedMax.value, validatedMin.value);
        if (!validatedStep.isValid) {
            return validatedStep;
        }

        var axisXFieldValues = presenter.createAxisXFieldValues(validatedMin.value, validatedMax.value, validatedStep.value);

        var validatedRanges = presenter.validateRanges(model["Ranges"], separator.value);
        if(!validatedRanges.isValid) {
            return validatedRanges;
        }

        var validatedRangesWithAxisXField = presenter.validateRangesWithAxisXField(validatedRanges, axisXFieldValues);
        if (!validatedRangesWithAxisXField.isValid) {
            return validatedRangesWithAxisXField;
        }

        var validatedIsActivity = !ModelValidationUtils.validateBoolean(model['Not Activity']);

        var addonConfiguration = {
            isDecimalSeparatorSet: !ModelValidationUtils.isStringEmpty(separator.value),
            decimalSeparator: separator.value,
            max: validatedMax.value,
            min: validatedMin.value
        };

        var validatedAxisXValues = presenter.validateAxisXValues(model, addonConfiguration);

        if(!validatedAxisXValues.isValid) {
            return validatedAxisXValues;
        }

        var isVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);
        var isDisabled = ModelValidationUtils.validateBoolean(model['Disable']);

        if (isDisabled) {
            presenter.$view.find('.outer').addClass('disable');
        }

        return {
            isValid: true,
            isError : false,
            min : validatedMin.value,
            max : validatedMax.value,
            shouldDrawRanges : validatedRanges.shouldDrawRanges,
            otherRanges : validatedRanges.otherRanges,
            isActivity : validatedIsActivity,
            step : validatedStep.value,
            showAxisXValues : ModelValidationUtils.validateBoolean(model['Show Axis X Values']),
            axisXValues : validatedAxisXValues.value,
            mouseData : {
                clickedRanges : [],
                clicks : [],
                twoClickedRangesCount : 0
            },
            drawnRangesData : {
                isDrawn : false,
                ranges : [],
                values : []
            },
            touchData : {
                lastEvent : null
            },
            isShowErrorsMode : false,
            isCurrentlyVisible: isVisible,
            isVisibleByDefault: isVisible,
            notCurrentSelectedRange : null,
            addonID : model['ID'],
            isInitialDraw : true,
            isDisabled: isDisabled,
            isDisabledByDefault: isDisabled,
            separator: separator.value,
            axisXFieldValues: axisXFieldValues,
            allRanges: validatedRangesWithAxisXField.value,
            isCustomAxisXValuesSet: validatedAxisXValues.isCustomAxisXValuesSet
        };
    };

    presenter.isZeroInRange = function (min, max) {
        if (min <= 0 && max >= 0) {return true;}
        if (min < 0 && max == 0) {return true;}
        if (min == 0 && max > 0) {return true;}
        return false;
    };

    function getAxisXValuesErrors(fixedValues, cyclicValues, addonConfiguration) {
        if((fixedValues.filter(isNaN).length + cyclicValues.filter(isNaN).length) > 0) {
            return presenter.getErrorObject("AXV_04");
        }

        if(!cyclicValues.every(function (value) {return (value >= 0)})) {
            return presenter.getErrorObject("AXV_01");
        }

        if(!fixedValues.every(function (value) {return (value >= addonConfiguration.min);})) {
            return presenter.getErrorObject("AXV_02");
        }

        if(!fixedValues.every(function (value) {return (value <= addonConfiguration.max);})) {
            return presenter.getErrorObject("AXV_03");
        }

        return {isValid: true};
    }

    function parseAxisXValuesFromModel(model, addonConfiguration) {
        return model["Axis X Values"].split(";").map(function (element) {
            element.trim();
            if (addonConfiguration.isDecimalSeparatorSet) {
                return element.replace(addonConfiguration.decimalSeparator, ".");
            }

            return element;
        });
    }

    function filterCyclicValues (value) {
        return (value.charAt(value.length - 1) == "*");
    }

    function filterFixedValuesBasedOnCyclic (element) {
        return (this.indexOf(element) == -1);
    }

    presenter.validateAxisXValues = function (model, addonConfiguration) {

        if(ModelValidationUtils.isStringEmpty(model["Axis X Values"])) {
            return {isValid: true, isCustomAxisXValuesSet: false, value: {}};
        }

        var values = parseAxisXValuesFromModel(model, addonConfiguration);

        var cyclicValues = values.filter(filterCyclicValues);

        var fixedValues = values.filter(filterFixedValuesBasedOnCyclic, cyclicValues).map(Number);

        cyclicValues = cyclicValues.map(function (value) {
            return Number(value.slice(0, value.length -1));
        });

        var axisXValuesErrors = getAxisXValuesErrors(fixedValues, cyclicValues, addonConfiguration);
        if (!axisXValuesErrors.isValid) {
            return axisXValuesErrors;
        }

        cyclicValues = cyclicValues.map(function (value) {
            if(value == 0) {return 1};
            return value;
        });

        function isDuplicate(value) {
            return (this.filter(function (currentValue) {return (value == currentValue);}).length == 1);
        }

        if((!cyclicValues.every(isDuplicate, cyclicValues)) || (!fixedValues.every(isDuplicate, fixedValues))) {
            return presenter.getErrorObject("AXV_05");
        }

        return {isValid: true, isCustomAxisXValuesSet: true, value: {cyclicValues: cyclicValues, fixedValues: fixedValues}};
    };

    presenter.createAxisXFieldValues = function (min, max, step) {
        var precision = presenter.maxElement([presenter.getNumberPrecision(step), presenter.getNumberPrecision(min), presenter.getNumberPrecision(max)]);   //max()
        var values = [];
        var i;

        function changePrecision(value) {return presenter.changeNumberToPrecision(value, precision);}

        for (i = min; i <= max; i += step) {values.push(i);}

        if(presenter.isZeroInRange(min, max)) {
            if(values.indexOf(0) == -1) {
                values.push(0);
            }

        }

        var valuesWithChangedPrecision = values.map(changePrecision);
        var sortedValues = valuesWithChangedPrecision.sort(function (a, b){
           return a - b;
        });

        return sortedValues;
    };

    presenter.getNumberPrecision = function (value) {
        value = value.toString();
        value = value.split(".");

        var len;
        try {
            len = value[1].length;
        } catch (_){
            len = 0;
        }

        return len;
    };

    presenter.changeNumberToPrecision = function (value, precision) {
        //toFixed value rounds up to closest number eg. 23.6xx.toFixed(0) -> 24, when we want get 23
        if (precision == 0) {return parseInt(value)};
        return Number(value.toFixed(precision));
    };

    presenter.findStartingPointInField = function (min, max, step) {
        var precision = presenter.getNumberPrecision(step);
        var startingPoint;
        if (min > 0) {
            if (min % step == 0) {
                return {startingPoint: min, fieldEnd: max};
            }

            startingPoint = ((parseInt(min / step) * step) + step);
            return {startingPoint: presenter.changeNumberToPrecision(startingPoint, precision), fieldEnd: max};
        }

        if(min < 0) {
            if (max % step == -0) {
                return {startingPoint: max, fieldEnd: min};
            }

            startingPoint = ((parseInt(max / step) *  step) - step);
            return {startingPoint: presenter.changeNumberToPrecision(startingPoint, precision), fieldEnd: min};
        }
    };

    presenter.abs = function (value) {
        if(value < 0) {
            return value * -1;
        }

        return value;
    };

    presenter.validateStep = function (model, separator, max, min) {
        if(ModelValidationUtils.isStringEmpty(model['Step'])) {
            return {isValid: true, value : 1, precision : 0};
        }

        var validatedStep = presenter.validateValueWithSeparator( model['Step'], separator.value );

        var precision = validatedStep.precision;

        if (!validatedStep.isValid) {
            return presenter.getErrorObject('STEP02');
        }

        validatedStep = ModelValidationUtils.validateFloatInRange(validatedStep.value,
            presenter.maxFromArray([max, min].map(presenter.abs)), 0);
        validatedStep.precision = precision;

        if(validatedStep.value == 0) {
            return presenter.getErrorObject("STEP03");
        }

        if (!validatedStep.isValid) {
            return presenter.getErrorObject("STEP01");
        }

        return {isValid: true, value: validatedStep.parsedValue, precision: validatedStep.precision};
    };

    presenter.isMultiplication = function (value) {
        var pattern = new RegExp('^[\\d]+\\*{1}$', 'i');
        return pattern.test(value);
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'drawRange' : presenter.drawRange,
            'enable': presenter.enable,
            'disable': presenter.disable,
            'showAnswers': presenter.showAnswers,
            'hideAnswers': presenter.hideAnswers
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

    presenter.setDisableState = function(isDisabled) {
        var element = presenter.$view.find('.outer');

        if (isDisabled) {
            element.addClass("disable");
        } else {
            element.removeClass("disable");
        }

        presenter.configuration.isDisabled = isDisabled;
    };

    presenter.enable = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        presenter.setDisableState(false);

        bindClickAreaListeners( presenter.$view.find('.clickArea') );
        presenter.bindInfinityAreas();
        resetClicks();
    };

    presenter.disable = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        presenter.setDisableState(true);

        removeAllClickListeners();
    };

    presenter.drawRange = function (rangeList) {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        rangeList = [].concat(rangeList);
        var rangeString = rangeList.join('\n\r');
        var validatedRanges = presenter.validateRanges(rangeString);

        $.each(validatedRanges.shouldDrawRanges, function() {
            removeRangesBetweenRange(this);
        });

        presenter.drawRanges(validatedRanges.shouldDrawRanges);

    };

    presenter.setPlayerController = function(controller) {
        playerController = controller;
        eventBus = controller.getEventBus();
    };

    presenter.createEventData = function (rangeString, isRemove, isRangeCorrect) {
        return {
            'source': presenter.configuration.addonID,
            'item': rangeString,
            'value': isRemove ? '0' : '1',
            'score': isRangeCorrect ? '1' : '0'
        };
    };

    presenter.createAllOKEventData = function () {
        return {
            'source': presenter.configuration.addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.showAnswers = function () {
        if(!presenter.configuration.isActivity){
            return;
        }

        presenter.isShowAnswersActive = true;

        presenter.setWorkMode();

        presenter.currentRanges = jQuery.extend(true ,{}, presenter.configuration.drawnRangesData);

        presenter.leftShowAnswers = presenter.parentLeft;
        if(presenter.leftShowAnswers){
            presenter.$view.find('.rangeImage').each(function () {
                if(parseInt($(this).parent()[0].style.left, 10).toFixed(1) == parseInt(presenter.leftShowAnswers, 10).toFixed(1)){
                    presenter.rangeShowAnswers = $(this);
                }
            });
        }

        presenter.$view.find('.rangeImage').remove();

        var rangesToRemove = [].concat(presenter.configuration.drawnRangesData.ranges);

        $.each(rangesToRemove, function() {
            presenter.removeRange(this, true);
        });

        presenter.drawRanges(presenter.configuration.shouldDrawRanges);
        presenter.drawRanges(presenter.configuration.otherRanges);

        $.each(presenter.configuration.drawnRangesData.ranges, function() {
            getSelectedRange(this).addClass('show-answers');
        });
    };

    presenter.hideAnswers = function () {
        if(!presenter.configuration.isActivity){
            return;
        }
        presenter.hideAnswerClicked = true;

        var rangesToRemove = [].concat(presenter.configuration.drawnRangesData.ranges);

        $.each(rangesToRemove, function() {
            presenter.removeRange(this, true);
        });

        presenter.redrawRanges(presenter.currentRanges.ranges);

        presenter.$view.find('.show-answers').removeClass('show-answers');

        if(presenter.leftShowAnswers){
            presenter.$view.find('.stepLine').each(function () {
                if(parseInt($(this)[0].style.left, 10).toFixed(1) == parseInt(presenter.leftShowAnswers, 10).toFixed(1)){
                    $(this).append(presenter.rangeShowAnswers);
                }
            });
        }

        presenter.hideAnswerClicked = false;
        presenter.isShowAnswersActive = false;

    };


    return presenter;
}       