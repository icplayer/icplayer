package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

public abstract class ExecutableButton extends PushButton {
	protected IPlayerServices playerServices;
	
	public ExecutableButton(IPlayerServices playerServices) {
		this.playerServices = playerServices;
		
		addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {

				event.stopPropagation();
				event.preventDefault();
				execute();
			}
		});
		
	}
	
	public abstract void execute();
	
}
