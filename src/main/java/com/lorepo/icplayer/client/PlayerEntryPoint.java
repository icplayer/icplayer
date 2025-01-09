package com.lorepo.icplayer.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.JavaScriptObject;
import com.lorepo.icf.utils.ExtendedRequestBuilder;
import com.lorepo.icf.utils.ILoadListener;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.metadata.ScoreWithMetadata;
import com.lorepo.icplayer.client.printable.PrintableContentParser;
import com.lorepo.icplayer.client.printable.PrintableParams;
import com.lorepo.icplayer.client.module.api.player.OpenActivitiesScoresParser;

import java.util.List;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class PlayerEntryPoint implements EntryPoint {

	private PlayerApp theApplication;
	private JavaScriptObject pageLoadedListener;
	private JavaScriptObject externalEventListener;
	private JavaScriptObject pageScrollToListener;
	private JavaScriptObject statusChangedListener;
	private JavaScriptObject outstretchHeightListener;
	private JavaScriptObject contextMetadata;
	private JavaScriptObject externalVariables;

	/**
	 * This is the entry point method.
	 */
	@Override
	public void onModuleLoad() {
		externalVariables = JavaScriptObject.createObject();
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

			player.sendLayoutChangedEvent = function (value) {
			    return entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::sendLayoutChangedEvent(Ljava/lang/String;)(value);
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
			
			player.onExternalEvent = function(listener) {
				entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::externalEventListener = listener;
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
				entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::updateMathJax()();
				return entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::contextMetadata = contextData;
			};

			player.setExternalVariables = function(contextData){
				entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::setExternalVariables(Lcom/google/gwt/core/client/JavaScriptObject;)(contextData);
			};

			player.getExternalVariables = function(){
				return entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::getExternalVariables()();
			};
			
			player.getPrintableHTML = function(callback, randomizePages, randomizeModules, showAnswers, dpi) {
				return entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::generatePrintableHTML(Lcom/google/gwt/core/client/JavaScriptObject;ZZZI)(callback, randomizePages, randomizeModules, showAnswers, dpi);
			};
			
			player.getPrintableHTMLWithSeed = function(callback, randomizePages, randomizeModules, showAnswers, dpi, seed) {
				return entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::generatePrintableHTML(Lcom/google/gwt/core/client/JavaScriptObject;ZZZII)(callback, randomizePages, randomizeModules, showAnswers, dpi, seed);
			};

			player.setPrintableOrder = function(order) {
				entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::setPrintableOrder(Lcom/google/gwt/core/client/JavaScriptObject;)(order);
			};
			
			player.preloadAllPages = function(callback) {
				return entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::preloadAllPages(Lcom/google/gwt/core/client/JavaScriptObject;)(callback);
			};
			
			player.getCurrentStyles = function () {
				return entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::getCurrentStyles()(); 
			}

			player.getScoreWithMetadata = function () {
				return entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::getScoreWithMetadata()();
			};

			player.setScoreWithMetadata = function (state) {
				entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::setScoreWithMetadata(Ljava/lang/String;)(state);
			};

			player.setNVDAAvailability = function(shouldUseNVDA) {
				entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::setNVDAAvailability(Z)(shouldUseNVDA);
			};

			player.setOpenActivitiesScores = function(scores) {
				entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::setOpenActivitiesScores(Lcom/google/gwt/core/client/JavaScriptObject;)(scores);
			};

			player.cleanBeforeClose = function () {
				return entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::cleanBeforeClose()();
			};

			player.getRequestsConfig = function () {
				var commands = function() {};

				commands.setIncludeCredentials = function(withCredentials) {
					entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::setIncludeCredentials(Z)(withCredentials);
				};

				commands.setSigningPrefix = function(signingPrefix) {
					entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::setSigningPrefix(Ljava/lang/String;)(signingPrefix);
				};

				commands.addPageToWhitelist = function(pageURL) {
					entryPoint.@com.lorepo.icplayer.client.PlayerEntryPoint::addPageToWhitelist(Ljava/lang/String;)(pageURL);
				};

				return commands;
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
		clearBeforeReload();
		this.theApplication.load(url, pageIndex);
	}

	private void loadCommonPage(String url, int pageIndex) {
		if (pageIndex < 0) {
			pageIndex = 0;
		}
		clearBeforeReload();
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

	private void sendLayoutChangedEvent(String value) {
	    this.theApplication
			.getPlayerServices()
			.getEventBusService()
			.sendValueChangedEvent("", "ChangeLayout", "", value, "");
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
	
	private static native void fireExternalEvent(JavaScriptObject callback, String eventType, String data)/*-{
		if (callback != null) {
			callback(eventType, data);
		}
	}-*/;
	
	public void onExternalEvent(String eventType, String data) {
		fireExternalEvent(this.externalEventListener, eventType, data);
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

	public void setExternalVariables(JavaScriptObject contextData) {
		if (JavaScriptUtils.isObject(contextData))
			this.externalVariables = contextData;
		else
			JavaScriptUtils.log(
					"The received value is not a dictionary (it is not instance of Object). " +
					"Received value: " + contextData
			);
	}

	public JavaScriptObject getExternalVariables() {
		return this.externalVariables;
	}
	
	private void generatePrintableHTML(final JavaScriptObject callback, boolean randomizePages, boolean randomizeModules, boolean showAnswers, int dpi) {
		generatePrintableHTML(callback, randomizePages, randomizeModules, showAnswers, dpi, -1);
	}
	
	private void generatePrintableHTML(final JavaScriptObject callback, boolean randomizePages, boolean randomizeModules, boolean showAnswers, int dpi, int seed) {
		PrintableContentParser.ParsedListener listener = new PrintableContentParser.ParsedListener() {
			@Override
			public void onParsed(String result) {
				fireParsedCallback(callback, result);
			}
		};
		PrintableParams params = new PrintableParams();
		params.listener = listener;
		params.randomizePages = randomizePages;
		params.randomizeModules = randomizeModules;
		params.showAnswers = showAnswers;
		params.dpi = dpi;
		params.seed = seed;
		theApplication.generatePrintableHTML(params);
	}

	private static native void fireParsedCallback(JavaScriptObject callback, String result)/*-{
		if (callback != null) {
			callback(result);
		}
	}-*/;

	private String getCurrentStyles () {
		return theApplication.getCurrentStyles();
	}
	
	private void preloadAllPages(final JavaScriptObject callback) {
		theApplication.preloadAllPages(new ILoadListener() {

			@Override
			public void onFinishedLoading(Object obj) {
				fireCallback(callback);
				
			}

			@Override
			public void onError(String error) {
				JavaScriptUtils.log("Loading pages error: " + error);
			}
			
		});
	}

	private JavaScriptObject getScoreWithMetadata() {
		JavaScriptObject jsScores = JavaScriptUtils.createEmptyJsArray();
		List<ScoreWithMetadata> scores = theApplication.getScoreWithMetadata();
		for (ScoreWithMetadata score: scores) {
			JavaScriptUtils.addElementToJSArray(jsScores, score.getJSObject());
		}
		return jsScores;
	}

	private void setScoreWithMetadata(String state) {
		this.theApplication.setScoreWithMetadata(state);
	}
	
	private void cleanBeforeClose() {
		clearBeforeReload();
		resetGWTLoadedStatues();
	}
	
	private native void resetGWTLoadedStatues() /*-{
		$wnd.__gwt_stylesLoaded = undefined;
		$wnd.__gwt_scriptsLoaded = undefined;
	}-*/;

	private void clearBeforeReload() {
		if (theApplication != null && theApplication.isContentModelLoaded()) {
			clearMetadata();
			theApplication.clearBeforeReload();
		}
	}

	private void clearMetadata() {
		pageLoadedListener = null;
		externalEventListener = null;
		pageScrollToListener = null;
		statusChangedListener = null;
		outstretchHeightListener = null;
		contextMetadata = null;
		externalVariables = null;
	}

	private void setPrintableOrder(JavaScriptObject order) {
		this.theApplication.setPrintableOrder(order);
	}

	private void setNVDAAvailability(boolean shouldUseNVDA) {
		this.theApplication.setNVDAAvailability(shouldUseNVDA);
	}

	private void setOpenActivitiesScores(JavaScriptObject scores) {
		this.theApplication.setOpenActivitiesScores(OpenActivitiesScoresParser.toHashMap(scores));
	}

	private void setIncludeCredentials(boolean withCredentials) {
		ExtendedRequestBuilder.setGlobalIncludeCredentials(withCredentials);
	}

	private void setSigningPrefix(String signingPrefix) {
		ExtendedRequestBuilder.setSigningPrefix(signingPrefix);
	}

	private void addPageToWhitelist(String pageURL) {
		ExtendedRequestBuilder.addPageToWhitelist(pageURL);
	}

	private void updateMathJax() {
		this.theApplication.handleUpdatingMathJax();
		this.sendEventOnEnd();
	}

	public String getMathJaxRendererOption() {
		JavaScriptObject contextMetadata = getContextMetadata();
		if (contextMetadata != null) {
			return JavaScriptUtils.getArrayItemByKey(contextMetadata, "mathJaxRenderer");
		}

		return "";
	}

	public static native void sendEventOnEnd () /*-{
		var totalTime = 0;
		
		var sendEventInterval = setInterval(function () {
			var minLoadingTime = 500;
			var isQueueEmpty = $wnd.MathJax.Hub.queue.queue.length === 0;
			var isIconVisible = @com.lorepo.icplayer.client.PlayerEntryPoint::isLoadingIconVisible()();
			var isImageLoaded = @com.lorepo.icplayer.client.PlayerEntryPoint::isImageLoaded()();
			var areAddonsLoaded = isQueueEmpty && !isIconVisible && isImageLoaded;

			if ((areAddonsLoaded && totalTime > minLoadingTime) || totalTime > 30000) {
				@com.lorepo.icplayer.client.PlayerEntryPoint::sendAddonsLoadedEvent()();
				clearInterval(sendEventInterval);
			}
			totalTime += 200;
		}, 200);
	}-*/;

	public static native boolean isLoadingIconVisible () /*-{
		var $element = $wnd.$(".image-viewer-loading-image");

		return $element.get(0) ? $element.css('display') === 'block' : false;
	}-*/;

	public static native boolean isImageLoaded () /*-{
		var $element = $wnd.$(".addon_Image_Identification");

		return $element.get(0) ? $element.children('div').length > 0 : true;
	}-*/;

	public static native void sendAddonsLoadedEvent () /*-{
		$wnd.parent.postMessage('ADDONS_LOADED', '*');
	}-*/;
}
