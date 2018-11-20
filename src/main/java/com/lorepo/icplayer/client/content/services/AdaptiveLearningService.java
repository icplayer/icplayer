package com.lorepo.icplayer.client.content.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.core.client.JsArrayInteger;
import com.lorepo.icf.utils.JSONUtils;
import com.lorepo.icf.utils.JSONValueAdapter;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.model.adaptive.AdaptiveConnection;
import com.lorepo.icplayer.client.model.adaptive.AdaptiveStructure;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.api.player.IAdaptiveLearningService;
import com.lorepo.icplayer.client.page.PageController;

public class AdaptiveLearningService implements IAdaptiveLearningService {
	private AdaptiveStructure structure;
	private IPlayerController playerController;
	private List<Integer> vistiedPageIndexes; // by default first page is added
	private int currentPageIndex = 0;
	
	private enum JSON_KEYS {
		CURRENT_PAGE_INDEX("currentPageIndex"),
		VISITED_PAGE_INDEXES("visitiedPageIndexes");
		
		private final String key;
		private JSON_KEYS(String key) {
			this.key = key;
		}
		
		public String toString() {
			return this.key;
		}
	}
	
	public AdaptiveLearningService(IPlayerController playerController, String adaptiveStructure) {
		this.playerController = playerController;
		this.structure = new AdaptiveStructure(adaptiveStructure);
		this.vistiedPageIndexes = new ArrayList<Integer>();
		this.vistiedPageIndexes.add(0);
	}

	@Override
	public JsArray<AdaptiveConnection> getConnectionsForPage(String pageID) {
		return this.structure.getConnectionsForPage(pageID);
	}

	@Override
	public JsArray<AdaptiveConnection> getConnectionsForPage() {
		String id = this.playerController.getCurrentPageId();
		return this.getConnectionsForPage(id);
	}

	// if there is no next page, adds page with supplied id to history and loads it
	// if there is next page, just loads it
	public void moveToNextPage(String pageID) {
		if (this.currentPageIndex == this.vistiedPageIndexes.size() - 1) {
			this.playerController.switchToPageById(pageID);
			this.vistiedPageIndexes.add(this.playerController.getCurrentPageIndex());
			this.currentPageIndex++;
		} else {
			this.currentPageIndex++;
			this.playerController.switchToPage(this.vistiedPageIndexes.get(this.currentPageIndex));
		}
	}
	
	public void moveToPrevPage() {
		if (this.currentPageIndex != 0) {
			this.currentPageIndex--;
			this.playerController.switchToPage(this.vistiedPageIndexes.get(this.currentPageIndex));
		}
	}
	


	@Override
	public String getStateAsString() {
		HashMap<String, String> returnJSON = new HashMap<String, String>();
		List<JSONValueAdapter> pagesIndexes = new ArrayList<JSONValueAdapter>();
		
		for (Integer i = 0; i < this.vistiedPageIndexes.size(); i++) {
			pagesIndexes.add(new JSONValueAdapter(this.vistiedPageIndexes.get(i)));
		}
		
		returnJSON.put(JSON_KEYS.CURRENT_PAGE_INDEX.toString(), Integer.toString(this.currentPageIndex));
		returnJSON.put(JSON_KEYS.VISITED_PAGE_INDEXES.toString(), JSONUtils.toJSONString(pagesIndexes));

		return JSONUtils.toJSONString(returnJSON);
	}

	@Override
	public void loadFromString(String state) {
		if (state == null) {
			return;
		}
		HashMap<String, String> data = JSONUtils.decodeHashMap(state);

		if (data.containsKey(JSON_KEYS.CURRENT_PAGE_INDEX.toString())) {
			String value = data.get(JSON_KEYS.CURRENT_PAGE_INDEX.toString());
			this.currentPageIndex = Integer.parseInt(value);
		} else {
			this.currentPageIndex = 0;
		}
		
		if (data.containsKey(JSON_KEYS.VISITED_PAGE_INDEXES.toString())) {
			this.vistiedPageIndexes = JSONUtils.decodeIntegerArray(data.get(JSON_KEYS.VISITED_PAGE_INDEXES.toString()));
		}
	}

	@Override
	public void resetHistory() {
		this.vistiedPageIndexes.clear();
		this.vistiedPageIndexes.add(0);
	}

}
