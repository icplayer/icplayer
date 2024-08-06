/**
 * @module commons
 */

(function (window) {
    /**
     Positioning of popups utils.
     @class PositioningUtils
     */
    var PositioningUtils = {};

    PositioningUtils.calculateTopForPopupCentredToVisiblePlayerArea = function PositioningUtils_calculateTopForPopupCentredToVisiblePlayerArea(popupHeight) {
        var newTopAndHeight = getVisiblePlayerIframeHeightAndTop();
        var newHeight = newTopAndHeight.height;
        var newTop = newTopAndHeight.top;

        var playerElement = findPlayerElement();
        if (playerElement) {
            var playerElementBoundingClientRect = playerElement.getBoundingClientRect();
            var playerScale = getElementScale(playerElement);
            console.log("Y. playerElementBoundingClientRect.height: " + playerElementBoundingClientRect.height);
            console.log("Y. playerElement.clientHeight: " + playerElement.clientHeight);
            console.log("Y. newHeight: " + newHeight);
            console.log("Y. playerElementBoundingClientRect.top: " + playerElementBoundingClientRect.top);
            if (playerElementBoundingClientRect.height < newHeight) {
                console.log("playerElement.clientHeight < newHeight");
                newHeight = playerElementBoundingClientRect.height;
                newTop += playerElementBoundingClientRect.top;
            } else if (playerElementBoundingClientRect.top > 0) {
                console.log("playerElement.clientHeight >= newHeight && playerElementBoundingClientRect.top > 0");
                newHeight -= playerElementBoundingClientRect.top;
                newTop += playerElementBoundingClientRect.top;
            }
        }

        if (newHeight > popupHeight) {
            newTop += (newHeight - popupHeight)/2;
        }
        newTop = Math.max(0, newTop);
        console.log("Y. scale: " + getElementScale(window.frameElement));
        console.log("Y. playerScale: " + getElementScale(playerElement));
        console.log("Y. newTopAndHeight.height: " + newTopAndHeight.height);
        console.log("Y. newTopAndHeight.top: " + newTopAndHeight.top);
        console.log("Y. newHeight: " + newHeight);
        console.log("Y. popupHeight: " + popupHeight);
        console.log("Y. newTop: " + newTop);
        return newTop;
    };

    function getVisiblePlayerIframeHeightAndTop() {
        var scale = getElementScale(window.frameElement);
        var offsets = getRelativeOffset();
        var visibleViewportHeight = window.top.innerHeight/scale;
        var topRelativeToVisibleContent = 0;
        if (offsets.top < 0) {
            visibleViewportHeight += offsets.top;
        } else {
            topRelativeToVisibleContent = offsets.top;
        }
        visibleViewportHeight += Math.min(0, offsets.bottom);
        visibleViewportHeight = Math.min(visibleViewportHeight, window.innerHeight);
        return {height: visibleViewportHeight, top: topRelativeToVisibleContent};
    }

    PositioningUtils.calculateLeftForPopupCentredToVisiblePlayerArea = function PositioningUtils_calculateLeftForPopupCentredToVisiblePlayerArea(popupWidth) {
        var newWidthAndLeft = getVisiblePlayerIframeWidthAndLeft();
        var newWidth = newWidthAndLeft.width;
        var newLeft = newWidthAndLeft.left;
        var playerElement = findPlayerElement();
        if (playerElement) {
            var playerElementBoundingClientRect = playerElement.getBoundingClientRect();
            var playerScale = getElementScale(playerElement);
            console.log("X. playerElementBondingClientRect.width: " + playerElementBoundingClientRect.width);
            console.log("X. playerElement.clientWidth: " + playerElement.clientWidth);
            console.log("X. newWidth: " + newWidth);
            console.log("X. playerElementBondingClientRect.left: " + playerElementBoundingClientRect.left);
            if (playerElementBoundingClientRect.width < newWidth) {
                console.log("playerElement.clientWidth < newWidth");
                newWidth = playerElementBoundingClientRect.width;
                newLeft += playerElementBoundingClientRect.left;
            } else if (playerElementBoundingClientRect.left > 0) {
                console.log("playerElement.clientWidth >= newWidth && playerElementBoundingClientRect.left > 0");
                newWidth -= playerElementBoundingClientRect.left;
                newLeft += playerElementBoundingClientRect.left;
            }
        }

        newLeft += (newWidth - popupWidth)/2;
        newLeft = Math.max(0, newLeft);
        console.log("X. scale: " + getElementScale(window.frameElement));
        console.log("X. playerScale: " + getElementScale(playerElement));
        console.log("X. newWidthAndLeft.width: " + newWidthAndLeft.width);
        console.log("X. newWidthAndLeft.left: " + newWidthAndLeft.left);
        console.log("X. newWidth: " + newWidth);
        console.log("X. popupWidth: " + popupWidth);
        console.log("X. newLeft: " + newLeft);
        return newLeft;
    };

    function getVisiblePlayerIframeWidthAndLeft() {
        var scale = getElementScale(window.frameElement);
        var offsets = getRelativeOffset();
        var visibleViewportWidth = window.top.innerWidth/scale;
        var leftRelativeToVisibleContent = 0;
        if (offsets.left < 0) {
            visibleViewportWidth += offsets.left;
        } else {
            leftRelativeToVisibleContent = offsets.left;
        }
        visibleViewportWidth += Math.min(0, offsets.right);
        visibleViewportWidth = Math.min(visibleViewportWidth, window.innerWidth);
        return {width: visibleViewportWidth, left: leftRelativeToVisibleContent};
    }

    function getElementScale(element){
        if (!element) {
            return 1;
        }
        return element.getBoundingClientRect().width / element.offsetWidth;
    }

    function findPlayerElement() {
        return $(window.document.documentElement).find("#_icplayer").find(".ic_player")[0];
    }

    function getRelativeOffset() {
        var currentWindow = window;
		var relativeOffset = {top: currentWindow.pageYOffset, left: currentWindow.pageXOffset, right: 0, bottom: 0};

		while (currentWindow !== currentWindow.parent) {
            var scale = getElementScale(currentWindow.frameElement);
            var frameRect = currentWindow.frameElement.getBoundingClientRect();
            var parentRect = currentWindow.parent.document.documentElement.getBoundingClientRect();
            var iframeTopOffset = Math.round(frameRect.top - parentRect.top);
            var iframeLeftOffset = Math.round(frameRect.left - parentRect.left);
            var iframeBottomOffset = frameRect.bottom - parentRect.height;
            var iframeRightOffset = frameRect.right - parentRect.width;
			relativeOffset.top += (currentWindow.parent.pageYOffset - iframeTopOffset)/scale;
            relativeOffset.left += (currentWindow.parent.pageXOffset - iframeLeftOffset)/scale;
            relativeOffset.bottom += (iframeBottomOffset)/scale;
            relativeOffset.right += (iframeRightOffset)/scale;
			currentWindow = currentWindow.parent;
		}

        console.log("relativeOffset", relativeOffset);
		return relativeOffset;
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
