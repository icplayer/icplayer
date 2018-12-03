package com.lorepo.icplayer.client.module.api.event;

import java.util.HashMap;

import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;

public abstract class PlayerEvent <H extends EventHandler> extends GwtEvent<H> {
	public abstract String getName();

	public HashMap<String, String> getData() {
		return new HashMap<String, String>();
	}
}
