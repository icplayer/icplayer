function AddonAnimated_Page_Progress_create() {
    var presenter = function () { };

    var range_img = [],
        range_max_score = [];

    var playerController;
    var eventBus;
    presenter.displayedImage = null;

    presenter.ERROR_CODES = {
        'E_01': "All ranges must be in ascending order",
        'E_02': "Last range must equal 100",
        'E_03': "All ranges must be positive",
        'E_04': "First range must equal 0",
        'E_05': "All scores must be filled"
    };

    function returnErrorObject(errorCode) {
        return { isError: true, errorCode: errorCode };
    }

    presenter.sanitizeModel = function (model)  {

        for (var ranges_prop=0; ranges_prop < model.Ranges.length; ranges_prop++){
            range_img[ranges_prop] = model.Ranges[ranges_prop].Image;
            range_max_score[ranges_prop] = parseFloat(model.Ranges[ranges_prop].Score);
        }

        for (var i=0; i< model.Ranges.length; i++){
            if(!model.Ranges[i].Score){
                return returnErrorObject('E_05');
            }
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

        var isVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);

        return {
            isError: false,
            Ranges: {
                Image: range_img,
                deselected: range_max_score
            },
            length: model.Ranges.length,
            isVisible: isVisible

        }
    };

    presenter.setPlayerController = function(controller) {
        playerController = controller;
    };

    presenter.cleanView = function () {
        presenter.$view.find('.animated-page-progress-rate').each(function () {
            $(this).css('display', 'none');
            $(this).attr('data-name', 'invisible');
        });
    };

    presenter.setViewImage = function (rate) {
        presenter.$view.find('.rate-' + (rate+1)).css('display', 'block');
        presenter.$view.find('.rate-' + (rate+1)).attr('data-name', 'visible');
        presenter.displayedImage = rate;
    };

    presenter.countPercentageScore = function () {
        var scoreService = playerController.getScore(),
            pageScore = scoreService.getPageScoreById(presenter.pageID),
            score = pageScore.score,
            maxScore = pageScore.maxScore;

        presenter.percentageScore = (score/maxScore) * 100;

        if(isNaN(presenter.percentageScore)){
            presenter.percentageScore = 0;
        }

        for (var i=0; i<range_max_score.length; i++){
            if(presenter.percentageScore == 0){
                presenter.cleanView();
                presenter.setViewImage(0);
            }
            if(presenter.percentageScore <= range_max_score[i+1] && presenter.percentageScore > range_max_score[i]){
                presenter.cleanView();
                presenter.setViewImage(i+1);
            }
        }
    };

    presenter.appendImages = function (length) {
        for (var j=0; j<length; j++){
            presenter.$view.find('.animated-page-progress-wrapper').append('<div class="animated-page-progress-rate rate-'+ (j+1) +'"></div>');
            if(range_img[j] != "") {
                presenter.$view.find('.rate-' + (j + 1)).css('background-image', 'url(' + range_img[j] + ')');
            }
            presenter.$view.find('.rate-'+(j+1)).css('display', 'none');
        }
    };

    presenter.eventListener = function () {
        eventBus = playerController.getEventBus();
        presenter.countPercentageScore();
        eventBus.addEventListener('ValueChanged', this);
    };

    presenter.presenterLogic = function (view, model, isPreview) {
    	presenter.$view = $(view);
    	presenter.configuration = presenter.sanitizeModel(model);
        presenter.pageID = $(view).parent('.ic_page').attr('id');

        if(presenter.configuration.isError){
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.appendImages(presenter.configuration.length);

        if(!isPreview) {
            presenter.eventListener();
        }else{
            presenter.setViewImage(0);
        }

    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ValueChanged") {
            presenter.countPercentageScore();
        }
    };

    presenter.getImageId = function () {
        return presenter.$view.find('[data-name="visible"]').attr('id');
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
            displayedImage: presenter.displayedImage,
            isVisible: presenter.configuration.isVisible
        });
    };

    presenter.setState = function (state) {
       if (!state) return;

    	var parsedState = JSON.parse(state);

        presenter.cleanView();
        presenter.setViewImage(parsedState.displayedImage);
        presenter.configuration.isVisible = parsedState.isVisible;
        presenter.setVisibility(presenter.configuration.isVisible);
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

    presenter.reset = function () {
        presenter.cleanView();
        presenter.setViewImage(0);
    };

    return presenter;
}