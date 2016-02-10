function Addontext_identification_create(){
    var presenter = function() {};

    var viewContainer;
    var isHoverEnabled = true;
    
    presenter.playerController = null;
    presenter.eventBus = null;
    presenter.lastEvent = null;
    
    var CSS_CLASSES = {
        ELEMENT : "text-identification-element",
        SELECTED : "text-identification-element-selected",
        CORRECT : "text-identification-element-correct",
        INCORRECT : "text-identification-element-incorrect",
        EMPTY : 'text-identification-element-empty',
        MOUSE_HOVER_SELECTED : "text-identification-element-mouse-hover-selected",
        MOUSE_HOVER : "text-identification-element-mouse-hover",
        SHOW_ANSWERS : "text-identification-element-show-answers"

    };

    function CSS_CLASSESToString() {
        return CSS_CLASSES.ELEMENT + " " + CSS_CLASSES.SELECTED + " " + CSS_CLASSES.CORRECT + " " +
            CSS_CLASSES.INCORRECT + " " + CSS_CLASSES.EMPTY + " " + CSS_CLASSES.MOUSE_HOVER + " " + CSS_CLASSES.MOUSE_HOVER_SELECTED+ " " + CSS_CLASSES.SHOW_ANSWERS;
    }

    presenter.executeUserEventCode = function () {
        if (presenter.playerController == null) return;

        if (!presenter.isSelected()) {
            if (presenter.configuration.onDeselected) {
                presenter.playerController.getCommands().executeEventCode(presenter.configuration.onDeselected);
            }
        } else {
            if (presenter.configuration.onSelected) {
                presenter.playerController.getCommands().executeEventCode(presenter.configuration.onSelected);
            }
        }
    };

    presenter.triggerSelectionChangeEvent = function() {
        if (presenter.playerController == null) return;

        presenter.playerController.getEventBus().sendEvent('ValueChanged', this.createEventData());
    };

    presenter.clickHandler = function (e) {
        e.stopPropagation();
        if (presenter.configuration.isErrorCheckMode) return;
        presenter.configuration.isSelected = !presenter.configuration.isSelected;
        presenter.applySelectionStyle(presenter.isSelected(), CSS_CLASSES.MOUSE_HOVER_SELECTED, CSS_CLASSES.ELEMENT);
        presenter.executeUserEventCode();
        presenter.triggerSelectionChangeEvent();
        if (presenter.isAllOK()) sendAllOKEvent();
    };

    function handleMouseActions() {
        var $element = viewContainer.find('div.text-identification-container');
        $element.hover(
            function() {
                if (!presenter.configuration.isErrorCheckMode && isHoverEnabled) {
                    $(this).removeClass(CSS_CLASSESToString());
                    $(this).addClass(presenter.isSelected() ? CSS_CLASSES.MOUSE_HOVER_SELECTED : CSS_CLASSES.MOUSE_HOVER);
                }
            },
            function() {
                if (!presenter.configuration.isErrorCheckMode && isHoverEnabled) {
                    $(this).removeClass(CSS_CLASSESToString());
                    $(this).addClass(presenter.isSelected() ? CSS_CLASSES.SELECTED : CSS_CLASSES.ELEMENT);
                }
            }
        );

        $element.on('touchstart', function (e) {
            e.preventDefault();

            presenter.lastEvent = e;
        });

        $element.on('touchend', function (e) {
            e.preventDefault();
            if ( presenter.lastEvent.type != e.type ) {
                presenter.clickHandler(e);
            }
        });

        $element.click(presenter.clickHandler);
    }

    presenter.validateModel = function (model) {
        return {
            addonID: model.ID,
            onSelected: model.onSelected,
            onDeselected: model.onDeselected,
            shouldBeSelected: ModelValidationUtils.validateBoolean(model.SelectionCorrect),
            isSelected: false,
            isErrorCheckMode: false
        };
    };

    presenter.centerElements = function ($text, $container) {
        $.when(presenter.mathJaxProcessEnded).then(function () {
            var contentWidth = parseInt($text.css('width'), 10),
                contentHeight = parseInt($text.css('height'), 10),
                containerWidth = parseInt(viewContainer.css('width'), 10),
                containerHeight = parseInt(viewContainer.css('height'), 10);

            $text.css({
                left: Math.round((containerWidth - contentWidth) / 2) + 'px',
                top: Math.round((containerHeight - contentHeight) / 2) + 'px'
            });

            $container.css({
                width: containerWidth + 'px',
                height: containerHeight + 'px'
            });
        });
    };

    function presenterLogic(view, model, isPreview) {
        presenter.registerMathJaxListener(isPreview);

        viewContainer = $(view);
        presenter.$view = $(view);
        presenter.currentPageId = presenter.$view.parent('.ic_page').attr('id');
        var textSrc = model.Text;
        presenter.moduleID = model.ID;
        presenter.configuration = presenter.validateModel(model);

        var container = $('<div class="text-identification-container"></div>');
        container.addClass(presenter.isSelected() ? CSS_CLASSES.SELECTED : CSS_CLASSES.ELEMENT);

        var text = $('<div class="text-identification-content"></div>');
        text.html(textSrc);
        container.append(text);

        viewContainer.append(container);
        presenter.centerElements(text, container);

        if (!isPreview) handleMouseActions();
    }

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
    };

    presenter.applySelectionStyle = function (selected, selectedClass, unselectedClass) {
        var element = viewContainer.find('div:first')[0];

        $(element).removeClass(CSS_CLASSESToString());
        $(element).addClass(selected ? selectedClass : unselectedClass);
    };

    presenter.select = function () {
        presenter.configuration.isSelected = true;
        presenter.executeUserEventCode();
        presenter.applySelectionStyle(true, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
    };

    presenter.deselect = function () {
        presenter.configuration.isSelected = false;
        presenter.executeUserEventCode();
        presenter.applySelectionStyle(false, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
    };

    presenter.isSelected = function () {
        return presenter.configuration.isSelected;
    };

    presenter.markAsCorrect = function() {
        isHoverEnabled = false;
        presenter.configuration.isSelected = true;
        presenter.applySelectionStyle(true, CSS_CLASSES.CORRECT, CSS_CLASSES.ELEMENT);
    };

    presenter.markAsWrong = function() {
        isHoverEnabled = false;
        presenter.configuration.isSelected = true;
        presenter.applySelectionStyle(true, CSS_CLASSES.INCORRECT, CSS_CLASSES.ELEMENT);
    };

    presenter.markAsEmpty = function() {
        isHoverEnabled = false;
        presenter.applySelectionStyle(true, CSS_CLASSES.EMPTY, CSS_CLASSES.ELEMENT);
    };

    function sendAllOKEvent() {
        var eventData = {
            'source': presenter.moduleID,
            'item': 'all',
            'value': '',
            'score': ''
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    }

    presenter.executeCommand = function(name, params) {
        if (presenter.configuration.isErrorCheckMode) return;

        var commands = {
            'select': presenter.select,
            'deselect': presenter.deselect,
            'isSelected': presenter.isSelected,
            'markAsCorrect': presenter.markAsCorrect,
            'markAsWrong': presenter.markAsWrong,
            'markAsEmpty': presenter.markAsEmpty,
            'isAllOK': presenter.isAllOK
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.registerMathJaxListener = function (isPreview) {
        var mathJaxDeferred = new jQuery.Deferred();
        presenter.mathJaxProcessEndedDeferred = mathJaxDeferred;
        presenter.mathJaxProcessEnded = mathJaxDeferred.promise();

        MathJax.Hub.Register.MessageHook("End Process", function (message) {
            // We're listening for "End Process" that was fired for ic_page into which addon was inserted.
            // This way we're not reacting on events from other page in Book View.
            if (isPreview || ($(message[1]).hasClass('ic_page') && $(message[1]).is('#' + presenter.currentPageId))) {
                presenter.mathJaxProcessEndedDeferred.resolve();
            }
        });
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function(view, model){
        presenterLogic(view, model, false);

        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
    };

    presenter.reset = function() {
        presenter.configuration.isSelected = false;
        presenter.configuration.isErrorCheckMode = false;
        isHoverEnabled = true;
        presenter.applySelectionStyle(presenter.isSelected(), CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
    };

    presenter.setWorkMode = function() {
        presenter.configuration.isErrorCheckMode = false;

        presenter.applySelectionStyle(presenter.isSelected(), CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
    };

    presenter.setShowErrorsMode = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        presenter.configuration.isErrorCheckMode = true;

        if (presenter.isSelected()) {
            presenter.applySelectionStyle(presenter.isSelected() === presenter.configuration.shouldBeSelected, CSS_CLASSES.CORRECT, CSS_CLASSES.INCORRECT);
        } else if (presenter.configuration.shouldBeSelected) {
            presenter.applySelectionStyle(true, CSS_CLASSES.EMPTY, CSS_CLASSES.ELEMENT)
        }
    };

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
    };

    presenter.getErrorCount = function() {
        return !presenter.configuration.shouldBeSelected && presenter.isSelected() ? 1 : 0;
    };

    presenter.getMaxScore = function() {
        return presenter.configuration.shouldBeSelected ? 1 : 0;
    };

    presenter.getScore = function() {
        return presenter.configuration.shouldBeSelected && presenter.isSelected() ? 1 : 0;
    };

    presenter.getState = function() {
        return presenter.isSelected() ? 'True' : 'False';
    };

    presenter.setState = function(state) {
        presenter.configuration.isSelected = state.toString() === "True";

        presenter.applySelectionStyle(presenter.isSelected(), CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
    };

    presenter.createEventData = function() {
        return {
            'source' : presenter.configuration.addonID,
            'item' : '1',
            'value' : presenter.isSelected() ? '1' : '0',
            'score' : presenter.configuration.shouldBeSelected ? '1' : '0'
        }
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
        $(element).removeClass(CSS_CLASSES.EMPTY).addClass(CSS_CLASSES.ELEMENT);
    }

    presenter.showAnswers = function () {
        presenter.isShowAnswersActive = true;

        presenter.configuration.isErrorCheckMode = true;

        presenter.$view.find('.text-identification-element-incorrect').removeClass(CSS_CLASSES.INCORRECT).addClass("text-identification-element was-selected");
        presenter.$view.find('.text-identification-element-correct').removeClass(CSS_CLASSES.CORRECT).addClass("text-identification-element was-selected");

        if(presenter.configuration.shouldBeSelected){
            applySelectionStyleShowAnswers(CSS_CLASSES.SHOW_ANSWERS);
        }else{
            presenter.$view.find('.text-identification-element-selected').removeClass(CSS_CLASSES.SELECTED).addClass("text-identification-element was-selected");
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