package com.lorepo.icplayer.client.utils;

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

}