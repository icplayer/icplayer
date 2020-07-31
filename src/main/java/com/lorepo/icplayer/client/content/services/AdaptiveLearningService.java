package com.lorepo.icplayer.client.content.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JsArray;
import com.lorepo.icf.utils.JSONUtils;
import com.lorepo.icf.utils.JSONValueAdapter;
import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.model.adaptive.AdaptiveConnection;
import com.lorepo.icplayer.client.model.adaptive.AdaptivePageSteps;
import com.lorepo.icplayer.client.model.adaptive.AdaptiveStructure;
import com.lorepo.icplayer.client.module.api.player.IAdaptiveLearningService;
import com.lorepo.icplayer.client.module.api.player.IPage;

public class AdaptiveLearningService implements IAdaptiveLearningService {
	private AdaptiveStructure structure;
	private AdaptivePageSteps pageToSteps;
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
		this.pageToSteps = new AdaptivePageSteps(adaptiveStructure);
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
	
	public boolean isNextPageAvailable() {
		return this.currentPageIndex < this.vistiedPageIndexes.size() - 1;
	}

	public void addAndMoveToNextPage(String pageID) {
		this.setPagesFromStepNonReportable(pageID);
		this.playerController.switchToPageById(pageID);
		this.vistiedPageIndexes.add(this.playerController.getCurrentPageIndex());
		this.currentPageIndex++;
	}
	
	public void moveToNextPage() {
		if (this.currentPageIndex != this.vistiedPageIndexes.size() - 1) {
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

		for (int index : this.vistiedPageIndexes) {
			this.setPageNonReportable(this.playerController.getModel().getPage(index));
		}
	}

	@Override
	public void resetHistory() {
		this.vistiedPageIndexes.clear();
		this.vistiedPageIndexes.add(0);
		this.currentPageIndex = 0;
		
		Integer currentPage = this.playerController.getCurrentPageIndex();

		if (currentPage > 0) {
			this.vistiedPageIndexes.add(currentPage);
			this.currentPageIndex = 1;
		}
	}

	@Override
	public boolean isFirstStep() {
		int stepIndex = getCurrentPageStepIndex();
		return stepIndex == 0;
	}

	@Override
	public boolean isLastStep() {
		int stepIndex = getCurrentPageStepIndex();
		return stepIndex == this.structure.getStepsLength() - 1;
	}

	@Override
	public int getPageStep(String pageID) {
		return pageToSteps.getPageStep(pageID);
	}

	@Override
	public String getPageDifficulty(String pageID) {
		return structure.getDifficultyForPage(pageID);
	}

	private void setPagesFromStepNonReportable(String pageID) {
		List<String> pagesIDsFromNewPageStep = this.pageToSteps.getOtherStepPages(pageID);

		for (String stepPageID : pagesIDsFromNewPageStep) {
			this.setPageNonReportable(this.playerController.getModel().getPageById(stepPageID));
		}
	}

	private void setPageNonReportable(IPage page) {
		if (page != null) {
			page.setAsNonReportable();
		}
	}

	private int getCurrentPageStepIndex() {
		String id = this.playerController.getCurrentPageId();
		return getPageStep(id);
	}

}
