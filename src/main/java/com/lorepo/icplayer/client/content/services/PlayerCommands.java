package com.lorepo.icplayer.client.content.services;

import com.lorepo.icplayer.client.AppController;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.PageScore;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.page.PagePopupPanel;

public class PlayerCommands implements IPlayerCommands {

	private PageController	pageController;
	private AppController	controller;
	
	
	/**
	 * constructor
	 * @param controller
	 */
	public PlayerCommands(PageController pageController, AppController controller){
	
		this.pageController = pageController;
		this.controller = controller;
	}
	
	
	@Override
	public void showPopup(String pageName) {

		AppController popupController = new AppController(controller.getApp(), controller.getModel());
		PagePopupPanel popupPanel = popupController.getPopup();
		popupPanel.setCenterParent(controller.getView());
		popupController.switchToPage(pageName);
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
	public void closePopup() {
	
		controller.getPopup().hide();
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
	public void executeEventCode(String code) {

		pageController.runScript(code);
	}


	@Override
	public void updateCurrentPageScore() {

		pageController.updateScore();
	}


	@Override
	public long getTimeElapsed() {
		return controller.getTimeElapsed();
	}
}
