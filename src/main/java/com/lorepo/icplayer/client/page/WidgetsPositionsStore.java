package com.lorepo.icplayer.client.page;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icplayer.client.dimensions.ModuleDimensions;

public class WidgetsPositionsStore {
	
	class WidgetPositionStruct {
		private ModuleDimensions baseDimensions;
		private ModuleDimensions actualDimensions;
		public Widget widget;
		public int index;
		
		public WidgetPositionStruct(Widget widget, ModuleDimensions dimensions) {
			this.baseDimensions = dimensions;
			this.actualDimensions = ModuleDimensions.copy(dimensions);
			this.widget = widget;
		}
		
		public int getTop () {
			return this.actualDimensions.top;
		}
		
		public int getBaseTop () {
			return this.baseDimensions.top;
		}

		public void addTopDimensionDifference(int difference) {
			this.actualDimensions.top = this.actualDimensions.top + difference;
		}

		public int getLeft() {
			return this.actualDimensions.left;
		}
	}
	
	private HashMap<Integer, List<WidgetPositionStruct>> widgets = new HashMap<Integer, List<WidgetPositionStruct>>();
	
	public WidgetsPositionsStore () {}
	
	public void add(Widget widget, ModuleDimensions moduleDimensions) {
		int position = this.calculatePosition(moduleDimensions.top);
		
		WidgetPositionStruct widgetData = new WidgetPositionStruct(widget, moduleDimensions);
		List<WidgetPositionStruct> widgetList;
		
		if (this.widgets.containsKey(position)) {
			widgetList = this.widgets.get(position);
			widgetData.index = widgetList.size();
			widgetList.add(widgetData);
		} else {
			widgetList = new ArrayList<WidgetPositionStruct>();
			widgetData.index = 0;
			widgetList.add(widgetData);
		}
		
		this.widgets.put(position, widgetList);
	}

	public void setWidgetNewData(WidgetPositionStruct widgetData) {
		int positionKey = this.calculatePosition(widgetData.getBaseTop());
		this.widgets.get(positionKey).set(widgetData.index, widgetData);
	}
	
	public void clear() {
		this.widgets.clear();
	}
	
	public List<WidgetPositionStruct> getAllWidgetsFromPoint(int y) {
		int position = this.calculatePosition(y);
		List<WidgetPositionStruct> results = new ArrayList<WidgetPositionStruct>();
		
		for (int key: this.getKeysForPosition(y)) {
			List<WidgetPositionStruct> listPart;
			if (key > position) {
				listPart = this.widgets.get(key);
			} else {
				listPart = this.filterList(this.widgets.get(key), y);
			}
			
			results.addAll(listPart);
		}
		
		return results;
	}
	
	private List<Integer> getKeysForPosition(int y) {
		int position = this.calculatePosition(y);
		List<Integer> result = new ArrayList<Integer>();
		for (int key: this.widgets.keySet()) {
			if (key >= position) {
				result.add(key);
			}
		}
		
		return result;
	}
	
	private List<WidgetPositionStruct> filterList(List<WidgetPositionStruct> widgetList, int y) {
		List<WidgetPositionStruct> filteredResults = new ArrayList<WidgetPositionStruct>();
		
		for (WidgetPositionStruct widgetData: widgetList) {
			if (widgetData.getBaseTop() >= y) {
				filteredResults.add(widgetData);
			}
		}
		
		return filteredResults;
	}
	
	private int calculatePosition(int top) {
		return top / 100;
	}
}
