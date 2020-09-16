package com.lorepo.icplayer.client.model.adaptive;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;

// Object containing connection of pages to other pages.
// Keys (attributes) are pagesID, values are arrays of AdjancencyConnection
// Ex: 
// { 
//	page_ID_1: [{source: page_ID_1, target: page_ID_2, conditions: []}]
// }
public class AdaptiveAdjacencyList extends JavaScriptObject {
	protected AdaptiveAdjacencyList() { }
	
	public final native JsArray<AdaptiveConnection> getConnectionsForPage(String pageID) /*-{
		if (this[pageID]) {
			return this[pageID];	
		} else {
			return [];
		}
	}-*/;
}
