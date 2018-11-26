package com.lorepo.icplayer.client.content.services;

import com.google.gwt.core.client.JavaScriptObject;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

public class PlayerEventBusWrapper {
	private IPlayerServices playerServices;
	private String addonType;
	
	protected final String ADDON_TYPE_EVENT_KEY = "moduleType";
	protected final String PAGE_ID_EVENT_KEY = "pageId";
	
	public PlayerEventBusWrapper(IPlayerServices services, String addonType) {
		this.playerServices = services;
		this.addonType = addonType;
	}
	
	public void addEventListener(String eventName, JavaScriptObject listener, boolean isDelayed) {
		this.playerServices.addEventListener(eventName, listener, isDelayed);
	}
	
	public void sendEvent(String eventName, JavaScriptObject eventData) {
		JavaScriptUtils.addPropertyToJSArray(eventData, ADDON_TYPE_EVENT_KEY, addonType);
		
		String currentPageID = this.playerServices.getCommands().getPageController().getPage().getId();
		JavaScriptUtils.addPropertyToJSArray(eventData, PAGE_ID_EVENT_KEY, currentPageID);
		
		this.playerServices.sendEvent(eventName, eventData);
	}
	
	public native JavaScriptObject getAsJSObject() /*-{
		var wrappedBus = this;
		
		var eventBus = function() {
		};

		eventBus.addEventListener = function(name, listener, isDelayed) {
			if(isDelayed == undefined){
				isDelayed = false;
			}

			wrappedBus.@com.lorepo.icplayer.client.content.services.PlayerEventBusWrapper::addEventListener(Ljava/lang/String;Lcom/google/gwt/core/client/JavaScriptObject;Z)
				(name, listener, isDelayed);
		};
		
		eventBus.sendEvent = function(name, data) {
			wrappedBus.@com.lorepo.icplayer.client.content.services.PlayerEventBusWrapper::sendEvent(Ljava/lang/String;Lcom/google/gwt/core/client/JavaScriptObject;)
				(name, data);
		};

		return eventBus;
	}-*/;
	
	
}
