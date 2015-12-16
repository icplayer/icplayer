function AddonBoard_Game_create(){

    var presenter = function() {
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

        presenter.modelID = model.ID;
        presenter.Height = parseInt(model.Height, 10);
        presenter.Width = parseInt(model.Width, 10);

        presenter.$view.find('.board-game-container').css({
            'width' : presenter.Width,
            'height' : presenter.Height,
            'background-image' : 'url('+ model.Background + ')'
        });

        presenter.fieldsLength = model.Fields.length;

        var fig = ''
        if(model.hasFields == 'True'){
            for(i=0;i<presenter.fieldsLength;i++){
                //fig += '<div id="'+presenter.modelID+'Field'+(i+1)+'" class="board-game-field" style=""></div>';
                fig += '<div id="Field'+(i+1)+'" class="board-game-field" style=""></div>';
            }
        }
        for(i=0;i<model.Images.length;i++){
            fig += '<div id="Element'+(i+1)+'" class="board-game-element" style="background-image: url('+ model.Images[i].PawnImage + '); -moz-background-size:100% 100%; -webkit-background-size:100% 100%; background-size:100% 100%;; height: ' + model.Images[i].Height + 'px; width: ' + model.Images[i].Width + 'px;  "></div>';
            presenter.currentLeftValue[i] = model.Images[i].Left;
            presenter.currentTopValue[i] = model.Images[i].Top;
            presenter.originalLeftValue[i] = model.Images[i].Left;
            presenter.originalTopValue[i] = model.Images[i].Top;
        }

        return fig;
    };



    presenter.validate = function(view, model) {
        presenter.$view = $(view);
        presenter.model = model;

        $counter = $(view).find('.board-game-counter');

        if(model.hasFields == 'True'){
            for(i=0;i<model.Fields.length;i++){
                if (parseInt(model.Fields[i].Left,10) + parseInt(model.Fields[i].Width,10) > parseInt(model.Width, 10) || parseInt(model.Fields[i].Top,10) + parseInt(model.Fields[i].Height,10) > parseInt(model.Height, 10)) {
                    $counter.text('Field'+ (i+1) +' is outside of addon!');
                    return false;
                }
            }
        }

        for(i=0;i<model.Images.length;i++){
            if (parseInt(model.Images[i].Left,10) + parseInt(model.Images[i].Width,10) > parseInt(model.Width, 10) || parseInt(model.Images[i].Top,10) + parseInt(model.Images[i].Height,10) > parseInt(model.Height, 10)) {
                $counter.text('Element'+ (i+1) +' is outside of addon!');
                return false;
            }
        }

        return true;
    };


    presenter.init = function(view, model) {
        presenter.$view = $(view);
        presenter.model = model;
        presenter.modelID = model.ID;
        presenter.isDisable = model.isDisable == "True" ? true : false;
        presenter.wasDisable = model.isDisable == "True" ? true : false;
        presenter.hasFields = model.hasFields == "True" ? true : false;
        presenter.wasVisible = model["Is Visible"] == 'True';
        presenter.isVisible = model["Is Visible"] == 'True';
        presenter.fieldsLength = model.Fields.length;
        presenter.imagesLength = model.Images.length;

        var myDiv = $(view).find('.board-game-container')[0];

        var board = presenter.drawBoard(view, model);
        $(myDiv).append(board);

        presenter.setVisibility(presenter.wasVisible);

        if(presenter.hasFields){
            for(i=0;i<presenter.fieldsLength;i++){
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


    presenter.run = function(view, model) {
        presenter.$view = $(view);
        presenter.model = model;

        if (presenter.validate(view, model)) {

            presenter.init(view, model);

            presenter.eventBus.addEventListener('ShowAnswers', this);
            presenter.eventBus.addEventListener('HideAnswers', this);


            // $(view).find('.board-game-element').draggable({ revert: true });

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

        }

    };

    presenter.moveCurrentElement = function(element) {
        presenter.currentElement = element.id;
        if(presenter.hasFields){
            presenter.$view.find('#'+presenter.currentElement+'').draggable({ revert: true });
        }
    };

    presenter.checkRevert = function(element){
        var field = element.id;
        presenter.$view.find('#'+presenter.currentElement+'').draggable({ revert: false });
        presenter.triggerFrameChangeEvent(field, presenter.currentElement);
    };

    presenter.createPreview = function(view, model) {
        presenter.$view = $(view);
        presenter.model = model;

        if (presenter.validate(view, model)) {
            presenter.init(view, model);
            $(view).find('.board-game-element').draggable({ containment: "parent" });

            var coordinations = {x:0, y:0};

            var coordinatesContainer = $('<div></div>'),
                xContainer = $('<div>x: <span class="value"></span></div>'),
                yContainer = $('<div>y: <span class="value"></span></div>');
            coordinatesContainer.addClass('coordinates');
            coordinatesContainer.append(xContainer).append(yContainer);
            $(view).find('.board-game-container').append(coordinatesContainer);

            function setCalculatedPosition(e) {
                coordinations.x = e.originalEvent.pageX || e.originalEvent.touches[0].pageX;
                coordinations.y = e.originalEvent.pageY || e.originalEvent.touches[0].pageY;
                presenter.mouseSX = parseInt(coordinations.x,10) - parseInt($(view).find('.board-game-container').offset().left,10);
                presenter.mouseSY = parseInt(coordinations.y,10) - parseInt($(view).find('.board-game-container').offset().top,10);
                xContainer.find('.value').html(presenter.mouseSX);
                yContainer.find('.value').html(presenter.mouseSY);
            }

            var doesElementExist = function() {
                var $moduleSelector = $('.moduleSelector[data-id="'+presenter.modelID+'"]');

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
        for(i=0;i<presenter.imagesLength;i++){
            $(presenter.$view.find('.board-game-element')[i]).css({
                'left' : arrayLeft[i] + "px",
                'top' : arrayTop[i] + "px"
            });

        }
    };

    presenter.getElementsPosition = function(){
        for(i=0;i<presenter.imagesLength;i++){
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

        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
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