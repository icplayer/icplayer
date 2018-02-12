function AddonBoard_Game_create(){

    var presenter = function() {
    };

    presenter.ERROR_CODES = {
        'F01': 'Field is outside of addon!',
        'I01': 'Element is outside of addon!',
        "CSS01": "Provided css class name is not valid class name",
        "EV01": "Provided game type is not valid",
    };

    presenter.currentElement = 0;
    presenter.mouseX = 0;
    presenter.mouseY = 0;
    presenter.isElementInMove = false;
    presenter.isErrorCheckingMode = false;
    presenter.showAnswersMode = false;
    presenter.isDisabled = false;
    presenter.hasFields = false;
    presenter.currentLeftValue = [];
    presenter.currentTopValue = [];
    presenter.originalLeftValue = [];
    presenter.originalTopValue = [];
    presenter.lastSelectedCounter = null;
    presenter.boardCounters = [];
    presenter.fields = [];
    presenter.gameTypes = {
        GAME: "Game",
        FREE: "Free"
    };
    presenter.counterPositions = [];
    


    presenter.executeCommand = function(name, params) {
        switch (name.toLowerCase()) {
            case 'enable'.toLowerCase():
                presenter.enable();
                break;
            case 'disable'.toLowerCase():
                presenter.disable();
                break;
            case 'show'.toLowerCase():
                presenter.show();
                break;
            case 'hide'.toLowerCase():
                presenter.hide();
                break;
            case 'reset'.toLowerCase():
                presenter.reset();
                break;
        }
    };

    presenter.drawBoard = function(view, model) {
        presenter.$view = $(view);
        presenter.model = model;

        presenter.Height = model.Height;
        presenter.Width = model.Width;

        presenter.$view.find('.board-game-container').css({
            'width' : presenter.Width,
            'height' : presenter.Height,
            'background-image' : 'url('+ model.Background + ')'
        });

        var fig = '',
            i;

        if(model.hasFields || presenter.gameMode !== presenter.gameTypes.FREE){
            for(i = 0; i < presenter.fieldsLength; i++){
                fig += '<div id="Field' + (i + 1) + '" class="board-game-field" style=""></div>';
            }
        }
        for(i = 0; i < model.Images.length; i++){
            fig += '<div id="Element' + (i + 1) +'" class="board-game-element" style="background-image: url(' + model.Images[i].PawnImage + '); -moz-background-size:100% 100%; -webkit-background-size:100% 100%; background-size:100% 100%;; height: ' + model.Images[i].Height + 'px; width: ' + model.Images[i].Width + 'px;  "></div>';
            presenter.currentLeftValue[i] = model.Images[i].Left;
            presenter.currentTopValue[i] = model.Images[i].Top;
            presenter.originalLeftValue[i] = model.Images[i].Left;
            presenter.originalTopValue[i] = model.Images[i].Top;
        }

        return fig;
    };

    presenter.upgradeFields = function (model) {
        var fields = model["Fields"];

        fields.forEach(function (element) {
            if (!element["cssClass"]) {
                element["cssClass"] = "";
            }
        });

        return model;
    };

    presenter.upgradeModel = function (model) {
        if (!model["isDisabled"]) {
            model["isDisabled"] = false;
        }

        if (!model["gameMode"]) {
            model["gameMode"] = "Free";
        }

        model = presenter.upgradeFields(model);

        return model;
    };

    presenter.validateFieldsSizes = function (model) {
        var i,
            field;

        for(i = 0; i < model.Fields.length; i++) {
            field = model.Fields[i];
            if (field.Left + field.Width > model.Width || field.Top + field.Height > model.Height) {
                return {
                    isValid: false,
                    errorCode: "F01"
                };
            }
        }

        return  {
            isValid: true
        };
    };

    presenter.validateImagesSizes = function (model) {
        var i,
            image;

        for(i = 0; i < model.Images.length; i++) {
            image = model.Images[i];
            if (image.Left + image.Width > model.Width || image.Top + image.Height > model.Height) {
                return {
                    isValid: false,
                    errorCode: "I01"
                };
            }
        }

        return {
            isValid: true
        };
    };

    presenter.validateModel = function (model) {
        model = presenter.upgradeModel(model);

        var modelValidator = new ModelValidator();

        var validatedModel = modelValidator.validate(model, [
            ModelValidators.Boolean("hasFields"),
            ModelValidators.Enum("gameMode", {values: ["Free", "Game"], useLowerCase: false}),
            ModelValidators.List("Fields", [
                ModelValidators.DumbInteger("Top"),
                ModelValidators.DumbInteger("Left"),
                ModelValidators.DumbInteger("Width"),
                ModelValidators.DumbInteger("Height"),
                ModelValidators.CSSClass("cssClass", {optional: true})
            ], function () {
                return this.validatedModel['hasFields'] || this.validatedModel["gameMode"] !== presenter.gameTypes.FREE;
            }),
            ModelValidators.List("Images", [
                ModelValidators.DumbInteger("Top"),
                ModelValidators.DumbInteger("Left"),
                ModelValidators.DumbInteger("Width"),
                ModelValidators.DumbInteger("Height"),
                ModelValidators.DumbString("PawnImage")
            ]),
            ModelValidators.Boolean("isDisabled"),
            ModelValidators.DumbInteger("Width"),
            ModelValidators.DumbInteger("Height"),
            ModelValidators.DumbString("ID"),
            ModelValidators.Boolean("Is Visible"),
            ModelValidators.DumbString("Background"),
        ]);

        if (!validatedModel.isValid) {
            return validatedModel;
        }

        var validatedFields,
            validatedImages;

        if (validatedModel.value["hasFields"] || validatedModel.value["gameMode"] !== presenter.gameTypes.FREE) {
            validatedFields = presenter.validateFieldsSizes(validatedModel.value);
            if (!validatedFields.isValid) {
                return validatedFields;
            }
        }

        validatedImages = presenter.validateImagesSizes(validatedModel.value);
        if (!validatedImages.isValid) {
            return validatedImages;
        }

        return validatedModel;

    };

    presenter.selectCounter = function (element, index) {
        presenter.deselectLastCounter();

        presenter.lastSelectedCounter = index;

        element.classList.add('board-game-selected')
    };

    presenter.deselectLastCounter = function () {
        if (presenter.lastSelectedCounter === null) {
            return;
        }

        presenter.boardCounters[presenter.lastSelectedCounter].classList.remove('board-game-selected');
    };

    presenter.connectHandlers = function () {
        if (presenter.gameMode === presenter.gameTypes.GAME) {
            presenter.boardCounters.each(function (index, element) {
                $(element).on('click', function () {
                    if (presenter.isDisable || presenter.showErrorsMode || presenter.showAnswersMode) {
                        return;
                    }

                    presenter.selectCounter(this, index);
                });
            });
        }

        if (presenter.gameMode === presenter.gameTypes.FREE) {

            presenter.$view.find('.board-game-field').droppable({
                drop: function (e, ui) {
                    presenter.checkRevert(this);
                }
            });

            jQuery(function ($) {
                presenter.boardCounters
                    .mousedown(function (e) {
                        presenter.moveCurrentElement(this);
                    })
                    .mouseup(function (e) {}).click(function (e) {});
            });

            presenter.boardCounters.draggable({
                containment: "parent"
            });
        }
    };

    presenter.getElementToNavigation = function () {
        var elementsToNavigation = [];
        presenter.boardCounters.each(function (index, element) {
            elementsToNavigation.push($(element));
        });

        return elementsToNavigation;
    };

    presenter.setFieldsSizes = function (model) {
        var i;

        for(i = 0; i < presenter.fieldsLength; i++) {
            $(presenter.fields[i]).css({
                'width' : model.Fields[i].Width + "px",
                'height' : model.Fields[i].Height + "px",
                'top' : model.Fields[i].Top + "px",
                'left' : model.Fields[i].Left + "px"
            });
        }
    };

    presenter.initGameMode = function (model) {
        var i;

        presenter.setFieldsSizes(model);
        presenter.selectCounter(presenter.boardCounters[0], 0);

        for (i = 0; i < presenter.boardCounters.length; i++) {
            presenter.counterPositions.push(0);

            presenter.boardCounters[i].classList.add('game');
            presenter.fields[0].appendChild(presenter.boardCounters[i]);
        }

        for (i = 0; i < presenter.fieldsLength; i++) {
            presenter.fields[i].classList.add("game");
        }

        presenter.boardGameKeyboardController = new BoardGameGameModeKeyboardController(presenter.getElementToNavigation());
    };

    presenter.initFreeMode = function (model) {
        if (presenter.hasFields) {
            presenter.setFieldsSizes(model);
        }

        presenter.boardGameKeyboardController = new BoardGameFreeModeKeyboardController(presenter.getElementToNavigation());
        presenter.boardGameKeyboardController.mapping[KeyboardControllerKeys.ARROW_LEFT] = presenter.boardGameKeyboardController.left;
        presenter.boardGameKeyboardController.mapping[KeyboardControllerKeys.ARROW_RIGHT] = presenter.boardGameKeyboardController.right;
        presenter.boardGameKeyboardController.mapping[KeyboardControllerKeys.ARROW_UP] = presenter.boardGameKeyboardController.up;
        presenter.boardGameKeyboardController.mapping[KeyboardControllerKeys.ARROW_DOWN] = presenter.boardGameKeyboardController.down;
        presenter.boardGameKeyboardController.mapping[KeyboardControllerKeys.TAB] = presenter.boardGameKeyboardController.tab;
    };

    presenter.init = function(view, model) {
        presenter.$view = $(view);
        presenter.model = model;
        presenter.modelID = model.ID;
        presenter.isDisable = model.isDisable;
        presenter.wasDisable = model.isDisable;
        presenter.hasFields = model.hasFields;
        presenter.wasVisible = model["Is Visible"];
        presenter.isVisible = model["Is Visible"];
        presenter.fieldsLength = model.Fields ? model.Fields.length : 0 ;
        presenter.imagesLength = model.Images.length;
        presenter.gameMode = model.gameMode;

        presenter.lastSelectedCounter = null;

        var myDiv = $(view).find('.board-game-container')[0];

        var board = presenter.drawBoard(view, model);
        $(myDiv).append(board);

        presenter.setVisibility(presenter.wasVisible);

        presenter.boardCounters = presenter.$view.find('.board-game-element');
        presenter.fields = presenter.$view.find('.board-game-field');

        presenter.setElementsPosition(presenter.originalLeftValue, presenter.originalTopValue);

        if (presenter.gameMode === presenter.gameTypes.GAME) {
            presenter.initGameMode(model);
        } else {
            presenter.initFreeMode(model);
        }

        presenter.connectHandlers();
    };

    presenter.showErrorMessage = function (view, error) {
        var $counter = $(view).find('.board-game-counter');
        $counter.text(presenter.ERROR_CODES[error.errorCode]);
    };

    presenter.run = function(view, model) {
        presenter.$view = $(view);
        presenter.model = model;

        var validatedModel = presenter.validateModel(model);

        if (validatedModel.isValid) {

            presenter.init(view, validatedModel.value);

            presenter.eventBus.addEventListener('ShowAnswers', this);
            presenter.eventBus.addEventListener('HideAnswers', this);

            if(presenter.isDisable){
                presenter.disable();
            }

        } else {
            presenter.showErrorMessage(view, validatedModel);
        }
    };

    presenter.moveCurrentElement = function(element) {
        presenter.currentElement = element.id;
        if(presenter.hasFields) {
            presenter.$view.find('#' + presenter.currentElement + '').draggable({ revert: true });
        }
    };

    presenter.checkRevert = function(element){
        var field = element.id;
        presenter.$view.find('#' + presenter.currentElement + '').draggable({ revert: false });
        presenter.triggerFrameChangeEvent(field, presenter.currentElement);
    };

    presenter.createPreview = function(view, model) {
        presenter.$view = $(view);
        presenter.model = model;

        var validatedModel = presenter.validateModel(model);
        if (!validatedModel.isValid) {
            presenter.showErrorMessage(view, validatedModel);
            return;
        }

        presenter.init(view, model);
        $(view).find('.board-game-element').draggable({ containment: "parent" });

        var coordinations = {x: 0, y: 0};

        var coordinatesContainer = $('<div></div>'),
            xContainer = $('<div>x: <span class="value"></span></div>'),
            yContainer = $('<div>y: <span class="value"></span></div>');
        coordinatesContainer.addClass('coordinates');
        coordinatesContainer.append(xContainer).append(yContainer);
        $(view).find('.board-game-container').append(coordinatesContainer);

        function setCalculatedPosition(e) {
            coordinations.x = e.originalEvent.pageX || e.originalEvent.touches[0].pageX;
            coordinations.y = e.originalEvent.pageY || e.originalEvent.touches[0].pageY;
            presenter.mouseSX = parseInt(coordinations.x, 10) - parseInt($(view).find('.board-game-container').offset().left,10);
            presenter.mouseSY = parseInt(coordinations.y, 10) - parseInt($(view).find('.board-game-container').offset().top,10);
            xContainer.find('.value').html(presenter.mouseSX);
            yContainer.find('.value').html(presenter.mouseSY);
        }

        var doesElementExist = function() {
            var $moduleSelector = $('.moduleSelector[data-id="' + presenter.modelID + '"]');

            if ($moduleSelector.length > 0) {
                $moduleSelector.on('mousemove', function(e) {
                    setCalculatedPosition(e);
                });

                clearInterval(interval);
            }
        };

        var interval = setInterval(function() { doesElementExist(); }, 500);

        $(view).find('.board-game-container').on('mousemove', function(e) {
            setCalculatedPosition(e);
        });

    };

    presenter.disable = function() {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();

        }
        presenter.isDisable = true;
        var $myDiv = presenter.$view.find('.board-game-container')[0];
        $($myDiv).addClass('disable');
        presenter.$view.find('.board-game-element').draggable("disable");
    };

    presenter.enable = function() {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();
        }

        presenter.isDisable = false;
        var $myDiv = presenter.$view.find('.board-game-container')[0];
        $($myDiv).removeClass('disable');
        presenter.$view.find('.board-game-element').draggable("enable");
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function() {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();
        }

        presenter.setVisibility(true);
        presenter.isVisible = true;
    };

    presenter.hide = function() {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();
        }

        presenter.setVisibility(false);
        presenter.isVisible = false;
    };


    presenter.setElementsPosition = function(arrayLeft, arrayTop){
        var i;

        for(i = 0; i < presenter.imagesLength; i++){
            $(presenter.boardCounters[i]).css({
                'left' : arrayLeft[i] + "px",
                'top' : arrayTop[i] + "px"
            });
        }
    };

    presenter.getElementsPosition = function(){
        var i;

        for(i = 0; i < presenter.imagesLength; i++) {
            presenter.currentLeftValue[i] = parseInt($(presenter.$view.find('.board-game-element')[i]).css("left"),10);
            presenter.currentTopValue[i] = parseInt($(presenter.$view.find('.board-game-element')[i]).css("top"),10);
        }
    };

    presenter.getState = function() {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();
        }

        presenter.isErrorCheckingMode = false;
        var isVisible = presenter.isVisible;
        var wasVisible = presenter.wasVisible;
        var wasDisable = presenter.wasDisable;
        var isDisable = presenter.isDisable;

        presenter.getElementsPosition();

        var originalLeftValue = presenter.originalLeftValue;
        var originalTopValue = presenter.originalTopValue;
        var currentLeftValue = presenter.currentLeftValue;
        var currentTopValue = presenter.currentTopValue;

        return JSON.stringify({
            originalLeftValue : originalLeftValue,
            originalTopValue : originalTopValue,
            currentLeftValue : currentLeftValue,
            currentTopValue : currentTopValue,
            isVisible : isVisible,
            wasVisible : wasVisible,
            wasDisable : wasDisable,
            isDisable : isDisable
        });

    };

    presenter.setState = function(state) {
        var parsedState = JSON.parse(state), $myDiv = presenter.$view.find('.board-game-container')[0];
        presenter.originalLeftValue = parsedState.originalLeftValue;
        presenter.originalTopValue = parsedState.originalTopValue;
        presenter.currentLeftValue = parsedState.currentLeftValue;
        presenter.currentTopValue = parsedState.currentTopValue;
        presenter.isVisible = parsedState.isVisible;
        presenter.wasVisible = parsedState.wasVisible;
        presenter.wasDisable = parsedState.wasDisable;
        presenter.isDisable = parsedState.isDisable;
        presenter.setVisibility(presenter.isVisible);
        presenter.setElementsPosition(presenter.currentLeftValue, presenter.currentTopValue);

        if(presenter.isDisable){
            $($myDiv).addClass('disable');
            presenter.$view.find('.board-game-element').draggable("disable");
        } else{
            $($myDiv).removeClass('disable');
            presenter.$view.find('.board-game-element').draggable("enable");
        }
    };

    presenter.reset = function() {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();
        }

        var $myDiv = presenter.$view.find('.board-game-container')[0];

        presenter.setElementsPosition(presenter.originalLeftValue, presenter.originalTopValue);
        presenter.setWorkMode();
        presenter.isErrorCheckingMode = false;

        presenter.setElementsPosition(presenter.originalLeftValue, presenter.originalTopValue);
        presenter.isVisible = presenter.wasVisible;
        presenter.setVisibility(presenter.wasVisible);
        presenter.isDisable = presenter.wasDisable;

        if(presenter.isDisable){
            $($myDiv).addClass('disable');
            presenter.$view.find('.board-game-element').draggable("disable");
        } else{
            $($myDiv).removeClass('disable');
            presenter.$view.find('.board-game-element').draggable("enable");
        }
    };

    presenter.setShowErrorsMode = function() {
        if(presenter.showAnswersMode === true){
            presenter.hideAnswers();
        }

        presenter.showErrorsMode = true;
        var $myDiv = presenter.$view.find('.board-game-container')[0];
        $($myDiv).addClass('check');
        presenter.$view.find('.board-game-element').draggable("disable");
    };

    presenter.setWorkMode = function() {
        presenter.showErrorsMode = false;
        var $myDiv = presenter.$view.find('.board-game-container')[0];
        $($myDiv).removeClass('check');

        if(!presenter.isDisable){
            presenter.$view.find('.board-game-element').draggable("enable");
        }
    };

    presenter.showAnswers = function () {
        if(presenter.showErrorsMode === true){
            presenter.setWorkMode();
        }

        presenter.showAnswersMode = true;
        var $myDiv = presenter.$view.find('.board-game-container')[0];
        $($myDiv).addClass('show-answer');
        presenter.$view.find('.board-game-element').draggable("disable");
    };

    presenter.hideAnswers = function () {
        if(presenter.showAnswersMode === true){
            var $myDiv = presenter.$view.find('.board-game-container')[0];
            $($myDiv).removeClass('show-answer');

            if(!presenter.isDisable){
                presenter.$view.find('.board-game-element').draggable("enable");
            }
        }
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName === "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName === "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };

    presenter.createEventData = function(eventItem, eventValue) {
        return {
            source : presenter.modelID,
            item : "" + eventItem,
            value : '' + eventValue,
            score : ''
        };
    };

    presenter.triggerFrameChangeEvent = function(eventItem, eventValue) {
        var eventData = presenter.createEventData(eventItem, eventValue);
        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.move = function (distance) {
        if (presenter.isDisable || presenter.showErrorsMode || presenter.showAnswersMode) {
            return;
        }

        if (presenter.gameMode !== presenter.gameTypes.GAME) {
            return;
        }

        var counterElementToMove = presenter.boardCounters[presenter.lastSelectedCounter],
            counterPosition = presenter.counterPositions[presenter.lastSelectedCounter],
            newCounterPosition = Math.min(presenter.fields.length - 1, counterPosition + distance);

        newCounterPosition = Math.max(0, newCounterPosition);

        presenter.counterPositions[presenter.lastSelectedCounter] = newCounterPosition;
        presenter.fields[newCounterPosition].appendChild(counterElementToMove);
    };

    presenter.diceExecute = function (distance) {
        presenter.move(distance);
    };

    // Game mode controller

    function BoardGameGameModeKeyboardController(elements) {
        KeyboardController.call(this, elements, elements.length);
    }
    BoardGameGameModeKeyboardController.prototype = Object.create(KeyboardController.prototype);
    BoardGameGameModeKeyboardController.prototype.constructor = BoardGameGameModeKeyboardController;

    //Free mode controller

    /**
     * Get clientX and clientY positions based on element position
     * @param {jQuery} $element
     * @returns {{left: number, top: number}}
     */
    function getElementPosition ($element) {
        var top = $element.offset().top - document.documentElement.scrollTop,
            left = $element.offset().left - document.documentElement.scrollLeft;

        return {
            left: left,
            top: top
        };
    }

    /**
     * Build mouse event for simulating drag n drop
     * @param {"mousedown"|"mouseup"|"mousemove"} type
     * @param position {{top: Number, left: Number}}
     * @returns {MouseEvent}
     */
    function buildMouseEvent(type, position) {
        var event = document.createEvent("MouseEvent");
        event.initMouseEvent(type, true, true, window, 1, 0, 0, position.left, position.top, false, false, false, false, 0, null);

        return event;
    }

    function BoardGameFreeModeKeyboardController(elements) {
        KeyboardController.call(this, elements, elements.length);
    }

    BoardGameFreeModeKeyboardController.prototype = Object.create(KeyboardController.prototype);
    BoardGameFreeModeKeyboardController.prototype.constructor = BoardGameFreeModeKeyboardController;

    BoardGameFreeModeKeyboardController.prototype.left = function () {
        var position = getElementPosition(this.keyboardNavigationCurrentElement);
        position.left -= 2;

        var event = buildMouseEvent("mousemove", position);
        this.keyboardNavigationCurrentElement[0].dispatchEvent(event);
    };

    BoardGameFreeModeKeyboardController.prototype.right = function () {
        var position = getElementPosition(this.keyboardNavigationCurrentElement);
        position.left += 2;

        var event = buildMouseEvent("mousemove", position);
        this.keyboardNavigationCurrentElement[0].dispatchEvent(event);
    };

    BoardGameFreeModeKeyboardController.prototype.up = function () {
        var position = getElementPosition(this.keyboardNavigationCurrentElement);
        position.top -= 2;

        var event = buildMouseEvent("mousemove", position);
        this.keyboardNavigationCurrentElement[0].dispatchEvent(event);
    };

    BoardGameFreeModeKeyboardController.prototype.down = function () {
        var position = getElementPosition(this.keyboardNavigationCurrentElement);
        position.top += 2;

        var event = buildMouseEvent("mousemove", position);
        this.keyboardNavigationCurrentElement[0].dispatchEvent(event);
    };

    BoardGameFreeModeKeyboardController.prototype.tab = function (ev) {
        var position = getElementPosition(this.keyboardNavigationCurrentElement),
            event = buildMouseEvent("mouseup", position);

        this.keyboardNavigationCurrentElement[0].dispatchEvent(event);

        KeyboardController.prototype.nextElement.call(this, ev);

        position = getElementPosition(this.keyboardNavigationCurrentElement);
        event = buildMouseEvent("mousedown", position);

        this.keyboardNavigationCurrentElement[0].dispatchEvent(event);
    };

    presenter.keyboardController = function (keyCode, isShiftDown, originalEvent) {
        presenter.boardGameKeyboardController.handle(keyCode, isShiftDown);
    };

    return presenter;
}