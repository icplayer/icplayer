package com.lorepo.icplayer.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.JavaScriptObject;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class PlayerEntryPoint implements EntryPoint {

	private PlayerApp	theApplication;
	private JavaScriptObject pageLoadedListener;
	
	
	/**
	 * This is the entry point method.
	 */
	public void onModuleLoad() {
		
		initJavaScriptAPI(this);
		
	}
	
	
	/**
	 * Init Javascript API
	 */
	private static native void initJavaScriptAPI(PlayerEntryPoint x) /*-{
		// CreatePlayer
		$wnd.icCreatePlayer = function(id) {
		  var player = x.@com.lorepo.icplayer.client.PlayerEntryPoint::createAppPlayer(Ljava/lang/String;)(id);
		  player.load = function(url, index){
		  	index = index || 0;
		    x.@com.lorepo.icplayer.client.PlayerEntryPoint::load(Ljava/lang/String;I)(url, index);
		  }
		  player.setApiUrl = function(url){
		    x.@com.lorepo.icplayer.client.PlayerEntryPoint::setApiUrl(Ljava/lang/String;)(url);
		  }
		  player.setAnalyticsUrl = function(url){
		    x.@com.lorepo.icplayer.client.PlayerEntryPoint::setAnalyticsUrl(Ljava/lang/String;)(url);
		  }
		  player.setTestMode = function(){
		    x.@com.lorepo.icplayer.client.PlayerEntryPoint::setTestMode()();
		  }
		  player.getState = function(){
		    return x.@com.lorepo.icplayer.client.PlayerEntryPoint::getState()();
		  }
		  player.setState = function(state){
		    x.@com.lorepo.icplayer.client.PlayerEntryPoint::setState(Ljava/lang/String;)(state);
		  }
		  player.getPlayerServices = function(){
		    return x.@com.lorepo.icplayer.client.PlayerEntryPoint::getPlayerServices()();
		  }
		  player.onPageLoaded = function(listener){
		  	x.@com.lorepo.icplayer.client.PlayerEntryPoint::pageLoadedListener = listener;
		  }

		  return player;
		}

		// Call App loaded function
		if(typeof $wnd.icOnAppLoaded == 'function') {
		  $wnd.icOnAppLoaded();	
		}
		else if(typeof $wnd.qpOnAppLoaded == 'function') {
		  $wnd.qpOnAppLoaded();	
		}
	}-*/;

	
	/**
	 * createPlayer js interface
	 * 
	 * @param node_id
	 *            wrap this node
	 */
	private JavaScriptObject createAppPlayer(String node_id) {
		theApplication = new PlayerApp(node_id, this);
		return JavaScriptObject.createFunction();
	}
	
	
	private void load(String url, int pageIndex) {
		
		if(pageIndex < 0){
			pageIndex = 0;
		}
		theApplication.load(url, pageIndex);
	}

	
	private void setApiUrl(String url) {
		
		theApplication.setApiUrl(url);
	}

	
	private void setAnalyticsUrl(String url) {
		
		theApplication.setAnalyticsUrl(url);
	}

	
	private void setTestMode() {
		
		theApplication.setTestMode();
	}

	
	private void setState(String state) {
		theApplication.setState(state);
	}

	
	private String getState() {
		
		return theApplication.getState();
	}

	
	private JavaScriptObject getPlayerServices() {
		
		return theApplication.getPlayerServices().getAsJSObject();
	}

	
	private static native void firePageLoaded(JavaScriptObject callback) /*-{
		
		if(callback != null){
			callback();
		}
	}-*/;


	public void onPageLoaded() {
		firePageLoaded(pageLoadedListener);
	}
}
