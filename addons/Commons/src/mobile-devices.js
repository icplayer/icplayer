/**
 * @module commons
 */
(function (window) {
    /**
     Commands dispatching utils.
     @class MobileUtils
     */
        // Expose utils to the global object
    window.MobileUtils = {
        /**
         Recognizes if userAgent is mobile device
         @method isMobileUserAgent

         @return {Boolean} True if userAgent is mobile device
         */

        isMobileUserAgent: function(userAgent) {
            if (userAgent === undefined || !userAgent)
                return false;
            var mobile_agent = userAgent.match(/Android/i) ||
                userAgent.match(/BlackBerry/i) ||
                userAgent.match(/iPhone|iPad|iPod/i) ||
                (userAgent.match(/Mac/) && window.navigator.maxTouchPoints && window.navigator.maxTouchPoints > 2) ||
                userAgent.match(/IEMobile/i) ||
                userAgent.match(/Opera Mini/i);
            return !!mobile_agent;
        },

        /**
         Recognizes if userAgent is native mobile Android Web Browser
         @method isAndroidWebBrowser

         @return {Boolean} True if userAgent is native mobile Android Web Browser
         */

        isAndroidWebBrowser: function(userAgent) {
            if (userAgent === undefined || !userAgent)
                return false;

            return userAgent.indexOf('Mozilla/5.0' > -1 &&
                userAgent.indexOf('Android ') > -1 &&
                userAgent.indexOf('AppleWebKit') > -1) &&
                !(userAgent.indexOf('Chrome') > -1);
        },

        /**
         @return {String} substring or empty string
         */

        getAndroidVersion: function(userAgent) {
            if (userAgent === undefined || !userAgent) return "";

            userAgent = userAgent.toString();
            var start = userAgent.indexOf("Android") + "Android".length;

            if (start === -1) return "";

            var end = userAgent.indexOf(";", start);

            return userAgent.substring(start, end).trim();
        },

        /**
         Recognizes if userAgent is Safari mobile device
         @method isSafariMobile

         @return {Boolean} True if userAgent is Safari mobile device
         */

        isSafariMobile: function(userAgent) {
            if (userAgent === undefined || !userAgent)
                return false;
            var mobile_agent = userAgent.match(/iPhone|iPad|iPod/i) ||
                (userAgent.match(/Mac/) && window.navigator.maxTouchPoints && window.navigator.maxTouchPoints > 2);
            return !!mobile_agent;
        },

        /**
         Recognizes if window_navigator is Windows mobile device
         @method isWindowsMobile

         @return {Boolean} True if window_navigator is Windows mobile device
         */

        isWindowsMobile: function(window_navigator) {
            if (window_navigator === undefined || !window_navigator)
                return false;
            if (window_navigator.msPointerEnabled)
                return true;
            return false;
        },

        /**
         Returns the userAgent's version of Android
         @param ua - userAgent (optional)

         @returns {String or Boolean} String containing Android version
            or false if ua is not an Android device
         */
        getAndroidVersion: function(ua) {
            var ua = ua || navigator.userAgent;
            var match = ua.match(/Android\s([0-9\.]*)/);
            return match ? match[1] : false;
        },

        /**
         Recognizes if eventName is supported on current device
         @method isEventSupported

         @return {Boolean} True if eventName is supported on current device
         */

        isEventSupported : function() {
            var cache = {};

            return function(eventName) {
                  var TAGNAMES = {
                  'select'     : 'input',
                  'change'     : 'input',
                  'submit'     : 'form',
                  'reset'      : 'form',
                  'error'      : 'img',
                  'load'       : 'img',
                  'abort'      : 'img',
                  'unload'     : 'win',
                  'resize'     : 'win',
                  'touchstart' : 'button'
                },
                shortEventName = eventName.replace(/^on/, '');
                if(cache[shortEventName]) { return cache[shortEventName]; }
                var elt = TAGNAMES[shortEventName] == 'win'
                          ? window
                          : document.createElement(TAGNAMES[shortEventName] || 'div');
                eventName = 'on'+shortEventName;
                var eventIsSupported = (eventName in elt);
                if (!eventIsSupported) {
                    elt.setAttribute(eventName, 'return;');
                    eventIsSupported = typeof elt[eventName] == 'function';
                    }
                elt = null;
                cache[shortEventName] = eventIsSupported;
                return eventIsSupported;
            };
    }()

    }
})(window);