package com.lorepo.icplayer.client;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.Scheduler;
import com.google.gwt.core.client.Scheduler.ScheduledCommand;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.http.client.Response;
import com.google.gwt.http.client.URL;
import com.google.gwt.user.client.Window;
import com.lorepo.icf.utils.ExtendedRequestBuilder;
import com.lorepo.icf.utils.ILoadListener;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icf.utils.UUID;
import com.lorepo.icplayer.client.content.services.AdaptiveLearningService;
import com.lorepo.icplayer.client.content.services.AssetsService;
import com.lorepo.icplayer.client.content.services.ReportableService;
import com.lorepo.icplayer.client.content.services.ScoreService;
import com.lorepo.icplayer.client.content.services.StateService;
import com.lorepo.icplayer.client.content.services.TimeService;
import com.lorepo.icplayer.client.metadata.IScoreWithMetadataService;
import com.lorepo.icplayer.client.metadata.ScoreWithMetadataService;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.PageList;
import com.lorepo.icplayer.client.model.page.PopupPage;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.player.IAdaptiveLearningService;
import com.lorepo.icplayer.client.module.api.player.IAssetsService;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IReportableService;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.api.player.IStateService;
import com.lorepo.icplayer.client.module.api.player.ITimeService;
import com.lorepo.icplayer.client.module.api.player.PageScore;
import com.lorepo.icplayer.client.page.KeyboardNavigationController;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.page.PagePopupPanel;
import com.lorepo.icplayer.client.ui.PlayerView;
import com.lorepo.icplayer.client.xml.IProducingLoadingListener;
import com.lorepo.icplayer.client.xml.page.PageFactory;

public class PlayerController implements IPlayerController {

	private final	Content				contentModel;
	private PlayerConfig config = new PlayerConfig();
	private PageController		pageController1;
	private PageController		pageController2;
	private PageController		headerController;
	private PageController		footerController;
	private final	PlayerView			playerView;
	private long				timeStart = 0;
	private final TimeService			timeService;
	private final ScoreService		scoreService;
	private final AssetsService		assetsService;
	private final StateService		stateService;
	private final ReportableService reportableService;
	private final AdaptiveLearningService adaptiveLearningService;
	private final ScoreWithMetadataService scoreWithMetadataService;
	private ILoadListener		pageLoadListener;
	private PagePopupPanel		popupPanel;
	private final String sessionId;
	private String analyticsId;
	private boolean showCover = false;
	private boolean isPopupEnabled = false;
	private final KeyboardNavigationController keyboardController = new KeyboardNavigationController();
	private PlayerEntryPoint entryPoint;
	private String responsiveVoice = "";
	private String lang = "en";
	private int iframeScroll = 0;
	private boolean isIframeInCrossDomain = false;
	private Set<IPage> visitedPages = new HashSet<IPage>();

	private String pageStamp = "0";

	private int lastVisitedPageIndex = -1;
	private int currentMainPageIndex = -1;

	public PlayerController(Content content, PlayerView view, boolean bookMode, PlayerEntryPoint entryPoint){
		this.entryPoint = entryPoint;
		this.contentModel = content;
		this.playerView = view;
		this.playerView.setPlayerController(this);
		this.sessionId = UUID.uuid();
		this.scoreService = new ScoreService(this.contentModel.getScoreType());
		this.stateService = new StateService();
		this.assetsService = new AssetsService(this.contentModel);
		this.reportableService = new ReportableService();
		this.scoreWithMetadataService = new ScoreWithMetadataService();

		this.createPageControllers(bookMode);
		this.scoreService.setPlayerService(this.pageController1.getPlayerServices());
		this.timeService = new TimeService();
		this.keyboardController.run(entryPoint);
		this.isIframeInCrossDomain = checkIsPlayerInCrossDomain();
		this.getIFrameScroll(this);
		this.handleCurrentPageIdRequest(this);
		this.lang = content.getMetadataValue("lang");
		this.responsiveVoice = content.getMetadataValue("responsiveVoiceLang");

		this.adaptiveLearningService = new AdaptiveLearningService(this, content.getAdaptiveStructure());
	}

	private void createPageControllers(boolean bookMode) {
		this.pageController1 = new PageController(this);
		this.pageController1.setView(this.playerView.getPageView(0));
		this.pageController1.setContent(this.contentModel);
		if(bookMode){
			this.playerView.showTwoPages();
			this.pageController2 = new PageController(this);
			this.pageController2.setView(this.playerView.getPageView(1));
			this.pageController2.setContent(this.contentModel);
		}
	}

