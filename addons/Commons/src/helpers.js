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
        }
    }
})(window);