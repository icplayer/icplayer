package com.lorepo.icplayer.client.model.layout;

import java.util.HashMap;

import com.lorepo.icf.utils.JavaScriptUtils;

public class LayoutsContainer {

	private HashMap<String, PageLayout> layoutsMap;
	private String actualLayoutID = "default";
	
	public LayoutsContainer() {
		this.layoutsMap = new HashMap<String, PageLayout>();
	}
	
	public void addLayout(PageLayout layout) {
		this.layoutsMap.put(layout.getName(), layout);
	}

	public String getActualLayoutStyleID() {
		PageLayout actualLayout = this.layoutsMap.get(this.actualLayoutID);
		JavaScriptUtils.log("getActualLayoutStyleID");
		JavaScriptUtils.log(this.layoutsMap);
		JavaScriptUtils.log(actualLayout);
		JavaScriptUtils.log("============================");
		return actualLayout.getStyleID();
	}
}
