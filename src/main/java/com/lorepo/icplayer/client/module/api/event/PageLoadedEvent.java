package com.lorepo.icplayer.client.module.api.event;

import java.util.HashMap;

import com.google.gwt.event.shared.EventHandler;
import com.lorepo.icplayer.client.module.api.event.PageLoadedEvent.Handler;

public class PageLoadedEvent extends PlayerEvent<Handler> {

	public final String pageName;
	public static Type<Handler> TYPE = new Type<Handler>();

	public interface Handler extends EventHandler {
		void onPageLoaded(PageLoadedEvent event);
	}

	public PageLoadedEvent(String name) {
		pageName = name;
	}
	
	@Override
	public String getName() {
		return "PageLoaded";
	}

	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onPageLoaded(this);
	}

	@Override
	public HashMap<String, String> getData() {
		HashMap<String, String> data = new HashMap<String, String>();
		data.put("source", pageName);
		return data;
	}
}

