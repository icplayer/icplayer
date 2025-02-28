package com.lorepo.icplayer.client.utils;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;

public class MathJax {

	/**
	 * Refresh MathJax object if present
	 */
	public static native void refreshMathJax(Element e) /*-{
		var doesContainMathJax = e.innerText.match('.*?\\\(.*?\\\)') || e.innerText.match('.*?\\left\(.*?\\right\)');
		if (!doesContainMathJax) {
			return;
		}

		try {
			// Array is created this way, because in different windows Array prototypes are different objects.
			// Comparing array variable from one window to Array prototype in different window will return false
            // GWT creates its own window and MathJax is placed in another ($wnd)
            // This is needed because MathJax compares arguments to instanceof Array
			// e.g. (when window !== top):
			// var array = new Array(); 
			// array instanceof Array // true
			// array instanceof top.Array // false

			var args = new $wnd.Array();
			args.push("Typeset", $wnd.MathJax.Hub, e);
			if ($wnd.MathJax.Hub.config.jax.includes("output/NativeMML") && ($wnd.MathJax.Hub.Browser.isFirefox || $wnd.MathJax.Hub.Browser.isSafari)) {
				args.push(function(){
					@com.lorepo.icplayer.client.utils.MathJax::fixMathMLSizeBug(Lcom/google/gwt/dom/client/Element;)(e);
				});
			}

			// This adds command to MathJax internal queue and assures all callbacks will be called one after another
			// Calling MathJax.Callback.Queue() creates a new queue every time, so it shouldn't be used for rendering purposes
			$wnd.MathJax.Hub.Queue(args);
	  	} catch(err) {
	  		console.log("Error : " + err);
		}
	}-*/;
	
	private static native void fixMathMLSizeBug(Element element) /*-{
		if ($wnd.MathJax.Hub.Browser.isFirefox) {
			@com.lorepo.icplayer.client.utils.MathJax::fixFirefoxMathMLSizeBug(Lcom/google/gwt/dom/client/Element;)(element);
		} else if ($wnd.MathJax.Hub.Browser.isSafari) {
		 	@com.lorepo.icplayer.client.utils.MathJax::fixSafariMathMLBracketsSizeBug(Lcom/google/gwt/dom/client/Element;)(element);
		}
	}-*/;
	
	private static native void fixFirefoxMathMLSizeBug(Element element) /*-{
		// On Firefox <math> element is not rendered correctly. It looks like some CSS styles are not affecting it.
		var mathElements = element.getElementsByClassName("MathJax_MathML");
		var mathElementsStyles = [];
		for (var i = 0; i < mathElements.length; i++) {
			mathElementsStyles[i] = mathElements[i].parentElement.style.fontFamily;
			mathElements[i].parentElement.style.fontFamily = "STIX TWO MATH";
		}
		setTimeout(function (){
			for (var i = 0; i < mathElements.length; i++) {
				try {
					mathElements[i].parentElement.style.fontFamily = mathElementsStyles[i];
				} catch(err) {}
			}
		}, 10);
	}-*/;
	
	private static native void fixSafariMathMLBracketsSizeBug(Element element) /*-{
		// On Safari <math> element is not rendered correctly.
		// Some brackets are smaller (they don't match size of surrounding math).
		var mathJaxElements = element.getElementsByClassName("MathJax_MathML");
		
		var mathJaxElementsToRerender = [];
		for (var mathJaxElementIndex = 0; mathJaxElementIndex < mathJaxElements.length; mathJaxElementIndex++) {
			var mathJaxElement = mathJaxElements[mathJaxElementIndex];
			if (@com.lorepo.icplayer.client.utils.MathJax::areOuterBracketsBiggerThenInnerBrackets(Lcom/google/gwt/dom/client/Element;)(mathJaxElement)) {
				mathJaxElementsToRerender.push(mathJaxElement.parentElement);
			}
		}
		
		setTimeout(function (){
			for (var i = 0; i < mathJaxElementsToRerender.length; i++) {
				try {
					$wnd.MathJax.Hub.Rerender(mathJaxElementsToRerender[i]);
				} catch(err) {
					console.log("Error : " + err);
				}
			}
		}, 10);
	}-*/;
	
	private static native boolean areOuterBracketsBiggerThenInnerBrackets(Element element) /*-{
		var openingBrackets = ["(", "[", "{"];
		var closingBrackets = [")", "]", "}"];
		
		var moElements = element.getElementsByTagName("mo");
		var openingBracketsNumber = 0;
		var closingBracketsNumber = 0;
		var mostOuterBracketIndex = -1;
		var mostInnerBracketIndex = -1;
		for (var moElementIndex = 0; moElementIndex < moElements.length; moElementIndex++) {
			var moElement = moElements[moElementIndex];
			var isOpeningBracket = openingBrackets.includes(moElement.innerHTML);
			var isClosingBracket = closingBrackets.includes(moElement.innerHTML);
			if (!isOpeningBracket && !isClosingBracket) {
				continue;
			}
			if (isOpeningBracket) {
				openingBracketsNumber++;
				if (mostOuterBracketIndex === -1) {
					mostOuterBracketIndex = moElementIndex;
				}
				mostInnerBracketIndex = moElementIndex;
			}
			if (isClosingBracket) closingBracketsNumber++;
			
			if (openingBracketsNumber === closingBracketsNumber) {
				if (openingBracketsNumber !== 1 && closingBracketsNumber !== 1) {
					var mostOuterElement = moElements[mostOuterBracketIndex];
					var mostInnerElement = moElements[mostInnerBracketIndex];
					if (mostOuterElement.getBoundingClientRect().height < mostInnerElement.getBoundingClientRect().height) {
						return true;
					}
				}
				openingBracketsNumber = 0;
				closingBracketsNumber = 0;
				mostOuterBracketIndex = -1;
				mostInnerBracketIndex = -1;
			}
		}
		return false;
	}-*/;

	public static native void rerenderMathJax (Element e) /*-{
		$wnd.MathJax.Hub.Rerender(e);
	}-*/;

	public static native JavaScriptObject setCallbackForMathJaxLoaded(MathJaxElement element) /*-{
		return $wnd.MathJax.Hub.Register.MessageHook("End Process", function mathJaxResolve(message) {
			var elementId = element.@com.lorepo.icplayer.client.utils.MathJaxElement::getElementId()();
			if($wnd.MathJax.callbacksHook == null || $wnd.MathJax.callbacksHook == undefined){
				$wnd.MathJax.callbacksHook = [];
			}

			var isCallbackNotResolved = $wnd.MathJax.callbacksHook[elementId] == null || $wnd.MathJax.callbacksHook[elementId] == undefined;
			if ($wnd.$(message[1]).hasClass('ic_page') && isCallbackNotResolved) {
				$wnd.MathJax.callbacksHook[elementId] = true;
				element.@com.lorepo.icplayer.client.utils.MathJaxElement::mathJaxIsLoadedCallback()();
	        }
	    });
	}-*/;

	public static native void removeMessageHookCallback(JavaScriptObject hook) /*-{
		// https://github.com/mathjax/MathJax-docs/wiki/How-to-stop-listening-or-un-register-from-a-messagehook
		setTimeout(
			function removeHook() {
				if ($wnd.MathJax) {
					$wnd.MathJax.Hub.signal.hooks["End Process"].Remove(hook);
				}
			},
			0
		);
	}-*/;
}
