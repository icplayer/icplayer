package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;


class StandardButton extends PushButton{

	private ButtonModule module;
	private IPlayerServices services;
	
	public StandardButton(ButtonModule module, IPlayerServices playerServices){
		
		this.module = module;
		this.services = playerServices;
		
		setStyleName("ic_button_standard");

		addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {
				event.stopPropagation();
				event.preventDefault();
				sendEvent();
			}
		});
		
	}

	protected void sendEvent() {
		String code = module.getOnClick().trim();
		if(!code.isEmpty() && services != null){
			services.getCommands().executeEventCode(code);
		}
	}
}
