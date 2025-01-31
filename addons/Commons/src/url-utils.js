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
     @return {Promise} Promise with parsed text
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
                return parseCustomCSSFileText(playerController, newBaseURL, oldCSSText, useFileServeFormat);
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

    /**
     Prepare image to be used as data for canvas
     @method prepareImageForCanvas

     @param {object} playerController player controller
     @param {Element} imageElement <img> element
     @param {String} url URL for <img> element
     @return {undefined} undefined
    */
    URLUtils.prepareImageForCanvas = function (playerController, imageElement, url) {
        var urlToImage = url;
        if (isURLValidForCrossOriginRequest(playerController, urlToImage)) {
            imageElement.setAttribute("crossorigin", "anonymous");
        } else if (isURLValidForProxyRequest(urlToImage)) {
            var separator = (urlToImage.indexOf("?") === -1) ? "?" : "&";
            urlToImage += separator + "no_gcs=True";
        }
        imageElement.src = urlToImage;
    };

    function isURLValidForCrossOriginRequest(playerController, urlToImage) {
        return !!playerController && playerController.getRequestsConfig().isURLMatchesWhitelist(urlToImage);
    }

    /**
     * Check if URL is valid to use proxy.
     *
     * Resources on mAuthor and mCourser's courses (imported by old importer) can be available by the proxy.
     * This proxy causes that the request is not redirected (available under this same domain) and therefore a resource
     * from another domain is treated as if it were from the same domain. This prevents CORS problems.
     */
    function isURLValidForProxyRequest(urlToImage) {
        return urlToImage.indexOf("/file/serve/") > -1;
    }

    window.URLUtils = URLUtils;
})(window);
