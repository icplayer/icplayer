package com.lorepo.icplayer.client.content.services;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.ResettableEventBus;
import com.google.gwt.event.shared.SimpleEventBus;
import com.lorepo.icplayer.client.PlayerController;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IScoreService;

/**
 * Implementacja serwisów udostępnianych przez playera
 * @author Krzysztof Langner
 *
 */
public class PlayerServices implements IPlayerServices {

	private PlayerCommands		playerCommands;
	private ResettableEventBus	eventBus;
	private PlayerController 	playerController;
	private JavaScriptPlayerServices	jsServiceImpl;
	private IJsonServices	jsonServices = new JsonServices();
	
	
	/**
	 * constructor
	 */
	public PlayerServices(PlayerController controller) {
	
		this.playerController = controller;
		eventBus = new ResettableEventBus(new SimpleEventBus());
		playerCommands = new PlayerCommands(controller.getPageController(), controller);
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
		
		return playerController.getPageController().findModule(moduleName);
	}


	@Override
	public IJsonServices getJsonServices() {
		return jsonServices;
	}

}
