package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icplayer.client.IPlayerController.PageType;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

class PrevPageButton extends PushButton{
	boolean goToLastVisitedPage;
	
	public PrevPageButton(IPlayerServices services, final boolean goToLastPage){
		this.goToLastVisitedPage = goToLastPage;
		
		setStyleName("ic_button_prevpage");

		if(services != null){

			final IPlayerCommands playerCommands = services.getCommands();
			
			if(!goToLastPage && services.getCurrentPageIndex() == 0) {
				setEnabled(false);
			}
	
			addClickHandler(new ClickHandler() {
				public void onClick(ClickEvent event) {
					event.stopPropagation();
					event.preventDefault();
					if(!goToLastVisitedPage) {
    					playerCommands.prevPage();
					}
					else {
						playerCommands.goToLastVisitedPage();
					}
				}
			});
		}
	}
}
