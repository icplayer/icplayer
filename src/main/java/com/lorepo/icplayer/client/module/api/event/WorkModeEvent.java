package com.lorepo.icplayer.client.module.api.event;

import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent.Handler;

/**
 * Event wysyłany gdy strona przejdzie w tryb normalnej pracy po wcisnieciu przycisku
 * ShowError lub ShowAnswers
 * 
 * @author Krzysztof Langner
 *
 */
public class WorkModeEvent extends GwtEvent<Handler> {

	public interface Handler extends EventHandler {
		void onWorkMode(WorkModeEvent event);
	}
	
	public static Type<Handler> TYPE = new Type<Handler>();

	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onWorkMode(this);
	}
	
}

