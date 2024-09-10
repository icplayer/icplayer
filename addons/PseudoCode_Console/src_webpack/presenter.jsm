import { getLanguageParser } from './language-definition.jsm';
import { getDefinedObjects } from './defined-objects.jsm';
import { EXCEPTIONS } from './defined-exceptions.jsm';
import { CODE_GENERATORS } from './language-code-generators.jsm';
import { UserConsole } from './console.jsm';
import { codeExecutor } from './machine.jsm';
import {
    validateAliases, validateAnswer, validateFunction, validateFunctions, validateMethod,
    validateModel
} from './validation.jsm';
import { isLetter, isDigit } from './utils.jsm';

/**
 * Teoria:
 * http://wazniak.mimuw.edu.pl/index.php?title=Podstawy_kompilator%C3%B3w
 * Check comments if you want to add OOP to language.
 */
function AddonPseudoCode_Console_create() {
    let presenter = function () {};

    /**
     * Each object in pseudocode console must be created by this mock.
     */
    presenter.objectMocks = {};
    presenter.bnf = CODE_GENERATORS;
    presenter.exceptions = null;
    presenter.console = UserConsole;
    presenter.codeExecutor = codeExecutor;
    presenter.validateModel = validateModel;
    presenter.validateFunction = validateFunction;
    presenter.validateAnswer = validateAnswer;
    presenter.validateFunctions = validateFunctions;
    presenter.validateAliases = validateAliases;
    presenter.validateMethod = validateMethod;

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
        variablesAndFunctionsUsage : {}, //Functions and variables used by user each element contains: {defined: [], args: [], vars: [], fn: []},
        addonWrapper: null,
        _disabled: false,
        _wasExecuted: false
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
        methods: [],
        round: 20,
        availableConsoleInput: "All",
        exceptionTranslations: {}
    };

    presenter.ERROR_CODES = {
        "FN01": "Defined function name must match to ^[A-Za-z_][a-zA-Z0-9_]*$",
        "FN02": "Defined function must have unique name",
        "FN03": "Defined function overrides built in alias",
        "AN01": "Defined alias name must match to ^[A-Za-z_][a-zA-Z0-9_]*$",
        "AN02": "Multiple aliases got the same name",
        "JS01": "Java Script code in mdefined ethod is not valid.",
        "JS02": "Java Script code in defined function is not valid",
        "ER01": "Math precision value must be an integer",
        "ER02": "Math precision value must be bigger than 0",
        "ER03": "Math precision value cannot be greater than 20",
        "IP01": "Max time for answer must be float number in range 0 to 10 excluding 0",
        "IP02": "Answer code must be valid JS code"
    };

    presenter.availableInputsInConsole = {
        "All": function () { return true; },
        "Natural numbers": function (value, wholeValue) { return isDigit(value); },
        "Letters only": function (value, wholeValue) { return isLetter(value);},
        "Real numbers": function (value, wholeValue) { return /^-?[0-9]*\.?[0-9]*$/g.test(wholeValue) }
    };

    presenter.CLASS_LIST = {
        "correct": "pseudo-code-console-correct",
        "wrong": "pseudo-code-console-wrong"
    };

    presenter.originalDisplay = 'block';

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

    presenter.getInputChecker = function () {
        return presenter.availableInputsInConsole[presenter.configuration.availableConsoleInput];
    };

    presenter.initializeConsole = function presenter_initializeConsole () {
        presenter.state.console = new presenter.console(presenter.state.$view.find(".addon-PseudoCode_Console-wrapper"), {
            inputChecker: presenter.getInputChecker()
        });

        let originalReadLine = presenter.state.console.ReadLine,
            originalReadChar = presenter.state.console.ReadChar;

        /**
         * Because console is asynchronous but pseudocode console is synchronous we must wrap user callback in console.
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
        presenter.objectMocks = getDefinedObjects({
            round: presenter.configuration.round,
            exceptions: presenter.exceptions
        });

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
        presenter.configuration = presenter.validateModel(model, presenter.configuration.aliases);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }
        presenter.state.$view = $(view);
        presenter.state.view = view;

        var display = presenter.state.$view.css('display');
        if (display != null && display.length > 0) {
            presenter.originalDisplay = display;
        }

        presenter.state.addonWrapper = presenter.state.$view.find(".addon-PseudoCode_Console-wrapper");
        if (!isPreview) {
            presenter.initializeExceptions();
            presenter.initializeConsole();
            presenter.initializeObjectForCode();
            presenter.initializeGrammar();
            presenter.completeObjectsMethods();
            MutationObserverService.createDestroyObserver(presenter.configuration.addonID, presenter.destroy, presenter.state.view);
            MutationObserverService.setObserver();
        }
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
    };

    presenter.initializeExceptions = function () {
        presenter.exceptions = new EXCEPTIONS(presenter.configuration.exceptionTranslations);
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
        presenter.setWorkMode();
        presenter.state._disabled = true;
        presenter.state.console.disable();
    };

    presenter.hideAnswers = function presenter_hideAnswers () {
        presenter.state._disabled = false;
        presenter.state.console.enable();
    };

    presenter.destroy = function presenter_destroy (event) {
        if (event.target !== presenter.state.view) {
            return;
        }

        if (presenter.state.console) {
            presenter.state.console.destroy();
        }
    };

    presenter.setVisibility = function presenter_setVisibility (isVisible) {
        presenter.state.$view.css('visibility', isVisible ? 'visible' : 'hidden');
        presenter.state.$view.css('display', isVisible ? presenter.originalDisplay : 'none');

        presenter.state.isVisible = isVisible;
    };

    presenter.show = function presenter_show () {
        presenter.setVisibility(true);
    };

    presenter.hide = function presenter_hide () {
        presenter.setVisibility(false);
    };

    presenter.reset = function presenter_reset () {
        presenter.state._wasExecuted = false;
        presenter.setWorkMode();
        presenter.hideAnswers();
        presenter.killAllMachines();
        presenter.state.console.Reset();
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        presenter.state.console.enable();
        presenter.state.lastUsedCode = [];
        presenter.state.wasChanged = true;
    };

    presenter.setShowErrorsMode = function presenter_setShowErrorsMode () {
        presenter.hideAnswers();
        presenter.state._disabled = true;

        if (!presenter.state._wasExecuted) {
            return;
        }

        if (presenter.configuration.isActivity) {
            if (presenter.getScore() === 1) {
                presenter.state.addonWrapper[0].classList.add(presenter.CLASS_LIST.correct);
            } else {
                presenter.state.addonWrapper[0].classList.add(presenter.CLASS_LIST.wrong);
            }
        }
        presenter.state.console.disable();
    };

    presenter.setWorkMode = function presenter_setWorkMode () {
        presenter.state._disabled = false;

        presenter.state.addonWrapper[0].classList.remove(presenter.CLASS_LIST.correct);
        presenter.state.addonWrapper[0].classList.remove(presenter.CLASS_LIST.wrong);
        presenter.state.console.enable();
    };

    presenter.setState = function presenter_setState (stateString) {
        let state = JSON.parse(stateString);

        presenter.setVisibility(state.isVisible);
        presenter.state.lastScore = state.score;
        presenter.state._wasExecuted = state._wasExecuted;
    };

    presenter.getState = function presenter_getState () {
        let state = {
            isVisible: presenter.state.isVisible,
            score: presenter.state.lastScore,
            _wasExecuted: presenter.state._wasExecuted      //Added later and can be false
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
        presenter.codeExecutor(code, true, presenter);
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
                throw presenter.exceptions.InstructionIsDefinedException(userFunctionName);
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
                throw presenter.exceptions.UndefinedVariableNameException(usedVariableName, functionName);
            }
        }

        for (i = 0; i < functionData.fn.length; i += 1) {
            usedFunctionName = functionData.fn[i];
            if (!excludedNames[usedFunctionName] && $.inArray(usedFunctionName, presenter.state.definedByUserFunctions) === -1) {
                throw presenter.exceptions.UndefinedFunctionNameException(usedFunctionName, functionName);
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

        if (presenter.state._disabled) {
            return;
        }

        presenter.state.variablesAndFunctionsUsage = {};
        presenter.state.wasChanged = true;
        presenter.state._wasExecuted = true;
        presenter.state.lastUsedCode = [];
        presenter.initializeObjectForCode();
        try {
            presenter.state.console.Reset();
            let executableCode = presenter.state.codeGenerator.parse(code);
            presenter.checkCode();

            presenter.state.lastUsedCode = executableCode;
            presenter.stop();

            presenter.codeExecutor(executableCode, false, presenter);
        } catch (e) {
            if (e.name !== "Error") {
                presenter.state.console.Write(e.message + "\n", 'program-error-output');
            } else {
                presenter.state.console.Write(presenter.configuration.exceptionTranslations.UnexpectedIdentifier || "Unexpected identifier\n", 'program-error-output');
            }
        }
    };

    return presenter;
}

window.AddonPseudoCode_Console_create = AddonPseudoCode_Console_create;