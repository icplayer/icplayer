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

	public String getActualSemiResponsiveLayoutName() {
		return this.getLayoutNameByID(this.actualLayoutID);
	}

	public String getActualSemiResponsiveLayoutID() {
		return this.actualLayoutID;
	}

	public PageLayout getActualLayout() {
		return this.layoutsMap.get(this.getActualSemiResponsiveLayoutID());
	}

	public void removeFromLayoutsStyle(CssStyle styleToDelete, HashMap<String, CssStyle> styles) {
		String defaultCssStyle = "";
		
		for (CssStyle style : styles.values()) {
			if (style.isDefault()) {
				defaultCssStyle = style.getID();
				break;
			}
		}
		
		for (String key : this.layoutsMap.keySet()) {
			PageLayout pageLayout = this.layoutsMap.get(key);
			if (pageLayout.isThisCssStyle(styleToDelete.getID())) {
				pageLayout.setCssID(defaultCssStyle);
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
		if (this.layoutsMap.containsKey(id) && this.actualLayoutID.compareTo(id) != 0) {
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
	
	public String getLayoutIDByName(String layoutName) {
		for(PageLayout pageLayout : this.layoutsMap.values()) {
			if (pageLayout.getName().equals(layoutName)) {
				return pageLayout.getID();
			}
		}
		
		return "";
	}

	public String getLayoutNameByID(String layoutID) {
		for(PageLayout pageLayout : this.layoutsMap.values()) {
			if (pageLayout.getID().equals(layoutID)) {
				return pageLayout.getName();
			}
		}
		
		return "";
	}

	public JavaScriptObject toJS() {
		JavaScriptObject hashmap = JavaScriptUtils.createJSObject();
		for(PageLayout pageLayout : this.layoutsMap.values()) {
			addDataToJSHashMap(hashmap, 
					pageLayout.getID(), 
					pageLayout.getName(), 
					pageLayout.getStyleID(), 
					pageLayout.getThreshold(), 
					pageLayout.isDefault(),
					pageLayout.useDeviceOrientation(),
					pageLayout.getDeviceOrientation().toString());
		}

		return hashmap;
	}

	private native static void addDataToJSHashMap(JavaScriptObject hashmap, String id,
			String name, String styleID, int threshold, boolean isDefault, boolean useDeviceOrientation, String deviceOrientation) /*-{
				hashmap[id] = {
					"id": id,
					"name": name,
					"styleID": styleID,
					"threshold": threshold,
					"isDefault": isDefault,
					"useDeviceOrientation": useDeviceOrientation 
				};
				
				if ("useDeviceOrientation") {
					hashmap[id]["deviceOrientation"] = deviceOrientation;
				}
	}-*/;
}
