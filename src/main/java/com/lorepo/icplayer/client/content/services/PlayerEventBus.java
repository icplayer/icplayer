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
		setPlayerState(event);

		super.fireEvent(event);
	}

	@Override
	public void fireEvent(GwtEvent<?> event) {
		checkIfEventTypeIsEnabled(event);
		setPlayerState(event);

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
		setPlayerState(event);

		super.fireEventFromSource(event, source);
	}

	private void setPlayerState(Event<?> event) {
		if (this.playerServices != null) {
			String name = getEventName(event);
			IPlayerStateService playerStateService = this.playerServices.getPlayerStateService();

			switch (name) {
				case WorkModeEvent.NAME:
				case ResetPageEvent.NAME:
					playerStateService.setWorkMode();
					break;
				case ShowErrorsEvent.NAME:
					playerStateService.setCheckErrorsMode(true);
					break;
				case GradualShowAnswerEvent.NAME:
					playerStateService.setGradualShowAnswersMode(true);
					break;
				case ValueChangedEvent.NAME:
					if (event instanceof ValueChangedEvent) {
						String value = ((ValueChangedEvent) event).getValue();
						if (value != null && value.equals("LimitedShowAnswers")) {
							playerStateService.setLimitedShowAnswersMode(true);
						} else if (value != null && value.equals("LimitedHideAnswers")) {
							playerStateService.setLimitedShowAnswersMode(false);
						}
					}
				case "LimitedHideAnswers":
					playerStateService.setLimitedShowAnswersMode(false);
					break;
				case "LimitedShowAnswers":
					playerStateService.setLimitedShowAnswersMode(true);
					break;
				default:
					break;
			}
		}
	}

	public void setPlayerServices(PlayerServices playerServices) {
		this.playerServices = playerServices;
	}
}
