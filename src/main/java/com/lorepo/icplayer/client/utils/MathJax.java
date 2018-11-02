package com.lorepo.icplayer.client.utils;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;

public class MathJax {

	/**
	 * Refresh MathJax object if present
	 */
	public static native void refreshMathJax(Element e) /*-{
		try {
			$wnd.MathJax.Callback.Queue().Push(function () {
				$wnd.MathJax.Hub.Typeset(e);
			});
	  	} catch(err) {
	  		console.log("Error : " + err);
		}
	}-*/;
	
	public static native void rerenderMathJax (Element e) /*-{
		$wnd.MathJax.Hub.Rerender(e);
	}-*/;
	
	public static native JavaScriptObject setCallbackForMathJaxLoaded(MathJaxElement element) /*-{
		return $wnd.MathJax.Hub.Register.MessageHook("End Process", function mathJaxResolve(message) {
	        if ($wnd.$(message[1]).hasClass('ic_page')) {
	            element.@com.lorepo.icplayer.client.utils.MathJaxElement::mathJaxIsLoadedCallback()();
	        }
	    });
	}-*/;
	
	public static native void removeMessageHookCallback(JavaScriptObject hook) /*-{
		// https://github.com/mathjax/MathJax-docs/wiki/How-to-stop-listening-or-un-register-from-a-messagehook
		setTimeout( 
			function removeHook() {
				$wnd.MathJax.Hub.signal.hooks["End Process"].Remove(hook)
			}, 
			0
		);
	}-*/;
}