package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

class NextPageButton extends PushButton implements IWCAG {
	private IPlayerServices services = null;
	
	
	public NextPageButton(IPlayerServices services){
		setStyleName("ic_button_nextpage");

		if(services != null){
			this.services = services;
			IContent contentModel = services.getModel();
			
			if(services.getCurrentPageIndex()+1 == contentModel.getPageCount()){
				setEnabled(false);
			}
			
			addClickHandler(new ClickHandler() {
				
				@Override
				public void onClick(ClickEvent event) {
					execute();
					
					event.stopPropagation();
					event.preventDefault();
					
				}
			});
		}
	}
	
	public void execute() {
		IPlayerCommands playerCommands = this.services.getCommands();
		playerCommands.nextPage();
	}

	@Override
	public void enter() {
		this.execute();
		
	}
	
}
