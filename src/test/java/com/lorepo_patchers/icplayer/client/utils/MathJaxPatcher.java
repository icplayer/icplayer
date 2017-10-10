package com.lorepo_patchers.icplayer.client.utils;

import com.google.gwt.dom.client.Element;
import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icplayer.client.utils.MathJax;

@PatchClass(MathJax.class)
public class MathJaxPatcher {
	@PatchMethod
	public static void refreshMathJax(Element e) {
		//Nothing
	}
}
