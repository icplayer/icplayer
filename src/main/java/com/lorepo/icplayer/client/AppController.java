package com.lorepo.icplayer.client;

import com.google.gwt.core.client.Scheduler;
import com.google.gwt.core.client.Scheduler.ScheduledCommand;
import com.google.gwt.user.client.Window;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icplayer.client.content.services.PlayerServices;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.model.PageList;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.page.PagePopupPanel;
import com.lorepo.icplayer.client.ui.PlayerView;
import com.lorepo.icplayer.client.utils.ILoadListener;
import com.lorepo.icplayer.client.utils.XMLLoader;
import com.lorepo.icplayer.client.utils.widget.WaitDialog;

public class AppController{

	private PlayerApp 			playerApp;
	private	Content				contentModel;
	private PageController		pageController;
	private PageController		headerController;
	private PageController		footerController;
	private	PlayerView			playerView;
	/** If not popup then this is null */
	private PagePopupPanel 		popupPanel;
	private PlayerServices		playerService;
	private Page				currentPage;
	private WaitDialog			waitDlg;
	private long				timeStart = 0;
	
	
	public AppController(PlayerApp app, Content content){
		
		waitDlg = new WaitDialog();
		playerApp = app;
		contentModel = content;
		playerView = new PlayerView();
		pageController = new PageController(playerView.getPageView());
		playerService = new PlayerServices(this, playerApp);
		pageController.setPlayerServices(playerService);
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
			popupPanel = new PagePopupPanel(playerView.getPageView());
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
			playerApp.alert("Missing page:\n<" + pageName + ">");
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
		
		playerService.getServerService().sendAnalytics(contentModel.getPages().indexOf(page)+1);
		
		// Release current page
		closeCurrentPage();
		
		// Load new page
		currentPage = page;

		XMLLoader reader = new XMLLoader(page);
		String url = URLUtils.resolveURL(baseUrl, page.getHref());
		waitDlg.show();
		reader.load(url, new ILoadListener() {
			
			@Override
			public void onFinishedLoading(Object obj) {
				Page page = (Page) obj;
				createView(page);
				playerApp.onPageLoaded();
				waitDlg.hide();
				if(timeStart == 0){
					timeStart = System.currentTimeMillis();
				}
				if(popupPanel == null){
					scrollViewToBeggining();
				}
			}

			@Override
			public void onError(String error) {
				waitDlg.hide();
				playerApp.alert("Can't load page: " + error);
			}
		});
			
	}


	private void createView(Page page) {

		playerService.resetEventBus();
		
		if(popupPanel != null){
			popupPanel.show();
			pageController.setPage(page);
			popupPanel.center();
		}
		else{
			if(headerController != null){
				headerController.setPage(contentModel.getHeader());
			}
			if(footerController != null){
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

	
	public PlayerApp getApp() {
		
		return playerApp;
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
			headerController = new PageController(playerView.getHeaderView());
			headerController.setPlayerServices(playerService);
		}

		if(contentModel.getFooter() != null){
			playerView.showFooter();
			footerController = new PageController(playerView.getFooterView());
			footerController.setPlayerServices(playerService);
		}
	}


	public PlayerServices getPlayerServices() {
		return playerService;
	}


	public long getTimeElapsed() {
		return (System.currentTimeMillis()-timeStart)/1000;
	}

}
