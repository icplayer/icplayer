package com.lorepo.icplayer.client.utils;

import com.google.gwt.dom.client.Element;

public class MathJax {

	/**
	 * Refresh MathJax object if present
	 */
	public static native void refreshMathJax(Element e) /*-{

		if (typeof $wnd.MathJax !== 'undefined'  &&  $wnd.MathJax != null ){
	  		if (typeof $wnd.MathJax.Hub !== 'undefined'  &&  $wnd.MathJax.Hub != null ){
	  			if (typeof $wnd.MathJax.Hub.Typeset == 'function' ){

					$wnd.MathJax.CallBack.Queue().Push(function () {$wnd.MathJax.Hub.Typeset(e)});
	  			}
	  		}
	  	}
	}-*/;
}