	public void initHeaders() {
		if (this.contentModel.getHeaders().size() > 0) {
			this.playerView.createHeader();
			this.headerController = new PageController(this.pageController1.getPlayerServices());
			this.headerController.setView(this.playerView.getHeaderView());
			this.headerController.setContent(this.contentModel);
		}
		if (this.contentModel.getFooters().size() > 0) {
			this.playerView.createFooter();
			this.footerController = new PageController(this.pageController1.getPlayerServices());
			this.footerController.setView(this.playerView.getFooterView());
			this.footerController.setContent(this.contentModel);
		}
	}


	public void addPageLoadListener(ILoadListener l){
		this.pageLoadListener = l;
	}

	/**
	 * get current loaded page index
	 * @return
	 */
	@Override
	public int getCurrentPageIndex(){
		return this.currentMainPageIndex;
	}


	@Override
	public Content	getModel(){
		return this.contentModel;
	}


	@Override
	public PlayerView getView(){
		return this.playerView;
	}

	@Override
	public void switchToCommonPage(String pageName) {
		int index = this.getModel().getCommonPages().findPageIndexByName(pageName);

		if (index > -1) {
			this.switchToCommonPage(index);
		} else {
			Window.alert("Missing page:\n<" + pageName + ">");
		}
	}

	/**
	 * Przełączenie się na stronę o podanej nazwie
	 * @param pageName
	 * @return true if page found
	 */
	@Override
	public void switchToPage(String pageName) {
		int index = this.getModel().getPages().findPageIndexByName(pageName);

		if (index > -1){
			this.switchToPage(index);
		} else {
			Window.alert("Missing page:\n<" + pageName + ">");
		}
	}
	
	@Override
	public void switchToCommonPageById(String id) {
		int index = this.getModel().getCommonPages().findPageIndexById(id);

		if (index > -1) {
			this.switchToCommonPage(index);
		} else {
			Window.alert("Missing common page:\n<" + id + ">");
		}
	}
	
	@Override
	public void switchToPageById(String pageId) {
		int index = this.getModel().getPages().findPageIndexById(pageId);
		if(index > -1){
			this.switchToPage(index);
		}
		else{
			Window.alert("Missing page with id:\n<" + pageId + ">");
		}
	}

	@Override
	public void switchToPrevPage() {
		int index = this.currentMainPageIndex-1;
		if(this.pageController2 != null && index > 0) {
			index -= 1;
		}
		if(index >= 0) {
			this.switchToPage(index);
		}
	}

	@Override
	public void switchToLastVisitedPage() {
		if(this.isCurrentPageInCommons()) {
			this.switchToPage(this.currentMainPageIndex);
		} else {
			this.switchToPage(this.lastVisitedPageIndex);
		}
	}


	@Override
	public void switchToNextPage() {

		PageList pages = this.contentModel.getPages();

		int index = this.currentMainPageIndex + 1;
		if(this.pageController2 != null && index + 1 < pages.getTotalPageCount()) {
			index += 1;
		}
		if(index < pages.getTotalPageCount()) {
			this.switchToPage(index);
		}
	}


	/**
	 * Switch to page at given index
	 * @param index
	 */
	@Override
	public void switchToPage(int index) {
		if (this.lastVisitedPageIndex == -1) { //if player was started for the first time
			this.lastVisitedPageIndex = index;
			this.currentMainPageIndex = index;
		}
		else if (this.currentMainPageIndex != index) {
			this.lastVisitedPageIndex = this.currentMainPageIndex;
			this.currentMainPageIndex = index;
		}
		
		ArrayList<IPage> closedPages = this.closeCurrentPages();
		IPage page;
		if(this.pageController2 != null){
			if( (!this.showCover && index%2 > 0) ||
				(this.showCover && index%2 == 0 && index > 0))
			{
				index -= 1;
			}
		}
		if(index < this.contentModel.getPages().getTotalPageCount()){
			page = this.contentModel.getPage(index);
		}
		else{
			this.currentMainPageIndex = 0;
			page = this.contentModel.getPage(0);
		}

		if(this.showCover && index == 0){
			this.playerView.showSinglePage();
			this.switchToPage(page, closedPages.get(0), this.pageController1);
		}
		else{
			this.switchToPage(page, closedPages.get(0), this.pageController1);
			if(this.pageController2 != null && index+1 < this.contentModel.getPages().getTotalPageCount()){
				this.playerView.showTwoPages();
				page = this.contentModel.getPage(index+1);
				this.switchToPage(page, closedPages.get(1), this.pageController2);
			}
		}
	}

