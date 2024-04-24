package com.lorepo.icplayer.client.module.api.player;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icplayer.client.PlayerApp;
import com.lorepo.icplayer.client.PlayerConfig;
import com.lorepo.icplayer.client.content.services.dto.ScaleInformation;
import com.lorepo.icplayer.client.content.services.externalNotifications.IObserverService;
import com.lorepo.icplayer.client.model.page.group.GroupPresenter;
import com.lorepo.icplayer.client.module.api.IPlayerStateService;
import com.lorepo.icplayer.client.module.api.IPresenter;

import java.util.HashMap;


/**
 * This interface is accessible by modules and outside of the player
 */
public interface IPlayerServices {

	public IContent getModel();
	public PlayerConfig getPlayerConfig();
	public int getCurrentPageIndex();
	public IPlayerCommands	getCommands();
	public IScoreService	getScoreService();
	public ITimeService		getTimeService();
	public IAssetsService	getAssetsService();
	public IStateService 	getStateService();
	public IJsonServices	getJsonServices();
	public IReportableService getReportableService();
	public IAdaptiveLearningService getAdaptiveLearningService();
	public JavaScriptObject getAsJSObject();
	public IPresenter getModule(String moduleName);
	public GroupPresenter getGroup(String groupId);
	public boolean isBookMode();
	public boolean hasCover();
	public void sendAnalytics(String event, HashMap<String,String> params);
	public IPresenter getHeaderModule(String name);
	public IPresenter getFooterModule(String name);
	public int getPageWeight();
	public ScaleInformation getScaleInformation();
	public void setScaleInformation(String baseScaleX, String baseScaleY, String baseTransform, String baseTransformOrigin);
	public void setFinalScaleInformation(String scaleX, String scaleY, String transform, String transformOrigin);
	public void setApplication(PlayerApp application);
	public PlayerApp getApplication();
	
	public void outstretchHeight(int y, int height, boolean dontMoveModules, String layoutName);
	public boolean isPlayerInCrossDomain();
	public boolean isWCAGOn();
	public String getResponsiveVoiceLang(); 
	
	public void setAbleChangeLayout(boolean isAbleChangeLayout);
	public boolean isAbleChangeLayout();
	public boolean changeSemiResponsiveLayout(String layoutID);

	public void setExternalVariable(String key, String value);
	public String getExternalVariable(String key);
	public JavaScriptObject getOpenEndedContentForCurrentPage();

	@Deprecated
	public EventBus	getEventBus();
	public IPlayerEventBusService getEventBusService();
	public void sendEvent(String eventName, JavaScriptObject eventData);
	public void addEventListener(String eventName, JavaScriptObject listener, boolean isDelayed);

	public boolean isPageVisited(IPage page);
	public void clearVisitedPages();
	public JavaScriptObject getContextMetadata();
	public String getContentMetadata(String key);
	public void sendResizeEvent();
	public void sendExternalEvent(String eventType, String data);
	IPlayerStateService getPlayerStateService();
	IGradualShowAnswersService getGradualShowAnswersService();
	IObserverService getObserverService();
}
