
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
        let defaultTranslation = "Cast exception '{0}' to type: '{1}'";
        this.name = "CastErrorException";
        this.message = window.StringUtils.format(this.translations[this.name] || defaultTranslation, type, toType);
        return this;
    }

    IndexOutOfBoundsException(type, index, length) {
        let defaultTranslation = "Exception ({0}): index {1} is out of bounds";
        this.name = "IndexOutOfBoundsException";
        this.message = window.StringUtils.format(this.translations[this.name] || defaultTranslation, type, index);

        return this;
    }

    ToFewArgumentsException(functionName, expected) {
        let defaultTranslation = "To few arguments for function '{0}' (expected at least: {1} arguments)";
        this.name = "ToFewArgumentsException";
        this.message = window.StringUtils.format(this.translations[this.name] || defaultTranslation, functionName, expected);

        return this;
    }

    MethodNotFoundException(instrName) {
        let defaultTranslation = "Undefined method '{0}'";
        this.name = "MethodNotFoundException";
        this.message = window.StringUtils.format(this.translations[this.name] || defaultTranslation, instrName);

        return this;
    }

    UndefinedVariableNameException(varName, functionName) {
        let defaultTranslation = "Usage of undefined variable '{0}' in function '{1}'";
        this.name = "UndefinedVariableNameException";
        this.message = window.StringUtils.format(this.translations[this.name] || defaultTranslation, varName, functionName);

        return this;
    }

    UndefinedFunctionNameException(varName, functionName) {
        let defaultTranslation = "Usage of undefined function '{0}' in function '{1}'";
        this.name = "UndefinedFunctionNameException";
        this.message = window.StringUtils.format(this.translations[this.name] || defaultTranslation, varName, functionName);

        return this;
    }

}
