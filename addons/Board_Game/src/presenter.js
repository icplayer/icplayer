function AddonBoard_Game_create(){

    var presenter = function() {
    };

    presenter.ERROR_CODES = {
        'F01': 'Field is outside of addon!',
        'I01': 'Element is outside of addon!',
        "CSS01": "Provided css class name is not valid class name"
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

        if(model.hasFields){
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

        if (!model["disableDragging"]) {
            model["disableDragging"] = false;
        }

        if (!model["selectableCounters"]) {
            model["selectableCounters"] = false;
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
            ModelValidators.List("Fields", [
                ModelValidators.DumbInteger("Top"),
                ModelValidators.DumbInteger("Left"),
                ModelValidators.DumbInteger("Width"),
                ModelValidators.DumbInteger("Height"),
                ModelValidators.CSSClass("cssClass", {empty: true})
            ], function () {
                return this.validatedModel['hasFields'];
            }),
            ModelValidators.List("Images", [
                ModelValidators.DumbInteger("Top"),
                ModelValidators.DumbInteger("Left"),
                ModelValidators.DumbInteger("Width"),
                ModelValidators.DumbInteger("Height"),
                ModelValidators.DumbString("PawnImage")
            ]),
            ModelValidators.Boolean("isDisabled"),
            ModelValidators.Boolean("disableDragging"),
            ModelValidators.Boolean("selectableCounters"),
            ModelValidators.DumbInteger("Width"),
            ModelValidators.DumbInteger("Height"),
            ModelValidators.DumbString("ID"),
            ModelValidators.Boolean("Is Visible"),
            ModelValidators.DumbString("Background")
        ]);

        if (!validatedModel.isValid) {
            return validatedModel;
        }

        var validatedFields,
            validatedImages;

        if (validatedModel["hasFields"]) {
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

    presenter.connectHandlers = function () {

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
        presenter.fieldsLength = model.Fields.length;
        presenter.imagesLength = model.Images.length;

        var myDiv = $(view).find('.board-game-container')[0];

        var board = presenter.drawBoard(view, model);
        $(myDiv).append(board);

        presenter.setVisibility(presenter.wasVisible);


        var i;
        if(presenter.hasFields){
            for(i = 0; i < presenter.fieldsLength; i++) {
                $(presenter.$view.find('.board-game-field')[i]).css({
                    'width' : model.Fields[i].Width + "px",
                    'height' : model.Fields[i].Height + "px",
                    'top' : model.Fields[i].Top + "px",
                    'left' : model.Fields[i].Left + "px"
                });
            }
        }

        presenter.setElementsPosition(presenter.originalLeftValue, presenter.originalTopValue);
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

            presenter.$view.find('.board-game-element').draggable({
                containment: "parent"
            });


            presenter.$view.find('.board-game-field').droppable({
                drop: function(e, ui) {
                    presenter.checkRevert(this);
                }
            });

            if(presenter.isDisable){
                presenter.disable();
            }

            jQuery(function($) {
                presenter.$view.find('.board-game-element')
                    .mousedown(function(e) {
                        presenter.moveCurrentElement(this);
                    })
                    .mouseup(function(e) {

                    }).click(function(e) {

                    });
            });
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

        if (presenter.validate(view, model)) {
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
        }

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
            $(presenter.$view.find('.board-game-element')[i]).css({
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

    return presenter;
}