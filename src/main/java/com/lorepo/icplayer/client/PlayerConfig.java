package com.lorepo.icplayer.client;

import com.lorepo.icplayer.client.PlayerApp.PlayerConfigOverlay;
import com.lorepo.icplayer.client.PlayerApp.PlayerEventsConfigOverlay;

public class PlayerConfig {
	private Events events = new Events();
	
	public Events getEvents() {
		return events;
	}
	
	public class Events {
		private String[] disabled = new String[0];
		
		public String[] getDisabled() {
			return disabled;
		}
		
		public void fromOverlay(PlayerEventsConfigOverlay overlayConfig) {
			disabled = overlayConfig.getDisabled();
		}
	}
	
	public static PlayerConfig fromOverlay(PlayerConfigOverlay overlayConfig) {
		PlayerConfig config = new PlayerConfig();
		
		config.events = config.new Events();
		config.events.fromOverlay(overlayConfig.getEvents());
		
		return config;
	}
}
