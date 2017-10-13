function AddonPseudo_Console_create() {
    var presenter = function (){};

    var JISON_GRAMMAR = {
        "lex": {
            "rules": [
               ["[\"]",                    "this.begin('string'); return 'START_STRING'"],
               [["string"],"[^\"\\\\]",    "return 'STRING';"],
               [["string"],"[\\n]",        "return 'NEWLINE_IN_STRING';"],
               [["string"],"\\\\.",        "return 'STRING'"],  // march \. <- escaped characters"
               [["string"],"$",            "return 'EOF_IN_STRING';"],
               [["string"],"[\"]",         "this.popState(); return 'END_STRING';"],
               ["pocz\u0105tek",                "return 'BEGIN_BLOCK';"],
               ["koniec",                  "return 'END_BLOCK';"], 
               ["program",                 "return 'PROGRAM';"],
               ["zmienna",                 "return 'VARIABLE_DEF';"],
               ["dla",                     "return 'FOR';"],
               ["od",                      "return 'FROM';"],
               ["do",                      "return 'TO';"],
               ["wykonuj",                 "return 'DO';"],
               ["\\n+",                    "return 'NEW_LINE';"],
               ["$",                       "return 'EOF';"],
               ["[0-9]+(?:\\.[0-9]+)?\\b", "return 'NUMBER';"],
               ["\\*",                     "return '*';"],
               ["\\/",                     "return '/';"],
               ["-",                       "return '-';"],
               ["\\+",                     "return '+';"],
               ["\\^",                     "return '^';"],
               ["\\(",                     "return '(';"],
               ["\\)",                     "return ')';"],
               ["[A-Za-z_][a-zA-Z0-9_]*",  "return 'STATIC_VALUE';"],
               [",",                       "return 'COMMA';"],
               ["=",                       "return '=';"],
               ["[ \f\r\t\v​\u00A0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​\u2028\u2029​\u202f\u205f​\u3000]",                   "/* IGNORE SPACES */"],
               
            ],

            "startConditions" : {
                string: 1,
                string_found: 2
            }
        },
    
        "operators": [
            ["left", "+", "-"],
            ["left", "*", "/"],
            ["left", "^"],
            ["left", "UMINUS"]
        ],
    
        "bnf": {
            "expressions" :[
                [ "program_name section_list code_block",   "return {sections: $2, code: $3};($2 || '') + ($3 || '');"  ]
            ],

            "program_name" : [
                ["program_const STATIC_VALUE end_line", "yy.actualExecutionIndex = 0; yy.labelsStack = []; $$ = $2;"]
            ],

            "program_const" : [
                ["PROGRAM", "$$ = '';"],
            ],

            "section_list" : [
                "",
                ["section_list section", "$$ = ($1 || '') + $2;"]
            ],

            "section" : [
                ["var_section", "$$ = $1"]
            ],

            "var_section" : [
                ["variable_def_const var_list end_line", "$$ = $2;"],
            ],

            "variable_def_const" : [
                ["VARIABLE_DEF", "$$ = '';"],
            ],

            "var_list" : [
                ["var", "$$ = $1;"],
                ["var_list comma_separator var", "$$ = $1 + $3;"]
            ],

            "comma_separator" : [
                ["COMMA", "$$ = '';"],
            ],

            "var" : [
                ["STATIC_VALUE", "$$ = 'var ' + yytext + ' = {value: 0};';"]
            ],

            "code_block" : [
                ["begin_block instructions end_block", "$$ = $2;"],
            ],

            "begin_block" : [
                ["BEGIN_BLOCK end_line", "$$ = '';"],
            ],

            "end_block": [
                ["END_BLOCK end_line", "$$ = '';"],
            ],

            "instructions" : [
                "",
                ["instruction_list", "$$ = $1;"]
            ],

            "instruction_list" : [
                ["instruction", "yy.actualExecutionIndex++; $$ = $1;"],
                ["instruction_list instruction", "yy.actualExecutionIndex++; $$ = $1.concat($2);"]
            ],

            "instruction" : [
                ['for_instruction', '$$ = $1;'],
                ["instruction_name arguments end_line" , "$$ = [yy.presenterContext.generateExecuteObject(yy.presenterContext.dispatch($1, $2 || []))];"],
                ["assign_value", ""]
            ],

            "assign_value" : [
                ['STATIC_VALUE = operation end_line', "$$ = [yy.presenterContext.generateExecuteObject($1 + '.value =' + $3)];"]
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
                ["STATIC_VALUE", "$$=$1;"],
            ],

            "arguments" : [
                "",
                ["arguments_list", "$$ = $1;"]
            ],

            "arguments_list" : [
                ["argument", "$$ = [$1];"],
                ["arguments_list argument", "$1.push($2); $$ = $1;"]
            ],

            "argument" : [
                ["STATIC_VALUE", "$$ = yytext;"],
                ["string_value", "$$ = '{value: \"' + $1 + '\"}';"],
                ["NUMBER", "$$= '{value: ' + Number(yytext) + '}';"]
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

            "end_line" : [
                ["new_line_list", "$$='';"],
                ["EOF", "$$ = '';"]
            ],

            "new_line_list" : [
                ["NEW_LINE", "$$='';"],
                ["new_line_list NEW_LINE", "$$='';"]
            ],
    
            "operation" :[
                [ "operation + operation",   "$$ = $1 + '+' + $3;" ],
                [ "operation - operation",   "$$ = $1 + '-' + $3;" ],
                [ "operation * operation",   "$$ = $1 + '*' + $3;" ],
                [ "operation / operation",   "$$ = $1 + '/' + $3;" ],
                [ "- operation",             "$$ = '-' + $2;", {"prec": "UMINUS"} ],
                [ "( operation )",           "$$ = '(' + $2 + ')';" ],
                [ "NUMBER",                  "$$ = 'Number(' + yytext + ')';" ],
                [ "STATIC_VALUE",            "$$ = yytext + '.value'"]
            ]
        }
    }

    presenter.TYPES = {
        EXECUTE: 1,
        JUMP: 2        
    }

    presenter.dispatch = function (functionName, args) {
        var parsedArgs = [];
        for (var i = 0; i < args.length; i++) {
            parsedArgs.push(args[i]);
        }

        return "presenter.state.functions." + functionName + ".call(null, next, pause," + parsedArgs.join(",") + ");";
    }

    presenter.generateExecuteObject = function (code, label) {
        return {
            code: code,
            type: presenter.TYPES.EXECUTE,
            label: label
        };
    }

    presenter.generateJumpInstruction = function (code, toLabel) {
        return {
            code: code,
            toLabel: toLabel,
            type: presenter.TYPES.JUMP
        };
    }


    presenter.generateForHeader = function (yy, variableName, from, to) {
        yy.labelsStack.push('for_' + yy.actualExecutionIndex); 
        yy.labelsStack.push('for_end_' + yy.actualExecutionIndex);

        var execElements = [];

        execElements.push(presenter.generateExecuteObject(variableName + '.value = ' + from + ' - 1;'));
        execElements.push(presenter.generateExecuteObject('', 'for_' + yy.actualExecutionIndex));
        execElements.push(presenter.generateJumpInstruction('!((Boolean(' + variableName + '.value += 1) || true) && ' + variableName + '.value <=' + to + ")", 'for_end_' + yy.actualExecutionIndex));
        return execElements;
    }

    presenter.generateForExiter = function (yy) {
        var execElements = [];

        var exitLabel = yy.labelsStack.pop();
        var checkerLabel = yy.labelsStack.pop();

        execElements.push(presenter.generateJumpInstruction('true', checkerLabel));
        execElements.push(presenter.generateExecuteObject('', exitLabel));

        return execElements;
    }

    presenter.state = {
        jqconsole: null,
        functions: {
            "pisz" : function (next, pause) {
                var values = [];
                for (var i = 0; i < arguments.length; i++) {
                    if (i > 1) {
                        values.push(arguments[i].value);
                    }
                }
                presenter.state.jqconsole.Write(values.join("\t"));
                presenter.state.jqconsole.Write("\n");
            },

            "czytaj" : function (next, pause, value) {
                pause();
                presenter.state.jqconsole.Prompt(true, function (input) {
                    if (/^\d+(.\d+)?$/.test(input)) {
                        value.value = Number(input);
                    } else {
                        value.value = input;
                    }
                    next();
                })
            }
        },
        codeGenerator: null
    };

    presenter.configuration = {
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

    presenter.initialize = function  (view, model, isPreview)  {
        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.state.$view = $(view);
        presenter.state.view = view;

        if (!isPreview) {
            presenter.state.jqconsole = $(presenter.state.$view).jqconsole('Hi\n', '>>>');
            var parser = new Jison.Parser(JISON_GRAMMAR);
            parser.yy.presenterContext = presenter;
            presenter.state.codeGenerator = parser;
        }

        presenter.setVisibility(presenter.configuration.isVisibleByDefault);

        view.addEventListener('DOMNodeRemoved', presenter.destroy);
    };

    presenter.terminalCommandsDipatcher = function () {
        return {
            echo: function(arg1) {
                this.echo(arg1);
            }
        };
    }

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

    presenter.destroy = function () {
        if (event.target !== this) {
            return;
        }
    };

    presenter.validateModel = function (model) {
        return {
            isValid: true,
            addonID: model['ID'],
            isVisibleByDefault: ModelValidationUtils.validateBoolean(model['Is Visible'])
        };
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

    presenter.setShowErrorsMode = function() {
    };

    presenter.setWorkMode = function () {
    };

    presenter.setState = function (stateString) {
        var state = JSON.parse(stateString);

        presenter.setVisibility(state.isVisible);
    };

    presenter.getActualLevel = function () {
        return presenter.state.levels[presenter.state.actualLevel];
    };

    presenter.getState = function () {
        var state = {
            isVisible: presenter.state.isVisible
        };

        return JSON.stringify(state);
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
        if (presenter.isErrorCheckingMode) {
            return;
        }

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.executeCode = function  (code) {
        var executableCode = presenter.state.codeGenerator.parse(code);

        presenter.codeExecutor(executableCode);
    }

    function generateValidationError(errorCode) {
        return {
            isValid: false,
            errorCode: errorCode
        };
    }

    presenter.codeExecutor = function (parsedData) {
        var actualIndex = 0;
        var code = parsedData.code;
        var timeoutId = 0;
        eval(parsedData.sections);

        execute();

        function execute () {
            next();
            var actualEntry = code[actualIndex];
            if (actualEntry) {
                console.log(actualIndex);
                if (actualEntry.type == presenter.TYPES.EXECUTE) {
                    eval(actualEntry.code);
                    actualIndex++;
                } else if (actualEntry.type == presenter.TYPES.JUMP) {
                    if (eval(actualEntry.code)) {
                        actualIndex = getIndexByLabel(actualEntry.toLabel)
                    } else {
                        actualIndex++;
                    }
                }
            }
        }

        function pause() {
            clearTimeout(timeoutId);
        }

        function next() {
            timeoutId = setTimeout(execute, 1);
        }

        function getIndexByLabel(label) {
            for (var i = 0; i < code.length; i++) {
                if (code[i].label == label) {
                    return i;
                }
            }
        }
    }

    return presenter;
}