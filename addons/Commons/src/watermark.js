/**
 * @module commons
 */
(function (window) {
    /**
     Watermark functionality for Addons purposes.
     @class Watermark
     */
    // Expose utils to the global object
    window.Watermark = {
        /**
         @property defaultOptions
         @type {Object}
         Default options used if no options or invalid one are passed to draw() method.
         @param {Number} defaultOptions.size watermark size (width and height)
         @param {Number} defaultOptions.opacity drawing opacity
         @param {String} defaultOptions.color drawing color
         */
        defaultOptions:{
            size:100,
            opacity:1.0,
            color:'#000000'
        },

        /**
         Validates passed options and change them to defaults if they're invalid.
         @method validateOptions

         @private
         @param {Object} options drawing options.
         @param {Number} options.size watermark size (width and height)
         @param {Number} options.opacity drawing opacity
         @param {String} options.color drawing color
         @return {Object} validated options
         */
        validateOptions:function validateOptions(options) {
            if (!options) {
                return $.extend({}, this.defaultOptions);
            }

            var validatedOptions = $.extend({}, options);

            if (!ModelValidationUtils.validatePositiveInteger(options.size).isValid) {
                validatedOptions.size = this.defaultOptions.size;
            }

            if (!ModelValidationUtils.validateFloatInRange(options.opacity, 1.0, 0.0, 2).isValid) {
                validatedOptions.opacity = this.defaultOptions.opacity;
            }

            if (!ModelValidationUtils.validateColor(options.color, this.defaultOptions.color).isValid) {
                validatedOptions.color = this.defaultOptions.color;
            }

            return validatedOptions;
        },

        /**
         Creates canvas inside passed element and draw watermark on it.
         @method draw

         @param {HTMLElement} element wrapper element for watermark
         @param {Object} options drawing options.
         @param {Number} options.size watermark size (width and height)
         @param {Number} options.opacity drawing opacity
         @param {String} options.color drawing color
         */
        draw:function draw(element, options) {
            var $element = $(element);
            var $canvas = $(document.createElement('canvas'));
            $element.html($canvas);

            options = this.validateOptions(options);

            $canvas.attr({
                width:options.size,
                height:options.size
            });

            $canvas.rotateCanvas({
                x:options.size / 2, y:options.size / 2,
                angle:90
            }).drawArc({
                    strokeWidth:1,
                    strokeStyle:options.color,
                    fillStyle:options.color,
                    x:options.size / 2, y:options.size / 2,
                    radius:options.size / 2 - 1,
                    opacity:options.opacity
                }).drawLine({
                    strokeWidth:1,
                    strokeStyle:"#FFF",
                    fillStyle:"#FFF",
                    rounded:true,
                    x1:options.size / 2, y1:0.17 * options.size,
                    x2:options.size - 0.2 * options.size, y2:options.size - 0.33 * options.size,
                    x3:0.2 * options.size, y3:options.size - 0.33 * options.size,
                    x4:options.size / 2, y4:0.17 * options.size,
                    opacity:options.opacity
                });
        }
    };
})(window);