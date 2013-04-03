/**
 * @module commons
 */
(function (window) {
    /**
    Utils for DOM objects manipulations.
    @class DOM Operations Utils
    */
    // Expose utils to the global object
    window.DOMOperationsUtils = {
        /**
         Gets element outer dimensions: border widths, padding's and margins.
         @method getOuterDimensions

         @param {HTMLElement} element element reference
         @return {Object} numerical version of elements dimensions
         */
        getOuterDimensions: function getElementOuterDimensions(element) {
            var $element = $(element);

            return {
                border: {
                    top: parseInt($element.css('border-top-width'), 10),
                    bottom: parseInt($element.css('border-bottom-width'), 10),
                    left: parseInt($element.css('border-left-width'), 10),
                    right: parseInt($element.css('border-right-width'), 10)
                },
                margin: {
                    top: parseInt($element.css('margin-top'), 10),
                    bottom: parseInt($element.css('margin-bottom'), 10),
                    left: parseInt($element.css('margin-left'), 10),
                    right: parseInt($element.css('margin-right'), 10)
                },
                padding: {
                    top: parseInt($element.css('padding-top'), 10),
                    bottom: parseInt($element.css('padding-bottom'), 10),
                    left: parseInt($element.css('padding-left'), 10),
                    right: parseInt($element.css('padding-right'), 10)
                }
            };
        },

        /**
         Calculates element outer distances (summed border widths, padding's and margins).
         @method calculateOuterDistances

         @param {Object} dimensions element dimensions (obtained via DOMOperationsUtils.getOuterDimensions method)
         @return {Object} calculated horizontal and vertical distances
         */
        calculateOuterDistances: function (dimensions) {
            var vertical = dimensions.border.top + dimensions.border.bottom;
            vertical += dimensions.margin.top + dimensions.margin.bottom;
            vertical += dimensions.padding.top + dimensions.padding.bottom;

            var horizontal = dimensions.border.left + dimensions.border.right;
            horizontal += dimensions.margin.left + dimensions.margin.right;
            horizontal += dimensions.padding.left + dimensions.padding.right;

            return {
                vertical : vertical,
                horizontal : horizontal
            };
        },

        /**
        Calculates element new width and height with taking into account outer distances and wrapper width and height.
        @method calculateReducedSize

        @param {HTMLElement} wrapper elements wrapper
        @param {HTMLElement} element element reference
        @return {Object} calculated width and height
        */
        calculateReducedSize: function calculateReducedSize(wrapper, element) {
            var dimensions = DOMOperationsUtils.getOuterDimensions(element);
            var distances = DOMOperationsUtils.calculateOuterDistances(dimensions);

            return {
                width: $(wrapper).width() - distances.horizontal,
                height: $(wrapper).height() - distances.vertical
            };
        },

        /**
         Sets element new width and height with taking into account outer distances and wrapper width and height.
         @method setReducedSize

         @param {HTMLElement} wrapper elements wrapper
         @param {HTMLElement} element element reference
         @return {Object} calculated width and height
         */
        setReducedSize: function setReducedSize(wrapper, element) {
            var reducedSize = DOMOperationsUtils.calculateReducedSize(wrapper, element);

            $(element).css({
                width: reducedSize.width + 'px',
                height: reducedSize.height + 'px'
            });

            return reducedSize;
        },

        /**
         Display error message inside provided message
         @method showErrorMessage
         @param {HTMLElement} element container for error message
         @param {Object} errorCodes association array of error codes and corresponding messages
         @param {String} code error code
         */
        showErrorMessage: function showErrorMessage(element, errorCodes, code) {
            $(element).html(errorCodes[code]);
        },

        /**
         @method getResourceFullPath
         @param {Object} controller PlayerController instance
         @param {String} resource relative path to the resource
         @return {String} resource full path (or {undefined} if either controller or resource are not defined
         */
        getResourceFullPath: function getResourceFullPath(controller, resource) {
            if (!controller || !resource) { //noinspection JSValidateTypes
                return undefined;
            }

            return controller.getStaticFilesPath() +resource;
        }
    };
})(window);