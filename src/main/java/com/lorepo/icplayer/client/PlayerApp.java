package com.lorepo.icplayer.client;

import java.util.ArrayList;
import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.user.client.ui.RootPanel;
import com.lorepo.icf.utils.ILoadListener;
import com.lorepo.icf.utils.JSONUtils;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icf.utils.dom.DOMInjector;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.CssStyle;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.ui.PlayerView;
import com.lorepo.icplayer.client.xml.IProducingLoadingListener;
import com.lorepo.icplayer.client.xml.IXMLFactory;
import com.lorepo.icplayer.client.xml.content.ContentFactory;

public class PlayerApp {

	private String divId;
	private	Content contentModel;
	private PlayerController playerController;
	private PlayerConfig playerConfig = new PlayerConfig();
	/** Score service impl */
	private PlayerEntryPoint entryPoint;
	private int startPageIndex = 0;
	private HashMap<String, String> loadedState;
	private boolean bookMode = false;
	private boolean showCover = false;
	private String analyticsId = null;
	private ArrayList<Integer> pagesSubset = null;
	private boolean isStaticHeader = false;


	public PlayerApp (String id, PlayerEntryPoint entryPoint) {
		this.divId = id;
		this.entryPoint = entryPoint;
	}

	public static native int getIFrameSize (boolean isCommonPage, PlayerApp instance) /*-{
		$wnd.addEventListener('message', function (event) {
			var data = event.data;

			if (data.indexOf('I_FRAME_SIZES:') === 0) {
				$wnd.iframeSize = JSON.parse(data.replace('I_FRAME_SIZES:', ''));
			}
		}, false);

		$wnd.isFrameInDifferentDomain = false;
		$wnd.iframeSize = $wnd.iframeSize || {
			offsetTop: 0,
			height: 0,
			frameOffset: 64,
			windowInnerHeight: 0,
			isEditorPreview: false
		};
	}-*/;

	/**
	 * Get global score service
	 * @return
	 */
	public IScoreService getScoreService() {
		return playerController.getScoreService();
	}

	/**
	 * Load content from given URL
	 * @param url
	 * @param pageIndex
	 * @param isCommonPage
	 */
	private void loadPage(String url, int pageIndex, final boolean isCommonPage) {
		startPageIndex = pageIndex;

		IXMLFactory contentFactory = ContentFactory.getInstance(this.pagesSubset);

		contentFactory.load(url, new IProducingLoadingListener() {
			public void onFinishedLoading(Object content) {
				contentModel = (Content) content;
				contentModel.connectHandlers();
				initPlayer(isCommonPage);
			}

			public void onError(String error) {
				JavaScriptUtils.log("Can't load:" + error);
			}
		});
	}

	/**
	 * Load content from given URL
	 * @param url
	 * @param pageIndex
	 */
	public void load(String url, int pageIndex) {
		loadPage(url, pageIndex, false);
	}

	/**
	 * Load common page from given URL
	 * @param url
	 * @param pageIndex
	 */
	public void loadCommonPage(String url, int pageIndex) {
		loadPage(url, pageIndex, true);
	}

	public void setPages(String pagesSub) {
		if (pagesSub == null || pagesSub.isEmpty()) {
			throw new IllegalArgumentException();
		}

		ArrayList<Integer> selectedPages = new ArrayList<Integer>();
		for (String page : pagesSub.split(",")) {
			selectedPages.add(Integer.valueOf(page));
		}

		if (selectedPages.size() > 0) {
			pagesSubset = selectedPages;
		}
	}

	public void setAnalytics(String id) {
		analyticsId = id;
	}

	public static native int getScreenHeight() /*-{
		if ($wnd.isFrameInDifferentDomain) {
			return 900;
		} else {
			if ($wnd.location !== $wnd.parent.location) {
				var offsetIframe = $wnd.iframeSize.offsetTop;
				return $wnd.parent.innerHeight - offsetIframe;
			} else {
				return $wnd.innerHeight;
			}
		}
	}-*/;

