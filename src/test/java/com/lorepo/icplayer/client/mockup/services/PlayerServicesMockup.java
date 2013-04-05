package com.lorepo.icplayer.client.mockup.services;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.SimpleEventBus;
import com.lorepo.icplayer.client.content.services.ScoreService;
import com.lorepo.icplayer.client.model.Content;
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
public class PlayerServicesMockup implements IPlayerServices {

	private EventBus		eventBus;
	private IPlayerCommands	commands;
	private IScoreService	scoreService;
	private IContent		contentModel;
	private IJsonServices	jsonMockup;
	
	/**
	 * constructor
	 */
	public PlayerServicesMockup() {
	
		contentModel = new Content();
		eventBus = new SimpleEventBus();
		commands = new CommandsMockup();
		scoreService = new ScoreService();
		jsonMockup = new JsonMockup();
	}
	
	
	@Override
	public IScoreService getScoreService() {

		return scoreService;
	}

	@Override
	public IPlayerCommands getCommands() {
		
		return commands;
	}


	@Override
	public EventBus getEventBus() {
		return eventBus;
	}


	@Override
	public IContent getModel() {
		return contentModel;
	}


	@Override
	public int getCurrentPageIndex() {
		// TODO Auto-generated method stub
		return 0;
	}

	
	public void setModel(IContent content){
		this.contentModel = content;
	}


	@Override
	public JavaScriptObject getAsJSObject() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public IPresenter getModule(String moduleName) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public IJsonServices getJsonServices() {
		return jsonMockup;
	}
	
}
