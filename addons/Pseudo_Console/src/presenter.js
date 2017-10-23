function AddonPseudo_Console_create() {
    var presenter = function () {},
        JISON_GRAMMAR;

    // ----------------------- LANGUAGE COMPILER SECTION -----------------------------------

    JISON_GRAMMAR = {
        "lex": {
            "options" : {
                flex: true
            },

            "rules": [
                ["[\"]",                    "this.begin('string'); return 'START_STRING'"],
                [["string"], "[^\"\\\\]",   "return 'STRING';"],
                [["string"], "[\\n]",       "return 'NEWLINE_IN_STRING';"],
                [["string"], "\\\\.",       "return 'STRING'"],  // match \. <- escaped characters"
                [["string"], "$",           "return 'EOF_IN_STRING';"],
                [["string"], "[\"]",        "this.popState(); return 'END_STRING';"],
                ["$begin$",                 "return 'BEGIN_BLOCK';"],
                ["$end$",                   "return 'END_BLOCK';"],
                ["$program$",               "return 'PROGRAM';"],
                ["$variable$",              "return 'VARIABLE_DEF';"],
                ["$for$",                   "return 'FOR';"],
                ["$from$",                  "return 'FROM';"],
                ["$to$",                    "return 'TO';"],
                ["$do$",                    "return 'DO';"],
                ["$or$",                    "return 'OR';"],
                ["$and$",                   "return 'AND';"],
                ["$while$",                 "return 'WHILE';"],
                ["\\n+",                    "return 'NEW_LINE';"],
                ["$",                       "return 'EOF';"],
                ["[0-9]+(?:\\.[0-9]+)?\\b", "return 'NUMBER';"],
                ["<=",                      "return '<=';"],
                [">=",                      "return '>=';"],
                ["!=",                      "return '!=';"],
                ["==",                      "return '==';"],
                ["<",                       "return '<';"],
                [">",                       "return '>';"],
                ["\\*",                     "return '*';"],
                ["\\/",                     "return '/';"],
                ["-",                       "return '-';"],
                ["\\+",                     "return '+';"],
                ["%",                       "return '%';"],
                ["\\/_",                    "return '/_';"],
                ["\\(",                     "return '(';"],
                ["\\)",                     "return ')';"],
                ["[A-Za-z_][a-zA-Z0-9_]*",  "return 'STATIC_VALUE';"],
                [",",                       "return 'COMMA';"],
                ["=",                       "return '=';"],
                ["[ \f\r\t\v​\u00A0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u2028\u2029​\u202f\u205f​\u3000]",                   "/* IGNORE SPACES */"]
            ],

            "startConditions" : {
                string: 1,
                string_found: 2
            }
        },
        "operators": [                  //Be sure, you added operators here to avoid problems with conflicts
            ["left", "+", "-"],
            ["left", "*", "/", "/_", "%"],
            ["left", "(", ")"],
            ["left", "BRACKET"],
            ["left", "UMINUS"],
            ["left", "<=", ">=", "<", ">", "!=", "=="],
            ["left", "OR", "AND"],
        ],
        "bnf": {
            "expressions" : [
                [ "program_name section_list code_block",   "return {sections: $2, code: $3};($2 || '') + ($3 || '');"  ]
            ],

            "program_name" : [
                ["program_const STATIC_VALUE end_line", "yy.labelsStack = []; $$ = $2;"]
            ],

            "program_const" : [
                ["PROGRAM", "$$ = '';"]
            ],

            "section_list" : [
                "",
                ["section_list section", "$$ = ($1 || '') + $2;"]
            ],

            "section" : [
                ["var_section", "$$ = $1"]
            ],

            "var_section" : [
                ["variable_def_const var_list end_line", "$$ = $2;"]
            ],

            "variable_def_const" : [
                ["VARIABLE_DEF", "$$ = '';"]
            ],

            "var_list" : [
                ["var", "$$ = $1;"],
                ["var_list comma_separator var", "$$ = $1 + $3;"]
            ],

            "comma_separator" : [
                ["COMMA", "$$ = '';"]
            ],

            "var" : [
                ["STATIC_VALUE", "$$ = 'var ' + yytext + ' = {value: 0};';"]
            ],

            "code_block" : [
                ["begin_block instructions end_block", "$$ = $2 || [];"]
            ],

            "begin_block" : [
                ["BEGIN_BLOCK end_line", "$$ = '';"]
            ],

            "end_block": [
                ["END_BLOCK end_line", "$$ = '';"]
            ],

            "instructions" : [
                "",
                ["instruction_list", "$$ = $1;"]
            ],

            "instruction_list" : [
                ["instruction", "$$ = $1;"],
                ["instruction_list instruction", "$$ = $1.concat($2);"]
            ],

            "instruction" : [
                ['for_instruction', '$$ = $1;'],
                ['while_instruction', '$$ = $1;'],
                ["assign_value", "$$ = $1;"]
            ],

            "assign_value" : [
                ['STATIC_VALUE = operation end_line', "$$ = [yy.presenterContext.generateExecuteObject($1 + '.value =' + $3)];"],
            ],

            // "instruction_call" : [
            //     //["instruction_name ( arguments )", "$$ = [yy.presenterContext.generateExecuteObject(yy.presenterContext.dispatch($1, $2 || []))];"],
            //     ["STATIC_VALUE = instruction_name ( arguments )", "$$ = [yy.presenterContext.generateExecuteObject(yy.presenterContext.dispatch($3, $4 || []))];"],
            // ],

            "while_instruction" : [
                ["while_header end_line code_block", "var endBlock = yy.presenterContext.generateWhileExiter(yy); $$ = $1.concat($3).concat(endBlock);"]
            ],

            "while_header" : [
                ["WHILE operation DO", "console.log($2); $$ = $$ = yy.presenterContext.generateWhileHeader(yy, $2);"]
            ],

            "for_instruction" : [
                ["for_value_header end_line code_block", "$$ = $1.concat($3).concat(yy.presenterContext.generateForExiter(yy));"]
            ],

            "for_value_header" : [
                ["FOR STATIC_VALUE FROM NUMBER TO static_value_or_number DO", "$$ = yy.presenterContext.generateForHeader(yy, $2, $4, $6);"]
            ],

            "static_value_or_number" : [
                ["STATIC_VALUE", "$$ = yytext + '.value';"],
                ["NUMBER", "$$ = Number(yytext);"]
            ],

            "instruction_name" : [
                ["STATIC_VALUE", "yy.presenterContext.checkInstructionName($1); $$=$1;"]
            ],

            "arguments" : [
                "",
                ["arguments_list", "$$ = $1;"]
            ],

            "arguments_list" : [
                ["argument", "$$ = [$1];"],
                ["arguments_list COMMA argument", "$1.push($2); $$ = $1;"]
            ],

            "argument" : [
                ["operation", "$$ = $1;"],
                ["string_value", "$$ = '{value: \"' + $1 + '\"}';"]
            ],

            "string_value": [
                ["START_STRING string_chars END_STRING", "$$ = $2 || '';"]
            ],

            "string_chars" : [
                "",
                ["string_char", "$$ = $1"]
            ],

            "string_char" : [
                ["STRING", "$$ = $1;"],
                ["string_char STRING", "$$ = $1 + $2"]
            ],

            "end_line" : [      //TODO: Remove enters from end of input
                ["new_line_list", "$$='';"],
                ["EOF", "$$ = '';"]
            ],

            "new_line_list" : [
                ["NEW_LINE", "$$='';"],
                ["new_line_list NEW_LINE", "$$='';"]
            ],

            "operation" : [
                [ "STATIC_VALUE ( arguments )", "$$ = ''"],
                [ "operation + operation",   "$$ = $1 + '+' + $3;" ],
                [ "operation - operation",   "$$ = $1 + '-' + $3;" ],
                [ "operation * operation",   "$$ = $1 + '*' + $3;" ],
                [ "operation / operation",   "$$ = $1 + '/' + $3;" ],
                [ "operation /_ operation",  "$$ = '~~(' + $1 + '/' + $3 + ')';" ],
                [ "operation % operation",   "$$ = $1 + '%' + $3"],
                ["operation <= operation",   "$$ = $1 + '<=' + $3;"],
                ["operation >= operation",   "$$ = $1 + '>=' + $3;"],
                ["operation > operation",    "$$ = $1 + '>' + $3;"],
                ["operation < operation",    "$$ = $1 + '<' + $3;"],
                ["operation != operation",   "$$ = $1 + '!==' + $3;"],
                ["operation == operation",  "$$ = $1 + '===' + $3;"],
                ["operation OR operation",   "$$ = '(' + $1 + '||' + $3 + ')'"],
                ["operation AND operation",  "$$ = '(' + $1 + '&&' + $3 + ')'"],
                [ "( operation )",           "$$ = '(' + $2 + ')';"],
                [ "- operation",             "$$ = '-' + $2;", {"prec": "UMINUS"}],
                [ "NUMBER",                  "$$ = 'Number(' + yytext + ')';" ],
                [ "STATIC_VALUE",            "$$ = yytext + '.value'"],
            ]
        }
    };

    presenter.TYPES = {
        EXECUTE: 1,
        JUMP: 2
    };

    presenter.dispatch = function (functionName, args) {
        var parsedArgs = [],
            i;
        for (i = 0; i < args.length; i += 1) {
            parsedArgs.push(args[i]);
        }

        return "presenter.configuration.functions." + functionName + ".call(presenter.objectForInstructions, next, pause," + parsedArgs.join(",") + ");";
    };

    presenter.generateExecuteObject = function (code, label) {
        return {
            code: code,
            type: presenter.TYPES.EXECUTE,
            label: label
        };
    };

    presenter.generateJumpInstruction = function (code, toLabel) {
        return {
            code: code,
            toLabel: toLabel,
            type: presenter.TYPES.JUMP
        };
    };

    presenter.checkInstructionName = function (instructionName) {
        function InstructionNameException(instrName) {
            this.message = "Undefined instruction \"" + instrName + "\"";
            this.name = "InstructionNameException";
        }

        if (!presenter.configuration.functions[instructionName]) {
            throw new InstructionNameException(instructionName);
        }
    };

    presenter.generateForHeader = function (yy, variableName, from, to) {
        yy.labelsStack.push('for_' + yy.lexer.yylineno);
        yy.labelsStack.push('for_end_' + yy.lexer.yylineno);

        var execElements = [];

        execElements.push(presenter.generateExecuteObject(variableName + '.value = ' + from + ' - 1;'));
        execElements.push(presenter.generateExecuteObject('', 'for_' + yy.lexer.yylineno));
        execElements.push(presenter.generateJumpInstruction('!((Boolean(' + variableName + '.value += 1) || true) && ' + variableName + '.value <=' + to + ")", 'for_end_' + yy.lexer.yylineno));
        return execElements;
    };

    presenter.generateWhileHeader = function (yy, expression) {
        yy.labelsStack.push("while_" + yy.lexer.yylineno);
        yy.labelsStack.push("while_end_" + yy.lexer.yylineno);

        var execElements = [];

        execElements.push(presenter.generateExecuteObject('', "while_" + yy.lexer.yylineno));
        execElements.push(presenter.generateJumpInstruction('!Boolean(' + expression + ')', "while_end_" + yy.lexer.yylineno));

        return execElements;
    };

    presenter.generateWhileExiter = function (yy) {
        var exitLabel = yy.labelsStack.pop(),
            startWhileLabel = yy.labelsStack.pop(),
            execElements = [];

        execElements.push(presenter.generateJumpInstruction('true', startWhileLabel));
        execElements.push(presenter.generateExecuteObject('', exitLabel));

        return execElements;
    };

    presenter.generateForExiter = function (yy) {
        var execElements = [],
            exitLabel = yy.labelsStack.pop(),
            checkerLabel = yy.labelsStack.pop();

        execElements.push(presenter.generateJumpInstruction('true', checkerLabel));
        execElements.push(presenter.generateExecuteObject('', exitLabel));

        return execElements;
    };

    // ---------------------------------- ADDON SECTION ---------------------------------------------------------------

    //This object will be passed to instruction as scope
    presenter.objectForInstructions = {};

    //Object with calculated each built in instruction call e.g. for, while
    presenter.calledInstructions = {};

    presenter.state = {
        jqconsole: null,        //Console object
        functions: {},          //Functions defined by user
        codeGenerator: null,    //Generator code to execute from string.
        wasChanged: false,      //If code was changed and addon must recalculate score
        lastScore: 0,           //Last score, we dont need to recalculate score if user dont run code
        lastUsedCode: []        //Compiled code which was last used,
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
            "and": "and"
        }
    };

    presenter.ERROR_CODES = {
    };

    presenter.setPlayerController = function (controller) {
        presenter.state.playerController = controller;
        presenter.state.eventBus = presenter.state.playerController.getEventBus();
        presenter.state.eventBus.addEventListener('ShowAnswers', this);
        presenter.state.eventBus.addEventListener('HideAnswers', this);
    };

    presenter.run = function (view, model) {
        presenter.initialize(view, model, false);
    };

    presenter.createPreview = function (view, model) {
        presenter.initialize(view, model, true);
    };

    presenter.getWordBetweenDolars = function (word) {
        if (word.indexOf("$") > -1 && word.lastIndexOf("$") !== word.indexOf("$")) {
            return word.substring(1, word.length - 1);
        }
        return null;
    };

    presenter.initializeGrammar = function () {
        var rules = JISON_GRAMMAR.lex.rules,
            aliases = presenter.configuration.aliases,
            i,
            rule,
            word,
            parser;

        for (i = 0; i < rules.length; i += 1) {
            rule = rules[i][0];
            word = presenter.getWordBetweenDolars(rule);
            if (word !== null) {    //We want to find words between "$" and replace them with aliases
                if (aliases.hasOwnProperty(word)) {
                    rules[i][0] = aliases[word];
                }
            }
        }

        console.log(JISON_GRAMMAR);

        parser = new Jison.Parser(JISON_GRAMMAR);
        parser.yy.presenterContext = presenter;
        presenter.state.codeGenerator = parser;
    };

    /**
     * Before each user code call, this object should be initialized
     * @param  {Object} [consoleMock] optional argument for console
     */
    presenter.initializeObjectForCode = function (consoleMock) {
        presenter.objectForInstructions = {};
        presenter.objectForInstructions.console = consoleMock || presenter.state.jqconsole;
        presenter.objectForInstructions.console.Reset();
        presenter.calledInstructions = {};
    };

    presenter.initializeJQConsole = function () {
        var jqConsole = presenter.state.$view.jqconsole('', '>>>'),
            originalPropmpt = jqConsole.Prompt;

        jqConsole.Prompt = function (callback) {
            jqConsole.pauseIns();
            originalPropmpt.call(jqConsole, true, function (input) {
                callback.call(this, input);
                jqConsole.nextIns();
            });
        };

        presenter.state.jqconsole = jqConsole;
    };

    presenter.initialize = function (view, model, isPreview) {
        presenter.configuration = presenter.validateModel(model);

        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.state.$view = $(view);
        presenter.state.view = view;

        if (!isPreview) {
            presenter.initializeJQConsole();
            presenter.initializeObjectForCode();
            presenter.initializeGrammar();
        }

        presenter.setVisibility(presenter.configuration.isVisibleByDefault);

        view.addEventListener('DOMNodeRemoved', presenter.destroy);
    };

    presenter.connectHandlers = function () {
    };

    presenter.executeCommand = function (name, params) {
        if (presenter.isErrorCheckingMode) {
            return;
        }

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.destroy = function (event) {
        if (event.target !== this) {
            return;
        }
    };

    presenter.setVisibility = function (isVisible) {
        presenter.state.$view.css('visibility', isVisible ? 'visible' : 'hidden');
        presenter.state.$view.css('display', isVisible ? 'block' : 'none');

        presenter.state.isVisible = isVisible;
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.reset = function () {
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
    };

    presenter.setShowErrorsMode = function () {
    };

    presenter.setWorkMode = function () {
    };

    presenter.setState = function (stateString) {
        var state = JSON.parse(stateString);

        presenter.setVisibility(state.isVisible);
    };

    presenter.getState = function () {
        var state = {
            isVisible: presenter.state.isVisible
        };

        return JSON.stringify(state);
    };

    presenter.evaluateScoreFromLastOutput = function () {
        try {
            if (presenter.configuration.answer.answerCode.call(presenter.objectForInstructions)) {
                return 1;
            }
            return 0;
        } catch (e) {
            return 0;
        }
    };

    presenter.generateConsoleMock = function (input) {
        var actualInputIndex = 0;
        return {
            Reset: function () {

            },
            Prompt: function (callback) {
                var actualInput = input[actualInputIndex];
                if (actualInput !== null) {
                    callback.call(presenter.state.jqconsole, actualInput);
                    actualInputIndex += 1;
                }
            },
            Write: function () {

            }
        };
    };

    presenter.evaluateScoreFromUserCode = function () {
        var code = presenter.state.lastUsedCode,
            objectForInstructionsSaved = presenter.objectForInstructions,
            calledInstructionsSaved = presenter.calledInstructions,
            score = 0;

        presenter.initializeObjectForCode(presenter.generateConsoleMock(presenter.configuration.answer.parameters));

        presenter.codeExecutor(code, true);
        score = presenter.evaluateScoreFromLastOutput();

        presenter.calledInstructions = calledInstructionsSaved;
        presenter.objectForInstructions = objectForInstructionsSaved;

        return score;
    };

    presenter.evaluateScore = function () {
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

    function sendAllOKEvent() {
        presenter.state.isAllOkEvent = true;
        var eventData = {
            'source': presenter.configuration.addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };
        sendValueChangedEvent(eventData);
    }

    presenter.getScore = function () {
        if (!presenter.state.wasChanged) {
            return presenter.state.lastScore;
        }

        var score = 0;
        if (presenter.configuration.isActivity) {
            score = presenter.evaluateScore();

            presenter.state.lastScore = score;
            presenter.state.wasChanged = false;

            if (score === 1) {
                sendAllOKEvent();
            }
        }

        console.log("Return score", score);

        return score;
    };

    presenter.getMaxScore = function () {
        if (presenter.configuration.isActivity) {
            return 1;
        }

        return 0;
    };

    presenter.getErrorCount = function () {
        if (presenter.configuration.isActivity) {
            return 0;
        }

        return 0;
    };

    presenter.executeCommand = function (name, params) {
        if (presenter.isErrorCheckingMode) {
            return;
        }

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.executeCode = function (code) {
        presenter.state.wasChanged = true;
        presenter.initializeObjectForCode();
        try {
            var executableCode = presenter.state.codeGenerator.parse(code);
            presenter.state.lastUsedCode = executableCode;
            presenter.codeExecutor(executableCode, false);
        } catch (e) {
            if (e.name) {
                presenter.state.jqconsole.Write(e.message + "\n", 'program-error-output');
            } else {
                presenter.state.jqconsole.Write("Unexpected identifier\n", 'program-error-output');
            }
        }
    };

    /**
     * @param  {Object} parsedData parsed code by jison
     * @param  {Boolean} getScore if function will be called to get score
     */
    presenter.codeExecutor = function (parsedData, getScore) {
        var actualIndex = 0,
            code = parsedData.code,
            timeoutId = 0,
            isEnded = true,
            startTime = new Date().getTime() / 1000;

        console.log(parsedData);

        function getIndexByLabel(label) {
            var i;
            for (i = 0; i < code.length; i += 1) {
                if (code[i].label === label) {
                    return i;
                }
            }
        }

        /**
         *  Execute each line of code generated by JISON
         * @returns {Boolean} true - if code was executed, false if program is ended
         */
        function executeLine() {
            var actualEntry = code[actualIndex];
            if (actualEntry) {
                if (actualEntry.type === presenter.TYPES.EXECUTE) {
                    eval(actualEntry.code);
                    actualIndex += 1;
                } else if (actualEntry.type === presenter.TYPES.JUMP) {
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
            timeoutId = setTimeout(executeAsync, 1);
        }

        function executeAsync() {
            next();
            try {
                executeLine();
            } catch (e) {
                presenter.state.jqconsole.Write(e + "\n", 'program-error-output');
                pause();
            }
        }

        function executeCodeSyncWithMaxTime() {
            var actualTime;

            while (true) {
                actualTime = new Date().getTime() / 1000;
                if (actualTime - startTime > presenter.configuration.answer.maxTimeForAnswer.parsedValue) { 
                    return;
                }

                isEnded = executeLine();
                if (isEnded) {
                    return;
                }
            }
        }

        eval(parsedData.sections);

        if (getScore) {
            executeCodeSyncWithMaxTime();
        } else {
            executeAsync();
        }
    };

    // ---------------------------------- VALIDATION SECTION ---------------------------------

    presenter.validateFunction = function (functionToValidate) {
        return {
            isValid: true,
            value: {
                name: functionToValidate.name,
                body: new Function("this.console.pauseIns = arguments[1], this.console.nextIns = arguments[0]; arguments = Array.prototype.slice.call(arguments, 2);" + functionToValidate.body)
            }
        };
    };

    presenter.validateFunctions = function (functions) {
        var validatedFunctions = {},
            i,
            validatedFunction;

        for (i = 0; i < functions.length; i += 1) {
            validatedFunction = presenter.validateFunction(functions[i]);
            if (!validatedFunction.isValid) {
                return validatedFunction;
            }

            validatedFunctions[validatedFunction.value.name] = validatedFunction.value.body;
        }

        return {
            isValid: true,
            value: validatedFunctions
        };
    };

    presenter.validateAliases = function (aliases) {
        var definedAliases = {},
            aliasKey;

        for (aliasKey in aliases) {
            if (aliases.hasOwnProperty(aliasKey)) {
                if (!ModelValidationUtils.isStringEmpty(aliases[aliasKey].name.trim())) {
                    definedAliases[aliasKey] = aliases[aliasKey].name.trim();
                }
            }
        }

        return {
            isValid: true,
            value: definedAliases
        };
    };

    presenter.validateParameters = function (params) {
        var parameters = [],
            i;
        for (i = 0; i < params.length; i += 1) {
            parameters.push(params[i].value);
        }

        return {
            isValid: true,
            value: parameters
        };
    };

    function generateValidationError(errorCode) {
        return {
            isValid: false,
            errorCode: errorCode
        };
    }

    presenter.validateAnswer = function (model) {
        var runUserCode = ModelValidationUtils.validateBoolean(model.runUserCode),
            answerCode = model.answerCode,
            maxTimeForAnswer = ModelValidationUtils.validateFloatInRange(model.maxTimeForAnswer, 10, 0),
            validatedParameters;

        if (runUserCode && (!maxTimeForAnswer.isValid || maxTimeForAnswer === 0)) {
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

    presenter.validateModel = function (model) {
        var validatedAliases,
            validatedFunctions,
            validatedAnswer;

        validatedAliases = presenter.validateAliases(model.default_aliases);
        if (!validatedAliases.isValid) {
            return validatedAliases;
        }

        validatedFunctions = presenter.validateFunctions(model.functionsList);
        if (!validatedFunctions.isValid) {
            return validatedFunctions;
        }

        validatedAnswer = presenter.validateAnswer(model);
        if (!validatedAnswer.isValid) {
            return validatedAnswer;
        }

        return {
            isValid: true,
            addonID: model.ID,
            isActivity: !ModelValidationUtils.validateBoolean(model.isNotActivity),
            isVisibleByDefault: ModelValidationUtils.validateBoolean(model['Is Visible']),
            functions: validatedFunctions.value,
            aliases: $.extend(presenter.configuration.aliases, validatedAliases.value),
            answer: validatedAnswer
        };
    };

    return presenter;
}