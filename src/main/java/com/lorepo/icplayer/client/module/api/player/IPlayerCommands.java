package com.lorepo.icplayer.client.module.api.player;

import com.lorepo.icplayer.client.page.PageController;


public interface IPlayerCommands {

	public void checkAnswers();
	public void uncheckAnswers();
	public void reset();
	public void updateCurrentPageScore(boolean incrementCheckCounter);
	public void resetPageScore();
	public PageScore getCurrentPageScore();
	public long getTimeElapsed();

	public void	nextPage();
	public void	prevPage();
	public void	gotoPage(String name);
	public void	gotoPageIndex(int index);
	public void	gotoPageId(String pageId);
	//public void showPopup(String pageName, String additinalClasses);
	public void closePopup();

	public void executeEventCode(String code);
	
	public void sendPageAllOkOnValueChanged(boolean sendEvent);
	public PageController getPageController();
	public void setNavigationPanelsAutomaticAppearance(boolean shouldAppear);
	public void showNavigationPanels();
	public void hideNavigationPanels();
	void incrementCheckCounter();
	void increaseMistakeCounter();
	public void gotoCommonPage(String commonsPageName);
	public void gotoCommonPageId(String id);
	void showPopup(String pageName, String top, String left, String additionalClasses);
	void updateCurrentPageScoreWithMistakes(int mistakes);
	int getIframeScroll();
	void changeHeaderVisibility(boolean isVisible);
	void changeFooterVisibility(boolean isVisible);
}
