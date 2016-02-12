package com.lorepo.icplayer.client.module.api.event;

import java.util.HashMap;

import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.shared.EventHandler;
import com.lorepo.icplayer.client.module.api.event.ModuleActivatedEvent.Handler;

public class ModuleActivatedEvent extends PlayerEvent<Handler> {

	public final String moduleName;
	public final String moduleStatus;
	public static Type<Handler> TYPE = new Type<Handler>();
	public final KeyDownEvent keyDownEvent;

	public interface Handler extends EventHandler {
		void onActivated(ModuleActivatedEvent event);
	}

	public ModuleActivatedEvent(String name, KeyDownEvent event) {
		moduleName = name;
		moduleStatus = Integer.toString(event.getNativeKeyCode());
		keyDownEvent = event;
	}
	
	@Override
	public String getName() {
		return moduleName;
	}

	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onActivated(this);
	}

	public KeyDownEvent getKeyDownEvent() {
		return keyDownEvent;
	}
	
	public HashMap<String, String> getData() {
		HashMap<String, String> data = new HashMap<String, String>();
		data.put("source", moduleName);
		data.put("value", moduleStatus);
		return data;
	}
}

