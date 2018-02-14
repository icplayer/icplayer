export const EXCEPTIONS = {
    InstructionIsDefinedException: function InstructionIsDefinedException(instrName) {
        this.message = "Instruction was defined before: \"" + instrName + "\"";
        this.name = "InstructionIsDefinedException";
    },

    CastErrorException: function CastErrorException(type, toType) {
        this.message = "Cast exception \"" + type + "\" to type: \"" + toType + "\"";
        this.name = "CastErrorException";
    },

    GetErrorException: function GetErrorException(type, index) {
        this.message = "Exception (" + type + "): Value at index " + index + " is not defined";
        this.name = "GetErrorException";
    },

    IndexOutOfBoundsException: function IndexOutOfBoundsException(type, index, length) {
        this.message = "Exception (" + type + "): index " + index + " is out of bounds";
        this.name = "IndexOutOfBoundsException";
    },

    ToFewArgumentsException: function ToFewArgumentsException(functionName, expected) {
        this.name = "ToFewArgumentsException";
        this.message = "To few arguments for function " + functionName + " (expected at least: " + expected + " arguments)";
    },

    MethodNotFoundException: function MethodNotFoundException(instrName) {
        this.message = "Undefined method \"" + instrName + "\"";
        this.name = "MethodNotFoundException";
    },

    UndefinedVariableNameException: function UndefinedVariableNameException(varName, functionName) {
        this.message = "Usage of undefined variable '" + varName + "' in function '" + functionName + "'";
        this.name = "UndefinedVariableNameException";
    },

    UndefinedFunctionNameException: function UndefinedFunctionNameException(varName, functionName) {
        this.message = "Usage of undefined function '" + varName + "' in function '" + functionName + "'";
        this.name = "UndefinedFunctionNameException";
    }

};