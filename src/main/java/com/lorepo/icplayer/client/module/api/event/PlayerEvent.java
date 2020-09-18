package com.lorepo.icplayer.client.module.api.event;

import java.util.HashMap;

import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;

public abstract class PlayerEvent <H extends EventHandler> extends GwtEvent<H> {
	public abstract String getName();
	protected String pageID = "";
	protected String moduleType = "";
	protected String pageAdaptiveStep = "";

	public HashMap<String, String> getData() {
		return new HashMap<String, String>();
	}
	
	public void setPageID(String pageID) {
		this.pageID = pageID;
	}
	
	public void setModuleType(String moduleType) {
		this.moduleType = moduleType;
	}
	
	public void setPageAdaptiveStep(String pageAdaptiveStep) {
		this.pageAdaptiveStep = pageAdaptiveStep;
	}
}
