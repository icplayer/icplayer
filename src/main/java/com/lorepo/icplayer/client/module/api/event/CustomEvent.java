package com.lorepo.icplayer.client.module.api.event;

import java.util.HashMap;

import com.google.gwt.event.shared.EventHandler;
import com.lorepo.icplayer.client.module.api.event.CustomEvent.Handler;

/**
 * Event wysyłany gdy strona zostanie załadowana
 * 
 * @author Krzysztof Langner
 *
 */
public class CustomEvent extends PlayerEvent<Handler> {

	public final String eventName;
	private HashMap<String, String> data;
	
	public interface Handler extends EventHandler {
		void onCustomEventOccurred(CustomEvent event);
	}
	
	public static Type<Handler> TYPE = new Type<Handler>();

	public CustomEvent(String name, HashMap<String, String> data) {
		eventName = name;
		this.data = data;
	}
	
	@Override
	public String getName() {
		return eventName;
	}

	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onCustomEventOccurred(this);
	}

	@Override
	public HashMap<String, String> getData() {
		return data;
	}
}

