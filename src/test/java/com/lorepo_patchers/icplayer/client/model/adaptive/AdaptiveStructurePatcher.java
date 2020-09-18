package com.lorepo_patchers.icplayer.client.model.adaptive;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArrayString;
import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icplayer.client.model.adaptive.AdaptiveAdjacencyList;
import com.lorepo.icplayer.client.model.adaptive.AdaptivePageInformations;
import com.lorepo.icplayer.client.model.adaptive.AdaptiveStructure;

@PatchClass(AdaptiveStructure.class)
public class AdaptiveStructurePatcher {

	@PatchMethod
	static AdaptiveAdjacencyList getListValues(AdaptiveStructure self, String json) {
		return (AdaptiveAdjacencyList) JavaScriptObject.createObject();
	}
	
	@PatchMethod
 	static AdaptivePageInformations getPageInfos(AdaptiveStructure self, String json) {
		return (AdaptivePageInformations) JavaScriptObject.createObject();
	}

	@PatchMethod
	static JsArrayString getStepsIDs(AdaptiveStructure self, String json) {
		return (JsArrayString) JavaScriptObject.createObject();
	}
}