	public static native int getPageHeight() /*-{
		if ($wnd.isFrameInDifferentDomain) {
			return 1200;
		} else {
			return $wnd.$('table.ic_player').css('height').replace('px', '');
		}
	}-*/;

	public static native void removeStaticFooter() /*-{
		$wnd.$(".ic_footer").parent().removeClass("ic_static_footer");
	}-*/;

	public static native void registerGetIframe (PlayerApp instance) /*-{
		$wnd.get_iframe = function () {
			if ($wnd.playerIFrame) {
				return $wnd.playerIFrame;
			}

			try {
				var currentLocation = $wnd.location.href;

				$wnd.parent.$('iframe').each(function() {
					if (this.src == currentLocation) {
						$wnd.playerIFrame = $wnd.$(this);
					}
				});
				$wnd.isFrameInDifferentDomain = false;

				$wnd.isInIframe = ($wnd.location != $wnd.parent.location) ? true : false;

				return $wnd.playerIFrame;
			} catch(e) {
				$wnd.isFrameInDifferentDomain = true;
			}
		}
	}-*/;

	public static native void setPageTopAndStaticHeader (int top) /*-{
		var page = $wnd.$(".ic_page");
		page.css("top", top);

		$wnd.$(".ic_header").parent().addClass("ic_static_header");
		$wnd.$(".ic_static_header").css("width", page.css("width"));
		if ($wnd.isFrameInDifferentDomain || $wnd.isInIframe) {
			$wnd.addEventListener('message', function(event) {
				if (event.data.indexOf('I_FRAME_SIZES:') === 0) {
					var scroll = $wnd.iframeSize.offsetTop;
					var playerOffset = $wnd.iframeSize.frameOffset || 64;
					if($wnd.iframeSize.isEditorPreview){
						playerOffset = 0;
					}
					var top = scroll > playerOffset ? scroll - playerOffset : 0;
					$wnd.$(".ic_static_header").css("top", top);
				}
			});
		} else {
			var logoHeight = $wnd.$("#_icplayer").offset().top;

			if (logoHeight > 0) {
				$wnd.addEventListener('scroll', function () {
					var scroll = $wnd.scrollY;
					if (scroll < logoHeight) {
						$wnd.$(".ic_static_header").css("top", logoHeight - scroll);
					} else {
						$wnd.$(".ic_static_header").css("top", 0);
					}
				});
			} else {
				$wnd.$(".ic_static_header").css("top", 0);
			}
		}

		var pageHeight = page.css("height").replace("px", "");
		var height = parseInt(pageHeight, 10) + parseInt(top, 10);
		$wnd.$(".ic_content").parent().css("height", height);
	}-*/;

	public static native void setStaticFooter (int headerHeight, boolean isHeaderStatic) /*-{
		var footer = $wnd.$(".ic_footer");
		var page = $wnd.$(".ic_page");

		footer.parent().addClass("ic_static_footer");
		$wnd.$(".ic_static_footer").css("width", page.css("width"));
		footer.css("top", 0);

		var pageHeight = parseInt(page.css("height").replace('px', ''), 10);
		var icFooterHeight = parseInt(footer.css('height').replace('px', ''), 10);

		page.css("height", pageHeight + icFooterHeight);

		if ($wnd.isFrameInDifferentDomain || $wnd.isInIframe) {
			var offsetIframe = $wnd.iframeSize.frameOffset;
			var sum = $wnd.iframeSize.windowInnerHeight - offsetIframe - icFooterHeight;

			$wnd.$(".ic_static_footer").css("top", sum + "px");

			$wnd.addEventListener('message', function (event) {
				if (event.data.indexOf('I_FRAME_SIZES:') === 0) {
					var scroll = $wnd.iframeSize.offsetTop;
					offsetIframe = $wnd.iframeSize.notScaledOffset;
					sum = $wnd.iframeSize.windowInnerHeight - offsetIframe - icFooterHeight + scroll;
					if (sum >= ($wnd.iframeSize.height - icFooterHeight)) {
						$wnd.$(".ic_static_footer").css("top", "auto");
					} else {
						$wnd.$(".ic_static_footer").css("top", sum + "px");
					}
				}
			});
		} else {
			var referrer = $doc.referrer;

			if (referrer.indexOf($wnd.location.origin) > -1) {
				var offsetIframe = $wnd.get_iframe() ? $wnd.get_iframe().offset().top : 0;
				var sum = parseInt(window.top.innerHeight, 10) - offsetIframe - icFooterHeight;
				$wnd.$(".ic_static_footer").css("top", sum + "px");

				$wnd.parent.addEventListener('scroll', function () {
					var parentScroll = $wnd.parent.scrollY;
					sum = parseInt(window.top.innerHeight, 10) - offsetIframe - icFooterHeight + parentScroll;

					if (sum >= (($wnd.get_iframe() ? $wnd.get_iframe().height() : 0) - icFooterHeight)) {
						$wnd.$(".ic_static_footer").css("top", "auto");
					} else {
						$wnd.$(".ic_static_footer").css("top", sum + "px");
					}
				});
			}
		}

		if (isHeaderStatic) {
			var contentHeight = $wnd.$(".ic_content").css("height").replace("px", "");
			$wnd.$(".ic_content").parent().css("height", parseInt(contentHeight, 10)+parseInt(headerHeight, 10));
		}
	}-*/;

