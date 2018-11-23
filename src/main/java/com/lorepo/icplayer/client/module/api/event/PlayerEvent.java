package com.lorepo.icplayer.client.module.api.event;

import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;

public abstract class PlayerEvent <H extends EventHandler> extends GwtEvent<H> {
	protected String pageId = "";
	
	public abstract String getName();
	
	public String getPageId() {
		return this.pageId;
	}
	
	public void setPageId(String pageId) {
		this.pageId = pageId;
	}
}
