package com.lorepo.icplayer.client.content.services;

import com.google.gwt.core.client.JavaScriptObject;
import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.PageScore;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.page.PageView;

public class PlayerCommands implements IPlayerCommands {

	private final PageController	pageController;
	private final IPlayerController	controller;

	public PlayerCommands(PageController pageController, IPlayerController controller){
		this.pageController = pageController;
		this.controller = controller;
	}

	@Override
	public void sendPageAllOkOnValueChanged(boolean sendEvent) {
		this.pageController.sendPageAllOkOnValueChanged(sendEvent);
	}

	@Override
	public void showPopup(String pageName, String top, String left, String additionalClasses) {
		controller.showPopup(pageName, top, left, additionalClasses);
	}

	@Override
	public void closePopup() {
		controller.closePopup();
	}

	@Override
	public void checkAnswers() {
		pageController.checkAnswers();
	}

	@Override
	public void checkAnswers(boolean updateCounters) {
		pageController.checkAnswers(updateCounters);
	}
	
	@Override
	public void incrementCheckCounter() {
		pageController.incrementCheckCounter();
	}
	
	@Override
	public void increaseMistakeCounter() {
		pageController.increaseMistakeCounter();
	}

	@Override
	public void uncheckAnswers() {
		pageController.uncheckAnswers();
	}

	@Override
	public void showAnswers(String source) {
		pageController.showAnswers(source);
	}

	@Override
	public void hideAnswers(String source) {
		pageController.hideAnswers(source);
	}

	@Override
	public boolean showNextAnswer(String worksWith) {
		return this.pageController.getGradualShowAnswersService().showNext(worksWith);
	}

	@Override
	public void hideGradualAnswers() {
		this.pageController.getGradualShowAnswersService().hideAll();
	}

	@Override
	public void reset(boolean onlyWrongAnswers) {
		pageController.resetPageScore();
		pageController.sendResetEvent(onlyWrongAnswers);
		
		if (onlyWrongAnswers) {
			pageController.updateScore(false);
		}
	}
	
	public void resetPageById(String id) {
		for (IPage page: controller.getModel().getAllPages()) {
			if (page.getId().equals(id)) {
				resetPage(page);
			}
		}
	}
	
	@Override
	public void resetPage(int index) {
		IPage page = controller.getModel().getPage(index);
		resetPage(page);
	}
	
	private void resetPage(IPage page) {
		if (page == pageController.getPage()) {
			this.reset(false);
		} else {
			controller.getStateService().resetPageStates(page);			
			PageScore oldScore = controller.getScoreService().getPageScoreById(page.getId());
			PageScore newScore = oldScore.reset();
			controller.getScoreService().setPageScore(page, newScore);		
		}
	}

	@Override
	public void resetPageScore() {
		pageController.resetPageScore();
	}

	@Override
	public PageScore getCurrentPageScore() {
		return pageController.getPageScore();
	}

	@Override
	public void nextPage() {
		controller.switchToNextPage();
	}

	@Override
	public void prevPage() {
		controller.switchToPrevPage();
	}

	@Override
	public void gotoPage(String pageName) {
		controller.switchToPage(pageName);
	}
	
	@Override
	public void gotoCommonPage(String commonPageName) {
		controller.switchToCommonPage(commonPageName);
	}
	
	@Override
	public void gotoCommonPageId(String id) {
		controller.switchToCommonPageById(id);
	}

	@Override
	public void gotoPageIndex(int index) {
		controller.switchToPage(index);
	}

	@Override
	public void gotoPageId(String pageId) {
		controller.switchToPageById(pageId);
	}

	@Override
	public void executeEventCode(String code) {
		pageController.runScript(code);
	}

	@Override
	public void updateCurrentPageScoreWithMistakes(int mistakes) {
		pageController.updateScoreWithMistakes(mistakes);
	}

	@Override
	public void switchKeyboardNavigationToModule(String moduleId) {
		controller.switchKeyboardNavigationToModule(moduleId);
	}

	@Override
	public void updateCurrentPageScore(boolean incrementCheckCounter) {
		pageController.updateScore(incrementCheckCounter);
	}

	@Override
	public long getTimeElapsed() {
		return controller.getTimeElapsed();
	}

	@Override
	public PageController getPageController() {
		return pageController;
	}

	@Override
	public void setNavigationPanelsAutomaticAppearance(boolean shouldAppear) {
		controller.getView().setNavigationPanelsAutomaticAppearance(shouldAppear);
	}

	@Override
	public void showNavigationPanels() {
		controller.getView().showNavigationPanels();
	}

	@Override
	public void hideNavigationPanels() {
		controller.getView().hideNavigationPanels();
	}
	
	@Override
	public int getIframeScroll() {
		return controller.getIframeScroll();
	}

	@Override
	public void goToLastVisitedPage() {
		controller.switchToLastVisitedPage();
	}
	
	@Override
	public void enableKeyboardNavigation() {
		controller.enableKeyboardNavigation();
	}
	
	@Override
	public void disableKeyboardNavigation() {
		controller.disableKeyboardNavigation();
	}

	public void changeHeaderVisibility(boolean isVisible) {
		PageView headerView = this.controller.getView().getHeaderView();
		if (headerView != null) {
			headerView.setVisible(isVisible);
		}
		
	}

	@Override
	public void changeFooterVisibility(boolean isVisible) {
		PageView footerView = this.controller.getView().getFooterView();
		if (footerView != null) {
			footerView.setVisible(isVisible);
		}

	}
	
	@Override
	public String getPageStamp() {
		return controller.getPageStamp();
	}

	@Override
	public void setAllPagesAsVisited() {
		controller.setAllPagesAsVisited();
		pageController.getPlayerServices().getEventBusService().sendEvent("visitedPagesUpdate", JavaScriptObject.createObject());
	}
}