	public static native int getHeaderHeight() /*-{
		return $wnd.$(".ic_header").css("height");
	}-*/;

	public static native String getStaticHeaderHeight() /*-{
		return $wnd.$(".ic_static_header").css("height").replace("px", "");
	}-*/;

	public static native String getStaticFooterHeight() /*-{
		return $wnd.$(".ic_footer").css("height").replace("px", "");
	}-*/;

	public static native boolean isStaticFooter() /*-{
		return $wnd.$(".ic_static_footer").length > 0;
	}-*/;

	public static native boolean isStaticHeader() /*-{
		return $wnd.$(".ic_static_header").length > 0;
	}-*/;


	/**
	 * Init player after content is loaded
	 */
	@SuppressWarnings("static-access")
	private void initPlayer(final boolean isCommonPage) {
		registerGetIframe(this);
		getIFrameSize(isCommonPage, this);
		this._initPlayer(isCommonPage);
		this.getIframe();
	}

	/**
	 * Init player after content is loaded
	 */
	private void _initPlayer(final boolean isCommonPage) {
		PlayerView playerView = new PlayerView();
		playerController = new PlayerController(contentModel, playerView, bookMode, entryPoint);
		playerController.setPlayerConfig(playerConfig);
		playerController.setFirstPageAsCover(showCover);
		playerController.setAnalytics(analyticsId);

		playerController.addPageLoadListener(new ILoadListener() {
			@Override
			public void onFinishedLoading(Object obj) {
				if (contentModel.getMetadataValue("staticHeader").compareTo("true") == 0 && playerController.hasHeader()) {
					makeHeaderStatic();
				}

				if (contentModel.getMetadataValue("staticFooter").compareTo("true") == 0 && playerController.hasFooter()) {
					makeFooterStatic();
				}

				entryPoint.onPageLoaded();
			}
			@Override
			public void onError(String error) {
				JavaScriptUtils.log("Loading pages error: " + error);
			}
		});

		contentModel.setPlayerController(getPlayerServices());

		RootPanel.get(divId).add(playerView);
		this.loadActualLayoutCSSStyles();

		ContentDataLoader loader = new ContentDataLoader(contentModel.getBaseUrl());

		loader.addAddons(contentModel.getAddonDescriptors().values());
		if (contentModel.getHeader() != null) {
			loader.addPage(contentModel.getHeader());
		}
		if (contentModel.getFooter() != null) {
			loader.addPage(contentModel.getFooter());
		}

		loader.load(new ILoadListener() {
			@Override
			public void onFinishedLoading(Object obj) {
				loadFirstPage(isCommonPage);
			}

			@Override
			public void onError(String error) {
				JavaScriptUtils.log("Loading ContentData have failed, error: " + error);
			}
		});
	}

