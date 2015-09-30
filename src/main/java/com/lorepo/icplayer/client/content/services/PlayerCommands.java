package com.lorepo.icplayer.client.content.services;

import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.PageScore;
import com.lorepo.icplayer.client.page.PageController;

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
	public void showPopup(String pageName, String additionalClasses) {
		controller.showPopup(pageName, additionalClasses);
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
}
