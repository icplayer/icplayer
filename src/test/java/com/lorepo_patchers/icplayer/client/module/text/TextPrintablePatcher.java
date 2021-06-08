package com.lorepo_patchers.icplayer.client.module.text;

import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icplayer.client.module.text.TextPrintable;

@PatchClass(TextPrintable.class)
public class TextPrintablePatcher {
	@PatchMethod
	public static float getTextWidthInPixels(TextPrintable self, String html) {
		return 200.0f;
	}
}
