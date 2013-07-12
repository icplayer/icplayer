package com.lorepo.icplayer.client.content.services;

import com.lorepo.icplayer.client.PlayerController;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.PageScore;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.page.PagePopupPanel;

public class PlayerCommands implements IPlayerCommands {

	private PageController	pageController;
	private PlayerController	controller;
	private PagePopupPanel popupPanel = null;
	
	
	/**
	 * constructor
	 * @param controller
	 */
	public PlayerCommands(PageController pageController, PlayerController controller){
	
		this.pageController = pageController;
		this.controller = controller;
	}
	
	
	@Override
	public void showPopup(String pageName) {

		Page page  = controller.getModel().findPageByName(pageName);
		PageController popupPageControler = new PageController();
		popupPageControler.setPlayerServices(controller.getPlayerServices());
		popupPanel = new PagePopupPanel(controller.getView().getAsWidget(), popupPageControler);
		popupPanel.showPage(page, controller.getModel().getBaseUrl());
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
		if(popupPanel != null){
			popupPanel.hide();
		}
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