	public void switchToCommonPage(int index) {
		ArrayList<IPage> closedPages = this.closeCurrentPages();
		IPage page;
		if (this.pageController2 != null) {
			if ((!this.showCover && index % 2 > 0) || (this.showCover && index % 2 == 0 && index > 0)) {
				index -= 1;
			}
		}

		if (index < this.contentModel.getCommonPages().getTotalPageCount()) {
			page = this.contentModel.getCommonPage(index);
		} else {
			page = this.contentModel.getCommonPage(0);
		}

		if (this.showCover && index == 0) {
			this.playerView.showSinglePage();
			this.switchToPage(page, closedPages.get(0), this.pageController1);
		} else {
			this.switchToPage(page, closedPages.get(0), this.pageController1);
			if (this.pageController2 != null && index+1 < this.contentModel.getCommonPages().getTotalPageCount()) {
				this.playerView.showTwoPages();
				page = this.contentModel.getCommonPage(index+1);
				this.switchToPage(page, closedPages.get(1), this.pageController2);
			}
		}
	}

	private String generatePageStamp(String pageId) {
		return pageId + Long.toString(System.currentTimeMillis());
	}

	private void switchToPage(IPage page, IPage previousPage, final PageController pageController){
		page.setContentBaseURL(getContentBaseURL());
		pageController.getGradualShowAnswersService().hideAll();
	    this.pageStamp = this.generatePageStamp(page.getId());
		HashMap<String, String> params = new HashMap<String, String>();
		params.put("page", page.getId());
		this.sendAnalytics("switch to page", params );
		// Load new page
		String baseUrl = this.contentModel.getBaseUrl();
		String url = URLUtils.resolveURL(baseUrl, page.getHref());

        this.playerView.showWaitDialog();
		
		if (previousPage != null && previousPage.getHref() == page.getHref()) {
			onPageFinishedLoading((Object) previousPage, pageController);
		} else {
			PageFactory factory = new PageFactory((Page) page);
			factory.load(url, new IProducingLoadingListener() {
				@Override
				public void onFinishedLoading(Object producedItem) {
					onPageFinishedLoading(producedItem, pageController);
				}
				
				@Override
				public void onError(String error) {
					playerView.hideWaitDialog();
					JavaScriptUtils.log("Can't load page: " + error);
				}
			});
		}
	}
	
	private void onPageFinishedLoading(Object producedItem, PageController pageController) {
		Page page = (Page) producedItem;
		String isReportable = getReportableService().getStates().get(page.getId());
		if (isReportable != null) {
			if (isReportable.toLowerCase() == "true") {
				page.setAsReportable();
			} else {
				page.setAsNonReportable();
			}
		}
		pageLoaded(page, pageController);
		visitedPages.add(page);
		if (pageLoadListener != null){
			pageLoadListener.onFinishedLoading(producedItem);
		}
		playerView.hideWaitDialog();
		if (timeStart == 0){
			timeStart = System.currentTimeMillis();
		}

		if (!keyboardController.isModuleActivated()) {
			scrollViewToBeggining();
			scrollViewToTop();
		}
	}

	public native void scrollViewToTop () /*-{
		$wnd.parent.postMessage('SCROLL_VIEW_TOP', '*');
	}-*/;

	private void pageLoaded(Page page, PageController pageController) {
		this.keyboardController.save();
		this.keyboardController.reset();
		pageController.setPage(page);
		if (this.headerController != null && pageController != this.pageController2) {
		    this.setHeader(page);
		}
		this.keyboardController.addHeaderToNavigation(this.headerController);
		this.keyboardController.addMainToNavigation(this.pageController1);
		this.keyboardController.addSecondToNavigation(this.pageController2);
		if (this.footerController != null && pageController != this.pageController2) {
			this.setFooter(page);
		}
		this.keyboardController.addFooterToNavigation(this.footerController);
		this.keyboardController.restore();
	}

	private static void scrollViewToBeggining() {

		Scheduler.get().scheduleFinally(new ScheduledCommand() {
			@Override
			public void execute() {
				Window.scrollTo(0, 0);
			}
		});
	}

