package com.lorepo.icplayer.client.module.api.player;

import com.google.gwt.core.client.JavaScriptObject;
import com.lorepo.icplayer.client.content.services.PlayerEventBus;

public interface IPlayerEventBusService {
	public PlayerEventBus getEventBus();
	
	public void resetEventBus();
	public void sendEvent(String eventName, JavaScriptObject eventData);
	// sendValueChangedEvent function needed because modules send events in different way than addons
	public void sendValueChangedEvent(String moduleType, String moduleID, String itemID, String value, String score);
	public void addEventListener(String eventName, JavaScriptObject listener, boolean isDelayed);
}
