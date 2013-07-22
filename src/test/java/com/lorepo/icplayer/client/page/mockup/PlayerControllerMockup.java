package com.lorepo.icplayer.client.page.mockup;

import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.content.services.ScoreService;
import com.lorepo.icplayer.client.content.services.StateService;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.api.player.IStateService;

public class PlayerControllerMockup implements IPlayerController {

	private IScoreService	scoreService;
	private StateService	stateService;

	public PlayerControllerMockup() {
		scoreService = new ScoreService();
		stateService = new StateService();
	}
	
	
	@Override
	public IContent getModel() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public IScoreService getScoreService() {
		return scoreService;
	}

	@Override
	public int getCurrentPageIndex() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public IStateService getStateService() {
		return stateService;
	}

	@Override
	public void switchToPage(String pageName) {
		// TODO Auto-generated method stub

	}

	@Override
	public void switchToPrevPage() {
		// TODO Auto-generated method stub

	}

	@Override
	public void switchToNextPage() {
		// TODO Auto-generated method stub

	}

	@Override
	public long getTimeElapsed() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public Widget getView() {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}


	@Override
	public void showPopup(String pageName) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void closePopup() {
		// TODO Auto-generated method stub
		
	}

}
