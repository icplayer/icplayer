package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.button.ButtonPresenter.IDisplay;

class PopupButton extends PushButton{

	private final IPlayerServices playerServices;
	public PopupButton(final String popupName, final IDisplay view, final IPlayerCommands pageService, final String additionalClasses, IPlayerServices services, final ButtonModule module){
		this.playerServices = services;
		setStyleName("ic_button_popup");
		addClickHandler(new ClickHandler() {
			
			@Override
			public void onClick(ClickEvent event) {
				event.stopPropagation();
				event.preventDefault();
				if (!view.isErrorCheckingMode()) {
					pageService.showPopup(popupName, additionalClasses);
					ValueChangedEvent valueEvent = new ValueChangedEvent(module.getId(), "", "clicked", "");
					playerServices.getEventBus().fireEvent(valueEvent);
				}
			}
		});
		
	}
}
