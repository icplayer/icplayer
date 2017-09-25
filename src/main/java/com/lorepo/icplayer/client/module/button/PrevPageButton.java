package com.lorepo.icplayer.client.module.button;

import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

class PrevPageButton extends ExecutableButton {
	boolean goToLastVisitedPage = false;
	
	public PrevPageButton(IPlayerServices services, final boolean goToLastPage){
		super(services);
		
		setStyleName("ic_button_prevpage");

		if(services != null) {
			this.goToLastVisitedPage = goToLastPage;
			
			if(services.getCurrentPageIndex() == 0 && !goToLastPage) {
				setEnabled(false);
			}
			
		}
	}

	public void execute() {
		IPlayerCommands playerCommands = this.playerServices.getCommands();
		if(!this.goToLastVisitedPage) {
			playerCommands.prevPage();
		}
		else {
			playerCommands.goToLastVisitedPage();
		}
	}
}
