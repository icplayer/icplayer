package com.lorepo_patchers.icplayer.client.module.text;

import com.google.gwt.dom.client.Element;
import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icplayer.client.module.text.TextPresenter;

@PatchClass(TextPresenter.class)
public class TextPresenterPatcher {
    @PatchMethod
	public static void addiOSClassWithTimeout(TextPresenter self, TextPresenter _this) {}

    @PatchMethod
	public static void setupScrollHandlers (TextPresenter self, TextPresenter x, Element e) {}

    @PatchMethod
	public static boolean isVisibleInViewPort (TextPresenter self, Element e, int scrollTop) {return true;}
}
