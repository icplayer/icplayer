package com.lorepo.icplayer.client.content.services;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.PlayerApp;
import com.lorepo.icplayer.client.PlayerConfig;
import com.lorepo.icplayer.client.PlayerController;
import com.lorepo.icplayer.client.content.services.dto.ScaleInformation;
import com.lorepo.icplayer.client.content.services.externalNotifications.IObserverService;
import com.lorepo.icplayer.client.content.services.externalNotifications.ObserverService;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.group.GroupPresenter;
import com.lorepo.icplayer.client.module.IOpenEndedContentPresenter;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IPlayerStateService;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.player.*;
import com.lorepo.icplayer.client.page.PageController;

import java.util.HashMap;

public class PlayerServices implements IPlayerServices {
	private final PlayerCommands playerCommands;
	private final IPlayerController playerController;
	private final PageController pageController;
	private JavaScriptPlayerServices jsServiceImpl;
	private final IPlayerEventBusService eventBusService;
	private IJsonServices jsonServices = new JsonServices();
	private ScaleInformation scaleInformation;
	private JavaScriptObject jQueryPrepareOffsetsFunction = null;
	private boolean isAbleChangeLayout = true;
	private PlayerApp application = null;
	private final PlayerStateService playerStateService;
	private final IObserverService observerService;

	public PlayerServices(IPlayerController controller, PageController pageController) {
		this.playerController = controller;
		this.pageController = pageController;
		scaleInformation = new ScaleInformation();
		playerCommands = new PlayerCommands(pageController, playerController);
		eventBusService = new PlayerEventBusService(this);
		playerStateService = new PlayerStateService(this);
		observerService = new ObserverService();
	}
	
	@Override
	public void setAbleChangeLayout(boolean isAbleChangeLayout) {
		boolean oldIsAbleChangeLayout = this.isAbleChangeLayout;
		this.isAbleChangeLayout = isAbleChangeLayout;
		if (!oldIsAbleChangeLayout && isAbleChangeLayout && application != null) {
			this.application.updateLayout();
		}
	}
	
	@Override
	public void setApplication(PlayerApp application) {
		this.application = application;
	}

	@Override
	public PlayerApp getApplication() {
		return this.application;
	}
	
	@Override
	public boolean isAbleChangeLayout() {
		return this.isAbleChangeLayout;
	}

	@Override
	public IScoreService getScoreService() {
		return 	playerController.getScoreService();
	}

	@Override
	public IAssetsService getAssetsService() {
		return 	playerController.getAssetsService();
	}

	@Override
	public IPlayerCommands getCommands() {
		return playerCommands;
	}

	/**
	 * @deprecated Call getEventBusService().getEventBus()
	 * This method returns EventBus, not PlayerEventBus and it may cause issues with overridden methods in GWT
	 * @return default event bus
	 */
	@Override
	@Deprecated
	public EventBus getEventBus() {
		return this.eventBusService.getEventBus();
	}

	public void resetEventBus() {
		this.eventBusService.resetEventBus();
	}

	@Override
	public IContent getModel() {
		return playerController.getModel();
	}

	@Override
	public PlayerConfig getPlayerConfig() {
		return playerController.getPlayerConfig();
	}

	@Override
	public int getCurrentPageIndex() {
		return playerController.getCurrentPageIndex();
	}

	@Override
	public JavaScriptObject getAsJSObject() {
		if (jsServiceImpl == null) {
			jsServiceImpl = new JavaScriptPlayerServices(this);
		}
		return jsServiceImpl.getJavaScriptObject();
	}

	@Override
	public IPresenter getModule(String moduleId) {
		return pageController.findModule(moduleId);
	}

	
	@Override
	public GroupPresenter getGroup(String groupId) {
		return pageController.findGroup(groupId); 
	}
	
	
	@Override
	public IPresenter getHeaderModule(String moduleId) {
		return playerController.findHeaderModule(moduleId);
	}

