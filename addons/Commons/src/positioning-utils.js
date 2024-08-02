/**
 * @module commons
 */

(function (window) {
    /**
     Positioning of popups utils.
     @class PositioningUtils
     */
    var PositioningUtils = {
        scale: 1
    };

    PositioningUtils.calculateTopForCentredPopup = function PositioningUtils_calculateTopForCentredPopup(popupHeight) {
        var scale = getElementScale(window.frameElement);
        var offsets = getVisibleViewportOffset();
        // var playerElement = findPlayerElement();
        // var playerElementHeight = playerElement.getBoundingClientRect().height;
        // var visibleViewportHeight = playerElementHeight < window.top.innerHeight/scale ? playerElementHeight : window.top.innerHeight/scale;
        var visibleViewportHeight = window.top.innerHeight/scale;
        var topRelativeToVisibleContent = 0;
        if (offsets.top < 0) {
            visibleViewportHeight += offsets.top;
        } else {
            topRelativeToVisibleContent = offsets.top;
        }
        if (offsets.bottom < 0) {
            visibleViewportHeight += offsets.bottom;
        }
        console.log("Y. scale: " + getElementScale(window.frameElement));
        console.log("Y. popupOffset: " + topRelativeToVisibleContent);
        console.log("Y. visibleViewportHeight: " + visibleViewportHeight);
        console.log("Y. popupHeight: " + popupHeight);
        // var newTop = topRelativeToVisibleContent + playerElement.offsetTop + (visibleViewportHeight - popupHeight)/2;
        var newTop = topRelativeToVisibleContent + (visibleViewportHeight - popupHeight)/2;
        newTop = newTop < 0 ? 0 : newTop;
        return newTop;
    };

    PositioningUtils.calculateLeftForCentredPopup = function PositioningUtils_calculateLeftForCentredPopup(popupWidth) {
        console.log("V10.1")
        var scale = getElementScale(window.frameElement);
        var offsets = getVisibleViewportOffset();
        // var playerElement = findPlayerElement();
        // var playerScale = getElementScale(playerElement);
        // var playerElementWidth = playerElement.getBoundingClientRect().width;
        // console.log("playerElementWidth", playerElementWidth);
        // console.log("window.top.innerWidth", window.top.innerWidth);
        var visibleViewportWidth = window.top.innerWidth/scale;
        // if (playerElementWidth < visibleViewportWidth) {
        //     visibleViewportWidth = playerElementWidth;
        //     leftRelativeToVisibleContent +=
        // }
        // var visibleViewportWidth = window.top.innerWidth/scale;
        console.log("visibleViewportWidth", visibleViewportWidth);
        console.log("offsets", offsets);
        var leftRelativeToVisibleContent = 0;
        if (offsets.left < 0) {
            visibleViewportWidth += offsets.left;
        } else {
            leftRelativeToVisibleContent = offsets.left;
        }
        if (offsets.right < 0) {
            visibleViewportWidth += offsets.right;
        }
        console.log("X. scale: " + getElementScale(window.frameElement));
        console.log("X. newLeft: " + leftRelativeToVisibleContent);
        console.log("X. visibleViewportWidth: " + visibleViewportWidth);
        console.log("X. popupWidth: " + popupWidth);
        // console.log("playerElement.offsetLeft", playerElement.offsetLeft);
        //var newLeft = leftRelativeToVisibleContent + playerElement.offsetLeft + (visibleViewportWidth - popupWidth)/2;
        var newLeft = leftRelativeToVisibleContent + (visibleViewportWidth - popupWidth)/2;
        newLeft = newLeft < 0 ? 0 : newLeft;
        return newLeft;
    };

    function findPlayerElement() {
        return $(window.document.documentElement).find("#_icplayer")[0];
    }

    function getVisibleViewportOffset() {
        var currentWindow = window;
		var parentOffset = {top: currentWindow.pageYOffset, left: currentWindow.pageXOffset, right: 0, bottom: 0};

		while (currentWindow !== currentWindow.parent) {
            var scale = getElementScale(currentWindow.frameElement);
            var frameRect = currentWindow.frameElement.getBoundingClientRect();
            var parentRect = currentWindow.parent.document.documentElement.getBoundingClientRect();
            var iframeTopOffset = Math.round(frameRect.top - parentRect.top);
            var iframeLeftOffset = Math.round(frameRect.left - parentRect.left);
            var iframeBottomOffset = frameRect.bottom - parentRect.height;
            var iframeRightOffset = frameRect.right - parentRect.width;
			parentOffset.top += (currentWindow.parent.pageYOffset - iframeTopOffset)/scale;
            parentOffset.left += (currentWindow.parent.pageXOffset - iframeLeftOffset)/scale;
            parentOffset.bottom += (iframeBottomOffset)/scale;
            parentOffset.right += (iframeRightOffset)/scale;
			currentWindow = currentWindow.parent;
		}

		return parentOffset;
    }

    function getElementScale(element){
        if (!element) {
            return 1;
        }
        return element.getBoundingClientRect().width / element.offsetWidth;
    }

    function getScrollOffset() {
        var currentWindow = window;
		var parentOffset = {top: 0, left: 0};

		while (currentWindow !== currentWindow.parent) {
			var iframeOffset = {top: 0, left: 0};
            var iframes = currentWindow.parent.document.getElementsByTagName("iframe");

			for (var i=0; i < iframes.length; i++) {
				var currentIframe = iframes[i];

				if (currentWindow.location.href === currentIframe.src){
                    var iframePlacementRect = currentIframe.getBoundingClientRect();
                    var bodyPlacementRect = currentWindow.parent.document.body.getBoundingClientRect();

					iframeOffset.top = Math.round(iframePlacementRect.top - bodyPlacementRect.top);
                    iframeOffset.left = Math.round(iframePlacementRect.left - bodyPlacementRect.left);
				}
			}

			parentOffset.top += currentWindow.parent.pageYOffset - iframeOffset.top;
            parentOffset.left += currentWindow.parent.pageXOffset - iframeOffset.left;
			currentWindow = currentWindow.parent;
		}

		parentOffset.top = Math.max(0, parentOffset.top);
        parentOffset.left = Math.max(0, parentOffset.left);
		return parentOffset;
    }

    window.PositioningUtils = PositioningUtils;
})(window);
