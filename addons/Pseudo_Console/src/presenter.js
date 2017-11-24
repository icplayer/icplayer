function AddonPseudo_Console_create() {
    var presenter = function () {},
        JISON_GRAMMAR;

    // ----------------------- LANGUAGE COMPILER SECTION -----------------------------------
    JISON_GRAMMAR = {
        "lex": {
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
                ["$case$",                  "return 'CASE';"],
                ["$option$",                "return 'OPTION';"],
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
            ["left", "OR", "AND"],
            ["left", "<=", ">=", "<", ">", "!=", "=="],
            ["left", "+", "-"],
            ["left", "*", "/", "/_", "%"],
            ["left", "(", ")"],
            ["left", "BRACKET"],
            ["left", "UMINUS"],
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
                ["function_declaration ( function_arguments ) end_line section_list code_block", "$$ = yy.presenterContext.bnf['function'](yy, $1, $3 || [], $6, $7);"]
            ],

            "function_declaration" : [
                ["FUNCTION STATIC_VALUE", "$$ = yy.presenterContext.bnf['function_declaration'](yy, $2);"]
            ],

            "function_arguments" : [
                "",
                ["function_arguments_list", "$$ = $1 || [];"]
            ],

            "function_arguments_list" : [
                ["STATIC_VALUE", "$$ = [$1];"],
                ["function_arguments_list COMMA STATIC_VALUE", "$1.push($3); $$ = $1;"]
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
                ["IF operation THEN end_line code_block_or_instruction", "$$ = yy.presenterContext.bnf['if_instruction']($2, $5);"],
                ["IF operation THEN end_line code_block_or_instruction ELSE end_line code_block_or_instruction",  "$$ = yy.presenterContext.bnf['if_else_instruction']($2, $5, $8);"]
            ],

            "assign_value" : [
                ['STATIC_VALUE = operation end_line', "$$ = yy.presenterContext.bnf['assign_value_1'](yy, $1, $3);"],
                ['operation end_line', "$$ = yy.presenterContext.bnf['assign_value_2']($1);"]
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
                ["for_value_header end_line code_block_or_instruction", "$$ = $1.concat($3).concat(yy.presenterContext.bnf['for_exiter'](yy));"]
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

            "end_line" : [
                ["new_line_list", "$$='';"]
            ],

            "new_line_list" : [
                ["EOF", "$$='';"],
                ["NEW_LINE", "$$='';"],
                ["new_line_list NEW_LINE", "$$='';"],
                ["new_line_list EOF", "$$ = '';"]
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
                var i,
                    exitLabel = presenter.bnf.uid + "_case_end",
                    execCode = [presenter.generateExecuteObject('presenter.objectForInstructions.calledInstructions.case++;', '')];

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
            operations.push(presenter.generateExecuteObject('actualScope.' + variableName + ' = stack.pop();', ''));
            presenter.state.variablesAndFunctionsUsage[yy.actualFunctionName].vars.push(variableName);

            return operations;
        },

        assign_value_2: function (operations) {
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
            execElements.push(presenter.generateExecuteObject('presenter.objectForInstructions.calledInstructions.for--', exitLabel));
            return execElements;
        },

        /**
         * @param  {Object} yy
         * @param  {Object[]} expression
         * @param  {Object[]} code
         */
        if_instruction: presenter.uidDecorator(function (expression, code) {
            var executableCode = [presenter.generateExecuteObject('presenter.objectForInstructions.calledInstructions.if++;')],
                if_end = presenter.bnf.uid + "_end_if";

            executableCode = executableCode.concat(expression);
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
        if_else_instruction: presenter.uidDecorator(function (expression, ifCode, elseCode) {
            var executableCode = [presenter.generateExecuteObject('presenter.objectForInstructions.calledInstructions.if++;')],
                else_start = presenter.bnf.uid + "_else_if",
                if_end = presenter.bnf.uid + "_end_if";

            executableCode = executableCode.concat(expression);
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
            execElements.push(presenter.generateExecuteObject('presenter.objectForInstructions.calledInstructions.while--', exitLabel));

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
            execElements.push(presenter.generateJumpInstruction('Boolean(stack.pop().value)', enterLabel));

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
     * @param  {('+'|'-'|'/'|'*'|'/_'|'%'|'<='|'>='|'<'|'>'|'!='|'=='|'OR'|'AND')} operationType 
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
        exitCommand += "actualScope = stack.pop();"; //Get saved scope

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
            doWhile: 0,
            if: 0,
            case: 0
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
            "and": "and",
            "if": "if",
            "then": "then",
            "else": "else",
            "case": "case",
            "option": "option",
            "function": "function",
            "return": "return"
        }
    };

    presenter.ERROR_CODES = {
        "FN01": "Defined function name must match to ^[A-Za-z_][a-zA-Z0-9_]*$",
        "FN02": "Defined function must have unique name",
        "FN03": "Defined function overrides built in alias",
        "AN01": "Defined alias name must match to ^[A-Za-z_][a-zA-Z0-9_]*$",
        "AN02": "Multiple aliases got the same name"
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
                doWhile: 0,
                if: 0,
                case: 0
            }
        };
        presenter.objectForInstructions.console = consoleMock || presenter.state.console;
        presenter.state.definedByUserFunctions = [];
    };

    presenter.initializeConsole = function () {
        presenter.state.console = new presenter.console(presenter.state.$view.find(".addon-Pseudo_Console-wrapper"));
        var originalReadLine = presenter.state.console.ReadLine,
            originalReadChar = presenter.state.console.ReadChar;

        presenter.state.console.ReadLine = function (callback) {
            presenter.state.console.pauseIns();
            originalReadLine.call(presenter.state.console, function (input) {
                callback.call(this, input);
                presenter.state.console.nextIns();
            });
        };

        presenter.state.console.ReadChar = function (callback) {
            presenter.state.console.pauseIns();
            originalReadChar.call(presenter.state.console, function (input) {
                callback.call(this, input);
                presenter.state.console.nextIns();
            });
        };
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
            presenter.initializeConsole();
            presenter.initializeObjectForCode();
            presenter.initializeGrammar();
        }
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        view.addEventListener('DOMNodeRemoved', presenter.destroy);
    };

    presenter.stop = function () {
        presenter.state.console.Reset();
        presenter.killAllMachines();
    };

    presenter.onEventReceived = function (eventName) {
        if (eventName === "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName === "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'stop': presenter.stop,
            'showAnswers' : presenter.showAnswers,
            'hideAnswers' : presenter.hideAnswers
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.showAnswers = function () {
        presenter.state.console.disable();
    };

    presenter.hideAnswers = function () {
        presenter.state.console.enable();
    };

    presenter.destroy = function (event) {
        if (event.target !== this) {
            return;
        }

        presenter.state.view.removeEventListener("DOMNodeRemoved", presenter.destroy);
        if (presenter.state.console) {
            presenter.state.console.destroy();
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
        presenter.killAllMachines();
        presenter.state.console.Reset();
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
        presenter.state.console.enable();
    };

    presenter.setShowErrorsMode = function () {
        presenter.state.console.disable();
    };

    presenter.setWorkMode = function () {
        presenter.state.console.enable();
    };

    presenter.setState = function (stateString) {
        var state = JSON.parse(stateString);

        presenter.setVisibility(state.isVisible);
        presenter.state.lastScore = state.score;
    };

    presenter.getState = function () {
        var state = {
            isVisible: presenter.state.isVisible,
            score: presenter.state.lastScore
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

            ReadLine: function (callback) {
                var actualInput = input[actualInputIndex];
                if (actualInput !== null) {
                    callback.call(presenter.state.console, actualInput);
                    actualInputIndex += 1;
                }
            },

            ReadChar: function (callback) {
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

    function sendScoreChangedEvent(score) {
        var eventData = {
            'source': presenter.configuration.addonID,
            'item': 'all',
            'value': '',
            'score': score
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

            sendScoreChangedEvent(score);
        }

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
            return 1 - presenter.getScore();
        }

        return 0;
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
     * @param  {String} functionName
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

        for (i = 0; i < functionData.fn.length; i += 1) {
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
        if (!presenter.configuration.isValid) {
            return;
        }

        presenter.state.variablesAndFunctionsUsage = {};
        presenter.state.wasChanged = true;
        presenter.initializeObjectForCode();
        try {
            presenter.state.console.Reset();
            var executableCode = presenter.state.codeGenerator.parse(code);

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
    presenter.codeExecutor = function (parsedData, getScore) {
        var actualIndex = 0,
            code = parsedData.code,
            timeoutId = 0,
            isEnded = false,
            startTime = new Date().getTime() / 1000,
            actualScope = {},         // There will be saved actual variables
            stack = [],               // Stack contains saved scopes
            functionsCallPositionStack = [], //Stack which contains information about actual executed code position.
            retVal = {value: 0},      // value returned by function,
            eax = {value: 0},         // Helper used in generated code (see operation)
            ebx = {value: 0},         // Helper used in generated code,
            id = uuidv4();

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
         * @returns {Boolean} false - if code was executed, true if program is ended
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
    var consoleClasses = {
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

            var $htmlObject = $("<span></span>"),
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

            var line = this.generateLine(className);
            this.lines.push(line);
            this.linesContainer.append(line.$htmlObject);

            if (isActive) {
                this.selectLineAsActive(this.lines.length - 1);
            }

            this.$parentElement[0].scrollTop = this.$parentElement[0].scrollHeight;
        },

        selectLineAsActive: function (index) {
            var activeLine = null;
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

            var lines = text.split('\n'),
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
            var self = this;

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

            var activeLine = this.getActiveLine(),
                textAreaElement = this.$textArea,
                parentElement = this.$parentElement,
                data,
                leftText,
                rightText,
                keycode,
                actualTextAreaIndex = textAreaElement.val().length,
                self = this;

            $(parentElement).on('click', function () {
                textAreaElement.off();
                textAreaElement.focus();

                textAreaElement.on('input', function () {
                    if (self.isDisabled) {
                        return;
                    }

                    data = textAreaElement.val();
                    leftText = activeLine.elements.$left.text();
                    rightText = activeLine.elements.$right.text();

                    if (data.length > 0) {
                        if (data[data.length - 1] !== '\n') {
                            leftText = leftText + data.substring(actualTextAreaIndex - 1, data.length);
                            actualTextAreaIndex = data.length;
                        }
                    }

                    activeLine.elements.$left.text(leftText);
                    activeLine.elements.$right.text(rightText);
                    textAreaElement.val('');

                });

                textAreaElement.on('keydown', function (event) {
                    if (self.isDisabled) {
                        return;
                    }

                    keycode = event.which || event.keycode;
                    data = textAreaElement.val();
                    leftText = activeLine.elements.$left.text();
                    rightText = activeLine.elements.$right.text();

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
                            if (actualTextAreaIndex > 0) {
                                actualTextAreaIndex -= 1;
                            }
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
                });
            });

            $(parentElement).click();
        },

        ReadChar: function (callback) {
            this.isReadMode = true;

            if (!this.isReadMode) {
                return;
            }

            this.addNewLine(true);

            var activeLine = this.getActiveLine(),
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
                        activeLine.elements.$left.text(leftText + data[data.length - 1]);
                        $(parentElement).off();
                        textAreaElement.off();
                        self.isReadMode = false;
                        textAreaElement.val('');
                        callback(data[data.length - 1]);
                    }
                });
            });

            $(parentElement).click();
        },

        Reset: function () {
            var textAreaElement = this.$textArea,
                parentElement = this.$parentElement;
            parentElement.off();
            textAreaElement.off();
            this.isReadMode = false;

            this.linesContainer.find('span').remove();
            this.lines = [];

            this.activeLineIndex = -1;

            this.addNewLine(true);
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
    function generateValidationError(errorCode) {
        return {
            isValid: false,
            errorCode: errorCode
        };
    }

    presenter.validateFunction = function (functionToValidate) {
        if (!/^[A-Za-z_][a-zA-Z0-9_]*$/g.exec(functionToValidate.name)) {
            return generateValidationError("FN01");
        }

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

    presenter.validateAliases = function (aliases) {
        var definedAliases = {},
            aliasKey,
            aliasName,
            exists = {};

        for (aliasKey in aliases) {
            if (aliases.hasOwnProperty(aliasKey)) {
                if (!ModelValidationUtils.isStringEmpty(aliases[aliasKey].name.trim())) {
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

    presenter.validateAnswer = function (model) {
        var runUserCode = ModelValidationUtils.validateBoolean(model.runUserCode),
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

    presenter.checkAliasesNamesWithFunctions = function (aliases, functions) {
        var aliasKey;

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

    presenter.validateModel = function (model) {
        var validatedAliases,
            validatedFunctions,
            validatedAnswer,
            isUniqueInAliasesAndFunctions;

        validatedAliases = presenter.validateAliases(model.default_aliases);
        if (!validatedAliases.isValid) {
            return validatedAliases;
        }

        validatedFunctions = presenter.validateFunctions(model.functionsList);
        if (!validatedFunctions.isValid) {
            return validatedFunctions;
        }

        if (validatedAliases.isValid && validatedFunctions.isValid) {
            isUniqueInAliasesAndFunctions = presenter.checkAliasesNamesWithFunctions(validatedAliases.value, validatedFunctions.value);
            if (!isUniqueInAliasesAndFunctions.isValid) {
                return isUniqueInAliasesAndFunctions;
            }
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