package com.lorepo.icplayer.client.module.api.player;

import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icplayer.client.PlayerConfig;
import com.lorepo.icplayer.client.content.services.dto.ScaleInformation;
import com.lorepo.icplayer.client.module.api.IPresenter;


/**
 * This interface is accessible by modules and outside of the player
 */
public interface IPlayerServices {

	IContent getModel();
	PlayerConfig getPlayerConfig();
	EventBus	getEventBus();
	int getCurrentPageIndex();
	IPlayerCommands	getCommands();
	IScoreService	getScoreService();
	ITimeService		getTimeService();
	IAssetsService	getAssetsService();
	IStateService 	getStateService();
	IJsonServices	getJsonServices();
	IReportableService getReportableService();
	JavaScriptObject getAsJSObject();
	IPresenter getModule(String moduleName);
	boolean isBookMode();
	boolean hasCover();
	void sendAnalytics(String event, HashMap<String,String> params);
	IPresenter getHeaderModule(String name);
	IPresenter getFooterModule(String name);
	int getPageWeight();
	ScaleInformation getScaleInformation();
	void setScaleInformation(String scaleX, String scaleY, String transform, String transformOrigin);
	
	void outstretchHeight(int y, int height, boolean dontMoveModules);
	boolean isPlayerInCrossDomain();
	boolean isWCAGOn();
	
	void setAbleChangeLayout(boolean isAbleChangeLayout);
	boolean isAbleChangeLayout();
}
