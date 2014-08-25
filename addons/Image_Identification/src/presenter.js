function AddonImage_Identification_create(){
    var presenter = function() {};

    var playerController;
    var eventBus;

    presenter.lastEvent = null;

    var CSS_CLASSES = {
        ELEMENT : "image-identification-element",
        SELECTED : "image-identification-element-selected",
        CORRECT : "image-identification-element-correct",
        EMPTY : "image-identification-element-empty",
        INCORRECT : "image-identification-element-incorrect",
        MOUSE_HOVER : "image-identification-element-mouse-hover",
        SHOW_ANSWERS : "image-identification-element-show-answers"
    };

    /**
     * @return {string}
     */
    function CSS_CLASSESToString() {
        return CSS_CLASSES.ELEMENT + " " + CSS_CLASSES.SELECTED + " " + CSS_CLASSES.CORRECT + " " +
            CSS_CLASSES.EMPTY + " " + CSS_CLASSES.INCORRECT + " " + CSS_CLASSES.MOUSE_HOVER + " " + CSS_CLASSES.SHOW_ANSWERS;
    }

    function clickLogic() {
        if (presenter.configuration.isErrorCheckMode && (presenter.configuration.isActivity || presenter.configuration.isBlockedInErrorCheckingMode)) return;
        presenter.toggleSelectionState();
        applySelectionStyle(presenter.configuration.isSelected, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
    }

    presenter.handleMouseActions = function() {
        var element = presenter.$view.find('div:first');

        element.hover(
            function() {
                if (presenter.configuration.isErrorCheckMode && (presenter.configuration.isActivity || presenter.configuration.isBlockedInErrorCheckingMode)) return;

                if (presenter.configuration.isHoverEnabled) {
                    $(this).removeClass(CSS_CLASSESToString());
                    $(this).addClass('image-identification-element-mouse-hover');
                }
            },
            function() {
                if (presenter.configuration.isErrorCheckMode && (presenter.configuration.isActivity || presenter.configuration.isBlockedInErrorCheckingMode)) return;

                if (presenter.configuration.isHoverEnabled) {
                    $(this).removeClass(CSS_CLASSESToString());
                    $(this).addClass(presenter.configuration.isSelected ? CSS_CLASSES.SELECTED : CSS_CLASSES.ELEMENT);
                }
            }
        );

        element.on('touchstart', function (e) {
            e.preventDefault();
            e.stopPropagation();

            presenter.lastEvent = e;
        });

        element.on('touchend', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if ( presenter.lastEvent.type != e.type ) {
                clickLogic();
            }
        });

        element.click(function(e) {
            e.stopPropagation();
            clickLogic();
        });

    };

    function setViewDimensions(model) {
        var viewDimensions = DOMOperationsUtils.getOuterDimensions(presenter.$view);
        var viewDistances = DOMOperationsUtils.calculateOuterDistances(viewDimensions);

        presenter.$view.css({
            width:(model.Width - viewDistances.horizontal) + 'px',
            height:(model.Height - viewDistances.vertical) + 'px'
        });
    }

    function loadImage(imageSrc, isPreview) {
        var image = document.createElement('img');
        $(image).attr('src', imageSrc);
        $(image).addClass(presenter.configuration.isSelected ? CSS_CLASSES.SELECTED : CSS_CLASSES.ELEMENT);
        presenter.$view.html(image);

        $(image).load(function () {
            var elementDimensions = DOMOperationsUtils.getOuterDimensions(this);
            var elementDistances = DOMOperationsUtils.calculateOuterDistances(elementDimensions);

            $(this).remove();

            var element = document.createElement('div');
            var innerElement = document.createElement('div');
            $(element).addClass(presenter.configuration.isSelected ? CSS_CLASSES.SELECTED : CSS_CLASSES.ELEMENT);
            $(element).css({
                width:(presenter.$view.width() - elementDistances.horizontal) + 'px',
                height:(presenter.$view.height() - elementDistances.vertical) + 'px'
            });

            $(innerElement).addClass('image-identification-background-image');
            $(innerElement).css({
                backgroundImage:"url('" + imageSrc + "')",
                width:$(element).width() + 'px',
                height:$(element).height() + 'px'
            });

            $(element).html(innerElement);
            presenter.$view.html(element);

            presenter.setVisibility(presenter.configuration.isVisibleByDefault);

            if (!isPreview) {
                presenter.handleMouseActions();
            }

            presenter.$view.trigger("onLoadImageCallbackEnd", []);
            presenter.configuration.isImageLoaded = true;
        });
    }

    function presenterLogic(view, model, preview) {
        presenter.$view = $(view);
        presenter.configuration = presenter.validateModel(model);

        setViewDimensions(model);

        if (ModelValidationUtils.isStringEmpty(presenter.configuration.imageSrc)) {
            return;
        }

        loadImage(presenter.configuration.imageSrc, preview);
    }

    presenter.validateModel = function (model) {
        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);

        return {
            addonID: model.ID,
            isVisible: isVisible,
            isVisibleByDefault: isVisible,
            isSelected: false,
            imageSrc: model.Image,
            shouldBeSelected: ModelValidationUtils.validateBoolean(model.SelectionCorrect),
            isHoverEnabled: true,
            isActivity: !ModelValidationUtils.validateBoolean(model["Is not an activity"]),
            isBlockedInErrorCheckingMode: ModelValidationUtils.validateBoolean(model["Block in error checking mode"]),
            isErrorCheckMode: false
        };
    };

    function applySelectionStyle(selected, selectedClass, unselectedClass) {
        var element = presenter.$view.find('div:first')[0];

        $(element).removeClass(CSS_CLASSESToString());
        $(element).addClass(selected ? selectedClass : unselectedClass);
    }

    presenter.executeCommand = function(name, params) {
        if (presenter.configuration.isActivity && presenter.configuration.isErrorCheckMode) return;

        var commands = {
            'select': presenter.select,
            'deselect': presenter.deselect,
            'isAllOK': presenter.isAllOK,
            'show': presenter.show,
            'hide': presenter.hide,
            'isSelected': presenter.isSelected,
            'markAsCorrect': presenter.markAsCorrect,
            'markAsWrong': presenter.markAsWrong,
            'markAsEmpty': presenter.markAsEmpty,
            'removeMark': presenter.removeMark,
            'showAnswers': presenter.showAnswers,
            'hideAnswers': presenter.hideAnswers
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function() {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function(view, model){
        eventBus = playerController.getEventBus();

        presenterLogic(view, model, false);

        eventBus.addEventListener('ShowAnswers', this);
        eventBus.addEventListener('HideAnswers', this);
    };

    presenter.reset = function() {
        presenter.configuration.isSelected = false;
        presenter.configuration.isErrorCheckMode = false;
        presenter.configuration.isHoverEnabled = false;

        applySelectionStyle(false, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);

        if (presenter.configuration.isVisibleByDefault) {
            presenter.show();
        } else {
            presenter.hide();
        }
    };

    presenter.setWorkMode = function() {
        presenter.configuration.isErrorCheckMode = false;

        if (!presenter.configuration.isActivity) return;

        applySelectionStyle(presenter.configuration.isSelected, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
    };

    presenter.setShowErrorsMode = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        presenter.configuration.isErrorCheckMode = true;

        if (!presenter.configuration.isActivity) return;

        if (presenter.configuration.isSelected) {
            applySelectionStyle(presenter.configuration.isSelected === presenter.configuration.shouldBeSelected, CSS_CLASSES.CORRECT, CSS_CLASSES.INCORRECT);
        } else if (presenter.configuration.shouldBeSelected) {
            applySelectionStyle(true, CSS_CLASSES.EMPTY, CSS_CLASSES.ELEMENT);
        }
    };

    presenter.getErrorCount = function() {
        if (!presenter.configuration.isActivity) return 0;

        if (!presenter.configuration.shouldBeSelected) {
            return presenter.configuration.isSelected ? 1 : 0;
        }
        return 0;
    };

    presenter.getMaxScore = function() {
        if (!presenter.configuration.isActivity) return 0;

        if (presenter.configuration.shouldBeSelected) {
            return 1;
        } else {
            return 0;
        }
    };

    presenter.getScore = function() {
        if (!presenter.configuration.isActivity) return 0;

        if (presenter.configuration.shouldBeSelected) {
            return presenter.configuration.isSelected ? 1 : 0;
        }
        return 0;
    };

    presenter.getState = function() {
        return JSON.stringify({
            isSelected: presenter.configuration.isSelected,
            isVisible: presenter.configuration.isVisible
        });
    };

    function loadImageEndCallback() {
        var state = JSON.parse(presenter.configuration.savedState);
        presenter.configuration.isSelected = state.isSelected;
        presenter.configuration.isVisible = state.isVisible;

        applySelectionStyle(state.isSelected, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
        presenter.setVisibility(state.isVisible);
    }

    presenter.setState = function(stateString) {
        if (ModelValidationUtils.isStringEmpty(stateString)) return;

        presenter.configuration.savedState = stateString;
        presenter.$view.bind("onLoadImageCallbackEnd", function () {
            loadImageEndCallback();
        });

        if (presenter.configuration.isImageLoaded) {
            loadImageEndCallback();
        }
    };

    presenter.createEventData = function(isSelected, shouldBeSelected) {
        var score;
        if (presenter.configuration.isActivity){
            score = shouldBeSelected ? '1' : '0';
        } else {
            score = 0;
        }

        return {
            source : presenter.configuration.addonID,
            item : '',
            value : isSelected ? '1' : '0',
            score : score
        };
    };

    presenter.triggerSelectionEvent = function(isSelected, shouldBeSelected) {
        var eventData = this.createEventData(isSelected, shouldBeSelected);

        if (playerController != null) {
            playerController.getEventBus().sendEvent('ValueChanged', eventData);
        }
    };

    presenter.setPlayerController = function(controller) {
        playerController = controller;
    };

    presenter.select = function () {
        presenter.configuration.isSelected = true;
        presenter.triggerSelectionEvent(true, presenter.configuration.shouldBeSelected);
        applySelectionStyle(true, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
    };

    presenter.deselect = function () {
        presenter.configuration.isSelected = false;
        presenter.triggerSelectionEvent(false, presenter.configuration.shouldBeSelected);
        applySelectionStyle(false, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
    };

    presenter.toggleSelectionState = function() {
        presenter.configuration.isSelected = !presenter.configuration.isSelected;

        presenter.triggerSelectionEvent(presenter.configuration.isSelected, presenter.configuration.shouldBeSelected);
    };

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
    };

    presenter.isSelected = function () {
        return presenter.configuration.isSelected;
    };

    presenter.markAsCorrect = function() {
        presenter.configuration.isHoverEnabled = false;
        presenter.configuration.isMarked = true;

        // Selection can be changed only in activity mode.
        // When module is not in activity mode we want to be able to restore selection after removing mark classes
        if (presenter.configuration.isActivity) {
            presenter.configuration.isSelected = true;
        }

        applySelectionStyle(true, CSS_CLASSES.CORRECT, CSS_CLASSES.ELEMENT);
    };

    presenter.markAsWrong = function() {
        presenter.configuration.isHoverEnabled = false;
        presenter.configuration.isMarked = true;

        // Selection can be changed only in activity mode.
        // When module is not in activity mode we want to be able to restore selection after removing mark classes
        if (presenter.configuration.isActivity) {
            presenter.configuration.isSelected = true;
        }

        applySelectionStyle(true, CSS_CLASSES.INCORRECT, CSS_CLASSES.ELEMENT);
    };

    presenter.markAsEmpty = function() {
        presenter.configuration.isHoverEnabled = false;
        presenter.configuration.isMarked = true;

        applySelectionStyle(true, CSS_CLASSES.EMPTY, CSS_CLASSES.ELEMENT);
    };

    presenter.removeMark = function() {
        if (!presenter.configuration.isMarked) return;

        presenter.configuration.isHoverEnabled = true;
        presenter.configuration.isMarked = false;

        // Selection can be changed only in activity mode.
        // When module is not in activity mode we want to be able to restore selection after removing mark classes
        if (presenter.configuration.isActivity) {
            presenter.configuration.isSelected = true;
        }

        applySelectionStyle(presenter.configuration.isSelected, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    function applySelectionStyleShowAnswers (style){
        var element = presenter.$view.find('div:first')[0];
        $(element).addClass(style);
    }

    function applySelectionStyleHideAnswers (style){
        var element = presenter.$view.find('div:first')[0];

        $(element).removeClass(style);
    }

    presenter.showAnswers = function () {
        presenter.isShowAnswersActive = true;

        presenter.configuration.isErrorCheckMode = true;

        presenter.$view.find('.image-identification-element-incorrect').removeClass(CSS_CLASSES.INCORRECT).addClass("image-identification-element was-selected");
        presenter.$view.find('.image-identification-element-correct').removeClass(CSS_CLASSES.CORRECT).addClass("image-identification-element was-selected");

        if(presenter.configuration.shouldBeSelected){
            applySelectionStyleShowAnswers(CSS_CLASSES.SHOW_ANSWERS);
        }else{
            presenter.$view.find('.image-identification-element-selected').removeClass(CSS_CLASSES.SELECTED).addClass("image-identification-element was-selected");
        }
    };

    presenter.hideAnswers = function () {
        presenter.configuration.isErrorCheckMode = false;

        applySelectionStyleHideAnswers(CSS_CLASSES.SHOW_ANSWERS);

         var elementWasSelected = presenter.$view.find('.was-selected');
         $(elementWasSelected).addClass(CSS_CLASSES.SELECTED).removeClass("was-selected");

        presenter.isShowAnswersActive = false;
    };

    return presenter;
}