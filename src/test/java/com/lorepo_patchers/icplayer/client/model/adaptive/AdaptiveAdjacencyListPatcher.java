package com.lorepo_patchers.icplayer.client.model.adaptive;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;
import com.googlecode.gwt.test.patchers.PatchClass;
import com.lorepo.icplayer.client.model.adaptive.AdaptiveAdjacencyList;
import com.lorepo.icplayer.client.model.adaptive.AdaptiveConnection;

@PatchClass(AdaptiveAdjacencyList.class)
public class AdaptiveAdjacencyListPatcher {
	@SuppressWarnings("unchecked")
	static JsArray<AdaptiveConnection> getConnectionsForPage(AdaptiveAdjacencyList self, String pageID) {
		return (JsArray<AdaptiveConnection>) JavaScriptObject.createArray();
	}
}
