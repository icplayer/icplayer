package com.lorepo.icplayer.client;

import com.google.gwt.core.client.Scheduler;
import com.google.gwt.core.client.Scheduler.ScheduledCommand;
import com.google.gwt.user.client.Window;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icplayer.client.content.services.PlayerServices;
import com.lorepo.icplayer.client.content.services.ScoreService;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.model.Page.LayoutType;
import com.lorepo.icplayer.client.model.PageList;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.page.PagePopupPanel;
import com.lorepo.icplayer.client.ui.PlayerView;
import com.lorepo.icplayer.client.utils.ILoadListener;
import com.lorepo.icplayer.client.utils.XMLLoader;

public class PlayerController{

	private	Content				contentModel;
	private PageController		pageController;
	private PageController		headerController;
	private PageController		footerController;
	private	PlayerView			playerView;
	/** If not popup then this is null */
	private PagePopupPanel 		popupPanel;
	private PlayerServices		playerService;
	private Page				currentPage;
	private long				timeStart = 0;
	private ScoreService		scoreService;
	private ILoadListener		pageLoadListener;
	
	
	public PlayerController(Content content){
		
		scoreService = new ScoreService();
		contentModel = content;
		playerView = new PlayerView();
		pageController = new PageController();
		playerService = new PlayerServices(this);
		pageController.setPlayerServices(playerService);
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
			if(contentModel.getPage(i) == currentPage){
				index = i;
				break;
			}
		}
		
		return index;
	}
	
	
	/**
	 * 
	 * @return model
	 */
	public Content	getModel(){
		return contentModel;
	}
	
	
	public PlayerView getView(){
		return playerView;
	}
	
	
	/**
	 * @return popup panel
	 */
	public PagePopupPanel getPopup(){
		
		if(popupPanel == null){
			popupPanel = new PagePopupPanel(playerView.getAbsolutePageView());
		}
		
		return popupPanel;
	}
	
	
	/**
	 * Przełączenie się na stronę o podanej nazwie
	 * @param pageName
	 * @return true if page found
	 */
	public void switchToPage(String pageName) {

		Page page  = getModel().findPageByName(pageName);
		if(page != null){
			switchToPage(page);
		}
		else{
			Window.alert("Missing page:\n<" + pageName + ">");
		}
	}


	public void switchToPrevPage() {

		PageList pages = contentModel.getPages();
		for(int i = 0; i < pages.size(); i++){
			if(pages.get(i) == currentPage){
				int index = i-1;
				if(index >= 0){
					Page prevPage = pages.get(index);
					switchToPage(prevPage);
				}
				break;
			}
		}
	}


	public void switchToNextPage() {

		PageList pages = contentModel.getPages();
		for(int i = 0; i < pages.size(); i++){
			if(pages.get(i) == currentPage){
				int index = i+1;
				if(index < pages.size()){
					Page nextPage = pages.get(index);
					switchToPage(nextPage);
				}
				break;
			}
		}
	}


	/**
	 * Switch to page at given index
	 * @param index
	 */
	public void switchToPage(Page page){

		String baseUrl = contentModel.getBaseUrl();
		
		// Release current page
		closeCurrentPage();
		
		// Load new page
		currentPage = page;

		XMLLoader reader = new XMLLoader(page);
		String url = URLUtils.resolveURL(baseUrl, page.getHref());
		playerView.showWaitDialog();
		reader.load(url, new ILoadListener() {
			
			@Override
			public void onFinishedLoading(Object obj) {
				Page page = (Page) obj;
				createView(page);
				if(pageLoadListener != null){
					pageLoadListener.onFinishedLoading(obj);
				}
				playerView.hideWaitDialog();
				if(timeStart == 0){
					timeStart = System.currentTimeMillis();
				}
				if(popupPanel == null){
					scrollViewToBeggining();
				}
			}

			@Override
			public void onError(String error) {
				playerView.hideWaitDialog();
				JavaScriptUtils.log("Can't load page: " + error);
			}
		});
			
	}


	private void createView(Page page) {

		playerService.resetEventBus();
		
		if(popupPanel != null){
			popupPanel.show();
			pageController.setView(popupPanel.getView());
			pageController.setPage(page);
			popupPanel.center();
		}
		else{
			if(page.getLayout() == LayoutType.flow){
				pageController.setView(playerView.getFlowPageView());
			}
			else{
				pageController.setView(playerView.getAbsolutePageView());
			}
			if(headerController != null){
				headerController.setView(playerView.getHeaderView());
				headerController.setPage(contentModel.getHeader());
			}
			if(footerController != null){
				footerController.setView(playerView.getFooterView());
				footerController.setPage(contentModel.getFooter());
			}
			pageController.setPage(page);
		}
	}

	
	private void scrollViewToBeggining() {
		 
		Scheduler.get().scheduleFinally(new ScheduledCommand() {
			public void execute() {
				Window.scrollTo(0, 0);
			}
		});
	}

	
	/**
	 * Zamknięcie strony. Zapisanie wyniku i zwolnienie zasobów
	 * @param page
	 */
	private void closeCurrentPage() {

		if(currentPage != null){ 
		
			pageController.updateScore();
			pageController.closeCurrentPage();
			
			currentPage.release();
			currentPage = null;
		}
	}


	public PageController getPageController() {
		return pageController;
	}


	public void showHeaderAndFooter() {

		if(contentModel.getHeader() != null){
			playerView.showHeader();
			headerController = new PageController();
			headerController.setPlayerServices(playerService);
		}

		if(contentModel.getFooter() != null){
			playerView.showFooter();
			footerController = new PageController();
			footerController.setPlayerServices(playerService);
		}
	}


	public PlayerServices getPlayerServices() {
		return playerService;
	}


	public long getTimeElapsed() {
		return (System.currentTimeMillis()-timeStart)/1000;
	}


	public IScoreService getScoreService() {
		return scoreService;
	}

}
