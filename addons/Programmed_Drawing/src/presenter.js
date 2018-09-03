function AddonProgrammed_Drawing_create(){

    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;
    presenter.lastEvent = null;


    var viewContainer;
    var gridContainerWrapper;
    var gridContainer;

    function initGrid(model, preview) {
        var rows = presenter.configuration.rows;
        var columns = presenter.configuration.columns;

        for(var row = 0; row < rows; row++) {
            for(var column = 0; column < columns; column++) {
                var wrapperElement = $(document.createElement('div'));
                wrapperElement.addClass('cell-element-wrapper');

                var selectableElement = $(document.createElement('div'));
                selectableElement.addClass('cell-element');
                selectableElement.attr('coordinates', (column+1)+"-"+((rows-row)));

                wrapperElement.append(selectableElement);
                gridContainer.append(wrapperElement);
            }
        }

        var gridContainerWrapperDimensions = getElementDimensions(gridContainerWrapper);
        var gridContainerWrapperDistances = calculateInnerDistance(gridContainerWrapperDimensions);

        var wrapperDimensions = getElementDimensions(gridContainerWrapper.find('.cell-element-wrapper:first')[0]);
        var wrapperDistances = calculateInnerDistance(wrapperDimensions);

        var elementDimensions = getElementDimensions(gridContainerWrapper.find('.cell-element:first')[0]);
        var elementDistances = calculateInnerDistance(elementDimensions);

        var wrapperWidth = parseInt((model.Width - gridContainerWrapperDistances.horizontal - (wrapperDistances.horizontal * columns)) / columns, 10);
        var wrapperHeight = parseInt((model.Height - gridContainerWrapperDistances.vertical - (wrapperDistances.vertical * rows)) / rows, 10);

        var elementWidth = wrapperWidth - elementDistances.horizontal;
        var elementHeight = wrapperHeight - elementDistances.vertical;

        var newContainerWrapperHeight = wrapperHeight * rows + wrapperDistances.vertical * rows;
        var newContainerWrapperWidth = wrapperWidth * columns + wrapperDistances.horizontal * columns;

        var verticalGapHeight = model.Height - newContainerWrapperHeight;
        var horizontalGapHeight = model.Width - newContainerWrapperWidth;

        gridContainerWrapper.css('height', model.Height + 'px');
        gridContainerWrapper.css('width', model.Width + 'px');
        gridContainer.css('height', model.Height + 'px');
        gridContainer.css('width', (parseInt(model.Width)+parseInt(elementWidth/2)) + 'px');

        var vertical = verticalGapHeight / rows;
        var horizontal = horizontalGapHeight / columns;

        gridContainer.find(".cell-element-wrapper").each(function() {
            var index = $(this).index();
            var selectedRow = parseInt(index / columns, 10);
            var selectedColumn = parseInt(index % columns, 10);

            $(this).width(wrapperWidth + horizontal + 2);
            $(this).height(wrapperHeight + vertical + 2);

            var selectableElement = $(this).find('.cell-element:first');

            var lineHeight = selectedRow === rows -1 ? elementHeight + verticalGapHeight : elementHeight;
            selectableElement.css('line-height', lineHeight + "px");
        });
    }

    function getElementDimensions(element) {
        element = $(element);

        return {
            border:{
                top:parseInt(element.css('border-top-width'), 10),
                bottom:parseInt(element.css('border-bottom-width'), 10),
                left:parseInt(element.css('border-left-width'), 10),
                right:parseInt(element.css('border-right-width'), 10)
            },
            margin:{
                top:parseInt(element.css('margin-top'), 10),
                bottom:parseInt(element.css('margin-bottom'), 10),
                left:parseInt(element.css('margin-left'), 10),
                right:parseInt(element.css('margin-right'), 10)
            },
            padding:{
                top:parseInt(element.css('padding-top'), 10),
                bottom:parseInt(element.css('padding-bottom'), 10),
                left:parseInt(element.css('padding-left'), 10),
                right:parseInt(element.css('padding-right'), 10)
            }
        };
    }

    function calculateInnerDistance(elementDimensions) {
        var vertical = elementDimensions.border.top + elementDimensions.border.bottom;
        vertical += elementDimensions.margin.top + elementDimensions.margin.bottom;
        vertical += elementDimensions.padding.top + elementDimensions.padding.top;

        var horizontal = elementDimensions.border.left + elementDimensions.border.right;
        horizontal += elementDimensions.margin.left + elementDimensions.margin.right;
        horizontal += elementDimensions.padding.left + elementDimensions.padding.right;

        return {
            vertical : vertical,
            horizontal : horizontal
        };
    }

    presenter.validateInstructions = function (modelInstructions) {
        var instructions = modelInstructions.split("\n");
        for(var i=0; i < instructions.length; i++) {
            var instruction = instructions[i].split(' ');
            presenter.colorSquare(instruction[0], instruction[1]);
        }
    };

    presenter.colorSquareCommand = function (command) {
        presenter.colorSquare(command[0], command[1]);
    };

    presenter.colorSquare = function (x, y){
        var coordinates = x+"-"+ y,
            element = presenter.$view.find('.cell-element[coordinates="'+ coordinates +'"]');

        element.css('background-color', presenter.configuration.color);
        element.attr('colored', 'true');
    };

    presenter.resetSquareCommand = function (command) {
        presenter.resetSquare(command[0], command[1]);
    };

    presenter.resetSquare = function (x, y){
        var coordinates = x+"-"+ y,
            element = presenter.$view.find('.cell-element[coordinates="'+ coordinates +'"]');

        element.css('background-color', 'transparent');
        element.attr('colored', 'false');
    };

    presenter.run = function(view, model){
        presenterLogic(view, model);
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.createPreview = function(view, model){
        presenterLogic(view, model);
        presenter.setVisibility(true);
    };

    function returnErrorObject(errorCode) {
        return { isError: true, errorCode: errorCode };
    }

    function presenterLogic(view, model) {
        presenter.configuration = presenter.validateModel(model);

        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.$view = $(view);
        viewContainer = $(view);
        gridContainerWrapper = viewContainer.find(".cellGridWrapper:first");
        gridContainer = gridContainerWrapper.find(".cellGrid:first");

        initGrid(model, true);

        if(presenter.configuration.initialDesign){
            presenter.validateInstructions(presenter.configuration.initialDesign);
        }
    }

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
    };

    presenter.ERROR_CODES = {
        E01: "Columns and rows must be a positive integer"
    };

    presenter.validateModel = function(model) {
        var validatedIsVisible = ModelValidationUtils.validateBoolean(model['Is Visible']),
            addonID = model['ID'],
            rows = ModelValidationUtils.validatePositiveInteger(model['Rows']),
            columns = ModelValidationUtils.validatePositiveInteger(model['Columns']);

        if(!rows.isValid || !columns.isValid){
            return returnErrorObject('E01');
        }

        var color = model['Color'];
        if(color == ''){
            color = 'black';
        }

        return {
            'isError' : false,
            'isVisible' : validatedIsVisible,
            'visibleByDefault' : validatedIsVisible,
            'addonID' : addonID,
            'rows' : rows.value,
            'columns' : columns.value,
            'initialDesign' : model['Initial design'],
            'color' : color
        }
    };

    presenter.getErrorObject = function (errorCode) {
        return {isValid: false, isError: true, errorCode: errorCode};
    };

    presenter.show = function() {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'colorSquare' : presenter.colorSquareCommand,
            'resetSquare' : presenter.resetSquareCommand,
            'reset' : presenter.reset
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.resetAll = function () {
        presenter.$view.find('.cell-element').each(function () {
            $(this).css('background-color', 'transparent');
            $(this).attr('colored', 'false');
        });
    };

    presenter.reset = function(){
        presenter.$view.find('.cell-element').each(function () {
            if($(this).attr('colored') == 'true'){
                var coordinates = $(this).attr('coordinates').split('-');
                presenter.resetSquare(coordinates[0], coordinates[1]);
            }
        });

        if(presenter.configuration.initialDesign){
            presenter.validateInstructions(presenter.configuration.initialDesign);
        }

        presenter.setVisibility(presenter.configuration.visibleByDefault);
    };

    presenter.getState = function(){
        var coordinates = [];
        presenter.$view.find('.cell-element').each(function () {
            if($(this).attr('colored') == 'true'){
                coordinates.push($(this).attr('coordinates'));
            }
        });

        var state = {
            'coordinates' : coordinates
        };

        return JSON.stringify(state);
    };

    presenter.setState = function(state){
        if (ModelValidationUtils.isStringEmpty(state)) {
            return;
        }

        var parsed = JSON.parse(state);

        var coordinates = parsed.coordinates;

        presenter.resetAll();

        if(coordinates){
            for(var i = 0; i < coordinates.length; i++){
                var coordinate = coordinates[i].split('-');
                presenter.colorSquare(coordinate[0], coordinate[1]);
            }
        }
    };

//    presenter.getErrorCount = function(){
//    };
//    presenter.getMaxScore = function(){
//    };
//    presenter.getScore = function(){
//    };
//    presenter.setShowErrorsMode = function(){
//    };
//    presenter.setWorkMode = function(){
//    };

    return presenter;
}