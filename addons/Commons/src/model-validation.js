/**
 * @module commons
 * @submodule model-validation
 */
(function (window) {
    /**
     Utils for model validation.
     @class Model Validation Utils
     */
    var ModelValidationUtils = {};
    /**
     Parses passed string to {Boolean} value.
     @method validateBoolean

     @param value string representation of {Boolean} starting with capital letter.

     @return {boolean} parsed value
     */
    ModelValidationUtils.validateBoolean = function validateBoolean(value) {
        return value === 'True';
    };

    /**
     Parses given string to integer number.
     @method validateInteger

     @param value string representation of integer number

     @return {Boolean} isValid - true if passed string parses correctly to integer number, otherwise false
     @return {Number} parsed value, NaN if given string doesn't parse correctly into integer
     */
    ModelValidationUtils.validateInteger = function validateInteger(value) {
        var validationResult = {
            isValid:false,
            value:NaN
        };

        if (ModelValidationUtils.isStringEmpty(value)) {
            return validationResult;
        }

        var parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue)) {
            return validationResult;
        }

        validationResult.isValid = true;
        validationResult.value = parsedValue;

        return validationResult;
    };

    /**
    Parses given string to integer number and validates if it higher than zero.
    @method validatePositiveInteger

    @param value string representation of positive integer number

    @return {Boolean} isValid - true if passed string parses correctly to positive integer value, otherwise false
    @return {Number} parsed value, undefined if given string doesn't parse correctly into positive integer
    */
    ModelValidationUtils.validatePositiveInteger = function validateIntegerInRange(value) {
        var validatedInteger = this.validateInteger(value);

        if (!validatedInteger.isValid) return validatedInteger;

        if (validatedInteger.value < 1) {
            return { isValid:false };
        }

        return validatedInteger;
    };

    /**
     Parses given string to integer number and validates if number is in specified range.
     @method validateIntegerInRange

     @param value string representation of integer number
     @param max {Number} maximum number value
     @param min {Number} (optional) minimum number value, default value is 0

     @return {Boolean} isValid - true if passed string parses correctly to integer number and is in specified range, otherwise false
     @return {Number} parsed value, undefined if given string doesn't parse correctly into integer
     */
    ModelValidationUtils.validateIntegerInRange = function validateIntegerInRange(value, max, min) {
        var validatedInteger = this.validateInteger(value);

        if (!validatedInteger.isValid) return validatedInteger;

        if (!min) min = 0;

        if (validatedInteger.value < min || validatedInteger.value > max) {
            return { isValid:false };
        }

        return validatedInteger;
    };

    /**
     Parses given string to floating point number.
     @method validateFloat

     @param value string representation of integer number
     @param precision {Number} (optional) number of precision digits, default value is 2

     @return {Boolean} isValid - true if passed string parses correctly to floating point number, otherwise false
     @return {Number} parsed value, undefined if given string doesn't parse correctly into float
     */
    ModelValidationUtils.validateFloat = function validateFloat(value, precision) {
        var validationResult = {
            isValid:false,
            value:NaN,
            parsedValue:NaN
        };

        if (ModelValidationUtils.isStringEmpty(value)) return validationResult;

        var parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) return validationResult;

        if (!precision) {
            precision = 2;
        }

        validationResult.isValid = true;
        validationResult.value = parsedValue.toFixed(precision);
        validationResult.parsedValue = parseFloat(validationResult.value);

        return validationResult;
    };

    /**
     Parses given string to floating point number and validates if number is in specified range.
     @method validateFloatInRange

     @param value string representation of integer number
     @param precision {Number} (optional) number of precision digits, default value is 2
     @param max {Number} maximum number value
     @param min {Number} (optional) minimum number value, default value is 0.0

     @return {Boolean} isValid - true if passed string parses correctly to floating point number and is in specified range, otherwise false
     @return {Number} parsed value, undefined if given string doesn't parse correctly into float
     */
    ModelValidationUtils.validateFloatInRange = function validateFloatInRange(value, max, min, precision) {
        if (!precision) {
            precision = 2;
        }


        var validatedFloat = this.validateFloat(value, precision);

        if (!validatedFloat.isValid) {
            return validatedFloat;
        }

        if (!min) min = 0.0;
        min = parseFloat(min.toFixed(precision));
        max = parseFloat(max.toFixed(precision));

        if (validatedFloat.value < min || validatedFloat.value > max) {
            return {
                isValid:false
            };
        }

        return validatedFloat;
    };

    /**
     Validates option selected item (value).
     @method validateOption

     @param option {Object} hash table of option values and corresponding string codes. Keys are properties specified in Editor, values are codes (similar to enums)
     @param value string which is considered as key for 'option' hash table

     @return {String} code assigned to value
     @return {undefined} if DEFAULT field not specified
     */
    ModelValidationUtils.validateOption = function (option, value) {
        for (var key in option) {
            if (Object.prototype.hasOwnProperty.call(option, key)) {
                if (key === value) {
                    return option[key];
                }
            }
        }

        var defaultKey = option['DEFAULT'];
        return option[defaultKey];
    };

    /**
     * Check if the string is valid JS variable name
     * @method validateJSVariableName
     *
     * @param name String with name to validation
     * @returns {Object} dictionary with isValid = true if is valid js variable name or false.
     */
    ModelValidationUtils.validateJSVariableName = function (name) {
        /*
        Variable name is valid JS name
        e.g. : 12SomeName -> null
               SomeName12 -> array
               $someName -> array
         */
        if(name.match(/^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/) === null) {
            return {
                isValid: false
            }
        }
        return {
            isValid: true
        };
    };

    /**
     Validates hex color definition. Proper color starts with '#' character and is 6 characters long.
     @method validateColor

     @param color {String} representation of
     @param defaultColor (optional) default color value, returned if problems with color validation occurs

     @return {Boolean} isValid field determining if passed string is proper form of hex color
     @return {String} parsed color or default value (#FFFFFF) if problem with validation occurs
     */
    ModelValidationUtils.validateColor = function (color, defaultColor) {
        if (!defaultColor) {
            defaultColor = "#FFFFFF";
        }

        if (!color) {
            return {
                isValid: false,
                color: defaultColor
            };
        }

        var regExp = new RegExp("#[0-9a-fA-F]+");
        var colorMatch = color.match(regExp);

        var isColorMatch = !colorMatch || colorMatch === null;
        isColorMatch = isColorMatch || colorMatch.length != 1;
        isColorMatch = isColorMatch || colorMatch[0].length != 7;
        if (isColorMatch) {
            return {
                isValid: false,
                color: defaultColor
            };
        }

        return {
            isValid: true,
            color: color
        };
    };

    /**
     Checks string value in terms of emptiness.
     @method isStringEmpty

     @param value string value

     @return {Boolean} true if passed string is {undefined} or empty, otherwise false
     */
    ModelValidationUtils.isStringEmpty = function (value) {
        return value === undefined || value === "";
    };

    /**
     Checks HTML code string value in terms of emptiness.
     @method isHtmlEmpty

     @param value string value

     @return {Boolean} true if passed html code is invisible for user, otherwise false
     */
    ModelValidationUtils.isHtmlEmpty = function (value) {
        if (value === undefined){
            return true;
        }
        value = String(value);
        if (value.indexOf('<img') > -1){
            return false;
        }
        var tmp = document.createElement("div");
        tmp.innerHTML = value;
        value = tmp.textContent || tmp.innerText;
        if (value === undefined){
            return true
        }
        if (value.trim() === ""){
            return true;
        }
        return false
    };

    /**
     Checks string value in terms of emptiness. Additionally checks if passed value contains only prefix string.
     @method isStringWithPrefixEmpty

     @param value {String} value
     @param prefix {String} prefix

     @return {Boolean} isEmpty true if passed string is {undefined}, empty or contains only prefix, otherwise false
     */
    ModelValidationUtils.isStringWithPrefixEmpty = function (value, prefix) {
        if (ModelValidationUtils.isStringEmpty(value)) {
            return true;
        }

        return value === prefix;
    };

    /**
     Checks array element emptiness.
     @method isArrayElementEmpty

     @param {Object} element array element
     @return {Boolean} true if element contains all empty strings (or undefined) fields, otherwise false
     */
    ModelValidationUtils.isArrayElementEmpty = function (element) {
        if (!element) {
            return true;
        }

        for (var key in element) {
            if (Object.prototype.hasOwnProperty.call(element, key)) {
                if (!ModelValidationUtils.isStringEmpty(element[key])) {
                    return false;
                }
            }
        }

        return true;
    };

    /**
     Checks array emptiness.
     @method isArrayEmpty

     @param array {Array} of object

     @return {Boolean} true if array length is equal 1 and first element is considered empty, otherwise false
     */
    ModelValidationUtils.isArrayEmpty = function (array) {
        if (!array) {
            return true;
        }

        return array.length === 1 && ModelValidationUtils.isArrayElementEmpty(array[0]);
    };

    /**
     Removes duplicates from sorted array of numbers.
     @method removeDuplicatesFromArray

     @param {Array} array sorted array of numbers
     @return {Array} array with removed duplicates
     */
    ModelValidationUtils.removeDuplicatesFromArray = function (array) {
        if (array.length === 0) {
            return [];
        }

        var results = [];

        for (var i = 0; i < array.length - 1; i++) {
            if (array[i + 1] !== array[i]) {
                results.push(array[i]);
            }
        }

        results.push(array[array.length - 1]);

        return results;
    };

    /**
     Returns error object with specific errorCode.
     @method getErrorObject

     @param errorCode string representing errorCode

     @return {Boolean} isValid field with false
     @return {String} errorCode field with received error code
     */
    ModelValidationUtils.getErrorObject = function (errorCode) {
        return {
            isValid: false,
            errorCode: errorCode
        };
    };

    //------------------------------------------ MODEL VALIDATOR -------------------

    function generateErrorCode(code) {
        return {
            isValid: false,
            errorCode: code,
            value: undefined
        };
    }

    function generateValidValue(value) {
        return {
            isValid: true,
            value: value,
            errorCode: ''
        };
    }

    //https://github.com/jashkenas/underscore/blob/master/underscore.js
    function isFunction (fn) {
        if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
          return typeof fn == 'function' || false;
        }

        return Object.prototype.toString.call(fn) === '[object ' + Function + ']';
    }

    //https://github.com/jashkenas/underscore/blob/master/underscore.js
    function isString (val) {
        return Object.prototype.toString.call(val) === '[object String]';
    }

    function isArray (val) {
        function _isArray (val) {
            return Object.prototype.toString.call(val) === '[object Array]';
        }

        var fnToCheck = Array.isArray || _isArray;

        return fnToCheck(val);
    }

    /**
     * Class which can validate model with provided validator.
     * @class ModelValidator
     * @constructor
     */
    function ModelValidator () {
        this.validatedModel = {};
    }

    ModelValidator.prototype = {
        /**
         * Validate model with provided configuration
         *
         *  If validator can't find field then will returns error code: UMF01
         *
         * @method validate
         * @param model {Object}
         * @param config {Function[]}
         * @returns {{isValid: Boolean,value: Object,errorCode: String}}
         */
        validate: function (model, config) {
            return this.validateModel(model, config, true);
        },

        /**
         * Validate sub model elements. Use it if you want to run validation on sub element of model. See list validator
         * @method validateModel
         * @param model {Object}
         * @param config {Function[]}
         * @param mainValidation {boolean} OPTIONAL!. True only if it is root of model validation. At default false.
         * @optional
         * @returns {{isValid: Boolean,value: Object,errorCode: String}}
         */
        validateModel: function (model, config, mainValidation) {
            var validatedModel = {}, modelFieldName;

            if (mainValidation === undefined) {
                mainValidation = false;
            }

            var len = config.length;
            for (var i = 0; i < len; i += 1) {
                modelFieldName = config[i].fieldName;
                if (model[modelFieldName] !== undefined && model[modelFieldName] !== null) {
                    var validationResult = config[i].call(this, model[modelFieldName], validatedModel);
                    var validatedFiledName = validationResult.validatedFieldName;

                    if (!validationResult.isValid) {
                        return validationResult;
                    }

                    if (mainValidation) {
                        this.validatedModel[validatedFiledName] = validationResult.value;
                    }

                    validatedModel[validatedFiledName] = validationResult.value;
                } else {
                    var errorCode = generateErrorCode("UMF01");
                    errorCode.fieldName = [modelFieldName];

                    return errorCode;
                }
            }

            return {
                isValid: true,
                value: validatedModel,
                errorCode: ''
            };
        },

        generateErrorCode: generateErrorCode,
        generateValidValue: generateValidValue,
        __validatorDecorator__: validatorDecorator
    };

    function validatorDecorator(fn) {
        /**
         * Base of validator class. Each validator must be wrapped by validatorDecorator.
         * @namespace ModelValidators
         * @class Validator
         * @constructor
         * @param {String} name name of field to validate
         * @param {Validator[]} config configuration as array
         * @param {Function} shouldValidateFunction function which will tell to validator if he should enter to the validator. If this function returns false, then validator always return undefined value.
         * shouldValidateFunction will receive as first element validated elements in actual validation scope, and in this.validatedModel contains validated elements from root.
         */
        return function(name, config, shouldValidateFunction) {
            if (isFunction(config)) {
                shouldValidateFunction = config;
                config = {};
            }

            if (config === undefined) {
                config = {};
            }

            var validationFunction = function (model, validatedModel) {
                if (config && config.isConfigurationGenerator) {
                    config = config.generate(this, validatedModel);
                }

                if (shouldValidateFunction && !shouldValidateFunction.call(this, validatedModel)) {
                    var undefinedValue =  generateValidValue(undefined);
                    undefinedValue.validatedFieldName = name;

                    return undefinedValue;
                }

                var retVal = fn.call(this, model, config);
                if (!retVal.isValid) {
                    retVal.fieldName = (retVal.fieldName || []);
                    retVal.fieldName = [name].concat(retVal.fieldName);
                }

                retVal.validatedFieldName = name;
                return retVal;
            };

            validationFunction.fieldName = name;

            return validationFunction;
        }
    }

    /**
     * Generate a configuration of a field validation.
     *
     * This function allows to generate config dynamically.
     * This is useful, when for example configuration for one field depends on already validated field.
     * ConfigurationGenerator has a flag, which is checked during field validation and generate function is then called with proper arguments.
     *
     * @constructor
     * @param {Function} generator - function which will generate config. First argument of this function is an object containing already validated properties.
     * Second argument is local validation scope, for example current item when validating list.
     */
    function ConfigurationGenerator (generator) {
        this.isConfigurationGenerator = true;
        this.generator = generator;
    }

    ConfigurationGenerator.prototype.generate = function(validatedModel, localValidatedModel)  {
        return this.generator.call(validatedModel, localValidatedModel);
    };

    /**
     * Container for each model validator.
     * @element ModelValidators
     */
    var ModelValidators = {
        /**
         * Unvalidated integer is trying to parse integer by parseInt instruction.
         * @namespace ModelValidators
         * @class DumbInteger
         * @extends ModelValidators.Validator
         */
        DumbInteger: function (valueToValidate, config) {
            return this.generateValidValue(parseInt(valueToValidate, 10));
        },

        /**
         * Unvalidated integer is trying to parse integer by parseInt instruction.
         * @namespace ModelValidators
         * @class DumpString
         * @extends ModelValidators.Validator
         */
        DumbString: function (valueToValidate, config) {
            return this.generateValidValue(valueToValidate);
        },

        /**
         * Boolean validator
         *
         * Error codes:
         * BL01: Provided value is not a string
         *
         * @namespace ModelValidators
         * @class Boolean
         * @extends ModelValidators.Validator
         */
        Boolean: function (valueToValidate, config) {
            if (!isString(valueToValidate)) {
                return this.generateErrorCode("BL01");
            }

            return this.generateValidValue(valueToValidate === "True");
        },

        /**
         * Check if passed value is valid integer. Can be checked if value is in <minValue; maxValue>
         * config: {
         *      maxValue=INF: {Number}(providedValue > maxValue),
         *      minValue=-INF: [Number}(providedValue < minValue,
         *      default=undefined: {Number | null}
         * }
         *
         * errorCodes:
         * INT01: Provided value is empty
         * INT02: Provided value contains non numerical characters
         * INT03: Provided value is too large
         * INT04: Provided value it too small
         * INT05: Provided value is not a string
         *
         * @namespace ModelValidators
         * @class Integer
         * @extends ModelValidators.Validator
         */
        Integer: function (valueToValidate, config) {
            if (!isString(valueToValidate)) {
                return this.generateErrorCode("INT05");
            }

            var minValue = config['minValue'],
                maxValue = config['maxValue'],
                defaultValue = config['default'],
                isOptional = config['default'] !== undefined;

            if (maxValue === undefined || maxValue === null) {
                maxValue = Number.MAX_VALUE;
            }

            if (minValue === undefined || minValue === null) {
                minValue = Number.MAX_VALUE * -1;
            }

            valueToValidate = valueToValidate.trim();

            if (isOptional && valueToValidate === "") {
                return this.generateValidValue(defaultValue);
            }

            if (valueToValidate === "") {
                return this.generateErrorCode("INT01");
            }

            var isIntegerRegexp = /^[-]?[0-9]+$/;   // -213 -> True, 0340340 -> True, f32r23 -> False, 23423dfdf -> False
            if (!isIntegerRegexp.test(valueToValidate)) {
                return this.generateErrorCode("INT02");
            }

            var value = parseInt(valueToValidate, 10);

            if (value > maxValue) {
                return this.generateErrorCode("INT03");
            }

            if (value < minValue) {
                return this.generateErrorCode("INT04");
            }

            return this.generateValidValue(value);
        },

        /**
         * Check if passed value is valid string.
         * config: {
         *      trim=True: {Boolean},
         *      default=undefined: {String | null}
         * }
         *
         * errorCodes:
         * STR01: Provided value is empty
         * STR02: Provided value is not a string
         *
         * @namespace ModelValidators
         * @class String
         * @extends ModelValidators.Validator
         */
        String: function (valueToValidate, config) {
            if (!isString(valueToValidate)) {
                return this.generateErrorCode("STR02");
            }

            var isOptional = config['default'] !== undefined,
                trim = config['trim'] === undefined ? true : config['trim'],
                defaultValue = config['default'];

            var value = valueToValidate;

            if (trim) {
                value = value.trim();
            }

            if (!isOptional && value === "") {
                return this.generateErrorCode("STR01");
            }

            if (isOptional && value === "") {
                return this.generateValidValue(defaultValue);
            }

            return this.generateValidValue(value);
        },

        /**
         * Check if provided string is valid css class name
         * config: {
         *      default=undefined: {String}
         * }
         *
         * Error Codes:
         * CSS01: Provided css is not valid css
         * CSS02: Provided value is not a string
         *
         * @namespace ModelValidators
         * @class CSSClass
         * @extends ModelValidators.Validator
         */
        CSSClass: function (valueToValidate, config) {
            if (!isString(valueToValidate)) {
                return this.generateErrorCode("CSS02");
            }

            valueToValidate = valueToValidate.trim();

            if (config['default'] !== undefined) {
                if (valueToValidate.trim() === '') {
                    return this.generateValidValue(config['default']);
                }
            }

            //Match HTML class name which can starts with "-"
            var isClassNameRegexp = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/;     // -fsdf32332er -> True, --dfsdfs -> False, __e3d23fd -> True
            var isCorrect = isClassNameRegexp.test(valueToValidate);

            if (!isCorrect) {
                return this.generateErrorCode("CSS01");
            }

            return this.generateValidValue(valueToValidate);
        },

        /**
         * config: Validator[]
         * Validate list. As configuration should receive list of validators for each field in list row.
         *
         * Error codes:
         * ARR01: Provided value is not an array
         *
         * @namespace ModelValidators
         * @class List
         * @extends ModelValidators.Validator
         */
        List: function (valueToValidate, config) {
            if (!isArray(valueToValidate)) {
                return this.generateErrorCode("ARR01");
            }

            var validatedList = [];
            for (var i = 0; i < valueToValidate.length; i++) {
                var validatedValue = this.validateModel(valueToValidate[i], config);
                if (!validatedValue.isValid) {
                    return validatedValue;
                }

                validatedList.push(validatedValue.value);
            }

            return this.generateValidValue(validatedList);
        },

         /**
         * Validate HEX color. It can be represented as hash sign and sequence of 6 numbers.
         *
         * Check if provided string is valid hex color
         * config: {
         *      default=undefined {String}
         *      canBeShort=true {boolean} - can validated color be also represented by 3 numbers
         * }
         *
         * Error Codes:
         * RGB01: Provided type is not a valid type
         * RGB02: Provided value is too long
         * RGB03: Provided value is not a valid hex color
         *
         * @namespace ModelValidators
         * @class HEXColor
         * @extends ModelValidators.Validator
         */
        HEXColor: function (valueToValidate, config) {
            if (!isString(valueToValidate)) {
                return this.generateErrorCode("RGB01");
            }

            var canBeShort = config['canBeShort'] === true;
            var defaultValue = config['default'];
            var regexp = /^$/;

            if (valueToValidate.length > 7) {
                return this.generateErrorCode("RGB02");
            }

            if (defaultValue !== undefined && valueToValidate === "") {
                return this.generateValidValue(defaultValue);
            }

            if (canBeShort) {
                // either #xxx or #xxxxxx
                regexp = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/;
            } else {
                // only #xxxxxx
                regexp = /^#[0-9a-fA-F]{6}$/;
            }

            var isCorrect = regexp.test(valueToValidate);

            if (isCorrect) {
                return this.generateValidValue(valueToValidate);
            } else {
                return this.generateErrorCode("RGB03");
            }
        },

        /**
         * Validate possible value in enum.
         *
         * Check if provided string is valid css class name
         * config: {
         *      default=undefined {String | null}
         *      useLowerCase=False: {Boolean} change values to lower case
         *      values=[]:{String[]}
         * }
         *
         * Error Codes:
         * EV01: Provided type is not a valid type
         * EV02: Provided value is not a string
         *
         * @namespace ModelValidators
         * @class Enum
         * @extends ModelValidators.Validator
         */
        Enum: function (valueToValidate, config) {
            if (!isString(valueToValidate)) {
                return this.generateErrorCode("EV02");
            }

            var possibleValues = config.values || [];
            var useLowerCase = config.useLowerCase || false;
            var defaultValue = config['default'];

            valueToValidate = valueToValidate.trim();

            if (useLowerCase) {
                valueToValidate = valueToValidate.toLowerCase();
            }

            if (defaultValue !== undefined && valueToValidate === "") {
                return this.generateValidValue(defaultValue);
            }

            for (var i = 0; i < possibleValues.length; i++) {
                if (possibleValues[i].trim() === valueToValidate) {
                    return this.generateValidValue(valueToValidate);
                }
            }

            return this.generateErrorCode("EV01");
        },

        /**
         * Validate possible value in static list.
         *
         * config: {
         *      <fieldName>: Validator[]
         * }
         *
         * Error Codes:
         * SL01: Provided field doesnt exists
         *
         * @namespace ModelValidators
         * @class StaticList
         * @extends ModelValidators.Validator
         */
        StaticList: function (valueToValidate, config) {
            var validatedList = {};

            for (var fieldName in config) {
                if (config.hasOwnProperty(fieldName)) {
                    if (valueToValidate[fieldName] === undefined) {
                        return this.generateErrorCode("SL01");
                    }

                    var validatedValue = this.validateModel(valueToValidate[fieldName], config[fieldName]);
                    if (!validatedValue.isValid) {
                        return validatedValue;
                    }

                    validatedList[fieldName] = validatedValue.value;
                }
            }

            return this.generateValidValue(validatedList);
        },

        utils: {
            /**
             * Rename provided field to another name
             * @param {String} name old field name
             * @param {String} newName
             * @param {Function} next
             */
            FieldRename: function (name, newName, next) {
                if (!isString(name)) {
                    throw new Error("First argument must be a string");
                }

                if (!isString(newName)) {
                    throw new Error("New name must be a string");
                }

                if (!isFunction(next)) {
                    throw new Error("Next must be a function");
                }

                var validationFunction = function (model, validatedModel) {
                    var retVal = next.call(this, model, validatedModel);
                    retVal.validatedFieldName = newName;

                    return retVal;
                };

                validationFunction.fieldName = name;
                return validationFunction;
            },

            /**
             * Change returned value of Enum to the one specified in config
             * @param {String} name of property
             * @param {Object} config - object which contains map of enum values
             *      {
             *          value[]: String
             *      }
             * @param {Function} next
             */
            EnumChangeValues: function (name, config, next) {
                if (!isFunction(next)) {
                    throw new Error("Next must be a function");
                }

                if (!isString(name)) {
                    throw new Error("First argument must be a string");
                }

                var changeFunction = function (model, validatedModel) {
                    var retValue = next.call(this, model, validatedModel);

                    if (retValue.isValid &&
                        config.hasOwnProperty(retValue.value) &&
                        config[retValue.value]
                    ) {
                        retValue.value = config[retValue.value];
                    }

                    return retValue;
                };

                changeFunction.fieldName = name;
                return changeFunction;
            },

            FieldConfigGenerator: ConfigurationGenerator
        }
    };

    var decoratedValidators = {};

    for (var validatorName in ModelValidators) {
        if (isFunction(ModelValidators[validatorName])) {
            decoratedValidators[validatorName] = validatorDecorator(ModelValidators[validatorName]);
        } else {
            decoratedValidators[validatorName] = ModelValidators[validatorName];
        }
    }

    // Expose utils to the global object
    window.ModelValidationUtils = ModelValidationUtils;

    window.ModelValidator = ModelValidator;
    window.ModelValidators = decoratedValidators;
})(window);
