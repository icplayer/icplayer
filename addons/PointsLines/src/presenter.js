function AddonPointsLines_create() {
    var presenter = function() {};
    presenter.error = false;
    presenter.isShowAnswersActive = false;
    presenter.isGradualShowAnswersActive = false;
    presenter.answersNumber = 0;
    presenter.altTexts = [];

    presenter.langTag = '';
    presenter.isWCAGOn = false;
    presenter.speechTexts = null;
    presenter.keyboardControllerObject = null;

    presenter.ERROR_CODES = {
        'PE' : 'Points coordinates incorrect!',
        'PO' : 'Points outside the addon!',
        'NP' : 'Define the points!',
        'IE' : 'Indexes incorrect!',
        'LE' : 'Starting lines incorrect!',
        'BL' : 'Blocked lines incorrect!',
        'AE' : 'Answer incorrect!',
        'AT' : 'Alternative texts incorrect!'
    };

    presenter.DEFAULT_TTS_PHRASES = {
        POINT: "Point",
        CONNECTED: "Connected",
        DISCONNECTED: "Disconnected",
        CONNECTED_TO: "Connected to",
        SELECTED: "Selected",
        DESELECTED: "Deselected",
        WRONG: "Wrong",
        CORRECT: "Correct",
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
            case 'markAsCorrect'.toLowerCase():
                presenter.markAsCorrect();
                break;
            case 'markAsWrong'.toLowerCase():
                presenter.markAsWrong();
                break;
            case 'markAsNeutral'.toLowerCase():
                presenter.markAsNeutral();
                break;
            case 'isEmpty'.toLowerCase():
                presenter.isEmpty();
                break;
            case 'isAttempted'.toLowerCase():
                presenter.isAttempted();
                break;
            case 'isConnected'.toLowerCase():
                presenter.isConnected(params[0],params[1]);
                break;
        }
    };

    presenter.isAttempted = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        return (!(presenter.activity) || (presenter.getScore() !== 0) || (presenter.getErrorCount() !== 0));
    };

    presenter.markAsCorrect = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        presenter.$view.find('.pointslines').removeClass('wrong');
        presenter.$view.find('.pointslines').addClass('correct');
    };

    presenter.markAsWrong = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        presenter.$view.find('.pointslines').removeClass('correct');
        presenter.$view.find('.pointslines').addClass('wrong');
    };

    presenter.markAsNeutral = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        presenter.$view.find('.pointslines').removeClass('correct');
        presenter.$view.find('.pointslines').removeClass('wrong');
    };

    presenter.isConnected = function(i,j) {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        var lineIndex = presenter.currentLines[Math.min(i-1,j-1)][Math.max(i-1,j-1)];
        if (lineIndex == 1 || lineIndex == 2) {
            return true;
        } else {
            return false;
        }
    };

    presenter.isEmpty = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        var numberOfPoints = presenter.points.length;
        var i, j;
        for (i = 0; i < numberOfPoints; i++) {
            for (j = i; j < numberOfPoints; j++) {
                if (presenter.startingLines[i][j] !== presenter.currentLines[i][j]) {
                    return false;
                }
            }
        }
        return true;
    };

    presenter.isAllOK = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        return ((presenter.getScore() == presenter.getMaxScore()) && (presenter.getErrorCount() === 0));
    };

    presenter.disable = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        if (!(presenter.$view.find('.disabled').length > 0)) {
            presenter.disabled = true;
            div = $('<div>');
            div.attr('id', 'disabled_' + presenter.addonID);
            div.attr('class', 'disabled');
            presenter.$view.find('.pointslines').append(div);
        }
    };

    presenter.enable = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        presenter.disabled = false;
        presenter.$view.find('.disabled').remove();
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

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.updateVisibility = function() {
        if (presenter.isVisible) {
            presenter.show();
        } else {
            presenter.hide();
        }
    };
    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
        const events = ['ShowAnswers', 'HideAnswers', 'GradualShowAnswers', 'GradualHideAnswers'];
        for (const event of events) {
            presenter.eventBus.addEventListener(event, this);
        }
    };
    presenter.createEventData = function(line, state, score) {
        return {
            source : presenter.addonID,
            item : line,
            value : state,
            score : score
        };
    };

    function uncheckLine(line) {
        var splittedLine = line.split("_"),
            point1 = splittedLine[1],
            point2 = splittedLine[2];

        presenter.$view.find('#line_'+(point1)+'_'+(point2)).remove();
        presenter.currentLines[point1][point2] = 0;

        presenter.$view.find('#point_'+presenter.addonID+'_'+presenter.selectedPoint).removeClass('selected');
        presenter.selectedPoint = -1;
    }

    presenter.triggerLineEvent = function(line, state, score) {
        var eventData = presenter.createEventData(line, state, score);
        if(parseInt(score, 10) === 0 && presenter.blockWrongAnswers) {
            uncheckLine(line);
            if(presenter.singleMode) {
                var splittedLine = line.split("_"),
                    point1 = splittedLine[1],
                    point2 = splittedLine[2];
                presenter.pointsConnected[point1] = 0;
                presenter.pointsConnected[point2] = 0;
            }
        }
        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    function checkIndexes(indexes, numberOfPoints) {
        indexes = indexes.replace(/\s/g, '');
        var pointsIndexes = new Array(numberOfPoints);
        var i;
        if (indexes == '') {
            for (i = 0; i < numberOfPoints; i++) {
                pointsIndexes[i] = '';
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

    function getPoint(con, coords) {
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
            for (i = 0; i < points.length - 1; i++) {
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
                pointsCoordinates[i][1] = parseInt(pointsCoordinates[i][1], 10);
                pointsCoordinates[i][0] = parseInt(pointsCoordinates[i][0], 10);
            }
        }
        return pointsCoordinates;
    }

    function getLines(dataLines, numberOfPoints, type) {
        if (dataLines == undefined) dataLines='';
        dataLines = dataLines.replace(/\s/g, '');
        var Lines = new Array(numberOfPoints);
        var i, j, tmp_dane, point1, point2;

        for (i = 0; i < numberOfPoints; i++) {
            Lines[i] = new Array(numberOfPoints);
            for (j = i; j < numberOfPoints; j++) {
                Lines[i][j] = 0;
            }
        }

        if (dataLines == '') {
            return Lines;
        }
        var addLine = dataLines.split(',');
        for (i = 0; i < addLine.length; i++) {
            tmp_dane = addLine[i].split('-');
            if (tmp_dane[0] == '' || tmp_dane[1] == '') {
                presenter.error = 'LE';
                return false;
            }
            if (!isNaN(tmp_dane[0]) && tmp_dane[0] <= numberOfPoints && (!isNaN(tmp_dane[1])) && tmp_dane[1] <= numberOfPoints) {
                point1 = Math.min(parseInt(tmp_dane[1],10)-1,parseInt(tmp_dane[0],10)-1);
                point2 = Math.max(parseInt(tmp_dane[1],10)-1,parseInt(tmp_dane[0],10)-1);
                Lines[point1][point2] = 1;
            } else if (type == 1 && !isNaN(tmp_dane[0]) && parseInt(tmp_dane[0], 10) <= numberOfPoints && !isNaN(tmp_dane[1].substring(0, tmp_dane[1].length - 1)) && (tmp_dane[1].substring(tmp_dane[1].length - 1)) === '*' && parseInt(tmp_dane[1].substring(0, tmp_dane[1].length - 1), 10) <= numberOfPoints) {
                point1 = Math.min(parseInt(tmp_dane[1].substring(0,tmp_dane[1].length-1),10)-1,parseInt(tmp_dane[0],10)-1);
                point2 = Math.max(parseInt(tmp_dane[1].substring(0,tmp_dane[1].length-1),10)-1,parseInt(tmp_dane[0],10)-1);
                Lines[point1][point2] = 2;
            } else {
                if (type == 1) {
                    presenter.error = 'LE';
                } else if (type == 2) {
                    presenter.error = 'AE';
                } else {
                    presenter.error = 'BL';
                }
                return false;
            }
        }
        return Lines;
    }

    function getAlternativeTexts(configurationText) {
        configurationText = window.xssUtils.sanitize(configurationText);
        let texts = configurationText.split(/\r?\n/);
        texts.forEach((text, index) => {
            texts[index] = text.replace(/\s/g, '');
        })

        if (texts.length > presenter.points.length) {
            presenter.error = 'AT';
            return false;
        }
        return texts;
    }

    presenter.drawPoints = function() {
        for ( var i = 0; i < (presenter.points).length; i++) {
            div = $('<div>');
            div.attr('id', 'point_container_' + presenter.addonID + '_' + i);
            div.attr('class', 'point_container');
            div.attr('order_value', i + 1);
            div.attr('style', 'left: ' + presenter.points[i][0] + 'px; top: ' + presenter.points[i][1] + 'px;');
            presenter.$view.find('.pointslines').append(div);
            div = $('<div class="point"></div>');
            div.attr('id', 'point_' + presenter.addonID + '_' + i);
            presenter.$view.find('#point_container_' + presenter.addonID + '_' + i).append(div);
            div = $('<div class="point_index">' + presenter.indexes[i] + '</div>');
            presenter.$view.find('#point_container_' + presenter.addonID + '_' + i).append(div);
        }
    };

    presenter.drawLine = function(i, j, showAnswers) {
        if (presenter.$view.find('#line_' + (i) + '_' + (j)).length <= 0 || showAnswers) {
            var m, angle, d, transform, id, line;
            x1 = parseInt(presenter.points[i][0], 10);
            y1 = parseInt(presenter.points[i][1], 10);
            x2 = parseInt(presenter.points[j][0], 10);
            y2 = parseInt(presenter.points[j][1], 10);
            m = (y2 - y1) / (x2 - x1);
            angle = (Math.atan(m)) * 180 / (Math.PI);
            d = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
            if (x2 >= x1) {
                transform = (360 + angle) % 360;
            } else {
                transform = 180 + angle;
            }

            div = $('<div>');
            if (!showAnswers) {
                id = 'line_' + i + '_' + j;
            } else {
                id = 'line_show_answer_' + i + '_' + j;
            }
            div.attr('id', id);
            div.attr('point1', i);
            div.attr('point2', j);
            if (!showAnswers) {
                div.attr('class', 'line');
            } else {
                div.attr('class', 'line-show-answer');
            }
            div.attr('style', 'left: ' + x1 + 'px; top: ' + y1 + 'px');
            presenter.$view.find('.pointslines').prepend(div);
            presenter.$view.find('#'+id).css({
                'left' : x1,
                'top' : y1,
                'width' : d,
                'transform' : 'rotate(' + transform + 'deg)',
                'transform-origin' : '0px 0px',
                '-ms-transform' : 'rotate(' + transform + 'deg)',
                '-ms-transform-origin' : '0px 0px',
                '-moz-transform' : 'rotate(' + transform + 'deg)',
                '-moz-transform-origin' : '0px 0px',
                '-webkit-transform' : 'rotate(' + transform + 'deg)',
                '-webkit-transform-origin' : '0px 0px',
                '-o-transform' : 'rotate(' + transform + 'deg)',
                '-o-transform-origin' : '0px 0px'
            });
            if (presenter.startingLines[i][j] == 2) {
                presenter.$view.find('#line_' + i + '_' + j).addClass('noremovable');
            }
            if (presenter.keyboardControllerObject) {
                presenter.keyboardControllerObject.readConnected();
            }
        }
    };

    presenter.drawTempLine = function (i, x, y) {
        var scaledPoint = scalePoint({x: x, y: y});
        x = scaledPoint.x;
        y = scaledPoint.y;

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
            presenter.$view.find('.pointslines').prepend(div);
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

    presenter.initiate = function(view, model) {
        presenter.$view = $(view);
        presenter.model = model;
        presenter.addonID = model.ID;
        var coords = presenter.model['Points'];
        presenter.activity = ModelValidationUtils.validateBoolean(presenter.model['Is activity']);
        presenter.disabled = ModelValidationUtils.validateBoolean(presenter.model['Is disabled']);
        presenter.singleMode = ModelValidationUtils.validateBoolean(presenter.model['Single']);
        presenter.langTag = model['langAttribute'];
        presenter.showAllAnswersInGradualShowAnswersMode = ModelValidationUtils.validateBoolean(presenter.model['showAllAnswersInGradualShowAnswersMode']);
        presenter.initDisabled = presenter.disabled;
        presenter.isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        presenter.initIsVisible = presenter.isVisible;
        var startingLines = presenter.model['Starting lines'];
        var blockedLines = presenter.model['Blocked lines'];
        presenter.blockWrongAnswers = ModelValidationUtils.validateBoolean(presenter.model['Block wrong answers']);
        var con = presenter.$view.find('.pointslines').parent();
        presenter.$view.find('.pointslines').css({
            'width' : con.width(),
            'height' : con.height()
        });
        presenter.points = getPoint(con, coords);
        presenter.indexes = checkIndexes(presenter.model['Indexes'],(presenter.points).length);
        presenter.altTexts = getAlternativeTexts(model["alternativeTexts"]);
        if (presenter.points === false || presenter.indexes === false || presenter.altTexts === false) {
            con.text(presenter.ERROR_CODES[presenter.error]);
            return;
        }
        presenter.drawPoints();
        numberOfPoints = presenter.points.length;
        if (presenter.singleMode) presenter.pointsConnected =  new Array(numberOfPoints);
        presenter.startingLines = getLines(startingLines, numberOfPoints, 1);
        if (presenter.startingLines === false) {
            con.text(presenter.ERROR_CODES[presenter.error]);
            return;
        }
        presenter.currentLines = getLines(startingLines, numberOfPoints, 1);
        presenter.blockedLines = getLines(blockedLines, numberOfPoints, 3);
        if (presenter.blockedLines === false) {
            con.text(presenter.ERROR_CODES[presenter.error]);
            return;
        }
        if (presenter.singleMode) {
            for ( var i = 0; i < numberOfPoints; i++) {
                presenter.pointsConnected[i] = 0;
            }
        }
        for ( var i = 0; i < numberOfPoints; i++) {
            for ( var j = i; j < numberOfPoints; j++) {
                if (presenter.currentLines[i][j] == 1 || presenter.currentLines[i][j] == 2) {
                    presenter.drawLine(i, j);
                    if (presenter.singleMode) {
                        presenter.pointsConnected[i] = 1;
                        presenter.pointsConnected[j] = 1;
                    }
                }
            }
        }
        var answer = presenter.model['Lines'];
        presenter.answer = getLines(answer, numberOfPoints, 2);
        if (presenter.answer === false) {
            con.text(presenter.ERROR_CODES[presenter.error]);
            return;
        }
    };

    presenter.doClick = function(i) {
        if (presenter.selectedPoint == i) {
            presenter.$view.find('#point_'+presenter.addonID+'_'+i).removeClass('selected');
            presenter.selectedPoint = -1;
        } else if (presenter.selectedPoint !== -1) {
            point1 = Math.min(parseInt(presenter.selectedPoint,10),parseInt(i,10));
            point2 = Math.max(parseInt(presenter.selectedPoint,10),parseInt(i,10));
            if (presenter.currentLines[point1][point2] === 0 && presenter.blockedLines[point1][point2] != 1) {
                if(presenter.singleMode && (presenter.pointsConnected[point1]== 1 || presenter.pointsConnected[point2] == 1)) {
                } else {
                    if (presenter.singleMode) {
                        presenter.pointsConnected[point1] = 1;
                        presenter.pointsConnected[point2] = 1;
                    };
                    presenter.drawLine(point1,point2);
                    presenter.currentLines[point1][point2] = 1;
                    line = 'line_'+(point1)+'_'+(point2);
                    if (presenter.startingLines[point1][point2] === 0 && presenter.answer[point1][point2] == 1) {
                        score = 1;
                    } else {
                        score = 0;
                    }
                    presenter.triggerLineEvent(line,1,score);
                    line = 'all';
                    score = '';
                    if (presenter.isAllOK() && presenter.activity) {
                        presenter.triggerLineEvent(line,score,score);
                    }
                    presenter.$view.find('#point_'+presenter.addonID+'_'+presenter.selectedPoint).removeClass('selected');
                    presenter.selectedPoint = -1;
                }
            } else if (presenter.currentLines[point1][point2] == 1) {
                presenter.$view.find('#line_'+(point1)+'_'+(point2)).remove();
                if (presenter.keyboardControllerObject) {
                    presenter.keyboardControllerObject.readDisconnected();
                }
                presenter.currentLines[point1][point2] = 0;
                if (presenter.singleMode) {
                    presenter.pointsConnected[point1] = 0;
                    presenter.pointsConnected[point2] = 0;
                };
                line = 'line_'+(point1)+'_'+(point2);
                if (presenter.startingLines[point1][point2] == 1 && presenter.answer[point1][point2] === 0) {
                    score = 1;
                } else {
                    score = 0;
                }
                presenter.triggerLineEvent(line,0,score);
                line = 'all';
                score = '';
                if (presenter.isAllOK() && presenter.activity) {
                    presenter.triggerLineEvent(line,score,score);
                }
                presenter.$view.find('#point_'+presenter.addonID+'_'+presenter.selectedPoint).removeClass('selected');
                presenter.selectedPoint = -1;
            } else {
                presenter.$view.find('#point_'+presenter.addonID+'_'+presenter.selectedPoint).removeClass('selected');
                presenter.selectedPoint = -1;
            }
        } else {
            presenter.$view.find('#point_'+presenter.addonID+'_'+i).addClass('selected');
            presenter.selectedPoint = i;
        }
    };

    presenter.upgradeModel = function(model) {
        let upgradedModel = presenter.upgradeShowAllAnswersInGSAMode(model);
        upgradedModel = presenter.upgradeAlternativeTexts(upgradedModel);
        upgradedModel = presenter.upgradeLangTag(upgradedModel);
        upgradedModel = presenter.upgradeSpeechText(upgradedModel);

        return upgradedModel;
    };

    presenter.upgradeShowAllAnswersInGSAMode = function (model) {
        let upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if(!upgradedModel.hasOwnProperty('showAllAnswersInGradualShowAnswersMode')) {
            upgradedModel['showAllAnswersInGradualShowAnswersMode'] = false;
        }

        return upgradedModel;
    }

    presenter.upgradeAlternativeTexts = function (model) {
        let upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if(!upgradedModel.hasOwnProperty('alternativeTexts')) {
            upgradedModel['alternativeTexts'] = '';
        }

        return upgradedModel;
    }

    presenter.upgradeLangTag = function (model) {
        let upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel.hasOwnProperty('langAttribute')) {
            upgradedModel['langAttribute'] = '';
        }

        return upgradedModel;
    }

    presenter.upgradeSpeechText = function (model) {
        let upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel.hasOwnProperty('speechTexts')) {
            upgradedModel['speechTexts'] = {};
        }

        const speechTextProperties = [
            'Point', 'Connected', 'Disconnected', 'ConnectedTo',
            'Selected', 'Deselected', 'Correct', 'Wrong'
        ];
        speechTextProperties.forEach((propertyName) => {
            if (!upgradedModel['speechTexts'].hasOwnProperty(propertyName)) {
                let property = {};
                property[propertyName] = "";
                upgradedModel['speechTexts'][propertyName] = property;
            }
        });

        return upgradedModel;
    }

    presenter.setSpeechTexts = function(speechTexts) {
        presenter.speechTexts = {
            point: presenter.DEFAULT_TTS_PHRASES.POINT,
            connected: presenter.DEFAULT_TTS_PHRASES.CONNECTED,
            disconnected: presenter.DEFAULT_TTS_PHRASES.DISCONNECTED,
            connectedTo: presenter.DEFAULT_TTS_PHRASES.CONNECTED_TO,
            selected: presenter.DEFAULT_TTS_PHRASES.SELECTED,
            deselected: presenter.DEFAULT_TTS_PHRASES.DESELECTED,
            correct: presenter.DEFAULT_TTS_PHRASES.CORRECT,
            wrong: presenter.DEFAULT_TTS_PHRASES.WRONG,
        };

        if (!speechTexts || $.isEmptyObject(speechTexts)) {
            return;
        }

        presenter.speechTexts = {
            point: TTSUtils.getSpeechTextProperty(
                speechTexts.Point.Point,
                presenter.speechTexts.point),
            connected: TTSUtils.getSpeechTextProperty(
                speechTexts.Connected.Connected,
                presenter.speechTexts.connected),
            disconnected: TTSUtils.getSpeechTextProperty(
                speechTexts.Disconnected.Disconnected,
                presenter.speechTexts.disconnected),
            connectedTo: TTSUtils.getSpeechTextProperty(
                speechTexts.ConnectedTo.ConnectedTo,
                presenter.speechTexts.connectedTo),
            selected: TTSUtils.getSpeechTextProperty(
                speechTexts.Selected.Selected,
                presenter.speechTexts.selected),
            deselected: TTSUtils.getSpeechTextProperty(
                speechTexts.Deselected.Deselected,
                presenter.speechTexts.deselected),
            correct: TTSUtils.getSpeechTextProperty(
                speechTexts.Correct.Correct,
                presenter.speechTexts.correct),
            wrong: TTSUtils.getSpeechTextProperty(
                speechTexts.Wrong.Wrong,
                presenter.speechTexts.wrong),
        };
    };

    presenter.run = function(view, model) {
        model = presenter.upgradeModel(model);
        presenter.initiate(view, model);
        presenter.setSpeechTexts(model["SpeechTexts"]);
        if (!presenter.error) {
            var $div = presenter.$view.find('.pointslines');
            var Width = $div.width();
            var Height = $div.height();
            var i, j;
            var line, score;
            var point1, point2, distance;
            presenter.selectedPoint = -1;
            presenter.draw = false;
            var timeClick = true;
            if (presenter.disabled) presenter.disable();


            presenter.$view.find('.point_container').on('mousedown', function(e){
                e.stopPropagation();
                e.preventDefault();
                if (!presenter.isErrorMode && !presenter.disabled && !presenter.isShowAnswersActive) {
                    presenter.draw = parseInt($(this).attr('order_value'),10)-1;
                }

            });

            presenter.$view.on('mousemove',function(e){
                e.stopPropagation();
                e.preventDefault();
                presenter.mouseSX = parseInt(e.pageX,10) - parseInt($div.offset().left,10);
                presenter.mouseSY = parseInt(e.pageY,10) - parseInt($div.offset().top,10);
                if (!presenter.isErrorMode && !presenter.disabled && !presenter.isShowAnswersActive) {
                    presenter.drawTempLine(presenter.draw,presenter.mouseSX,presenter.mouseSY);
                }
            });

            presenter.$view.find('.point_container').on('mouseup',function(e){
                e.stopPropagation();
                e.preventDefault();
                if (presenter.draw !== false && !presenter.isErrorMode && !presenter.disabled && !presenter.isShowAnswersActive) {
                    if (presenter.$view.find('#line_tmp').length > 0) {
                        presenter.$view.find('#line_tmp').remove();
                    }
                    j = parseInt($(this).attr('order_value'),10)-1;
                    if (presenter.draw !== j && presenter.currentLines[Math.min(presenter.draw,j)][Math.max(presenter.draw,j)] === 0 && presenter.blockedLines[Math.min(presenter.draw,j)][Math.max(presenter.draw,j)] != 1) {
                        if(presenter.singleMode && (presenter.pointsConnected[j]== 1 || presenter.pointsConnected[presenter.draw] == 1)) {
                        } else {
                            if(presenter.singleMode) {
                                presenter.pointsConnected[j] = 1;
                                presenter.pointsConnected[presenter.draw] = 1;
                            }
                            presenter.drawLine(Math.min(presenter.draw,j),Math.max(presenter.draw,j));
                            presenter.currentLines[Math.min(presenter.draw,j)][Math.max(presenter.draw,j)] = 1;
                            line = 'line_'+(Math.min(presenter.draw,j))+'_'+(Math.max(presenter.draw,j));
                            if (presenter.selectedPoint !== -1) {
                                presenter.$view.find('#point_'+presenter.addonID+'_'+i).removeClass('selected');
                                presenter.selectedPoint = -1;
                            }
                            if (presenter.startingLines[Math.min(presenter.draw,j)][Math.max(presenter.draw,j)] === 0 && presenter.answer[Math.min(presenter.draw,j)][Math.max(presenter.draw,j)] === 1) {
                                score = 1;
                            } else {
                                score = 0;
                            }
                            presenter.triggerLineEvent(line,1,score);
                            line = 'all';
                            score = '';
                            if (presenter.isAllOK() && presenter.activity) {
                                presenter.triggerLineEvent(line,score,score);
                            }
                        }
                    }
                }
                presenter.draw = false;
            });

            presenter.$view.on('mouseup mouseleave',function(e){
                e.stopPropagation();
                e.preventDefault();
                presenter.draw = false;

                if (presenter.$view.find('#line_tmp').length > 0) {
                    presenter.$view.find('#line_tmp').remove();
                }
            });

            presenter.$view.find('.point_container').on('touchstart', function(e){
                e.stopPropagation();
                e.preventDefault();
                if (!presenter.isErrorMode && !presenter.disabled && !presenter.isShowAnswersActive) {
                    presenter.mouseSX = parseInt(e.originalEvent.touches[0].pageX,10) - parseInt($div.offset().left,10);
                    presenter.mouseSY = parseInt(e.originalEvent.touches[0].pageY,10) - parseInt($div.offset().top,10);
                    presenter.mouseX = parseInt(e.originalEvent.touches[0].pageX,10) - parseInt($div.offset().left,10);
                    presenter.mouseY = parseInt(e.originalEvent.touches[0].pageY,10) - parseInt($div.offset().top,10);
                    presenter.draw = parseInt($(this).attr('order_value'),10)-1;
                }
            });

            presenter.$view.find('.pointslines').on('touchmove', function(e){
                e.stopPropagation();
                e.preventDefault();
                presenter.mouseX = parseInt(e.originalEvent.touches[0].pageX,10) - parseInt($div.offset().left,10);
                presenter.mouseY = parseInt(e.originalEvent.touches[0].pageY,10) - parseInt($div.offset().top,10);
                if (presenter.mouseX >  Width || presenter.mouseY > Height || presenter.mouseX < 0 || presenter.mouseY < 0) {
                    presenter.draw = false;
                    if (presenter.$view.find('#line_tmp').length > 0) {
                        presenter.$view.find('#line_tmp').remove();
                    }
                }
                if (presenter.draw !== false) {
                    presenter.drawTempLine(presenter.draw,presenter.mouseX,presenter.mouseY);
                }
            });

            presenter.$view.on('touchend', function(e){
                e.stopPropagation();
                e.preventDefault();
                if (Math.abs(presenter.mouseSX - presenter.mouseX) + Math.abs(presenter.mouseSY - presenter.mouseY) < 15 && presenter.draw !== false) {
                    if (timeClick) presenter.doClick(presenter.draw);
                    timeClick = false;
                    setTimeout(function(){timeClick = true;},310);
                    //			presenter.doClick(presenter.draw);
                } else  if (presenter.draw !== false){
                    j = -1;
                    var scaledPoint = scalePoint({x: presenter.mouseX, y: presenter.mouseY});
                    presenter.mouseX = scaledPoint.x;
                    presenter.mouseY = scaledPoint.y;

                    for (i = 0; i < (presenter.points).length; i++) {
                        distance = Math.abs(presenter.mouseX - parseInt(presenter.points[i][0], 10)) + Math.abs(presenter.mouseY - parseInt(presenter.points[i][1], 10));
                        if (distance < 25) {
                            j = i;
                        }
                    }
                    if (j !== -1 && presenter.draw !== j && presenter.currentLines[Math.min(presenter.draw,j)][Math.max(presenter.draw,j)] === 0  && presenter.blockedLines[Math.min(presenter.draw,j)][Math.max(presenter.draw,j)] != 1) {
                        if(presenter.singleMode && (presenter.pointsConnected[j]== 1 || presenter.pointsConnected[presenter.draw] == 1)) {
                        } else {
                            if(presenter.singleMode) {
                                presenter.pointsConnected[j] = 1;
                                presenter.pointsConnected[presenter.draw] = 1;
                            }
                            presenter.drawLine(Math.min(presenter.draw,j),Math.max(presenter.draw,j));
                            presenter.currentLines[Math.min(presenter.draw,j)][Math.max(presenter.draw,j)] = 1;
                            line = 'line_'+(Math.min(presenter.draw,j))+'_'+(Math.max(presenter.draw,j));
                            if (presenter.selectedPoint !== -1) {
                                presenter.$view.find('#point_'+presenter.addonID+'_'+presenter.selectedPoint).removeClass('selected');
                                presenter.selectedPoint = -1;
                            }

                            if (presenter.startingLines[Math.min(presenter.draw,j)][Math.max(presenter.draw,j)] === 0 && presenter.answer[Math.min(presenter.draw,j)][Math.max(presenter.draw,j)] === 1) {
                                score = 1;
                            } else {
                                score = 0;
                            }
                            presenter.triggerLineEvent(line,1,score);
                            if (presenter.isAllOK() && presenter.activity) {
                                line = 'all';
                                score = '';
                                presenter.triggerLineEvent(line,score,score);
                            }
                        }
                    }
                }
                presenter.draw = false;
                if (presenter.$view.find('#line_tmp').length > 0) {
                    presenter.$view.find('#line_tmp').remove();
                }
            });
            presenter.$view.find('.point_container').click(function(event) {
                event.stopPropagation();
                event.preventDefault();
                if (!presenter.isErrorMode && !presenter.disabled && !presenter.isShowAnswersActive && timeClick) {
                    i = parseInt($(this).attr('order_value'), 10) - 1;
                    presenter.doClick(i);
                }
            });
        }
        presenter.buildKeyboardController();
    };

    presenter.onEventReceived = function (eventName, data) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }
        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
        if (eventName == "GradualShowAnswers") {
            if (!presenter.isGradualShowAnswersActive) {
                presenter.isGradualShowAnswersActive = true;
            }
            if (data.moduleID === presenter.addonID) {
                presenter.gradualShowAnswers(parseInt(data.item, 10));
            }
        } else if (eventName === "GradualHideAnswers") {
            presenter.gradualHideAnswers();
        }
    }

    function getMousePositionOnCanvas(e) {
        var rect = presenter.canvas.getBoundingClientRect(), client = {
            x : e.clientX,
            y : e.clientY
        };

        return {
            x : parseInt(client.x - rect.left, 10),
            y : parseInt(client.y - rect.top, 10)
        };
    }

    function scalePoint({x, y}) {
        var scaledPoint = {x: x, y: y};
        if (!presenter.playerController)
            return scaledPoint;

        var scale = presenter.playerController.getScaleInformation();
        if (scale.scaleX !== 1.0 || scale.scaleY !== 1.0) {
            scaledPoint.x = Math.floor(scaledPoint.x / scale.scaleX);
            scaledPoint.y = Math.floor(scaledPoint.y / scale.scaleY);
        }
        return scaledPoint;
    }

    presenter.createPreview = function(view, model) {
        presenter.initiate(view, model);
        var canvasElement = $('<canvas></canvas>'),
            ctx = canvasElement[0].getContext('2d');

        canvasElement.attr('width', presenter.$view.find('.pointslines').parent().width());
        canvasElement.attr('height', presenter.$view.find('.pointslines').parent().height());

        presenter.canvasWidth = presenter.$view.find('.pointslines').parent().width;
        presenter.canvasHeight = presenter.$view.find('.pointslines').parent().height;
        presenter.canvas = canvasElement[0];

        presenter.$view.find('.pointslines').append(canvasElement);
        presenter.canvasOffset = canvasElement.offset();

        var coordinatesContainer = $('<div></div>'),
            xContainer = $('<div>x: <span class="value"></span></div>'),
            yContainer = $('<div>y: <span class="value"></span></div>'),
            coloringWrapper = presenter.$view.find('.pointslines');

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
            'minHeight' : presenter.canvasHeight,
            'minWidth' : presenter.canvasWidth
        });

        function setCalculatedPosition(e) {
            xContainer.find('.value').html(getMousePositionOnCanvas(e).x);
            yContainer.find('.value').html(getMousePositionOnCanvas(e).y);
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

        canvasElement.on('mousemove', function(e) {
            setCalculatedPosition(e);
        });
    };

    presenter.reset = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        var numberOfPoints = presenter.points.length;
        if (presenter.singleMode) {
            for ( var i = 0; i < numberOfPoints; i++) {
                presenter.pointsConnected[i] = 0;
            }
        };
        for (i = 0; i < numberOfPoints; i++) {
            for (var j = i; j < numberOfPoints; j++) {
                presenter.currentLines[i][j] = presenter.startingLines[i][j];
                if (presenter.startingLines[i][j] == 1 || presenter.startingLines[i][j] == 2) {
                    if (presenter.$view.find('#line_' + (i) + '_' + (j)).length <= 0)
                        presenter.drawLine(i, j);
                    if (presenter.singleMode) {
                        presenter.pointsConnected[i] = 1;
                        presenter.pointsConnected[j] = 1;
                    }
                } else if (presenter.startingLines[i][j] === 0 && presenter.$view.find('#line_' + (i) + '_' + (j)).length == 1) {
                    presenter.$view.find('#line_' + (i) + '_' + (j)).remove();
                }
            }
        }
        presenter.$view.find('.selected').removeClass('selected');
        presenter.selectedPoint = -1;
        presenter.disabled = presenter.initDisabled;
        if (presenter.disabled) {
            presenter.disable();
        } else {
            presenter.enable();
        }
        presenter.isVisible = presenter.initIsVisible;
        presenter.updateVisibility();
        presenter.setWorkMode();
    };

    presenter.getState = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        return JSON.stringify({
            currentLines : presenter.currentLines,
            disabled : presenter.disabled,
            visible : presenter.isVisible,
            single : presenter.pointsConnected
        });
    };

    presenter.setState = function(state) {
        presenter.currentLines = JSON.parse(state).currentLines;
        presenter.disabled = JSON.parse(state).disabled;
        presenter.pointsConnected = JSON.parse(state).single;
        if (presenter.error == false) {
            if (presenter.disabled) {
                presenter.disable();
            } else {
                presenter.enable();
            }
            presenter.isVisible = JSON.parse(state).visible;
            presenter.updateVisibility();
            var numberOfPoints = presenter.points.length;
            for (var i = 0; i < numberOfPoints; i++) {
                for (var j = i; j < numberOfPoints; j++) {
                    if ((presenter.currentLines[i][j] == 1 || presenter.currentLines[i][j] == 2) && (presenter.$view.find('#line_' + (i) + '_' + (j)).length <= 0)) {
                        presenter.drawLine(i, j);
                    } else {
                        if (presenter.currentLines[i][j] === 0 && presenter.$view.find('#line_' + (i) + '_' + (j)).length == 1) {
                            presenter.$view.find('#line_' + (i) + '_' + (j)).remove();
                        }
                    }
                }
            }
        }
    };

    presenter.getMaxScore = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        var score = 0;
        if (!presenter.activity || (presenter.error !== false)) {
            return score;
        }

        var numberOfPoints = presenter.points.length;
        for (var i = 0; i < numberOfPoints; i++) {
            for (var j = i; j < numberOfPoints; j++) {
                if ((presenter.startingLines[i][j] === 0 && presenter.answer[i][j] == 1)
                    || (presenter.startingLines[i][j] == 1 && presenter.answer[i][j] === 0)
                ) {
                    score++;
                }
            }
        }
        return score;
    };

    presenter.getScore = function(view, model) {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        var score = 0;
        if (!presenter.activity || (presenter.error !== false)) {
            return score;
        }

        var numberOfPoints = presenter.points.length;
        for (var i = 0; i < numberOfPoints; i++) {
            for (var j = i; j < numberOfPoints; j++) {
                if (isCorrctConnected(i, j)) {
                    score++;
                }
            }
        }
        return score;
    };

    presenter.getErrorCount = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        var errors = 0;
        if (!presenter.activity || (presenter.error !== false)) {
            return errors;
        }

        var numberOfPoints = presenter.points.length;
        for (var i = 0; i < numberOfPoints; i++) {
            for (var j = i; j < numberOfPoints; j++) {
                if (isWrongConnected(i, j)) {
                    errors++;
                }
            }
        }
        return errors;
    };

    presenter.setShowErrorsMode = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        presenter.isErrorMode = true;
        if (!presenter.activity || (presenter.error !== false)) {
            return;
        }

        var numberOfPoints = presenter.points.length;
        for (var i = 0; i < numberOfPoints; i++) {
            for (var j = i; j < numberOfPoints; j++) {
                var lineId = '#line_' + i + '_' + j;
                if (isCorrctConnected(i, j)) {
                    presenter.$view.find(lineId).addClass('correctLine');
                } else if (isWrongConnected(i, j)) {
                    presenter.$view.find(lineId).addClass('wrongLine');
                }
            }
        }

        if (presenter.getScore() == presenter.getMaxScore() && presenter.getErrorCount() === 0 && !(presenter.isEmpty())) {
            presenter.$view.find('.pointslines').addClass('correct');
        } else if (presenter.getScore() === 0 && presenter.getErrorCount() === 0) {
        } else {
            presenter.$view.find('.pointslines').addClass('wrong');
        }
    };

    function isCorrctConnected(point1Index, point2Index) {
        if (point1Index > point2Index) {
            let temp = point1Index;
            point1Index = point2Index;
            point2Index = temp;
        }
        return ((presenter.startingLines[point1Index][point2Index] === 0
                && presenter.answer[point1Index][point2Index] == 1
                && presenter.currentLines[point1Index][point2Index] == 1)
            || (presenter.startingLines[point1Index][point2Index] == 1
                && presenter.answer[point1Index][point2Index] === 0
                && presenter.currentLines[point1Index][point2Index] === 0)
        )
    }

    function isWrongConnected(point1Index, point2Index) {
        if (point1Index > point2Index) {
            let temp = point1Index;
            point1Index = point2Index;
            point2Index = temp;
        }
        return ((presenter.startingLines[point1Index][point2Index] === 0
                && presenter.answer[point1Index][point2Index] === 0
                && presenter.currentLines[point1Index][point2Index] == 1)
            || (presenter.startingLines[point1Index][point2Index] == 1
                && presenter.answer[point1Index][point2Index] == 1
                && presenter.currentLines[point1Index][point2Index] === 0)
        )
    }

    presenter.setWorkMode = function() {
        presenter.isErrorMode = false;
        presenter.$view.find('.wrongLine').removeClass('wrongLine');
        presenter.$view.find('.correctLine').removeClass('correctLine');
        presenter.$view.find('.pointslines').removeClass('correct');
        presenter.$view.find('.pointslines').removeClass('wrong');
    };

    presenter.gradualShowAnswers = function () {
        if (presenter.activity) {
            presenter.setWorkMode();
            presenter.$view.find('.line').not('.noremovable').css("visibility", "hidden");
            var showingAnswer = presenter.answersNumber;
            var numberOfPoints = presenter.points.length;
            var i, j;
            if (presenter.showAllAnswersInGradualShowAnswersMode) {
                for (i = 0; i < numberOfPoints; i++) {
                    for (j = i; j < numberOfPoints; j++) {
                        if (presenter.answer[i][j] === 1) {
                            presenter.drawLine(i,j,true);
                        }
                    }
                }
            } else {
                for (i = 0; i < numberOfPoints; i++) {
                    for (j = i; j < numberOfPoints; j++) {
                        if (presenter.answer[i][j] === 1) {
                            if (showingAnswer === 0) {
                                presenter.drawLine(i,j,true);
                                presenter.answersNumber++;
                            }
                            showingAnswer--;
                        }
                    }
                }
            }
        }
    }

    presenter.getActivitiesCount = function () {
        if (!presenter.showAllAnswersInGradualShowAnswersMode) {
            var lineCounter = 0;
            var numberOfPoints = presenter.points.length;
            var i, j;
            for (i = 0; i < numberOfPoints; i++) {
                for (j = i; j < numberOfPoints; j++) {
                    if (presenter.answer[i][j] === 1) {
                        lineCounter++;
                    }
                }
            }
            return lineCounter;
        }
        return 1;
    };

    presenter.gradualHideAnswers = function () {
        if (presenter.activity) {
            presenter.answersNumber = 0;
            presenter.isGradualShowAnswersActive = false;
            presenter.$view.find('.line-show-answer').remove();
            presenter.$view.find('.line').css("visibility", "inherit");
        }
    }

    presenter.showAnswers = function () {
        if (presenter.activity) {
            if (presenter.isShowAnswersActive) {
                presenter.hideAnswers();
            }
            presenter.isShowAnswersActive = true;
            presenter.setWorkMode();
            presenter.$view.find('.line').not('.noremovable').css("visibility", "hidden");
            var numberOfPoints = presenter.points.length;
            var i, j;
            for (i = 0; i < numberOfPoints; i++) {
                for (j = i; j < numberOfPoints; j++) {
                    if (presenter.answer[i][j] == 1) {
                        presenter.drawLine(i,j,true);
                    }
                }
            }
        }
    };

    presenter.hideAnswers = function () {
        if (presenter.activity && presenter.isShowAnswersActive) {
            presenter.isShowAnswersActive = false;
            presenter.$view.find('.line-show-answer').remove();
            presenter.$view.find('.line').css("visibility", "inherit");
        }
    };

    presenter.isShowingAnswers = function () {
        return presenter.isGradualShowAnswersActive || presenter.isShowAnswersActive;
    }

    presenter.setWCAGStatus = function(isWCAGOn) {
        presenter.isWCAGOn = isWCAGOn;
    };

    presenter.buildKeyboardController = function () {
        presenter.keyboardControllerObject
            = new PointsLinesKeyboardController(presenter.getElementsForKeyboardNavigation(), 1);
    };

    presenter.getElementsForKeyboardNavigation = function () {
        return presenter.$view.find(`.point`);
    };

    function PointsLinesKeyboardController(elements, columnsCount) {
        KeyboardController.call(this, elements, columnsCount);
    }

    presenter.isTTS = function () {
        return presenter.isWCAGOn && presenter.getTextToSpeechOrNull(presenter.playerController);
    };

    presenter.keyboardController = function (keycode, isShiftKeyDown, event) {
        presenter.keyboardControllerObject.handle(keycode, isShiftKeyDown, event);
    };

    PointsLinesKeyboardController.prototype = Object.create(KeyboardController.prototype);
    PointsLinesKeyboardController.prototype.constructor = PointsLinesKeyboardController;

    PointsLinesKeyboardController.prototype.getCurrentElement = function () {
        return this.getTarget(this.keyboardNavigationCurrentElement, false);
    };

    PointsLinesKeyboardController.prototype.getTarget = function (element, willBeClicked) {
        return $(element);
    };

    PointsLinesKeyboardController.prototype.switchElement = function (move) {
        let newPositionIndex = this.keyboardNavigationCurrentElementIndex + move;
        if (newPositionIndex >= this.keyboardNavigationElementsLen) {
            newPositionIndex = this.keyboardNavigationCurrentElementIndex;
        } else if (newPositionIndex < 0) {
            newPositionIndex = 0;
        }
        this.markCurrentElement(newPositionIndex);
        this.readCurrentElement();
    };

    PointsLinesKeyboardController.prototype.select = function (event) {
        if (event) {
            event.preventDefault();
        }
        if (!this.isSelectEnabled) {
            return;
        }

        const wasSelected = this.getCurrentElement().hasClass('selected');

        this.selectAction();

        const isSelected = this.getCurrentElement().hasClass('selected');
        if (!wasSelected && isSelected) {
            this.readSelected();
        } else if (wasSelected && !isSelected) {
            this.readDeselected();
        }
    };

    PointsLinesKeyboardController.prototype.enter = function (event) {
        KeyboardController.prototype.enter.call(this, event);
        this.readCurrentElement();
    }

    PointsLinesKeyboardController.prototype.readCurrentElement = function () {
        if (!presenter.isTTS()) {
            return;
        }

        let textVoices = [];
        const $currentPoint = this.getCurrentElement();
        const currentPointIndex = parseInt($currentPoint.parent().attr('order_value'), 10) - 1;
        textVoices.push(this.createTextVoiceForPoint(currentPointIndex));

        if ($currentPoint.hasClass('selected') && !presenter.isShowingAnswers()) {
            textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.selected));
        }

        let connectedPointsIndexes = [];
        let connections = presenter.currentLines[currentPointIndex];
        for (let i = 0; i < currentPointIndex; i++) {
            connections[i] = presenter.currentLines[i][currentPointIndex];
        }
        connections.forEach((value, index) => {
            if (!value) return;
            connectedPointsIndexes.push(index);
        })
        if (connectedPointsIndexes.length !== 0) {
            textVoices.push(this.createTextVoiceWithLanguageFromLesson(presenter.speechTexts.connectedTo));
            connectedPointsIndexes.forEach(pointIndex => {
                textVoices.push(this.createTextVoiceForPoint(pointIndex));
                if (!presenter.isErrorMode) {
                    return;
                }

                if (isCorrctConnected(currentPointIndex, pointIndex)) {
                    textVoices.push(this.createTextVoiceWithLanguageFromLesson(presenter.speechTexts.correct));
                } else if (isWrongConnected(currentPointIndex, pointIndex)) {
                    textVoices.push(this.createTextVoiceWithLanguageFromLesson(presenter.speechTexts.wrong));
                }
            })
        }
        presenter.speak(textVoices);
    };

    PointsLinesKeyboardController.prototype.readSelected = function () {
        if (!presenter.isTTS()) {
            return;
        }

        let textVoices = [];
        textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.selected));
        presenter.speak(textVoices);
    };

    PointsLinesKeyboardController.prototype.readDeselected = function () {
        if (!presenter.isTTS()) {
            return;
        }

        let textVoices = [];
        textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.deselected));
        presenter.speak(textVoices);
    };

    PointsLinesKeyboardController.prototype.readConnected = function () {
        if (!presenter.isTTS()) {
            return;
        }

        let textVoices = [];
        textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.connected));
        presenter.speak(textVoices);
    };

    PointsLinesKeyboardController.prototype.readDisconnected = function () {
        if (!presenter.isTTS()) {
            return;
        }

        let textVoices = [];
        textVoices.push(window.TTSUtils.getTextVoiceObject(presenter.speechTexts.disconnected));
        presenter.speak(textVoices);
    };

    PointsLinesKeyboardController.prototype.createTextVoiceForPoint = function (pointIndex) {
        let message;
        if (presenter.altTexts && presenter.altTexts[pointIndex]) {
            message = presenter.altTexts[pointIndex];
        } else {
            const isIndexExist = presenter.indexes && presenter.indexes[pointIndex];
            const index = isIndexExist ? presenter.indexes[pointIndex] : pointIndex + 1;
            const commaToSeparateIndex = ','
            message = `${presenter.speechTexts.point}${commaToSeparateIndex} ${index}`;
        }
        return this.createTextVoiceWithLanguageFromPresenter(message);
    };

    PointsLinesKeyboardController.prototype.createTextVoiceWithLanguageFromLesson = function (message) {
        return window.TTSUtils.getTextVoiceObject(message);
    };

    PointsLinesKeyboardController.prototype.createTextVoiceWithLanguageFromPresenter = function (message) {
        return window.TTSUtils.getTextVoiceObject(message, presenter.langTag);
    };

    presenter.speak = function (data) {
        let tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts && presenter.isWCAGOn) {
            tts.speak(data);
        }
    };

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    return presenter;
}
