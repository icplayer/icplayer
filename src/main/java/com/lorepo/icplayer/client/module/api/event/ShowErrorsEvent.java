package com.lorepo.icplayer.client.module.api.event;

import com.google.gwt.event.shared.EventHandler;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent.Handler;

public class ShowErrorsEvent extends PlayerEvent<Handler> {

	public final static String NAME = "Check";

	public interface Handler extends EventHandler {
		void onShowErrors(ShowErrorsEvent event);
	}
	
	public static Type<Handler> TYPE = new Type<Handler>();

	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}
	
	@Override
	public String getName() {
		return NAME;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onShowErrors(this);
	}
}

