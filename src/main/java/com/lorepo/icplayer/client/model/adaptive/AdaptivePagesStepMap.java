package com.lorepo.icplayer.client.model.adaptive;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArrayString;

public class AdaptivePagesStepMap extends JavaScriptObject {
	protected AdaptivePagesStepMap () { }
	
	public final native int getPageStep(String pageId) /*-{
		if (this[pageId] !== undefined) {
			return this[pageId]; 
		}
		
		return -1;
	}-*/;

	public final native JsArrayString getOtherStepPages(String pageId, int pageStepIndex) /*-{
		var pagesIds = [];

		if (pageStepIndex !== -1) {
			for (var jsonPageId in this) {
				if (this[jsonPageId] === pageStepIndex && jsonPageId !== pageId) {
					pagesIds.push(jsonPageId);
				}
			}
		}

		return pagesIds;
	}-*/;
}