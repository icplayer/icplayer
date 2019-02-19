package com.lorepo.icplayer.client.utils;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;

public class MathJax {

	/**
	 * Refresh MathJax object if present
	 */
	public static native void refreshMathJax(Element e) /*-{
		try {
			// Array is created this way, beacuse in different frames Array prototypes are different objects.
			// Comparing array variable from one frame to Array prototype in different frame will return false
            // GWT creates its own frame and MathJax is placed in other ($wnd)
			// ex (when window !== top):
			// var array = new Array(); 
			// array instanceof Array // true
			// array instanceof top.Array // false

			var args = new $wnd.Array();
			args.push("Typeset", $wnd.MathJax.Hub, e);

			// This adds command to MathJax internal queue and assures all callbacks will be called one after another
			// Calling MathJax.Callback.Queue() creates a new queue every time, so it shouldn't be used for rerendering purporses 
			$wnd.MathJax.Hub.Queue(args);
	  	} catch(err) {
	  		console.log("Error : " + err);
		}
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
				$wnd.MathJax.Hub.signal.hooks["End Process"].Remove(hook);
			},
			0
		);
	}-*/;
}