	private ArrayList<IPage> closeCurrentPages() {
		ArrayList<PageController> controllerArrayList = new ArrayList<PageController>();
		ArrayList<IPage> closedPages = new ArrayList<IPage>();
		controllerArrayList.add(this.pageController1);

		if (this.isBookMode()) {
			controllerArrayList.add(this.pageController2);
		}

		for (PageController controller : controllerArrayList) {
			controller.getGradualShowAnswersService().hideAll();
		}

		this.closePopup();

		for (PageController controller : controllerArrayList) {
			controller.updateScore(false);
		}

		this.updateState();

		for (PageController controller : controllerArrayList) {
			closedPages.add(controller.getPage());
			controller.closePage();
		}
		return closedPages;
	}

	public void updateScore() {
		this.pageController1.updateScore(false);

		if (this.isBookMode()) {
			this.pageController2.updateScore(false);
		}
	}

	private void updateTimeForCurrentPages() {
		IPage page1 = this.pageController1.getPage();
		IPage page2 = null;
		if (this.pageController2 != null) {
			page2 = this.pageController2.getPage();
		}
		this.timeService.updateTimeForPages(page1, page2);
	}

	public void updateState() {
		this.updateTimeForCurrentPages();
		HashMap<String, String> state = this.pageController1.getState();
		this.stateService.addState(state);
		if(this.pageController2 != null){
			state = this.pageController2.getState();
			this.stateService.addState(state);
		}
		if(this.headerController != null) {
			state = this.headerController.getState();
			this.stateService.addState(state);
		}
		if(this.footerController != null) {
			state = this.footerController.getState();
			this.stateService.addState(state);
		}
	}
	
	public String getVisitedPagesAsString(){
		String result = "";
		for (IPage page: this.visitedPages) {
			result += page.getId() + ";";
		}
		result = result.substring(0, result.length()-1);
		return result;
	}
	
	public void loadVisitedPagesFromString(String visitedPageIds){
		Set<IPage> newVisitedPages = new HashSet<IPage>();
		String[] ids = visitedPageIds.split(";");
		for (String id: ids) {
			IPage page = this.contentModel.getPageById(id);
			if (page != null) {
				newVisitedPages.add(page);
			}
		}
		this.visitedPages = newVisitedPages;
	}


	public IPlayerServices getPlayerServices() {
		return this.pageController1.getPlayerServices();
	}


	@Override
	public long getTimeElapsed() {
		return (System.currentTimeMillis()-this.timeStart)/1000;
	}


	@Override
	public IScoreService getScoreService() {
		return this.scoreService;
	}

	@Override
	public IAssetsService getAssetsService() {
		return this.assetsService;
	}


	@Override
	public IStateService getStateService() {
		return this.stateService;
	}


	@Override
	public void showPopup(String pageName, String top, String left, String additionalClasses) {
		if (this.isPopupEnabled()) {
			return;
		}
		this.setPopupEnabled(true);
		PopupPage page  = new PopupPage(this.contentModel.findPageByName(pageName));
		page.setContentBaseURL(getContentBaseURL());
		PageController popupPageControler = new PageController(this);
		popupPageControler.setContent(this.getModel());

		PlayerApp app = this.pageController1.getPlayerServices().getApplication();
		popupPageControler.getPlayerServices().setApplication(app);

		this.popupPanel = new PagePopupPanel(this.getView(), popupPageControler, top, left, additionalClasses, this.getPlayerServices());
		this.popupPanel.setPagePlayerController(this.pageController1);
		this.popupPanel.setLayoutID(this.contentModel.getActualSemiResponsiveLayoutID());
		this.popupPanel.showPage(page, this.contentModel.getBaseUrl());
	}


	@Override
	public void closePopup() {
		if(this.popupPanel != null){
			this.popupPanel.close();
			this.setPopupEnabled(false);
			this.popupPanel = null;
		}
	}


	@Override
	public void sendAnalytics(String event, HashMap<String, String> params) {
		if(this.analyticsId == null){
			return;
		}

		String url = "http://www.bluenotepad.com/api/log?" +
				"notepad=" + this.analyticsId + "&session=" + this.sessionId + "&event=" + event;
		if( params != null){
			for(String key : params.keySet()){
				url += "&" + key + "=" + params.get(key).replace("&nbsp;", " ");
			}
		}
		String encodedUrl = URL.encode(url);
		ExtendedRequestBuilder builder = new ExtendedRequestBuilder(ExtendedRequestBuilder.GET, encodedUrl);
		try {
			builder.sendRequest(null, new RequestCallback() {
				@Override
				public void onError(Request request, Throwable exception) {
				}
				@Override
				public void onResponseReceived(Request request, Response response){
				}
			});
		} catch (RequestException e) {
		}
	}


