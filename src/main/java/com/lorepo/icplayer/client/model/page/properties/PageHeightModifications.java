package com.lorepo.icplayer.client.model.page.properties;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;


public class PageHeightModifications {
	private class ListEntry {
		public int diff;
		public int y;
		public boolean dontMoveModules;
		
		ListEntry(Integer diff, int y, boolean dontMoveModules) {
			this.diff = diff;
			this.dontMoveModules = dontMoveModules;
			this.y = y;
		}
		
		public Integer getDiff() {
			return this.diff;
		}
		
		public boolean getDontMoveModules() {
			return this.dontMoveModules;
		}
		
		public Integer getY() {
			return this.y;
		}
	}
	
	private List<ListEntry> modifications = new ArrayList<ListEntry>();
	private boolean wasModified = false;
	
	private String Y_KEY = "y";
	private String HEIGHT_KEY = "height";
	private String DONT_CHANGE_KEY = "dontMove";
	
	public void addOutstretchHeight (int y, int height, boolean dontMoveModules) {
		this.modifications.add(new ListEntry(height, y, dontMoveModules));
		this.wasModified = true;
	}

	public List<OutstretchHeightData> getOutStretchHeights() {
		List<OutstretchHeightData> result = new ArrayList<OutstretchHeightData>();
		for (int i  = 0; i < this.modifications.size(); i++) {
			int diff = this.modifications.get(i).getDiff();
			int y = this.modifications.get(i).getY();
			boolean dontMoveModules = this.modifications.get(i).getDontMoveModules();
			
			result.add(new OutstretchHeightData(y, diff, dontMoveModules));			
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
			this.pushToArray(jsArray, modifications.get(i).y, modifications.get(i).height, modifications.get(i).dontMoveModules);
		}
		
		return stringify(jsArray);
	}
	
	private native JavaScriptObject createEmptyJsArray() /*-{
		return [];
	}-*/;
	
	private native void pushToArray(JavaScriptObject array, int y, int height, boolean dontMoveModules) /*-{
		array.push({
			"y": y,
			"height": height,
			"dontMoveModules": dontMoveModules
		});
	}-*/;
	
	private native String stringify(JavaScriptObject obj) /*-{
		return JSON.stringify(obj);
	}-*/; 
	
	public void setState(String jsonText) {
		this.modifications.clear();
		this.parse(this, jsonText);
	}
	
	private void addToModificationsMap(int y, int height, Boolean dontMoveModules) {
		this.modifications.add(new ListEntry(height, y, dontMoveModules.booleanValue()));
	}
	
	private native JavaScriptObject parse(PageHeightModifications x, String jsonText) /*-{
		var data = JSON.parse(jsonText);
		var i = 0;
		var dataLen = data.length;
		var y;
		var height;
		var dontMoveModules;
		var Y_KEY = "y";
		var HEIGHT_KEY = "height";
		var DONT_CHANGE_KEY = "dontMoveModules";
		for(var i = 0; i < dataLen; i++) {
			y = data[i][Y_KEY];
			height = data[i][HEIGHT_KEY];
			dontMoveModules = data[i][DONT_CHANGE_KEY];
			if (dontMoveModules === undefined) {
				dontMoveModules = false;
			}
			x.@com.lorepo.icplayer.client.model.page.properties.PageHeightModifications::addToModificationsMap(IILjava/lang/Boolean;)(y, height, @java.lang.Boolean::valueOf(Z)(dontMoveModules));
		}
	}-*/;
}
