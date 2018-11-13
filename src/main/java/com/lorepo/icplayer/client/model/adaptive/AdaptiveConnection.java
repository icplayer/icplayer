package com.lorepo.icplayer.client.model.adaptive;

import com.google.gwt.core.client.JavaScriptObject;

public class AdaptiveConnection extends JavaScriptObject {	
	protected AdaptiveConnection() { }
	
	public final native String getSource() /*-{
		return this.sourceID;
	}-*/;
	
	public final native String getTarget() /*-{
		return this.targetID;
	}-*/;
	
	public final native String getConditions() /*-{
		return this.conditions;
	}-*/;
	
}
