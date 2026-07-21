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
     Parse CSS file from the provided URL, replacing links containing the syntax /file/serve/ so that the resulting
     links use href from the assets set.
     @method parseCSSFile

     @param {object} playerController player controller
     @param {String} fileURL CSS file URL
     @return {Promise} Promise with parsed text
    */
    URLUtils.parseCSSFile = function URLUtils_parseCSSFile(playerController, fileURL) {
        return window.fetch(fileURL, {method: "GET"})
            .then(function(response){
                return response.text();
            })
            .then(function(text){
                return URLUtils.parseCSSFileText(playerController, text);
            });
    };

    /**
     Parse CSS content, replacing links containing the syntax /file/serve/ so that the resulting links use href
     from the assets set.
     @method parseCSSFileText

     @param {object} playerController player controller
     @param {String} cssData content of CSS file
     @return {String} Parsed text
    */
    URLUtils.parseCSSFileText = function URLUtils_parseCSSFileText (playerController, cssData) {
        var baseURL = this.getBaseURL(playerController);
        var newCssData = cssData;
        var urlRegex = new RegExp('url\\([\'\"]?([^\'\"\)]+)[\'\"]?\\)', 'g');

        var urlMatch;
        while ((urlMatch = urlRegex.exec(newCssData)) !== null) {
            var foundURL = urlMatch[1];

            var idRegex = new RegExp('\\/file\\/serve\\/([\\d]+)', 'g');
            var idMatch = idRegex.exec(foundURL);
            if (idMatch) {
                var assetID = idMatch[1];
                var newURL = getAbsoluteResourcesURL(playerController, baseURL, foundURL, assetID);
                if (newURL !== foundURL) {
                    newURL = playerController.getRequestsConfig().signURL(newURL);
                    newCssData = newCssData.replaceAll(foundURL, newURL);
                }
            }
        }
        return newCssData;
    }

    function getAbsoluteResourcesURL(playerController, baseURL, foundURL, assetID) {
        var fileServeAssetSyntax = new RegExp('^\\/file\\/serve\\/[\\d]+', 'g');

        var asset = findAsset(playerController, assetID);
        var urlToCheck = !!asset ? asset.href : foundURL;
        if (fileServeAssetSyntax.test(urlToCheck)) {
            return URLUtils.getOrigin() + urlToCheck;
        }
        return !!asset ? baseURL + asset.href : foundURL;
    }

    function findAsset(playerController, assetID) {
        var assets = playerController.getAssets().getAssetsAsJS();
        return assets.find(function (asset) {
            var assetParts = asset.href.split('/');
            return assetParts[assetParts.length - 1].includes(assetID);
        });
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

    /**
     Get base URL of content.

     At first get `contentBaseURL` form ContextMetadata.
     If `contentBaseURL` not exist in ContextMetadata then return base URL calculated on page's URL.

     @method getBaseURL

     @param {object} playerController player controller
     @return {string | undefined} baseURL or undefined when playerController was not provided
    */
    URLUtils.getBaseURL = function (playerController) {
        if (!playerController) {
            return;
        }
        var contextMetadata = playerController.getContextMetadata();
        var contentBaseURL = !!contextMetadata ? contextMetadata["contentBaseURL"] : undefined;
        if (!!contentBaseURL) {
            return contentBaseURL;
        }
        var pageIndex = playerController.getCurrentPageIndex();
        return playerController.getPresentation().getPage(pageIndex).getBaseURL();
    };

    /**
     Get window.location.origin.
     @method getOrigin

     @return {String} window.location.origin
    */
    URLUtils.getOrigin = function URLUtils_getOrigin () {
        return window.location.origin;
    }

    window.URLUtils = URLUtils;
})(window);
