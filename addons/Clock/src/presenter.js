function AddonClock_create() {
    var presenter = function() {
    };

    presenter.currentHand = 0;
    presenter.getHour = 0;
    presenter.getMinute = 0;
    presenter.mouseX = 0;
    presenter.mouseY = 0;
    presenter.isHandInMove = false;
    presenter.currentHour = 0;
    presenter.currentMinute = 0;
    presenter.lastMinuteValue = 0;
    presenter.Step = 1;
    presenter.showClockLabels = false;
    presenter.isActivity = false;
    presenter.isErrorCheckingMode = false;
    presenter.TimeStandard = 24;
    presenter.showAnswersMode = false;
    presenter.shouldSendEventTime = null;

    function displayText() {
        var textToDisplay = presenter.model['Text to be displayed'], isTextColored = presenter.model['Color text'] === 'True', $textContainer = presenter.$view
            .find('.some-text-container');

        $textContainer.text(textToDisplay);
        if (isTextColored) {
            $textContainer.css('color', 'red');
        }
    }




    presenter.executeCommand = function(name, params) {
        switch (name.toLowerCase()) {
            case 'enable'.toLowerCase():
                presenter.enable();
                break;
            case 'disable'.toLowerCase():
                presenter.disable();
                break;
            case 'setClockTime'.toLowerCase():
                presenter.setClockTime(params[0]);
                break;
            case 'getCurrentTime'.toLowerCase():
                presenter.getCurrentTime();
                break;
            case 'getCurrentHour'.toLowerCase():
                presenter.getCurrentHour();
                break;
            case 'getCurrentMinute'.toLowerCase():
                presenter.getCurrentMinute();
                break;
            case 'show'.toLowerCase():
                presenter.show();
                break;
            case 'hide'.toLowerCase():
                presenter.hide();
                break;
            case 'markAsCorrect'.toLowerCase():
                presenter.markAsCorrect();
                break;
            case 'markAsWrong'.toLowerCase():
                presenter.markAsWrong();
                break;
            case 'markAsEmpty'.toLowerCase():
                presenter.markAsEmpty();
                break;
            case 'isAttempted'.toLowerCase():
                presenter.isAttempted();
                break;
            case 'reset'.toLowerCase():
                presenter.reset();
                break;
        }
    };

    presenter.drawClock = function(view, model) {
        presenter.$view = $(view);
        presenter.model = model;

        presenter.modelID = model.ID;
        presenter.Height = parseInt(model.Height, 10);
        presenter.Width = parseInt(model.Width, 10);

        var centerX = parseInt(presenter.Height / 2, 10);
        var centerY = parseInt(presenter.Width / 2, 10);
        presenter.center = centerX > centerY ? centerY : centerX;
        presenter.radius = presenter.center - 5;

        var size = 2 * presenter.center;

        presenter.$view.find('.analog-clock').css({
            'width' : size,
            'height' : size
        });

        var vector = presenter.center / 15;

        var fig = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="'
            + presenter.Width + '" height="' + presenter.Height + '">';
        var uniqueID = Math.floor((Math.random() * 10000) + 1);
        if (model.Images[0].Background != "") {
            fig += '<defs>';
            fig += '<pattern id="imageBackground' + presenter.modelID
                + uniqueID
                + '" x="0" y="0" patternUnits="userSpaceOnUse" height="'
                + (2 * presenter.center) + '" width="'
                + (2 * presenter.center) + '">';
            fig += '<image y="0" x="0" id="imageBackground' + presenter.modelID
                + uniqueID + '" xlink:href="' + model.Images[0].Background
                + '" height="' + (2 * presenter.center) + '" width="'
                + (2 * presenter.center) + '" />';
            fig += '</pattern>';
            fig += '</defs>';

            fig += '<circle id="clock-face-with-image" class="circle" cx="'
                + presenter.center + '" cy="' + presenter.center + '" r="'
                + presenter.radius + '" fill="url(#imageBackground'
                + presenter.modelID + uniqueID + ')"/>';
        } else {
            fig += '<circle id="clock-face" class="circle" cx="'
                + presenter.center + '" cy="' + presenter.center + '" r="'
                + presenter.radius + '" />';
        }
        if (presenter.showClockLabels) {
            fig += '<text class="text_label" x="'
                + (presenter.center - 17 * vector / 10) + '" y="'
                + (presenter.center / 5 + vector / 2) + '" font-size="'
                + (presenter.center / 5) + 'px" >12</text>';
            fig += '<text class="text_label" x="'
                + (2 * presenter.center - presenter.center / 5) + '" y="'
                + (presenter.center + presenter.center / 10 - vector / 2)
                + '" font-size="' + (presenter.center / 5)
                + 'px" >3</text>';
            fig += '<text class="text_label" x="'
                + (presenter.center - presenter.center / 20) + '" y="'
                + (2 * presenter.center - presenter.center / 10)
                + '" font-size="' + (presenter.center / 5)
                + 'px" >6</text>';
            fig += '<text class="text_label" x="' + (presenter.center / 10)
                + '" y="'
                + (presenter.center + presenter.center / 10 - vector / 2)
                + '" font-size="' + (presenter.center / 5)
                + 'px" >9</text>';

            fig += '<text class="text_label" x="'
                + (14 * presenter.center / 10) + '" y="'
                + (9 * presenter.center / 25) + '" font-size="'
                + (presenter.center / 5) + 'px" >1</text>';
            fig += '<text class="text_label" x="'
                + (4 * presenter.center / 10 + vector) + '" y="'
                + (9 * presenter.center / 25) + '" font-size="'
                + (presenter.center / 5) + 'px" >11</text>';
            fig += '<text class="text_label" x="'
                + (8.4 * presenter.center / 5) + '" y="'
                + (7 * presenter.center / 10 - vector) + '" font-size="'
                + (presenter.center / 5) + 'px" >2</text>';
            fig += '<text class="text_label" x="'
                + (presenter.center / 5 - vector / 2) + '" y="'
                + (7 * presenter.center / 10 - vector) + '" font-size="'
                + (presenter.center / 5) + 'px" >10</text>';

            fig += '<text class="text_label" x="'
                + (14 * presenter.center / 10 - vector) + '" y="'
                + (44 * presenter.center / 25 + vector) + '" font-size="'
                + (presenter.center / 5) + 'px" >5</text>';
            fig += '<text class="text_label" x="'
                + (4 * presenter.center / 10 + 2 * vector) + '" y="'
                + (44 * presenter.center / 25 + vector) + '" font-size="'
                + (presenter.center / 5) + 'px" >7</text>';
            fig += '<text class="text_label" x="'
                + (8.4 * presenter.center / 5) + '" y="'
                + (15 * presenter.center / 10) + '" font-size="'
                + (presenter.center / 5) + 'px" >4</text>';
            fig += '<text class="text_label" x="' + (presenter.center / 5)
                + '" y="' + (15 * presenter.center / 10) + '" font-size="'
                + (presenter.center / 5) + 'px" >8</text>';
            fig += '<rect id="label_mask" x="0" y="0" width="'
                + (2 * presenter.center) + '" height="'
                + (2 * presenter.center) + '"/>';
        }

        if (presenter.ActiveHand == 'HourHand') {
            fig += '<rect id="m-hand" x="' + (presenter.center - vector)
                + '" y="' + (presenter.center / 5) + '" ry="'
                + (2 * vector) + '" rx="' + (2 * vector) + '" width="'
                + (2 * vector) + '" height="'
                + (4 * presenter.center / 5 + vector) + '" />';
            fig += '<rect id="h-hand" x="' + (presenter.center - vector)
                + '" y="' + (presenter.center / 2) + '" ry="'
                + (2 * vector) + '" rx="' + (2 * vector) + '" width="'
                + (2 * vector) + '" height="'
                + (presenter.center / 2 + vector) + '" />';
        } else {
            fig += '<rect id="h-hand" x="' + (presenter.center - vector)
                + '" y="' + (presenter.center / 2) + '" ry="'
                + (2 * vector) + '" rx="' + (2 * vector) + '" width="'
                + (2 * vector) + '" height="'
                + (presenter.center / 2 + vector) + '" />';
            fig += '<rect id="m-hand" x="' + (presenter.center - vector)
                + '" y="' + (presenter.center / 5) + '" ry="'
                + (2 * vector) + '" rx="' + (2 * vector) + '" width="'
                + (2 * vector) + '" height="'
                + (4 * presenter.center / 5 + vector) + '" />';
        }

        fig += '</svg>';

        return fig;
    };

    presenter.getNewTime = function(myTime) {
        var newTime = [];

        var position = myTime.indexOf(':');
        newTime[0] = myTime.slice(0, position);
        newTime[1] = myTime.slice(position + 1, myTime.length);
        return newTime;
    };

    presenter.checkTime = function(time) {
        var hour, minute;

        if (time.indexOf(':') !== -1) {
            var position = time.indexOf(':');
            hour = time.slice(0, position);
            minute = time.slice(position + 1, time.length);

            if (parseInt(hour, 10) == Math.round(hour * 100) / 100
                && parseInt(hour, 10) > -2 && !(isNaN(hour))
                && parseInt(minute, 10) == Math.round(minute * 100) / 100
                && parseInt(minute, 10) > -1 && !(isNaN(minute))) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    };

    presenter.countTimeFromMinuteAngle = function(angleValue) {
        value = angleValue / 6;
        return value;
    };

    presenter.setClockTime = function(time) {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();
        }

        if (!presenter.checkTime(time)) {
            return 0;
        }
        var newTime = presenter.getNewTime(time);

        presenter.currentMinuteValue = parseInt(newTime[1], 10);
        presenter.currentHourValue = parseInt(newTime[0], 10)
            % presenter.TimeStandard;
        if (presenter.TimeStandard == 12 && presenter.currentHourValue == 0) {
            presenter.currentHourValue = 12;
        }
        var h = 30 * ((parseInt(presenter.currentHourValue, 10) % 12) + parseInt(
            presenter.currentMinuteValue, 10) / 60);
        var m = 6 * parseInt(presenter.currentMinuteValue, 10);

        presenter.currentHourAngle = h;

        presenter.setAttr('h-hand', h);
        presenter.setAttr('m-hand', m);

    };

    presenter.setTimeNotSynhronized = function() {

        var handToMove = 0;
        var valueMinute = presenter.currentMinuteValue, valueHour = presenter.currentHourValue;
        var value = 0;

        if (presenter.currentHand == 'h-hand') {
            if (presenter.currentHourValue == 11
                && presenter.currentHandValue < 30) {
                presenter.currentHourValue = 12;
            }
            if (presenter.currentHourValue == 12
                && presenter.currentHandValue > 330) {
                presenter.currentHourValue = 11;
            }
            if (presenter.currentHourValue == 0
                && presenter.currentHandValue > 330) {
                presenter.currentHourValue = 23;
            }
            if (presenter.currentHourValue == 23
                && presenter.currentHandValue < 30) {
                presenter.currentHourValue = 0;
            }
            if (presenter.currentHourValue >= 12) {
                presenter.currentHourValue = 12 + Math
                    .floor(presenter.currentHandValue / 30);
            } else {
                presenter.currentHourValue = Math
                    .floor(presenter.currentHandValue / 30);
            }

            presenter.setClockTime(presenter.currentHourValue + ":"
                + presenter.currentMinuteValue);

        } else {

            valueMinute = Math.round(presenter.currentHandValue / 6);

            if (valueMinute == 60) {
                valueMinute = 0;
            }
            presenter.setClockTime(presenter.currentHourValue + ":"
                + valueMinute);
        }

    };

    presenter.setTimeSynhronizedMinWithHour = function() {

        var handToMove = 0;
        var valueMinute = presenter.currentMinuteValue, valueHour = presenter.currentHourValue;
        var valueMinutePrevious = presenter.currentMinuteValue;
        var valueHourPrevious = presenter.currentHourValue;
        var value = 0;

        if (presenter.currentHand == 'h-hand') {
            if (presenter.currentHourValue == 11
                && presenter.currentHandValue < 30) {
                presenter.currentHourValue = 12;
            }
            if (presenter.currentHourValue == 12
                && presenter.currentHandValue > 330) {
                presenter.currentHourValue = 11;
            }
            if (presenter.currentHourValue == 0
                && presenter.currentHandValue > 330) {
                presenter.currentHourValue = 23;
            }
            if (presenter.currentHourValue == 23
                && presenter.currentHandValue < 30) {
                presenter.currentHourValue = 0;
            }
            if (presenter.currentHourValue >= 12) {
                presenter.currentHourValue = 12 + Math
                    .floor(presenter.currentHandValue / 30);
            } else {
                presenter.currentHourValue = Math
                    .floor(presenter.currentHandValue / 30);
            }

        } else {

            valueMinute = Math.round(presenter.currentHandValue / 6);

            if (valueMinute == 60) {
                valueMinute = 0;
            }

            if (valueMinute < 15 && valueMinutePrevious > 45) {
                if (presenter.currentHourValue == 23) {
                    presenter.currentHourValue = 0;
                } else {
                    presenter.currentHourValue++;
                }
            }
            if (valueMinute > 45 && valueMinutePrevious < 15) {
                if (presenter.currentHourValue == 0) {
                    presenter.currentHourValue = 23;
                } else {
                    presenter.currentHourValue--;
                }
            }
            valueMinutePrevious = valueMinute;

        }
        presenter.setClockTime(presenter.currentHourValue + ":" + valueMinute);

    };

    presenter.setTimeSynhronizedBoth = function() {

        var handToMove = 0;
        var valueMinutePrevious = presenter.currentMinuteValue, valueHour = presenter.currentHourAngle;
        var value = 0;

        if (presenter.currentHand == 'h-hand') {
            if (presenter.currentHourValue == 11
                && presenter.currentHandValue < 30) {
                presenter.currentHourValue = 12;
            }
            if (presenter.currentHourValue == 12
                && presenter.currentHandValue > 330) {
                presenter.currentHourValue = 11;
            }
            if (presenter.currentHourValue == 0
                && presenter.currentHandValue > 330) {
                presenter.currentHourValue = 23;
            }
            if (presenter.currentHourValue == 23
                && presenter.currentHandValue < 30) {
                presenter.currentHourValue = 0;
            }
            if (presenter.currentHourValue >= 12) {
                presenter.currentHourValue = 12 + Math
                    .floor(presenter.currentHandValue / 30);
            } else {
                presenter.currentHourValue = Math
                    .floor(presenter.currentHandValue / 30);
            }

            valueMinute = Math.round(2 * (presenter.currentHandValue % 30));

            var value = valueMinute * 6;

            if (parseInt(value / 6) % presenter.Step >= parseInt(
                presenter.Step / 2, 10)) {
                var getMinute = Math
                    .floor(parseInt(value / 6) / presenter.Step)
                    * presenter.Step;

                valueMinute = (getMinute + presenter.Step);

            } else {
                var getMinute = Math
                    .floor(parseInt(value / 6) / presenter.Step)
                    * presenter.Step;

                valueMinute = getMinute;
            }

        } else {

            var valueMinute = Math.round(presenter.currentHandValue / 6);

            if (valueMinute == 60) {
                valueMinute = 0;
            }

            if (valueMinute < 15 && valueMinutePrevious > 45) {
                if (presenter.currentHourValue == 23) {
                    presenter.currentHourValue = 0;
                } else {
                    presenter.currentHourValue++;
                }
            }
            if (valueMinute > 45 && valueMinutePrevious < 15) {
                if (presenter.currentHourValue == 0) {
                    presenter.currentHourValue = 23;
                } else {
                    presenter.currentHourValue--;
                }
            }
            valueMinutePrevious = valueMinute;

        }

        presenter.setClockTime(presenter.currentHourValue + ":" + valueMinute);

    };

    presenter.moveCurrentHand = function(element) {
        presenter.currentHand = element.id;
    };

    presenter.setAttr = function(id, val) {
        var v = 'rotate(' + val + ', ' + presenter.center + ', '
            + presenter.center + ')';
        presenter.$view.find('#' + id).attr('transform', v);

    };

    presenter.validate = function(view, model) {
        presenter.$view = $(view);
        presenter.model = model;
        if (model.TimeStandard == '12H') {
            presenter.TimeStandard = 12;
        } else {
            presenter.TimeStandard = 24;
        }
        $counter = $(view).find('.clock-counter');

        if (!presenter.checkTime(model.InitialTime)) {
            $counter.text('Put correct InitialTime (hour:minute).');
            return false;
        } else {
            var getTime = presenter.getNewTime(model.InitialTime);
            var min = parseInt(getTime[1], 10);
            var hour = parseInt(getTime[0], 10);
            if (min > 59 || hour > parseInt(presenter.TimeStandard, 10)) {
                $counter.text('Put correct InitialTime (hour < '
                    + (parseInt(presenter.TimeStandard, 10) + 1)
                    + ' and minute < 60).');
                return false;
            }
            if (parseInt(presenter.TimeStandard, 10) == 12 && hour == 0) {
                $counter.text('Put correct InitialTime (0 < hour < '
                    + (parseInt(presenter.TimeStandard, 10) + 1)
                    + ' and minute < 60).');
                return false;
            }
        }
        if (model.TimeStep.length == 0) {
            $counter.text('Fill step value.');
            return false;
        } else {
            if (parseInt(model.TimeStep, 10) != Math
                .round(model.TimeStep * 100) / 100
                || isNaN(model.TimeStep)) {
                $counter.text('Incorrect step value.');
                return false;
            } else {
                if (60 % parseInt(model.TimeStep, 10) != 0) {
                    $counter.text('Step should be a divisor of 60.');
                    return false;
                } else {
                    var getTime = presenter.getNewTime(model.InitialTime);
                    var minutes = parseInt(getTime[1], 10);
                    var step = parseInt(model.TimeStep, 10);
                    if (minutes % step == 0) {
                        presenter.Step = parseInt(model.TimeStep, 10);
                    } else {
                        $counter
                            .text('Value of minutes in InitialTime should be a multiple value of step.');
                        return false;
                    }
                }
            }
        }

        if (!(presenter.checkTime(model.CorrectAnswer))
            && model.isActivity == "True") {
            $counter
                .text('Put CorrectAnswer (hour:minute) or uncheck isActivity.');
            return false;
        } else {
            if (model.isActivity == "True") {
                var getTime = presenter.getNewTime(model.CorrectAnswer);
                var hours = parseInt(getTime[0], 10);
                var minutes = parseInt(getTime[1], 10);
                var step = parseInt(model.TimeStep, 10);
                if (hours > parseInt(presenter.TimeStandard, 10)
                    || minutes > 59) {
                    $counter.text('Put correct InitialTime (hour < '
                        + (parseInt(presenter.TimeStandard, 10) + 1)
                        + ' and minute < 60).');
                    return false;
                }
                if (parseInt(presenter.TimeStandard, 10) == 12 && hours == 0) {
                    $counter.text('Put correct InitialTime (0 < hour < '
                        + (parseInt(presenter.TimeStandard, 10) + 1)
                        + ' and minute < 60).');
                    return false;
                }
                if (minutes % step != 0) {
                    $counter
                        .text('Value of minutes in CorrectAnswer should be a multiple value of step.');
                    return false;
                }
            }
        }

        presenter.continousEvents = ModelValidationUtils.validateBoolean(model['Continuous events']);

        return true;
    };

    presenter.validateTime = function(time) {
        var hour, minute, newTime;

        var position = time.indexOf(':');
        hour = time.slice(0, position);
        minute = time.slice(position + 1, time.length);

        hour = parseInt(hour, 10);
        minute = minute > 9 ? parseInt(minute, 10) : "0" + parseInt(minute, 10);
        newTime = hour +":" + minute;
        return newTime;
    };

    presenter.init = function(view, model) {
        presenter.$view = $(view);
        presenter.model = model;
        presenter.modelID = model.ID;
        presenter.isActivity = model.isActivity == "True" ? true : false;
        presenter.CorrectAnswer = presenter.validateTime(model.CorrectAnswer);
        presenter.InitialTime = presenter.validateTime(model.InitialTime);
        presenter.isDisable = model.isDisable == "True" ? true : false;
        presenter.wasDisable = model.isDisable == "True" ? true : false;
        presenter.wasVisible = model["Is Visible"] == 'True';
        presenter.isVisible = model["Is Visible"] == 'True';
        presenter.ActiveHand = model.ActiveHand;

        if (model.ShowClockLabels == 'True') {
            presenter.showClockLabels = true;
        }

        presenter.isSynhronized = model.SynchronizeHands;
        var myDiv = $(view).find('.analog-clock')[0];

        var figureClock = presenter.drawClock(view, model);
        $(myDiv).append(figureClock);

        if (presenter.isDisable) {
            $(myDiv).addClass('disable');
        }

        presenter.setVisibility(presenter.wasVisible);
    };

    presenter.run = function(view, model) {
        presenter.$view = $(view);
        presenter.model = model;

        if (presenter.validate(view, model)) {

            presenter.init(view, model);
            presenter.setClockTime(model.InitialTime);

            presenter.eventBus.addEventListener('ShowAnswers', this);
            presenter.eventBus.addEventListener('HideAnswers', this);

            jQuery(function($) {
                $(view).find('#analog-clock').mousemove(function(e) {

                    e.stopImmediatePropagation();
                    presenter.currentHand = 0;
                    e.stopPropagation();

                    if (presenter.isHandInMove && !presenter.isDisable 	&& !presenter.isErrorCheckingMode && !presenter.continousEvents) {
                        presenter.triggerFrameChangeEvent(presenter.getCurrentTime() == presenter.CorrectAnswer ? 1 : 0);
                    }
                    presenter.isHandInMove = false;
                }).click(function(e) {


                    }).mouseleave(function(e) {
                        if(presenter.isHandInMove){
                            presenter.isHandInMove = false;
                            presenter.currentHand = 0;
                            presenter.triggerFrameChangeEvent(presenter.getCurrentTime() == presenter.CorrectAnswer ? 1 : 0);

                        }
                    }).mouseup(function(e) {

                    });
            });

            jQuery(function($) {
                $(view).find('#h-hand')
                    .click(function(e) {
                        e.stopImmediatePropagation();
                        presenter.currentHand = 0;
                        e.stopPropagation();
                        presenter.isHandInMove = false;
                    })
                    .mouseup(
                    function(e) {

                        presenter.currentHand = 0;
                        e.stopPropagation();

                        if (presenter.isHandInMove && !presenter.continousEvents) {
                            presenter.triggerFrameChangeEvent(presenter.getCurrentTime() == presenter.CorrectAnswer ? 1	: 0);

                            presenter.isHandInMove = false;
                        }
                    })
                    .mousedown(
                    function(e) {
                        e.stopImmediatePropagation();
                        if ((presenter.ActiveHand != 'MinuteHand')
                            && !presenter.isDisable
                            && !presenter.isErrorCheckingMode) {
                            e.stopPropagation();
                            presenter.moveCurrentHand(this);
                            presenter.isHandInMove = true;
                        }
                    })
                    .mousemove(
                    function(e) {
                        e.stopImmediatePropagation();
                        if (presenter.isHandInMove) {
                            presenter
                                .changeHandPosition(e, 'mouse');
                            if (presenter.isSynhronized == 'Min with Hour') {
                                presenter
                                    .setTimeSynhronizedMinWithHour();
                            } else {
                                if (presenter.isSynhronized == 'Both') {
                                    presenter
                                        .setTimeSynhronizedBoth();
                                } else {
                                    presenter
                                        .setTimeNotSynhronized();
                                }
                            }
                            e.stopPropagation();
                            if (presenter.shouldSendEventTime != presenter.getCurrentTime() && presenter.continousEvents) {
                                presenter.triggerFrameChangeEvent(presenter.getCurrentTime() == presenter.CorrectAnswer ? 1	: 0);
                            }
                            presenter.shouldSendEventTime = presenter.getCurrentTime();
                        }

                    }).mouseleave(function() {

                    });
            });

            jQuery(function($) {
                $(view)
                    .find('#m-hand')
                    .click(function(e) {
                        e.stopImmediatePropagation();
                        presenter.currentHand = 0;
                        e.stopPropagation();
                        presenter.isHandInMove = false;

                    })
                    .mouseup(
                    function(e) {
                        presenter.currentHand = 0;
                        e.stopPropagation();
                        if (presenter.isHandInMove && !presenter.continousEvents) {
                            presenter.triggerFrameChangeEvent(presenter.getCurrentTime() == presenter.CorrectAnswer ? 1	: 0);
                            presenter.isHandInMove = false;
                        }
                    })
                    .mousedown(
                    function(e) {
                        e.stopImmediatePropagation();
                        if ((presenter.ActiveHand != 'HourHand')
                            && !presenter.isDisable
                            && !presenter.isErrorCheckingMode) {
                            e.stopPropagation();
                            presenter.moveCurrentHand(this);
                            presenter.isHandInMove = true;
                        }

                    })
                    .mousemove(
                    function(e) {
                        e.stopImmediatePropagation();
                        if (presenter.isHandInMove) {
                            presenter
                                .changeHandPosition(e, 'mouse');
                            if (presenter.isSynhronized == 'Min with Hour') {
                                presenter
                                    .setTimeSynhronizedMinWithHour();
                            } else {
                                if (presenter.isSynhronized == 'Both') {
                                    presenter
                                        .setTimeSynhronizedBoth();
                                } else {
                                    presenter
                                        .setTimeNotSynhronized();
                                }
                            }
                            e.stopPropagation();

                            if (presenter.shouldSendEventTime != presenter.getCurrentTime() && presenter.continousEvents) {
                                presenter.triggerFrameChangeEvent(presenter.getCurrentTime() == presenter.CorrectAnswer ? 1	: 0);
                            }
                            presenter.shouldSendEventTime = presenter.getCurrentTime();
                        }

                    }).mouseleave(function() {
                    });
            });

            jQuery(function($) {
                $(view).find('#label_mask')
                    .click(function(e) {
                        presenter.currentHand = 0;
                        e.stopPropagation();
                        presenter.isHandInMove = false;

                    }).mouseup(function(e) {

                        if(presenter.isHandInMove){

                            presenter.isHandInMove = false;
                            presenter.currentHand = 0;
                            presenter.triggerFrameChangeEvent(presenter.getCurrentTime() == presenter.CorrectAnswer ? 1 : 0);
                        }

                    }).mousemove(function(e) {
                        e.stopImmediatePropagation();

                        if (presenter.isHandInMove) {
                            presenter.changeHandPosition(e, 'mouse');
                            if (presenter.isSynhronized == 'Min with Hour') {
                                presenter.setTimeSynhronizedMinWithHour();
                            } else {
                                if (presenter.isSynhronized == 'Both') {
                                    presenter.setTimeSynhronizedBoth();
                                } else {
                                    presenter.setTimeNotSynhronized();
                                }
                            }
                            e.stopPropagation();
                        }

                    });
            });

            jQuery(function($) {
                $(view).find('#analog-clock').on('touchmove', function(e) {
                    presenter.currentHand = 0;
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    presenter.isHandInMove = false;
                });
            });

            jQuery(function($) {
                $(view).find('#label_mask').on('touchmove', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                });
            });

            jQuery(function($) {
                $(view)
                    .find('#m-hand')
                    .on(
                    'touchstart',
                    function(e) {
                        if ((presenter.ActiveHand != 'HourHand')
                            && !presenter.isDisable
                            && !presenter.isErrorCheckingMode) {
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            e.preventDefault();
                            presenter.moveCurrentHand(this);
                            presenter.isHandInMove = true;
                        }
                    })
                    .on(
                    'touchend',
                    function(e) {
                        presenter.currentHand = 0;
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        presenter.isHandInMove = false;
                        if(!presenter.continousEvents) {
                            presenter.triggerFrameChangeEvent(presenter.getCurrentTime() == presenter.CorrectAnswer ? 1	: 0);
                        }
                    })
                    .on(
                    'touchmove',
                    function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        if (presenter.isHandInMove) {
                            presenter
                                .changeHandPosition(e, 'touch');
                            if (presenter.isSynhronized == 'Min with Hour') {
                                presenter
                                    .setTimeSynhronizedMinWithHour();
                            } else {
                                if (presenter.isSynhronized == 'Both') {
                                    presenter
                                        .setTimeSynhronizedBoth();
                                } else {
                                    presenter
                                        .setTimeNotSynhronized();
                                }
                            }

                            if (presenter.shouldSendEventTime != presenter.getCurrentTime() && presenter.continousEvents) {
                                presenter.triggerFrameChangeEvent(presenter.getCurrentTime() == presenter.CorrectAnswer ? 1	: 0);
                            }
                            presenter.shouldSendEventTime = presenter.getCurrentTime();
                        }
                    });
            });

            jQuery(function($) {
                $(view)
                    .find('#h-hand')
                    .on(
                    'touchstart',
                    function(e) {
                        if ((presenter.ActiveHand != 'MinuteHand')
                            && !presenter.isDisable
                            && !presenter.isErrorCheckingMode) {
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            e.preventDefault();
                            presenter.moveCurrentHand(this);
                            presenter.isHandInMove = true;
                        }
                    })
                    .on(
                    'touchend',
                    function(e) {
                        presenter.currentHand = 0;
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        presenter.isHandInMove = false;
                        if(!presenter.continousEvents) {
                            presenter.triggerFrameChangeEvent(presenter.getCurrentTime() == presenter.CorrectAnswer ? 1	: 0);
                        }

                    })
                    .on(
                    'touchmove',
                    function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        if (presenter.isHandInMove) {
                            presenter
                                .changeHandPosition(e, 'touch');
                            if (presenter.isSynhronized == 'Min with Hour') {
                                presenter
                                    .setTimeSynhronizedMinWithHour();
                            } else {
                                if (presenter.isSynhronized == 'Both') {
                                    presenter
                                        .setTimeSynhronizedBoth();
                                } else {
                                    presenter
                                        .setTimeNotSynhronized();
                                }
                            }

                            if (presenter.shouldSendEventTime != presenter.getCurrentTime() && presenter.continousEvents) {
                                presenter.triggerFrameChangeEvent(presenter.getCurrentTime() == presenter.CorrectAnswer ? 1	: 0);
                            }
                            presenter.shouldSendEventTime = presenter.getCurrentTime();
                        }
                    });
            });

        }

    };

    presenter.createPreview = function(view, model) {
        presenter.$view = $(view);
        presenter.model = model;

        if (presenter.validate(view, model)) {
            presenter.init(view, model);
            presenter.setClockTime(model.InitialTime);
        }

    };

    presenter.getCurrentTime = function() {
        if(presenter.currentMinuteValue == 60){
            presenter.currentMinuteValue = 0;
            if (presenter.TimeStandard == 12 && presenter.currentHourValue == 12) {
                presenter.currentHourValue = 1;
            } else{
                if (presenter.TimeStandard == 24 && presenter.currentHourValue == 23) {
                    presenter.currentHourValue = 0;
                } else{
                    presenter.currentHourValue++;
                }
            }
        }
        var currentTime = presenter.currentHourValue
            + ":"
            + (presenter.currentMinuteValue < 10 ? "0"
            + presenter.currentMinuteValue
            : presenter.currentMinuteValue);
        return currentTime;
    };

    presenter.getCurrentHour = function() {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();

        }
        return presenter.currentHourValue;
    };

    presenter.getCurrentMinute = function() {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();

        }
        return presenter.currentMinuteValue < 10 ? "0"
            + presenter.currentMinuteValue : presenter.currentMinuteValue;
    };

    presenter.disable = function() {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();

        }
        presenter.isDisable = true;
        var $myDiv = presenter.$view.find('.analog-clock')[0];
        $($myDiv).addClass('disable');
    };

    presenter.enable = function() {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();

        }
        presenter.isDisable = false;
        var $myDiv = presenter.$view.find('.analog-clock')[0];
        $($myDiv).removeClass('disable');
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function() {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();

        }
        presenter.setVisibility(true);
        presenter.isVisible = true;
    };

    presenter.hide = function() {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();

        }
        presenter.setVisibility(false);
        presenter.isVisible = false;
    };

    presenter.isAttempted = function() {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();

        }
        if (presenter.isActivity === false) {
            return true;
        } else {
            if (presenter.InitialTime == presenter.getCurrentTime()) {
                return false;
            } else {
                return true;
            }
        }
    };

    presenter.moveCurrentHand = function(element) {
        presenter.currentHand = element.id;
    };

    presenter.markAsCorrect = function() {
        var $myDiv = presenter.$view.find('.analog-clock')[0];
        presenter.isErrorCheckingMode = true;
        $($myDiv).removeClass('incorrect');
        $($myDiv).addClass('correct');

    };

    presenter.markAsWrong = function() {
        var $myDiv = presenter.$view.find('.analog-clock')[0];
        presenter.isErrorCheckingMode = true;
        $($myDiv).removeClass('correct');
        $($myDiv).addClass('incorrect');
    };

    presenter.markAsEmpty = function() {
        var $myDiv = presenter.$view.find('.analog-clock')[0];
        presenter.isErrorCheckingMode = true;
        $($myDiv).removeClass('incorrect');
        $($myDiv).removeClass('correct');
    };

    presenter.changeHandPosition = function(e, device) {
        if (presenter.currentHand != 0 && presenter.isHandInMove) {
            var h = 0, m = 0;
            var value = 0;
            var $div = presenter.$view.find('#analog-clock');

            if (device == 'mouse') {
                presenter.mouseX = e.pageX - $div.offset().left;
                presenter.mouseY = e.pageY - $div.offset().top;
            } else {
                presenter.mouseX = e.originalEvent.touches[0].pageX
                    - $div.offset().left;
                presenter.mouseY = e.originalEvent.touches[0].pageY
                    - $div.offset().top;
            }

            if (presenter.mouseX == presenter.center) {
                if (presenter.mouseY < presenter.center) {
                    value = 0;
                } else {
                    if (presenter.mouseY > presenter.center) {
                        value = 180;
                    }
                }

            } else {
                if (presenter.mouseY == presenter.center) {
                    if (presenter.mouseX < presenter.center) {
                        value = 270;
                    } else {
                        if (presenter.mouseX > presenter.center) {
                            value = 90;
                        }
                    }

                } else {
                    if (presenter.mouseX > presenter.center
                        && presenter.mouseY < presenter.center) {
                        value = 90 - presenter.countAngle(parseInt(
                            presenter.mouseX, 10)
                            - parseInt(presenter.center, 10), parseInt(
                            presenter.center, 10)
                            - parseInt(presenter.mouseY, 10));
                    }

                    if (presenter.mouseX < presenter.center
                        && presenter.mouseY < presenter.center) {
                        value = 270 + presenter.countAngle(parseInt(
                            presenter.center, 10)
                            - parseInt(presenter.mouseX, 10), parseInt(
                            presenter.center, 10)
                            - parseInt(presenter.mouseY, 10));
                    }

                    if (presenter.mouseX < presenter.center
                        && presenter.mouseY > presenter.center) {
                        value = 270 - presenter.countAngle(parseInt(
                            presenter.center, 10)
                            - parseInt(presenter.mouseX, 10), parseInt(
                            presenter.mouseY, 10)
                            - parseInt(presenter.center, 10));
                    }

                    if (presenter.mouseX > presenter.center
                        && presenter.mouseY > presenter.center) {
                        value = 90 + presenter.countAngle(parseInt(
                            presenter.mouseX, 10)
                            - parseInt(presenter.center, 10), parseInt(
                            presenter.mouseY, 10)
                            - parseInt(presenter.center, 10));

                    }

                }
            }

            if (presenter.currentHand == "m-hand") {
                if (parseInt(value / 6) % presenter.Step >= parseInt(
                    presenter.Step / 2, 10)) {
                    var getMinute = Math.floor(parseInt(value / 6)
                        / presenter.Step)
                        * presenter.Step;

                    value = (getMinute + presenter.Step) * 6;
                    presenter.setAttr(presenter.currentHand, value);
                    presenter.currentHandValue = value;
                } else {
                    var getMinute = Math.floor(parseInt(value / 6)
                        / presenter.Step)
                        * presenter.Step;

                    value = getMinute * 6;
                    presenter.setAttr(presenter.currentHand, value);
                    presenter.currentHandValue = value;
                }
            } else {

                presenter.setAttr(presenter.currentHand, value);
                presenter.currentHandValue = value;
            }
        } else{
            presenter.triggerFrameChangeEvent(presenter.getCurrentTime() == presenter.CorrectAnswer ? 1	: 0);

        }

    };

    presenter.countAngle = function(coordinateX, coordinateY) {
        var value = parseInt(Math.atan((coordinateY / coordinateX)) * 180
            / Math.PI, 10);
        return value;
    };

    presenter.getState = function() {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();
        }
        presenter.isErrorCheckingMode = false;
        var isVisible = presenter.isVisible;
        var wasVisible = presenter.wasVisible;
        var initialTime = presenter.InitialTime;
        var wasDisable = presenter.wasDisable;
        var isDisable = presenter.isDisable;
        var currentTime = presenter.getCurrentTime();

        return JSON.stringify({
            initialTime : initialTime,
            isVisible : isVisible,
            wasVisible : wasVisible,
            wasDisable : wasDisable,
            isDisable : isDisable,
            currentTime : currentTime
        });

    };

    presenter.setState = function(state) {
        var parsedState = JSON.parse(state), $myDiv = presenter.$view
            .find('.analog-clock')[0];
        presenter.currentTime = parsedState.currentTime;
        presenter.isVisible = parsedState.isVisible;
        presenter.wasVisible = parsedState.wasVisible;
        presenter.InitialTime = parsedState.initialTime;
        presenter.wasDisable = parsedState.wasDisable;
        presenter.isDisable = parsedState.isDisable;
        presenter.setVisibility(presenter.isVisible);

        presenter.setClockTime(presenter.currentTime);
        presenter.isDisable === true ? $($myDiv).addClass('disable')
            : $($myDiv).removeClass('disable');
    };

    presenter.reset = function() {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();

        }

        var $myDiv = presenter.$view.find('#analog-clock')[0];
        presenter.setWorkMode();
        presenter.isErrorCheckingMode = false;

        presenter.setClockTime(presenter.InitialTime);
        presenter.isVisible = presenter.wasVisible;
        presenter.setVisibility(presenter.wasVisible);
        presenter.isDisable = presenter.wasDisable;
        presenter.isDisable === true ? $($myDiv).addClass('disable')
            : $($myDiv).removeClass('disable');
    };

    presenter.getMaxScore = function() {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();

        }

        if (presenter.CorrectAnswer == presenter.InitialTime) {
            return 0;
        }
        if (presenter.isActivity === true) {
            return 1;
        } else {
            return 0;
        }
    };

    presenter.getScore = function() {

        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();

        }
        if (presenter.CorrectAnswer == presenter.InitialTime) {
            return 0;
        }
        if (presenter.isActivity === true) {
            return presenter.getCurrentTime() == presenter.CorrectAnswer ? 1
                : 0;
        } else {
            return 0;
        }
    };

    presenter.getErrorCount = function() {

        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();

        }


        if (presenter.isActivity === true) {

            if (presenter.CorrectAnswer == presenter.InitialTime
                && presenter.getCurrentTime() != presenter.CorrectAnswer) {
                return 1;
            }

            if (presenter.neutralOption() == 1) {
                return 0;
            } else {
                return presenter.getMaxScore() - presenter.getScore();
            }
        } else {
            return 0;
        }
    };

    presenter.neutralOption = function() {
        return presenter.getCurrentTime() == presenter.InitialTime ? 1 : 0;
    };

    presenter.setShowErrorsMode = function() {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();

        }

        presenter.isErrorCheckingMode = true;


        if (presenter.isActivity === true) {
            var $myDiv = presenter.$view.find('.analog-clock')[0];

            if (presenter.neutralOption() === 0) {

                if (presenter.getScore() === presenter.getMaxScore()
                    && presenter.getErrorCount() === 0) {
                    $($myDiv).addClass('correct');
                } else {
                    $($myDiv).addClass('incorrect');
                }
            }

        }
    };

    presenter.setWorkMode = function() {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();

        }
        var $myDiv = presenter.$view.find('.analog-clock')[0];
        presenter.isErrorCheckingMode = false;
        $($myDiv).removeClass('correct');
        $($myDiv).removeClass('incorrect');
    };

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };

    presenter.createEventData = function(checkScore) {
        return {
            source : presenter.modelID,
            item : "" + "1",
            value : ''
                + presenter.currentHourValue
                + ":"
                + (presenter.currentMinuteValue < 10 ? "0"
                + presenter.currentMinuteValue
                : presenter.currentMinuteValue),
            score : '' + checkScore
        };
    };

    presenter.triggerFrameChangeEvent = function(checkScore) {
        var eventData = presenter.createEventData(checkScore);
        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.showAnswers = function () {
        if(presenter.isErrorCheckingMode == true){
            presenter.setWorkMode();
        }
        if (presenter.isActivity === true) {
            presenter.isErrorCheckingMode = true;
            presenter.showAnswersMode = true;
            var $myDiv = presenter.$view.find('.analog-clock')[0];
            $($myDiv).addClass('showAnswers');
            presenter.showAnswersCurrentTime = presenter.getCurrentTime();
            presenter.setShowAnswerTime(presenter.CorrectAnswer);

        }
    };

    presenter.hideAnswers = function () {
        if(presenter.showAnswersMode === true){
            var $myDiv = presenter.$view.find('.analog-clock')[0];
            $($myDiv).removeClass('showAnswers');
            presenter.isErrorCheckingMode = false;
            presenter.showAnswersMode = false;
            presenter.setShowAnswerTime(presenter.showAnswersCurrentTime);
        }
    };

    presenter.setShowAnswerTime = function(time) {

        var newTime = presenter.getNewTime(time);

        presenter.currentMinuteValue = parseInt(newTime[1], 10);
        presenter.currentHourValue = parseInt(newTime[0], 10)
            % presenter.TimeStandard;
        if (presenter.TimeStandard == 12 && presenter.currentHourValue == 0) {
            presenter.currentHourValue = 12;
        }
        var h = 30 * ((parseInt(presenter.currentHourValue, 10) % 12) + parseInt(
            presenter.currentMinuteValue, 10) / 60);
        var m = 6 * parseInt(presenter.currentMinuteValue, 10);

        presenter.currentHourAngle = h;

        presenter.setAttr('h-hand', h);
        presenter.setAttr('m-hand', m);


    };

    presenter.onEventReceived = function (eventName) {

        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };
    return presenter;
}