	public void setAnalytics(String id) {
		this.analyticsId = id;
	}


	public void setFirstPageAsCover(boolean showCover) {
		this.showCover = showCover;
	}


	@Override
	public boolean isBookMode() {
		return this.pageController2 != null;
	}


	@Override
	public boolean hasCover() {
		return this.showCover;
	}


	@Override
	public boolean isPopupEnabled() {
		return this.isPopupEnabled;
	}


	@Override
	public void setPopupEnabled(boolean enabled) {
		this.isPopupEnabled = enabled;
	}


	@Override
	public IPresenter findHeaderModule(String id) {
		if (this.headerController == null) {
			return null;
		}

		return this.headerController.findModule(id);
	}

	@Override
	public IPresenter findFooterModule(String id) {
		if (this.footerController == null) {
			return null;
		}

		return this.footerController.findModule(id);
	}

	@Override
	public PlayerConfig getPlayerConfig() {
		return this.config;
	}

	@Override
	public ITimeService getTimeService() {
		this.updateTimeForCurrentPages();
		return this.timeService;
	}

	public boolean hasHeader() {
		return this.headerController != null;
	}

	public boolean hasFooter() {
		return this.footerController != null;
	}

	@Override
	public void enableKeyboardNavigation() {
		keyboardController.switchKeyboard(true);
	}

	@Override
	public void disableKeyboardNavigation() {
		keyboardController.switchKeyboard(false);
	}

	@Override
	public void switchKeyboardNavigationToModule(String moduleId) {
		keyboardController.moveToModule(moduleId);
	}

	public void setPlayerConfig(PlayerConfig config) {
		this.config = config;
	}

	public void fireOutstretchHeightEvent() {
		this.entryPoint.fireOutstretchHeightEvent();
	}

	@Override
	public int getIframeScroll() {
		// when true, iframeScroll set by parsing message
		if (isIframeInCrossDomain) {
			return this.iframeScroll;
		}
		return this.getScrollTop();
	}
	
	private native int getScrollTop() /*-{
		var scrollTop = $wnd.window.top.pageYOffset;
		if (scrollTop === 0) {
			var contentView = $wnd.document.getElementById('content-view');
			if (contentView != null && contentView.scrollTop) {
				scrollTop = contentView.scrollTop;
			}
		};
		return scrollTop;
	}-*/;

	public void setIframeScroll (int scroll) {
		this.iframeScroll = scroll;
		
		if (this.pageController1 != null) {
			this.pageController1.sendScrollEvent(scroll);
		}
		
		if (this.pageController2 != null) {
			this.pageController2.sendScrollEvent(scroll);
		}
	}

	@Override
	public boolean isPlayerInCrossDomain() {
		return this.isIframeInCrossDomain;
	}
	
	private native boolean checkIsPlayerInCrossDomain () /*-{		
		try {
	        var doc = $wnd.window.top.document;
	        if (!doc) {
	            return true;
	        }
        	return false;
		} catch (e) {
		    return true;
		}
	}-*/;

	public native int getIFrameScroll (PlayerController x) /*-{
		var iframeScroll = 0;

		$wnd.addEventListener('message', function (event) {
			var data = event.data;
	
			if ((typeof data == 'string' || data instanceof String) && data.indexOf('I_FRAME_SCROLL:') === 0) {
				iframeScroll = JSON.parse(data.replace('I_FRAME_SCROLL:', ''));
				x.@com.lorepo.icplayer.client.PlayerController::setIframeScroll(I)(iframeScroll);
			}
		}, false);
	}-*/;

	public native int handleCurrentPageIdRequest (PlayerController x) /*-{
		$wnd.addEventListener('message', function (event) {
			var data = event.data;
	
			if ((typeof data == 'string' || data instanceof String) && data.indexOf('GET_CURRENT_PAGE_ID') === 0) {
				var currentPageId = x.@com.lorepo.icplayer.client.PlayerController::getCurrentPageId()();
				$wnd.parent.postMessage('CURRENT_PAGE_ID:' + currentPageId, '*');
			}
		}, false);
	}-*/;

