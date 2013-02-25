package com.lorepo.icplayer.client.module.api.event;

import java.util.HashMap;

import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.lorepo.icplayer.client.module.api.event.PageLoadedEvent.Handler;

/**
 * Event wysyłany gdy strona zostanie załadowana
 * 
 * @author Krzysztof Langner
 *
 */
public class PageLoadedEvent extends GwtEvent<Handler> {

	public interface Handler extends EventHandler {
		void onPageLoaded(PageLoadedEvent event);
	}
	
	public static Type<Handler> TYPE = new Type<Handler>();

	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onPageLoaded(this);
	}
	
	public HashMap<String, String> getData() {
		HashMap<String, String> data = new HashMap<String, String>();
		return data;
	}
}

