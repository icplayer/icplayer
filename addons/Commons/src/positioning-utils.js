/**
 * @module commons
 */

(function (window) {
    /**
     Utils to calculate popup's position.
     @class PositioningUtils
     */
    var PositioningUtils = {};

    PositioningUtils.calculateTopForPopupToBeCentred = function PositioningUtils_calculateTopForPopupToBeCentred(popupHeight) {
        var visibleIframeWithPlayerHeightAndTop = getVisibleIframeWithPlayerHeightAndTop();
        var visiblePlayerAreaSize = getVisiblePlayerAreaHeightAndTop(visibleIframeWithPlayerHeightAndTop);

        var newTop = visiblePlayerAreaSize.top;
        if (visiblePlayerAreaSize.height > popupHeight) {
            newTop += (visiblePlayerAreaSize.height - popupHeight)/2;
        }
        return Math.max(0, newTop);
    };

    function getVisibleIframeWithPlayerHeightAndTop() {
        var scale = getElementScale(window.frameElement);
        var visibleViewportHeight = window.top.innerHeight/scale;
        var offsets = getRelativeOffset();
        var topRelativeToVisibleContent = Math.max(0, offsets.top);
        if (offsets.top < 0) {
            visibleViewportHeight += offsets.top;
        }
        visibleViewportHeight += Math.min(0, offsets.bottom);
        visibleViewportHeight = Math.min(visibleViewportHeight, window.document.documentElement.offsetHeight);
        return {height: visibleViewportHeight, top: topRelativeToVisibleContent};
    }

    function getVisiblePlayerAreaHeightAndTop(visibleIframeWithPlayerHeightAndTop) {
        var visiblePlayerAreaHeightAndTop = {
            height: visibleIframeWithPlayerHeightAndTop.height,
            top: visibleIframeWithPlayerHeightAndTop.top
        };
        var playerElementBoundingClientRect = getPlayerBoundingClientRect();
        if (!playerElementBoundingClientRect) {
            return visiblePlayerAreaHeightAndTop;
        }
        if (playerElementBoundingClientRect.height < visiblePlayerAreaHeightAndTop.height) {
            visiblePlayerAreaHeightAndTop.height = playerElementBoundingClientRect.height;
            visiblePlayerAreaHeightAndTop.top += playerElementBoundingClientRect.top;
        } else if (playerElementBoundingClientRect.top > 0) {
            visiblePlayerAreaHeightAndTop.height -= playerElementBoundingClientRect.top;
            visiblePlayerAreaHeightAndTop.top += playerElementBoundingClientRect.top;
        }
        return visiblePlayerAreaHeightAndTop;
    }

    PositioningUtils.calculateLeftForPopupToBeCentred = function PositioningUtils_calculateLeftForPopupToBeCentred(popupWidth) {
        var visibleIframeWithPlayerWidthAndLeft = getVisibleIframeWithPlayerWidthAndLeft();
        var visiblePlayerAreaSize = getVisiblePlayerAreaWidthAndLeft(visibleIframeWithPlayerWidthAndLeft);

        // Do not use if like in calculateTopForPopupCentredToVisiblePlayerArea to get values below 0
        var newLeft = visiblePlayerAreaSize.left;
        newLeft += (visiblePlayerAreaSize.width - popupWidth)/2;
        return Math.max(0, newLeft);
    };

    function getVisibleIframeWithPlayerWidthAndLeft() {
        var scale = getElementScale(window.frameElement);
        var visibleViewportWidth = window.top.innerWidth/scale;
        var offsets = getRelativeOffset();
        var leftRelativeToVisibleContent = Math.max(0, offsets.left);
        if (offsets.left < 0) {
            visibleViewportWidth += offsets.left;
        }
        visibleViewportWidth += Math.min(0, offsets.right);
        visibleViewportWidth = Math.min(visibleViewportWidth, window.document.documentElement.offsetWidth);
        return {width: visibleViewportWidth, left: leftRelativeToVisibleContent};
    }

    function getVisiblePlayerAreaWidthAndLeft(visibleIframeWithPlayerWidthAndLeft) {
        var visiblePlayerAreaWidthAndLeft = {
            width: visibleIframeWithPlayerWidthAndLeft.width,
            left: visibleIframeWithPlayerWidthAndLeft.left
        };
        var playerElementBoundingClientRect = getPlayerBoundingClientRect();
        if (!playerElementBoundingClientRect) {
            return visiblePlayerAreaWidthAndLeft;
        }
        if (playerElementBoundingClientRect.width < visiblePlayerAreaWidthAndLeft.width) {
            visiblePlayerAreaWidthAndLeft.width = playerElementBoundingClientRect.width;
            visiblePlayerAreaWidthAndLeft.left += playerElementBoundingClientRect.left;
        } else if (playerElementBoundingClientRect.left > 0) {
            visiblePlayerAreaWidthAndLeft.width -= playerElementBoundingClientRect.left;
            visiblePlayerAreaWidthAndLeft.left += playerElementBoundingClientRect.left;
        }
        return visiblePlayerAreaWidthAndLeft;
    }

    /**
     * Gets relative offset between iframe with player and topmost window.
     * @method getRelativeOffset
     *
     * The returned value is a dict object {left: a, top: b, right: c. bottom: d} is an object representing the
     * difference in distance between the largest visible area of the iframe with the player relative to the topmost
     * window (window.top.parent).
     *
     * Examples:
     * - A value of 0 for a given direction means that for a given direction the edge of the iframe with the player
     *   is visible and the distance between the edge of the viewport and the iframe is 0 pixels.
     * - A negative value of e.g. -64 for a given direction means that for a given direction the edge of the iframe
     *   with the player is visible and the distance between the edge of the viewport and the iframe is 64 pixels.
     * - A positive value of e.g. 64  for a given direction means that for a given direction the edge of the iframe
     *   with the player is not visible and the distance between the edge of the viewport and the iframe is 64 pixels.
     * The same calculation method is used for all pages, so bottom != height + top.
     * The method does not take fixed elements in the calculation.
     *
     * @returns {{top: number, left: number, bottom: number, right: number}}
     */
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
        return relativeOffset;
    }

    function getPlayerBoundingClientRect() {
        var playerTableElement = findPlayerElement();
        return !!playerTableElement ? playerTableElement.getBoundingClientRect() : undefined;
    }

    function findPlayerElement() {
        // On mobile devices, the element with #_icplayer does not have its width (only width) calculated correctly
        // using the getBoundingClientRect method. Use its child to get the correct values.
        var playerElement = window.document.getElementById("_icplayer");
        if (!playerElement) {
            return;
        }
        return playerElement.getElementsByClassName("ic_player")[0];
    }

    function getElementScale(element){
        return !!element ? element.getBoundingClientRect().width / element.offsetWidth : 1;
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
