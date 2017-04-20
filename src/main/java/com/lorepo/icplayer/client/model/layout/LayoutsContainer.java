package com.lorepo.icplayer.client.model.layout;

import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;
import com.lorepo.icf.utils.JavaScriptUtils;
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
	

	public String getActualSemiResponsiveLayoutID() {
		return this.actualLayoutID;
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

	public void setDefaultSemiResponsiveLayout(String newDefaultLayoutID) {
		for(PageLayout pageLayout : this.layoutsMap.values()) {
			if (pageLayout.getID().compareTo(newDefaultLayoutID) == 0) {
				pageLayout.setIsDefault(true);
			} else {
				pageLayout.setIsDefault(false);				
			}
		}
	}

	public boolean setActualLayoutID(String id) {
		if (this.layoutsMap.containsKey(id)) {
			this.actualLayoutID = id;
			return true;
		}
		
		return false;
	}
	

	public String getDefaultSemiResponsiveLayoutID() {
		for(PageLayout pageLayout : this.layoutsMap.values()) {
			if (pageLayout.isDefault()) {
				return pageLayout.getID();
			}
		}
		
		return null;
	}

	public JavaScriptObject toJS() {
		JavaScriptObject hashmap = JavaScriptUtils.createJSObject();
		for(PageLayout pageLayout : this.layoutsMap.values()) {
			addDataToJSHashMap(hashmap, 
					pageLayout.getID(), 
					pageLayout.getName(), 
					pageLayout.getStyleID(), 
					pageLayout.getThreshold(), 
					pageLayout.isDefault());
		}

		return hashmap;
	}

	private native static void addDataToJSHashMap(JavaScriptObject hashmap, String id,
			String name, String styleID, int threshold, boolean isDefault) /*-{
				hashmap[id] = {
					"id": id,
					"name": name,
					"styleID": styleID,
					"threshold": threshold,
					"isDefault": isDefault
				};	
	}-*/;
}
