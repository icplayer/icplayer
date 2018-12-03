package com.lorepo.icplayer.client.model.adaptive;

import com.google.gwt.core.client.JavaScriptObject;

public class AdaptivePagesStepMap extends JavaScriptObject {
	protected AdaptivePagesStepMap () { }
	
	public final native int getPageStep(String pageId) /*-{
		if (this[pageId]) {
			return this[pageId]; 
		}
		
		return -1;
	}-*/;

}