	@Override
	public IPresenter getFooterModule(String moduleId) {
		return playerController.findFooterModule(moduleId);
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

	@Override
	public ITimeService getTimeService() {
		return playerController.getTimeService();
	}

	@Override
	public int getPageWeight() {
		return pageController.getPage().getPageWeight();
	}

	@Override
	public void outstretchHeight(int y, int height, boolean dontMoveModules, String layoutName) {
		this.pageController.outstretchHeight(y, height, dontMoveModules, layoutName);
	}

	@Override
	public IReportableService getReportableService() {
		return this.playerController.getReportableService();
	}

	@Override
	public ScaleInformation getScaleInformation() {
		return this.scaleInformation;
	}

	@Override
	public void setScaleInformation(String baseScaleX,
									String baseScaleY,
									String baseTransform,
									String baseTransformOrigin)
	{
		ScaleInformation scaleInfo = new ScaleInformation();
		scaleInfo.baseScaleX = Double.parseDouble(baseScaleX);
		scaleInfo.baseScaleY = Double.parseDouble(baseScaleY);
		scaleInfo.scaleX = scaleInfo.baseScaleX;
		scaleInfo.scaleY = scaleInfo.baseScaleY;
		if (baseTransform != null) {
			scaleInfo.transform = baseTransform;
		} else {
			throw new NullPointerException("ScaleInformation.transform cannot be null");
		}
		if (baseTransformOrigin != null) {
			scaleInfo.transformOrigin = baseTransformOrigin;
		} else {
			throw new NullPointerException("ScaleInformation.transformOrigin cannot be null");
		}
		this.scaleInformation = scaleInfo;
		
		JavaScriptUtils.setScaleInformation(this.scaleInformation.baseScaleX, this.scaleInformation.baseScaleY);
		this.fixDroppable();
	}

	@Override
	public void setFinalScaleInformation(String scaleX,
										 String scaleY,
										 String transform,
										 String transformOrigin)
    {
		this.scaleInformation.scaleX = Double.parseDouble(scaleX);
		this.scaleInformation.scaleY = Double.parseDouble(scaleY);

		if (transform != null) {
			this.scaleInformation.transform = transform;
		}
		if (transformOrigin != null) {
			this.scaleInformation.transformOrigin = transformOrigin;
		}
		
		JavaScriptUtils.setFinalScaleInformation(this.scaleInformation.scaleX, this.scaleInformation.scaleY);
		this.fixDroppable();
	}

	@Override
	public JavaScriptObject getContextMetadata() {
		return this.application != null ? this.application.getContextMetadata() : null;
	}

	@Override
	public void setExternalVariable(String key, String value) {
		if (this.application != null){
			JavaScriptObject context = this.application.getExternalVariables();
			if (context != null)
				JavaScriptUtils.addPropertyToJSArray(context, key, value);
		}
	}

	@Override
	public String getExternalVariable(String key) {
		if (this.application != null){
			JavaScriptObject context = this.application.getExternalVariables();
			if (context != null)
				return JavaScriptUtils.getArrayItemByKey(context, key);
		}
		return null;
	}

    @Override
    public void sendResizeEvent() {
        this.pageController.sendResizeEvent();
    }

    public void fixDroppable() {
		if (this.jQueryPrepareOffsetsFunction == null) {
			this.jQueryPrepareOffsetsFunction = this.getJQueryUIPrepareOffsetFunction();
		}
		
		if (this.scaleInformation.scaleX != 1.0 && this.scaleInformation.scaleY != 1.0) {
			this.jQueryUiDroppableScaleFix(this.jQueryPrepareOffsetsFunction);
			this.jQueryUiDroppableIntersectFix(this);
		}
	}
	
	public boolean changeSemiResponsiveLayout(String layoutIDOrName) {
		boolean result = this.application.changeLayout(layoutIDOrName);
		if (result) {
			return result;
		} 
		
		return this.application.changeLayoutByName(layoutIDOrName);
	}
	
	
	private native void jQueryUiDroppableScaleFix(JavaScriptObject originalPrepare)  /*-{
		function scaleFixDecorator(func) {
			function prepareOffsetWithScale(t, event) {
	            func(t, event);
	            var droppables = $wnd.$.ui.ddmanager.droppables[t.options.scope] || [];
	
	            for (var i = 0; i < droppables.length; i++) {
	                droppables[i].proportions.width = droppables[i].element[0].getBoundingClientRect().width;
	                droppables[i].proportions.height = droppables[i].element[0].getBoundingClientRect().height;
	            }
	        }
	        
	        return prepareOffsetWithScale;
		}
		
		$wnd.$.ui.ddmanager.prepareOffsets = scaleFixDecorator(originalPrepare);
	}-*/;

	
	private native void jQueryUiDroppableIntersectFix(PlayerServices x)  /*-{
		
		// function from jquery-ui adjusted with scaling (getBoundingClientRect function)
		// https://github.com/jquery/jquery-ui/blob/1.8.20/ui/jquery.ui.droppable.js
		var getScaleInformation = $entry(function() {
			var scale = {X: 1.0, Y:1.0};
			var scaleInfo = x.@com.lorepo.icplayer.client.content.services.PlayerServices::getScaleInformation()();
			scale.X = scaleInfo.@com.lorepo.icplayer.client.content.services.dto.ScaleInformation::scaleX;
			scale.Y = scaleInfo.@com.lorepo.icplayer.client.content.services.dto.ScaleInformation::scaleY;
			return scale;
		});
		
		$wnd.$.ui.intersect = $wnd.$.ui.intersect = function(draggable, droppable, toleranceMode) {			
			if (!droppable.offset) return false;
			
			var scale = getScaleInformation();
			var draggableWidth = draggable.helperProportions.width;
			var draggableHeight = draggable.helperProportions.height;
			if (draggable.useScaledProportions) {
				draggableWidth *= scale.X;
				draggableHeight *= scale.Y;
			}

			if (!draggable.isGeneratePositionScaled) { //a decorator applying scaling to draggable._generatePosition is being used
				var x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.element[0].getBoundingClientRect().width,
					y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.element[0].getBoundingClientRect().height;
			} else {
				var x1 = draggable.position.left * scale.X - draggable.originalPosition.left, x2 = x1 + draggable.helperProportions.width * scale.X,
					y1 = draggable.position.top * scale.Y - draggable.originalPosition.top, y2 = y1 + draggable.helperProportions.height * scale.Y;
			}
			var l = droppable.offset.left, r = l + droppable.element[0].getBoundingClientRect().width,
				t = droppable.offset.top, b = t + droppable.element[0].getBoundingClientRect().height;

			switch (toleranceMode) {
				case 'fit':
					return (l <= x1 && x2 <= r
						&& t <= y1 && y2 <= b);
					break;
				case 'intersect':
					return (l < x1 + (draggableWidth / 2) // Right Half
						&& x2 - (draggableWidth / 2) < r // Left Half
						&& t < y1 + (draggableHeight / 2) // Bottom Half
						&& y2 - (draggableHeight / 2) < b ); // Top Half
					break;
				case 'pointer':
					var draggableLeft = ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left),
						draggableTop = ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top),
						isOver = $wnd.$.ui.isOver(draggableTop, draggableLeft, t, l, droppable.proportions.height, droppable.proportions.width);
					return isOver;
					break;
				case 'touch':
					return (
							(y1 >= t && y1 <= b) ||	// Top edge touching
							(y2 >= t && y2 <= b) ||	// Bottom edge touching
							(y1 < t && y2 > b)		// Surrounded vertically
						) && (
							(x1 >= l && x1 <= r) ||	// Left edge touching
							(x2 >= l && x2 <= r) ||	// Right edge touching
							(x1 < l && x2 > r)		// Surrounded horizontally
						);
					break;
				default:
					return false;
					break;
			}
		};
	
	}-*/;

	private native JavaScriptObject getJQueryUIPrepareOffsetFunction() /*-{
		return $wnd.$.ui.ddmanager.prepareOffsets;
	}-*/;
	
	public boolean isPlayerInCrossDomain() {
		return this.playerController.isPlayerInCrossDomain();
	}

	@Override
	public String getResponsiveVoiceLang() {
		if(playerController instanceof PlayerController) {
			PlayerController pc = (PlayerController) playerController;
			return pc.getResponsiveVoiceLang();
		}
		return "";
	}
	
	@Override
	public boolean isWCAGOn() {
		if(playerController instanceof PlayerController) {
			PlayerController pc = (PlayerController) playerController;
			return pc.isWCAGOn();
		}
		return false;
	}

	@Override
	public boolean isPageVisited(IPage page) {
		return this.playerController.getVisitedPages().contains(page);
	}

	@Override
	public void clearVisitedPages() { this.playerController.clearVisitedPages(); };

	@Override
	public void sendExternalEvent(String eventType, String data) {
		this.playerController.sendExternalEvent(eventType, data);

	}

	@Override
	public IPlayerStateService getPlayerStateService() {
		return playerStateService;
	}

	@Override
	public IGradualShowAnswersService getGradualShowAnswersService() {
		return pageController.getGradualShowAnswersService();
	}

	@Override
	public IObserverService getObserverService() {
		return this.observerService;
	}

	@Override
	public String getContentMetadata(String key) {
		return this.getModel().getMetadataValue(key);
	}

	@Override
	public void sendEvent(String eventName, JavaScriptObject eventData) {
		this.eventBusService.sendEvent(eventName, eventData);
	}

	@Override
	public void addEventListener(String eventName, JavaScriptObject listener, boolean isDelayed) {
		this.eventBusService.addEventListener(eventName, listener, isDelayed);
	}

	@Override
	public IPlayerEventBusService getEventBusService() {
		return this.eventBusService;
	}

	@Override
	public IAdaptiveLearningService getAdaptiveLearningService() {
		return this.playerController.getAdaptiveLearningService();
	}

	@Override
	public JavaScriptObject getOpenEndedContentForCurrentPage() {
		JavaScriptObject contents = JavaScriptUtils.createJSObject();
		int pageIndex = playerController.getCurrentPageIndex();
		IPage ipage = playerController.getModel().getPage(pageIndex);
		if (ipage instanceof Page) {
			Page page = (Page) ipage;
			for (int i = 0; i < page.getModules().size(); i++) {
				IModuleModel model = page.getModules().get(i);
				IPresenter ipresenter = getModule(model.getId());
				if (ipresenter instanceof IOpenEndedContentPresenter) {
					IOpenEndedContentPresenter presenter = (IOpenEndedContentPresenter) ipresenter;
					String content = presenter.getOpenEndedContent();
					if (content != null) {
						JavaScriptUtils.addPropertyToJSArray(contents, model.getId(), content);
					}
				}
			}
		}
		return contents;
	}
}
