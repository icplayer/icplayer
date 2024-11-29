package com.lorepo.icplayer.client.utils;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;

public class MathJax {

	/**
	 * Refresh MathJax object if present
	 */
	public static native void refreshMathJax(Element e) /*-{
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
			if ($wnd.MathJax.Hub.Browser.isFirefox && $wnd.MathJax.Hub.config.jax.includes("output/NativeMML")) {
				args.push(function(){
					@com.lorepo.icplayer.client.utils.MathJax::fixMathMLSizeBugOnFirefox(Lcom/google/gwt/dom/client/Element;)(e);
				});
			}

			// This adds command to MathJax internal queue and assures all callbacks will be called one after another
			// Calling MathJax.Callback.Queue() creates a new queue every time, so it shouldn't be used for rendering purposes
			$wnd.MathJax.Hub.Queue(args);
	  	} catch(err) {
	  		console.log("Error : " + err);
		}
	}-*/;

	private static native void fixMathMLSizeBugOnFirefox(Element element) /*-{
		// On Firefox <math> element is not rendered correctly. It looks like some CSS styles are not affecting it.	
		var mathElements = element.getElementsByClassName("MathJax_MathContainer");
		var mathElementsStyles = [];
		for (var i = 0; i < mathElements.length; i++) {
			mathElementsStyles[i] = mathElements[i].style.fontFamily;
			mathElements[i].style.fontFamily = "STIX TWO MATH";
		}
		setTimeout(function (){
			for (var i = 0; i < mathElementsStyles.length; i++) {
				try {
					mathElements[i].style.fontFamily = mathElementsStyles[i];
				} catch(err) {}
			}
		}, 10);
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
