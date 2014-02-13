package com.lorepo.icplayer.client;

import java.util.HashMap;

import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.api.player.IStateService;
import com.lorepo.icplayer.client.ui.PlayerView;

public interface IPlayerController {

	IContent getModel();
	IScoreService getScoreService();
	int getCurrentPageIndex();
	IStateService getStateService();
	void switchToPage(String pageName);
	void switchToPage(int index);
	void switchToPrevPage();
	void switchToNextPage();
	long getTimeElapsed();
	PlayerView getView();
	void showPopup(String pageName);
	void closePopup();
	void sendAnalytics(String event, HashMap<String, String> params);
	boolean isBookMode();
	boolean hasCover();
	boolean isPopupEnabled();
	void setPopupEnabled(boolean enabled);
}
