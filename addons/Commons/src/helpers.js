/**
 * @module commons
 */
(function (window) {
    /**
     Commands dispatching utils.
     @class Helpers
     */
        // Expose utils to the global object
    window.Helpers = {
        /**
         Split lines compatible with MAC, Linux and Windows
         @method splitLines

         @param {String} text with new lines
         @return {Array} Array with elements after split line
         */
        splitLines: function splitLines(text) {

            return text.split(/[\n\r]+/);
        },

        /**
         Alerts error message using {window.alert} method with message properly formatted depending on error type.

         @param {Error} error error object
         @param {String} message custom module message
         */
        alertErrorMessage: function (error, message) {
            var alertMessage = message + '\n\n';

            if (error.name) alertMessage += '[' + error.name + '] ';

            alertMessage += error.message ? error.message : error;

            alert(alertMessage);
        },
		//https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
		uuidv4: function () {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		},
		timer: function IcPlayerTimerHelper(originalFunction) {
        	// performance.now is much more precise, but is isn't supported in IE9
        	var timingMethodObject = performance.now ? performance : Date;
        	function timerFunction() {
                var enterTime = timingMethodObject.now();
                var result = originalFunction();
                var exitTime = timingMethodObject.now();
                var timeInMillis = (exitTime - enterTime);
                console.log("Function " + originalFunction.name + " took " + timeInMillis + " ms");
                return result;
            }

            return timerFunction;
        }
    }
})(window);

/*
	jQuery style method. Source:
	http://stackoverflow.com/questions/2655925/how-to-apply-important-using-css
*/
(function($) {    
	  if ($.fn.style) {
	    return;
	  }

	  // Escape regex chars with \
	  var escape = function(text) {
	    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	  };

	  // For those who need them (< IE 9), add support for CSS functions
	  var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
	  if (!isStyleFuncSupported) {
	    CSSStyleDeclaration.prototype.getPropertyValue = function(a) {
	      return this.getAttribute(a);
	    };
	    CSSStyleDeclaration.prototype.setProperty = function(styleName, value, priority) {
	      this.setAttribute(styleName, value);
	      var priority = typeof priority != 'undefined' ? priority : '';
	      if (priority != '') {
	        // Add priority manually
	        var rule = new RegExp(escape(styleName) + '\\s*:\\s*' + escape(value) +
	            '(\\s*;)?', 'gmi');
	        this.cssText =
	            this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
	      }
	    };
	    CSSStyleDeclaration.prototype.removeProperty = function(a) {
	      return this.removeAttribute(a);
	    };
	    CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName) {
	      var rule = new RegExp(escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?',
	          'gmi');
	      return rule.test(this.cssText) ? 'important' : '';
	    }
	  }

	  // The style function
	  $.fn.style = function(styleName, value, priority) {
	    // DOM node
	    var node = this.get(0);
	    // Ensure we have a DOM node
	    if (typeof node == 'undefined') {
	      return this;
	    }
	    // CSSStyleDeclaration
	    var style = this.get(0).style;
	    // Getter/Setter
	    if (typeof styleName != 'undefined') {
	      if (typeof value != 'undefined') {
	        // Set style property
	        priority = typeof priority != 'undefined' ? priority : '';
	        style.setProperty(styleName, value, priority);
	        return this;
	      } else {
	        // Get style property
	        return style.getPropertyValue(styleName);
	      }
	    } else {
	      // Get CSSStyleDeclaration
	      return style;
	    }
	  };
	})(jQuery);