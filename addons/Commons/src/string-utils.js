/**
 * @module commons
 */
(function (window) {
    /**
     String utils.
     @class StringUtils
     */
    window.StringUtils = {
        /**
         Replace each appearance of given pattern with the given replacement.
         @method replaceAll

         @param {String} text the string to processing
         @param {String} pattern the string which would be removed
         @param {String} replacement the string which would replace found pattern
         @return {String} the resulting string
         */

        replaceAll: function replaceAll(text, pattern, replacement ) {
            var sep = pattern.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"),
                regExp = new RegExp(sep, 'g');
            return text.replace(regExp, replacement);
        },

         /**
         Checks whether string starts with prefix.
         @method startsWith

         @param {String} baseString the string which would be checked
         @param {String} prefix  the string to be matched
         @return {Boolean} true if found matching string otherwise false
         */

        startsWith: function startsWith(baseString, prefix) {
            return (baseString.match("^"+prefix)==prefix);
        },

         /**
         Checks whether string ends with the specified suffix.
         @method endsWith

         @param {String} baseString the string which would be checked
         @param {String} suffix the string to be matched
         @return {Boolean} true if found matching string otherwise false
         */

        endsWith: function endsWith(baseString, suffix) {
            return baseString.indexOf(suffix, baseString.length - suffix.length) !== -1;
        },

        /**
         * Python String function format for javascript
         * Usage -> format("Ala ma {0} i {1}", "kota", "psa") -> "Ala ma kota i psa"
         * @returns {String} String formated with args inserted into {index}
         */
        format: function () {
            /*
             zrodlo: http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
             */
            if (arguments.length == 0) {
                return undefined;
            }

            var str = arguments[0].toString();

            if (arguments.length == 1) {
                return str;
            }

            var key = 0;
            for (var i = 1; i < arguments.length; i++) {
                str = str.replace(RegExp("\\{" + key + "\\}", "gi"), arguments[i]);
                key++;
            }
            return str;
        },

         /**
         Formats time to match the 00:00 format.
         @method timeFormat

         @param {number} seconds time in seconds to be formatted
         @return {String} formatted time
         */
        timeFormat: function (seconds) {
            var minutes = Math.floor(seconds / 60);
            minutes = (minutes >= 10) ? minutes : "0" + minutes;
            seconds = Math.floor(seconds % 60);
            seconds = (seconds >= 10) ? seconds : "0" + seconds;
            return minutes + ":" + seconds;
        },

         /**
         Gets numeric pattern used in regex.
         - in front can be a + or a -
         - there can be one exponent e (or E) in the whole expression
         - after the exponent e (or E) may be a + or -
         - any number of digits and commas/dots in any combination throughout the expression
         @method getNumericPattern

         @return {String} pattern
         */
        getNumericPattern: function getNumericPattern() {
            return "^[+-]?[,.\\d]*([eE][+-]?[,.\\d]*)?$";
        }

    }
})(window);
