package com.lorepo.icplayer.client.page.mockup;

import java.util.HashMap;

import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.content.services.ScoreService;
import com.lorepo.icplayer.client.content.services.StateService;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.api.player.IStateService;
import com.lorepo.icplayer.client.ui.PlayerView;

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
	public PlayerView getView() {
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


	@Override
	public void sendAnalytics(String event, HashMap<String, String> params) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public boolean isBookMode() {
		// TODO Auto-generated method stub
		return false;
	}


	@Override
	public boolean hasCover() {
		// TODO Auto-generated method stub
		return false;
	}

    @java.lang.Override
    public boolean isPopupEnabled() {
        // TODO Auto-generated method stub
        return false;
    }

    @java.lang.Override
    public void setPopupEnabled(boolean enabled) {
        // TODO Auto-generated method stub
    }


    @Override
	public void switchToPage(int index) {
		// TODO Auto-generated method stub
		
	}

}
