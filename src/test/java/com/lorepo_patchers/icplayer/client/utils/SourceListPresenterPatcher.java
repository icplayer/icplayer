package com.lorepo_patchers.icplayer.client.utils;

import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter;

@PatchClass(SourceListPresenter.class)
public class SourceListPresenterPatcher {
	@PatchMethod
	public static int refreshMathJaxWithTimeout(SourceListPresenter self, SourceListPresenter arg) {
		return 0;
	}
}
