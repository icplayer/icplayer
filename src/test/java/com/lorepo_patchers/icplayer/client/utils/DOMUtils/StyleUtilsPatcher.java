package com.lorepo_patchers.icplayer.client.utils.DOMUtils;

import com.google.gwt.user.client.Element;
import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icplayer.client.utils.DOMUtils;

@PatchClass(DOMUtils.class)
public class StyleUtilsPatcher {
	@PatchMethod
	public static void applyInlineStyle(Element element, String style) {
	}
}
