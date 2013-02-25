package com.lorepo.icplayer.client.module.api.event;

import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent.Handler;

/**
 * Event wysyłany gdy zostanie wcisnięty przycisk pokaż błędy
 * 
 * @author Krzysztof Langner
 *
 */
public class ShowErrorsEvent extends GwtEvent<Handler> {

	public interface Handler extends EventHandler {
		void onShowErrors(ShowErrorsEvent event);
	}
	
	public static Type<Handler> TYPE = new Type<Handler>();

	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onShowErrors(this);
	}
	
}

