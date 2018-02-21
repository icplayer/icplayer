
export class EXCEPTIONS {
    translations = {};

    constructor (translations) {
        this.translations = translations;
    }

    InstructionIsDefinedException(instrName) {
        let defaultTranslation = "The instruction '{0}' has already been defined";
        this.name = "InstructionIsDefinedException";
        this.message = window.StringUtils.format(this.translations[this.name] || defaultTranslation, instrName);

        return this;
    }

    CastErrorException(type, toType) {
        this.name = "CastErrorException";
        this.message = "Cast exception \"" + type + "\" to type: \"" + toType + "\"";

        return this;
    }

    GetErrorException(type, index) {
        this.name = "GetErrorException";
        this.message = "Exception (" + type + "): Value at index " + index + " is not defined";

        return this;
    }

    IndexOutOfBoundsException(type, index, length) {
        this.name = "IndexOutOfBoundsException";
        this.message = "Exception (" + type + "): index " + index + " is out of bounds";

        return this;
    }

    ToFewArgumentsException(functionName, expected) {
        this.name = "ToFewArgumentsException";
        this.message = "To few arguments for function " + functionName + " (expected at least: " + expected + " arguments)";

        return this;
    }

    MethodNotFoundException(instrName) {
        this.name = "MethodNotFoundException";
        this.message = "Undefined method \"" + instrName + "\"";

        return this;
    }

    UndefinedVariableNameException(varName, functionName) {
        this.name = "UndefinedVariableNameException";
        this.message = "Usage of undefined variable '" + varName + "' in function '" + functionName + "'";

        return this;
    }

    UndefinedFunctionNameException(varName, functionName) {
        this.name = "UndefinedFunctionNameException";
        this.message = "Usage of undefined function '" + varName + "' in function '" + functionName + "'";

        return this;
    }

}
