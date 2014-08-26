package com.lorepo.icplayer.client;

import java.util.ArrayList;
import java.util.HashMap;

import com.google.gwt.user.client.ui.RootPanel;
import com.lorepo.icf.utils.ILoadListener;
import com.lorepo.icf.utils.JSONUtils;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icf.utils.XMLLoader;
import com.lorepo.icf.utils.dom.DOMInjector;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.ui.PlayerView;

/**
 * Create single page application
 */
public class PlayerApp{

	/** Div id */
	private String divId;
	private	Content				contentModel;
	private PlayerController	playerController;
	/** Score service impl */
	private PlayerEntryPoint	entryPoint;
	private int startPageIndex = 0;
	private HashMap<String, String> loadedState;
	private boolean bookMode = false;
	private boolean showCover = false;
	private String analyticsId = null;
	private ArrayList<Integer> pagesSubset = null;
	private IPlayerServices playerServices;
	
	
	public PlayerApp(String id, PlayerEntryPoint entryPoint){
		
		this.divId = id;
		this.entryPoint = entryPoint;
	 }

	
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
	 */
	public void load(String url, int pageIndex) {
		startPageIndex = pageIndex;
		contentModel = new Content();
		if (pagesSubset != null) contentModel.setPageSubset(pagesSubset);
		XMLLoader	reader = new XMLLoader(contentModel);
		reader.load(url, new ILoadListener() {
			public void onFinishedLoading(Object obj) {
				initPlayer();
			}
			public void onError(String error) {
				JavaScriptUtils.log("Can't load:" + error);
			}
		});
	}

	public void setPages(String pagesSub) {
		ArrayList<Integer> selectedPages = new ArrayList<Integer>();
		String[] parts = null;
		if (pagesSub == null || pagesSub.isEmpty())
			throw new IllegalArgumentException();
		parts = pagesSub.split(",");
		for (int i = 0; i < parts.length; i++) {
			selectedPages.add(Integer.valueOf(parts[i]));
		}
		if (selectedPages.size() > 0)
			pagesSubset = selectedPages;
	}
	
	public void setAnalytics(String id) {
		analyticsId = id;
	}

	/**
	 * Init player after content is loaded
	 */
	private void initPlayer() {
		
		PlayerView playerView = new PlayerView();
		playerController = new PlayerController(contentModel, playerView, bookMode);
		playerController.setFirstPageAsCover(showCover);
		playerController.setAnalytics(analyticsId);
		playerController.addPageLoadListener(new ILoadListener() {
			public void onFinishedLoading(Object obj) {
				entryPoint.onPageLoaded();
			}
			public void onError(String error) {
			}
		});
		
		contentModel.setPlayerController(getPlayerServices());
		
		RootPanel.get(divId).add(playerView);
		String css = URLUtils.resolveCSSURL(contentModel.getBaseUrl(), contentModel.getStyles());
		DOMInjector.appendStyle(css);

		ContentDataLoader loader = new ContentDataLoader(contentModel.getBaseUrl());
		loader.addAddons(contentModel.getAddonDescriptors().values());
		if(contentModel.getHeader() != null){
			loader.addPage(contentModel.getHeader());
		}
		if(contentModel.getFooter() != null){
			loader.addPage(contentModel.getFooter());
		}
		loader.load(new ILoadListener() {
			public void onFinishedLoading(Object obj) {
				loadFirstPage();
			}

			public void onError(String error) {
			}
		});
	}
	
	private void loadFirstPage() {
		if(loadedState != null){
			playerController.getPlayerServices().getStateService().loadFromString(loadedState.get("state"));
			playerController.getPlayerServices().getScoreService().loadFromString(loadedState.get("score"));
		}
		playerController.initHeaders();
		playerController.switchToPage(startPageIndex);
	}


	public IPlayerServices getPlayerServices() {
		return playerController.getPlayerServices();
	}
	

	public void setState(String state) {
		HashMap<String, String> data = JSONUtils.decodeHashMap(state);
		if(data.containsKey("state") && data.containsKey("score")){
			loadedState = data;
		}
	}

	public String getState() {
		playerController.updateState();
		String state = playerController.getPlayerServices().getStateService().getAsString();
		String score = playerController.getPlayerServices().getScoreService().getAsString();
		HashMap<String, String> data = new HashMap<String, String>();
		data.put("state", state);
		data.put("score", score);
		return JSONUtils.toJSONString(data);
	}


	public void setBookMode() {
		bookMode = true;
	}


	public void showCover(boolean show) {
		showCover = show;
	}
}
