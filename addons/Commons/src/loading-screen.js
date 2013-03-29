/**
 * @module commons
 */
(function (window) {
    /**
     Loading screen functionality for Addons purposes.
     @class Loading Screen
     */
    // Expose utils to the global object
    window.LoadingScreen = {
        /**
         Collection of created loading screens.
         @property screens
         @private
         @type {Array}
         */
        screens: [],
        /**
         Creates new instance of loading screen.
         @method create
         @public
         @param element {HTMLElement} loading screen container element
         @return {String} loading screen id or {undefined} if wrapper element is undefined
         */
        create: function create(element) {
            if (!element) {
                return undefined;
            }

            var $element = $(element);
            var containerWidth = $element.width();
            var containerHeight = $element.height();
            var id = Math.floor((Math.random() * 1000)) + '-' + Math.floor((Math.random() * 1000));

            var $loadingScreen = $(document.createElement('img'));
            $loadingScreen.attr({
                src: 'http://www.lorepo.com/media/images/loading.gif',
                alt: 'Loading...',
                id: id,
                position: 'absolute',
                display: 'none',
                border: 0,
                padding: 0,
                margin: 0
            });
            $element.append($loadingScreen);
            $loadingScreen.show();
            $loadingScreen.css({
                top: ((containerHeight - $loadingScreen.height()) / 2) + 'px',
                left: ((containerWidth - $loadingScreen.width()) / 2) + 'px'
            }).hide();

            this.screens.push({
                id: id,
                $element: $loadingScreen,
                counter: 0
            });

            return id;
        },

        /**
         Gets information about loading screen with given id..
         @method getScreen
         @param {Number} id loading screen id
         @private
         @type {Function}
         @return {Number} index of screen information in screens array if screen with given id exists, otherwise -1
         */
        getScreen: function getScreen(id) {
            for (var i = 0, length = this.screens.length; i < length; i++) {
                if (this.screens[i].id === id) {
                    return i;
                }
            }

            return -1;
        },

        /**
         Highers loading screen counter and shows it.
         @public
         @method show
         @param id {String} id of loading screen to be shown
         */
        show: function show(id) {
            var screenNumber = this.getScreen(id);
            if (screenNumber !== -1) {
                this.screens[screenNumber].counter++;
                this.screens[screenNumber].$element.show();
            }
        },

        /**
         Lowers loading screen counter and hides it if counter goes down to 0.
         @public
         @method hide
         @param id {String} id of loading screen to be hidden
         */
        hide: function hide(id) {
            var screenNumber = this.getScreen(id);
            if (screenNumber !== -1) {
                if (this.screens[screenNumber].counter > 0) {
                    this.screens[screenNumber].counter--;
                }

                if (this.screens[screenNumber].counter === 0) {
                    this.screens[screenNumber].$element.hide();
                }
            }
        }
    };
})(window);