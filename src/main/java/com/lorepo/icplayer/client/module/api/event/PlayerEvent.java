package com.lorepo.icplayer.client.module.api.event;

import java.util.HashMap;

import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;

public abstract class PlayerEvent <H extends EventHandler> extends GwtEvent<H> {
	protected String pageID = "";
	protected String moduleType = "";
	
	protected String moduleId;
	protected String itemId;
	protected String value;
	protected String score;
	protected String definition;
	public String eventName;
	
	protected HashMap<String, String> data;
	
	public abstract String getName();
	
	public HashMap<String, String> getData() {
		return new HashMap<String, String>();
	}
}
