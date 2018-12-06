package com.lorepo_patchers.icplayer.client.model.adaptive;

import com.google.gwt.core.client.JavaScriptObject;
import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icplayer.client.model.adaptive.AdaptiveAdjacencyList;
import com.lorepo.icplayer.client.model.adaptive.AdaptiveStructure;

@PatchClass(AdaptiveStructure.class)
public class AdaptiveStructurePatcher {

	@PatchMethod
	static AdaptiveAdjacencyList getValues(AdaptiveStructure self, String json) {
		return (AdaptiveAdjacencyList) JavaScriptObject.createObject();
	}
}