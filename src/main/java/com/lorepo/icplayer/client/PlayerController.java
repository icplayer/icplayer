package com.lorepo.icplayer.client;

import java.util.HashMap;

import com.google.gwt.core.client.Scheduler;
import com.google.gwt.core.client.Scheduler.ScheduledCommand;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestBuilder;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.http.client.Response;
import com.google.gwt.http.client.URL;
import com.google.gwt.user.client.Window;
import com.lorepo.icf.utils.ILoadListener;
import com.lorepo.icf.utils.IXMLSerializable;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icf.utils.UUID;
import com.lorepo.icf.utils.XMLLoader;
import com.lorepo.icplayer.client.content.services.ScoreService;
import com.lorepo.icplayer.client.content.services.StateService;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.Content.ScoreType;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.model.PageList;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.api.player.IStateService;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.page.PagePopupPanel;
import com.lorepo.icplayer.client.ui.PlayerView;

public class PlayerController implements IPlayerController{

	private	Content				contentModel;
	private PageController		pageController1;
	private PageController		pageController2;
	private PageController		headerController;
	private PageController		footerController;
	private	PlayerView			playerView;
	private long				timeStart = 0;
	private ScoreService		scoreService;
	private StateService		stateService;
	private ILoadListener		pageLoadListener;
	private PagePopupPanel		popupPanel;
	private String sessionId;
	private String analyticsId;
	private boolean showCover = false;
	private boolean isPopupEnabled = false;
	
	
	public PlayerController(Content content, PlayerView view, boolean bookMode){
		
		contentModel = content;
		playerView = view;
		playerView.setPlayerController(this);
		sessionId = UUID.uuid();
		scoreService = new ScoreService(contentModel.getScoreType() == ScoreType.last);
		stateService = new StateService();
		createPageControllers(bookMode);
	}
	
	
	private void createPageControllers(boolean bookMode) {

		pageController1 = new PageController(this);
		pageController1.setView(playerView.getPageView(0));
		if(bookMode){
			playerView.showTwoPages();
			pageController2 = new PageController(this);
			pageController2.setView(playerView.getPageView(1));
		}
	}

	
	public void initHeaders() {
		if(contentModel.getHeader() != null){
			playerView.showHeader();
			headerController = new PageController(pageController1.getPlayerServices());
			headerController.setView(playerView.getHeaderView());
			
//			headerController.setPage(contentModel.getHeader());
		}
		if(contentModel.getFooter() != null){
			playerView.showFooter();
			footerController = new PageController(pageController1.getPlayerServices());
			footerController.setView(playerView.getFooterView());
//			footerController.setPage(contentModel.getFooter());
		}
	}


	public void addPageLoadListener(ILoadListener l){
		pageLoadListener = l;
	}
	
	/**
	 * get current loaded page index
	 * @return
	 */
	public int getCurrentPageIndex(){
		
		int index = 0;
		for(int i = 0; i < contentModel.getPageCount(); i++){
			if(contentModel.getPage(i) == pageController1.getPage()){
				index = i;
				break;
			}
		}
		return index;
	}
	
	
	public Content	getModel(){
		return contentModel;
	}
	
	
	public PlayerView getView(){
		return playerView;
	}
	
	
	/**
	 * Przełączenie się na stronę o podanej nazwie
	 * @param pageName
	 * @return true if page found
	 */
	public void switchToPage(String pageName) {

		int index = getModel().getPages().findPageIndexByName(pageName);
		if(index > -1){
			switchToPage(index);
		}
		else{
			Window.alert("Missing page:\n<" + pageName + ">");
		}
	}

	@Override
	public void switchToPageById(String pageId) {
		int index = getModel().getPages().findPageIndexById(pageId);
		if(index > -1){
			switchToPage(index);
		}
		else{
			Window.alert("Missing page with id:\n<" + pageId + ">");
		}
	}

	public void switchToPrevPage() {
		PageList pages = contentModel.getPages();
		for(int i = 0; i < pages.getTotalPageCount(); i++){
			if(pages.getAllPages().get(i) == pageController1.getPage()){
				int index = i-1;
				if(pageController2 != null && index > 0){
					index -= 1;
				}
				if(index >= 0){
					switchToPage(index);
				}
				break;
			}
		}
	}


	public void switchToNextPage() {

		PageList pages = contentModel.getPages();
		for(int i = 0; i < pages.getTotalPageCount(); i++){
			if(pages.getAllPages().get(i) == pageController1.getPage()){
				int index = i+1;
				if(pageController2 != null && index+1 < pages.getTotalPageCount()){
					index += 1;
				}
				if(index < pages.getTotalPageCount()){
					switchToPage(index);
				}
				break;
			}
		}
	}


