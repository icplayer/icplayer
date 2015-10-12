package com.lorepo.icplayer.client.module.api.event;

import com.google.gwt.event.shared.EventHandler;
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent.Handler;

public class WorkModeEvent extends PlayerEvent<Handler> {

	public interface Handler extends EventHandler {
		void onWorkMode(WorkModeEvent event);
	}
	
	public static Type<Handler> TYPE = new Type<Handler>();

	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}
	
	@Override
	public String getName() {
		return "Uncheck";
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onWorkMode(this);
	}
}

