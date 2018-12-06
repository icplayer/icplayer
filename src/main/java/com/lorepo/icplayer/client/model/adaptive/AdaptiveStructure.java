package com.lorepo.icplayer.client.model.adaptive;

import com.google.gwt.core.client.JsArray;


public class AdaptiveStructure {
	private AdaptiveAdjacencyList adjacencyList;
	
	public AdaptiveStructure(String json) {
		this.adjacencyList = getValues(json);
	}
	
	public JsArray<AdaptiveConnection> getConnectionsForPage(String pageID) {
		return this.adjacencyList.getConnectionsForPage(pageID);
	}
	
	private native AdaptiveAdjacencyList getValues(String json) /*-{
		if (json !== '' && json !== null && json !== undefined) { 
			var parsedJSON = JSON.parse(json);
			
			return parsedJSON.edges;
		} else {
			return {};
		}
	}-*/;
	
}
