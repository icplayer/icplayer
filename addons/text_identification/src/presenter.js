function Addontext_identification_create(){
    var presenter = function() {};

    var viewContainer;
    presenter.isSelected = false;
    presenter.shouldBeSelected = false;
    var isErrorCheckMode = false;
    var isHoverEnabled = true;

    presenter.addonID = null;
    presenter.playerController = null;
    presenter.onSelected = null;
    presenter.onDeselected = null;
    presenter.eventBus = null;

    var CSS_CLASSES = {
        ELEMENT : "text-identification-element",
        SELECTED : "text-identification-element-selected",
        CORRECT : "text-identification-element-correct",
        INCORRECT : "text-identification-element-incorrect",
        EMPTY : 'text-identification-element-empty',
        MOUSE_HOVER_SELECTED : "text-identification-element-mouse-hover-selected",
        MOUSE_HOVER : "text-identification-element-mouse-hover"

    };

    function CSS_CLASSESToString() {
        return CSS_CLASSES.ELEMENT + " " + CSS_CLASSES.SELECTED + " " + CSS_CLASSES.CORRECT + " " +
            CSS_CLASSES.INCORRECT + " " + CSS_CLASSES.EMPTY + " " + CSS_CLASSES.MOUSE_HOVER + " " + CSS_CLASSES.MOUSE_HOVER_SELECTED;
    }

    function handleMouseActions() {
        var element = viewContainer.find('div.text-identification-container');

        element.hover(
            function() {
                if (!isErrorCheckMode && isHoverEnabled) {
                    $(this).removeClass(CSS_CLASSESToString());
                    $(this).addClass(presenter.isSelected ? CSS_CLASSES.MOUSE_HOVER_SELECTED : CSS_CLASSES.MOUSE_HOVER);
                }
            },
            function() {
                if (!isErrorCheckMode && isHoverEnabled) {
                    $(this).removeClass(CSS_CLASSESToString());
                    $(this).addClass(presenter.isSelected ? CSS_CLASSES.SELECTED : CSS_CLASSES.ELEMENT);
                }
            }
        );

        element.click(function() {
            if (!isErrorCheckMode) {
                presenter.isSelected = !presenter.isSelected;
                var eventData = presenter.createEventData();
                presenter.eventBus.sendEvent('ValueChanged', eventData);
                $(this).removeClass(CSS_CLASSESToString());
                $(this).addClass(presenter.isSelected ? CSS_CLASSES.MOUSE_HOVER_SELECTED : CSS_CLASSES.ELEMENT);

                if(!presenter.isSelected) {
                    if(presenter.onDeselected) {
                        presenter.playerController.getCommands().executeEventCode(presenter.onDeselected);
                    }
                } else {
                    if(presenter.onSelected) {
                        presenter.playerController.getCommands().executeEventCode(presenter.onSelected);
                    }
                }
            }
        });
    }

    function presenterLogic(view, model) {
        viewContainer = $(view);
        var textSrc = model.Text;
        presenter.shouldBeSelected = model.SelectionCorrect === 'True';
        presenter.addonID = model.ID;
        var container = $('<div class="text-identification-container"></div>');
        container.addClass(presenter.isSelected ? CSS_CLASSES.SELECTED : CSS_CLASSES.ELEMENT);


        var text = $('<div class="text-identification-content"></div>');
        text.html(textSrc);
        container.append(text);

        viewContainer.append(container);

        var contentWidth = parseInt(text.css('width'));
        var contentHeight = parseInt(text.css('height'));

        var containerWidth = parseInt(viewContainer.css('width'));
        var containerHeight = parseInt(viewContainer.css('height'));

        text.css({
            left: Math.round((containerWidth - contentWidth) / 2) + 'px',
            top:  Math.round((containerHeight - contentHeight) / 2) + 'px'
        });

        container.css({
            width: containerWidth + 'px',
            height: containerHeight + 'px'
        });


        copyEventToPresenter(model, 'onSelected');
        copyEventToPresenter(model, 'onDeselected');

        handleMouseActions();
    }

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
    };

    function copyEventToPresenter(model, name) {
        if(typeof(model[name]) != 'undefined' && (typeof(model[name] == "string") && model[name] !== "")) {
            presenter[name] = model[name];
        }
    }

    function applySelectionStyle(selected, selectedClass, unselectedClass) {
        var element = viewContainer.find('div:first')[0];

        $(element).removeClass(CSS_CLASSESToString());
        $(element).addClass(selected ? selectedClass : unselectedClass);
    }

    presenter.select = function () {
        presenter.isSelected = true;
        if (presenter.onSelected) {
            presenter.playerController.getCommands().executeEventCode(presenter.onSelected);
        }
        applySelectionStyle(true, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
    };

    presenter.deselect = function () {
        presenter.isSelected = false;
        if (presenter.onDeselected) {
            presenter.playerController.getCommands().executeEventCode(presenter.onDeselected);
        }
        applySelectionStyle(false, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
    };

    presenter.markAsCorrect = function() {
        isHoverEnabled = false;
        presenter.isSelected = true;
        applySelectionStyle(true, CSS_CLASSES.CORRECT, CSS_CLASSES.ELEMENT);
    };

    presenter.markAsWrong = function() {
        isHoverEnabled = false;
        presenter.isSelected = true;
        applySelectionStyle(true, CSS_CLASSES.INCORRECT, CSS_CLASSES.ELEMENT);
    };

    presenter.markAsEmpty = function() {
        isHoverEnabled = false;
        applySelectionStyle(true, CSS_CLASSES.EMPTY, CSS_CLASSES.ELEMENT);
    };

    presenter.executeCommand = function(name, params) {
        if (isErrorCheckMode) return;

        var commands = {
            'select': presenter.select,
            'deselect': presenter.deselect,
            'markAsCorrect': presenter.markAsCorrect,
            'markAsWrong': presenter.markAsWrong,
            'markAsEmpty': presenter.markAsEmpty
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model);
    };

    presenter.run = function(view, model){
        presenterLogic(view, model);
        presenter.eventBus = presenter.playerController.getEventBus();
    };

    presenter.reset = function() {
        presenter.isSelected = false;
        isErrorCheckMode = false;
        isHoverEnabled = true;
        applySelectionStyle(presenter.isSelected, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
    };

    presenter.setWorkMode = function() {
        isErrorCheckMode = false;

        applySelectionStyle(presenter.isSelected, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
    };

    presenter.setShowErrorsMode = function() {
        isErrorCheckMode = true;

        if (presenter.isSelected) {
            applySelectionStyle(presenter.isSelected === presenter.shouldBeSelected, CSS_CLASSES.CORRECT, CSS_CLASSES.INCORRECT);
        } else if (presenter.shouldBeSelected) {
            applySelectionStyle(true, CSS_CLASSES.EMPTY, CSS_CLASSES.ELEMENT)
        }

    };

    presenter.getErrorCount = function() {
        return !presenter.shouldBeSelected && presenter.isSelected ? 1 : 0;
    };

    presenter.getMaxScore = function() {
        return presenter.shouldBeSelected ? 1 : 0;
    };

    presenter.getScore = function() {
        return presenter.shouldBeSelected && presenter.isSelected ? 1 : 0;
    };

    presenter.getState = function() {
        return presenter.isSelected ? 'True' : 'False';
    };

    presenter.setState = function(state) {
        presenter.isSelected = state.toString() === "True";

        applySelectionStyle(presenter.isSelected, CSS_CLASSES.SELECTED, CSS_CLASSES.ELEMENT);
    };

    presenter.createEventData = function() {
        return {
            'source' : presenter.addonID,
            'item' : '1',
            'value' : presenter.isSelected ? '1' : '0',
            'score' : presenter.shouldBeSelected ? '1' : '0'
        }
    };

    return presenter;
}