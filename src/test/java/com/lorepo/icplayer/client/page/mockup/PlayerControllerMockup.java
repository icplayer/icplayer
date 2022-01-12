package com.lorepo.icplayer.client.page.mockup;

import java.util.HashMap;
import java.util.Set;

import com.lorepo.icplayer.client.metadata.IScoreWithMetadataService;
import org.mockito.Mockito;

import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.PlayerConfig;
import com.lorepo.icplayer.client.content.services.ScoreService;
import com.lorepo.icplayer.client.content.services.StateService;
import com.lorepo.icplayer.client.content.services.TimeService;
import com.lorepo.icplayer.client.mockup.services.AdaptiveLearningServiceMockup;
import com.lorepo.icplayer.client.model.Content.ScoreType;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.player.IAdaptiveLearningService;
import com.lorepo.icplayer.client.module.api.player.IAssetsService;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IReportableService;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.api.player.IStateService;
import com.lorepo.icplayer.client.module.api.player.ITimeService;
import com.lorepo.icplayer.client.ui.PlayerView;

public class PlayerControllerMockup implements IPlayerController {

	private IScoreService	scoreService;
	private ITimeService	timeService;
	private StateService	stateService;
	private AdaptiveLearningServiceMockup adaptiveLearningService;

	public PlayerControllerMockup() {
		scoreService = new ScoreService(ScoreType.last);
		stateService = new StateService();
		timeService = new TimeService();
		adaptiveLearningService = new AdaptiveLearningServiceMockup();
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
	public void showPopup(String pageName, String top, String left,
			String additionalClasses) {
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


	@Override
	public void switchToPageById(String pageId) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public IPresenter findFooterModule(String id) {
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	public IPresenter findHeaderModule(String id) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public IAssetsService getAssetsService() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public PlayerConfig getPlayerConfig() {
		PlayerConfig mockedConfig = Mockito.mock(PlayerConfig.class);
		PlayerConfig.Events mockedEventsConfig = Mockito.mock(PlayerConfig.Events.class);
		
		Mockito.when(mockedConfig.getEvents()).thenReturn(mockedEventsConfig);
		Mockito.when(mockedEventsConfig.getDisabled()).thenReturn(new String[0]);

		return mockedConfig;
	}
	
	@Override
	public void switchToCommonPage(String commonPageName) {
		// TODO Auto-generated method stub
	}


	@Override
	public ITimeService getTimeService() {
		return timeService;
	}


	@Override
	public void fireOutstretchHeightEvent() {
		// TODO Auto-generated method stub
		
	}


	@Override
	public int getIframeScroll() {
		// TODO Auto-generated method stub
		return 0;
	}


	@Override
	public IReportableService getReportableService() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public void switchToLastVisitedPage() {
		// TODO Auto-generated method stub
		
	}

	public void switchToCommonPageById(String id) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void enableKeyboardNavigation() {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void disableKeyboardNavigation() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void switchKeyboardNavigationToModule(String moduleId) {

	}


	@Override
	public String getPageStamp() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public String getLang() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public boolean isPlayerInCrossDomain() {
		return false;
	}


	@Override
	public Set<IPage> getVisitedPages() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void clearVisitedPages() {

	}


	@Override
	public IAdaptiveLearningService getAdaptiveLearningService() {
		return this.adaptiveLearningService;
	}

	@Override
	public IScoreWithMetadataService getScoreWithMetadataService() {
		return null;
	}


	@Override
	public String getCurrentPageId() {
		return null;
	}


	@Override
	public void sendExternalEvent(String eventType, String data) {
		// TODO Auto-generated method stub

	}

	@Override
	public void setExternalVariable(String key, String value){
		// TODO Auto-generated method stub
	}

	@Override
	public String getExternalVariable(String key){
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setAllPagesAsVisited() {

	}
}
