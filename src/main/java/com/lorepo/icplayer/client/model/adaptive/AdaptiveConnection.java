package com.lorepo.icplayer.client.model.adaptive;

import com.google.gwt.core.client.JavaScriptObject;


// Object describing edge, has source and target (pages ID) and conditions
// Conditions are strings in form: "expect(page_ID_1).score < 10"
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
