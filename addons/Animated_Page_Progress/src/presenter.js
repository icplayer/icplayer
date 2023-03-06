function AddonAnimated_Page_Progress_create() {
    var presenter = function () {};

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

    presenter.sanitizeModel = function (model) {
        var rangeImage = [], rangeMaxScore = [], i;

        for (i = 0; i < model.Ranges.length; i++) {
            rangeImage[i] = model.Ranges[i].Image;
            rangeMaxScore[i] = parseFloat(model.Ranges[i].Score);
        }

        for (i = 0; i < model.Ranges.length; i++) {
            if (!model.Ranges[i].Score) {
                return returnErrorObject('E_05');
            }
            if (rangeMaxScore[i] > rangeMaxScore[i + 1]) {
                return returnErrorObject('E_01');
            }
            if (rangeMaxScore[i] < 0) {
                return returnErrorObject('E_03');
            }
        }

        if (rangeMaxScore[model.Ranges.length - 1] != 100) {
            return returnErrorObject('E_02');
        }

        if (rangeMaxScore[0] != 0) {
            return returnErrorObject('E_04');
        }

        return {
            isError: false,
            ranges: {
                images: rangeImage,
                maxScores: rangeMaxScore
            },
            length: model.Ranges.length,
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            initialImage: model['Initial image'],
            workInCheckMode: ModelValidationUtils.validateBoolean(model['Work in Check Mode'])
        }
    };

    presenter.setPlayerController = function(controller) {
        playerController = controller;
        var currentPageIndex = playerController.getCurrentPageIndex();
        presenter.pageID = playerController.getPresentation().getPage(currentPageIndex).getId();
        presenter.scoreService = playerController.getScore();
    };

    presenter.cleanView = function () {
        presenter.$view.find('.animated-page-progress-rate').each(function () {
            $(this).css('display', 'none');
            $(this).attr('data-name', 'invisible');
        });
    };

    presenter.setViewImage = function (rate) {
        var $rate;

        if (rate == "initial") {
            $rate = presenter.$view.find('.rate-initial');
        } else {
            $rate = presenter.$view.find('.rate-' + (rate + 1));
        }

        $rate.css('display', 'block');
        $rate.attr('data-name', 'visible');

        presenter.displayedImage = rate;
    };

    presenter.getRange = function (pageScore) {
        var score = pageScore.score,
            maxScore = pageScore.maxScore,
            percentageScore = (score / maxScore) * 100,
            maxScores = presenter.configuration.ranges.maxScores;

        if (isNaN(percentageScore)) {
            percentageScore = 0;
        }

        for (var i = 0; i < maxScores.length; i++) {
            if (percentageScore == 0) {
                return 0;
            }
            if (percentageScore == 100 && maxScores[i] == 100) {
                return i;
            }
            if (percentageScore >= maxScores[i] && percentageScore < maxScores[i + 1]) {
                return i;
            }
        }
    };

    presenter.changeRange = function () {
        var pageScore = presenter.scoreService.getPageScoreById(presenter.pageID),
            range = presenter.getRange(pageScore);

        presenter.cleanView();
        presenter.setViewImage(range);
    };

    presenter.appendImages = function (length) {
        var $wrapper = presenter.$view.find('.animated-page-progress-wrapper'),
            images = presenter.configuration.ranges.images;

        for (var i = 0; i < length; i++) {
            var $rate = $(document.createElement('div'));

            $rate.addClass('animated-page-progress-rate rate-' + (i + 1)).css('display', 'none');

            if (images[i] != "") {
                $rate.css('background-image', 'url(' + images[i] + ')');
            }

            $wrapper.append($rate);
        }

        if (presenter.configuration.initialImage) {
            var $initialRate = $(document.createElement('div'));

            $initialRate.addClass('animated-page-progress-rate rate-initial');
            $initialRate.css({
                'display': 'none',
                'background-image': 'url(' + presenter.configuration.initialImage + ')'
            });

            $wrapper.append($initialRate);
        }
    };

    presenter.eventListener = function () {
        eventBus = playerController.getEventBus();
        eventBus.addEventListener('ValueChanged', this, true);
        eventBus.addEventListener('ShowAnswers', this);
        eventBus.addEventListener('HideAnswers', this);
        eventBus.addEventListener('PageLoaded', this);
    };

    presenter.presenterLogic = function (view, model, isPreview) {
        presenter.$view = $(view);
        presenter.configuration = presenter.sanitizeModel(model);

        if (presenter.configuration.isError){
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.appendImages(presenter.configuration.ranges.images.length);

        if (!isPreview) {
            presenter.eventListener();
        }

        presenter.setViewImage(presenter.configuration.initialImage ? "initial" : 0);
    };

    presenter.onEventReceived = function (eventName, eventData) {
        switch (eventName) {
            case "ValueChanged":
                if (!presenter.isShowAnswersActive && !presenter.configuration.workInCheckMode ||
                    !presenter.isShowAnswersActive && presenter.configuration.workInCheckMode && eventData.value === "resetClicked") {
                    presenter.changeRange();
                }
                break;

            case "ShowAnswers":
                presenter.showAnswers();
                break;

            case "HideAnswers":
                presenter.hideAnswers();
                break;

            case "PageLoaded":
                presenter.changeRange();
                break;
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

    presenter.isCommonsPage = function() {
        return presenter.pageID != presenter.$view.parent().attr("id");
    };

    presenter.getCurrentPageIndex = function() {
        return playerController.getCurrentPageIndex();
    };

    presenter.getState = function () {
        if (presenter.configuration.isError) {
            return "";
        }

        var currentPageIndex = presenter.getCurrentPageIndex();

        if(presenter.isCommonsPage()) {
            if (typeof presenter.states == "undefined") {
                presenter.states = {};
                presenter.pageState = {};
            }

            presenter.pageState = {
                displayedImage: presenter.displayedImage,
                isVisible: presenter.configuration.isVisible
            };

            presenter.states[currentPageIndex] = presenter.pageState;

            return JSON.stringify(presenter.states);
        } else {
            return JSON.stringify({
                pageIndex: currentPageIndex,
                displayedImage: presenter.displayedImage,
                isVisible: presenter.configuration.isVisible
            });
        }
    };

    presenter.setState = function (state) {
        if (!state) return;

        var currentPageIndex = presenter.getCurrentPageIndex(),
            displayedImage,
            parsedState;

        presenter.states = JSON.parse(state);

        if(presenter.isCommonsPage()) {
            parsedState = presenter.states[currentPageIndex];
        } else {
            parsedState = presenter.states;
        }

        if (typeof parsedState == "undefined") {
            parsedState = '';
            displayedImage = presenter.configuration.initialImage ? "initial" : 0;
        } else {
            displayedImage = parsedState.displayedImage;
        }

        presenter.cleanView();
        presenter.setViewImage(displayedImage);
        presenter.configuration.isVisible = parsedState.isVisible;
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.setShowErrorsMode = function(){
        if(presenter.configuration.workInCheckMode){
            presenter.changeRange();
        }
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
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        presenter.cleanView();
        presenter.setViewImage(presenter.configuration.initialImage ? "initial" : 0);
    };

    presenter.showAnswers = function () {
        presenter.isShowAnswersActive = true;
    };

    presenter.hideAnswers = function () {
        presenter.isShowAnswersActive = false;
    };

    return presenter;
}