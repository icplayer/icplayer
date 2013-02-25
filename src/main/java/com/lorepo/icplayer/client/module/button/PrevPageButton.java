package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

class PrevPageButton extends PushButton{

	public PrevPageButton(IPlayerServices services){
		
		setStyleName("ic_button_prevpage");

		if(services != null){

			final IPlayerCommands playerCommands = services.getCommands();
			if(services.getCurrentPageIndex() == 0){
				setEnabled(false);
			}
	
			addClickHandler(new ClickHandler() {
				
				@Override
				public void onClick(ClickEvent event) {
	
					playerCommands.prevPage();
				}
			});
		}
	}
}
