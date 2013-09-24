package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

class GotoPageButton extends PushButton{

	
	public GotoPageButton(final String pageName, IPlayerServices services){
		
		setStyleName("ic_button_gotopage");

		if(services != null){

			final IPlayerCommands playerCommands = services.getCommands();
			addClickHandler(new ClickHandler() {
				public void onClick(ClickEvent event) {
	
					event.stopPropagation();
					event.preventDefault();
					playerCommands.gotoPage(pageName);
				}
			});
		}
		
	}
}
