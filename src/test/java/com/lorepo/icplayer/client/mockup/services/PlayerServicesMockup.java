package com.lorepo.icplayer.client.mockup.services;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.SimpleEventBus;
import com.lorepo.icplayer.client.PlayerApp;
import com.lorepo.icplayer.client.PlayerConfig;
import com.lorepo.icplayer.client.content.services.ScoreService;
import com.lorepo.icplayer.client.content.services.dto.ScaleInformation;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.Content.ScoreType;
import com.lorepo.icplayer.client.model.page.group.GroupPresenter;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.player.*;

import java.util.HashMap;

public class PlayerServicesMockup implements IPlayerServices {

	private final EventBus		eventBus;
	private final IPlayerCommands	commands;
	private final IScoreService	scoreService;
	private IContent		contentModel;
	private final IJsonServices	jsonMockup;

	public PlayerServicesMockup() {
		contentModel = new Content();
		eventBus = new SimpleEventBus();
		commands = new CommandsMockup();
		scoreService = new ScoreService(ScoreType.last);
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
	public IPresenter getModule(String moduleId) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public IJsonServices getJsonServices() {
		return jsonMockup;
	}


	@Override
	public IStateService getStateService() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public void sendAnalytics(String event, HashMap<String, String> params) {
		// TODO Auto-generated method stub

	}


	@Override
	public boolean isBookMode() {
		// TODO Auto-generated method stub
		return false;
	}


	@Override
	public boolean hasCover() {
		// TODO Auto-generated method stub
		return false;
	}


	@Override
	public IPresenter getHeaderModule(String id) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public IPresenter getFooterModule(String id) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public IAssetsService getAssetsService() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public PlayerConfig getPlayerConfig() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public ITimeService getTimeService() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public int getPageWeight() {
		// TODO Auto-generated method stub
		return 1;
	}


	@Override
	public void outstretchHeight(int y, int height, boolean dontChangeModules) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public IReportableService getReportableService() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public ScaleInformation getScaleInformation() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public void setScaleInformation(String scaleX, String scaleY,
			String transform, String transformOrigin) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public boolean isPlayerInCrossDomain() {
		// TODO Auto-generated method stub
		return false;
	}


	@Override
	public boolean isWCAGOn() {
		// TODO Auto-generated method stub
		return false;
	}


	@Override
	public void setAbleChangeLayout(boolean isAbleChangeLayout) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public boolean isAbleChangeLayout() {
		// TODO Auto-generated method stub
		return false;
	}


	@Override
	public void setApplication(PlayerApp application) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public boolean changeSemiResponsiveLayout(String layoutID) {
		// TODO Auto-generated method stub
		return false;
	}


	@Override
	public GroupPresenter getGroup(String groupId) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public boolean isPageVisited(IPage page) {
		// TODO Auto-generated method stub
		return false;
  }
  
  
	@Override
	public JavaScriptObject getContextMetadata() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void sendResizeEvent() {
		// TODO Auto-generated method stub
	}

	@Override
	public void sendExternalEvent(String eventType, String data) {
		// TODO Auto-generated method stub

	}

	@Override
	public String getContentMetadata(String key) {
		return contentModel.getMetadataValue(key);
	}

}
