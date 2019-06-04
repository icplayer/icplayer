package com.lorepo.icplayer.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.JavaScriptObject;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class PlayerEntryPoint implements EntryPoint {

	private PlayerApp theApplication;
	private JavaScriptObject pageLoadedListener;
	private JavaScriptObject pageScrollToListener;
	private JavaScriptObject statusChangedListener;
	private JavaScriptObject outstretchHeightListener;
	private JavaScriptObject contextMetadata;

	/**
	 * This is the entry point method.
	 */
	@Override
	public void onModuleLoad() {
		initJavaScriptAPI(this);
	}

	private static native void initJavaScriptAPI(PlayerEntryPoint entryPoint) /*-{
		function createAPI(player) {
			player.load = function(url, index) {
				index = index || 0;
				entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::load(Ljava/lang/String;I)(url, index);
			};

			player.loadCommonPage = function(url, index) {
				index = index || 0;
				entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::loadCommonPage(Ljava/lang/String;I)(url, index);
			};

			player.setConfig = function(config) {
				entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::setConfig(Lcom/google/gwt/core/client/JavaScriptObject;)(config);
			};

			player.onStatusChanged = function(listener) {
				entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::statusChangedListener = listener;
			};

			player.setAnalytics = function(id) {
				entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::setAnalytics(Ljava/lang/String;)(id);
			};
			
			player.getSemiResponsiveLayouts = function () {
				return entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::getSemiResponsiveLayouts()();
			}
			
			player.getResponsiveLayouts = function () {
				return entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::getSemiResponsiveLayouts()();
			}

			player.getState = function() {
				return entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::getState()();
			};
			
			player.changeLayout = function (layoutID) {
				return entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::changeLayout(Ljava/lang/String;)(layoutID);
			}

			player.setState = function(state) {
				entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::setState(Ljava/lang/String;)(state);
			};

			player.setPages = function(pages) {
				entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::setPages(Ljava/lang/String;)(pages);
			};

			player.getPlayerServices = function() {
				return entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::getPlayerServices()();
			};

			player.onPageLoaded = function(listener) {
				entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::pageLoadedListener = listener;
			};

			player.onOutstretchHeight = function(listener) {
				entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::outstretchHeightListener = listener;
			};

			player.onPageScrollTo = function(listener) {
				entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::pageScrollToListener = listener;
			};

			player.forceScoreUpdate = function(listener) {
				entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::forceScoreUpdate()();
			};
			
			player.isAbleChangeLayout = function(){
				return entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::isAbleChangeLayout()(); 
			};

			player.setContextMetadata = function(contextData){
				return entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::contextMetadata = contextData;
			};
		}

		// CreatePlayer
		$wnd.icCreatePlayer = function(id) {
			var player = entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::createAppPlayer(Ljava/lang/String;)(id);

			createAPI(player);

			return player;
		}

		// Create book
		$wnd.icCreateBook = function(id, useCover) {
			var player = entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::createBookPlayer(Ljava/lang/String;Z)(id, useCover);

			createAPI(player);

			return player;
		}

		// Call App loaded function
		if (typeof $wnd.icOnAppLoaded == 'function') {
			$wnd.icOnAppLoaded();
		} else if (typeof $wnd.qpOnAppLoaded == 'function') {
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
		this.theApplication = new PlayerApp(node_id, this);
		return JavaScriptObject.createFunction();
	}

	private JavaScriptObject createBookPlayer(String node_id, boolean useCover) {
		this.theApplication = new PlayerApp(node_id, this);
		this.theApplication.setBookMode();
		this.theApplication.showCover(useCover);
		return JavaScriptObject.createFunction();
	}
	
	private boolean isAbleChangeLayout() {
		return this.theApplication.getPlayerServices().isAbleChangeLayout(); 
	}
	
	private void load(String url, int pageIndex) {
		if (pageIndex < 0) {
			pageIndex = 0;
		}
		this.theApplication.load(url, pageIndex);
	}

	private void loadCommonPage(String url, int pageIndex) {
		if (pageIndex < 0) {
			pageIndex = 0;
		}
		this.theApplication.loadCommonPage(url, pageIndex);
	}

	private void setConfig(JavaScriptObject config) {
		this.theApplication.setConfig(config);
	}

	private void forceScoreUpdate() {
		this.theApplication.updateScore();
	}

	private void setAnalytics(String id) {
		this.theApplication.setAnalytics(id);
	}

	private void setState(String state) {
		this.theApplication.setState(state);
	}

	private void setPages(String pagesSub) {
		this.theApplication.setPages(pagesSub);
	}

	private String getState() {
		return this.theApplication.getState();
	}
	
	private JavaScriptObject getSemiResponsiveLayouts() {
		return this.theApplication.getSemiResponsiveLayouts();
	}

	private JavaScriptObject getPlayerServices() {
		return this.theApplication.getPlayerServices().getAsJSObject();
	}
	
	private boolean changeLayout(String layoutID) {
		return this.theApplication.changeLayout(layoutID);
	}

	private static native void fireCallback(JavaScriptObject callback) /*-{
		if (callback != null) {
			callback();
		}
	}-*/;

	private static native void fireScrollTo(JavaScriptObject callback, int top) /*-{
		if (callback != null) {
			callback(top);
		}
	}-*/;

	private static native void fireStatusChanged(JavaScriptObject callback,
			String type, String source, String value) /*-{
		if (callback != null) {
			callback(type, source, value);
		}
	}-*/;

	public void onPageLoaded() {
		fireCallback(this.pageLoadedListener);
		final int currentPageIndex = this.theApplication.getPlayerServices()
				.getCurrentPageIndex();
		String source = Integer.toString(currentPageIndex + 1);
		fireStatusChanged(this.statusChangedListener, "PageLoaded", source, "");
	}

	public void onScrollTo(int top) {
		fireScrollTo(this.pageScrollToListener, top);
	}

	public JavaScriptObject getPageScrollToObject() {
		return this.pageScrollToListener;
	}

	public void fireOutstretchHeightEvent() {
		fireCallback(this.outstretchHeightListener);
	}

	public JavaScriptObject getContextMetadata() {
		return this.contextMetadata;
	}
}
