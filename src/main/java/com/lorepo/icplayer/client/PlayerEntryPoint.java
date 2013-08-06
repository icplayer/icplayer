package com.lorepo.icplayer.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.JavaScriptObject;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class PlayerEntryPoint implements EntryPoint {

	private PlayerApp	theApplication;
	private JavaScriptObject pageLoadedListener;
	private JavaScriptObject statusChangedListener;
	
	
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
		  player.onStatusChanged = function(listener){
		    x.@com.lorepo.icplayer.client.PlayerEntryPoint::statusChangedListener = listener;
		  }
		  player.setAnalytics = function(id){
		    x.@com.lorepo.icplayer.client.PlayerEntryPoint::setAnalytics(Ljava/lang/String;)(id);
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

		// Create book
		$wnd.icCreateBook = function(id) {
		  var book = x.@com.lorepo.icplayer.client.PlayerEntryPoint::createBookPlayer(Ljava/lang/String;)(id);
		  book.load = function(url, index){
		  	index = index || 0;
		    x.@com.lorepo.icplayer.client.PlayerEntryPoint::load(Ljava/lang/String;I)(url, index);
		  }

		  return book;
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
	
	
	private JavaScriptObject createBookPlayer(String node_id) {
		theApplication = new PlayerApp(node_id, this);
		theApplication.setBookMode();
		return JavaScriptObject.createFunction();
	}
	
	
	private void load(String url, int pageIndex) {
		
		if(pageIndex < 0){
			pageIndex = 0;
		}
		theApplication.load(url, pageIndex);
	}

	
	private void setAnalytics(String id) {
		theApplication.setAnalytics(id);
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
		int currentPageIndex = theApplication.getPlayerServices().getCurrentPageIndex(); 
		String source = Integer.toString(currentPageIndex+1);
		fireStatusChanged(statusChangedListener, "PageLoaded", source, "");
	}

	
	private static native void fireStatusChanged(JavaScriptObject callback, String type, String source, String value) /*-{
		if(callback != null){
			callback(type, source, value);
		}
	}-*/;


}
