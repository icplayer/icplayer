/**
 * @module commons
 */
(function (window) {
    /**
     MathJax detection and configuration utilities.
     Detects active MathJax version and configuration.
     
     @class MathJaxUtils
     */
    var MathJaxUtils = {};

    var DEFAULT_MATHJAX_SRC = 'javascript/MathJax/MathJax.js';
    
    var MATHJAX_CONFIG_BASE = {
        TeX: {
            imageFont: null,
            extensions: ["mhchem.js", "AMSsymbols.js", "AMSmath.js"]
        },
        extensions: ["tex2jax.js", "mml2jax.js", "forminput.js"],
        skipStartupTypeset: true,
        showProcessingMessages: false,
        playerObject: "player"
    };

    var MATHJAX_HTML_CSS_CONFIG = Object.assign({}, MATHJAX_CONFIG_BASE, {
        jax: ["input/TeX", "input/MathML", "output/HTML-CSS"]
    });

    var MATHJAX_MATHML_CONFIG = Object.assign({}, MATHJAX_CONFIG_BASE, {
        jax: ["input/TeX", "input/MathML", "output/NativeMML", "output/HTML-CSS"]
    });

    var MATHJAX_STYLES = [
        '/*',
        'Ensures results form player\'s getPrintableHTML and getPrintableHTMLWithSeed methods can use "Open Sans" as primary font.',
        'The license and copyright for this font can be found under the relative links relative to where the player is placed:',
        '> Copyright and License: <icplayer>/theme/fonts/Open_Sans/OFL.txt',
        'Or online under followed links:',
        '> Copyright and License: https://fonts.google.com/specimen/Open+Sans/license',
        '*/',
        '@font-face {',
        '    font-family: \'Open Sans\';',
        '    font-style: normal;',
        '    font-weight: 300 800;',
        '    font-stretch: 75% 100%;',
        '    src: url(fonts/Open_Sans/OpenSans-VariableFont_wdth,wght.ttf) format(\'truetype-variations\');',
        '}',
        '@font-face {',
        '    font-family: \'Open Sans\';',
        '    font-style: italic;',
        '    font-weight: 300 800;',
        '    font-stretch: 75% 100%;',
        '    src: url(fonts/Open_Sans/OpenSans-Italic-VariableFont_wdth,wght.ttf) format(\'truetype-variations\');',
        '}',
        '/*',
        'Ensures MathML from MathJax can use "STIX Two Math" as primary font.',
        'The license and copyright for this font can be found under the relative links relative to where the player is placed:',
        '> Licence: <icplayer>/theme/fonts/STIXTwoMath/LICENSE.txt',
        '> Copyright: <icplayer>/theme/fonts/STIXTwoMath/COPYRIGHT.txt',
        'Or online under followed links:',
        '> Copyright and License: https://github.com/stipub/stixfonts/tree/master?tab=OFL-1.1-1-ov-file',
        '*/',
        '@font-face {',
        '	font-family: "STIX Two Math";',
        '	src:',
        '		local("STIX Two Math"),',
        '		url(fonts/STIXTwoMath/STIXTwoMath-Regular.ttf) format(\'ttf\'),',
        '		url(fonts/STIXTwoMath/STIXTwoMath-Regular.woff2) format(\'woff2\'),',
        '		url(fonts/STIXTwoMath/STIXTwoMath-Regular.ttf) format(\'otf\');',
        '}',
        '.ic_player .MathJax_MathML math {',
        '	font-family: "STIX Two Math", math;',
        '}',
        '.ios-mathml mfrac > mi {',
        '	font-size: 0.7em;',
        '}',
        '.ic_text:not(.ios-mathml) mfrac > msup > mfrac {',
        '	math-depth: 1;',
        '}'
    ].join('\n');

    /**
     * Private helper to extract root path from full MathJax.js URL.
     * @private
     */
    function _getMathJaxRoot (sourceUrl) {
        if (!sourceUrl) return '';
        return sourceUrl.substring(0, sourceUrl.lastIndexOf('/'));
    }

    /**
     * Private helper to append Ajax root fix to a config string.
     * @private
     */
    function _appendAjaxRootFix (configStr, rootPath) {
        if (!rootPath) return configStr;
        return configStr + '\nMathJax.Ajax.config.root = "' + rootPath + '";';
    }

    /**
     Converts configuration object to MathJax Config string format.

     @method buildMathJaxConfigString
     @param {Object} configObj - Configuration object
     @return {String} Formatted MathJax configuration string
     @private
     */
    function buildMathJaxConfigString (configObj) {
        var jsonStr = JSON.stringify(configObj, null, 8);
        return 'MathJax.Hub.Config(' + jsonStr + ');';
    }

    /**
     Merges a source configuration into a target configuration object.
     
     @method mergeConfigs
     @param {Object} target - The target configuration object.
     @param {Object} source - The source configuration object.
     @private
     */
    function mergeConfigs (target, source) {
        if (source.TeX) {
            if (source.TeX.imageFont) target.TeX.imageFont = source.TeX.imageFont;
            if (source.TeX.extensions) target.TeX.extensions = source.TeX.extensions.slice();
        }
        if (source.extensions) target.extensions = source.extensions.slice();
        if (source.jax) target.jax = source.jax.slice();
        if (source.skipStartupTypeset !== undefined) target.skipStartupTypeset = source.skipStartupTypeset;
        if (source.showProcessingMessages !== undefined) target.showProcessingMessages = source.showProcessingMessages;
        if (source.playerObject) target.playerObject = source.playerObject;
    }

    /**
     Detects MathJax script source from the document.
     Searches for script tag containing 'MathJax.js'.

     @method detectMathJaxSource
     @return {String} MathJax script src URL, or empty string if not found
     */
    MathJaxUtils.detectMathJaxSource = function (){
        var scriptEl = document.querySelector('script[src*="MathJax.js"]');
        if (!scriptEl) return "";

        var rawSrc = scriptEl.getAttribute('src');
        try {
            var absoluteUrl = new URL(rawSrc, window.location.href).href;
            return absoluteUrl;
        } catch (e) {
            return scriptEl.src;
        }
    };

    /**
     Detects MathJax configuration.
     It first looks for a 'text/x-mathjax-config' script tag.
     If not found, it tries to build a configuration from the 'window.MathJax.Hub.config' object.

     @method detectMathJaxConfig
     @param {Boolean} isMathML - true to get MathML-based config, false for HTML-CSS config
     @return {String} MathJax configuration text, or empty string if not found
     */
    MathJaxUtils.detectMathJaxConfig = function (isMathML) {
        var sourceUrl = MathJaxUtils.detectMathJaxSource();
        var rootPath = _getMathJaxRoot(sourceUrl);

        try {
            var configScripts = document.querySelectorAll('script[type^="text/x-mathjax-config"]');
            if (configScripts && configScripts.length > 0) {
                var textContent = configScripts[0].textContent;
                if (textContent) {
                    return _appendAjaxRootFix(textContent, rootPath);
                }
            }

            if (window.MathJax && window.MathJax.Hub && window.MathJax.Hub.config) {
                var source = window.MathJax.Hub.config;
                var configObj = isMathML
                    ? Object.assign({}, MATHJAX_MATHML_CONFIG)
                    : Object.assign({}, MATHJAX_HTML_CSS_CONFIG);
                
                mergeConfigs(configObj, source);
                
                if (rootPath) {
                    configObj.root = rootPath;
                }

                var configStr = buildMathJaxConfigString(configObj);
                return _appendAjaxRootFix(configStr, rootPath);
            }
        } catch (e) {
            console.warn('MathJaxUtils: error detecting MathJax config:', e);
        }
        return '';
    };

    /**
     Gets default MathJax configuration based on renderer type.

     @method getDefaultMathJaxConfig
     @param {Boolean} isMathML - true to get MathML-based config, false for HTML-CSS config
     @return {String} Default MathJax configuration text (MathML or HTML-CSS based on renderer preference)
     */
    MathJaxUtils.getDefaultMathJaxConfig = function (isMathML) {
        var sourceUrl = MathJaxUtils.detectMathJaxSource();
        var rootPath = _getMathJaxRoot(sourceUrl);

        var configObj = isMathML ? Object.assign({}, MATHJAX_MATHML_CONFIG) : Object.assign({}, MATHJAX_HTML_CSS_CONFIG);

        if (rootPath) {
            configObj.root = rootPath;
        }

        var configStr = buildMathJaxConfigString(configObj);
        return _appendAjaxRootFix(configStr, rootPath);
    };

    /**
     Gets default MathJax script source.

     @method getDefaultMathJaxSource
     @return {String} Default MathJax script source path
     */
    MathJaxUtils.getDefaultMathJaxSource = function () {
        return DEFAULT_MATHJAX_SRC;
    };

    /**
     Gets default MathJax styles for fonts and MathML rendering.

     @method getDefaultMathJaxStyles
     @return {String} CSS styles for MathJax rendering
     */
    MathJaxUtils.getDefaultMathJaxStyles = function () {
        return MATHJAX_STYLES;
    };

    window.MathJaxUtils = MathJaxUtils;
})(window);
