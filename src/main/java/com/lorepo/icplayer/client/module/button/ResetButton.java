package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;


class ResetButton extends PushButton{

	public ResetButton(final IPlayerCommands pageService){
		
		setStyleName("ic_button_reset");

		addClickHandler(new ClickHandler() {
			
			@Override
			public void onClick(ClickEvent event) {

				pageService.reset();
			}
		});
		
	}
}
