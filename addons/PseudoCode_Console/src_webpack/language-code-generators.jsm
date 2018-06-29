import { generateExecuteObject, generateJumpInstruction } from './language-utils.jsm';

function uidDecorator(fn) {
    return function () {
        CODE_GENERATORS.uid += 1;
        return fn.apply(this, arguments);
    };
}

function getuid() {
    CODE_GENERATORS.uid += 1;
    return CODE_GENERATORS.uid;
}

export const CODE_GENERATORS = {
    uid: 0,

    case: uidDecorator(
        /**
         * @param  {Object[]} variableDef
         * @param  {{option:String[], code:Object[]}[]} options
         */
        function bnf_case (variableDef, options) {
            let i,
                exitLabel = CODE_GENERATORS.uid + "_case_end",
                execCode = [generateExecuteObject('machineManager.objectForInstructions.calledInstructions.case++;', '')];

            execCode = execCode.concat(variableDef);    //On stack is variable value

            for (i = 0; i < options.length; i += 1) {
                options[i].option.forEach(option => {
                    execCode = execCode.concat(option);  //Now on stack we have option to compare
                    execCode.push(generateJumpInstruction('stack[stack.length - 2].value === stack.pop().value', CODE_GENERATORS.uid + '_case_option_' + i));
                });
            }
            execCode.push(generateJumpInstruction('true', exitLabel));

            for (i = 0; i < options.length; i += 1) {
                execCode.push(generateExecuteObject('', CODE_GENERATORS.uid + '_case_option_' + i));
                execCode = execCode.concat(options[i].code);
                execCode.push(generateJumpInstruction('true', exitLabel));
            }
            execCode.push(generateExecuteObject('', exitLabel));
            execCode.push(generateExecuteObject('stack.pop();', ''));
            return execCode;
        }
    ),


    /**
     * Try to find method in object. If object doesn't contains method then check his parent.
     * @param object {Object}
     * @param methodName {String}
     * @returns {Function}
     */
    getMethodFromObject: function bnf_getMethodFromObject (machineManager, object, methodName) {
        let methods = object.methods;
        while(true) {
            if (methods.hasOwnProperty(methodName)) {
                return methods[methodName];
            }

            if (object.parent == null) {
                throw machineManager.exceptions.MethodNotFoundException(methodName);
            }

            object = object.parent;
            methods = object.__methods__;
        }
    },

    /**
     * Manager should be added to each program. If method is called then this manager will find correct function.
     *  Built in methods:
     *  -get method from object. Call this object method as js call function with passed object and stack and builtIn arguments.
     *  -get retVal value and add it to stack
     *
     *
     * Objects and inheritance in pseudocode (Concept):
     *  -Add to machine new instruction evaluateJumpLabelAndJump which will execute code in label and will jump to generated label.
     *  -Add new object to machineManager.objectMocks
     *  -Use it in object call manager, if getMethodFromObject(a,b).native is True, then execute original code, if false then use evaluateJumpLabelAndJump to getMethodFromObject(a,b).labelCode where will be code to jump.
     *  -Each class should be saved in precessor code, each method should contains own label to jump, for example MyClass.myMethod should contains MyClass.myMethod label for jump
     *  -Before jump, set scope for this class and jump to method.
     *
     */
    getObjectCallManager: function bnf_getObjectCallManager () {
        let execCode = [];

        execCode.push(generateExecuteObject('', '1_get_object_call_manager'));

        let code = "";
        code += "machineManager.bnf.builtInMethodCall(machineManager, stack, machineManager.objectForInstructions, machineManager.objectMocks, next, pause, retVal);;";


        execCode.push(generateExecuteObject(code, ''));

        execCode.push(generateExecuteObject("actualIndex = functionsCallPositionStack.pop() + 1;", ""));

        return execCode;
    },

    case_option: function bnf_case_option (option, code) {
        return [{
            option: option,
            code: code
        }];
    },

    array: function bnf_array (yy, arrayName, arraySize, startValues) {
        let execCode = [];


        let code = 'var buff1 = [];';

        startValues = startValues || [];

        startValues.forEach(function (el) {
            code += ';buff1.push(stack.pop());';
            execCode = execCode.concat(el);
        });

        code += 'stack.push(buff1.reverse());';


        yy.presenterContext.state.variablesAndFunctionsUsage[yy.actualFunctionName].defined.push(arrayName);
        code =  code + 'actualScope.' + arrayName + '= machineManager.objectMocks.Array.__constructor__.call({},' + arraySize + ', stack.pop());';

        execCode.push(generateExecuteObject(code, ''));

        return execCode;
    },


    var: function bnf_var (yy, varName) {
        yy.presenterContext.state.variablesAndFunctionsUsage[yy.actualFunctionName].defined.push(varName);
        return generateExecuteObject('actualScope.' + varName + ' = machineManager.objectMocks.Number.__constructor__.call({}, 0);');
    },

    var_start_value: function var_start_value(yy, varName, operation) {
        yy.presenterContext.state.variablesAndFunctionsUsage[yy.actualFunctionName].defined.push(varName);

        operation.push(generateExecuteObject('actualScope.' + varName + ' = stack.pop();'));

        return operation;
    },

    function_call: function bnf_function_call (yy, functionName, args) {
        yy.presenterContext.state.variablesAndFunctionsUsage[yy.actualFunctionName].fn.push(functionName);

        return CODE_GENERATORS.dispatchFunction(yy, functionName, args || []);
    },

    method_call: function bnf_method_call (methodName, args, operations) {
        let execObjects = [];

        //Call args code in reverse order to save it on stack
        for (let i = args.length - 1; i >= 0; i--){
            execObjects = execObjects.concat(args[i]);
        }

        execObjects = execObjects.concat(operations);

        execObjects.push(generateExecuteObject("stack.push('" + methodName + "');", ''));
        execObjects.push(generateExecuteObject("stack.push(" + args.length + ");", ''));

        execObjects.push(generateExecuteObject("functionsCallPositionStack.push(actualIndex);", ""));
        execObjects.push(generateJumpInstruction('true', '1_get_object_call_manager'));
        execObjects.push(generateExecuteObject("stack.push(retVal.value);", ''));

        return execObjects;
    },

    array_get: function bnf_array_get (variableName, operations) {
        return CODE_GENERATORS.method_call("__get__", [operations], variableName);
    },

    function: function bnf_function (yy, functionName, functionArgs, sectionsBlock, codeBlock) {
        let sections = sectionsBlock || [];

        yy.presenterContext.state.variablesAndFunctionsUsage[yy.actualFunctionName].args = functionArgs;
        yy.functionNames.pop();

        return CODE_GENERATORS.generateFunctionStart(functionArgs, functionName).concat(sections).concat(codeBlock).concat(CODE_GENERATORS.generateFunctionEnd(functionName));
    },

    function_declaration: function bnf_function_declaration (yy, functionName) {
        yy.presenterContext.state.variablesAndFunctionsUsage[functionName] = {defined: [], args: [], vars: [], fn: []};
        yy.actualFunctionName = functionName;
        yy.presenterContext.state.definedByUserFunctions.push(functionName);
        yy.functionNames.push(functionName);

        return functionName;
    },

    assign_value_1: function bnf_assign_value_1 (yy, variableName, operations) {
        operations.push(generateExecuteObject('actualScope.' + variableName + ' = stack.pop();', ''));
        yy.presenterContext.state.variablesAndFunctionsUsage[yy.actualFunctionName].vars.push(variableName);

        return operations;
    },

    assign_value_2: function bnf_assign_value_2 (operations) {
        operations.push(generateExecuteObject('stack.pop()'));

        return operations;
    },

    assign_array_value: function bnf_assign_array_value (variableName, operations, value) {
        return CODE_GENERATORS.method_call("__set__", [operations, value], variableName);
    },

    program_name: function bnf_program_name (yy, programName) {
        yy.actualFunctionName = '1_main';
        yy.presenterContext.state.variablesAndFunctionsUsage['1_main'] = {defined: [], args: [], vars: [], fn: []};
        return programName;
    },

    argument: function bnf_argument (yy, argName) {
        yy.presenterContext.state.variablesAndFunctionsUsage[yy.actualFunctionName].vars.push(argName);

        return [generateExecuteObject('stack.push(actualScope.' + argName + ');', '')];
    },

    for_argument: function bnf_for_argument (yy, argName) {
        yy.presenterContext.state.variablesAndFunctionsUsage[yy.actualFunctionName].vars.push(argName);

        return 'actualScope.' + argName + '.value';
    },

    for_value_header: uidDecorator(function bnf_for_value_header (yy, variableName, from, to, by, comparator) {
        let execElements = [];

        yy.presenterContext.state.variablesAndFunctionsUsage[yy.actualFunctionName].vars.push(variableName);

        yy.labelsStack.push(CODE_GENERATORS.uid + '_for');
        yy.labelsStack.push(CODE_GENERATORS.uid + '_for_end');

        execElements = execElements.concat(from);
        execElements.push(generateExecuteObject("actualScope." + variableName + ' = machineManager.objectMocks.Number.__constructor__(stack.pop().value - ' + by + ');'));
        execElements.push(generateExecuteObject('', CODE_GENERATORS.uid + '_for'));
        execElements.push(generateExecuteObject('machineManager.objectForInstructions.calledInstructions.for++', ''));
        execElements = execElements.concat(to);
        execElements.push(generateJumpInstruction('!((Boolean(actualScope.' + variableName + ' = machineManager.objectMocks.Number.__constructor__(actualScope.' + variableName + '.value + ' + by + ')) || true) && actualScope.' + variableName + ".value " + comparator + " stack.pop().value )", CODE_GENERATORS.uid + '_for_end'));
        return execElements;

    }),

    for_exiter: function bnf_for_exiter (yy) {
        let execElements = [],
            exitLabel = yy.labelsStack.pop(),
            checkerLabel = yy.labelsStack.pop();

        execElements.push(generateJumpInstruction('true', checkerLabel));
        execElements.push(generateExecuteObject('machineManager.objectForInstructions.calledInstructions.for--', exitLabel));
        return execElements;
    },

    /**
     * @param  {Object[]} expression
     * @param  {Object[]} code
     */
    if_instruction: uidDecorator(function bnf_if_instruction (expression, code) {
        let executableCode = [generateExecuteObject('machineManager.objectForInstructions.calledInstructions.if++;')],
            if_end = CODE_GENERATORS.uid + "_end_if";

        executableCode = executableCode.concat(expression);
        executableCode.push(generateJumpInstruction('!Boolean(stack.pop().value);', if_end));
        executableCode = executableCode.concat(code);
        executableCode.push(generateExecuteObject('', if_end));

        return executableCode;
    }),

    /**
     * @param  {Object[]} expression
     * @param  {Object[]} ifCode
     * @param  {Object[]} elseCode
     */
    if_else_instruction: uidDecorator(function bnf_if_else_instruction (expression, ifCode, elseCode) {
        let executableCode = [generateExecuteObject('machineManager.objectForInstructions.calledInstructions.if++;')],
            else_start = CODE_GENERATORS.uid + "_else_if",
            if_end = CODE_GENERATORS.uid + "_end_if";

        executableCode = executableCode.concat(expression);
        executableCode.push(generateJumpInstruction('!Boolean(stack.pop().value);', else_start));
        executableCode = executableCode.concat(ifCode);
        executableCode.push(generateJumpInstruction('true', if_end));
        executableCode.push(generateExecuteObject('', else_start));
        executableCode = executableCode.concat(elseCode);
        executableCode.push(generateExecuteObject('', if_end));

        return executableCode;
    }),

    while_header: uidDecorator(function bnf_while_header (yy, expression) {
        yy.labelsStack.push(CODE_GENERATORS.uid + "_while");
        yy.labelsStack.push(CODE_GENERATORS.uid + "_while_end");

        let execElements = [];

        execElements.push(generateExecuteObject('machineManager.objectForInstructions.calledInstructions.while++', CODE_GENERATORS.uid + "_while"));
        execElements = execElements.concat(expression);
        execElements.push(generateJumpInstruction('!Boolean(stack.pop().value)',  CODE_GENERATORS.uid + "_while_end"));

        return execElements;
    }),

    while_exiter: function bnf_while_exiter (yy) {
        let exitLabel = yy.labelsStack.pop(),
            startWhileLabel = yy.labelsStack.pop(),
            execElements = [];

        execElements.push(generateJumpInstruction('true', startWhileLabel));
        execElements.push(generateExecuteObject('machineManager.objectForInstructions.calledInstructions.while--', exitLabel));

        return execElements;
    },

    return_value: function bnf_return_value (yy, returnCode) {
        let actualFunctionName = yy.functionNames[yy.functionNames.length - 1],
            execCommands = returnCode;

        execCommands.push(generateExecuteObject("retVal = {value: stack.pop()};", ""));
        execCommands.push(generateJumpInstruction('true', "1_" + actualFunctionName));

        return execCommands;
    },

    do_while_header: uidDecorator(function bnf_do_while_header (yy) {
        let execElements = [],
            enterLabel = CODE_GENERATORS.uid + "_do_while_enter";

        execElements.push(generateExecuteObject('machineManager.objectForInstructions.calledInstructions.doWhile++;', enterLabel));
        yy.labelsStack.push(enterLabel);

        return execElements;
    }),

    do_while_exiter: function bnf_do_while_exiter (yy, expression) {
        let execElements = [],
            enterLabel = yy.labelsStack.pop();

        execElements = execElements.concat(expression);
        execElements.push(generateJumpInstruction('Boolean(stack.pop().value)', enterLabel));

        return execElements;
    },

    generateFunctionStart: function presenter_generateFunctionStart (argsList, functionName) {
        let execObjects = [],
            i,
            initialCommand = "";

        // Set start label
        execObjects.push(generateExecuteObject('', functionName));

        initialCommand += "eax = stack.pop();\n";         //Size of args array
        initialCommand += "ebx = Math.abs(eax - " + argsList.length + ");\n";

        initialCommand += "if (eax < " + argsList.length + ") throw machineManager.exceptions.ToFewArgumentsException('" + functionName + "'," + argsList.length + ");\n";

        initialCommand += "stack.push(actualScope);\n";  //Save actualScope on stack
        initialCommand += "actualScope = {};\n";        //Reset scope to default

        // Add to actualScope variables passed in stack, but in stack is actualScope saved! (while function call)
        for (i = argsList.length - 1; i >= 0; i -= 1) {
            initialCommand += "actualScope['" + argsList[Math.abs(i - (argsList.length - 1))] + "'] = stack[stack.length - (2 + " + i + " + ebx)];\n";
        }

        execObjects.push(generateExecuteObject(initialCommand, '')); //Call it as code

        return execObjects;
    },

    generateFunctionEnd: function presenter_generateFunctionEnd (functionName) {
        let execCommands = [],
            exitCommand = "";

        execCommands.push(generateExecuteObject('retVal.value = machineManager.objectMocks.Number.__constructor__(0);', ''));   //If code goes there without return, then add to stack default value

        execCommands.push(generateExecuteObject('', '1_' + functionName));    //Here return will jump. Define as 1_<function_name>.

        exitCommand += "actualScope = {};"; // Clear scope
        exitCommand += "actualScope = stack.pop();"; //Get saved scope

        execCommands.push(generateExecuteObject(exitCommand, ''));

        execCommands.push(generateExecuteObject("actualIndex = functionsCallPositionStack.pop() + 1;", ""));


        return execCommands;
    },

    /**
     * @param stack {Object[]}
     * @param consoleObj {UserConsole}
     * @param objects {Object[]} List of objects from objectMocks
     * @param next {Function}
     * @param pause {Function}
     * @param retVal {{value: Object}}
     * @returns {*|void}
     */
    builtInMethodCall: function presenter_builtInMethodCall (machineManager, stack, consoleObj, objects, next, pause, retVal) {
        let argsCount = stack.pop();
        let methName = stack.pop();
        let obj = stack.pop();
        let args = [consoleObj, objects, next, pause, retVal];

        let method = CODE_GENERATORS.getMethodFromObject(machineManager, obj, methName).jsCode;

        for (let i = 0; i < argsCount; i++) {
            args.push(stack.pop());
        }

        return method.apply(obj, args);
    },

    /**
     * @param  {Object} yy
     * @param  {Object[]} firstVal array with calculations first value
     * @param  {Object[]} secVal array with calculations second value
     * @param  {('__add__'|'__sub__'|'__div__'|'__mul__'|'__div_full__'|'__mod__'|'__ge__'|'__le__'|'__gt__'|'__lt__'|'__neq__'|'__eq__')} operationType
     * @return {Object[]}
     */
    generateOperationCode: function presenter_generateOperationCode (yy, firstVal, secVal, operationType) {
        let execObjects = firstVal.concat(secVal),
            code = "",
            exitCode = "",
            preCode = "";

        code += "ebx = stack.pop();";
        code += "eax = stack.pop();";
        code += "stack.push(ebx);";
        code += "stack.push(eax);";
        code += "stack.push('" + operationType +"');";
        code += "stack.push(1);";
        code += "functionsCallPositionStack.push(actualIndex);";

        exitCode += "stack.push(retVal.value);";

        execObjects.push(generateExecuteObject(code, ""));
        execObjects.push(generateJumpInstruction('true', '1_get_object_call_manager'));
        execObjects.push(generateExecuteObject(exitCode, ''));
        return execObjects;
    },

    /**
     *
     * @param yy
     * @param {Object[]} firstVal
     * @param {Object[]} secVal
     */
    generateOptimizedAndOperationCode: function presenter_generateOptimizedAndOperationCode (yy, firstVal, secVal) {
        let execObjects = firstVal;
        let code = "";
        let exitLabel = getuid() + "_optimized_and_exiter";

        code += "eax = stack.pop();";
        code += "if (!eax.value) stack.push(eax);";

        execObjects.push(generateExecuteObject(code, ''));
        execObjects.push(generateJumpInstruction('!eax.value', exitLabel));

        execObjects = execObjects.concat(secVal);

        execObjects.push(generateExecuteObject('', exitLabel));

        return execObjects;
    },

    /**
     *
     * @param yy
     * @param {Object[]} firstVal
     * @param {Object[]} secVal
     */
    generateOptimizedOrOperationCode: function presenter_generateOptimizedAndOperationCode (yy, firstVal, secVal) {
        let execObjects = firstVal;
        let code = "";
        let exitLabel = getuid() + "_optimized_or_exiter";

        code += "eax = stack.pop();";
        code += "if (eax.value) stack.push(eax);";

        execObjects.push(generateExecuteObject(code, ''));
        execObjects.push(generateJumpInstruction('eax.value', exitLabel));

        execObjects = execObjects.concat(secVal);

        execObjects.push(generateExecuteObject('', exitLabel));

        return execObjects;
    },


    generateMinusOperation: function presenter_generateMinusOperation (execObjects) {
        let retVal = [].concat(execObjects);
        let code = "";
        let exitCode = "";

        code += "stack.push('__minus__');";
        code += "stack.push(0);";
        code += "functionsCallPositionStack.push(actualIndex);";

        exitCode += "stack.push(retVal.value);";

        retVal.push(generateExecuteObject(code, ""));
        retVal.push(generateJumpInstruction('true', '1_get_object_call_manager'));
        retVal.push(generateExecuteObject(exitCode, ''));
        return retVal;
    },

    dispatchFunction: function presenter_dispatchFunction  (yy, functionName, args) {
        let execCode = [],
            clearStackCode = '',
            i;

        for (i = 1; i <= args.length; i += 1) {
            execCode = execCode.concat(args[i - 1]);
            clearStackCode += 'stack.pop();';
        }

        if (yy.presenterContext.configuration.functions.hasOwnProperty(functionName)) {
            execCode = execCode.concat(CODE_GENERATORS.dispatchForBuiltInFunctions(functionName, args));
        } else {
            execCode.push(generateExecuteObject("stack.push(" + args.length + ");", ''));
            execCode.push(generateExecuteObject("functionsCallPositionStack.push(actualIndex);", ""));    //Push actual index of code, function before end will return to that index
            execCode = execCode.concat(CODE_GENERATORS.dispatchUserFunction(functionName));
        }

        execCode.push(generateExecuteObject(clearStackCode, ''));
        execCode.push(generateExecuteObject('stack.push(retVal.value);', ''));
        return execCode;
    },

    dispatchUserFunction: function presenter_dispatchUserFunction (functionName) {
        let execCode = [];

        execCode.push(generateJumpInstruction('true',  functionName));

        return execCode;
    },

    /**
     * Dispatch for build in function (function declared in properties)
     * Returned value is executed in machine scope, so next, pause, retVal are locally variable for each machine (function machineManager.codeExecutor is scope for this code (eval))
     * @param  {String} functionName
     * @param  {Array[]} args contains how to resolve each argument
     */
    dispatchForBuiltInFunctions: function presenter_dispatchForBuiltInFunctions (functionName, args) {
        let parsedArgs = [],
            i,
            code,
            execCode = [];

        // That must be there, because, we don't know how many args receive built in function, so we send all args to this function
        for (i = 1; i <= args.length; i += 1) {
            parsedArgs.unshift("stack[stack.length - " + i + "]");
        }

        if (parsedArgs.length > 0) {
            code = "machineManager.configuration.functions." + functionName + ".call({}, machineManager.objectForInstructions, machineManager.objectMocks, next, pause, retVal," + parsedArgs.join(",") + ");";
        } else {
            code = "machineManager.configuration.functions." + functionName + ".call({}, machineManager.objectForInstructions, machineManager.objectMocks, next, pause, retVal);";
        }

        execCode.push(generateExecuteObject(code, '', true));

        return execCode;
    },

    number_value: function presenter_number_value(yy, yytext) {
        return [generateExecuteObject('stack.push(machineManager.objectMocks.Number.__constructor__.call({}, Number(' + yytext + ')))', '')];
    },

    string_value: function (yy, chars) {
        return [generateExecuteObject('stack.push(machineManager.objectMocks.String.__constructor__.call({},"' +  (chars || '') + '"))', '')];
    }
};
