package com.lorepo.icplayer.client.content.services;

import com.google.gwt.core.client.JavaScriptObject;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

public class PlayerEventBusWrapper {
	private IPlayerServices playerServices;
	private String addonType;
	
	protected final String ADDON_TYPE_EVENT_KEY = "moduleType";
	protected final String PAGE_ID_EVENT_KEY = "pageId";
	protected final String PAGE_STEP_EVENT_KEY = "pageAdaptiveStep";
	
	public PlayerEventBusWrapper(IPlayerServices services, String addonType) {
		this.playerServices = services;
		this.addonType = addonType;
	}
	
	public void addEventListener(String eventName, JavaScriptObject listener, boolean isDelayed) {
		this.playerServices.addEventListener(eventName, listener, isDelayed);
	}
	
	public void sendEvent(String eventName, JavaScriptObject eventData) {
		String currentPageID = this.playerServices.getCommands().getPageController().getPage().getId();
		String currentPageAdaptiveStep = String.valueOf(this.playerServices.getAdaptiveLearningService().getPageStep(currentPageID));
		
		JavaScriptUtils.addPropertyToJSArray(eventData, PAGE_ID_EVENT_KEY, currentPageID);
		JavaScriptUtils.addPropertyToJSArray(eventData, ADDON_TYPE_EVENT_KEY, addonType);
		JavaScriptUtils.addPropertyToJSArray(eventData, PAGE_STEP_EVENT_KEY, currentPageAdaptiveStep);

		this.playerServices.sendEvent(eventName, eventData);
	}
	
	public native JavaScriptObject getAsJSObject() /*-{		
		var eventBus = function() {
		};
		
		var wrapper = this;

		eventBus.addEventListener = function(name, listener, isDelayed) {
			if(isDelayed == undefined){
				isDelayed = false;
			}

			wrapper.@com.lorepo.icplayer.client.content.services.PlayerEventBusWrapper::addEventListener(Ljava/lang/String;Lcom/google/gwt/core/client/JavaScriptObject;Z)
				(name, listener, isDelayed);
		};
		
		eventBus.sendEvent = function(name, data) {
			wrapper.@com.lorepo.icplayer.client.content.services.PlayerEventBusWrapper::sendEvent(Ljava/lang/String;Lcom/google/gwt/core/client/JavaScriptObject;)
				(name, data);
		};

		return eventBus;
	}-*/;
	
	
}
