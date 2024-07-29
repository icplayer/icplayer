package com.lorepo.icplayer.client.module.api.player;

public interface IPlayerCommands {

	public void checkAnswers();
	public void checkAnswers(boolean updateCounters);
	public void uncheckAnswers();
	void showAnswers(String source);
	void hideAnswers(String source);
	boolean showNextAnswer(String worksWith);
	void hideGradualAnswers();
	public void reset(boolean onlyWrongAnswers);
	public void resetPage(int index);
	public void resetPageById(String id);
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
	public void setAllPagesAsVisited();
	public void executeEventCode(String code);
	
	public void sendPageAllOkOnValueChanged(boolean sendEvent);
	public IPageController getPageController();
	public void setNavigationPanelsAutomaticAppearance(boolean shouldAppear);
	public void showNavigationPanels();
	public void hideNavigationPanels();
	void incrementCheckCounter();
	void increaseMistakeCounter();
	public void gotoCommonPage(String commonsPageName);
	public void gotoCommonPageId(String id);
	void showPopup(String pageName, String top, String left, String additionalClasses);
	void updateCurrentPageScoreWithMistakes(int mistakes);
	void switchKeyboardNavigationToModule(String moduleId);
	int getIframeScroll();
	
	void goToLastVisitedPage();

	void changeHeaderVisibility(boolean isVisible);
	void changeFooterVisibility(boolean isVisible);
	void enableKeyboardNavigation();
	void disableKeyboardNavigation();
	
	public String getPageStamp();
}
