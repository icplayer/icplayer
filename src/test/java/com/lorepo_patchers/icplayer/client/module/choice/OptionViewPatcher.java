package com.lorepo_patchers.icplayer.client.module.choice;

import com.google.gwt.user.client.Element;
import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icplayer.client.module.choice.OptionView;

@PatchClass(OptionView.class)
public class OptionViewPatcher {

	@PatchMethod
	static void setListener(OptionView self, Element el){
		return;
	}
}