	/**
	 * Switch to page at given index
	 * @param index
	 */
	public void switchToPage(int index){
		
		closeCurrentPages();
		IPage page;
		if(pageController2 != null){
			if( (!showCover && index%2 > 0) || 
				(showCover && index%2 == 0 && index > 0))
			{
				index -= 1;
			}
		}
		if(index < contentModel.getPages().getTotalPageCount()){
			page = contentModel.getPage(index);
		}
		else{
			page = contentModel.getPage(0);
		}
		
		if(showCover && index == 0){
			playerView.showSinglePage();
			switchToPage(page, pageController1);
		}
		else{
			switchToPage(page, pageController1);
			if(pageController2 != null && index+1 < contentModel.getPages().getTotalPageCount()){
				playerView.showTwoPages();
				page = contentModel.getPage(index+1);
				switchToPage(page, pageController2);
			}
		}
	}
	

	private void switchToPage(IPage page, final PageController pageController){

		
		HashMap<String, String> params = new HashMap<String, String>();
		params.put("page", page.getId());
		sendAnalytics("switch to page", params );
		// Load new page
		String baseUrl = contentModel.getBaseUrl();
		XMLLoader reader = new XMLLoader((IXMLSerializable) page);
		String url = URLUtils.resolveURL(baseUrl, page.getHref());
		playerView.showWaitDialog();
		reader.load(url, new ILoadListener() {
			
			@Override
			public void onFinishedLoading(Object obj) {
				Page page = (Page) obj;
				pageLoaded(page, pageController);
				if(pageLoadListener != null){
					pageLoadListener.onFinishedLoading(obj);
				}
				playerView.hideWaitDialog();
				if(timeStart == 0){
					timeStart = System.currentTimeMillis();
				}
				scrollViewToBeggining();
			}

			@Override
			public void onError(String error) {
				playerView.hideWaitDialog();
				JavaScriptUtils.log("Can't load page: " + error);
			}
		});
			
	}


	private void pageLoaded(Page page, PageController pageController) {
		pageController.setPage(page);
		HashMap<String, String> state = stateService.getStates();
		if(headerController != null){
			headerController.setPage(contentModel.getHeader());
			headerController.setPageState(state);
		}
		if(footerController != null){
			footerController.setPage(contentModel.getFooter());
			footerController.setPageState(state);
		}
	}

	
	private static void scrollViewToBeggining() {
		 
		Scheduler.get().scheduleFinally(new ScheduledCommand() {
			public void execute() {
				Window.scrollTo(0, 0);
			}
		});
	}

	
	private void closeCurrentPages() {
		closePopup();
		
		if(scoreService.useLast()){
			pageController1.updateScore(false);
			if (isBookMode()) {
				pageController2.updateScore(false);
			}
		}
		
		updateState();
		
		pageController1.closePage();
		if(isBookMode()){
			pageController2.closePage();
		}
	}


	public void updateState() {
		HashMap<String, String> state = pageController1.getState();
		stateService.addState(state);
		if(pageController2 != null){
			state = pageController2.getState();
			stateService.addState(state);
		}
		if(headerController != null) {
			state = headerController.getState();
			stateService.addState(state);
		}
		if(footerController != null) {
			state = footerController.getState();
			stateService.addState(state);
		}
	}


	public IPlayerServices getPlayerServices() {
		return pageController1.getPlayerServices();
	}


	public long getTimeElapsed() {
		return (System.currentTimeMillis()-timeStart)/1000;
	}


	public IScoreService getScoreService() {
		return scoreService;
	}


	public IStateService getStateService() {
		return stateService;
	}


	@Override
	public void showPopup(String pageName, String additionalClasses) {
		if (isPopupEnabled()) {
			return;
		}
		setPopupEnabled(true);
		Page page  = contentModel.findPageByName(pageName);
		PageController popupPageControler = new PageController(this);
		popupPanel = new PagePopupPanel(getView(), popupPageControler, additionalClasses);
		popupPanel.showPage(page, contentModel.getBaseUrl());
	}


	@Override
	public void closePopup() {
		if(popupPanel != null){
			popupPanel.close();
			setPopupEnabled(false);
		}
	}


	@Override
	public void sendAnalytics(String event, HashMap<String, String> params) {
		if(analyticsId == null){
			return;
		}
		
		String url = "http://www.bluenotepad.com/api/log?" + 
				"notepad=" + analyticsId + "&session=" + sessionId + "&event=" + event;
		if( params != null){
			for(String key : params.keySet()){
				url += "&" + key + "=" + params.get(key).replace("&nbsp;", " ");
			}
		}
		String encodedUrl = URL.encode(url);
		RequestBuilder builder = new RequestBuilder(RequestBuilder.GET, encodedUrl);
		try {
			builder.sendRequest(null, new RequestCallback() {
				public void onError(Request request, Throwable exception) {
				}
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
		return pageController2 != null;
	}


	@Override
	public boolean hasCover() {
		return showCover;
	}


	@Override
	public boolean isPopupEnabled() {
		return isPopupEnabled;
	}


	@Override
	public void setPopupEnabled(boolean enabled) {
		isPopupEnabled = enabled;
	}


	@Override
	public IPresenter findHeaderModule(String id) {
		if (headerController == null) {
			return null;
		}
		
		return headerController.findModule(id);	
	}
	
	@Override
	public IPresenter findFooterModule(String id) {
		if (footerController == null) {
			return null;
		}
		
		return footerController.findModule(id);	
	}



}
