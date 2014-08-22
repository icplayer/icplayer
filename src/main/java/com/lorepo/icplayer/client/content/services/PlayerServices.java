package com.lorepo.icplayer.client.content.services;

import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.ResettableEventBus;
import com.google.gwt.event.shared.SimpleEventBus;
import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.api.player.IStateService;
import com.lorepo.icplayer.client.page.PageController;

/**
 * Implementacja serwisów udostępnianych przez playera
 * @author Krzysztof Langner
 *
 */
public class PlayerServices implements IPlayerServices {

	private PlayerCommands		playerCommands;
	private ResettableEventBus	eventBus;
	private IPlayerController 	playerController;
	private PageController		pageController;
	private JavaScriptPlayerServices	jsServiceImpl;
	private IJsonServices	jsonServices = new JsonServices();
	
	
	/**
	 * constructor
	 */
	public PlayerServices(IPlayerController controller, PageController pageController) {
	
		this.playerController = controller;
		this.pageController = pageController;
		eventBus = new ResettableEventBus(new SimpleEventBus());
		playerCommands = new PlayerCommands(pageController, playerController);
	}


	@Override
	public IScoreService getScoreService() {

		return 	playerController.getScoreService();
	}

	@Override
	public IPlayerCommands getCommands() {
		
		return playerCommands;
	}


	@Override
	public EventBus getEventBus() {
		return eventBus;
	}


	public void resetEventBus(){

		eventBus.removeHandlers();

		if(jsServiceImpl != null){
			jsServiceImpl.resetEventListeners();
		}
		
	}


	@Override
	public IContent getModel() {
		return playerController.getModel();
	}


	@Override
	public int getCurrentPageIndex() {
		return playerController.getCurrentPageIndex();
	}


	@Override
	public JavaScriptObject getAsJSObject() {
		
		if(jsServiceImpl == null){
			jsServiceImpl = new JavaScriptPlayerServices(this);
		}
		
		return jsServiceImpl.getJavaScriptObject();
	}


	@Override
	public IPresenter getModule(String moduleName) {
		
		return pageController.findModule(moduleName);
	}
	

	@Override
	public IJsonServices getJsonServices() {
		return jsonServices;
	}


	@Override
	public IStateService getStateService() {
		return 	playerController.getStateService();
	}


	public void setJsonService(IJsonServices services) {
		jsonServices = services;
	}


	@Override
	public void sendAnalytics(String event, HashMap<String, String> params) {
		playerController.sendAnalytics(event, params);
	}


	@Override
	public boolean isBookMode() {
		return playerController.isBookMode();
	}


	@Override
	public boolean hasCover() {
		return playerController.hasCover();
	}
}
