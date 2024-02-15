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

     allow specific protocols handlers in URL attributes via regex (default is false, be careful, XSS risk)
     by default only http, https, ftp, ftps, tel, mailto, callto, sms, cid and xmpp are allowed.
     Default RegExp: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;
     Source: https://github.com/cure53/DOMPurify

     RegExp was extended to allow:
     * prefix "file" - for macOS and Windows
     * prefix "capacitor" - for IOS

     Android does not need an extended version, as it starts its URL with https.

     @method sanitize

     @param {String} html - raw HTML to be sanitized
    */
    xssUtils.sanitize = function xssUtils_sanitize(html) {
        return DOMPurify.sanitize(html, {ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|file|capacitor):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i});
    };

    window.xssUtils = xssUtils;
})(window);
