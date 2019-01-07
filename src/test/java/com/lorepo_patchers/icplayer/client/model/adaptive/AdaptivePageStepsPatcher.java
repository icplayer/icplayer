package com.lorepo_patchers.icplayer.client.model.adaptive;

import com.google.gwt.core.client.JavaScriptObject;
import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icplayer.client.model.adaptive.AdaptivePageSteps;
import com.lorepo.icplayer.client.model.adaptive.AdaptivePagesStepMap;

@PatchClass(AdaptivePageSteps.class)
public class AdaptivePageStepsPatcher {
	
	@PatchMethod
	static AdaptivePagesStepMap getValues(AdaptivePageSteps self, String json) {
		return (AdaptivePagesStepMap)JavaScriptObject.createObject();
	}
}
