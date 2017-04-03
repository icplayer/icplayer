package com.lorepo.icplayer.client.model.page.properties;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;

public class PageHeightModifications {
	private class MapEntry {
		Integer diff, y;
		boolean dontChange;
		
		MapEntry(Integer diff, int y, boolean dontChange) {
			this.diff = diff;
			this.dontChange = dontChange;
			this.y = y;
		}
		
		public Integer getDiff() {
			return this.diff;
		}
		
		public boolean getDontChange() {
			return this.dontChange;
		}
		
		public Integer getY() {
			return this.y;
		}
	}
	
	private List<MapEntry> modifications = new ArrayList<MapEntry>();
	private boolean wasModified = false;
	
	private String Y_KEY = "y";
	private String HEIGHT_KEY = "height";
	private String DONT_CHANGE_KEY = "dontChange";
	
	public void addOutstretchHeight (int y, int height, boolean dontChangeModules) {
		this.modifications.add(new MapEntry(height, y, dontChangeModules));
		this.wasModified = true;
	}

	public List<OutstretchHeightData> getOutStretchHeights() {
		List<OutstretchHeightData> result = new ArrayList<OutstretchHeightData>();
		for (int i  = 0; i < this.modifications.size(); i++) {
			int diff = this.modifications.get(i).getDiff();
			int y = this.modifications.get(i).getY();
			boolean dontChange = this.modifications.get(i).getDontChange();
			
			result.add(new OutstretchHeightData(y, diff, dontChange));			
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
			this.pushToArray(jsArray, modifications.get(i).y, modifications.get(i).height, modifications.get(i).dontChange);
		}
		
		return stringify(jsArray);
	}
	
	private native JavaScriptObject createEmptyJsArray() /*-{
		return [];
	}-*/;
	
	private native void pushToArray(JavaScriptObject array, int y, int height, boolean dontChange) /*-{
		array.push({
			"y": y,
			"height": height,
			"dontChange": dontChange
		});
	}-*/;
	
	private native String stringify(JavaScriptObject obj) /*-{
		return JSON.stringify(obj);
	}-*/; 
	
	public void setState(String jsonText) {
		this.modifications.clear();
		this.parse(this, jsonText);
	}
	
	private void addToModificationsMap(int y, int height, Boolean dontChange) {
		this.modifications.add(new MapEntry(height, y, dontChange.booleanValue()));
	}
	
	private native JavaScriptObject parse(PageHeightModifications x, String jsonText) /*-{
		var data = JSON.parse(jsonText);
		var i = 0;
		var dataLen = data.length;
		var y;
		var height;
		var dontChange;
		var Y_KEY = "y";
		var HEIGHT_KEY = "height";
		var DONT_CHANGE_KEY = "dontChange";
		console.log(data);
		for(var i = 0; i < dataLen; i++) {
			y = data[i][Y_KEY];
			height = data[i][HEIGHT_KEY];
			dontChange = data[i][DONT_CHANGE_KEY];
			x.@com.lorepo.icplayer.client.model.page.properties.PageHeightModifications::addToModificationsMap(IILjava/lang/Boolean;)(y, height, @java.lang.Boolean::valueOf(Z)(dontChange));
		}
	}-*/;
}
