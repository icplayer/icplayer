function AddonDice_create() {
    var presenter = function (){};

    presenter.ERROR_CODES = {
        "animationLength_INT01": "Animation length can't be empty",
        "animationLength_INT02": "Animation length is not a valid integer",
        "animationLength_INT04": "Animation length must be positive",
        "initialItem_INT02": "Value of initial item is not a valid integer",
        "initialItem_INT04": "Value of initial item is not positive integer",
        "initialItem_INI01": "Initial item can't be bigger than elements count",
        "elementsList|number_INT02": "Element value in list is not valid integer"

    };

    presenter.configuration = {
        isDisabled: false,
        "Is Visible": false,
        animationLength: 0,
        initialItem: null,
        elementsList: []
    };

    presenter.state = {
        images: [],
        loadedImages: 0,
        isLoaded: false,
        elements: [],
        wrapperElement: null,
        loadingElement: null,
        isDisabled: false,
        isRolling: false,
        timeoutsHandlers: [],
        view: null,
        rolledElement: -1,
        isVisible: false,
        disabledByEvent: false,
        worksWith: null,
    };

    var CLASSES =  {
        visibleElement: "dice-element-visible",
        imageElement: "addon-Dice-image-element"
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };

    presenter.run = function (view, model) {
        presenter.initialize(view, model);
        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);

        presenter.diceKeyboardController = new DiceKeyboardController();
    };

    presenter.createPreview = function (view, model) {
        presenter.initialize(view, model);
    };

    presenter.validateModel = function (model) {
        var modelValidator = new ModelValidator();

        var validatedModel = modelValidator.validate(model, [
            ModelValidators.Boolean("isDisabled"),
            ModelValidators.Integer("animationLength", {minValue: 0}),
            ModelValidators.Integer("initialItem", {minValue: 1, default: null}),
            ModelValidators.List("elementsList", [
                ModelValidators.String("name", {default: null}),
                ModelValidators.String("image", {trim: true, default: null})
            ]),
            ModelValidators.Boolean("Is Visible"),
            ModelValidators.String("worksWith", {default: null}),
            ModelValidators.DumbString("ID")
        ]);

        if (!validatedModel.isValid) {
            return validatedModel;
        }

        if (validatedModel.value.initialItem > validatedModel.value.elementsList.length) {
            return {
                isValid: false,
                fieldName: ["initialItem"],
                errorCode: "INI01"
            }
        }

        if (validatedModel.value.initialItem !== null) {
            validatedModel.value.initialItem -= 1;
        }

        return validatedModel;
    };

    presenter.enableAddon = function () {
        presenter.state.isLoaded = true;
        presenter.state.loadingElement.style.display = 'none';
    };

    presenter.enableIfIsLoaded = function () {
        if (presenter.state.images.length === presenter.state.loadedImages) {
            presenter.enableAddon();
        }
    };

    presenter.loadedImage = function () {
        presenter.state.loadedImages += 1;
        presenter.enableIfIsLoaded();
    };

    presenter.loadImages = function () {
        presenter.configuration.elementsList.forEach(function (element) {
            var imgElement;
            if (element.image !== null) {
                imgElement = new Image();
                presenter.state.images.push(imgElement);
                imgElement.onload = presenter.loadedImage;
                imgElement.onerror = presenter.loadedImage;

                imgElement.src = element.image;
            }
        });
    };

    presenter.buildElement = function (name, background) {
        var element = document.createElement('div');
        if (name !== null) {
            var textNode = document.createTextNode(name);
            element.appendChild(textNode);
        }

        if (background !== null) {
            element.style.backgroundImage = "url(" + background + ")";
        }

        element.classList.add(CLASSES.imageElement);

        element.addEventListener('click', presenter.onDiceClick);

        return element;
    };

    presenter.buildElements = function () {
        presenter.configuration.elementsList.forEach(function (element, index) {
            var text = element.image === null && element.name === null ? index + 1 : element.name;
            var elementDiv = presenter.buildElement(text, element.image);

            presenter.state.elements.push(elementDiv);
            presenter.state.wrapperElement.appendChild(elementDiv);
        });
    };

    presenter.randElement = function () {
        return parseInt(Math.random() * (presenter.state.elements.length) + "");
    };

    presenter.setElement = function (index) {
        presenter.state.elements.forEach(function (el) {
            el.classList.remove(CLASSES.visibleElement);
        });

        presenter.state.elements[index].classList.add(CLASSES.visibleElement);
    };

    presenter.setRandomElement = function () {
        var element = presenter.randElement();
        presenter.setElement(element);

        return element;
    };

    presenter.initializeStartItem = function () {
        var initItemIndex = presenter.configuration.initialItem;
        initItemIndex = initItemIndex === null ? presenter.randElement() : initItemIndex;

        presenter.state.rolledElement = initItemIndex;
        presenter.setElement(initItemIndex);
    };

    presenter.initialize = function (view, model)  {
        var validatedModel = presenter.validateModel(model);

        if (!validatedModel.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, validatedModel.fieldName.join("|") + "_" + validatedModel.errorCode);
            return;
        }

        presenter.configuration = validatedModel.value;

        presenter.state.wrapperElement = view.getElementsByClassName("addon-Dice-dice-container")[0];
        presenter.state.loadingElement = view.getElementsByClassName("loading")[0];
        presenter.state.isDisabled = presenter.configuration.isDisabled;
        presenter.state.view = view;
        presenter.state.isVisible = presenter.configuration['Is Visible'];

        presenter.buildElements();
        presenter.loadImages();
        presenter.enableIfIsLoaded();
        presenter.initializeStartItem();

        MutationObserverService.createDestroyObserver(presenter.configuration.ID, presenter.destroy, presenter.state.view);
        MutationObserverService.setObserver();
    };

    presenter.destroy = function (event) {
        if (event.target !== presenter.state.view) {
            return;
        }

        presenter.state.elements.forEach(function (element) {
            element.removeEventListener('click', presenter.onDiceClick);
        });

        presenter.state.timeoutsHandlers.forEach(function (handler) {
            clearTimeout(handler);
        });
    };

    presenter.callExternalAddon = function (distance) {
        if (presenter.configuration.worksWith !== null) {
            var module = presenter.playerController.getModule(presenter.configuration.worksWith);
            if (module) {
                module.diceExecute(distance + 1);
            }
        }
    };

    presenter.sendEventDiceRolled = function (value) {
        var elementText = presenter.configuration.elementsList[value - 1].name;
        presenter.eventBus.sendEvent('ValueChanged', {
            source: presenter.configuration.ID,
            item:  value + '',
            value : (elementText || value) + ''
        });
    };

    presenter.onDiceRoll = function (isLast) {
        var element = presenter.setRandomElement();

        if (isLast) {
            presenter.state.rolledElement = element;
            presenter.state.isRolling = false;

            presenter.state.elements.forEach(function (element) {
                element.classList.remove('isRolling');
            });

            presenter.sendEventDiceRolled(element + 1);
            presenter.callExternalAddon(element);
        }
    };

    presenter.executeRoll = function () {
        presenter.state.isRolling = true;
        presenter.state.timeoutsHandlers = [];

        var animationLength = presenter.configuration.animationLength,
            throwCount = parseInt((Math.random() * 10) + 5 + ""),
            acceleration = 20,
            jump = acceleration * animationLength * animationLength / throwCount,
            timeoutsCallbacks = [],
            i;

        for (i = 1; i <= throwCount; i++) {
            var time = Math.sqrt(i * jump / acceleration);

            timeoutsCallbacks.push({
                callback: presenter.onDiceRoll.bind({}, i === 1),
                timeout: parseInt(animationLength - time)
            });
        }

        for (i = timeoutsCallbacks.length - 1; i >= 0; i--) {
            var timeoutID = setTimeout(timeoutsCallbacks[i].callback, timeoutsCallbacks[i].timeout);
            presenter.state.timeoutsHandlers.push(timeoutID);
        }

        presenter.state.elements.forEach(function (element) {
            element.classList.add('isRolling');
        });
    };

    presenter.roll = function () {
        if (presenter.state.isDisabled) {
            return;
        }

        if (!presenter.state.isLoaded) {
            return;
        }

        if (presenter.state.isRolling) {
            return;
        }

        if (presenter.state.disabledByEvent) {
            return;
        }

        presenter.sendDiceRollStartEvent();
        presenter.executeRoll();
    };

    presenter.sendDiceRollStartEvent = function () {
        presenter.eventBus.sendEvent('ValueChanged', {
            source: presenter.configuration.ID,
            item: '',
            value : 'start'
        });
    };

    presenter.onDiceClick = function () {
        presenter.roll();
    };

    presenter.setVisibility = function (isVisible) {
        $(presenter.state.view).css('visibility', isVisible ? 'visible' : 'hidden');
        $(presenter.state.view).css('display', isVisible ? 'block' : 'none');

        presenter.state.isVisible = isVisible;
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.reset = function () {
        presenter.setVisibility(presenter.configuration['Is Visible']);

        presenter.initializeStartItem();
        presenter.state.isDisabled = presenter.configuration.isDisabled;
        presenter.state.disabledByEvent = false;
        presenter.deselectDiceAsDisabled();
        presenter.state.timeoutsHandlers.forEach(function (id) {
            clearTimeout(id);
        });
        presenter.state.timeoutsHandlers = [];
        presenter.state.isRolling = false;
    };

    presenter.selectDiceAsDisabled = function () {
        presenter.state.wrapperElement.classList.add('disabled');
    };

    presenter.deselectDiceAsDisabled = function () {
        presenter.state.wrapperElement.classList.remove('disabled');
    };

    presenter.showAnswers = function () {
        presenter.selectDiceAsDisabled();
        presenter.state.disabledByEvent = true;
    };

    presenter.hideAnswers = function () {
        presenter.deselectDiceAsDisabled();
        presenter.state.disabledByEvent = false;
    };

    presenter.setWorkMode = function () {
        presenter.deselectDiceAsDisabled();
        presenter.state.disabledByEvent = false;
    };

    presenter.setShowErrorsMode = function () {
        presenter.selectDiceAsDisabled();
        presenter.state.disabledByEvent = true;
    };

    presenter.disable = function () {
        presenter.state.isDisabled = true;
        presenter.selectDiceAsDisabled();
    };

    presenter.enable = function () {
        presenter.state.isDisabled = false;
        presenter.deselectDiceAsDisabled();
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        } else if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.setState = function (state) {
        var parsedState = JSON.parse(state);

        presenter.setVisibility(parsedState.isVisible);
        presenter.state.isDisabled = parsedState.isDisabled;
        presenter.state.rolledElement = parsedState.rolledElement;
        presenter.setElement(presenter.state.rolledElement);
    };

    presenter.getState = function () {
        return JSON.stringify({
            isVisible: presenter.state.isVisible,
            isDisabled: presenter.state.isDisabled,
            rolledElement: presenter.state.rolledElement
        });
    };

    presenter.getScore = function () {
        return 0;
    };

    presenter.getMaxScore = function () {
        return 0;
    };

    presenter.getErrorCount = function () {
        return 0;
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'disable': presenter.disable,
            'enable': presenter.enable,
            'roll': presenter.roll
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    function DiceKeyboardController() {
        KeyboardController.call(this, $(presenter.state.view), 1);
    }

    DiceKeyboardController.prototype = Object.create(KeyboardController.prototype);
    DiceKeyboardController.prototype.constructor = DiceKeyboardController;

    DiceKeyboardController.prototype.selectAction = function () {
        presenter.roll();
    };

    presenter.keyboardController = function (keyCode, isShift, event) {
        presenter.diceKeyboardController.handle(keyCode, isShift, event);
    };

    return presenter;
}