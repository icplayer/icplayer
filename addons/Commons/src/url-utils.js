/**
 * @module commons
 */

(function (window) {
    /**
     URL utils.
     @class URLUtils
     */
    var URLUtils = {};

    /**
     Parse CSS File from given URL and create objectURL with updated links
     @method parseCSSFile

     @param {object} playerController player controller
     @param {String} fileURL CSS file URL
     @return {Promise} Promise with url to new file with parsed content
    */
    URLUtils.parseCSSFile = function URLUtils_parseCSSFile(playerController, fileURL) {
        var newBaseURL;
        var useFileServeFormat = fileURL.includes("/file/serve/");

        return fetch(fileURL, {method: "GET"})
            .then(function(response){
                newBaseURL = getAssetsBaseURLFromCustomCSSFile(response.url, useFileServeFormat);
                return response.text();
            })
            .then(function(oldCSSText){
                var newCSSText = parseCustomCSSFileText(playerController, newBaseURL, oldCSSText, useFileServeFormat);
                return newCSSText;
            });
    };

    function getAssetsBaseURLFromCustomCSSFile(absoluteCustomCSSFileURL, useFileServeFormat) {
        if (useFileServeFormat) {
            return window.location.origin + "/file/serve/";
        }
        var startIndex = absoluteCustomCSSFileURL.search("\/resources\/");
        return absoluteCustomCSSFileURL.substring(0, startIndex) + "/resources/";
    }

    function parseCustomCSSFileText(playerController, baseURL, cssData, useFileServeFormat) {
        var newCssData = cssData;
        var urlRegex = new RegExp('url\\([\'\"]?([^\'\"\)]+)[\'\"]?\\)', 'g');

        var urlMatch;
        while ((urlMatch = urlRegex.exec(newCssData)) !== null) {
            var foundURL = urlMatch[1];

            var idRegex = new RegExp('\\/file\\/serve\\/([\\d]+)', 'g');
            var idMatch = idRegex.exec(foundURL);
            if (idMatch) {
                var assetID = idMatch[1];
                var newURL = getAbsoluteResourcesURL(playerController, baseURL, assetID, useFileServeFormat);
                newURL = playerController.getRequestsConfig().signURL(newURL);
                newCssData = newCssData.replace(foundURL, newURL);
            }
        }
        return newCssData;
    }

    function getAbsoluteResourcesURL(playerController, baseURL, assetID, useFileServeFormat) {
        if (useFileServeFormat) {
            return baseURL + assetID;
        }
        var assets = playerController.getAssets().getAssetsAsJS();
        for (var i = 0; i < assets.length; i++) {
            var asset = assets[i];
            var assetURL = asset.href;
            var positionIndex = assetURL.search(assetID);
            if (positionIndex !== -1) {
                var assetIDWithExtension = assetURL.substring(positionIndex);
                return baseURL + assetIDWithExtension;
            }
        }
        return baseURL + assetID;
    }

    window.URLUtils = URLUtils;
})(window);
