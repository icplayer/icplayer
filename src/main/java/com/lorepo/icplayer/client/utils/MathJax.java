package com.lorepo.icplayer.client.utils;

import com.google.gwt.dom.client.Element;

public class MathJax {

	/**
	 * Refresh MathJax object if present
	 */
	public static native void refreshMathJax(Element e) /*-{

		try{
			$wnd.MathJax.CallBack.Queue().Push(function () {
				$wnd.MathJax.Hub.Typeset(e);
			});
	  	}catch(err){
	  		console.log("Error : " + err);
		}
	}-*/;
}

