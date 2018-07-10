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

export function validateFunction (functionToValidate) {
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
}

export function validateFunctions (functions) {
    let validatedFunctions = {},
        i,
        validatedFunction;

    for (i = 0; i < functions.length; i += 1) {
        if (functions[i].name.trim().length === 0) {
            continue;
        }

        validatedFunction = validateFunction(functions[i]);
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
}

export function validateAliases (aliases) {
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
}

function validateParameters (params) {
    let parameters = [],
        i;
    for (i = 0; i < params.length; i += 1) {
        parameters.push(params[i].value);
    }

    return {
        isValid: true,
        value: parameters
    };
}

export function validateAnswer (model) {
    let runUserCode = ModelValidationUtils.validateBoolean(model.runUserCode),
        answerCode = model.answerCode,
        maxTimeForAnswer = ModelValidationUtils.validateFloatInRange(model.maxTimeForAnswer, 10, 0),
        validatedParameters,
        answerCodeFunction;

    if (runUserCode && (!maxTimeForAnswer.isValid || maxTimeForAnswer.parsedValue === 0)) {
        return generateValidationError("IP01");
    }

    validatedParameters = validateParameters(model.runParameters);

    try {
        answerCodeFunction = new Function(answerCode);
    }
    catch (e) {
        return generateValidationError("IP02");
    }

    return {
        isValid: true,
        runUserCode: runUserCode,
        answerCode: answerCodeFunction,
        maxTimeForAnswer: maxTimeForAnswer,
        parameters: validatedParameters.value
    };


}

function validateUniquenessAliasesNamesAndFunctions (aliases, functions) {
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
}

/**
 * @param {{objectName: (Array|Number|String), methodName: String, methodBody: String}} method
 */
export function validateMethod (method) {
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
}

/**
 * @param {{objectName: (Array|Number|String), methodName: String, methodBody: String}[]} methods
 */
function validateMethods (methods) {
    let validatedMethods = [];

    methods.forEach(function (method) {
        let validatedMethod = validateMethod(method);

        if (!validatedMethod.isValid) {
            return validatedMethod;
        }

        validatedMethods.push(validatedMethod.method);
    });

    return {
        isValid: true,
        methods: validatedMethods
    }
}

function validateRound (model) {
    let round = model['mathRound'];

    if (round.trim() === '') {
        return {
            isValid: true,
            value: 20
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

    if (parsedRound > 20) {
        return {
            isValid: false,
            errorCode: "ER03"
        };
    }

    return {
        isValid: true,
        value: parsedRound
    };
}

function validateConsoleAvailableInput(model) {
    let consoleAvailableInput = model.consoleAvailableInput;

    if (consoleAvailableInput === "") {
        consoleAvailableInput = "All";
    }

    return {
        isValid: true,
        value: consoleAvailableInput
    };
}

/**
 *
 * @param {{translation: String}} translation
 */
function validateExceptionTranslation (translation) {
    if (translation.translation.trim() === "" ) {
        return {
            isValid: true,
            value: null
        };
    }

    return {
        isValid: true,
        value: translation.translation.trim()
    };
}

function validateExceptionsTranslation(model) {
    let translations = model.exceptionsTranslation;
    let validatedTranslations = {};

    for (let exceptionName in translations) {
        if (translations.hasOwnProperty(exceptionName)) {
            let validatedTranslation = validateExceptionTranslation(translations[exceptionName]);
            if (!validatedTranslation.isValid) {
                return validatedTranslation;
            }

            validatedTranslations[exceptionName] = validatedTranslation.value;
        }
    }

    return {
        isValid: true,
        value: validatedTranslations
    };
}

export function validateModel (model, aliases) {
    let validatedAliases,
        validatedFunctions,
        validatedAnswer,
        isUniqueInAliasesAndFunctions,
        validatedMethods;

    validatedAliases = validateAliases(model.default_aliases);
    if (!validatedAliases.isValid) {
        return validatedAliases;
    }

    validatedFunctions = validateFunctions(model.functionsList);
    if (!validatedFunctions.isValid) {
        return validatedFunctions;
    }

    if (validatedAliases.isValid && validatedFunctions.isValid) {
        isUniqueInAliasesAndFunctions = validateUniquenessAliasesNamesAndFunctions(validatedAliases.value, validatedFunctions.value);
        if (!isUniqueInAliasesAndFunctions.isValid) {
            return isUniqueInAliasesAndFunctions;
        }
    }

    validatedAnswer = validateAnswer(model);
    if (!validatedAnswer.isValid) {
        return validatedAnswer;
    }

    validatedMethods = validateMethods(model.methodsList);
    if (!validatedMethods.isValid) {
        return validatedMethods;
    }

    let validatedRound = validateRound(model);
    if (!validatedRound.isValid) {
        return validatedRound;
    }

    let validatedAvailableConsoleInput = validateConsoleAvailableInput(model);
    if (!validatedAvailableConsoleInput.isValid) {
        return validatedAvailableConsoleInput;
    }

    let validatedExceptionsTranslation = validateExceptionsTranslation(model);
    if (!validatedExceptionsTranslation.isValid) {
        return validatedExceptionsTranslation;
    }

    return {
        isValid: true,
        addonID: model.ID,
        isActivity: !ModelValidationUtils.validateBoolean(model.isNotActivity),
        isVisibleByDefault: ModelValidationUtils.validateBoolean(model['Is Visible']),
        functions: validatedFunctions.value,
        aliases: $.extend(aliases, validatedAliases.value),
        answer: validatedAnswer,
        methods: validatedMethods.methods,
        round: validatedRound.value,
        availableConsoleInput: validatedAvailableConsoleInput.value,
        exceptionTranslations: validatedExceptionsTranslation.value
    };
}