	private void loadActualLayoutCSSStyles() {
		String actualCSSID = this.contentModel.getActualStyleID();
		CssStyle actualStyle = contentModel.getStyleByID(actualCSSID);
		String cssValue = actualStyle.style;
		String css = URLUtils.resolveCSSURL(contentModel.getBaseUrl(), cssValue);
		DOMInjector.appendStyle(css);
	}

	private void makeHeaderStatic() {
		int headerHeight = getHeaderHeight();
		setPageTopAndStaticHeader(headerHeight);
		isStaticHeader = true;
	}

	private void makeFooterStatic() {
		removeStaticFooter();

		final int screenHeight = getScreenHeight();
		final int pageHeight = getPageHeight();

		if (screenHeight < pageHeight) {
			final int headerHeight = getHeaderHeight();
			setStaticFooter(headerHeight, isStaticHeader);
		}
	}

	private static native void getIframe () /*-{
		$wnd.get_iframe();
	}-*/;

	private void loadFirstPage(boolean isCommonPage) {
		if (loadedState != null) {
			playerController.getPlayerServices().getStateService().loadFromString(loadedState.get("state"));
			playerController.getPlayerServices().getScoreService().loadFromString(loadedState.get("score"));
			playerController.getPlayerServices().getTimeService().loadFromString(loadedState.get("time"));
		}

		if (isCommonPage) {
			playerController.switchToCommonPage(startPageIndex);
		} else {
			playerController.initHeaders();
			playerController.switchToPage(startPageIndex);
		}
	}

	public IPlayerServices getPlayerServices() {
		return playerController.getPlayerServices();
	}

	public void updateScore() {
		playerController.updateScore();
	}

	public static class PlayerConfigOverlay extends JavaScriptObject {
		protected PlayerConfigOverlay() {}

		public final native PlayerEventsConfigOverlay getEvents() /*-{
			return this.events ? this.events : {};
		}-*/;

		/**
		 * Because GWT Overlay Types cannot be created with new keyword and
		 * it only can be created from JSNI we're returning empty JavaScript
		 * object that will be marshaled to PlayerConfig type.
		 * @return
		 */
		public static final native PlayerConfigOverlay getEmpty() /*-{
			return {};
		}-*/;
	}

	public static class PlayerEventsConfigOverlay extends JavaScriptObject {
		protected PlayerEventsConfigOverlay() {}

		public final native String[] getDisabled() /*-{
			return this.disabled ? this.disabled : [];
		}-*/;
	}

	public void setConfig(JavaScriptObject config) {
		PlayerConfigOverlay overlayConfig = JSONUtils.parseOverlayType(config, PlayerConfigOverlay.class);

		this.playerConfig = PlayerConfig.fromOverlay(overlayConfig);
	}

	public void setState(String state) {
		HashMap<String, String> data = JSONUtils.decodeHashMap(state);

		if (data.containsKey("state") && data.containsKey("score")) {
			loadedState = data;
		}
	}

	public String getState() {
		playerController.updateState();
		String state = playerController.getPlayerServices().getStateService().getAsString();
		String score = playerController.getPlayerServices().getScoreService().getAsString();
		String time = playerController.getPlayerServices().getTimeService().getAsString();
		HashMap<String, String> data = new HashMap<String, String>();
		data.put("state", state);
		data.put("score", score);
		data.put("time", time);
		return JSONUtils.toJSONString(data);
	}

	public void setBookMode() {
		bookMode = true;
	}

	public void showCover(boolean show) {
		showCover = show;
	}

	public JavaScriptObject getSemiResponsiveLayouts() {
		return this.contentModel.getSemiResponsiveLayoutsAsJS();
	}

	public boolean changeLayout(String layoutID) {
		boolean isLayoutChanged = this.contentModel.setActualLayoutID(layoutID);
		
		if (isLayoutChanged) {
			this.loadActualLayoutCSSStyles();
			int pageIndex = this.playerController.getCurrentPageIndex();
			this.playerController.switchToPage(pageIndex);	
		}
		
		return isLayoutChanged;
	}
}
