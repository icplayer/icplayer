package com.lorepo_patchers.icplayer.client.module.text;

import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icplayer.client.module.text.TextPresenter;

@PatchClass(TextPresenter.class)
public class TextPresenterPatcher {
    @PatchMethod
	public static void addiOSClassWithTimeout(TextPresenter self, TextPresenter _this) {}
}
