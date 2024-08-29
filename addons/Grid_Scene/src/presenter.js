function AddonGrid_Scene_create(){

    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;

    presenter.ERROR_CODES = {
        GS01: "Columns and rows must be a positive integer",
        GS02: "Delay have to be a positive integer",
        GS03: "Commands have to be a valid JSON string",
        GS04: "Error while getting file with commands. Check url.",
        CP01: "Custom Command must have command_arguments property",
        CP02: "Custom Command must have is_disabled property",
        CP03: "Custom Command must have command_code property",
        CP04: "Custom Command must have command_name property",
        CP05: "Custom Command must have valid JS name",
        CP06: "Custom Command arguments must have valid JS name",
        CP07: "Multiple Custom Command declared",
        AE01: "Multiple alias declaration in default commands",
        DA01: "Default Command alias must have valid JS name",
        DA02: "Default Command Arguments aliases must have valid JS names",
        BG01: "Exceeded maximum column number",
        BG02: "Exceeded maximum row number"
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
        "block_setCursor": "setCursor",
        "block_clearMark": "clearMark"
    };

    presenter.DEFAULT_COMMANDS_TO_BLOCKS = {
        "command_clear" : 'scene_grid_clear',
        "command_mark" : 'scene_grid_mark',
        "command_drawLeft" : 'scene_grid_drawleft',
        "command_drawRight" : 'scene_grid_drawright',
        "command_drawUp" : 'scene_grid_drawup',
        "command_drawDown" : 'scene_grid_drawdown',
        "command_drawLeftFrom" : 'scene_grid_drawleftfrom',
        "command_drawRightFrom" : 'scene_grid_drawrightfrom',
        "command_drawUpFrom" : 'scene_grid_drawupfrom',
        "command_drawDownFrom" : 'scene_grid_drawdownfrom',
        "command_setColor" : 'scene_grid_setcolor',
        "command_setCursor" : 'scene_grid_setcursor',
        "command_clearMark" : 'scene_grid_clearmark'
    };

    presenter.configuration = {
        isError : true,
        isVisible : true,
        isPreview: false,
        visibleByDefault : true,
        addonID : null,
        rows : null,
        columns : null,
        color : null,
        hasDelay: false,
        isErrorMode: false,
        isSavingAnswer: false,
        delay: 0,
        queLoopTimer: null,
        commandQueue: [],
        blockLabels: {},
        commandsLabels: {},
        excludedCommands: {},
        answerCode: "",
        isShowingAnswers: false,
        isAnswer: false,
        isVisible: true
    };


    presenter.originalCommands = null;

    presenter.commandsArgs = {
        "command_clear": "",
        "command_mark": "x, y",
        "command_drawLeft": "steps",
        "command_drawRight": "steps",
        "command_drawUp": "steps",
        "command_drawDown": "steps",
        "command_drawLeftFrom": "x, y, steps",
        "command_drawRightFrom": "x, y, steps",
        "command_drawUpFrom": "x, y, steps",
        "command_drawDownFrom": "x, y, steps",
        "command_setColor": "color",
        "command_setCursor": "x, y",
        "command_clearMark": "x, y"
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

    function isValidName (name) {
        return ModelValidationUtils.validateJSVariableName(name.trim()).isValid;
    }

    function returnErrorObject(errorCode) {
        return { isError: true, errorCode: errorCode };
    }

    var gridContainerWrapper;
    var gridContainer;

    presenter.initColoredGridArray = function Grid_Addon_initColoredGridArray(rows, columns) {
        for (var rows_index = 0; rows_index < rows; rows_index++) {
            presenter.coloredGrid[rows_index] = [];
            for (var columns_index = 0; columns_index < columns; columns_index++) {
                presenter.coloredGrid[rows_index][columns_index] = "Empty";
            }
        }
    };

    presenter.setColoredGridArray = function Grid_Addon_set_colored_grid_array (array) {
        var rows = presenter.configuration.rows;
        var columns = presenter.configuration.columns;

        for (var rows_index = 0; rows_index < rows; rows_index++) {
            for (var columns_index = 0; columns_index < columns; columns_index++) {
                if (array[rows_index][columns_index] != "Empty") {
                    presenter.setColor(array[rows_index][columns_index]);
                    presenter.markPoint(columns_index+1, rows_index+1);
                } else {
                    presenter.resetMark(columns_index+1, rows_index+1);
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
                wrapperElement.addClass('grid-scene-cell-element-wrapper');

                var selectableElement = $(document.createElement('div'));
                selectableElement.addClass('grid-scene-cell-element');
                selectableElement.attr('coordinates', (column+1)+"-"+((rows-row)));

                wrapperElement.append(selectableElement);
                gridContainer.append(wrapperElement);
            }
        }

        var gridContainerWrapperDimensions = getElementDimensions(gridContainerWrapper);
        var gridContainerWrapperDistances = calculateInnerDistance(gridContainerWrapperDimensions);

        var wrapperDimensions = getElementDimensions(gridContainerWrapper.find('.grid-scene-cell-element-wrapper:first')[0]);
        var wrapperDistances = calculateInnerDistance(wrapperDimensions);

        var elementDimensions = getElementDimensions(gridContainerWrapper.find('.grid-scene-cell-element:first')[0]);
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
        gridContainer.css('width', (parseInt(model.Width, 10)+parseInt(elementWidth / 2, 10)) + 'px');

        var vertical = verticalGapHeight / rows;
        var horizontal = horizontalGapHeight / columns;

        gridContainer.find(".grid-scene-cell-element-wrapper").each(function() {
            var index = $(this).index();
            var selectedRow = parseInt(index / columns, 10);

            $(this).width(wrapperWidth + horizontal + 2);
            $(this).height(wrapperHeight + vertical + 2);

            var selectableElement = $(this).find('.grid-scene-cell-element:first');

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

    presenter.colorSquare = function (x, y){
        if (!presenter.configuration.isSavingAnswer) {
            var coordinates = x + "-" + y;
            var element = presenter.$view.find('.grid-scene-cell-element[coordinates="' + coordinates + '"]');

            element.css('background-color', presenter.configuration.color);
            element.attr('colored', 'true');
        }
    };

    presenter.resetMark = function (x, y){
        presenter.actualCursorPosition = [x,y];
        var coordinates = x+"-"+ y;
        var element = presenter.$view.find('.grid-scene-cell-element[coordinates="'+ coordinates +'"]');
        if (ModelValidationUtils.validateIntegerInRange(x, presenter.configuration.columns + 1, 1).isValid != false) {
            if (ModelValidationUtils.validateIntegerInRange(y, presenter.configuration.rows + 1, 1).isValid != false) {
                presenter.coloredGrid[y - 1][x - 1] = "Empty";
            }
        }
        element.css('background-color', '');
        element.attr('colored', 'false');
        presenter.sendMarkEvent("clearMark", x, y);
    };
    
    
    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
    };

    presenter.run = function(view, model){
        presenter.presenterLogic(view, model, false);
        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
    };

    presenter.createPreview = function(view, model){
        presenter.presenterLogic(view, model, true);
    };

    presenter.presenterLogic = function(view, model, isPreview) {
        presenter.configuration.isPreview = isPreview;

        presenter.view = view;
        presenter.$view = $(view);

        presenter.configuration = $.extend({}, presenter.configuration, presenter.validateModel(model));
        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }


        gridContainerWrapper = presenter.$view.find(".grid-scene-wrapper:first");
        gridContainer = gridContainerWrapper.find(".grid-scene-cell:first");

        initGrid(model);
        presenter.setVisibility(presenter.configuration.isVisible || isPreview);

        MutationObserverService.createDestroyObserver(presenter.configuration.addonID, presenter.destroy, presenter.view);
        MutationObserverService.setObserver();

        if (!isPreview) {
            presenter.setQueLoopTimer();
        }

        presenter.saveAnswer(isPreview);

        presenter.actualCursorPosition = [1,1];
        presenter.startCursorPosition = presenter.actualCursorPosition;
    };

    presenter.saveAnswer = function Grid_Scene_save_answer(isPreview) {
        if (!isPreview) {
            presenter.configuration.isSavingAnswer = true;
        }

        var originalDelay = presenter.configuration.hasDelay;
        presenter.configuration.hasDelay = false;
        presenter.generateOriginalCommands();

        presenter.executeCode(presenter.configuration.answerCode);
        presenter.configuration.hasDelay = originalDelay;
        presenter.generateOriginalCommands();
        presenter.configuration.answer = $.extend(true,[], presenter.coloredGrid);

        presenter.initColoredGridArray(presenter.configuration.rows, presenter.configuration.columns);
        presenter.setColor(presenter.configuration.defaultColor);
        presenter.configuration.isSavingAnswer = false;

    };

    presenter.generateOriginalCommands = function () {
        presenter.originalCommands = {
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
                command_clearMark: delayDecorator(presenter.resetMark)
        };
    };

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
        clearInterval(presenter.configuration.queLoopTimer);
        presenter.$view = null;
        presenter.view = null;
        presenter.configuration = null;
        presenter.originalCommands = null;
        presenter.commandsArgs = null;
        presenter.coloredGrid = null;
        presenter.actualCursorPosition = null;
        presenter.lastState = null;
    };


    function haveDuplicatedValue(firstDict, secondDict) {
        for (var key in firstDict) {
            for (var comparedKey in secondDict) {
                if (firstDict.hasOwnProperty(key) && secondDict.hasOwnProperty(comparedKey)) {
                    if (key != comparedKey) {
                        if (firstDict[key] == secondDict[comparedKey]) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    presenter.validateModel = function(model) {
        var validatedIsVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);
        var addonID = model['ID'];
        var rows = ModelValidationUtils.validatePositiveInteger(model['Rows']);
        if (rows.value > 40) {
            return {
                isValid: false,
                errorCode: "BG02"
            }
        }
        var columns = ModelValidationUtils.validatePositiveInteger(model['Columns']);
        if (columns.value > 40) {
            return {
                isValid: false,
                errorCode: "BG01"
            }
        }

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


        var validatedDefaultCommands = presenter.validateDefaultCommands(model);
        if (!validatedDefaultCommands.isValid) {
            return validatedDefaultCommands;
        }

        var validatedTranslations = validatedDefaultCommands.value.translations;
        if (haveDuplicatedValue(validatedTranslations, validatedTranslations)) {
            return presenter.getErrorObject("AE01");
        }

        presenter.commandsArgs = $.extend(presenter.commandsArgs, validatedDefaultCommands.value.argumentsTranslation);

        var validatedCustomCommands = presenter.validateCustomCommands(model['custom_commands']);
        if (!validatedCustomCommands.isValid) {
            return validatedCustomCommands;
        }

        var validatedCommandsFromFile = presenter.validateCommandsJSON(model['json_commands']);
        if (!validatedCommandsFromFile.isValid) {
            return validatedCommandsFromFile;
        }

        var mergedCustomCommands = $.merge(validatedCustomCommands.value.commands,
                                 validatedCommandsFromFile.value.commands);

        var customCommandsNames = {};
        for (var i = 0; i < mergedCustomCommands.length; i++) {
            customCommandsNames[i] = mergedCustomCommands[i].name;
        }

        if (haveDuplicatedValue(customCommandsNames, customCommandsNames)) {
            return presenter.getErrorObject("CP07");
        }

        return {
            'isError' : false,
            'isVisible' : validatedIsVisible,
            'visibleByDefault' : validatedIsVisible,
            'addonID' : addonID,
            'rows' : rows.value,
            'columns' : columns.value,
            'color' : color,
            'defaultColor': color,
            'startPoint': null,
            'hasDelay': validatedDelay.hasDelay,
            'delay': validatedDelay.delay,
            'labels': validatedTranslations,
            'customCommands': mergedCustomCommands,
            'excludedCommands': $.extend({},validatedCustomCommands.value.excludedCommands,
                                    validatedDefaultCommands.value.excludedCommands,
                                    validatedCommandsFromFile.value.excludedCommands),
            'answerCode': model['answer'],
            'isAnswer': !ModelValidationUtils.isStringEmpty(model['answer'])
        };
    };

    presenter.validateDefaultCommand = function Grid_Scene_validate_default_command (key, command) {
        if (!ModelValidationUtils.isStringEmpty(command['alias'].trim())) {
            if (!isValidName(command['alias'])) {
                return presenter.getErrorObject("DA01");
            }
        }
        return {
            isValid: true,
            value : {
                validatedTranslation: command['alias'],
                validatedIsExcluded: ModelValidationUtils.validateBoolean(command['is_disabled']),
                validatedArgumentsTranslation: command['arguments_aliases']
            }
        };
    };

    presenter.validateDefaultCommands = function Grid_Scene_validate_default_commands (model) {
        var translations = {};
        var excludedCommands = {};
        var argumentsTranslation = {};
        var defaultCommands = model['default_commands'];
        for (var key in defaultCommands) {
            if (defaultCommands.hasOwnProperty(key)) {
                var validatedDefaultCommand = presenter.validateDefaultCommand(key, defaultCommands[key]);
                if (!validatedDefaultCommand.isValid) {
                    return validatedDefaultCommand;
                }
                if (!ModelValidationUtils.isStringEmpty(validatedDefaultCommand.value.validatedTranslation)) {
                    translations[key] = validatedDefaultCommand.value.validatedTranslation;
                }
                if (validatedDefaultCommand.value.validatedIsExcluded) {
                    excludedCommands[key] = true;
                }
                if (!ModelValidationUtils.isStringEmpty(validatedDefaultCommand.value.validatedArgumentsTranslation)) {
                    argumentsTranslation[key] = validatedDefaultCommand.value.validatedArgumentsTranslation;
                }
            }
    }

        return {
            isValid: true,
            value: {
                translations: translations,
                excludedCommands: excludedCommands,
                argumentsTranslation: argumentsTranslation
            }
        }
    };

    presenter.validateCustomCommand = function Grid_Scene_validate_command (command) {

        if (!command.hasOwnProperty('command_arguments')) {
            return presenter.getErrorObject("CP01");
        }
        if (!command.hasOwnProperty('is_disabled')) {
            return presenter.getErrorObject("CP02");
        }
        if (!command.hasOwnProperty('command_code')) {
            return presenter.getErrorObject("CP03");
        }
        if (!command.hasOwnProperty('command_name')) {
            return presenter.getErrorObject("CP04");
        }

        if (ModelValidationUtils.isStringEmpty(command['command_name'])) {
            return {
                isValid: true,
                name: null
            };
        }

        if (!isValidName(command['command_name'])) {   //REGEX to check name
            return presenter.getErrorObject("CP05");
        }

        if (!ModelValidationUtils.isStringEmpty(command['command_arguments'].trim())) {
            var argumentsSplited = command['command_arguments'].split(",");
            for (var key in argumentsSplited) {
                if(argumentsSplited.hasOwnProperty(key)) {
                    if(!isValidName(argumentsSplited[key])) { //REGEX to check name
                        return presenter.getErrorObject("CP06");
                    }
                }
            }
        }

        return {
            isValid: true,
            name: command['command_name'],
            arguments: command['command_arguments'],
            code: command['command_code'],
            isExcluded: ModelValidationUtils.validateBoolean(command['is_disabled'])
        };
    };

    presenter.validateCustomCommands = function Grid_Scene_validate_commands (commands) {
        var validatedCommands = [];
        var excludedCommands = {};

        for (var key in commands) {
            if (commands.hasOwnProperty(key)) {
                var validatedCommand = presenter.validateCustomCommand(commands[key]);
                if (!validatedCommand.isValid) {
                    return validatedCommand;
                }

                if (validatedCommand.name != null) {
                    validatedCommands.push(validatedCommand);
                    if (validatedCommand.isExcluded) {
                        excludedCommands[validatedCommand.name] = validatedCommand.isExcluded;
                    }
                }
            }
        }

        return {
            isValid: true,
            value: {
                commands: validatedCommands,
                excludedCommands: excludedCommands
            }
        };
    };

    presenter.validateCommandsJSON = function Grid_Scene_validate_commands_file (commands) {
        if (commands === undefined) {
            return {};
        }

        var trimmedCommands = commands.trim();
        var result;

        if (trimmedCommands == "") {
            result = {};
        } else {
            /*
            Remove all new lines from text
            e.g. : "Something
                    Here" -> "SomethingHere"
             */
            var data = commands.replace(/\r?\n|\r/g,""); //removing all new lines
            /*
            Change all tabulators to space in text
            e.g. : "Something    Here" -> "Something here"
             */
            data = data.replace(/\t/g," ");

            try {
                result = JSON.parse(data);
            } catch (e) {
                return  presenter.getErrorObject("GS03");
            }
        }

        var validatedCustomCommands = presenter.validateCustomCommands(result);
        if (!validatedCustomCommands.isValid) {
            return validatedCustomCommands;
        }

        return {
            isValid: true,
            value: validatedCustomCommands.value
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
        presenter.configuration.visibility = isVisible;
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.getDefaultCommands = function Grid_Scene_get_commands (withParams) {
        var functions = "";
        var labels = presenter.configuration.labels;

        if (withParams === undefined) {
            withParams = false;
        }

        for (var key in presenter.originalCommands) {
            if (presenter.originalCommands.hasOwnProperty(key)) {
                if (!(presenter.configuration.excludedCommands.hasOwnProperty(key))) {
                    var functionText = "";
                    var args = "";

                    if (labels.hasOwnProperty(key)) {
                        functionText = labels[key];
                    } else {
                        functionText = presenter.LABELS[key];
                    }

                    if (withParams) {
                        args = "(" + presenter.commandsArgs[key] + ")";
                    }

                    functions += functionText + args + "<br />";
                }
            }
        }
        return functions;
    };

    presenter.getCustomCommands = function Grid_Screne_get_custom_commands (withParams) {
        var commands = "";

        if (withParams === undefined) {
            withParams = false;
        }

        var customCommands = presenter.configuration.customCommands;
        for (var key in customCommands) {
            if (customCommands.hasOwnProperty(key)) {
                if (!(customCommands[key].name in presenter.configuration.excludedCommands)) {
                    var args ="";

                    if (withParams) {
                        args = "(" + customCommands[key].arguments + ")";
                    }

                    commands += customCommands[key].name + args + "<br />";
                }
            }
        }
        return commands;
    };

    presenter.getCommands = function Grid_Screne_get_custom_commands (withParams) {
        if (withParams === undefined) {
            withParams = false;
        }

        return presenter.getDefaultCommands(withParams) + presenter.getCustomCommands(withParams);
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
            'executeCode': applyDecorator(presenter.executeCode),
            'getDefaultCommands': applyDelayDecorator(presenter.getDefaultCommands),
            'getCustomCommands': applyDelayDecorator(presenter.getCustomCommands),
            'getCommands': applyDelayDecorator(presenter.getCommands),
            'isAllOK': presenter.isAllOK
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.reset = function(){
        presenter.$view.find('.grid-scene-cell-element').each(function () {
            $(this).removeClass('grid-scene-wrong').removeClass('grid-scene-cell-element-wrapper');
            if($(this).attr('colored') == 'true'){
                var coordinates = $(this).attr('coordinates').split('-');
                presenter.resetMark(coordinates[0], coordinates[1]);
            }
        });

        var rows = presenter.configuration.rows;
        var columns = presenter.configuration.columns;
        presenter.initColoredGridArray(rows,columns);

        presenter.setVisibility(presenter.configuration.visibleByDefault);
        presenter.configuration.color = presenter.configuration.defaultColor;

        if(presenter.configuration.answer.length > 0){
            presenter.actualCursorPosition = presenter.startCursorPosition;
        }else {
            presenter.actualCursorPosition = [1,1];
        }

        presenter.configuration.isErrorMode = false;
        presenter.configuration.isShowingAnswers = false;
    };

    presenter.setCursor = function (x, y) {
        if(!isNaN(parseInt(x, 10)) && !isNaN(parseInt(y, 10))) {
            presenter.actualCursorPosition = [x, y];
        }
    };

    presenter.drawHorizontalLine = function (from, to, y) {
        if (from <= to) {
            for (var i = from; i <= to; i++) {
                presenter.markPoint(i, y);
            }
        } else {
            for (var i = from; i >= to; i--) {
                presenter.markPoint(i, y);
            }
        }
    };

    presenter.drawVerticalLine = function (from, to, x) {
        if (from <= to) {
            for (var i = from; i <= to; i++) {
                presenter.markPoint(x, i);
            }
        } else {
            for (var i = from; i >= to; i--) {
                presenter.markPoint(x, i);
            }
        }

    };

    presenter.clear = presenter.reset;

    presenter.clearMark = presenter.resetMark;

    presenter.markPoint = function(x, y) {
        x = parseInt(x, 10);
        y = parseInt(y, 10);
        presenter.actualCursorPosition = [x,y];
        if (ModelValidationUtils.validateIntegerInRange(x, presenter.configuration.columns, 1).isValid != false) {
            if (ModelValidationUtils.validateIntegerInRange(y, presenter.configuration.rows, 1).isValid != false) {
                presenter.coloredGrid[y - 1][x - 1] = presenter.configuration.color;
            }
        }
        presenter.colorSquare(x, y);
    };

    presenter.mark = function mark (x, y) {
        presenter.markPoint(x, y);
        presenter.sendMarkEvent("mark", x, y);
    };

    presenter.sendMarkEvent = function (name, x, y) {
        var eventData = {
            'source': presenter.configuration.addonID,
            'item': name,
            'value': x +"-"+ y,
            'score': ''
        };
        sendValueChangedEvent(eventData);
    };

    presenter.sendDrawFromEvent = function (name, x, y, numberOfSteps) {
        var eventData = {
            'source': presenter.configuration.addonID,
            'item': name,
            'value': x +"-"+ y +"-"+ numberOfSteps,
            'score': ''
        };
        sendValueChangedEvent(eventData);
    };

    presenter.sendDrawEvent = function (name, x) {
        var eventData = {
            'source': presenter.configuration.addonID,
            'item': name,
            'value': x,
            'score': ''
        };
        sendValueChangedEvent(eventData);
    };

    presenter.drawLeft = function (x, y, numberOfSteps) {
        x = parseInt(x, 10);
        y = parseInt(y, 10);
        numberOfSteps = parseInt(numberOfSteps, 10);
        if (arguments.length == 1) {
            if (x <= 0) return;
            presenter.drawHorizontalLine( presenter.actualCursorPosition[0] - 1, presenter.actualCursorPosition[0] - x, presenter.actualCursorPosition[1]);
            presenter.sendDrawEvent("drawLeft", x);
        } else {
            if (numberOfSteps <= 0) return;
            presenter.drawHorizontalLine(x, x - numberOfSteps + 1 , y);
            presenter.sendDrawFromEvent("drawLeftFrom", x, y, numberOfSteps);
        }
    };

    presenter.drawLeftFrom = presenter.drawLeft;

    presenter.drawRight = function (x, y, numberOfSteps) {
        x = parseInt(x, 10);
        y = parseInt(y, 10);
        numberOfSteps = parseInt(numberOfSteps, 10);
        if (arguments.length == 1) {
            if (x <= 0) return;
            presenter.drawHorizontalLine(presenter.actualCursorPosition[0] + 1, presenter.actualCursorPosition[0] + x, presenter.actualCursorPosition[1]);
            presenter.sendDrawEvent("drawRight", x);
        } else {
            if (numberOfSteps <= 0) return;
            presenter.drawHorizontalLine(x, x + numberOfSteps - 1, y);
            presenter.sendDrawFromEvent("drawRightFrom", x, y, numberOfSteps);
        }
    };

    presenter.drawRightFrom = presenter.drawRight;

    presenter.drawUp = function (x, y, numberOfSteps) {
        x = parseInt(x, 10);
        y = parseInt(y, 10);
        numberOfSteps = parseInt(numberOfSteps);
        if (arguments.length == 1) {
            if (x <= 0) return;
            presenter.drawVerticalLine(presenter.actualCursorPosition[1] + 1, presenter.actualCursorPosition[1] + x, presenter.actualCursorPosition[0]);
            presenter.sendDrawEvent("drawUp", x);
        } else {
            if (numberOfSteps <= 0) return;
            presenter.drawVerticalLine(y, y + numberOfSteps - 1, x);
            presenter.sendDrawFromEvent("drawUpFrom", x, y, numberOfSteps);
        }
    };

    presenter.drawUpFrom = presenter.drawUp;

    presenter.drawDown = function (x, y, numberOfSteps) {
        x = parseInt(x, 10);
        y = parseInt(y, 10);
        numberOfSteps = parseInt(numberOfSteps, 10);
        if (arguments.length == 1) {
            if (x <= 0) return;
            presenter.drawVerticalLine(presenter.actualCursorPosition[1] - 1, presenter.actualCursorPosition[1]  - x, presenter.actualCursorPosition[0]);
            presenter.sendDrawEvent("drawDown", x);
        } else {
            if (numberOfSteps <= 0) return;
            presenter.drawVerticalLine(y, y - numberOfSteps + 1, x);
            presenter.sendDrawFromEvent("drawDownFrom", x, y, numberOfSteps);
        }
    };

    presenter.drawDownFrom = presenter.drawDown;

    presenter.setColor = function (color) {
        if (color.trim() === '') {
            return;
        }
        presenter.configuration.color = color;
    };

    presenter.generateCommand = function Grid_Scene_generate_command (code, name, args) {
        return eval ("(function() { return function(" + args + "){" + code + "}}())");
    };

    function isExcluded(name, excludedCommands) {
        if ((excludedCommands[name] != null) && (excludedCommands[name])) {
            return true;
        }
        return false;
    }

    presenter.getSceneCommands = function () {
        var commandsLabels = $.extend({}, presenter.LABELS, presenter.configuration.labels);

        var commands = $.extend(true, {}, presenter.originalCommands);
        var excludedCommands = presenter.configuration.excludedCommands;

        for (var key in excludedCommands) {
            if (excludedCommands.hasOwnProperty(key)) {
                if (commands.hasOwnProperty(key)) {
                    commands[key] = delayDecorator(presenter.generateCommand("", "empty", ""));
                }
            }
        }

        var result = {};
        for (var key in commands) {
            var label = commandsLabels[key];
            result[label] = commands[key];
        }

        return result;
    };

    presenter.getCustomCommandsToEval = function () {
        var customCommands = presenter.configuration.customCommands;
        var excludedCommands = presenter.configuration.excludedCommands;
        var customCommandsString = "";
        for (var index = 0; index < customCommands.length; index++) {
            var customCommand = customCommands[index];
            if (!isExcluded(customCommand['name'], excludedCommands)) {
                customCommandsString += "function " + customCommand['name'] + "(" + customCommand['arguments'] + "){" + customCommand['code'] + "};";
            }
            else {
                customCommandsString += "function " + customCommand['name'] + "(){};";
            }
        }
        return customCommandsString;
    };

    presenter.executeCode = function (code) {
        if (presenter.configuration.isShowingAnswers || presenter.configuration.isErrorMode)  {
            return;
        }

        with (presenter.getSceneCommands()) {
            var customCommands = presenter.getCustomCommandsToEval();
            try {
                eval(customCommands);
                eval(code);
            } catch (e) { }

        }
        sendRunEvent();

        if (presenter.isAllOK()) {
            sendAllOKEvent();
        }
    };

    presenter.getState = function Grid_Scene_get_state () {
        if(presenter.configuration.isShowingAnswers) {
            presenter.hideAnswers();
        }

        return JSON.stringify( {
            grid: presenter.coloredGrid,
            visibility: presenter.configuration.isVisible,
            color: presenter.configuration.color
        });
    };

    presenter.setState = function Grid_Scene_set_state (state) {
        if (state != null) {
            var state = JSON.parse(state);
            presenter.setColoredGridArray(state.grid);
            presenter.setVisibility(state.visibility);
            presenter.setColor(state.color);
        }
    };

    presenter.getMaxScore = function Grid_Scene_get_max_score () {
        if (!presenter.configuration.isAnswer) {
            return 0;
        }
        return 1;
    };

    presenter.getScore = function Grid_Scene_get_score () {
        if (!presenter.configuration.isAnswer) {
            return 0;
        }
        if (presenter.configuration.isShowingAnswers) {
            return 0;
        }

        var rows = presenter.configuration.rows;
        var columns = presenter.configuration.columns;
        var answer = presenter.configuration.answer;
        var actualState = presenter.coloredGrid;
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                if (actualState[i][j] != answer[i][j]) {
                    return 0;
                }
            }
        }
        return 1;
    };

    presenter.getErrorCount = function () {
        if (!presenter.configuration.isAnswer) {
            return 0;
        }
        var errors = 0;
        var rows = presenter.configuration.rows;
        var columns = presenter.configuration.columns;
        var answer = presenter.configuration.answer;
        var actualState = presenter.coloredGrid;
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                if (actualState[i][j] == "Empty")
                    continue;
                if (actualState[i][j] != answer[i][j]) {
                    errors ++;
                }
            }
        }
        return errors;
    };

    presenter.setWorkMode = function () {
        if (!presenter.configuration.isAnswer) {
            return 0;
        }
        var rows = presenter.configuration.rows;
        var columns = presenter.configuration.columns;
        for (var i = 0; i < columns; i++){
            for (var j = 0; j < rows; j++){
                var coordinates = (i + 1) + "-" +(1 + j);
                var element = presenter.$view.find('.grid-scene-cell-element[coordinates="' + coordinates + '"]');
                element.removeClass('grid-scene-wrong').removeClass('grid-scene-correct');
            }
        }
        presenter.configuration.isErrorMode = false;
        presenter.setColoredGridArray(presenter.coloredGrid);
        presenter.actualCursorPosition = presenter.currentCursorPosition;
    };

    presenter.setShowErrorsMode = function () {
        if (!presenter.configuration.isAnswer) {
            return 0;
        }
        if (presenter.configuration.isShowingAnswers) {
            presenter.hideAnswers();
        }
        var rows = presenter.configuration.rows;
        var columns = presenter.configuration.columns;
        var answer = presenter.configuration.answer;
        var actualState = presenter.coloredGrid;

        for (var i = 0; i < columns; i++){
            for (var j = 0; j < rows; j++){
                var coordinates = (i + 1) + "-" +(j + 1);
                var element = presenter.$view.find('.grid-scene-cell-element[coordinates="' + coordinates + '"]');
                element.css('background-color', '');
                if (actualState[j][i] != "Empty") {
                    if (answer[j][i] == actualState[j][i]) {
                        element.addClass('grid-scene-correct');
                    } else {
                        element.addClass('grid-scene-wrong');
                    }
                }
            }
        }

        presenter.currentCursorPosition = presenter.actualCursorPosition;

        presenter.configuration.isErrorMode = true;
    };

    presenter.showAnswers = function AddonIFrame_Communication_show_answers () {
        if (!presenter.configuration.isAnswer) {
            return 0;
        }

        presenter.beforeSACursorPosition = presenter.actualCursorPosition;

        if(presenter.configuration.isErrorMode) {
            presenter.setWorkMode();
        }
        presenter.lastState = $.extend(true,[], presenter.coloredGrid);
        presenter.reset();
        presenter.configuration.isShowingAnswers = true;
        presenter.setColoredGridArray(presenter.configuration.answer);
    };

    presenter.hideAnswers = function AddonIFrame_Communication_hide_answers () {
        if (!presenter.configuration.isAnswer) {
            return 0;
        }
        presenter.configuration.isShowingAnswers = false;
        presenter.reset();
        presenter.coloredGrid = presenter.lastState;
        presenter.lastState = null;
        presenter.setColoredGridArray(presenter.coloredGrid);
        presenter.actualCursorPosition = presenter.beforeSACursorPosition;
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        } else if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.isAllOK = function () {
        if (!presenter.configuration.isSavingAnswer) {
            if (!presenter.configuration.isPreview) {
                var rows = presenter.configuration.rows;
                var columns = presenter.configuration.columns;
                var answer = presenter.configuration.answer;
                var actualState = presenter.coloredGrid;
                for (var i = 0; i < rows; i++) {
                    for (var j = 0; j < columns; j++) {
                        if (actualState[i][j] != answer[i][j]) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    };

    presenter.getBlocklyData = function () {
        var excludedBlocks = {};
        for (var key in presenter.DEFAULT_COMMANDS_TO_BLOCKS) {
            if (presenter.DEFAULT_COMMANDS_TO_BLOCKS.hasOwnProperty(key)) {
                if (!presenter.configuration.excludedCommands.hasOwnProperty(key)) {
                    excludedBlocks[presenter.DEFAULT_COMMANDS_TO_BLOCKS[key]] = true;
                }
            }
        }
        return {
            "type": "GridScene",
            "labels": $.extend({}, presenter.LABELS, presenter.configuration.labels),
            "availableBlocks" : excludedBlocks

        }
    };

    function sendRunEvent () {
        sendValueChangedEvent({
            'source': presenter.configuration.addonID,
            'item': 'all',
            'value': 1,
            'score': ''
        });
    }

    function sendAllOKEvent() {
        var eventData = {
            'source': presenter.configuration.addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };
        sendValueChangedEvent(eventData);
    }

    function sendValueChangedEvent(eventData) {
        if (presenter.eventBus != null) {
            presenter.eventBus.sendEvent('ValueChanged', eventData);
        }
    }


    return presenter;
}