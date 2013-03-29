/**
 * @module commons
 */
(function (window) {
    /**
     Serialize/Deserialize States functionality for Addons purposes.
     @class Serialization
     */
        // Expose utils to the global object
    window.Serialization = {

        /**
         Serialize state object into string.
         @method serialize
         @public
         @param state {Object} with properties ready to serialize, notice: all properties should be strings and key should be in Camel Case !
         @return {String} serialized string, for example: if state = { 'property_name' : 'property_value' } then string = '[property_name:string:property_value]'
                or undefined if state object is missing
         */
        serialize: function serialize(state) {
            if (!state) {
                return undefined;
            }

            var stateString = "";
            $.each(state, function(key, value){
                var type = typeof value;
                if (type === 'object' && $.isArray(value)) {
                    type = "array";
                    var valueAndType = "";
                    $.each(value, function(i){
                        valueAndType += this + "-" + typeof value[i] + ",";
                    });
                    valueAndType = valueAndType.slice(0, -1);
                    value = valueAndType;
                }
                stateString += "[" + key + ":" + type + ":" + value + "]";
            });
            return stateString;
        },

        /**
         Deserialize string into state object
         @method deserialize
         @param {String} stateString collected from serialize method
         @public
         @return {Object} state which should be exactly the same as param given in serialize method
         */
        deserialize: function deserialize(stateString) {
            if (!stateString) {
                return undefined;
            }

            var state = {};
            var pattern = /[\w]+:[\w-]+:[\w,.\- ]+/g;
            var matchingElements = stateString.match(pattern);
            if (!matchingElements) {
                return undefined;
            }
            for (var i = 0; i < matchingElements.length; i++) {
                var stateElements = matchingElements[i].split(":");
                var key = stateElements[0];
                var type = stateElements[1];
                var value = stateElements[2];
                state[key] = this.convert(value, type);
            }
            return state;
        },


        /**
         Convert value depends on type
         @method convert
         @param {String} value to be converted depends on type
         @private
         @return convertedValue
         */
        convert: function convert(value, type) {
            if(!value || !type) {
                return undefined;
            }

            var convertedValue;
            var UNRECOGNIZED = "This type of value is unrecognized.";
            switch(type) {
                case "string":
                    return convertedValue = value;
                case "number":
                    if (this.isInteger(value)) {
                        return convertedValue = parseInt(value);
                    } else {
                        return convertedValue = parseFloat(value);
                    }
                case "boolean":
                    return convertedValue = !!(value == "true");
                case "array":
                    return this.convertArray(value);
                default:
                    return convertedValue = UNRECOGNIZED;
            }
        },

        /**
         Convert array depends on elements type
         @method convertArray
         @param {String} value to be converted depends on elements type
         @private
         @return {Array} convertedArray
         */

        convertArray: function convertArray(value) {
            var arrayElements = value.split(",");
            var convertedArray = [];
            for (var i = 0; i < arrayElements.length; i++) {
                var valueAndType = arrayElements[i].split("-");
                convertedArray.push(this.convert(valueAndType[0].trim(), valueAndType[1]));
            }
            return convertedArray;
        },

        /**
         Check if value is an Integer
         @method isInteger
         @param {String} value is a number
         @private
         @return {Boolean} true if value is an Integer, otherwise false
         */
        isInteger: function isInteger(value) {
            return value % 1 === 0 && value != null;
        }

    };
})(window);