package com.lorepo.icplayer.client.module.api.event;

import com.google.gwt.event.shared.EventHandler;
import com.lorepo.icplayer.client.module.api.event.ResizeWindowEvent.Handler;

public class ResizeWindowEvent extends PlayerEvent<Handler> {

	public static Type<Handler> TYPE = new Type<Handler>();

	public interface Handler extends EventHandler {
		void onResizeWindowEvent(ResizeWindowEvent event);
	}

	@Override
	public String getName() {
		return "ResizeWindow";
	}

	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onResizeWindowEvent(this);
	}
}

