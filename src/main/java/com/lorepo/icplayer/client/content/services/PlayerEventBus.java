package com.lorepo.icplayer.client.content.services;

import java.util.Arrays;

import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.ResettableEventBus;
import com.google.web.bindery.event.shared.Event;
import com.google.web.bindery.event.shared.EventBus;
import com.lorepo.icplayer.client.PlayerConfig;
import com.lorepo.icplayer.client.module.api.event.PlayerEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemReturnedEvent.Handler;

public class PlayerEventBus extends ResettableEventBus {
	private PlayerServices playerServices;

	public PlayerEventBus(EventBus wrappedBus) {
		super(wrappedBus);
	}
	
	private String getEventName(Event<?> event) {
		if (!(event instanceof PlayerEvent<?>)) {
			return "";
		}
		
		@SuppressWarnings("unchecked")
		PlayerEvent<Handler> playerEvent = (PlayerEvent<Handler>) event;
		
		return playerEvent.getName();
	}
	
	private void checkIfEventTypeIsEnabled(Event<?> event) {
		String eventName = getEventName(event);
		PlayerConfig config = playerServices.getPlayerConfig();

		if (Arrays.asList(config.getEvents().getDisabled()).contains(eventName)) {
			throw new RuntimeException();
		}
	}
	
	@Override
	public void fireEvent(Event<?> event) {
		checkIfEventTypeIsEnabled(event);

		super.fireEvent(event);
	}

	@Override
	public void fireEvent(GwtEvent<?> event) {
		checkIfEventTypeIsEnabled(event);
		
		super.fireEvent(event);
	}

	@Override
	public void fireEventFromSource(Event<?> event, Object source) {
		checkIfEventTypeIsEnabled(event);

		super.fireEventFromSource(event, source);
	}

	@Override
	public void fireEventFromSource(GwtEvent<?> event, Object source) {
		checkIfEventTypeIsEnabled(event);

		super.fireEventFromSource(event, source);
	}

	public void setPlayerServices(PlayerServices playerServices) {
		this.playerServices = playerServices;
	}
}
