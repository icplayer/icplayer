/**
 * @module commons
 */
(function (window) {
    /**
     TextParserProxy
     @class TextParserProxy
     */

    /**
     @param {Object} textParser parser from Player Services
     @class TextParserProxy
     @constructor
     */

    window.TextParserProxy = function (textParser) {
        if (textParser == null) return null;

        this.parser = textParser;
    };

    /**
     Parse given text and replace definition \def{word} with links.
     Enhancement for textParser from Player Services

     @method parse
     @param {String} text the string which would be processed
     @return {String} the resulting string
     */
    window.TextParserProxy.prototype.parse = function (text) {
        var responseText = this.parser.parse(text),
            replacement = 'href=\"javascript:void(0)\"';

        return StringUtils.replaceAll(responseText, "href='#'", replacement);
    };

     /**
     parseAltTexts given text and replace definition \alt{visible|readable}[lang langTag] with
      <span aria-label='readable' lang='langTag'><span aria-hidden='true'>visible</span></span>
     [lang langTag] is optional

     @method parse
     @param {String} text the string which would be processed
     @return {String} the resulting string
     */

    window.TextParserProxy.prototype.parseAltTexts = function (text) {
        return this.parser.parseAltTexts(text);
    };

    /**
     Connect all definition links to event bus. Each link will send Definition event.
     Proxy for textParser from Player Services

     @method connectLinks
     @param {String} container the string which would be processed
     @return {String} the resulting string
     */
    window.TextParserProxy.prototype.connectLinks = function (container) {
        return this.parser.connectLinks(container);
    };


    /**
     Parse given text and replace definition of gaps with appropriate html structure.
     Proxy for textParser from Player Services.

     @method parseGaps
     @param {String} container the string which would be processed
     @return {Array} Array wih gaps structure:
                    - {String} parsedText - string with replaced gaps definitions
                    - {Array} gaps - array with gaps structure
                    - {Array} inLineGaps -  array with inline gaps structure
     */
    window.TextParserProxy.prototype.parseGaps = function (text, options) {
        if (typeof options == "undefined") {
            options = {
                isCaseSensitive: false
            };
        }
        return this.parser.parseGaps(text, options);
    };



})(window);
