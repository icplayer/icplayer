function AddonPseudo_Console_create() {
    var presenter = function () {},
        JISON_GRAMMAR;

    // ----------------------- LANGUAGE COMPILER SECTION -----------------------------------
    // TODO:
    // Check if function can have that name: built in functions and functions defined in properties
    // Check if variable can be used(or not?)

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
                ["$if$",                    "return 'IF';"],
                ["$then$",                  "return 'THEN';"],
                ["$else$",                  "return 'ELSE';"],
                ["$case$",                  "return 'CASE';"],      //TODO
                ["$option$",                "return 'OPTION';"],    //TODO
                ["$function$",              "return 'FUNCTION';"],
                ["$return$",                "return 'RETURN';"],
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
            ["right", "IF", "ELSE", "THEN"],
            ["right", "CASE", "OPTION"]
        ],
        "bnf": {
            "expressions" : [
                [ "functions program_name section_list code_block",   "return {sections: $3, code: $4.concat(undefined).concat($1)};($2 || '') + ($3 || '');"  ]
            ],

            "functions" : [
                "",
                ["functions_list", "$$ = $1;"]
            ],

            "functions_list" : [
                ["function", "$$ = $1;"],
                ["functions_list function", "$$ = $1.concat($2);"]
            ],

            "function" : [
                ["function_declaration ( function_arguments ) end_line section_list code_block", "$$ = yy.presenterContext.bnf['function'](yy, $1, $3, $6, $7);"]
            ],

            "function_declaration" : [
                ["FUNCTION STATIC_VALUE", "$$ = yy.presenterContext.bnf['function_declaration'](yy, $2);"]
            ],

            "function_arguments" : [
                "",
                ["function_arguments_list", "$$ = $1;"]
            ],

            "function_arguments_list" : [
                ["STATIC_VALUE", "$$ = [$1];"],
                ["function_arguments_list STATIC_VALUE", "$$ = $1.push($2);"]
            ],

            "program_name" : [
                ["program_const STATIC_VALUE end_line", "$$ = yy.presenterContext.bnf['program_name'](yy, $2); "]
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
                ["STATIC_VALUE", "$$ = yy.presenterContext.bnf['var'](yy, yytext);"]
            ],

            "code_block" : [
                ["begin_block instructions end_block", "$$ = $2 || [];"]
            ],

            "code_block_or_instruction" : [
                ["code_block", "$$ = $1 || [];"],
                ["instruction", "$$ = $1 || [];"]
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
                ['do_while_instruction', '$$ = $1;'],
                ["assign_value", "$$ = $1;"],
                ["if_instruction", "$$ = $1"],
                ["case_instruction", "$$ = $1;"],
                ["RETURN operation end_line", "$$ = yy.presenterContext.bnf['return_value'](yy, $2);"]
            ],

            "case_instruction" : [
                ["CASE variable_get end_line case_options", "$$ = yy.presenterContext.bnf['case']($2, $4);"]
            ],

            "case_options" : [
                ["case_option", "$$ = $1;"],
                ["case_options case_option", "$$ = $1.concat($2);;"]
            ],

            "case_option": [
                ["OPTION number_or_string THEN end_line code_block_or_instruction", "$$ = yy.presenterContext.bnf['case_option']($2, $5);"]
            ],

            "number_or_string" : [
                ["number_value", "$$ = $1;"],
                ["string_value", "$$ = $1;"]
            ],

            "if_instruction" : [
                ["IF operation THEN end_line code_block_or_instruction", "$$ = yy.presenterContext.bnf['if_instruction'](yy, $2, $5);"],
                ["IF operation THEN end_line code_block_or_instruction ELSE end_line code_block_or_instruction",  "$$ = yy.presenterContext.bnf['if_else_instruction'](yy, $2, $5, $8);"]
            ],

            "assign_value" : [
                ['STATIC_VALUE = operation end_line', "$$ = yy.presenterContext.bnf['assign_value_1'](yy, $1, $3);"],
                ['operation end_line', "$$ = yy.presenterContext.bnf['assign_value_2'](yy, $1);"]
            ],

            "do_while_instruction" : [
                ["do_while_header end_line code_block_or_instruction do_while_checker", "$$ = $1.concat($3).concat($4);"]
            ],

            "do_while_header" : [
                ["DO", "$$ = yy.presenterContext.bnf['do_while_header'](yy);"]
            ],

            "do_while_checker" : [
                ["WHILE operation end_line", "$$ = yy.presenterContext.bnf['do_while_exiter'](yy, $2);"]
            ],

            "while_instruction" : [
                ["while_header end_line code_block_or_instruction", "var endBlock = yy.presenterContext.bnf['while_exiter'](yy); $$ = $1.concat($3).concat(endBlock);"]
            ],

            "while_header" : [
                ["WHILE operation DO", "$$ = $$ = yy.presenterContext.bnf['while_header'](yy, $2);"]
            ],

            "for_instruction" : [
                ["for_value_header end_line code_block_or_instruction", "$$ = $1.concat($3).concat(yy.presenterContext.bnf['for_exiter'](yy));"],
            ],

            "for_value_header" : [
                ["FOR STATIC_VALUE FROM NUMBER TO static_value_or_number DO", "$$ = yy.presenterContext.bnf['for_value_header'](yy, $2, $4, $6);"]
            ],

            "static_value_or_number" : [
                ["STATIC_VALUE", "$$ = yy.presenterContext.bnf['for_argument'](yy, yytext);"],
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
                ["arguments_list COMMA argument", "$1.push($3); $$ = $1;"]
            ],

            "argument" : [
                ["operation", "$$ = $1;"]
            ],

            "string_value": [
                ["START_STRING string_chars END_STRING", "$$ = [yy.presenterContext.generateExecuteObject('stack.push({value: \"' + ($2 || '') + '\"})')];"]
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
                [ "STATIC_VALUE ( arguments )", "$$ = yy.presenterContext.bnf['function_call'](yy, $1, $3);"],
                [ "operation + operation",      "$$ = yy.presenterContext.genrateOperationCode($1, $3, '+');" ],
                [ "operation - operation",      "$$ = yy.presenterContext.genrateOperationCode($1, $3, '-');" ],
                [ "operation * operation",      "$$ = yy.presenterContext.genrateOperationCode($1, $3, '*');" ],
                [ "operation / operation",      "$$ = yy.presenterContext.genrateOperationCode($1, $3, '/');" ],
                [ "operation /_ operation",     "$$ = yy.presenterContext.genrateOperationCode($1, $3, '/', '~~');" ],
                [ "operation % operation",      "$$ = yy.presenterContext.genrateOperationCode($1, $3, '%');" ],
                [ "operation <= operation",     "$$ = yy.presenterContext.genrateOperationCode($1, $3, '<=');" ],
                [ "operation >= operation",     "$$ = yy.presenterContext.genrateOperationCode($1, $3, '>=');" ],
                [ "operation > operation",      "$$ = yy.presenterContext.genrateOperationCode($1, $3, '>');" ],
                [ "operation < operation",      "$$ = yy.presenterContext.genrateOperationCode($1, $3, '<');" ],
                [ "operation != operation",     "$$ = yy.presenterContext.genrateOperationCode($1, $3, '!==');" ],
                [ "operation == operation",     "$$ = yy.presenterContext.genrateOperationCode($1, $3, '===');" ],
                [ "operation OR operation",     "$$ = yy.presenterContext.genrateOperationCode($1, $3, '||');" ],
                [ "operation AND operation",    "$$ = yy.presenterContext.genrateOperationCode($1, $3, '&&');" ],
                [ "( operation )",              "$$ = $2" ],
                [ "- operation",                "$$ = yy.presenterContext.generateMinusOperation($2);", {"prec": "UMINUS"} ],
                [ "number_value",               "$$ = $1" ],
                [ "variable_get",               "$$ = $1" ],
                [ "string_value",               "$$ = $1" ]
            ],

            "variable_get": [
                ["STATIC_VALUE", "$$ = yy.presenterContext.bnf['argument'](yy, yytext);"]
            ],

            "number_value": [
                ["NUMBER", "$$ = [yy.presenterContext.generateExecuteObject('stack.push({value: Number(' + yytext + ')})', '')];"]
            ]
        }
    };

    presenter.uidDecorator = function (fn) {
        return function () {
            presenter.bnf.uid += 1;
            return fn.apply(this, arguments);
        };
    };

    presenter.bnf = {
        uid: 0,


        case: presenter.uidDecorator(
            /**
             * @param  {Object[]} variableDef
             * @param  {{option:String, code:Object[]}[]} options
             */
            function (variableDef, options) {
                console.log(variableDef, options);

                var i,
                    exitLabel = presenter.bnf.uid + "_case_end",
                    execCode = [];

                execCode = execCode.concat(variableDef);    //On stack is variable value

                for (i = 0; i < options.length; i += 1) {
                    execCode = execCode.concat(options[i].option);  //Now on stack we have option to compare
                    execCode.push(presenter.generateJumpInstruction('stack[stack.length - 2].value === stack.pop().value', presenter.bnf.uid + '_case_option_' + i));
                }
                execCode.push(presenter.generateJumpInstruction('true', exitLabel));

                for (i = 0; i < options.length; i += 1) {
                    execCode.push(presenter.generateExecuteObject('', presenter.bnf.uid + '_case_option_' + i));
                    execCode = execCode.concat(options[i].code);
                    execCode.push(presenter.generateJumpInstruction('true', exitLabel));
                }
                execCode.push(presenter.generateExecuteObject('', exitLabel));
                execCode.push(presenter.generateExecuteObject('stack.pop();', ''));
                return execCode;
            }
        ),

        case_option: function (option, code) {

            return [{
                option: option,
                code: code
            }];
        },

        var: function (yy, varName) {
            presenter.state.variablesAndFunctionsUsage[yy.actualFunctionName].defined.push(varName);
            return 'actualScope.' + varName + ' = {value: 0};';
        },

        function_call: function (yy, functionName, args) {
            presenter.state.variablesAndFunctionsUsage[yy.actualFunctionName].fn.push(functionName);

            return yy.presenterContext.dispatch(functionName, args || []);
        },

        function: function (yy, functionName, functionArgs, sectionsBlock, codeBlock) {
            var sections = [presenter.generateExecuteObject(sectionsBlock || '', '')];

            presenter.state.variablesAndFunctionsUsage[yy.actualFunctionName].args = functionArgs;
            yy.functionNames.pop();

            return presenter.generateFunctionStart(functionArgs, functionName).concat(sections).concat(codeBlock).concat(yy.presenterContext.generateFunctionEnd(functionName));
        },

        function_declaration: function (yy, functionName) {
            presenter.state.variablesAndFunctionsUsage[functionName] = {defined: [], args: [], vars: [], fn: []};
            yy.actualFunctionName = functionName;
            presenter.state.definedByUserFunctions.push(functionName);
            yy.functionNames.push(functionName);

            return functionName;
        },

        assign_value_1: function (yy, variableName, operations) {
            operations.push(presenter.generateExecuteObject('actualScope.' + variableName + '.value = stack.pop().value;', ''));
            presenter.state.variablesAndFunctionsUsage[yy.actualFunctionName].vars.push(variableName);

            return operations;
        },

        assign_value_2: function (yy, operations) {
            operations.push(presenter.generateExecuteObject('stack.pop()'));

            return operations;
        },

        program_name: function (yy, programName) {
            yy.actualFunctionName = '1_main';
            presenter.state.variablesAndFunctionsUsage['1_main'] = {defined: [], args: [], vars: [], fn: []};
            return programName;
        },

        argument: function (yy, argName) {
            presenter.state.variablesAndFunctionsUsage[yy.actualFunctionName].vars.push(argName);

            return [presenter.generateExecuteObject('stack.push(actualScope.' + argName + ');', '')];
        },

        for_argument: function (yy, argName) {
            presenter.state.variablesAndFunctionsUsage[yy.actualFunctionName].vars.push(argName);

            return 'actualScope.' + argName + '.value';
        },

        for_value_header: presenter.uidDecorator(function (yy, variableName, from, to) {
            var execElements = [];

            presenter.state.variablesAndFunctionsUsage[yy.actualFunctionName].vars.push(variableName);

            yy.labelsStack.push(presenter.bnf.uid + '_for');
            yy.labelsStack.push(presenter.bnf.uid + '_for_end');


            execElements.push(presenter.generateExecuteObject("actualScope." + variableName + '.value = ' + from + ' - 1;'));
            execElements.push(presenter.generateExecuteObject('presenter.objectForInstructions.calledInstructions.for++', presenter.bnf.uid + '_for'));
            execElements.push(presenter.generateJumpInstruction('!((Boolean(actualScope.' + variableName + '.value += 1) || true) && actualScope.' + variableName + '.value <=' + to + ")", presenter.bnf.uid + '_for_end'));
            return execElements;

        }),

        for_exiter: function (yy) {
            var execElements = [],
                exitLabel = yy.labelsStack.pop(),
                checkerLabel = yy.labelsStack.pop();

            execElements.push(presenter.generateJumpInstruction('true', checkerLabel));
            execElements.push(presenter.generateExecuteObject('', exitLabel));

            return execElements;
        },

        /**
         * @param  {Object} yy
         * @param  {Object[]} expression
         * @param  {Object[]} code
         */
        if_instruction: presenter.uidDecorator(function (yy, expression, code) {
            var executableCode = expression,
                if_end = presenter.bnf.uid + "_end_if";

            executableCode.push(presenter.generateJumpInstruction('!Boolean(stack.pop().value);', if_end));
            executableCode = executableCode.concat(code);
            executableCode.push(presenter.generateExecuteObject('', if_end));

            return executableCode;
        }),

        /**
         * @param  {Object} yy
         * @param  {Object[]} expression
         * @param  {Object[]} ifCode
         * @param  {Object[]} elseCode
         */
        if_else_instruction: presenter.uidDecorator(function (yy, expression, ifCode, elseCode) {
            var executableCode = expression,
                else_start = presenter.bnf.uid + "_else_if",
                if_end = presenter.bnf.uid + "_end_if";

            executableCode.push(presenter.generateJumpInstruction('!Boolean(stack.pop().value);', else_start));
            executableCode = executableCode.concat(ifCode);
            executableCode.push(presenter.generateJumpInstruction('true', if_end));
            executableCode.push(presenter.generateExecuteObject('', else_start));
            executableCode = executableCode.concat(elseCode);
            executableCode.push(presenter.generateExecuteObject('', if_end));

            return executableCode;
        }),

        while_header: presenter.uidDecorator(function (yy, expression) {
            yy.labelsStack.push(presenter.bnf.uid + "_while");
            yy.labelsStack.push(presenter.bnf.uid + "_while_end");

            var execElements = [];

            execElements.push(presenter.generateExecuteObject('presenter.objectForInstructions.calledInstructions.while++', presenter.bnf.uid + "_while"));
            execElements = execElements.concat(expression);
            execElements.push(presenter.generateJumpInstruction('!Boolean(stack.pop().value)',  presenter.bnf.uid + "_while_end"));

            return execElements;
        }),

        while_exiter: function (yy) {
            var exitLabel = yy.labelsStack.pop(),
                startWhileLabel = yy.labelsStack.pop(),
                execElements = [];

            execElements.push(presenter.generateJumpInstruction('true', startWhileLabel));
            execElements.push(presenter.generateExecuteObject('', exitLabel));

            return execElements;
        },

        return_value: function (yy, returnCode) {
            var actualFunctionName = yy.functionNames[yy.functionNames.length - 1],
                execCommands = returnCode;

            execCommands.push(presenter.generateExecuteObject("retVal = {value: stack.pop().value};", ""));
            execCommands.push(presenter.generateJumpInstruction('true', "1_" + actualFunctionName));

            return execCommands;
        },

        do_while_header: presenter.uidDecorator(function (yy) {
            var execElements = [],
                enterLabel = presenter.bnf.uid + "_do_while_enter";

            execElements.push(presenter.generateExecuteObject('presenter.objectForInstructions.calledInstructions.doWhile++;', enterLabel));
            yy.labelsStack.push(enterLabel);

            return execElements;
        }),

        do_while_exiter: function (yy, expression) {
            var execElements = [],
                enterLabel = yy.labelsStack.pop();

            execElements = execElements.concat(expression);
            execElements.push(presenter.generateJumpInstruction('!Boolean(stack.pop().value)', enterLabel));

            return execElements;
        }
    };

    presenter.TYPES = {
        EXECUTE: 1,
        JUMP: 2
    };

    /**Generate code for minus precedence
     * @param  {Object[]} beforeCode code executed before operation
     */
    presenter.generateMinusOperation = function (beforeCode) {
        var minusOperation = presenter.generateExecuteObject("stack.push({value: -stack.pop().value});");

        beforeCode.push(minusOperation);
        return beforeCode;
    };

    /**
     * @param  {Object[]} firstVal array with calculations first value
     * @param  {Object[]} secVal array with calculations second value
     * @param  {('+'|'-'|'/'|'*'|'/_'|'%'|'<='|'>='|'<'|'>'|'!='|'--'|'OR'|'AND')} operationType 
     * @param {("~~"|undefined)} [preOperation] operation which will be called on whole statetement. can be undefined
     * @return {Array[Object]}
     */
    presenter.genrateOperationCode = function (firstVal, secVal, operationType, preOperation) {
        var execObjects = firstVal.concat(secVal),
            code = "",
            preCode = "";

        preCode += "ebx = stack.pop();";
        preCode += "eax = stack.pop();";

        code += "eax.value" + operationType + "ebx.value";

        if (preOperation !== undefined) {
            code = preOperation + "(" + code + ")";
        }

        code = preCode + "stack.push({value: " + code + "});";

        execObjects.push(presenter.generateExecuteObject(code, ""));
        return execObjects;
    };

    presenter.generateFunctionStart = function (argsList, functionName) {
        var execObjects = [],
            i,
            initialCommand = "";

        // Set start label
        execObjects.push(presenter.generateExecuteObject('', functionName));

        initialCommand += "stack.push(actualScope);\n";  //Save actualScope on stack
        initialCommand += "actualScope = {};\n";        //Reset scope to default

        // Add to actualScope variables passed in stack, but in stack is actualScope saved! (while function call)
        for (i = argsList.length - 1; i >= 0; i -= 1) {
            initialCommand += "actualScope['" + argsList[Math.abs(i - (argsList.length - 1))] + "'] = stack[stack.length - (2 + " + i + ")];\n";
        }

        execObjects.push(presenter.generateExecuteObject(initialCommand, '')); //Call it as code

        return execObjects;
    };

    presenter.generateFunctionEnd = function (functionName) {
        var execCommands = [],
            exitCommand = "";

        execCommands.push(presenter.generateExecuteObject('retVal = {value: 0}', ''));   //If code goes there without return, then add to stack default value

        execCommands.push(presenter.generateExecuteObject('', '1_' + functionName));    //Here return will jump. Define as 1_<function_name>. 

        exitCommand += "actualScope = {};"; // Clear scope
        exitCommand += "actualScope = stack.pop();"; //Get saved scope //TODO: check in tests if stack is there the same

        execCommands.push(presenter.generateExecuteObject(exitCommand, ''));

        execCommands.push(presenter.generateExecuteObject("actualIndex = functionsCallPositionStack.pop() + 1;", ""));


        return execCommands;
    };

    presenter.dispatch = function (functionName, args) {
        var execCode = [],
            clearStackCode = '',
            i;

        for (i = 1; i <= args.length; i += 1) {
            execCode = execCode.concat(args[i - 1]);
            clearStackCode += 'stack.pop();';
        }

        if (presenter.configuration.functions.hasOwnProperty(functionName)) {
            execCode = execCode.concat(presenter.dispatchForBuiltInFunctions(functionName, args));
        } else {
            execCode.push(presenter.generateExecuteObject("functionsCallPositionStack.push(actualIndex);", ""));    //Push actual index of code, function before end will return to that index
            execCode = execCode.concat(presenter.dipatchUserFunction(functionName));
        }

        execCode.push(presenter.generateExecuteObject(clearStackCode));
        execCode.push(presenter.generateExecuteObject('stack.push(retVal);', ''));
        return execCode;
    };

    presenter.dipatchUserFunction = function (functionName) {
        var execCode = [];

        execCode.push(presenter.generateJumpInstruction('true',  functionName));

        return execCode;
    };

    /**Dipatch for build in function (function declared in properties)
     * @param  {String} functionName
     * @param  {Array[]} args contains how to resolve each argument
     */
    presenter.dispatchForBuiltInFunctions = function (functionName, args) {
        var parsedArgs = [],
            i,
            code,
            execCode = [];

        // That must be there, because, we don't know how many args receive built in function
        for (i = 1; i <= args.length; i += 1) {
            parsedArgs.unshift("stack[stack.length - " + i + "]");
        }

        code = "retVal = presenter.configuration.functions." + functionName + ".call(presenter.objectForInstructions, next, pause," + parsedArgs.join(",") + ");";

        execCode.push(presenter.generateExecuteObject(code, '', true));

        return execCode;
    };

    /**
     * Generate code executed by addon. 
     * @param  {String} code
     * @param  {String} label set label for goto instruction
     * @param  {Boolean} [isAsync] async instructions cant be merged and is optional
     */
    presenter.generateExecuteObject = function (code, label, isAsync) {
        return {
            code: code,
            type: presenter.TYPES.EXECUTE,
            label: label,
            isAsync: isAsync || false
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

    // ---------------------------------- ADDON SECTION ---------------------------------------------------------------

    //This object will be passed to instruction as scope
    presenter.objectForInstructions = {
        calledInstructions: {
            for: 0,
            while: 0,
            doWhile: 0
        }    //Object with calculated each built in instruction call e.g. for, while
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
            "and": "and"
        }
    };

    presenter.ERROR_CODES = {
    };

    //https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    presenter.setPlayerController = function (controller) {
        presenter.state.playerController = controller;
        presenter.state.eventBus = presenter.state.playerController.getEventBus();
        presenter.state.eventBus.addEventListener('ShowAnswers', this);
        presenter.state.eventBus.addEventListener('HideAnswers', this);
    };

    presenter.killMachine = {}; // Object which contains all machines with kill machine function

    presenter.killAllMachines = function () {
        var id;

        for (id in presenter.killMachine) {
            if (presenter.killMachine.hasOwnProperty(id)) {
                presenter.killMachine[id]();
            }
        }
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
        parser.yy.labelsStack = [];
        parser.yy.functionNames = [];
        presenter.state.codeGenerator = parser;
    };

    /**
     * Before each user code call, this object should be initialized
     * @param  {Object} [consoleMock] optional argument for console
     */
    presenter.initializeObjectForCode = function (consoleMock) {
        presenter.objectForInstructions = {
            calledInstructions: {
                for: 0,
                while: 0,
                doWhile: 0
            }
        };
        presenter.objectForInstructions.console = consoleMock || presenter.state.console;
        //presenter.objectForInstructions.console.Reset();
        presenter.state.definedByUserFunctions = [];
    };

    presenter.initializeConsole = function () {
        presenter.state.console = new presenter.console(presenter.state.$view.find(".addon-Pseudo_Console-wrapper"));
    };

    // presenter.initializeJQConsole = function () {
    //     var jqConsole = presenter.state.$view.jqconsole('', '>>>'),
    //         originalPropmpt = jqConsole.Prompt,
    //         readCharCallback = null;

    //     jqConsole.Prompt = function (callback) {
    //         jqConsole.pauseIns();
    //         originalPropmpt.call(jqConsole, true, function (input) {
    //             callback.call(this, input);
    //             jqConsole.nextIns();
    //         });
    //     };

    //     presenter.state.jqconsole = jqConsole;
    // };

    presenter.initialize = function (view, model, isPreview) {
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
        }

        presenter.setVisibility(presenter.configuration.isVisibleByDefault);

        view.addEventListener('DOMNodeRemoved', presenter.destroy);
    };

    presenter.connectHandlers = function () {
    };

    presenter.stop = function () {
        //presenter.state.console.Reset();
        presenter.killAllMachines();
    };

    presenter.executeCommand = function (name, params) {
        if (presenter.isErrorCheckingMode) {
            return;
        }

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'stop': presenter.stop
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
                    callback.call(presenter.state.console, actualInput);
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
            score = 0;

        presenter.initializeObjectForCode(presenter.generateConsoleMock(presenter.configuration.answer.parameters));

        presenter.codeExecutor(code, true);
        score = presenter.evaluateScoreFromLastOutput();

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

    presenter.getExcludedNames = function () {
        var i,
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

    presenter.multiDefineInstructionChecker = function () {
        var i,
            userFunctionName = "",
            excludedNames = presenter.getExcludedNames();

        function InstuctionIsDefinedException(instrName) {
            this.message = "Instruction was defined before: \"" + instrName + "\"";
            this.name = "InstuctionIsDefinedException";
        }

        for (i = 0; i < presenter.state.definedByUserFunctions.length; i += 1) {
            userFunctionName = presenter.state.definedByUserFunctions[i];
            if (!excludedNames[userFunctionName]) {
                excludedNames[userFunctionName] = true;
            } else {
                throw new InstuctionIsDefinedException(userFunctionName);
            }
        }
    };

    /**
     * @param  {{defined: String[], args: String[], vars:String [], fn: String[]}} functionData
     * @param  {Stirng} functionName
     */
    presenter.undefinedUsageForFunctionChecker = function (functionData, functionName) {
        var usedVariableName = "",
            usedFunctionName = "",
            i,
            excludedNames = presenter.getExcludedNames();

        function UndefinedVariableNameException(varName) {
            this.message = "Usage of undefined variable '" + varName + "' in function '" + functionName + "'";
            this.name = "UndefinedVariableNameException";
        }

        function UndefinedFunctionNameException(varName) {
            this.message = "Usage of undefined function '" + varName + "' in function '" + functionName + "'";
            this.name = "UndefinedFunctionNameException";
        }

        for (i = 0; i < functionData.vars.length; i += 1) {
            usedVariableName = functionData.vars[i];
            if ($.inArray(usedVariableName, functionData.defined) === -1 && $.inArray(usedVariableName, functionData.args) === -1) {
                throw new UndefinedVariableNameException(usedVariableName);
            }
        }

        for (i = 0; i < functionData.fn.length; i++) {
            usedFunctionName = functionData.fn[i];
            if (!excludedNames[usedFunctionName] && $.inArray(usedFunctionName, presenter.state.definedByUserFunctions) === -1) {
                throw new UndefinedFunctionNameException(usedFunctionName);
            }
        }
    };

    presenter.undefinedInstructionOrVariableChecker = function () {
        var i,
            usedVariablesAndFunctions = {};

        for (i in presenter.state.variablesAndFunctionsUsage) {
            if (presenter.state.variablesAndFunctionsUsage.hasOwnProperty(i)) {
                usedVariablesAndFunctions = presenter.state.variablesAndFunctionsUsage[i];
                presenter.undefinedUsageForFunctionChecker(usedVariablesAndFunctions, i);
            }
        }
    };

    presenter.checkCode = function () {
        presenter.multiDefineInstructionChecker();
        presenter.undefinedInstructionOrVariableChecker();
    };

    presenter.executeCode = function (code) {
        presenter.state.wasChanged = true;
        presenter.initializeObjectForCode();
        try {
            var executableCode = presenter.state.codeGenerator.parse(code);

            presenter.checkCode();

            presenter.state.lastUsedCode = executableCode;
            presenter.stop();
            presenter.codeExecutor(executableCode, false);
        } catch (e) {
            if (e.name) {
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
    presenter.codeExecutor = function (parsedData, getScore) {
        console.log("Creating machine!");

        var actualIndex = 0,
            code = parsedData.code,
            timeoutId = 0,
            isEnded = false,
            startTime = new Date().getTime() / 1000,
            actualScope = {},         // There will be saved actual variables
            stack = [],               // Stack contains saved scopes
            functionsCallPositionStack = [], //Stack wihich contains information about actual executed code position.
            retVal = {value: 0},      // value returned by function,
            eax = {value: 0},         // Helper used in generated code (see operation)
            ebx = {value: 0},         // Helper used in generated code,
            id = uuidv4();

        console.log(parsedData);

        function getIndexByLabel(label) {
            var i;
            for (i = 0; i < code.length; i += 1) {
                if (code[i] && code[i].label === label) {
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
                console.log(actualIndex);
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
            console.log(stack, retVal);
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
                presenter.state.console.Write(e + "\n", 'program-error-output');
                console.log(actualIndex);
                pause();
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
            var actualTime;

            while (true) {
                actualTime = new Date().getTime() / 1000;
                if (actualTime - startTime > presenter.configuration.answer.maxTimeForAnswer.parsedValue) {
                    console.log("KILL!");
                    killMachine();
                    return;
                }

                isEnded = executeLine();
                if (isEnded) {
                    console.log(stack);
                    killMachine();
                    return;
                }
            }
        }

        presenter.killMachine[id]  = killMachine;

        eval(parsedData.sections);

        if (getScore) {
            executeCodeSyncWithMaxTime();
        } else {
            executeAsync();
        }
    };
    // ----------------------------------CONSOLE----------------------------------------------
    var consoleClasses = {
        "LINES_CONTAINER": "pseudoConsole-console-container",
        "CURSOR": "pseudoConsole-console-cursor",
        "RIGHT_ELEMENT": "pseudoConsole-console-right-element"
    };

    function userConsole($element) {
        this.ownerElement = $element;
        this.container = $("<pre></pre>");
        this.linesContainer = $("<div class='" + consoleClasses.LINES_CONTAINER + "'></div>");
        this.lines = [];
        this.activeLineIndex = -1;

        $element.append(this.container);
        this.container.append(this.linesContainer);

        this.addNewLine(true);
    }

    userConsole.prototype = {
        generateLine: function () {
            var $htmlObject = $("<span></span>"),
                $left = $("<span></span>"),
                $right = $("<span class='" + consoleClasses.RIGHT_ELEMENT + "'></span>"),
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

        addNewLine: function (isActive) {
            var line = this.generateLine();
            this.lines.push(line);
            this.linesContainer.append(line.$htmlObject);

            if (isActive) {
                this.selectLineAsActive(this.lines.length - 1);
            }
        },

        selectLineAsActive: function (index) {
            var activeLine = null;
            if (this.activeLineIndex > -1) {
                activeLine = this.lines[this.activeLineIndex];
                activeLine.elements.$left.text(activeLine.elements.$left.text() + activeLine.elements.$right.text());
                activeLine.elements.$cursor.html('');
            }

            this.activeLineIndex = index;
            activeLine = this.lines[index];
            activeLine.elements.$cursor.html('&nbsp;');
        },
        /**
         * @param  {String} text
         * @param  {String} className
         */
        Write: function (text, className) {
            var lines = text.split('\n'),
                line,
                activeLine = this.lines[this.activeLineIndex],
                i;

            for (i = 0; i < lines.length - 1; i += 1 ) {
                line = lines[i];
                activeLine.elements.$left.text(activeLine.elements.$left.text() + line);
                this.addNewLine(true);
                activeLine = this.lines[this.activeLineIndex];
                activeLine.elements.$left.text("\n");
            }

            activeLine = this.lines[this.activeLineIndex];
            line = lines[i];
            activeLine.elements.$left.text(activeLine.elements.$left.text() + line);
        }
    };

    presenter.console = userConsole;
    // ---------------------------------- VALIDATION SECTION ---------------------------------
    // TODO:
    // 1. Check if function dont have name like built in functions: for, while
    // 2. Check if function name is unique
    // 3. Check function name as regexp
    // 4. Do it for aliases

    presenter.validateFunction = function (functionToValidate) {
        return {
            isValid: true,
            value: {
                name: functionToValidate.name,
                body: new Function("this.console.pauseIns = arguments[1], this.console.nextIns = arguments[0]; arguments = Array.prototype.slice.call(arguments, 2);" + functionToValidate.body + "; return {value: undefined};")
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