package com.lorepo.icplayer.client.module.api.event;

import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent.Handler;

/**
 * Event wysyłany gdy zostanie wcisnięty przycisk reset na stronie.
 * W wyniku tego eventu resetowane są ćwiczenia
 * 
 * @author Krzysztof Langner
 *
 */
public class ResetPageEvent extends GwtEvent<Handler> {

	public interface Handler extends EventHandler {
		void onResetPage(ResetPageEvent event);
	}
	
	public static Type<Handler> TYPE = new Type<Handler>();

	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onResetPage(this);
	}
	
}

