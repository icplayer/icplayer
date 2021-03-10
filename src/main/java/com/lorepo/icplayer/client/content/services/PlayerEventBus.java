package com.lorepo.icplayer.client.content.services;

import java.util.Arrays;

import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.ResettableEventBus;
import com.google.web.bindery.event.shared.Event;
import com.google.web.bindery.event.shared.EventBus;
import com.lorepo.icplayer.client.PlayerConfig;
import com.lorepo.icplayer.client.module.api.IPlayerStateService;
import com.lorepo.icplayer.client.module.api.event.*;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemReturnedEvent.Handler;
import com.lorepo.icplayer.client.module.api.player.IGradualShowAnswersService;

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
		if (playerServices != null) {
			PlayerConfig config = playerServices.getPlayerConfig();

			if (Arrays.asList(config.getEvents().getDisabled()).contains(eventName)) {
				throw new RuntimeException();
			}
		}
	}
	
	@Override
	public void fireEvent(Event<?> event) {
		checkIfEventTypeIsEnabled(event);
		setPlayerState(event);

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
		setPlayerState(event);

		super.fireEventFromSource(event, source);
	}

	@Override
	public void fireEventFromSource(GwtEvent<?> event, Object source) {
		checkIfEventTypeIsEnabled(event);

		super.fireEventFromSource(event, source);
	}

	private void setPlayerState(Event<?> event) {
		if (this.playerServices != null) {
			String name = getEventName(event);
			IPlayerStateService playerStateService = this.playerServices.getPlayerStateService();

			// strings in switch are not supported in -source 1.6
			if (WorkModeEvent.NAME.equals(name)) {
				playerStateService.setWorkMode();
			} else if (ResetPageEvent.NAME.equals(name)) {
				playerStateService.switchOffModes();
			} else if (ShowErrorsEvent.NAME.equals(name)) {
				if (playerStateService.isGradualShowAnswersMode()) {
					this.playerServices.getCommands().hideGradualAnswers();
				}
				playerStateService.setCheckErrorsMode(true);
			} else if (GradualShowAnswerEvent.NAME.equals(name)) {
				playerStateService.setGradualShowAnswersMode(true);
			} else if (GradualHideAnswerEvent.NAME.equals(name)) {
				playerStateService.setGradualShowAnswersMode(false);
			} else if (ValueChangedEvent.NAME.equals(name)) {
				if (event instanceof ValueChangedEvent) {
					String value = ((ValueChangedEvent) event).getValue();
					if (value != null && value.equals("LimitedShowAnswers")) {
						playerStateService.setLimitedShowAnswersMode(true);
					} else if (value != null && value.equals("LimitedHideAnswers")) {
						playerStateService.setLimitedShowAnswersMode(false);
					}
				}
			} else if ("HideAnswers".equals(name)) {
				playerStateService.setShowAnswersMode(false);
			} else if ("ShowAnswers".equals(name)) {
				if (playerStateService.isGradualShowAnswersMode()) {
					this.playerServices.getCommands().hideGradualAnswers();
				}
				playerStateService.setShowAnswersMode(true);
			}
		}
	}

	public void setPlayerServices(PlayerServices playerServices) {
		this.playerServices = playerServices;
	}
}
