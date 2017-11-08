package com.lorepo.icplayer.client.content.services;

import com.lorepo.icplayer.client.IPlayerController;
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
	public void switchKeyboardNavigation(boolean isTTS) {
		controller.switchKeyboardNavigation(isTTS);
	}
	
	@Override
	public void checkAnswers() {
		pageController.checkAnswers();
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
	public void reset() {
		pageController.resetPageScore();
		pageController.sendResetEvent();
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
}
