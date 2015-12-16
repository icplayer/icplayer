function AddonConnectingDots_create(){
    var presenter = function(){};

    presenter.toSelect = 0;
    presenter.lineIds = new Array();
    presenter.activity = false;
    presenter.error = false;
    presenter.isShowAnswersActive = false;

    presenter.ERROR_CODES = {
        'PE': 'Points coordinates incorrect!',
        'PO': 'Points outside the addon!',
        'NP': 'Define the points!',
        'IE': 'Indexes incorrect!'
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }
        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    function checkIndexes(indexes,numberOfPoints) {
        indexes = indexes.replace(/\s/g, '');
        pointsIndexes = new Array(numberOfPoints);
        if (indexes == '') {
            for (var i = 0; i < numberOfPoints; i++) {
                pointsIndexes[i] = i+1;
            }
            return pointsIndexes;
        } else if (indexes[0] == '*' && !(isNaN(indexes.substring(1)))){
            for (var i = 0; i < numberOfPoints; i++) {
                pointsIndexes[i] = (i+1)*indexes.substring(1);
            }
            return pointsIndexes;
        } else {
            pointsIndexes = indexes.split(',');
            if (pointsIndexes.length != numberOfPoints) {
                presenter.error = 'IE';
                return false;
            } else {
                return pointsIndexes;
            }
        }
    }
    function getPoint(con,coords) {
        coords = coords.replace(/\s/g, '');
        if (coords == '') {
            presenter.error = 'NP';
            return false;
        } else {
            var points = coords.split(']');
            var numberOfPoints = points.length - 1;
            var pointsCoordinates = new Array(numberOfPoints);
            var tmp_dane;
            if (points[numberOfPoints] != '') {
                presenter.error = 'PE';
                return false;
            }
            var i;
            for (i = 0; i<points.length-1; i++) {
                tmp_dane = points[i].split(',');
                pointsCoordinates[i] = new Array(2);
                if (tmp_dane[0][0] != '[') {
                    presenter.error = 'PE';
                    return false;
                }
                pointsCoordinates[i][0] = tmp_dane[0].substring(1);
                pointsCoordinates[i][1] = tmp_dane[1];
                if (isNaN(pointsCoordinates[i][0]) || isNaN(pointsCoordinates[i][1])) {
                    presenter.error = 'PE';
                    return false;
                } else if (pointsCoordinates[i][0] >= (con.width()) || pointsCoordinates[i][0] <= 0 || pointsCoordinates[i][1] <= 0 || pointsCoordinates[i][1] >= (con.height())) {
                    presenter.error = 'PO';
                    return false;
                }
                pointsCoordinates[i][1] = parseInt(pointsCoordinates[i][1],10);
                pointsCoordinates[i][0] = parseInt(pointsCoordinates[i][0],10);
            }
        }
        return pointsCoordinates;
    }

    presenter.drawPoints = function() {
        for(var i=0; i<(presenter.points).length; i++) {
            div = $('<div id="dot_container_'+presenter.randomId+'_'+presenter.addonID+'_'+i+'" order_value="'+i+'" class="dot_container" style="left: '+presenter.points[i][0]+'px; top: '+presenter.points[i][1]+'px;"><div class="dot"></div><div class="dot_number">'+presenter.indexes[i]+'</div></div>');
            presenter.$view.find('.connectingdots').append(div);
        }
    };

    presenter.drawLine = function(i, time, fade, showAnswer) {
        var m, angle, d, transform, id, line;
        x1 = parseInt(presenter.points[i-1][0],10);
        y1 = parseInt(presenter.points[i-1][1],10);
        x2 = parseInt(presenter.points[i][0],10);
        y2 = parseInt(presenter.points[i][1],10);
        m = (y2-y1)/(x2-x1);
        angle = (Math.atan(m))*180/(Math.PI);
        d = Math.sqrt(((x2-x1)*(x2-x1)) + ((y2-y1)*(y2-y1)));

        if (x2 >= x1){
            transform = (360 + angle) % 360;
        } else {
            transform = 180 + angle;
        }
        if (showAnswer) {
            id ='line_'+i+'_'+new Date().getTime();
            line = "<div id='"+id+"'class='line-show-answer' style ='left: "+x1+"px; top: "+y1+"px'>&nbsp;</div>";
        } else {
            id ='line_'+new Date().getTime();
            line = "<div id='"+id+"'class='line' style ='left: "+x1+"px; top: "+y1+"px'>&nbsp;</div>";
            presenter.lineIds[i] = id;
        }
        presenter.$view.find('.connectingdots').append(line);
        presenter.$view.find('#'+id).css({
            'left': x1,
            'top': y1,
            'width': '0px',
            'transform' : 'rotate('+transform+'deg)',
            'transform-origin' : '0px 0px',
            '-ms-transform' : 'rotate('+transform+'deg)',
            '-ms-transform-origin' : '0px 0px',
            '-moz-transform' : 'rotate('+transform+'deg)',
            '-moz-transform-origin' : '0px 0px',
            '-webkit-transform' : 'rotate('+transform+'deg)',
            '-webkit-transform-origin' : '0px 0px',
            '-o-transform' : 'rotate('+transform+'deg)',
            '-o-transform-origin' : '0px 0px'
        });

        presenter.$view.find('#'+id).animate({
            width: d
        }, time, "linear", function(){
            if (i == (presenter.points).length-1 && !showAnswer) {
                presenter.$view.find('.image-end').remove();
                if (presenter.imageSrcEnd != '') {
                    if (fade) {
                        presenter.$view.find('.image-start').fadeOut('slow');
                    } else {
                        presenter.$view.find('.image-start').remove();
                    }
                    var image2 = document.createElement('img');
                    $(image2).attr('src', presenter.imageSrcEnd);
                    $(image2).addClass('image-end');
                    presenter.$view.find('.connectingdots').prepend(image2);
                    if (fade) {
                        presenter.$view.find('.image-end').hide();
                        presenter.$view.find('.image-end').fadeIn('slow');
                    }
                }
            }
        });
    };

    presenter.drawTempLine = function(i, x, y) {
        if (presenter.draw !== false) {
            if (presenter.$view.find('#line_tmp').length > 0) {
                presenter.$view.find('#line_tmp').remove();
            }
            var m, angle, d, transform, id, line;
            x1 = parseInt(presenter.points[i][0],10);
            y1 = parseInt(presenter.points[i][1],10);
            m = (y-y1)/(x-x1);
            angle = (Math.atan(m))*180/(Math.PI);
            d = Math.sqrt(((x-x1)*(x-x1)) + ((y-y1)*(y-y1)));
            if (x >= x1){
                transform = (360 + angle) % 360;
            } else {
                transform = 180 + angle;
            }

            div = $('<div>');
            div.attr('id','line_tmp');
            div.attr('class','line');
            div.attr('style','left: '+x1+'px; top: '+y1+'px');
            presenter.$view.find('.connectingdots').append(div);
            presenter.$view.find('#line_tmp').css({
                'left': x1,
                'top': y1,
                'width': d,
                'transform' : 'rotate('+transform+'deg)',
                'transform-origin' : '0px 0px',
                '-ms-transform' : 'rotate('+transform+'deg)',
                '-ms-transform-origin' : '0px 0px',
                '-moz-transform' : 'rotate('+transform+'deg)',
                '-moz-transform-origin' : '0px 0px',
                '-webkit-transform' : 'rotate('+transform+'deg)',
                '-webkit-transform-origin' : '0px 0px',
                '-o-transform' : 'rotate('+transform+'deg)',
                '-o-transform-origin' : '0px 0px'
            });
        }
    };

    presenter.executeCommand = function(name, params) {
        switch(name.toLowerCase()) {
            case 'hide'.toLowerCase():
                presenter.hide();
                break;
            case 'show'.toLowerCase():
                presenter.show();
                break;
            case 'reset'.toLowerCase():
                presenter.reset();
                break;
            case 'disable'.toLowerCase():
                presenter.disable();
                break;
            case 'enable'.toLowerCase():
                presenter.enable();
            case 'isAttempted'.toLowerCase():
                presenter.isAttempted();
                break;
        }
    };

    presenter.hide = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        presenter.isVisible = false;
        presenter.setVisibility(false);
    };

    presenter.show = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        presenter.isVisible = true;
        presenter.setVisibility(true);
    };

    presenter.disable = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        presenter.isDisabled = true;
    };

    presenter.enable = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        presenter.isDisabled = false;
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.updateVisibility = function() {
        if(presenter.isVisible) {
            presenter.show();
        } else {
            presenter.hide();
        }
    };

    presenter.isAttempted = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        return (!(presenter.activity) || (presenter.toSelect > 0));
    };

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };

    presenter.createEventData = function(selected,mark) {
        var score = 0;
        if ((presenter.points).length == selected && selected == presenter.toSelect) {
            score = 1;
        }
        return {
            source : presenter.addonID,
            item : selected,
            value : mark,
            score : score
        };
    };
    presenter.triggerPointSelectedEvent = function(selected,mark) {
        var eventData = presenter.createEventData(selected,mark);
        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.run = function(view, model) {
        presenter.randomId = Math.floor(100000*Math.random());
        presenter.$view = $(view);
        presenter.addonID = model.ID;
        presenter.model = model;
        distance = 0;
        var con = presenter.$view.find('.connectingdots').parent();
        presenter.$view.find('.connectingdots').css({
            'width': con.width(),
            'height': con.height()
        });
        presenter.isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        presenter.initIsVisible = presenter.isVisible;
        var coords = presenter.model['Dots'];
        presenter.time = presenter.model['Time'];
        presenter.activity = ModelValidationUtils.validateBoolean(presenter.model['Is activity']);

        presenter.imageSrcStart = presenter.model['Image A'];
        presenter.imageSrcEnd = presenter.model['Image B'];

        presenter.points = getPoint(con,coords);
        presenter.indexes = checkIndexes(presenter.model['Indexes'],(presenter.points).length);
        presenter.isDisabled = ModelValidationUtils.validateBoolean(presenter.model['Is disabled']);
        presenter.initIsDisabled = presenter.isDisabled;

        var image1 = document.createElement('img');
        $(image1).attr('src', presenter.imageSrcStart);
        $(image1).addClass('image-start');

        var image2 = document.createElement('img');
        $(image2).attr('src', presenter.imageSrcEnd);
        $(image2).addClass('image-end');

        presenter.draw = false;
        presenter.isDown = false;

        if (presenter.time == '') {
            presenter.time = 0;
        }
        var $div = presenter.$view.find('.connectingdots');
        var Width = $div.width();
        var Height = $div.height();
        var tmpTime;
        //var Left = parseInt(con[0].offsetLeft,10);
        //var Top = parseInt(con[0].offsetTop,10);
        var Left = parseInt($div.offset().left,10);
        var Top = parseInt($div.offset().top,10);

        if (presenter.points == false || presenter.indexes == false) {
            con.text(presenter.ERROR_CODES[presenter.error]);
        } else {
            presenter.drawPoints();
            if (presenter.imageSrcStart != '') {
                presenter.$view.find('.connectingdots').prepend(image1);
            }

            $(view).find('.connectingdots').click(function(event){
                event.stopPropagation();
                presenter.isDown = false;
            });

            presenter.$view.find('.dot').on('mousedown', function(e){
                e.stopPropagation();
                e.preventDefault();
                if (!presenter.isErrorMode && !presenter.disabled && !presenter.isShowAnswersActive) {
                    presenter.isDown = false;
                }
            });

            presenter.$view.find('.dot_number').on('mousedown', function(e){
                e.stopPropagation();
                e.preventDefault();
                if (!presenter.isErrorMode && !presenter.disabled && !presenter.isShowAnswersActive) {
                    presenter.isDown = false;
                }
            });

            presenter.$view.on('mousedown', function(e){
                e.stopPropagation();
                e.preventDefault();
                if (!presenter.isErrorMode && !presenter.disabled && !presenter.isShowAnswersActive) {
                    presenter.isDown = true;
                }
            });

            presenter.$view.on('mousemove',function(e){
                e.stopPropagation();
                e.preventDefault();
                presenter.draw = presenter.toSelect - 1;
                if (!presenter.isErrorMode && !presenter.disabled && presenter.draw !== -1 && !presenter.isShowAnswersActive) {
                    if (presenter.draw < (presenter.points).length-1 && presenter.isDown === true) {
                        presenter.mouseSX = parseInt(e.pageX,10) - parseInt($div.offset().left,10);
                        presenter.mouseSY = parseInt(e.pageY,10) - parseInt($div.offset().top,10);
                        presenter.drawTempLine(presenter.draw,presenter.mouseSX,presenter.mouseSY);
                    }
                }
            });

            $(view).find('.dot_container').on('mouseup',function(e){
                e.stopPropagation();
                e.preventDefault();
                if (presenter.$view.find('#line_tmp').length > 0) {
                    presenter.$view.find('#line_tmp').remove();
                }
                if (!presenter.isErrorMode && !presenter.isDisabled && !presenter.isShowAnswersActive) {
                    i = parseInt($(this).attr('order_value'),10);

                    if (i == presenter.toSelect){
                        if (i > 0) {
                            presenter.$view.find('div#dot_container_'+presenter.randomId+'_'+presenter.addonID+'_'+(i-1)).removeClass('active');
                            if (presenter.isDown) {
                                presenter.drawLine(i,0,true);
                            } else {
                                presenter.drawLine(i,presenter.time,true);
                            }
                        }

                        if (i < (presenter.points).length-1) {
                            presenter.$view.find('div#dot_container_'+presenter.randomId+'_'+presenter.addonID+'_'+(i)).addClass('active');
                        }

                        presenter.toSelect++;
                        presenter.triggerPointSelectedEvent(i+1,1);
                    } else {
                        presenter.triggerPointSelectedEvent(i+1,0);
                    }
                }
                presenter.isDown = false;
            });

            presenter.$view.on('mouseleave mouseup',function(e){
                e.stopPropagation();
                e.preventDefault();
                presenter.draw = false;
                presenter.isDown = false;

                if (presenter.$view.find('#line_tmp').length > 0) {
                    presenter.$view.find('#line_tmp').remove();
                }
            });


            presenter.$view.on('touchstart', function(e){
                e.stopPropagation();
                e.preventDefault();
                if (!presenter.isErrorMode && !presenter.disabled && !presenter.isShowAnswersActive) {
                    presenter.isDown = true;
                    presenter.mouseX = parseInt(e.originalEvent.touches[0].pageX,10) - parseInt($div.offset().left,10);
                    presenter.mouseY = parseInt(e.originalEvent.touches[0].pageY,10) - parseInt($div.offset().top,10);
                }
            });
            presenter.$view.on('touchmove', function(e){
                e.stopPropagation();
                e.preventDefault();
                presenter.mouseX = parseInt(e.originalEvent.touches[0].pageX,10) - parseInt($div.offset().left,10);
                presenter.mouseY = parseInt(e.originalEvent.touches[0].pageY,10) - parseInt($div.offset().top,10);
                if (presenter.draw !== false && presenter.mouseX <  Width && presenter.mouseY < Height && presenter.mouseX > 0 && presenter.mouseY > 0 && !presenter.isErrorMode && !presenter.isShowAnswersActive && !presenter.disabled && presenter.toSelect < (presenter.points).length && presenter.isDown === true) {
                    presenter.drawTempLine(presenter.toSelect-1,presenter.mouseX,presenter.mouseY);
                } else {
                    if (presenter.$view.find('#line_tmp').length > 0) {
                        presenter.$view.find('#line_tmp').remove();
                        presenter.isDown = false;
                    }
                }
            });

            presenter.$view.on('touchend', function(e){
                e.stopPropagation();
                e.preventDefault();
                tmpTime = presenter.time;
                if (presenter.$view.find('#line_tmp').length > 0) {
                    presenter.$view.find('#line_tmp').remove();
                    tmpTime = 0;
                }
                distance = Math.abs(parseInt(presenter.points[presenter.toSelect][0],10) - presenter.mouseX) + Math.abs(parseInt(presenter.points[presenter.toSelect][1],10) - presenter.mouseY);
                if (distance < 35) {
                    if (presenter.toSelect > 0) {
                        presenter.$view.find('div#dot_container_'+presenter.randomId+'_'+presenter.addonID+'_'+(presenter.toSelect-1)).removeClass('active');
                        presenter.drawLine(presenter.toSelect,tmpTime,true);
                    }

                    if (presenter.toSelect < (presenter.points).length-1) {
                        presenter.$view.find('div#dot_container_'+presenter.randomId+'_'+presenter.addonID+'_'+(presenter.toSelect)).addClass('active');
                    }

                    presenter.toSelect++;
                    presenter.draw++;
                    presenter.triggerPointSelectedEvent(i+1,1);
                }
                presenter.isDown = false;
            });
        }
        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
    };

    presenter.createPreview = function(view, model) {
        presenter.$view = $(view);
        presenter.addonID = model.ID;
        presenter.model = model;
        var con = presenter.$view.find('.connectingdots').parent();
        presenter.$view.find('.connectingdots').css({
            'width': con.width(),
            'height': con.height()
        });
        presenter.imageSrcStart = presenter.model['Image A'];

        var coords = presenter.model['Dots'];
        presenter.points = getPoint(con,coords);
        presenter.indexes = checkIndexes(presenter.model['Indexes'],(presenter.points).length);

        var $div = presenter.$view.find('.connectingdots');
        var Width = $div.width();
        var Height = $div.height();

        if (presenter.points == false || presenter.indexes == false) {
            con.text(presenter.ERROR_CODES[presenter.error]);
        } else {
            presenter.points = getPoint(con,coords);
            presenter.drawPoints();
            if (presenter.imageSrcStart != '') {
                var image1 = document.createElement('img');
                $(image1).attr('src', presenter.imageSrcStart);
                $(image1).addClass('image-start');
                presenter.$view.find('.connectingdots').prepend(image1);
            }
            presenter.isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
            presenter.updateVisibility();
            var coordinatesContainer = $('<div></div>'),
                xContainer = $('<div>x: <span class="value"></span></div>'),
                yContainer = $('<div>y: <span class="value"></span></div>'),
                coloringWrapper = presenter.$view.find('.connectingdots');

            coordinatesContainer.css({
                'width' : 35,
                'height' : 22,
                'border' : '1px solid #696969',
                'borderRadius' : '3px',
                'position' : 'absolute',
                'top' : 3,
                'left' : 3,
                'fontSize' : '9px',
                'padding' : '5px',
                'lineHeight' : '11px'
            });

            coordinatesContainer.append(xContainer).append(yContainer);

            coloringWrapper.append(coordinatesContainer);
            coloringWrapper.css({
                'position' : 'relative',
                'minHeight' : Height,
                'minWidth' : Width
            });

            function setCalculatedPosition(e) {
                presenter.mouseSX = parseInt(e.pageX,10) - parseInt($div.offset().left,10);
                presenter.mouseSY = parseInt(e.pageY,10) - parseInt($div.offset().top,10);
                xContainer.find('.value').html(presenter.mouseSX);
                yContainer.find('.value').html(presenter.mouseSY);
            }

            var doesElementExist = function() {
                var $moduleSelector = $('.moduleSelector[data-id="'+presenter.addonID+'"]');

                if ($moduleSelector.length > 0) {
                    $moduleSelector.on('mousemove', function(e) {
                        setCalculatedPosition(e);
                    });

                    clearInterval(interval);
                }
            };

            var interval = setInterval(function() { doesElementExist(); }, 500);

            presenter.$view.find('.connectingdots').on('mousemove', function(e) {
                setCalculatedPosition(e);
            });
        }

    };

    presenter.reset = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        if (presenter.error != false) {
        } else {
            if (presenter.toSelect > 0) {
                var temp_id = '#dot_container_'+presenter.randomId+'_'+presenter.addonID+'_'+(presenter.toSelect-1);
                presenter.$view.find(temp_id).removeClass('active');
            }
            for (var i = 1; i < presenter.toSelect; i++) {
                presenter.$view.find('#'+presenter.lineIds[i]).remove();
            }
            presenter.$view.find('.image-start').remove();
            presenter.$view.find('.image-end').remove();
            if (presenter.imageSrcStart != '') {
                var image1 = document.createElement('img');
                $(image1).attr('src', presenter.imageSrcStart);
                $(image1).addClass('image-start');
                presenter.$view.find('.connectingdots').prepend(image1);
            }
            presenter.isDisabled = presenter.initIsDisabled;
            presenter.isVisible = presenter.initIsVisible;
            presenter.toSelect = 0;
            presenter.updateVisibility();
            presenter.setWorkMode();
        }
    };

    presenter.getState = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        var toSelect = presenter.toSelect;
        var isDisabled = presenter.isDisabled;
        var isVisible = presenter.isVisible;
        return JSON.stringify({
            toSelect: presenter.toSelect,
            isDisabled: isDisabled,
            isVisible: isVisible
        });
    };
    presenter.setState = function(state) {
        presenter.toSelect = JSON.parse(state).toSelect;
        presenter.isVisible = JSON.parse(state).isVisible;
        presenter.isDisabled = JSON.parse(state).isDisabled;

        if (presenter.toSelect > 0 && presenter.toSelect < (presenter.points).length) {
            var temp_id = '#dot_container_'+presenter.randomId+'_'+presenter.addonID+'_'+(presenter.toSelect-1);
            $(temp_id).addClass('active');
        }
        for(var i = 1; i < presenter.toSelect; i++) {
            presenter.drawLine(i,0,false);
        }
        presenter.updateVisibility();
    };
    presenter.getMaxScore = function () {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        if (presenter.activity) return 1;
        return 0;
    };
    presenter.getScore = function (view, model) {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        if (!presenter.activity || (presenter.error != false)) return 0;

        if ((presenter.points).length == presenter.toSelect) {
            return 1;
        } else {
            return 0;
        }
    };
    presenter.getErrorCount = function () {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        if (presenter.toSelect == 0 || (presenter.error != false)) {
            return 0;
        } else {
            return presenter.getMaxScore() - presenter.getScore();
        }
    };
    presenter.setShowErrorsMode = function () {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        presenter.isErrorMode = true;
        if (!presenter.activity) return 0;
        if (presenter.getScore() === presenter.getMaxScore())
            presenter.$view.find('.connectingdots').addClass('correct');
        if (presenter.getErrorCount() > 0)
            presenter.$view.find('.connectingdots').addClass('wrong');
    };
    presenter.setWorkMode = function () {
        presenter.isErrorMode = false;
        presenter.$view.find('.connectingdots').removeClass('wrong');
        presenter.$view.find('.connectingdots').removeClass('correct');
    };

    presenter.showAnswers = function () {
        if (presenter.activity) {
            var numberOfPoints = (presenter.points).length;
            if (presenter.isShowAnswersActive) {
                presenter.hideAnswers();
            }
            presenter.isShowAnswersActive = true;
            presenter.setWorkMode();
            presenter.$view.find('.line').addClass('line-show-answer');
            var i = presenter.toSelect;
            if (i == 0) {
                i++;
            } else {
                presenter.$view.find('div#dot_container_'+presenter.randomId+'_'+presenter.addonID+'_'+(i-1)).removeClass('active');
            }
            for (; i < numberOfPoints; i++) {
                presenter.drawLine(i,0,true,true);
            }
        }
    };

    presenter.hideAnswers = function () {
        if (presenter.activity) {
            presenter.isShowAnswersActive = false;
            presenter.$view.find('.line').removeClass('line-show-answer');
            presenter.$view.find('.line-show-answer').remove();
            if (presenter.toSelect > 0 && presenter.toSelect < (presenter.points).length) {
                var i = presenter.toSelect;
                presenter.$view.find('div#dot_container_'+presenter.randomId+'_'+presenter.addonID+'_'+(i-1)).addClass('active');
            }
        }
    };
    return presenter;
}