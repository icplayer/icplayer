/**
 * @module commons
 */
(function (window) {
    /**
     Commands dispatching utils.
     @class Helpers
     */
        // Expose utils to the global object
    window.Helpers = {
        /**
         Split lines compatible with MAC, Linux and Windows
         @method splitLines

         @param {String} text with new lines
         @return {Array} Array with elements after split line
         */
        splitLines: function splitLines(text) {

            return text.split(/[\n\r]+/);
        },

        /**
         Alerts error message using {window.alert} method with message properly formatted depending on error type.

         @param {Error} error error object
         @param {String} message custom module message
         */
        alertErrorMessage: function (error, message) {
            var alertMessage = message + '\n\n';

            if (error.name) alertMessage += '[' + error.name + '] ';

            alertMessage += error.message ? error.message : error;

            alert(alertMessage);
        }
    }
})(window);