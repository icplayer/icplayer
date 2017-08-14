package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

class PrevPageButton extends PushButton implements IWCAG {
	private IPlayerServices services = null;
	
	public PrevPageButton(IPlayerServices services){
		
		setStyleName("ic_button_prevpage");

		if(services != null){
			this.services = services;
			if(services.getCurrentPageIndex() == 0){
				setEnabled(false);
			}
	
			addClickHandler(new ClickHandler() {
				public void onClick(ClickEvent event) {
					event.stopPropagation();
					event.preventDefault();
					execute();
				}
			});
		}
	}

	public void execute() {
		IPlayerCommands playerCommands = services.getCommands();
		playerCommands.prevPage();
	}
	
	@Override
	public void enter(boolean isExiting) {
		this.execute();
	}

	@Override
	public void space() {
	}

	@Override
	public void tab() {
	}

	@Override
	public void left() {
	}

	@Override
	public void right() {
	}

	@Override
	public void down() {
	}

	@Override
	public void up() {
	}

	@Override
	public void escape() {
	}
}
