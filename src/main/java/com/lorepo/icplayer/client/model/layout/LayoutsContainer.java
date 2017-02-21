package com.lorepo.icplayer.client.model.layout;

import java.util.HashMap;

import com.lorepo.icplayer.client.model.CssStyle;

public class LayoutsContainer {
	
	private HashMap<String, PageLayout> layoutsMap;
	private String actualLayoutID = "default";
	
	public LayoutsContainer() {
		this.layoutsMap = new HashMap<String, PageLayout>();
	}
	
	public void addLayout(PageLayout layout) {
		this.layoutsMap.put(layout.getID(), layout);
	}

	public String getActualLayoutStyleID() {
		PageLayout actualLayout = this.layoutsMap.get(this.actualLayoutID);
		return actualLayout.getStyleID();
	}

	public void removeFromLayoutsStyle(CssStyle styleToDelete) {
		if (this.actualLayoutID.compareTo(styleToDelete.id) == 0) {
			this.actualLayoutID = "default";
		}
		
		for (String key : this.layoutsMap.keySet()) {
			PageLayout pageLayout = this.layoutsMap.get(key);
			if (pageLayout.isThisCssStyle(styleToDelete.id)) {
				pageLayout.setCssID("default");
				this.layoutsMap.put(key, pageLayout);
			}
		}
	}
	
	public HashMap<String, PageLayout> getLayouts() {
		return this.layoutsMap;
	}

	public void clear() {
		this.layoutsMap.clear();
	}

	public void setPageLayouts(HashMap<String, PageLayout> layouts) {
		this.layoutsMap = layouts;
	}
}
