package com.lorepo.icplayer.client.module.button;

import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

class NextPageButton extends ExecutableButton {
	public NextPageButton(IPlayerServices services){
		super(services);
		
		setStyleName("ic_button_nextpage");

		if(services != null){
			IContent contentModel = services.getModel();
			
			if(services.getCurrentPageIndex()+1 == contentModel.getPageCount()){
				setEnabled(false);
			}
		}
	}
	
	public void execute() {
		IPlayerCommands playerCommands = this.playerServices.getCommands();
		playerCommands.nextPage();
	}
}
