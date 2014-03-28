package com.lorepo.icplayer.client.content.services;

import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.PageScore;
import com.lorepo.icplayer.client.page.PageController;

public class PlayerCommands implements IPlayerCommands {

	private PageController	pageController;
	private IPlayerController	controller;
	
	
	public PlayerCommands(PageController pageController, IPlayerController controller){
	
		this.pageController = pageController;
		this.controller = controller;
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
	public void uncheckAnswers() {
		pageController.uncheckAnswers();
	}


	@Override
	public void reset() {
		pageController.reset();
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
	public void updateCurrentPageScore() {
		pageController.updateScore(false);
	}


	@Override
	public long getTimeElapsed() {
		return controller.getTimeElapsed();
	}
}
