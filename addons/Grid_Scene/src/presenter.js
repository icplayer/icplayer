function AddonGrid_Scene_create(){

    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;

    presenter.ERROR_CODES = {
        GS01: "Columns and rows must be a positive integer",
        GS02: "Delay have to be a positive integer",
        GS03: "Labels have to be a valid JSON string",
        WA01: "Point in answer must have two values",
        WA02: "Answer have non number value",
        CE01: "All commands must have name",
        CE02: "All commands must have code"
    };

    presenter.configuration = {
        isError : true,
        isVisible : true,
        visibleByDefault : true,
        addonID : null,
        rows : null,
        columns : null,
        color : null,
        hasDelay: false,
        delay: 0,
        queLoopTimer: null,
        commandQueue: [],
        blockLabels: {},
        commandsLabels: {},
        excludedCommands: {}
    };
    
    presenter.LABELS = {
        "command_clear": "clear",
        "command_mark": "mark",
        "command_drawLeft": "drawLeft",
        "command_drawRight": "drawRight",
        "command_drawUp": "drawUp",
        "command_drawDown": "drawDown",
        "command_drawLeftFrom": "drawLeftFrom",
        "command_drawRightFrom": "drawRightFrom",
        "command_drawUpFrom": "drawUpFrom",
        "command_drawDownFrom": "drawDownFrom",
        "command_setColor": "setColor",
        "command_setCursor": "setCursor",
        "command_clearMark": "clearMark",
        "block_mark": "mark",
        "block_x": "x",
        "block_y": "y",
        "block_clear": "clear",
        "block_steps": "steps",
        "block_drawLeft": "drawLeft",
        "block_drawRight": "drawRight",
        "block_drawUp": "drawUp",
        "block_drawDown": "drawDown",
        "block_drawLeftFrom": "drawLeftFrom",
        "block_drawRightFrom": "drawRightFrom",
        "block_drawUpFrom": "drawUpFrom",
        "block_drawDownFrom": "drawDownFrom",
        "block_setColor": "setColor",
        "block_setCurstor": "setCursor",
        "block_clearMark": "clearMark"
    };

    presenter.coloredGrid = [];

    presenter.actualCursorPosition = [1,1];

    function delayDecorator(func) {
        if (presenter.configuration.hasDelay) {
            return function () {
                presenter.configuration.commandQueue.push({
                    function: func,
                    args: arguments
                });
            }
        } else {
            return func;
        }
    }

    function applyDecorator (func) {
        return function (args) {
            return func.apply(null, args);
        };
    }

    function applyDelayDecorator (func) {
        if (presenter.configuration.hasDelay) {
            return function (args) {
                presenter.configuration.commandQueue.push({
                    function: func,
                    args: args
                });
            };
        } else {
            return function (args) {
                return func.apply(null, args);
            };
        }
    }

    var gridContainerWrapper;
    var gridContainer;

    presenter.initColoredGridArray = function Grid_Addon_initColoredGridArray(rows, columns) {
        for (var rows_index = 0; rows_index < rows; rows_index++) {
            presenter.coloredGrid[rows_index] = [];
            for (var columns_index = 0; columns_index < columns; columns_index++) {
                presenter.coloredGrid[rows_index][columns_index] = false;
            }
        }
    };

    presenter.setColoredGridArray = function Grid_Addon_set_colored_grid_array (array) {
        var rows = presenter.configuration.rows;
        var columns = presenter.configuration.columns;
        for (var rows_index = 0; rows_index < rows; rows_index++) {
            for (var columns_index = 0; columns_index < columns; columns_index++) {
                if (array[rows_index][columns_index]) {
                    presenter.mark(columns_index+1, rows_index+1);
                }
            }
        }
    };

    function initGrid(model) {
        var rows = presenter.configuration.rows;
        var columns = presenter.configuration.columns;

        presenter.initColoredGridArray(rows,columns);
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

    presenter.colorSquare = function (x, y){
        var coordinates = x+"-"+ y;
        var element = presenter.$view.find('.cell-element[coordinates="'+ coordinates +'"]');

        element.css('background-color', presenter.configuration.color);
        element.attr('colored', 'true');
    };

    presenter.resetMark = function (x, y){
        presenter.actualCursorPosition = [x,y];
        var coordinates = x+"-"+ y;
        var element = presenter.$view.find('.cell-element[coordinates="'+ coordinates +'"]');
        if (ModelValidationUtils.validateIntegerInRange(x, presenter.configuration.columns + 1, 1).isValid != false) {
            if (ModelValidationUtils.validateIntegerInRange(y, presenter.configuration.rows + 1, 1).isValid != false) {
                presenter.coloredGrid[y - 1][x - 1] = false;
            }
        }
        element.css('background-color', 'transparent');
        element.attr('colored', 'false');
    };
    
    
    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
    };

    presenter.run = function(view, model){
        presenterLogic(view, model, false);
    };

    presenter.createPreview = function(view, model){
        presenterLogic(view, model, true);
    };

    function returnErrorObject(errorCode) {
        return { isError: true, errorCode: errorCode };
    }

    function presenterLogic(view, model, isPreview) {
        presenter.view = view;
        presenter.$view = $(view);
        presenter.configuration = $.extend({}, presenter.configuration, presenter.validateModel(model));

        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }


        gridContainerWrapper = presenter.$view.find(".grid-scene-wrapper:first");
        gridContainer = gridContainerWrapper.find(".grid-cell:first");

        initGrid(model);
        presenter.setVisibility(presenter.configuration.isVisible);

        presenter.view.addEventListener('DOMNodeRemoved', function onDOMNodeRemoved(ev) {
            if (ev.target === this) {
                presenter.destroy();
            }
        });

        if (!isPreview) {
            presenter.setQueLoopTimer();
        }
    }

    presenter.setQueLoopTimer = function () {
        if(presenter.configuration.hasDelay) {
            presenter.configuration.queLoopTimer = setInterval(presenter.queLoop, presenter.configuration.delay)
        }
    };

    presenter.queLoop = function () {
        if (presenter.configuration.commandQueue.length > 0) {
            var task = presenter.configuration.commandQueue.shift();
            task.function.apply(null, task.args);
        }
    };
    presenter.destroy = function () {
        presenter.view.removeEventListener('DOMNodeRemoved', presenter.destroy);
        clearInterval(presenter.configuration.queLoopTimer);
        presenter.$view = null;
        presenter.view = null;
        presenter.configuration = null;
    };


    presenter.validateModel = function(model) {
        var validatedIsVisible = ModelValidationUtils.validateBoolean(model['Is Visible']),
            addonID = model['ID'],
            rows = ModelValidationUtils.validatePositiveInteger(model['Rows']),
            columns = ModelValidationUtils.validatePositiveInteger(model['Columns']);

        if(!rows.isValid || !columns.isValid){
            return returnErrorObject('GS01');
        }

        var color = model['Color'];
        if(color == ''){
            color = 'black';
        }

        var validatedDelay = presenter.validateDelay(model);
        if (!validatedDelay.isValid) {
            return validatedDelay;
        }

        var validatedLabels = presenter.validateLabels(model["labels"]);
        if (!validatedLabels.isValid) {
            return validatedLabels;
        }

        var validatedCommands = presenter.validateCommands(model["commands"]);
        if (!validatedCommands.isValid) {
            return validatedCommands
        }
        return {
            'isError' : false,
            'isVisible' : validatedIsVisible,
            'visibleByDefault' : validatedIsVisible,
            'addonID' : addonID,
            'rows' : rows.value,
            'columns' : columns.value,
            'color' : color,
            'startPoint': null,
            'hasDelay': validatedDelay.hasDelay,
            'delay': validatedDelay.delay,
            'labels': validatedLabels.value,
            'customCommands': validatedCommands.value,
            'excludedCommands': presenter.validateExcludedCommands(model["excluded_commands"]).value
        };
    };

    presenter.validateExcludedCommands = function Grid_Scene_validate_excluded_commands (excludedCommands) {
        var excludedCommandsList = [];
        for (var index = 0; index < excludedCommands.length; index++) {
            excludedCommandsList[excludedCommands[index]["command_name"]] = {
                isExcluded: ModelValidationUtils.validateBoolean(excludedCommands[index]["command_is_excluded"])
            };
        }

        return {
            isValidate: true,
            value: excludedCommandsList
        };
    };

    presenter.validateCommand = function Grid_Scene_validate_command (command) {
        if (ModelValidationUtils.isStringEmpty(command['command_name'])) {
            return {
                isValid: true,
                name: null
            };
        }
        return {
            isValid: true,
            name: command['command_name'],
            arguments: command['command_arguments'],
            code: command['command_code']
        };

    };

    presenter.validateCommands = function Grid_Scene_validate_commands (commands) {
        var validatedCommands = [];

        for (var key in commands) {
            if (commands.hasOwnProperty(key)) {
                var validatedCommand = presenter.validateCommand(commands[key]);
                if (validatedCommand.name != null) {
                    validatedCommands.push(validatedCommand);
                }
            }
        }

        return {
            isValid: true,
            value: validatedCommands
        };
    };

    presenter.validateLabels = function validateLabels(labels) {
        if (labels == undefined) {
            return {};
        }

        var trimmedLabels = labels.trim();
        var result;
        if (trimmedLabels == "") {
            result = {};
        } else {
            try {
                result = JSON.parse(trimmedLabels);
            } catch (e) {
                return presenter.getErrorObject("GS03");
            }
        }

        return {
            isValid: true,
            value: result
        };
    };

    presenter.validateDelay = function(model) {
        function getDelayObject (isValid, hasDelay, delay) {return {isValid: isValid, hasDelay: hasDelay, delay: delay};}

        if (model["delay"] == undefined) {
            return getDelayObject(true, false);
        }

        var trimmedDelay = model["delay"].trim();
        if (trimmedDelay == "") {
            return getDelayObject(true, false);
        }

        var parsedDelay = Number(trimmedDelay);
        if(isNaN(parsedDelay)) {
            return presenter.getErrorObject("GS02");
        }

        if (parsedDelay > 0) {
            return getDelayObject(true, true, parsedDelay);
        } else {
            return getDelayObject(true, false, parsedDelay);
        }
    };

    presenter.validateAnswer = function (answer) {
        var splitedAnswers = answer.split("\n");
        var answers = [];
        for (var index = 0; index < splitedAnswers.length; index++){
            var answer = splitedAnswers[index].split(";");
            if (answer.length != 2) {
                return presenter.getErrorObject("WA01");
            }

            var x = parseInt(answer[0]);
            var y = parseInt(answer[1]);
            if (isNaN(x) || isNaN(y)) {
                return presenter.getErrorObject("WA02");
            }

            answers.push({
                x: x,
                y: y
            });
        }
        return {
            isValid: true,
            value: answers
        };
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
            'mark' : applyDelayDecorator(presenter.mark),
            'drawLeft': applyDelayDecorator(presenter.drawLeft),
            'drawRight': applyDelayDecorator(presenter.drawRight),
            'drawDown': applyDelayDecorator(presenter.drawDown),
            'drawUp': applyDelayDecorator(presenter.drawUp),
            'drawLeftFrom':applyDelayDecorator(presenter.drawLeft),
            'drawRightFrom': applyDelayDecorator(presenter.drawRight),
            'drawDownFrom': applyDelayDecorator(presenter.drawDown),
            'drawUpFrom': applyDelayDecorator(presenter.drawUp),
            'setCursor': applyDelayDecorator(presenter.setCursor),
            'setColor': applyDelayDecorator(presenter.setColor),
            'clearMark' : applyDelayDecorator(presenter.resetMark),
            'clear': applyDelayDecorator(presenter.reset),
            'reset' : presenter.reset,
            'executeCode': applyDecorator(presenter.executeCode)
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.reset = function(){
        presenter.$view.find('.cell-element').each(function () {
            if($(this).attr('colored') == 'true'){
                var coordinates = $(this).attr('coordinates').split('-');
                presenter.resetMark(coordinates[0], coordinates[1]);
            }
        });

        var rows = presenter.configuration.rows;
        var columns = presenter.configuration.columns;
        presenter.initColoredGridArray(rows,columns);

        presenter.setVisibility(presenter.configuration.visibleByDefault);
        presenter.actualCursorPosition = [1,1];
    };

    presenter.setCursor = function (x, y) {
        if(!isNaN(parseInt(x)) && !isNaN(parseInt(y))) {
            presenter.actualCursorPosition = [x, y];
        }
    };

    presenter.drawHorizontalLine = function (from, to, y) {
        if (from <= to) {
            for (var i = from; i <= to; i++) {
                presenter.mark(i, y);
            }
        } else {
            for (var i = from; i >= to; i--) {
                presenter.mark(i, y);
            }
        }
    };

    presenter.drawVerticalLine = function (from, to, x) {
        if (from <= to) {
            for (var i = from; i <= to; i++) {
                presenter.mark(x, i);
            }
        } else {
            for (var i = from; i >= to; i--) {
                presenter.mark(x, i);
            }
        }

    };

    presenter.mark = function mark (x, y) {
        presenter.actualCursorPosition = [x,y];
        if (ModelValidationUtils.validateIntegerInRange(x, presenter.configuration.columns + 1, 1).isValid != false) {
            if (ModelValidationUtils.validateIntegerInRange(y, presenter.configuration.rows + 1, 1).isValid != false) {
                presenter.coloredGrid[y - 1][x - 1] = true;
            }
        }
        presenter.colorSquare(x, y);
    };

    presenter.drawLeft = function (x, y, numberOfSteps) {
        if (arguments.length == 1) {
            presenter.drawHorizontalLine( presenter.actualCursorPosition[0] - 1, presenter.actualCursorPosition[0] - x, presenter.actualCursorPosition[1]);
        } else {
            presenter.drawHorizontalLine(x, x - numberOfSteps + 1 , y);
        }
    };

    presenter.drawRight = function (x, y, numberOfSteps) {
        if (arguments.length == 1) {
            presenter.drawHorizontalLine(presenter.actualCursorPosition[0] + 1, presenter.actualCursorPosition[0] + x, presenter.actualCursorPosition[1]);
        } else {
            presenter.drawHorizontalLine(x, x + numberOfSteps - 1, y);
        }
    };

    presenter.drawUp = function (x, y, numberOfSteps) {
        if (arguments.length == 1) {
            presenter.drawVerticalLine(presenter.actualCursorPosition[1] + 1, presenter.actualCursorPosition[1] + x, presenter.actualCursorPosition[0]);
        } else {
            presenter.drawVerticalLine(y, y + numberOfSteps - 1, x);
        }
    };

    presenter.drawDown = function (x, y, numberOfSteps) {
        if (arguments.length == 1) {
            presenter.drawVerticalLine(presenter.actualCursorPosition[1] - 1, presenter.actualCursorPosition[1]  - x, presenter.actualCursorPosition[0]);
        } else {
            presenter.drawVerticalLine(y, y - numberOfSteps + 1, x);
        }
    };

    presenter.setColor = function (color) {
        if (color.trim() === '') {
            return;
        }

        presenter.configuration.color = color;
    };

    presenter.generateFunction = function Grid_Scene_generate_function (code, name, args) {
        return eval ("(function() { return function(" + args + "){" + code + "}}())");
    };

    function isExcluded(name, excludedCommands) {
        if ((excludedCommands[name] != null) && (excludedCommands[name]['isExcluded'])) {
            return true;
        }
        return false;
    }

    presenter.getSceneCommands = function () {
        var commandsLabels = $.extend({}, presenter.LABELS, presenter.configuration.labels);
        var commands = {
            command_clear: delayDecorator(presenter.reset),
            command_mark: delayDecorator(presenter.mark),
            command_drawLeft: delayDecorator(presenter.drawLeft),
            command_drawRight: delayDecorator(presenter.drawRight),
            command_drawUp: delayDecorator(presenter.drawUp),
            command_drawDown: delayDecorator(presenter.drawDown),
            command_drawLeftFrom: delayDecorator(presenter.drawLeft),
            command_drawRightFrom: delayDecorator(presenter.drawRight),
            command_drawUpFrom: delayDecorator(presenter.drawUp),
            command_drawDownFrom: delayDecorator(presenter.drawDown),
            command_setColor: delayDecorator(presenter.setColor),
            command_setCursor: delayDecorator(presenter.setCursor),
            command_clearMark: delayDecorator(presenter.resetMark),
        };

        var result = {};
        for (var key in commands) {
            var label = commandsLabels[key];
            result[label] = commands[key];
        }

        var excludedCommands = presenter.configuration.excludedCommands;
        for (var excludedCommandName in excludedCommands) {
            if (isExcluded(excludedCommandName, excludedCommands)) {
                result[excludedCommandName] = delayDecorator(presenter.generateFunction("","empty",""));
            }
        }

        return result;
    };

    presenter.getCustomFunctions = function () {
        var customCommands = presenter.configuration.customCommands;
        var excludedCommands = presenter.configuration.excludedCommands;
        var customFunctions = "";
        for (var index = 0; index < customCommands.length; index++) {
            var customCommand = customCommands[index];
            if (!isExcluded(customCommand['name'], excludedCommands)) {
                customFunctions += "function " + customCommand['name'] + "(" + customCommand['arguments'] + "){" + customCommand['code'] + "};";
            }
            else {
                customFunctions += "function " + customCommand['name'] + "(){};";
            }
        }
        return customFunctions;
    };

    presenter.executeCode = function (code) {
        presenter.actualCursorPosition = [1,1];
        with (presenter.getSceneCommands()) {
            var customFunctions = presenter.getCustomFunctions();
            eval(customFunctions);
            try {
                eval(code);
            } catch (e) {
                console.log(e);
            }

        }
    };

    presenter.addCustomBlocks = function () {
        window.BlocklyCustomBlocks.SceneGrid.addBlocks(presenter.configuration.labels);
    };
    
    presenter.getToolboxCategoryXML = function () {
        var category = "<category name=\"GridScene\">";
        
        BlocklyCustomBlocks.SceneGrid.CUSTOM_BLOCKS_LIST.forEach(function (element) {
            var block = StringUtils.format("<block type=\"{0}\"></block>", element);
            category = StringUtils.format("{0}{1}", category, block); 
        });
        
        category = StringUtils.format("{0}{1}", category, "</category>");
        
        return category;
    };

    presenter.getState = function Grid_Scene_get_state () {
        return JSON.stringify(presenter.coloredGrid);
    };

    presenter.setState = function Grid_Scene_set_state (state) {
        if (state != null) {
            presenter.setColoredGridArray(JSON.parse(state));
        }
    };


    return presenter;
}