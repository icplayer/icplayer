package com.lorepo.icplayer.client.mockup.services;

import com.lorepo.icplayer.client.module.api.player.IPageController;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.PageScore;

public class CommandsMockup implements IPlayerCommands {

	private float score = 34;
	private float maxScore = 50;
	private int errorCount = 13;
	private String lastCode;
	
	private String command;
	
	@Override
	public void checkAnswers() {
	}

	@Override
	public void checkAnswers(boolean updateCounters) {
	}

	@Override
	public void uncheckAnswers() {
	}

	@Override
	public void showAnswers(String source) {

	}

	@Override
	public void hideAnswers(String source) {

	}

	@Override
	public boolean showNextAnswer(String worksWiths) {
		return false;
	}

	@Override
	public void hideGradualAnswers() {

	}

	@Override
	public void reset(boolean onlyWrongAnswers) {
	}

	@Override
	public PageScore getCurrentPageScore() {
		PageScore pageScore = new PageScore(score, maxScore, 0, errorCount, 0);
		return pageScore;
	}

	@Override
	public void showPopup(String pageName, String top, String left,
			String additionalClasses) {
	}

	@Override
	public void closePopup() {
	}

	@Override
	public void nextPage() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void prevPage() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void gotoPage(String name) {
		command = "gotoPage: " + name;
	}
	
	public String getCommand(){
		return command;
	}

	@Override
	public void executeEventCode(String code) {
		lastCode = code;
	}
	
	public String getLastCode(){
		return lastCode;
	}

	@Override
	public void updateCurrentPageScore(boolean incrementCheckCounter) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public long getTimeElapsed() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public void gotoPageIndex(int index) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void gotoPageId(String pageId) {
		// TODO Auto-generated method stub
		
	}
	
	@Override
	public void sendPageAllOkOnValueChanged(boolean sendEvent) {
		// TODO Auto-generated method stub
	}

	@Override
	public IPageController getPageController() {
		return new PageControllerMockup();
	}

	@Override
	public void setNavigationPanelsAutomaticAppearance(boolean shouldAppear) {
		// TODO Auto-generated method stub
		
	}
	
	@Override
	public void showNavigationPanels() {
		// TODO Auto-generated method stub
		
	}
	
	@Override
	public void hideNavigationPanels() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void resetPageScore() {
	}

	@Override
	public void incrementCheckCounter() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void increaseMistakeCounter() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void gotoCommonPage(String commonsPageName) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void updateCurrentPageScoreWithMistakes(int mistakes) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void switchKeyboardNavigationToModule(String moduleId) {

	}

	@Override
	public int getIframeScroll() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public void goToLastVisitedPage() {
		// TODO Auto-generated method stub
		
	}

	public void changeHeaderVisibility(boolean isVisible) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void changeFooterVisibility(boolean isVisible) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void gotoCommonPageId(String id) {
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
	public String getPageStamp() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void resetPage(int index) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void resetPageById(String id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void setAllPagesAsVisited() {}

}
