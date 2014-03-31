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
    window.TextParserProxy.prototype.parseGaps = function (text) {
        return this.parser.parseGaps(text);
    };



})(window);
