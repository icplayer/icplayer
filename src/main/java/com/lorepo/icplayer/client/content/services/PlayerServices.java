package com.lorepo.icplayer.client.content.services;

import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.event.shared.ResettableEventBus;
import com.google.gwt.event.shared.SimpleEventBus;
import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.PlayerApp;
import com.lorepo.icplayer.client.PlayerConfig;
import com.lorepo.icplayer.client.content.services.dto.ScaleInformation;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.player.IAssetsService;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IReportableService;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.api.player.IStateService;
import com.lorepo.icplayer.client.module.api.player.ITimeService;
import com.lorepo.icplayer.client.page.PageController;

public class PlayerServices implements IPlayerServices {

	private final PlayerCommands playerCommands;
	private final PlayerEventBus eventBus;
	private final IPlayerController playerController;
	private final PageController pageController;
	private JavaScriptPlayerServices jsServiceImpl;
	private IJsonServices jsonServices = new JsonServices();
	private ScaleInformation scaleInformation;
	private JavaScriptObject jQueryPrepareOffsetsFunction = null;
	private HandlerRegistration scrollHandler = null;

	public PlayerServices(IPlayerController controller, PageController pageController) {
		this.playerController = controller;
		this.pageController = pageController;
		scaleInformation = new ScaleInformation();

		eventBus = new PlayerEventBus(new ResettableEventBus(new SimpleEventBus()));
		eventBus.setPlayerServices(this);

		playerCommands = new PlayerCommands(pageController, playerController);
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

	@Override
	public EventBus getEventBus() {
		return eventBus;
	}

	public void resetEventBus() {
		eventBus.removeHandlers();
		if (jsServiceImpl != null) {
			jsServiceImpl.clearPageLoadedListeners();
			jsServiceImpl.resetEventListeners();
		}
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
	public void outstretchHeight(int y, int height, boolean dontMoveModules) {
		this.pageController.outstretchHeight(y, height, dontMoveModules);
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
	public void setScaleInformation(String scaleX, String scaleY,
			String transform, String transformOrigin) {
		ScaleInformation scaleInfo = new ScaleInformation();
		scaleInfo.scaleX = Double.parseDouble(scaleX);
		scaleInfo.scaleY = Double.parseDouble(scaleY);
		if(transform!=null){
			scaleInfo.transform = transform;
		}else{
			throw new NullPointerException("ScaleInformation.transform cannot be null");
		};
		if(transformOrigin!=null){
			scaleInfo.transformOrigin = transformOrigin;
		}else{
			throw new NullPointerException("ScaleInformation.transformOrigin cannot be null");
		}
		this.scaleInformation = scaleInfo;
		
		if (scrollHandler != null) {
			scrollHandler.removeHandler();
		}
		
		scrollHandler = PlayerApp.setStaticElementsMoveableWhenScaled(this.scaleInformation.scaleY);
		
		this.fixDroppable();
	}
	
	public void fixDroppable() {
		if (this.jQueryPrepareOffsetsFunction == null) {
			this.jQueryPrepareOffsetsFunction = this.getJQueryUIPrepareOffsetFunction();
		}
		
		if (this.scaleInformation.scaleX != 1.0 && this.scaleInformation.scaleY != 1.0) {
			this.jQueryUiDroppableScaleFix(this.jQueryPrepareOffsetsFunction);
			this.jQueryUiDroppableIntersectFix();
		}
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

	private native void jQueryUiDroppableIntersectFix()  /*-{
		
		// function from jquery-ui adjusted with scaling (getBoundingClientRect function)
		// https://github.com/jquery/jquery-ui/blob/1.8.20/ui/jquery.ui.droppable.js
		$wnd.$.ui.intersect = $wnd.$.ui.intersect = function(draggable, droppable, toleranceMode) {
			if (!droppable.offset) return false;
	
			var x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.element[0].getBoundingClientRect().width,
				y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.element[0].getBoundingClientRect().height;
			var l = droppable.offset.left, r = l + droppable.element[0].getBoundingClientRect().width,
				t = droppable.offset.top, b = t + droppable.element[0].getBoundingClientRect().height;
		
			switch (toleranceMode) {
				case 'fit':
					return (l <= x1 && x2 <= r
						&& t <= y1 && y2 <= b);
					break;
				case 'intersect':
					return (l < x1 + (draggable.helperProportions.width / 2) // Right Half
						&& x2 - (draggable.helperProportions.width / 2) < r // Left Half
						&& t < y1 + (draggable.helperProportions.height / 2) // Bottom Half
						&& y2 - (draggable.helperProportions.height / 2) < b ); // Top Half
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
}
