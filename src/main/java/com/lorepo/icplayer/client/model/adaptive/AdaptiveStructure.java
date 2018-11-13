package com.lorepo.icplayer.client.model.adaptive;

import java.util.HashMap;
import java.util.Map;

import com.google.gwt.core.client.JsArray;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONValue;


public class AdaptiveStructure {
	public Map<String, JsArray<AdaptiveConnection>> adjacencyList;

	public AdaptiveStructure(String json) {
		this.adjacencyList = new HashMap<String, JsArray<AdaptiveConnection>>();

		JsArray<AdaptiveConnection> values = this.getValues(json);
		
		for (int i = 0; i < values.length(); i++) {
			AdaptiveConnection connection = values.get(i);
		}

	}
	
	private native JsArray<AdaptiveConnection> getValues(String json) /*-{
		var parsedJSON = JSON.parse(json);
		
		return parsedJSON.edges;
	}-*/;
	
}
