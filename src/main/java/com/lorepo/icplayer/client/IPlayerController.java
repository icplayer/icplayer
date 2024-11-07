package com.lorepo.icplayer.client;

import java.util.HashMap;
import java.util.Set;

import com.lorepo.icplayer.client.metadata.IScoreWithMetadataService;
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


public interface IPlayerController {
	IContent getModel();
	PlayerConfig getPlayerConfig();
	IScoreService getScoreService();
	IAssetsService getAssetsService();
	ITimeService getTimeService();
	IReportableService getReportableService();
	IAdaptiveLearningService getAdaptiveLearningService();
	IScoreWithMetadataService getScoreWithMetadataService();
	int getCurrentPageIndex();
	IStateService getStateService();
	void switchToPage(String pageName);
	void switchToPage(int index);
	void switchToPageById(String pageId);
	void switchToPrevPage();
	void switchToNextPage();
	void setAllPagesAsVisited();
	long getTimeElapsed();
	PlayerView getView();
	void closePopup();
	void sendAnalytics(String event, HashMap<String, String> params);
	boolean isBookMode();
	boolean hasCover();
	boolean isPopupEnabled();
	void setPopupEnabled(boolean enabled);
	IPresenter findHeaderModule(String name);
	IPresenter findFooterModule(String name);
	void switchToCommonPage(String commonPageName);
	void switchToCommonPageById (String id);
	void showPopup(String pageName, String top, String left, String additionalClasses);
	void fireOutstretchHeightEvent();
	int getIframeScroll();
	void switchToLastVisitedPage();
	String getLang();
	void enableKeyboardNavigation();
	void disableKeyboardNavigation();
	void switchKeyboardNavigationToModule(String moduleId);
	boolean isPlayerInCrossDomain();
	Set<IPage> getVisitedPages();
	void clearVisitedPages();
	void sendExternalEvent(String eventType, String data);
	String getCurrentPageId();
	void setExternalVariable(String key, String value);
	String getExternalVariable(String key);
	void updateMathJaxInCurrentPage();

	String getPageStamp();
}
