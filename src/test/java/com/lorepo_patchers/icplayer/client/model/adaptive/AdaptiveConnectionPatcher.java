package com.lorepo_patchers.icplayer.client.model.adaptive;

import com.googlecode.gwt.test.patchers.PatchClass;
import com.lorepo.icplayer.client.model.adaptive.AdaptiveConnection;

@PatchClass(AdaptiveConnection.class)
public class AdaptiveConnectionPatcher {
	static String getSource(AdaptiveConnection self) {
		return "";
	}

	static String getTarget(AdaptiveConnection self) {
		return "";
	}
	
	static String getConditions(AdaptiveConnection self) {
		return "";
	}
}