	@Override
	public IReportableService getReportableService() {
		return this.reportableService;
	}

	private boolean isCurrentPageInCommons() {
		int commonsPageSize = this.contentModel.getCommonPages().getPageCount();
		for(int i = 0; i < commonsPageSize; i++) {
			if(this.contentModel.getCommonPage(i) == this.pageController1.getPage()) {
				return true;
			}
		}
		return false;
	}
	
	private void setHeader(Page page) {
		Page header = null;
		
		if (page.hasHeader()) {
			header = this.getModel().getHeader(page);
		}
		
	    if (header != null) {
			//default or selected header exists
	    	if (this.playerView.getHeaderView() == null) {
	    		this.playerView.createHeader();
	    		this.headerController.setView(this.playerView.getHeaderView());
	    	} else {
	    		this.headerController.closePage();
	    	}
	    	
			this.headerController.setPage(header);
	    } else {
			this.playerView.removeHeaderView();
		}
	}
	
	private void setFooter(Page page) {
		Page footer = null;
		
		if (page.hasFooter()) {
			footer = this.getModel().getFooter(page);
		}

		if (footer != null) {
			//default or selected footer exists
			if (this.playerView.getFooterView() == null) {
	    		this.playerView.createFooter();
	    		this.footerController.setView(this.playerView.getFooterView());
	    	} else {
	    		this.footerController.closePage();
	    	}
			
			this.footerController.setPage(footer);
		} else {
			this.playerView.removeFooterView();
		}
	}
	
	@Override
	public String getLang () {
		return this.lang;
	}

	public String getResponsiveVoiceLang() {
		return this.responsiveVoice;
	}

	public String getPageStamp() {
		return this.pageStamp;
	}
	
	public boolean isWCAGOn() {
		return this.keyboardController.isWCAGOn();
	}
	
	public Set<IPage> getVisitedPages() {
		return this.visitedPages;
	}

	public void clearVisitedPages() {
		this.visitedPages.clear();
		IPage page = this.pageController1.getPage();
		if (page != null) {
		    this.visitedPages.add(page);
		}
	}

	@Override
	public void sendExternalEvent(String eventType, String data) {
		this.entryPoint.onExternalEvent(eventType, data);

	}

	@Override
	public IAdaptiveLearningService getAdaptiveLearningService() {
		return this.adaptiveLearningService;
	}

	@Override
	public IScoreWithMetadataService getScoreWithMetadataService() {
		return scoreWithMetadataService;
	}

	@Override
	public String getCurrentPageId() {
		return this.pageController1.getPage().getId();
	}

	@Override
	public void setExternalVariable(String key, String value) {
		IPlayerServices services = this.pageController1.getPlayerServices();
		services.setExternalVariable(key, value);
	}

	@Override
	public String getExternalVariable(String key) {
		IPlayerServices services = this.pageController1.getPlayerServices();
		return services.getExternalVariable(key);
	}

	@Override
	public void setAllPagesAsVisited() {
		int pageCount = this.getModel().getPageCount();
		for (int i = 0; i < pageCount; i++) {
			IPage page = this.getModel().getPage(i);
			if (!visitedPages.contains(page)) {
                		visitedPages.add(page);
				PageScore newPageScore = new PageScore(0, page.getModulesMaxScore());
				scoreService.setPageScore(page, newPageScore);
			}
		}
	}

	public void setTextReading(boolean isWCAGOn) {
		if (this.pageController1 != null) {
			this.pageController1.setTextReading(isWCAGOn);
		}
	}

	public void clearKeyboardNavigationListeners() {
		if (this.keyboardController != null) {
			this.keyboardController.clearEventListeners();
		}
	}

	public void setNVDAAvailability(boolean shouldUseNVDA) {
		keyboardController.handleNVDAAvailability(shouldUseNVDA);
	}

	public String getContentBaseURL() {
	    JavaScriptObject contextMetadata = getPlayerServices().getContextMetadata();
	    if (contextMetadata != null) {
			String contentBaseURL = JavaScriptUtils.getArrayItemByKey(contextMetadata, "contentBaseURL");
			return contentBaseURL == "" ? null : contentBaseURL;
	    }
	    return null;
	}

	public void updateMathJaxInCurrentPage() {
		this.pageController1.refreshMathJax();
	}
}
