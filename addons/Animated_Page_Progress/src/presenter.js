function AddonAnimated_Page_Progress_create() {
    var presenter = function () { };

    var range_img = [],
        range_max_score = [];

    var playerController;
    var eventBus;

    presenter.ERROR_CODES = {
        'E_01': "All ranges must be in ascending order",
        'E_02': "Last range must equal 100",
        'E_03': "All ranges must be positive",
        'E_04': "First range must equal 0"
    };

    function returnErrorObject(errorCode) {
        return { isError: true, errorCode: errorCode };
    }

    presenter.sanitizeModel = function (model)  {

        for (var ranges_prop=0; ranges_prop < model.Ranges.length; ranges_prop++){
            range_img[ranges_prop] = model.Ranges[ranges_prop].Image;
            range_max_score[ranges_prop] = parseFloat(model.Ranges[ranges_prop]['Max_Score']);
        }

        for (var i=0; i< model.Ranges.length; i++){
            if(range_max_score[i]> range_max_score[i+1]){
                return returnErrorObject('E_01');
            }
            if(range_max_score[i] < 0){
                return returnErrorObject('E_03');
            }
        }

        if(range_max_score[model.Ranges.length-1] != 100){
            return returnErrorObject('E_02');
        }

        if(range_max_score[0] != 0){
            return returnErrorObject('E_04');
        }

        return {
            isError: false,
            Ranges: {
                Image: range_img,
                deselected: range_max_score
            }
        }
    };

    presenter.setPlayerController = function(controller) {
        playerController = controller;
    };

    presenter.cleanView = function () {
        presenter.$view.find('.image').each(function () {
            $(this).css('display', 'none');
        });
    };

    presenter.countPercentageScore = function () {
        var scoreService = playerController.getScore(),
            pageScore = scoreService.getPageScoreById(presenter.pageID),
            score = pageScore.score,
            maxScore = pageScore.maxScore;

        var percentageScore = (score/maxScore) * 100;

        if(isNaN(percentageScore)){
            percentageScore = 0;
        }

        console.log('PageId: ' + presenter.pageID);
        console.log('Score: ' + score);
        console.log('maxScore: ' + maxScore);
        console.log('Percentage Score: ' + percentageScore);

        for (var i=0; i<range_max_score.length; i++){
            if(percentageScore == 0){
                presenter.cleanView();
                presenter.$view.find('#0').css('display', 'block');
            }
            if(percentageScore <= range_max_score[i+1] && percentageScore > range_max_score[i]){
                presenter.cleanView();
                presenter.$view.find('#'+(i+1)).css('display', 'block');
            }
        }
    };

    presenter.presenterLogic = function (view, model, isPreview) {
    	presenter.$view = $(view);
    	presenter.configuration = presenter.sanitizeModel(model);
        presenter.pageID = $(view).parent('.ic_page').attr('id');

        if(presenter.configuration.isError){
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        for (var j=0; j<model.Ranges.length; j++){
            presenter.$view.find('.animated-page-progress-wrapper').append('<div id="'+ j +'" class="image"></div>');
            //presenter.$view.find('#'+j).css('background-image', 'url(' + range_img[j] + ')');
            presenter.$view.find('#' + j).append('<img class="img'+ j +'">');
            presenter.$view.find('.img' + j).attr('src', range_img[j]);
            presenter.$view.find('#'+j).css('display', 'none');
        }

        if(!isPreview) {
            eventBus = playerController.getEventBus();
            presenter.countPercentageScore();
            eventBus.addEventListener('ValueChanged', this);
        }

    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ValueChanged") {
            presenter.countPercentageScore();
        }
    };

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model, false);
    };
    
    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model, true);
    };


    presenter.getState = function () {
        if (presenter.configuration.isError) {
            return "";
        }

    	return JSON.stringify({
        });
    };

    presenter.setState = function (state) {
       if (!state) return;

    	var parsedState = JSON.parse(state);
    };
    
    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css('visibility', isVisible ? 'visible' : 'hidden');
    };
    
    presenter.hide = function () {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.show = function () {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    return presenter;
}