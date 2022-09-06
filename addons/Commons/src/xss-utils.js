/**
 * @module commons
 */

(function (window) {
    /**
     xss utils.
     @class xssUtils
     */
    var xssUtils = {};

    /**
     Sanitize HTML, securing it against potential xss attacks
     @method sanitize

     @param {String} raw html to be sanitized
    */
    xssUtils.sanitize = function xssUtils_sanitize(html) {
        return DOMPurify.sanitize(html);
    };

    window.xssUtils = xssUtils;
})(window);
