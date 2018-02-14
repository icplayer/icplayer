import { getLanguageParser } from './language-definition.jsm';
import { DEFINED_OBJECTS } from './defined-objects.jsm';
import { EXCEPTIONS } from './defined-exceptions.jsm';
import { CODE_GENERATORS } from './language-code-generators.jsm';
import { TYPES } from './language-utils.jsm';

/**
 * Teoria:
 * http://wazniak.mimuw.edu.pl/index.php?title=Podstawy_kompilator%C3%B3w
 * Check comments if you want to add OOP to language.
 */
function AddonPseudoCode_Console_create() {
    let presenter = function () {},
        JISON_GRAMMAR = null;

    // ----------------------- LANGUAGE COMPILER SECTION -----------------------------------


    /**
     * Each object in pseudocode console must be created by this mock.
     */
    presenter.objectMocks = DEFINED_OBJECTS;

    presenter.bnf = CODE_GENERATORS;



    /**
     * Generate code executed by addon.
     * @param  {String} code
     * @param  {String} label set label for goto instruction
     * @param  {Boolean} [isAsync] async instructions cant be merged and is optional
     */


    presenter.exceptions = EXCEPTIONS;
    // ---------------------------------- ADDON SECTION ---------------------------------------------------------------

    //This object will be passed to instruction as scope
    presenter.objectForInstructions = {
        calledInstructions: {
            for: 0,
            while: 0,
            doWhile: 0,
            if: 0,
            case: 0
        },    //Object with calculated each built in instruction call e.g. for, while,
        data: {

        }
    };

    presenter.state = {
        console: null,
        functions: {},          //Functions defined by user
        codeGenerator: null,    //Generator code to execute from string.
        wasChanged: false,      //If code was changed and addon must recalculate score
        lastScore: 0,           //Last score, we dont need to recalculate score if user dont run code
        lastUsedCode: [],        //Compiled code which was last used,
        definedByUserFunctions: [], //Functions defined by user
        variablesAndFunctionsUsage : {} //Functions and variables used by user each element contains: {defined: [], args: [], vars: [], fn: []}
    };

    presenter.configuration = {
        aliases: {
            "begin": "begin",
            "do": "do",
            "end": "end",
            "for": "for",
            "from": "from",
            "to": "to",
            "variable": "variable",
            "program": "program",
            "while": "while",
            "or": "or",
            "and": "and",
            "if": "if",
            "then": "then",
            "else": "else",
            "case": "case",
            "option": "option",
            "function": "function",
            "return": "return",
            "array_block": "array",
            "down_to": "downto",
            "by": "by"
        },
        isValid: false,
        addonID: null,
        isActivity: false,
        isVisibleByDefault: false,
        functions: [],
        answer: null,
        methods: []
    };

    presenter.ERROR_CODES = {
        "FN01": "Defined function name must match to ^[A-Za-z_][a-zA-Z0-9_]*$",
        "FN02": "Defined function must have unique name",
        "FN03": "Defined function overrides built in alias",
        "AN01": "Defined alias name must match to ^[A-Za-z_][a-zA-Z0-9_]*$",
        "AN02": "Multiple aliases got the same name",
        "JS01": "Java Script code in mdefined ethod is not valid.",
        "JS02": "Java Script code in defined function is not valid",
        "ER01": "Round value must be a integer",
        "ER02": "Round value must be bigger than 0",
        "ER03": "Round value must be below 100"
    };

    presenter.setPlayerController = function presenter_setPlayerController (controller) {
        presenter.state.playerController = controller;
        presenter.state.eventBus = presenter.state.playerController.getEventBus();
        presenter.state.eventBus.addEventListener('ShowAnswers', this);
        presenter.state.eventBus.addEventListener('HideAnswers', this);
    };

    presenter.killMachine = {}; // Object which contains all machines with kill machine function

    presenter.killAllMachines = function presenter_killAllMachines () {
        let id;

        for (id in presenter.killMachine) {
            if (presenter.killMachine.hasOwnProperty(id)) {
                presenter.killMachine[id]();
            }
        }
    };

    presenter.run = function presenter_run (view, model) {
        presenter.initialize(view, model, false);
    };

    presenter.createPreview = function presenter_createPreview (view, model) {
        presenter.initialize(view, model, true);
    };

    presenter.initializeGrammar = function presenter_initializeGrammar () {
        presenter.state.codeGenerator = getLanguageParser({
            presenter: presenter,
            aliases: presenter.configuration.aliases
        });
    };

    /**
     * Before each user code call, this object should be initialized
     * @param  {Object} [consoleMock] optional argument for console
     */
    presenter.initializeObjectForCode = function presenter_initializeObjectForCode (consoleMock) {
        presenter.objectForInstructions = {
            calledInstructions: {
                for: 0,
                while: 0,
                doWhile: 0,
                if: 0,
                case: 0
            },
            data: {

            }
        };
        presenter.objectForInstructions.console = consoleMock || presenter.state.console;
        presenter.state.definedByUserFunctions = [];
    };

    presenter.initializeConsole = function presenter_initializeConsole () {
        presenter.state.console = new presenter.console(presenter.state.$view.find(".addon-PseudoCode_Console-wrapper"));
        let originalReadLine = presenter.state.console.ReadLine,
            originalReadChar = presenter.state.console.ReadChar;

        /**
         * Because console is asynchronous but pseudocode console is synchronous we must wrap user callback  for console.
         * Before executing original console function we must stop machine which is executing this code and when user enters input then we resume machine
         * pauseIns and nextIns are set while executing each command (see dispatchForBuiltInFunctions which is calling wrapMethodOrFunctionWithBuiltInCode code)
         * @param callback {Function}
         */
        presenter.state.console.ReadLine = function console_read_line_override (callback) {
            presenter.state.console.pauseIns();
            originalReadLine.call(presenter.state.console, function (input) {
                callback.call(this, input);
                presenter.state.console.nextIns();
            });
        };

        /**
         * Like ReadLine
         * @param callback {Function}
         */
        presenter.state.console.ReadChar = function console_read_char_override (callback) {
            presenter.state.console.pauseIns();
            originalReadChar.call(presenter.state.console, function (input) {
                callback.call(this, input);
                presenter.state.console.nextIns();
            });
        };
    };

    presenter.completeObjectsMethods = function presenter_completeObjectsMethods () {
        presenter.configuration.methods.forEach(function (method) {
            if (method.objectName !== "" && method.methodName !== "") {
                presenter.objectMocks[method.objectName].__methods__[method.methodName] = {
                    native: true,
                    jsCode: method.function
                };
            }
        });
    };

    presenter.initialize = function presenter_initialize (view, model, isPreview) {
        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }
        presenter.state.$view = $(view);
        presenter.state.view = view;
        if (!isPreview) {
            presenter.initializeConsole();
            presenter.initializeObjectForCode();
            presenter.initializeGrammar();
            presenter.completeObjectsMethods();
        }
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        view.addEventListener('DOMNodeRemoved', presenter.destroy);
    };

    presenter.stop = function presenter_stop () {
        presenter.state.console.Reset();
        presenter.killAllMachines();
    };

    presenter.onEventReceived = function presenter_onEventReceived (eventName) {
        if (eventName === "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName === "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.executeCommand = function presenter_executeCommand (name, params) {
        let commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'stop': presenter.stop,
            'showAnswers' : presenter.showAnswers,
            'hideAnswers' : presenter.hideAnswers
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.showAnswers = function presenter_showAnswers () {
        presenter.state.console.disable();
    };

    presenter.hideAnswers = function presenter_hideAnswers () {
        presenter.state.console.enable();
    };

    presenter.destroy = function presenter_destroy (event) {
        if (event.target !== this) {
            return;
        }

        presenter.state.view.removeEventListener("DOMNodeRemoved", presenter.destroy);
        if (presenter.state.console) {
            presenter.state.console.destroy();
        }
    };

    presenter.setVisibility = function presenter_setVisibility (isVisible) {
        presenter.state.$view.css('visibility', isVisible ? 'visible' : 'hidden');
        presenter.state.$view.css('display', isVisible ? 'block' : 'none');

        presenter.state.isVisible = isVisible;
    };

    presenter.show = function presenter_show () {
        presenter.setVisibility(true);
    };

    presenter.hide = function presenter_hide () {
        presenter.setVisibility(false);
    };

    presenter.reset = function presenter_reset () {
        presenter.killAllMachines();
        presenter.state.console.Reset();
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        presenter.state.console.enable();
    };

    presenter.setShowErrorsMode = function presenter_setShowErrorsMode () {
        presenter.state.console.disable();
    };

    presenter.setWorkMode = function presenter_setWorkMode () {
        presenter.state.console.enable();
    };

    presenter.setState = function presenter_setState (stateString) {
        let state = JSON.parse(stateString);

        presenter.setVisibility(state.isVisible);
        presenter.state.lastScore = state.score;
    };

    presenter.getState = function presenter_getState () {
        let state = {
            isVisible: presenter.state.isVisible,
            score: presenter.state.lastScore
        };

        return JSON.stringify(state);
    };

    presenter.evaluateScoreFromLastOutput = function presenter_evaluateScoreFromLastOutput () {
        try {
            if (presenter.configuration.answer.answerCode.call(presenter.objectForInstructions)) {
                return 1;
            }

            return 0;

        } catch (e) {
            return 0;
        }
    };

    presenter.generateConsoleMock = function presenter_generateConsoleMock (input) {
        let actualInputIndex = 0;
        return {
            Reset: function () {

            },

            ReadLine: function (callback) {
                let actualInput = input[actualInputIndex];
                if (actualInput !== null) {
                    callback.call(presenter.state.console, actualInput);
                    actualInputIndex += 1;
                }
            },

            ReadChar: function (callback) {
                let actualInput = input[actualInputIndex];
                if (actualInput !== null) {
                    callback.call(presenter.state.console, actualInput);
                    actualInputIndex += 1;
                }
            },
            Write: function () {

            }
        };
    };

    presenter.evaluateScoreFromUserCode = function presenter_evaluateScoreFromUserCode () {
        let code = presenter.state.lastUsedCode,
            objectForInstructionsSaved = presenter.objectForInstructions,
            score;

        presenter.initializeObjectForCode(presenter.generateConsoleMock(presenter.configuration.answer.parameters));
        presenter.codeExecutor(code, true);
        score = presenter.evaluateScoreFromLastOutput();

        presenter.objectForInstructions = objectForInstructionsSaved;

        return score;
    };

    presenter.evaluateScore = function presenter_evaluateScore () {
        if (presenter.configuration.answer.runUserCode) {
            return presenter.evaluateScoreFromUserCode();
        }

        return presenter.evaluateScoreFromLastOutput();
    };

    function sendValueChangedEvent(eventData) {
        if (presenter.state.eventBus !== null) {
            presenter.state.eventBus.sendEvent('ValueChanged', eventData);
        }
    }

    function sendScoreChangedEvent(score) {
        let eventData = {
            'source': presenter.configuration.addonID,
            'item': 'all',
            'value': '',
            'score': score
        };
        sendValueChangedEvent(eventData);
    }

    presenter.getScore = function presenter_getScore () {
        if (!presenter.state.wasChanged) {
            return presenter.state.lastScore;
        }

        let score = 0;
        if (presenter.configuration.isActivity) {
            score = presenter.evaluateScore();

            presenter.state.lastScore = score;
            presenter.state.wasChanged = false;

            sendScoreChangedEvent(score);
        }

        return score;
    };

    presenter.getMaxScore = function presenter_getMaxScore () {
        if (presenter.configuration.isActivity) {
            return 1;
        }

        return 0;
    };

    presenter.getErrorCount = function presenter_getErrorCount () {
        if (presenter.configuration.isActivity) {
            return 1 - presenter.getScore();
        }

        return 0;
    };

    presenter.getExcludedNames = function presenter_getExcludedNames () {
        let i,
            excludedNames = {};

        for (i in presenter.configuration.aliases) {
            if (presenter.configuration.aliases.hasOwnProperty(i)) {
                excludedNames[presenter.configuration.aliases[i]] = true;
            }
        }

        for (i in presenter.configuration.functions) {
            if (presenter.configuration.functions.hasOwnProperty(i)) {
                excludedNames[i] = true;
            }
        }

        return excludedNames;
    };

    /**
     * If user defined function which was defined then throw error
     */
    presenter.multiDefineInstructionChecker = function presenter_multiDefineInstructionChecker () {
        let i,
            userFunctionName = "",
            excludedNames = presenter.getExcludedNames();


        for (i = 0; i < presenter.state.definedByUserFunctions.length; i += 1) {
            userFunctionName = presenter.state.definedByUserFunctions[i];
            if (!excludedNames[userFunctionName]) {
                excludedNames[userFunctionName] = true;
            } else {
                throw new presenter.exceptions.InstructionIsDefinedException(userFunctionName);
            }
        }
    };

    /**
     * User calls undefined function
     * @param  {{defined: String[], args: String[], vars:String [], fn: String[]}} functionData
     * @param  {String} functionName
     */
    presenter.undefinedUsageForFunctionChecker = function presenter_undefinedUsageForFunctionChecker(functionData, functionName) {
        let usedVariableName = "",
            usedFunctionName = "",
            i,
            excludedNames = presenter.getExcludedNames();

        for (i = 0; i < functionData.vars.length; i += 1) {
            usedVariableName = functionData.vars[i];
            if ($.inArray(usedVariableName, functionData.defined) === -1 && $.inArray(usedVariableName, functionData.args) === -1) {
                throw new presenter.exceptions.UndefinedVariableNameException(usedVariableName, functionName);
            }
        }

        for (i = 0; i < functionData.fn.length; i += 1) {
            usedFunctionName = functionData.fn[i];
            if (!excludedNames[usedFunctionName] && $.inArray(usedFunctionName, presenter.state.definedByUserFunctions) === -1) {
                throw new presenter.exceptions.UndefinedFunctionNameException(usedFunctionName, functionName);
            }
        }
    };

    /**
     * Check if user uses not defined variable or instruction
     */
    presenter.undefinedInstructionOrVariableChecker = function presenter_undefinedInstructionOrVariableChecker () {
        let i,
            usedVariablesAndFunctions = {};

        for (i in presenter.state.variablesAndFunctionsUsage) {
            if (presenter.state.variablesAndFunctionsUsage.hasOwnProperty(i)) {
                usedVariablesAndFunctions = presenter.state.variablesAndFunctionsUsage[i];
                presenter.undefinedUsageForFunctionChecker(usedVariablesAndFunctions, i);
            }
        }
    };

    presenter.checkCode = function presenter_checkCode () {
        presenter.multiDefineInstructionChecker();
        presenter.undefinedInstructionOrVariableChecker();
    };

    presenter.executeCode = function presenter_executeCode (code) {
        if (!presenter.configuration.isValid) {
            return;
        }

        presenter.state.variablesAndFunctionsUsage = {};
        presenter.state.wasChanged = true;
        presenter.initializeObjectForCode();
        try {
            presenter.state.console.Reset();
            let executableCode = presenter.state.codeGenerator.parse(code);

            console.log(executableCode);

            presenter.checkCode();

            presenter.state.lastUsedCode = executableCode;
            presenter.stop();

            presenter.codeExecutor(executableCode, false);
        } catch (e) {
            if (e.name !== "Error") {
                presenter.state.console.Write(e.message + "\n", 'program-error-output');
            } else {
                presenter.state.console.Write("Unexpected identifier\n", 'program-error-output');
            }
        }
    };

    /**
     * @param  {Object} parsedData parsed code by jison
     * @param  {Boolean} getScore if function will be called to get score
     */
    presenter.codeExecutor = function presenter_codeExecutor (parsedData, getScore) {
        let actualIndex = 0,
            code = parsedData.code,
            timeoutId = 0,
            isEnded = false,
            startTime = new Date().getTime() / 1000,
            actualScope = {},         // There will be saved actual variables
            stack = [],               // Stack contains saved scopes
            functionsCallPositionStack = [], //Stack which contains information about actual executed code position.
            retVal = {value: 0},      // value returned by function,
            eax = {value: 0},         // Helper register used in generated code (used for saving temporary data while executing code)
            ebx = {value: 0},         // Helper register used in generated code (used for saving temporary data while executing code)
            id = window.Helpers.uuidv4();            // Each machine contains own unique id which will be saved in presenter

        function getIndexByLabel(label) {
            let i;
            for (i = 0; i < code.length; i += 1) {
                if (code[i] && code[i].label === label) {
                    return i;
                }
            }
        }

        /**
         *  Execute each line of code generated by JISON
         * @returns {Boolean} false - if code was executed, true if program is ended
         */
        function executeLine() {
            let actualEntry = code[actualIndex];
            if (actualEntry) {
                if (actualEntry.type === TYPES.EXECUTE) {
                    eval(actualEntry.code);
                    actualIndex += 1;
                } else if (actualEntry.type === TYPES.JUMP) {
                    if (eval(actualEntry.code)) {
                        actualIndex = getIndexByLabel(actualEntry.toLabel);
                    } else {
                        actualIndex += 1;
                    }
                }
                return false;
            }
            return true;
        }

        function pause() {
            clearTimeout(timeoutId);
        }

        function next() {
            if (!isEnded) {
                timeoutId = setTimeout(executeAsync, 1);
            }
        }

        function executeAsync() {
            next();
            try {
                isEnded = executeLine();
                if (isEnded) {
                    pause();
                }
            } catch (e) {
                if (!e.message) {
                    presenter.state.console.Write(e + "\n", 'program-error-output');
                } else {
                    presenter.state.console.Write(e.message + "\n", 'program-error-output');
                }
                killMachine();
            }
        }

        function killMachine() {
            pause();
            delete presenter.killMachine[id];
            actualScope = null;
            stack = null;
            functionsCallPositionStack = null;
            eax = null;
            ebx = null;
            isEnded = true;
            return true;
        }

        function executeCodeSyncWithMaxTime() {
            let actualTime;
            while (true) {
                actualTime = new Date().getTime() / 1000;
                if (actualTime - startTime > presenter.configuration.answer.maxTimeForAnswer.parsedValue) {
                    killMachine();
                    return;
                }
                try {
                    isEnded = executeLine();
                    if (isEnded) {
                        killMachine();
                        return;
                    }
                } catch (e) {
                    killMachine();
                    return;
                }
            }
        }

        presenter.killMachine[id] = killMachine;

        eval(parsedData.sections);

        if (getScore) {
            executeCodeSyncWithMaxTime();
        } else {
            executeAsync();
        }
    };
    // ----------------------------------CONSOLE----------------------------------------------
    let consoleClasses = {
        "LINES_CONTAINER": "pseudoConsole-console-container",
        "CURSOR": "pseudoConsole-console-cursor",
        "ACTIVE_CURSOR": "pseudoConsole-console-cursor-active",
        "RIGHT_ELEMENT": "pseudoConsole-console-right-element",
        "LEFT_ELEMENT": "pseudoConsole-console-left-element",
        "TEXT_AREA": "pseudoConsole-console-textarea"
    };

    function UserConsole($element) {
        this.container = $("<pre></pre>");
        this.$textArea = $("<textarea class='pseudoConsole-console-textarea'></textarea>");
        this.linesContainer = $("<div class='" + consoleClasses.LINES_CONTAINER + "'></div>");
        this.$parentElement = $element;
        this.lines = [];
        this.activeLineIndex = -1;
        this.isReadMode = false;    //Console is waiting for user input
        this.isDisabled = false;

        $element.append(this.container);
        $element.append(this.$textArea);

        this.container.append(this.linesContainer);

        this.addNewLine(true);
    }

    UserConsole.prototype = {
        generateLine: function (className) {
            if (!className) {
                className = '';
            }

            let $htmlObject = $("<span></span>"),
                $left = $("<span class='" + className + " " + consoleClasses.LEFT_ELEMENT + "'></span>"),
                $right = $("<span class='" + className + " " + consoleClasses.RIGHT_ELEMENT + "'></span>"),
                $cursor = $("<span class='" + consoleClasses.CURSOR + "'></span>");

            $htmlObject.append($left);
            $htmlObject.append($cursor);
            $htmlObject.append($right);

            return {
                $htmlObject : $htmlObject,
                elements: {
                    $left: $left,
                    $cursor: $cursor,
                    $right: $right
                }
            };
        },

        /**
         * @param  {Boolean} isActive Activate this line automatically
         * @param  {String} [className] set class for that line
         */
        addNewLine: function (isActive, className) {
            if (!className) {
                className = '';
            }

            let line = this.generateLine(className);
            this.lines.push(line);
            this.linesContainer.append(line.$htmlObject);

            if (isActive) {
                this.selectLineAsActive(this.lines.length - 1);
            }

            this.$parentElement[0].scrollTop = this.$parentElement[0].scrollHeight;
        },

        selectLineAsActive: function (index) {
            let activeLine = null;
            if (this.activeLineIndex > -1) {
                activeLine = this.getActiveLine();
                activeLine.elements.$left.text(activeLine.elements.$left.text() + activeLine.elements.$right.text());
                activeLine.elements.$right.text('');
                activeLine.elements.$cursor.html('');
                activeLine.elements.$cursor.removeClass(consoleClasses.ACTIVE_CURSOR);
            }

            this.activeLineIndex = index;
            activeLine = this.lines[index];
            activeLine.elements.$cursor.html('&nbsp;');
            activeLine.elements.$cursor.addClass(consoleClasses.ACTIVE_CURSOR);
        },
        /**
         * @returns {{$htmlObject: jQuery, elements: {$left: jQuery, $right: jQuery, $cursor: jQuery}}}
         */
        getActiveLine: function () {
            return this.lines[this.activeLineIndex];
        },

        /**
         * @param  {String} text
         * @param  {String} className
         */
        Write: function (text, className) {
            if (this.isReadMode) {  //Dont write to console if is in read mode.
                return;
            }

            text = String(text);

            this.addNewLine(true, className);

            let lines = text.split('\n'),
                line,
                activeLine = this.getActiveLine(),
                i;

            for (i = 0; i < lines.length - 1; i += 1) {
                line = lines[i];
                activeLine.elements.$left.text(activeLine.elements.$left.text() + line);
                this.addNewLine(true, className);
                activeLine = this.getActiveLine();
                activeLine.elements.$left.text("\n");
            }

            activeLine = this.getActiveLine();
            line = lines[i];
            activeLine.elements.$left.text(activeLine.elements.$left.text() + line);
        },

        ReadLine: function (callback) {
            if (this.isReadMode) {
                return;
            }

            this.isReadMode = true;
            let self = this;

            this.readLineFunction(function (data) {
                self.isReadMode = false;
                callback(data);
            });
        },

        readLineFunction: function (onExitCallback) {
            if (!this.isReadMode) {
                return;
            }

            this.addNewLine(true);

            let textAreaElement = this.$textArea,
                parentElement = this.$parentElement,
                self = this;

            $(parentElement).on('click', function () {
                textAreaElement.off();
                textAreaElement.focus();

                textAreaElement.on('input', function () {
                    return self.onInputCallback();
                });

                textAreaElement.on('keydown', function (event) {
                    return self.onKeyDownCallback(event, onExitCallback);
                });
            });

            $(parentElement).click();
        },

        onInputCallback: function () {
            if (this.isDisabled) {
                return;
            }

            let textAreaElement = this.$textArea,
                activeLine = this.getActiveLine(),
                data = textAreaElement.val(),
                leftText = activeLine.elements.$left.text(),
                rightText = activeLine.elements.$right.text();

            if (data.length > 0) {
                if (data[data.length - 1] !== '\n') {
                    leftText = leftText + data;
                }
            }

            activeLine.elements.$left.text(leftText);
            activeLine.elements.$right.text(rightText);
            textAreaElement.val('');

            return false;
        },

        onKeyDownCallback: function (event, onExitCallback) {
            if (this.isDisabled) {
                return;
            }

            let textAreaElement = this.$textArea,
                activeLine = this.getActiveLine(),
                keycode = event.which || event.keycode,
                leftText = activeLine.elements.$left.text(),
                rightText = activeLine.elements.$right.text(),
                parentElement = this.$parentElement;

            if (keycode === 39 || keycode === 37 || keycode === 8 || keycode === 13) {
                if (keycode === 39) {    //Left arrow
                    if (rightText.length > 0) {
                        leftText += rightText[0];
                        rightText = rightText.substring(1);
                    }
                } else if (keycode === 37) {    //Right arrow
                    if (leftText.length > 0) {
                        rightText = leftText[leftText.length - 1] + rightText;
                        leftText = leftText.substring(0, leftText.length - 1);
                    }
                } else if (keycode === 8) {     //Backspace
                    leftText = leftText.substring(0, leftText.length - 1);
                } else if (keycode === 13) {
                    if ((leftText + rightText).length > 0) {
                        $(parentElement).off();
                        textAreaElement.off();
                        onExitCallback(leftText + rightText);
                    }
                }

                activeLine.elements.$left.text(leftText);
                activeLine.elements.$right.text(rightText);
                textAreaElement.val('');

                return false;
            }
        },

        ReadChar: function (callback) {
            if (this.isReadMode) {
                return;
            }

            this.isReadMode = true;

            this.addNewLine(true);

            let activeLine = this.getActiveLine(),
                textAreaElement = this.$textArea,
                parentElement = this.$parentElement,
                data,
                leftText,
                self = this;

            $(parentElement).on('click', function () {
                textAreaElement.off();
                textAreaElement.focus();

                textAreaElement.on('input', function () {
                    if (self.isDisabled) {
                        return;
                    }

                    leftText = activeLine.elements.$left.text();
                    data = textAreaElement.val();
                    if (data[data.length - 1] !== "\n") {
                        $(parentElement).off();
                        textAreaElement.off();
                        activeLine.elements.$left.text(leftText + data[data.length - 1]);   //Get only last char
                        self.isReadMode = false;
                        textAreaElement.val('');
                        callback(data[data.length - 1]);
                    }
                });
            });

            $(parentElement).click();
        },

        Reset: function () {
            let textAreaElement = this.$textArea,
                parentElement = this.$parentElement;

            parentElement.off();
            textAreaElement.off();

            this.isReadMode = false;

            this.linesContainer.find('span').remove();
            this.lines = [];

            this.activeLineIndex = -1;

            this.addNewLine(true);

            this.$textArea.val('');
        },

        destroy: function () {
            this.Reset();
        },

        disable: function () {
            this.isDisabled = true;
        },

        enable: function () {
            this.isDisabled = false;
        }
    };

    presenter.console = UserConsole;
    // ---------------------------------- VALIDATION SECTION ---------------------------------
    /**
     * Wrap each function or method defined by user by this code. It will set default values for function and initialize console for call
     * Functions pause and next will stop or resume machine which actually executes this code.
     * @param {String} userCode
     * @returns {string}
     */
    function wrapMethodOrFunctionWithBuiltInCode (userCode) {
        let code = "var builtIn = {\n";
        code += "   console: arguments[0].console,\n";
        code += "   data: arguments[0].data,";
        code += "   objects: arguments[1],\n";
        code += "   retVal: arguments[4]\n";
        code += "};";
        code += "builtIn.console.nextIns = arguments[2];\n";
        code += "builtIn.console.pauseIns = arguments[3];\n";
        code += "arguments = Array.prototype.slice.call(arguments, 5)\n";

        code += userCode;

        return code;
    }

    function generateValidationError(errorCode) {
        return {
            isValid: false,
            errorCode: errorCode
        };
    }

    presenter.validateFunction = function presenter_validateFunction (functionToValidate) {
        let validatedFunction;

        if (!/^[A-Za-z_][a-zA-Z0-9_]*$/g.exec(functionToValidate.name)) {
            return generateValidationError("FN01");
        }

        try {
            validatedFunction = new Function(wrapMethodOrFunctionWithBuiltInCode(functionToValidate.body));
        } catch (e) {
            return generateValidationError("JS02");
        }

        return {
            isValid: true,
            value: {
                name: functionToValidate.name,
                body: validatedFunction
            }
        };
    };

    presenter.validateFunctions = function presenter_validateFunctions (functions) {
        let validatedFunctions = {},
            i,
            validatedFunction;

        for (i = 0; i < functions.length; i += 1) {
            if (functions[i].name.trim().length === 0) {
                continue;
            }

            validatedFunction = presenter.validateFunction(functions[i]);
            if (!validatedFunction.isValid) {
                return validatedFunction;
            }

            if (validatedFunctions[validatedFunction.value.name]) {
                return generateValidationError("FN02");
            }

            validatedFunctions[validatedFunction.value.name] = validatedFunction.value.body;
        }

        return {
            isValid: true,
            value: validatedFunctions
        };
    };

    presenter.validateAliases = function presenter_validateAliases (aliases) {
        let definedAliases = {},
            aliasKey,
            aliasName,
            exists = {};

        for (aliasKey in aliases) {
            if (aliases.hasOwnProperty(aliasKey)) {
                if (aliases[aliasKey].name && !ModelValidationUtils.isStringEmpty(aliases[aliasKey].name.trim())) {
                    aliasName = aliases[aliasKey].name.trim();

                    if (!/^[A-Za-z_][a-zA-Z0-9_]*$/g.exec(aliasName)) {
                        return generateValidationError("AN01");
                    }

                    definedAliases[aliasKey] = aliases[aliasKey].name.trim();
                }
            }
        }

        for (aliasKey in definedAliases) {
            if (definedAliases.hasOwnProperty(aliasKey)) {
                if (exists[definedAliases[aliasKey]]) {
                    return generateValidationError("AN02");
                }

                exists[definedAliases[aliasKey]] = true;
            }
        }

        return {
            isValid: true,
            value: definedAliases
        };
    };

    presenter.validateParameters = function presenter_validateParameters (params) {
        let parameters = [],
            i;
        for (i = 0; i < params.length; i += 1) {
            parameters.push(params[i].value);
        }

        return {
            isValid: true,
            value: parameters
        };
    };

    presenter.validateAnswer = function presenter_validateAnswer (model) {
        let runUserCode = ModelValidationUtils.validateBoolean(model.runUserCode),
            answerCode = model.answerCode,
            maxTimeForAnswer = ModelValidationUtils.validateFloatInRange(model.maxTimeForAnswer, 10, 0),
            validatedParameters;

        if (runUserCode && (!maxTimeForAnswer.isValid || maxTimeForAnswer.parsedValue === 0)) {
            return generateValidationError("IP01");
        }

        validatedParameters = presenter.validateParameters(model.runParameters);

        return {
            isValid: true,
            runUserCode: runUserCode,
            answerCode: new Function(answerCode),
            maxTimeForAnswer: maxTimeForAnswer,
            parameters: validatedParameters.value
        };


    };

    presenter.validateUniquenessAliasesNamesAndFunctions = function presenter_validateUniquenessAliasesNamesAndFunctions (aliases, functions) {
        let aliasKey;

        for (aliasKey in aliases) {
            if (aliases.hasOwnProperty(aliasKey)) {
                if (functions[aliases[aliasKey]]) {
                    return generateValidationError("FN03");
                }
            }
        }

        return {
            isValid: true
        };
    };

    /**
     * @param {{objectName: (Array|Number|String), methodName: String, methodBody: String}} method
     */
    presenter.validateMethod = function presenter_validateMethod (method) {
        let validatedMethod = {};

        try {
            validatedMethod = {
                objectName: method.objectName,
                methodName: method.methodName,
                function: new Function (wrapMethodOrFunctionWithBuiltInCode(method.methodBody))
            }
        } catch (e) {
            return generateValidationError("JS01");
        }

        return {
            isValid: true,
            method: validatedMethod
        };
    };

    /**
     * @param {{objectName: (Array|Number|String), methodName: String, methodBody: String}[]} methods
     */
    presenter.validateMethods = function presenter_validateMethods (methods) {
        let validatedMethods = [];

        methods.forEach(function (method) {
            let validatedMethod = presenter.validateMethod(method);

            if (!validatedMethod.isValid) {
                return validatedMethod;
            }

            validatedMethods.push(validatedMethod.method);
        });

        return {
            isValid: true,
            methods: validatedMethods
        }
    };

    presenter.validateRound = function presenter_validateRound (model) {
        let round = model['mathRound'];

        if (round.trim() === '') {
            return {
                isValid: true,
                value: 100
            };
        }

        let parsedRound = parseInt(round, 10);

        if (isNaN(parsedRound)) {
            return {
                isValid: false,
                errorCode: "ER01"
            };
        }

        if (parsedRound < 1) {
            return {
                isValid: false,
                errorCode: "ER02"
            };
        }

        if (parsedRound > 100) {
            return {
                isValid: false,
                errorCode: "ER03"
            };
        }

        return {
            isValid: true,
            value: parsedRound
        };
    };

    presenter.validateModel = function presenter_validateModel (model) {
        let validatedAliases,
            validatedFunctions,
            validatedAnswer,
            isUniqueInAliasesAndFunctions,
            validatedMethods;

        validatedAliases = presenter.validateAliases(model.default_aliases);
        if (!validatedAliases.isValid) {
            return validatedAliases;
        }

        validatedFunctions = presenter.validateFunctions(model.functionsList);
        if (!validatedFunctions.isValid) {
            return validatedFunctions;
        }

        if (validatedAliases.isValid && validatedFunctions.isValid) {
            isUniqueInAliasesAndFunctions = presenter.validateUniquenessAliasesNamesAndFunctions(validatedAliases.value, validatedFunctions.value);
            if (!isUniqueInAliasesAndFunctions.isValid) {
                return isUniqueInAliasesAndFunctions;
            }
        }

        validatedAnswer = presenter.validateAnswer(model);
        if (!validatedAnswer.isValid) {
            return validatedAnswer;
        }

        validatedMethods = presenter.validateMethods(model.methodsList);
        if (!validatedMethods.isValid) {
            return validatedMethods;
        }

        let validatedRound = presenter.validateRound(model);
        if (!validatedRound.isValid) {
            return validatedRound;
        }

        return {
            isValid: true,
            addonID: model.ID,
            isActivity: !ModelValidationUtils.validateBoolean(model.isNotActivity),
            isVisibleByDefault: ModelValidationUtils.validateBoolean(model['Is Visible']),
            functions: validatedFunctions.value,
            aliases: $.extend(presenter.configuration.aliases, validatedAliases.value),
            answer: validatedAnswer,
            methods: validatedMethods.methods,
            round: validatedRound.value
        };
    };

    return presenter;
}

window.AddonPseudoCode_Console_create = AddonPseudoCode_Console_create;