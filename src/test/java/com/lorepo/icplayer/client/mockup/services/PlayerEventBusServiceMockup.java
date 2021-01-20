package com.lorepo.icplayer.client.mockup.services;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icplayer.client.content.services.PlayerEventBus;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerEventBusService;

public class PlayerEventBusServiceMockup implements IPlayerEventBusService {
	private PlayerEventBus eventBus;
	
	public PlayerEventBusServiceMockup(EventBus eventBus) {
		this.eventBus = new PlayerEventBus(eventBus);
	}

	@Override
	public PlayerEventBus getEventBus() {
		return this.eventBus;
	}

	@Override
	public void resetEventBus() { }

	@Override
	public void sendEvent(String eventName, JavaScriptObject eventData) {	}

	@Override
	public void sendValueChangedEvent(String moduleType, String moduleID, String itemID, String value, String score) {
		ValueChangedEvent event = new ValueChangedEvent(moduleID, itemID, value, score);
		this.eventBus.fireEvent(event);
	}

	@Override
	public void addEventListener(String eventName, JavaScriptObject listener, boolean isDelayed) { 	}

}
