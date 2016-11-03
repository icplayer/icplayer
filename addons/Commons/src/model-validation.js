/**
 * @module commons
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

     @return {Boolean} parsed value
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

    // Expose utils to the global object
    window.ModelValidationUtils = ModelValidationUtils;
})(window);
