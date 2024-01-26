function AddonPieChart_create(){
    var presenter = function(){};
    presenter.error = false;
    var i, ii, j, tmp1, tmp2, tmp3, tmp4;
    presenter.move = false;
    presenter.isMoved = false;
    presenter.isLineInMove = false;
    presenter.isErrorCheckingMode = false;
    presenter.isShowAnswersActive = false;
    presenter.isGradualShowAnswersActive = false;

    presenter.ERROR_CODES = {
        'WrongStep' : 'The step is wrong!',
        'WrongStart' : 'Wrong starting data!',
        'WrongAnswer' : 'Wrong answers!',
        'WrongName' : 'Define the names!',
        'WrongColor' : 'Wrong color!',
        'WrongSize' : 'Wrong Radius size, choose a number beetween 0 and 1!',
        'WrongPosition' : 'Wrong Percents positions, choose a number beetween 0 and 1!'
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
                break;
            case 'isAllOK'.toLowerCase():
                presenter.isAllOK();
                break;
            case 'isOK'.toLowerCase():
                presenter.isOK(params[0]);
                break;
            case 'getPercent'.toLowerCase():
                presenter.getPercent(params[0]);
                break;
            case 'isAttempted'.toLowerCase():
                presenter.isAttempted();
                break;
        }
    };

    presenter.onEventReceived = function (eventName, eventData) {
         switch (eventName) {
            case "ShowAnswers":
                presenter.showAnswers();
                break;
            case "HideAnswers":
                presenter.hideAnswers();
                break;
            case "GradualShowAnswers":
                presenter.gradualShowAnswers(eventData);
                break;
            case "GradualHideAnswers":
                presenter.gradualHideAnswers();
                break;
        }
    };

    presenter.isAttempted = function() {
        presenter.handleDisplayedAnswers();
        return !presenter.activity || presenter.isMoved;
    };

    presenter.isAllOK = function() {
        presenter.handleDisplayedAnswers();
        return presenter.getScore() === presenter.getMaxScore() && presenter.getErrorCount() === 0;
    };

    presenter.isOK = function(item) {
        presenter.handleDisplayedAnswers();
        return presenter.activity && presenter.currentPercents[item-1] == presenter.items[item-1]["Answer"];
    };

    presenter.getPercent = function(item) {
        presenter.handleDisplayedAnswers();
        return presenter.currentPercents[item-1];
    };

    presenter.hide = function() {
        presenter.handleDisplayedAnswers();
        presenter.isVisible = false;
        presenter.setVisibility(false);
    };

    presenter.show = function() {
        presenter.handleDisplayedAnswers();
        presenter.isVisible = true;
        presenter.setVisibility(true);
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.updateVisibility = function() {
        (presenter.isVisible) ?	presenter.show() : presenter.hide();
    };

    presenter.disable = function() {
        presenter.isShowAnswersActive && presenter.hideAnswers();
        presenter.disabled = true;
        presenter.$view.find('.piechart').addClass('disabled');
    };

    presenter.enable = function() {
        presenter.isShowAnswersActive && presenter.hideAnswers();
        presenter.disabled = false;
        presenter.$view.find('.piechart').removeClass('disabled');
    };

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };

    presenter.createEventData = function(score) {
        return {
            source : presenter.addonID,
            item : '',
            value : '',
            score : score
        };
    };

    presenter.triggerLineEvent = function(line, state, score) {
        var eventData = presenter.createEventData(line, state, score);
        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.validateColor = function(colour){
        if (colour === '#28e32a') {
            return true;
        }
        var rgb = $('<div style="color:#28e32a">');
        var valid_rgb = "rgb(40, 227, 42)";
        rgb.css("color", colour);
        if(rgb.css('color') == valid_rgb && colour != ':#28e32a' && colour.replace(/ /g,"") != valid_rgb.replace(/ /g,"") && colour !== '') {
            return false;
        } else {
            return true;
        }
    };

    presenter.initiate = function(view, model){
        presenter.$view = $(view);
        presenter.model = model;
        presenter.addonID = model.ID;
        presenter.piechart = presenter.$view.find('.piechart');
        presenter.activity = ModelValidationUtils.validateBoolean(presenter.model['Is Activity']);
        presenter.disabled = ModelValidationUtils.validateBoolean(presenter.model['Is Disabled']);
        presenter.initDisabled = presenter.disabled;
        if (presenter.disabled) presenter.disable();
        presenter.isVisible = ModelValidationUtils.validateBoolean(presenter.model["Is Visible"]);
        presenter.initIsVisible = presenter.isVisible;
        presenter.values = ModelValidationUtils.validateBoolean(presenter.model['Show values']);
        presenter.names = ModelValidationUtils.validateBoolean(presenter.model['Show names']);
        presenter.step = presenter.model['Step'];
        presenter.items = presenter.model['Items'];
        presenter.radiusSize = presenter.model['Radius'];
        presenter.percentsPosition = presenter.model['Percents'];
        presenter.numberOfItems = presenter.items.length;
        tmp1 = 0;
        tmp2 = 0;
        if (presenter.radiusSize === '' && presenter.values) {
            presenter.radiusSize = 0.7;
        } else if (presenter.radiusSize === '') {
            presenter.radiusSize = 1;
        } else if (isNaN(presenter.radiusSize) || presenter.radiusSize <= 0 ||	presenter.radiusSize > 1) {
            presenter.error = 'WrongSize';
            return false;
        }
        if (presenter.percentsPosition == '') {
            presenter.percentsPosition = 0.85;
        } else if (isNaN(presenter.percentsPosition) || presenter.percentsPosition <= 0 ||	presenter.percentsPosition > 1) {
            presenter.error = 'WrongPosition';
            return false;
        }
        (presenter.step == '') ? (presenter.step = parseFloat(1)) : (presenter.step = parseFloat(presenter.step));
        if (presenter.step < 0 || presenter.step >=100 || isNaN(presenter.step)) {
            presenter.error = 'WrongStep';
            return false;
        }
        presenter.startingLines = new Array(presenter.numberOfItems);
        presenter.angles = new Array(presenter.numberOfItems);
        for (i = 0; i < presenter.numberOfItems; i++) {
            if (!presenter.validateColor(presenter.items[i]['Color'])) {
                presenter.error = 'WrongColor';
                return false;
            }
            if (isNaN(presenter.items[i]['Starting percent']) || presenter.items[i]['Starting percent'] === '') {
                presenter.error = 'WrongStart';
                return false;
            }
            if (isNaN(presenter.items[i]['Answer']) || (presenter.activity && presenter.items[i]['Starting percent'] === '')) {
                presenter.error = 'WrongAnswer';
                return false;
            }
            if (presenter.names && presenter.items[i]['Name'] === '') {
                presenter.error = 'WrongName';
                return false;
            }
            tmp1 += parseFloat(presenter.items[i]['Starting percent']);
            tmp2 += parseFloat(presenter.items[i]['Answer']);
            if((Math.abs(presenter.items[i]['Starting percent'] - presenter.items[i]['Answer']) % presenter.step) !== 0 && presenter.activity) {
                presenter.error = 'WrongStep';
                return false;
            }
        }
        if (tmp1 !== 100) {
            presenter.error = 'WrongStart';
            return false;
        }
        if (tmp2 !== 100 && presenter.activity) {
            presenter.error = 'WrongAnswer';
            return false;
        }
        return true;
    };

    presenter.drawGraph = function(type) {
        var wrapper = presenter.piechart.parent();
        var graphSize = Math.min(wrapper.width(),wrapper.height());
        presenter.center = Math.floor(graphSize / 2);
        presenter.radius = presenter.center * presenter.radiusSize-5;
        presenter.piechart.css({'width' : graphSize, 'height' : graphSize});
        var x1, x2, y1, y2, x3, y3, angle, angle2, lines, percents;
        var $svg = '<svg height="'+graphSize+'" width="'+graphSize+'" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart'
        if (type == 'showAnswers') $svg += '-show-answers';
        $svg += '">';
        angle = 0;
        lines = '';
        percents = '';
        var parameter;
        if (type != 'showAnswers') {
            presenter.currentPercents = new Array(presenter.numberOfItems);
            presenter.startingItems = new Array(presenter.numberOfItems);
        }
        for (i = 0; i < presenter.numberOfItems; i++) {
            if (type == 'showAnswers') {
                parameter = parseFloat(presenter.items[i]['Answer']);
            } else {
                parameter = parseFloat(presenter.items[i]['Starting percent']);
            }
            x1 = parseFloat(presenter.center + presenter.radius * Math.sin(angle));
            y1 = parseFloat(presenter.center - presenter.radius * Math.cos(angle));
            angle2 = angle + 0.5*(parameter)/50 * Math.PI;
            angle += (parameter)/50 * Math.PI;
            x2 = parseFloat(presenter.center + presenter.radius * Math.sin(angle));
            y2 = parseFloat(presenter.center - presenter.radius * Math.cos(angle));
            x3 = parseFloat(presenter.center + Math.sin(angle2)*(presenter.center * presenter.percentsPosition));
            y3 = parseFloat(presenter.center - Math.cos(angle2)*(presenter.center * presenter.percentsPosition));
            $svg += '<path id="item'+(i+1)+'" class="item item'+(i+1)+'" d="';
            ItemData = 'M '+presenter.center+' '+presenter.center+' L '+x1+' '+y1+' A '+presenter.radius+' '+presenter.radius+' 0 ';
            ((parameter) > 50) ? (ItemData += '1') : (ItemData += '0');
            ItemData += ' 1 '+x2+' '+y2+' L '+presenter.center+' '+presenter.center+' Z';
            if (type != 'showAnswers') presenter.startingItems[i] = ItemData;
            $svg += ItemData + '" stroke-width="0"';
            if (presenter.items[i]['Color'] !== '') {
                $svg += 'style="fill: '+presenter.items[i]['Color']+';"';
            }
            $svg += '></path>';
            if (type != 'showAnswers')
                presenter.currentPercents[i] = (parameter);
            if (presenter.values) {
                percents += presenter.drawPercent(i,x3,y3,parameter);
            }
            if (type != 'showAnswers') {
                presenter.angles[i] = ((angle/Math.PI*180-180)+360)%360;
                presenter.startingLines[i] = presenter.angles[i];
            }
            lines += '<rect id="'+(i+1)+'" class ="line" height="'+presenter.radius+'" width="2" y="'+presenter.center+'" x="'+(presenter.center-1)+'" transform="rotate('+ (((angle/Math.PI*180-180)+360)%360) +', '+presenter.center+', '+presenter.center+')"></rect>';
        }
        $svg += '<circle class="graph';
        $svg += '" r="'+presenter.radius+'" cy="'+presenter.center+'" cx="'+presenter.center+'"></circle>';
        $svg += lines;
        $svg += percents;
        $svg += '</svg>';
        presenter.piechart.prepend($svg);
    };

    presenter.drawPercent = function(i,x,y,value) {
        var tmp = '<text id="Text'+(i+1)+'" class="percentsValues" x="'+x+'" y="'+y+'" text-anchor="middle">'+value+'%</text>';
        return tmp;
    };

    presenter.drawLegend = function() {
        var $legend = '<div class = "legend">', colorItem = '';
        for (i = 0; i < presenter.numberOfItems; i++) {
            if (presenter.items[i]['Color'] !== '') {
                colorItem = 'style="background: '+presenter.items[i]['Color']+';"';
            }
            $legend += '<div class="legendItem"><div class="legendSquare item'+(i+1)+' item"'+colorItem+'></div><div class="legendText">'+ presenter.items[i]['Name']+'</div></div>';
            colorItem = '';
        }
        $legend += '</div';
        presenter.$view.find('.piechart').parent().append($legend);
    };

    presenter.run = function(view, model){
        var x, y, angle, k, angle2, percent, angleTmp, previousItem, nextItem;
        if (!presenter.initiate(view, model)) {
            presenter.piechart.text(presenter.ERROR_CODES[presenter.error]);
            return false;
        }
        presenter.updateVisibility();
        var Width = presenter.piechart.width();
        var Height = presenter.piechart.height();
        presenter.drawGraph();
        if (presenter.names) {
            presenter.drawLegend();
        }
        presenter.$view.find('.line')
            .mousedown(function(e) {
                e.stopImmediatePropagation();
                e.preventDefault();
                i = parseInt($(this).attr('id'),10);
                e.stopPropagation();
                presenter.isLineInMove = true;
            });
        presenter.$view
            .click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (presenter.isLineInMove && !presenter.isErrorCheckingMode && !presenter.disabled && !presenter.isShowAnswersActive) {
                    (presenter.isAllOK()) ? (score=1) : (score=0);
                    if (!presenter.activity) score ='';
                    presenter.triggerLineEvent(score);
                }
                presenter.isLineInMove = false;
            })
            .mouseup(function(e) {
                e.stopPropagation();
                e.preventDefault();
                if (presenter.isLineInMove && !presenter.isErrorCheckingMode && !presenter.disabled && !presenter.isShowAnswersActive) {
                    (presenter.isAllOK()) ? (score=1) : (score=0);
                    if (!presenter.activity) score ='';
                    presenter.triggerLineEvent(score);
                }
                presenter.isLineInMove = false;
            })
            .mouseleave(function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (presenter.isLineInMove && !presenter.isErrorCheckingMode && !presenter.disabled && !presenter.isShowAnswersActive) {
                    (presenter.isAllOK()) ? (score=1) : (score=0);
                    if (!presenter.activity) score ='';
                    presenter.triggerLineEvent(score);
                }
                presenter.isLineInMove = false;
            })
            .mousemove(function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (presenter.isLineInMove 	&& !presenter.disabled && !presenter.isErrorCheckingMode && !presenter.isShowAnswersActive) {
                    presenter.isMoved = true;
                    x = e.originalEvent.pageX - presenter.piechart.offset().left - presenter.center;
                    y = presenter.piechart.offset().top - e.originalEvent.pageY + presenter.center;
                    //	alert("x: "+x+"   y:"+y);
                    for (k = 1; k <= presenter.numberOfItems; k++) {
                        if (presenter.currentPercents[k-1] === 100) {
                            i = k;
                        }
                    }
                    presenter.doTheMove(i,x,y);
                }
            });
        presenter.$view.find('.line').on('touchstart', function(e){
            e.stopPropagation();
            e.preventDefault();
            i = parseInt($(this).attr('id'),10);
            presenter.isLineInMove = true;
        });
        presenter.$view.find('.piechart').on('touchend', function(e){
            e.stopPropagation();
            e.preventDefault();
            if (presenter.isLineInMove && !presenter.isErrorCheckingMode && !presenter.disabled && !presenter.isShowAnswersActive) {
                (presenter.isAllOK()) ? (score=1) : (score=0);
                if (!presenter.activity) score ='';
                presenter.triggerLineEvent(score);
            }
            presenter.isLineInMove = false;
        });
        presenter.$view.find('.piechart').on('touchmove', function (e) {
            var scale = presenter.playerController.getScaleInformation();
            var center_scaled = presenter.center * scale.scaleX;
            e.stopPropagation();
            e.preventDefault();
            x = (parseInt(e.originalEvent.touches[0].pageX, 10) / scale.scaleX - presenter.piechart.offset().left / scale.scaleX - presenter.center);
            y = (presenter.piechart.offset().top / scale.scaleY - parseInt(e.originalEvent.touches[0].pageY, 10) / scale.scaleY + presenter.center);
            if (presenter.isLineInMove && (x < -center_scaled || y < -center_scaled || x > center_scaled || y > center_scaled) && !presenter.disabled && !presenter.isErrorCheckingMode && !presenter.isShowAnswersActive) {
                presenter.isLineInMove = false;
                (presenter.isAllOK()) ? (score=1) : (score=0);
                if (!presenter.activity) score ='';
                presenter.triggerLineEvent(score);
            }
            if (presenter.isLineInMove 	&& !presenter.disabled && !presenter.isErrorCheckingMode && !presenter.isShowAnswersActive) {
                presenter.isMoved = true;
                for (k = 1; k <= presenter.numberOfItems; k++) {
                    if (presenter.currentPercents[k-1] === 100) {
                        i = k;
                    }
                }
                presenter.doTheMove(i,x,y);
            }
        });
        const events = ["ShowAnswers", "HideAnswers", "GradualShowAnswers", "GradualHideAnswers"];
        events.forEach((eventName) => {
            presenter.eventBus.addEventListener(eventName, this);
        });
    };

    presenter.doTheMove = function(i,x,y) {
        var scale = presenter.playerController.getScaleInformation();
        var angle, angle2, angleTmp, previousItem, nextItem, smallerAngle, isAcute, greaterAngle, isAcTwo;

        if (i === presenter.numberOfItems) {
            nextItem = 1;
        } else {
            nextItem = i+1;
        }
        if (i === 1) {
            previousItem = presenter.numberOfItems;
        } else {
            previousItem = i-1;
        }
        angle = Math.atan((x)/(y))*180/Math.PI;
        if (y >= 0) {
            angle = 180 + angle;
        }
        presenter.move = false;
        angle = (angle + 360) % 360;
        smallerAngle = (presenter.angles[i-1] + presenter.step * (1/scale.scaleX)/100*360 + 1)%360 - 1 ;
        isAcute = (angle - presenter.angles[i-1] +360)%360;
        greaterAngle = (presenter.angles[i-1] - presenter.step * (1/scale.scaleX)/100*360 + 359) % 360+1 ;
        isAcTwo = (presenter.angles[i-1] -angle + 360)%360;
        if (isAcute < 90 && ((angle >= smallerAngle ) || angle <= greaterAngle)){
            angle = presenter.angles[i-1] + presenter.step/100*360;
            presenter.move = 'plus';
        } else if ((isAcTwo < 90) && ((angle >= smallerAngle ) || angle <= greaterAngle)){
            angle = presenter.angles[i-1] - presenter.step/100*360;
            presenter.move = 'minus';
        }
        angle = (angle + 360) % 360;
        if ((presenter.move == 'plus' && presenter.currentPercents[nextItem-1]-presenter.step < 0) || (presenter.move == 'minus' && presenter.currentPercents[i-1]-presenter.step < 0)) {
            presenter.move = false;
        }
        if (presenter.move !== false) {
            angle = (angle + 360) % 360;
            presenter.$view.find('#'+i).attr("transform", "rotate(" + angle + ", "+presenter.center+", "+presenter.center+")");
            presenter.angles[i-1] = angle;
            angle = (angle + 180) /180 * Math.PI;
            x1 = parseFloat(presenter.center + presenter.radius * Math.sin(angle));
            y1 = parseFloat(presenter.center - presenter.radius * Math.cos(angle));
            tmp1 = presenter.$view.find('#item'+(i)).attr('d');
            tmp4 = " 1 "+x1+" "+y1+" L";
            tmp3 = tmp1.replace(/ 1 \d+\.?\d* \d+\.?\d* L/, tmp4);
            tmp1 = presenter.$view.find('#item'+(nextItem)).attr('d');
            tmp2 = tmp1.replace(/L \d+\.?\d* \d+\.?\d* A/, "L "+x1+" "+y1+" A");
            angle2 = (Math.round((presenter.angles[i-1] - presenter.angles[previousItem-1])*100)/100+360)%360;
            if (angle2 > 180 || (angle2 <0 && angle2 > -180)) {
                tmp3 = tmp3.replace(" 0 0 1 "," 0 1 1 ");
            } else {
                tmp3 = tmp3.replace(" 0 1 1 "," 0 0 1 ");
            }
            angleTmp = presenter.angles[previousItem-1] + 0.5*angle2-180;
            angle2 = (Math.round((presenter.angles[nextItem-1] - presenter.angles[i-1])*100)/100+360)%360;
            if (angle2 > 180 || (angle2 <0 && angle2 > -180)) {
                tmp2 = tmp2.replace(" 0 0 1 "," 0 1 1 ");
            } else {
                tmp2 = tmp2.replace(" 0 1 1 "," 0 0 1 ");
            }
            if (presenter.move == 'plus') {
                presenter.currentPercents[i-1]+=presenter.step;
                presenter.currentPercents[nextItem-1]-=presenter.step;
            } else {
                presenter.currentPercents[i-1]-=presenter.step;
                presenter.currentPercents[nextItem-1]+=presenter.step;
            }
            presenter.$view.find('#item'+(i)).attr("d", tmp3);
            angle = 0;
            if (presenter.currentPercents[i-1] === 100) {
                if (presenter.items[i-1]['Color'] != '') {
                    presenter.$view.find('.graph').attr("style", "fill:"+presenter.items[i-1]['Color']+"; fill-opacity:1;");
                } else {
                    presenter.$view.find('.graph').attr("class","graph item item"+i);
                    presenter.$view.find('.graph').attr("style", "fill-opacity:1");
                }
                angleTmp += 180;
            } else if (presenter.currentPercents[nextItem-1] === 100) {
                if (presenter.items[nextItem-1]['Color'] != '') {
                    presenter.$view.find('.graph').attr("style", "fill:"+presenter.items[nextItem-1]['Color']+"; fill-opacity:1;");
                } else {
                    presenter.$view.find('.graph').attr("class","graph item item"+nextItem);
                    presenter.$view.find('.graph').attr("style", "fill-opacity:1");
                }
                angle = 180;
            } else {
                presenter.$view.find('.graph').attr("style", "fill-opacity:0");
                presenter.$view.find('.graph').attr("class","graph");
            }
            presenter.$view.find('#item'+(nextItem)).attr("d", tmp2);
            presenter.changePercent(i, angleTmp);
            angleTmp = presenter.angles[i-1] + 0.5*angle2-180 + angle;
            presenter.changePercent(nextItem, angleTmp);
        }
    };

    presenter.changePercent = function(id, angle) {
        presenter.$view.find('#Text'+id).attr("x", (parseFloat(presenter.center + Math.sin(angle/180 * Math.PI)*(presenter.center * presenter.percentsPosition))));
        presenter.$view.find('#Text'+id).attr("y", (parseFloat(presenter.center - Math.cos(angle/180 * Math.PI)*(presenter.center * presenter.percentsPosition))));
        presenter.$view.find('#Text'+id)[0].textContent = presenter.currentPercents[id-1]+'%';
    };

    presenter.createPreview = function(view, model) {
        if (!presenter.initiate(view, model)) {
            presenter.piechart.text(presenter.ERROR_CODES[presenter.error]);
            return false;
        }
        presenter.drawGraph();
        if (presenter.names) {
            presenter.currentPercents = new Array(presenter.numberOfItems);
            for (i = 0; i < presenter.numberOfItems; i++) {
                presenter.currentPercents[i] = parseFloat(presenter.items[i]['Starting percent']);
            }
            presenter.drawLegend();
        }
    };

    presenter.setShowErrorsMode = function(){
        presenter.handleDisplayedAnswers();
        presenter.isErrorCheckingMode = true;
        if (!presenter.activity)
            return 0;
        if (presenter.getErrorCount() > 0) {
            presenter.$view.find('.piechart').addClass('wrong');
        } else if (presenter.getScore() > 0) {
            presenter.$view.find('.piechart').addClass('correct');
        }
    };

    presenter.setWorkMode = function(){
        presenter.isErrorCheckingMode = false;
        presenter.$view.find('.piechart').removeClass('wrong');
        presenter.$view.find('.piechart').removeClass('correct');
    };

    presenter.reset = function(){
        presenter.handleDisplayedAnswers();
        var angle, angle2, angleTmp, x1, y1;
        presenter.isMoved = false;
        if (!presenter.error) {
            presenter.disabled = presenter.initDisabled;
            presenter.disabled ? presenter.disable() : presenter.enable();
            presenter.isVisible = presenter.initIsVisible;
            presenter.updateVisibility();
            for (i = 0; i < presenter.numberOfItems; i++) {
                ii = (i===0) ? (presenter.numberOfItems-1) : i-1;
                presenter.$view.find('#'+(i+1)).attr("transform", "rotate(" + presenter.startingLines[i] + ", "+presenter.center+", "+presenter.center+")");
                presenter.$view.find('#item'+(i+1)).attr("d", presenter.startingItems[i]);
                angle = (Math.round((presenter.startingLines[i] - presenter.startingLines[ii])*100)/100+360)%360;
                angleTmp = presenter.startingLines[ii] + 0.5*angle + 180;
                presenter.angles[i] = presenter.startingLines[i];
                presenter.currentPercents[i] = parseFloat(presenter.items[i]['Starting percent']);
                if (parseFloat(presenter.items[i]['Starting percent']) === 100) {
                    if (presenter.items[i]['Color'] != '') {
                        presenter.$view.find('.graph').attr("style", "fill:"+presenter.items[i]['Color']+"; fill-opacity:1;");
                    } else {
                        presenter.$view.find('.graph').attr("class","graph item item"+(i+1));
                        presenter.$view.find('.graph').attr("style", "fill-opacity:1");
                    }
                    angleTmp += 180;
                }
                if (presenter.values) presenter.changePercent((i+1), angleTmp);
            }
        }
        presenter.setWorkMode();
    };

    presenter.getErrorCount = function(){
        if (presenter.error || !presenter.activity || !presenter.isMoved) {
            return 0;
        }
        return executeWithoutShownAnswers(_getErrorCount);
    };

    function _getErrorCount() {
        let errorCount = 0;
        for (let i = 0; i < presenter.numberOfItems; i++) {
            if (!(presenter.currentPercents[i] == presenter.items[i]["Answer"])) {
                errorCount = 1;
                break;
            }
        }
        return errorCount;
    }

    presenter.getMaxScore = function(){
        return (presenter.error || !presenter.activity) ? 0 : 1;
    };

    presenter.getScore = function(){
        if (presenter.error || !presenter.activity) {
            return 0;
        }
        return executeWithoutShownAnswers(_getScore);
    };

    function _getScore() {
        let score = 1;
        for (let i = 0; i < presenter.numberOfItems; i++) {
            if (!(presenter.currentPercents[i] == presenter.items[i]["Answer"])) {
                score = 0;
                break;
            }
        }
        return score;
    }

    presenter.getState = function(){
        return executeWithoutShownAnswers(_getState);
    };

    function _getState() {
        const itemsData = new Array(presenter.numberOfItems);
        for (i = 0; i < presenter.numberOfItems; i++) {
            itemsData[i] = presenter.$view.find('#item'+(i+1)).attr('d');
        }
        return JSON.stringify({
            isMoved : presenter.isMoved,
            currentPercents : presenter.currentPercents,
            angles : presenter.angles,
            itemsData : itemsData,
            disabled : presenter.disabled,
            isVisible : presenter.isVisible
        });
    }

    function executeWithoutShownAnswers(funcToCall) {
        const wasShowAnswersActive = presenter.isShowAnswersActive;
        const wasGradualShowAnswersActive = presenter.isGradualShowAnswersActive;
        presenter.handleDisplayedAnswers();

        const result = funcToCall();

        wasShowAnswersActive && presenter.showAnswers();
        wasGradualShowAnswersActive && presenter.gradualShowAnswers({"moduleID": presenter.addonID});

        return result;
    }

    presenter.setState = function(state){
        var angle, angle2, angleTmp, x1, y1;
        if (!presenter.error) {
            presenter.isMoved = JSON.parse(state).isMoved;
            presenter.currentPercents = JSON.parse(state).currentPercents;
            presenter.angles = JSON.parse(state).angles;
            const itemsData = JSON.parse(state).itemsData;
            presenter.isVisible = JSON.parse(state).isVisible;
            presenter.updateVisibility();
            presenter.disabled = JSON.parse(state).disabled;
            presenter.disabled ? presenter.disable() : presenter.enable();
            for(i = 0; i < presenter.numberOfItems; i++) {
                ii = (i===0) ? (presenter.numberOfItems-1) : i-1;
                presenter.$view.find('#'+(i+1)).attr("transform", "rotate(" + presenter.angles[i] + ", "+presenter.center+", "+presenter.center+")");
                presenter.$view.find('#item'+(i+1)).attr("d", itemsData[i]);
                angle = (Math.round((presenter.angles[i] - presenter.angles[ii])*100)/100+360)%360;
                angleTmp = presenter.angles[ii] + 0.5*angle + 180;
                if (presenter.currentPercents[i] === 100) {
                    if (presenter.items[i]['Color'] != '') {
                        presenter.$view.find('.graph').attr("style", "fill:"+presenter.items[i]['Color']+"; fill-opacity:1;");
                    } else {
                        presenter.$view.find('.graph').attr("class","graph item item"+(i+1));
                        presenter.$view.find('.graph').attr("style", "fill-opacity:1");
                    }
                    angleTmp += 180;
                }
                if (presenter.values) presenter.changePercent((i+1), angleTmp);
            }
        }
    };

    presenter.showAnswers = function () {
        if (!presenter.activity) {
            return;
        }

        presenter.isErrorCheckingMode && presenter.setWorkMode();
        presenter.handleDisplayedAnswers();
        presenter.isShowAnswersActive = true;
        _showAnswers();
    };

    presenter.gradualShowAnswers = function (eventData) {
        if (!presenter.activity || eventData.moduleID !== presenter.addonID) {
            return;
        }

        presenter.isErrorCheckingMode && presenter.setWorkMode();
        presenter.handleDisplayedAnswers();
        presenter.isGradualShowAnswersActive = true;
        _showAnswers();
    };

    function _showAnswers() {
        presenter.$view.find(".chart").css("visibility", "hidden");
        presenter.drawGraph("showAnswers");
    }

    presenter.hideAnswers = function () {
        if (!presenter.activity || !presenter.isShowAnswersActive) {
            return;
        }

        presenter.isShowAnswersActive = false;
        _hideAnswers();
    };

    presenter.gradualHideAnswers = function () {
        if (!presenter.activity || !presenter.isGradualShowAnswersActive) {
            return;
        }

        presenter.isGradualShowAnswersActive = false;
        _hideAnswers();
    };

    function _hideAnswers() {
        presenter.$view.find(".chart-show-answers").remove();
        presenter.$view.find(".chart").css("visibility", "visible");
    }

    presenter.handleDisplayedAnswers = function () {
        presenter.isShowAnswersActive && presenter.hideAnswers();
        presenter.isGradualShowAnswersActive && presenter.gradualHideAnswers();
    };

    presenter.isAnswersDisplayed = function () {
        return presenter.isShowAnswersActive || presenter.isGradualShowAnswersActive;
    };

    presenter.getActivitiesCount = function () {
        return presenter.activity ? 1 : 0;
    };

    return presenter;
}
