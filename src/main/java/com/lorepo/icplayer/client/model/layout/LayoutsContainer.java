package com.lorepo.icplayer.client.model.layout;

import java.util.HashMap;

public class LayoutsContainer {

	private HashMap<String, PageLayout> layoutsMap;
	
	public LayoutsContainer() {
		this.layoutsMap = new HashMap<String, PageLayout>();
	}
	
	public void addLayout(PageLayout layout) {
		this.layoutsMap.put(layout.getName(), layout);
	}
}
