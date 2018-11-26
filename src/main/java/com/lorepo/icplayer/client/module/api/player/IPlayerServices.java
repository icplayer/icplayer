package com.lorepo.icplayer.client.module.api.player;

import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icplayer.client.PlayerApp;
import com.lorepo.icplayer.client.PlayerConfig;
import com.lorepo.icplayer.client.content.services.dto.ScaleInformation;
import com.lorepo.icplayer.client.module.api.IPresenter;


/**
 * This interface is accessible by modules and outside of the player
 */
public interface IPlayerServices {

	public IContent getModel();
	public PlayerConfig getPlayerConfig();
	public EventBus	getEventBus();
	public int getCurrentPageIndex();
	public IPlayerCommands	getCommands();
	public IScoreService	getScoreService();
	public ITimeService		getTimeService();
	public IAssetsService	getAssetsService();
	public IStateService 	getStateService();
	public IJsonServices	getJsonServices();
	public IReportableService getReportableService();
	public JavaScriptObject getAsJSObject();
	public IPresenter getModule(String moduleName);
	public boolean isBookMode();
	public boolean hasCover();
	public void sendAnalytics(String event, HashMap<String,String> params);
	public IPresenter getHeaderModule(String name);
	public IPresenter getFooterModule(String name);
	public int getPageWeight();
	public ScaleInformation getScaleInformation();
	public void setScaleInformation(String scaleX, String scaleY, String transform, String transformOrigin);
	public void setApplication(PlayerApp application);
	
	public void outstretchHeight(int y, int height, boolean dontMoveModules);
	public boolean isPlayerInCrossDomain();
	public boolean isWCAGOn();
	
	public void setAbleChangeLayout(boolean isAbleChangeLayout); 
	public boolean isAbleChangeLayout();
	public boolean changeSemiResponsiveLayout(String layoutID);
	
	public void sendEvent(String eventName, JavaScriptObject eventData);
	public void addEventListener(String eventName, JavaScriptObject listener, boolean isDelayed);

}
