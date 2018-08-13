function AddonLine_Selection_create(){
    var presenter = function(){};
    presenter.error = false;
    presenter.isErrorMode = false;
    presenter.isStarted = false;
    presenter.isShowAnswersActive = false;
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
            case 'isAttempted'.toLowerCase():
                presenter.isAttempted();
                break;
            case 'select'.toLowerCase():
                presenter.select(params[0]);
                break;
            case 'deselect'.toLowerCase():
                presenter.deselect(params[0]);
                break;
        }
    };

    presenter.ERROR_CODES = {
        'lines_error' : "Error in lines' defition.",
        'lines_empty' : 'Property Lines cannot be empty!',
        'points_out' : 'Ending points are outside  the addon!'
    };

    presenter.disable = function() {
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        if (!(presenter.$view.find('.disabled').length > 0)) {
            presenter.disabled = true;
            presenter.$view.find('.lines_selection').addClass('disabled');
        }
    };

    presenter.enable = function() {
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        presenter.disabled = false;
        presenter.$view.find('.disabled').removeClass('disabled');
    };

    presenter.updateDisability = function(){
        if (presenter.disabled)
            presenter.disable();
        else
            presenter.enable();
    };

    presenter.hide = function() {
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        presenter.isVisible = false;
        presenter.setVisibility(false);
    };

    presenter.show = function() {
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        presenter.isVisible = true;
        presenter.setVisibility(true);
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.updateVisibility = function() {
        if (presenter.isVisible) {
            presenter.show();
        } else
            presenter.hide();
    };

    presenter.isAllOK = function() {
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        if (presenter.getScore() == presenter.getMaxScore() && presenter.getErrorCount() == 0)
            return true
        else
            return false;
    };

    presenter.isAttempted = function() {
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        return presenter.isStarted;
    };

    presenter.select = function(index) {
        index--;
        presenter.isStarted = true;
        var line = presenter.$view.find('#line_'+index);
        if (line.attr('class') != 'line selected') {
            if (presenter.singleMode) {
                presenter.$view.find('.selected').attr('class','line');
                presenter.selected = [];
            }
            line.attr('class','line selected');
            presenter.selected.push(index);
        }
    };

    presenter.deselect = function(index) {
        index--;
        presenter.isStarted = true;
        var line = presenter.$view.find('#line_'+index);
        if (line.attr('class') == 'line selected') {
            if (presenter.singleMode)
                presenter.selected = [];
            else
                presenter.selected.splice(presenter.selected.indexOf(index),1);
            line.attr('class','line');
        }
    };

    presenter.initiate = function(view, model, isPreview){
        presenter.$view = $(view);
        presenter.model = model;
        presenter.addonID = model.ID;
        presenter.wrapper = presenter.$view.find('.lines_selection');
        presenter.activity = ModelValidationUtils.validateBoolean(presenter.model['IsActivity']);
        presenter.disabled = ModelValidationUtils.validateBoolean(presenter.model['IsDisabled']);
        presenter.initDisabled = presenter.disabled;
        presenter.isVisible = ModelValidationUtils.validateBoolean(presenter.model["Is Visible"]);
        presenter.initIsVisible = presenter.isVisible;
        presenter.singleMode = ModelValidationUtils.validateBoolean(presenter.model['SingleMode']);
        if (presenter.drawLines(presenter.model['Lines'])) {
            presenter.wrapper.text(presenter.ERROR_CODES[presenter.error])
        } else {
            presenter.updateDisability();
            if (!isPreview) {
                presenter.updateVisibility();
            }
        }
    };

    presenter.drawLines = function(string) {
        if (string == '' || string == undefined) {
            presenter.error = 'lines_empty';
            return true;
        };
        var oneLine,points = [];
        var testString = /^\d+;\d+\-\d+;\d+\-[01]$/;
        var Lines = Helpers.splitLines(string);
        for(var i = 0; i < Lines.length; i++) {
            if (!testString.test(Lines[i])) {
                presenter.error = 'lines_error';
                return true;
            };
        }
        var Width = presenter.wrapper.width();
        var Height = presenter.wrapper.parent().height();
        var $svg = '<svg height="'+Height+'" width="'+Width+'" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="lines_wrapper">';
        for (i = 0; i < Lines.length; i++) {
            oneLine = Lines[i].split('-');
            points[0] = oneLine[0].split(';');
            points[1] = oneLine[1].split(';');
            if (presenter.activity) presenter.answers.push(oneLine[2]);
            if (points[0][0] < 0 || points[0][0] > Width || points[1][0] < 0 || points[1][0] > Width || points[0][1] < 0 || points[0][1] > Height || points[1][1] < 0 || points[1][1] > Height) {
                presenter.error = 'points_out';
                return true;
            }
            $svg += '<line id="line_'+(i)+'" class ="line" x1="' + points[0][0] +'" y1="'+points[0][1]+'" x2="'+points[1][0]+'" y2="'+points[1][1]+'"></line>';
        }
        $svg += '</svg>';
        presenter.wrapper.prepend($svg);
    };

    presenter.run = function(view, model){
        presenter.answers = [];
        presenter.selected = [];
        var presentId, item, value, score;
        presenter.initiate(view, model);
        presenter.$view.find('.line').on('click', function(e){
            e.stopPropagation();
            e.preventDefault();
            if (!presenter.disabled && !presenter.isErrorMode && !presenter.isShowAnswersActive) {
                presenter.isStarted = true;
                presentId = $(this).attr('id').substr(5);
                if ($(this).attr('class') == 'line selected') {
                    $(this).attr('class','line');
                    if (presenter.singleMode)
                        presenter.selected = [];
                    else
                        presenter.selected.splice(presenter.selected.indexOf(presentId),1);
                    value = 0;
                } else {
                    if (presenter.singleMode) {
                        presenter.$view.find('.selected').attr('class','line');
                        presenter.selected = [];
                    }
                    $(this).attr('class','line selected');
                    presenter.selected.push(presentId);
                    value = 1;
                }
                if (presenter.activity)
                    score = presenter.answers[presentId]
                else
                    score = 0;
                item = parseInt(presentId) + 1;
                presenter.triggerEvent(item,value,score);
            }
        });
        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") presenter.showAnswers();
        if (eventName == "HideAnswers") presenter.hideAnswers();
    };

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };

    presenter.createEventData = function(item,value,score) {
        return {
            source : presenter.addonID,
            item : item,
            value : value,
            score : score
        };
    };

    presenter.triggerEvent = function(item, value, score) {
        var eventData = presenter.createEventData(item, value, score);
        presenter.eventBus.sendEvent('ValueChanged', eventData);
        if (presenter.getScore() == presenter.getMaxScore() && presenter.activity && presenter.getErrorCount() == 0) {
            eventData = presenter.createEventData('all','','');
            presenter.eventBus.sendEvent('ValueChanged', eventData);
        }
    };

    presenter.createPreview = function(view, model){
        presenter.answers = [];
        presenter.selected = [];
        presenter.initiate(view, model, true);
        var coordinations = {x:0, y:0};
        if (!presenter.error) {
            var coordinatesContainer = $('<div></div>'),
                xContainer = $('<div>x: <span class="value"></span></div>'),
                yContainer = $('<div>y: <span class="value"></span></div>');
            coordinatesContainer.addClass('coordinates');
            coordinatesContainer.append(xContainer).append(yContainer);
            presenter.wrapper.append(coordinatesContainer);
            function setCalculatedPosition(e) {
                coordinations.x = e.originalEvent.pageX || e.originalEvent.touches[0].pageX;
                coordinations.y = e.originalEvent.pageY || e.originalEvent.touches[0].pageY;
                presenter.mouseSX = parseInt(coordinations.x,10) - parseInt(presenter.wrapper.offset().left,10);
                presenter.mouseSY = parseInt(coordinations.y,10) - parseInt(presenter.wrapper.offset().top,10);
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

            presenter.wrapper.on('mousemove', function(e) {
                setCalculatedPosition(e)
            });
        }
    };

    presenter.setShowErrorsMode = function(){
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        presenter.isErrorMode = true;
        if (presenter.activity) {
            for (var i = 0; i <	presenter.answers.length; i++) {
                if (presenter.answers[presenter.selected[i]] == 1)
                    presenter.$view.find('#line_'+presenter.selected[i]).addClass('correct');
                else
                    presenter.$view.find('#line_'+presenter.selected[i]).addClass('wrong');
            }
        } else
            return 0;
    };

    presenter.setWorkMode = function(){
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        presenter.isErrorMode = false;
        presenter.$view.find('.correct').removeClass('correct');
        presenter.$view.find('.wrong').removeClass('wrong');
    };

    presenter.showAnswers = function () {
        presenter.setWorkMode();
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        if (presenter.activity) {
            presenter.isShowAnswersActive = true;
            presenter.$view.find('.lines_selection').addClass('show_answers');
            presenter.$view.find('.selected').removeClass('selected');
            for (var i = 0; i < presenter.answers.length; i++) {
                if (presenter.answers[i] == 1)
                    presenter.$view.find('#line_'+i).addClass('show_answers_ok');
            }
        }
    };
    presenter.hideAnswers = function () {
        if (presenter.activity) {
            presenter.isShowAnswersActive = false;
            presenter.$view.find('.lines_selection').removeClass('show_answers');
            presenter.$view.find('.show_answers_ok').removeClass('show_answers_ok');
            for (var i = 0; i < presenter.selected.length; i++) {
                presenter.$view.find('#line_'+presenter.selected[i]).addClass('selected');
            }
        }
    };

    presenter.reset = function(){
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        presenter.setWorkMode();
        presenter.selected = [];
        presenter.$view.find('.selected').removeClass('selected');
        presenter.disabled = presenter.initDisabled;
        presenter.isVisible = presenter.initIsVisible;
        presenter.updateDisability();
        presenter.updateVisibility();
        presenter.isStarted = false;
    };

    presenter.getErrorCount = function(){
        var error = 0;
        if (presenter.activity) {
            for (var i = 0; i < presenter.selected.length; i++) {
                if (presenter.answers[presenter.selected[i]] == 0)
                    error++;
            };
            return error;
        } else
            return 0;
    };

    presenter.getMaxScore = function(){
        var maxscore = 0;
        if (presenter.activity) {
            for (var i = 0; i <	presenter.answers.length; i++)
                maxscore += parseInt(presenter.answers[i]);
            return maxscore;
        } else
            return 0;
    };

    presenter.getScore = function(){
        var score = 0;
        if (presenter.activity) {
            for (var i = 0; i < presenter.selected.length; i++) {
                if (presenter.answers[presenter.selected[i]] == 1)
                    score++;
            };
            return score;
        } else
            return 0;
    };

    presenter.getState = function(){
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        return JSON.stringify({
            disabled : presenter.disabled,
            visible : presenter.isVisible,
            lines : presenter.selected,
            isStarted : presenter.isStarted
        });
    };

    presenter.setState = function(state){
        presenter.isVisible = JSON.parse(state).visible;
        presenter.disabled = JSON.parse(state).disabled;
        presenter.selected = JSON.parse(state).lines;
        presenter.isStarted = JSON.parse(state).isStarted;
        for (var i = 0; i < presenter.selected.length; i++) {
            presenter.$view.find('#line_'+presenter.selected[i]).attr('class','line selected');
        }
        presenter.updateDisability();
        presenter.updateVisibility();
    };
    return presenter;
}