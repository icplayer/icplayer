package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;

class PopupButton extends PushButton{

	public PopupButton(final String popupName, final IPlayerCommands pageService){
		
		setStyleName("ic_button_popup");

		addClickHandler(new ClickHandler() {
			
			@Override
			public void onClick(ClickEvent event) {

				pageService.showPopup(popupName);
			}
		});
		
	}
}
