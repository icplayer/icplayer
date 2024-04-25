/*!
 * zoom.js 0.3
 * http://lab.hakim.se/zoom-js
 * MIT licensed
 *
 * Copyright (C) 2011-2014 Hakim El Hattab, http://hakim.se
 *
 * Modified by Karol Gebert:
 * - removed pan function and all related functions
 * - added support for zooming elements in iframe
 *
 * Modified by Andrzej Krawczyk:
 * - added destroy function for zoom object
 *
 * Modified by Maciej Zawlocki:
 * - fixed issue with positioning when zooming in an iframe
 *
 * Modified by Michał Sawoniuk:
 * - added option to zoom in on an element other than document.body
 */
zoom = (function(){

    var TRANSITION_DURATION = 800;

    // The current zoom level (scale)
    var level = 1;

    // Timeout for callback function
    var callbackTimeout = -1;

    // Last element what was zoomed
    var lastZoomedElement;

    /**
     * Applies the CSS required to zoom in, prefers the use of CSS3
     * transforms but falls back on zoom for IE.
     *
     * @param {Object} rect
     * @param {Number} scale
     * @param {Object} iframe - optional, to be used when calling the method inside an iframe. Object has two fields:
     *     iframeTopOffset - total offset from the top of the window (usually scrollTop - top)
     *     topWindowHeight - height of the top window
     *     topWindowHeight - width of the top window
     */
    function magnify( rect, scale, iframe) {
        if (!lastZoomedElement) {
            return;
        }
        if (!iframe) {
            iframe = {
                iframeTopOffset: 0,
                topWindowHeight: 0,
                topWindowWidth: 0
            };
        }

        var scrollOffset = getScrollOffset();

        // Ensure a width/height is set
        rect.width = rect.width || 1;
        rect.height = rect.height || 1;

        // If a different top.window height is provided, use that value
        var innerHeight = window.innerHeight;
        if (iframe.topWindowHeight > 0) {
            innerHeight = iframe.topWindowHeight;
        }

        // If a different top.window width is provided, use that value
        var innerWidth = window.innerWidth;
        if (iframe.topWindowWidth > 0) {
            innerWidth = iframe.topWindowWidth;
        }

        // Center the rect within the zoomed viewport
        rect.x -= ( innerWidth - ( rect.width * scale ) ) / 2;
        rect.y -= ( innerHeight - ( rect.height * scale ) ) / 2;

        // Make corrections to positioning when inside an iframe
        rect.y -= iframe.iframeTopOffset * scale;
        scrollOffset.y += iframe.iframeTopOffset;

        if( isSupportsTransforms(lastZoomedElement) ) {
            // Reset
            if( scale === 1 ) {
                lastZoomedElement.style.transform = '';
                lastZoomedElement.style.OTransform = '';
                lastZoomedElement.style.msTransform = '';
                lastZoomedElement.style.MozTransform = '';
                lastZoomedElement.style.WebkitTransform = '';
            }
            // Scale
            else {
                var origin = scrollOffset.x +'px '+ scrollOffset.y +'px',
                    transform = 'translate('+ -rect.x +'px,'+ -rect.y +'px) scale('+ scale +')';

                lastZoomedElement.style.transformOrigin = origin;
                lastZoomedElement.style.OTransformOrigin = origin;
                lastZoomedElement.style.msTransformOrigin = origin;
                lastZoomedElement.style.MozTransformOrigin = origin;
                lastZoomedElement.style.WebkitTransformOrigin = origin;

                lastZoomedElement.style.transform = transform;
                lastZoomedElement.style.OTransform = transform;
                lastZoomedElement.style.msTransform = transform;
                lastZoomedElement.style.MozTransform = transform;
                lastZoomedElement.style.WebkitTransform = transform;
            }
        }
        else {
            // Reset
            if( scale === 1 ) {
                lastZoomedElement.style.position = '';
                lastZoomedElement.style.left = '';
                lastZoomedElement.style.top = '';
                lastZoomedElement.style.width = '';
                lastZoomedElement.style.height = '';
                lastZoomedElement.style.zoom = '';
            }
            // Scale
            else {
                lastZoomedElement.style.position = 'relative';
                lastZoomedElement.style.left = ( - ( scrollOffset.x + rect.x ) / scale ) + 'px';
                lastZoomedElement.style.top = ( - ( scrollOffset.y + rect.y ) / scale ) + 'px';
                lastZoomedElement.style.width = ( scale * 100 ) + '%';
                lastZoomedElement.style.height = ( scale * 100 ) + '%';
                lastZoomedElement.style.zoom = scale;
            }
        }

        level = scale;
    }

    function getScrollOffset() {
        return {
            x: window.scrollX !== undefined ? window.scrollX : window.pageXOffset,
            y: window.scrollY !== undefined ? window.scrollY : window.pageYOffset
        }
    }

    function keyupHandler(event) {
        if( level !== 1 && event.keyCode === 27 ) {
            zoom.out();
        }
    }

    function getElementToBeZoomed(options) {
        return (options && options.elementToZoom) ? options.elementToZoom : document.body;
    }

    function isSupportsTransforms(elementToZoom) {
        return 'WebkitTransform' in elementToZoom.style ||
            'MozTransform' in elementToZoom.style ||
            'msTransform' in elementToZoom.style ||
            'OTransform' in elementToZoom.style ||
            'transform' in elementToZoom.style;
    }

    return {
        /**
         * Zooms in on either a rectangle or HTML element.
         *
         * @param {Object} options
         *
         *   (required)
         *   - element: HTML element to zoom in on
         *   OR
         *   - x/y: coordinates in non-transformed space to zoom in on
         *   - topWindowHeight/topWindowWidth: height and width of non-transformed space that will be zoomed
         *   - width/height: the portion of the screen to zoom in on
         *   - scale: can be used instead of width/height to explicitly set scale
         *
         *   (optional)
         *   - callback: call back when zooming in ends
         *   - padding: spacing around the zoomed in element
         *   - elementToZoom: HTML element to be zoomed. If not provided use document.body
         */
        init: function ( options ) {
            // Zoom out if the user hits escape
            document.addEventListener( 'keyup', keyupHandler);

            var elementToZoom = getElementToBeZoomed(options);

            if( isSupportsTransforms(elementToZoom) ) {
                // The easing that will be applied when we zoom in/out
                elementToZoom.style.transition = 'transform '+ TRANSITION_DURATION +'ms ease';
                elementToZoom.style.OTransition = '-o-transform '+ TRANSITION_DURATION +'ms ease';
                elementToZoom.style.msTransition = '-ms-transform '+ TRANSITION_DURATION +'ms ease';
                elementToZoom.style.MozTransition = '-moz-transform '+ TRANSITION_DURATION +'ms ease';
                elementToZoom.style.WebkitTransition = '-webkit-transform '+ TRANSITION_DURATION +'ms ease';
            }
        },

        destroy: function () {
            document.removeEventListener('keyup', keyupHandler);
        },

        to: function( options ) {

            // Due to an implementation limitation we can't zoom in
            // to another element without zooming out first
            if( level !== 1 ) {
                this.out();
            } else {

                lastZoomedElement = getElementToBeZoomed(options);

                options.x = options.x || 0;
                options.y = options.y || 0;
                options.topWindowHeight = options.topWindowHeight || 0;
                options.topWindowWidth = options.topWindowWidth || 0;
                options.iframeTopOffset = options.iframeTopOffset || 0;

                // If an element is set, that takes precedence
                if( !!options.element ) {
                    // Space around the zoomed in element to leave on screen
                    var padding = typeof options.padding === 'number' ? options.padding : 20;
                    var bounds = options.element.getBoundingClientRect();

                    options.x = bounds.left - padding;
                    options.y = bounds.top - padding;
                    options.width = bounds.width + ( padding * 2 );
                    options.height = bounds.height + ( padding * 2 );
                }

                var innerHeight = window.innerHeight;
                if (options.topWindowHeight > 0) {
                    innerHeight = options.topWindowHeight;
                }
                var innerWidth = window.innerWidth;
                if (options.topWindowWidth > 0) {
                    innerWidth = options.topWindowWidth;
                }

                // If width/height values are set, calculate scale from those values
                if ( options.width !== undefined && options.height !== undefined ) {
                    options.scale = Math.max( Math.min( innerWidth / options.width, innerHeight / options.height ), 1 );
                    if(Math.min( innerWidth / options.width, innerHeight / options.height ) <= 1){
                        options.scale = Math.min( innerWidth / options.width, innerHeight / options.height )+1;
                    }
                }

                if ( options.scale > 1 ) {
                    options.x *= options.scale;
                    options.y *= options.scale;

                    options.x = Math.max( options.x, 0 );
                    options.y = Math.max( options.y, 0 );

                    magnify( options, options.scale, options );

                    if ( typeof options.callback === 'function' ) {
                        callbackTimeout = setTimeout( options.callback, TRANSITION_DURATION );
                    }
                }
            }
        },

        /**
         * Resets the document zoom state to its default.
         */
        out: function() {
            magnify( { x: 0, y: 0 }, 1 );

            level = 1;
        },

        // Alias
        magnify: function( options ) { this.to( options ) },
        reset: function() { this.out() },

        zoomLevel: function() {
            return level;
        }
    }

})();