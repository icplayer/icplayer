package com.lorepo.icplayer.client.model.page.properties;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;

public class PageHeightModifications {
	private HashMap<Integer, Integer> modifications = new HashMap<Integer, Integer>();
	private boolean wasModified = false;
	
	private String Y_KEY = "y";
	private String HEIGHT_KEY = "height";
	
	public void addOutstretchHeight (int y, int height) {
		if (this.modifications.containsKey(y)) {
			int diff = this.modifications.get(y);
			diff = diff + height;
			this.modifications.put(y, diff);
		} else {
			this.modifications.put(y,  height);
		}
		
		this.wasModified = true;
	}

	public List<OutstretchHeightData> getOutStretchHeights() {
		List<OutstretchHeightData> result = new ArrayList<OutstretchHeightData>();
		
		for(int key : this.modifications.keySet()) {
			int diff = this.modifications.get(key);
			result.add(new OutstretchHeightData(key, diff));
		}
		
		return result;
	}
	
	public boolean wasOutstretchHeightCalled() {
		return this.wasModified;
	}

	public String getState() {
		JavaScriptObject jsArray = this.createEmptyJsArray();
		List<OutstretchHeightData> modifications = this.getOutStretchHeights();
		
		for(int i = 0; i < modifications.size(); i++) {
			this.pushToArray(jsArray, modifications.get(i).y, modifications.get(i).height);
		}
		
		return stringify(jsArray);
	}
	
	private native JavaScriptObject createEmptyJsArray() /*-{
		return [];
	}-*/;
	
	private native void pushToArray(JavaScriptObject array, int y, int height) /*-{
		array.push({
			"y": y,
			"height": height
		});
	}-*/;
	
	private native String stringify(JavaScriptObject obj) /*-{
		return JSON.stringify(obj);
	}-*/; 
	
	public void setState(String jsonText) {
		this.modifications.clear();
		this.parse(this, jsonText);
	}
	
	private void addToModificationsMap(int y, int height) {
		this.modifications.put(y, height);
	}
	
	private native JavaScriptObject parse(PageHeightModifications x, String jsonText) /*-{
		var data = JSON.parse(jsonText);
		var i = 0;
		var dataLen = data.length;
		var y;
		var height;
		var Y_KEY = "y";
		var HEIGHT_KEY = "height";
		for(var i = 0; i < dataLen; i++) {
			y = data[i][Y_KEY];
			height = data[i][HEIGHT_KEY];
			x.@com.lorepo.icplayer.client.model.page.properties.PageHeightModifications::addToModificationsMap(II)(y, height);
		}
	}-*/;
}
