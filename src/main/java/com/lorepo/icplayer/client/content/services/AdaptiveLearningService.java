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
import com.lorepo.icplayer.client.model.page.Page;

public class AdaptiveLearningService implements IAdaptiveLearningService {
	private AdaptiveStructure structure;
	private AdaptivePageSteps pageToSteps;
	private IPlayerController playerController;
	private List<Integer> visitedPageIndexes; // by default first page is added
	private List<Page> initiallyReportablePages = new ArrayList<Page>();
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
		this.visitedPageIndexes = new ArrayList<Integer>();
		this.visitedPageIndexes.add(0);
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
		return this.currentPageIndex < this.visitedPageIndexes.size() - 1;
	}

	public void addAndMoveToNextPage(String pageID) {
	    if (this.isFirstCall()) {
	        this.saveAllReportablePages();
	        this.initAllPagesAsNonReportable();
	    }
	    this.setCurrentPageAsReportable(pageID);
		this.playerController.switchToPageById(pageID);
		this.visitedPageIndexes.add(this.playerController.getCurrentPageIndex());
		this.currentPageIndex++;
	}
	
	public void moveToNextPage() {
		if (this.currentPageIndex != this.visitedPageIndexes.size() - 1) {
			this.currentPageIndex++;
			this.playerController.switchToPage(this.visitedPageIndexes.get(this.currentPageIndex));
		}
	}
	
	public void moveToPrevPage() {
		if (this.currentPageIndex != 0) {
			this.currentPageIndex--;
			this.playerController.switchToPage(this.visitedPageIndexes.get(this.currentPageIndex));
		}
	}

	@Override
	public String getStateAsString() {
		HashMap<String, String> returnJSON = new HashMap<String, String>();
		List<JSONValueAdapter> pagesIndexes = new ArrayList<JSONValueAdapter>();
		
		for (Integer i = 0; i < this.visitedPageIndexes.size(); i++) {
			pagesIndexes.add(new JSONValueAdapter(this.visitedPageIndexes.get(i)));
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
			this.visitedPageIndexes = JSONUtils.decodeIntegerArray(data.get(JSON_KEYS.VISITED_PAGE_INDEXES.toString()));
		}
	}

	@Override
	public void resetHistory() {
		this.visitedPageIndexes.clear();
		this.visitedPageIndexes.add(0);
		this.currentPageIndex = 0;
		
		Integer currentPage = this.playerController.getCurrentPageIndex();

		if (currentPage > 0) {
			this.visitedPageIndexes.add(currentPage);
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

	private void saveAllReportablePages() {
	    List<Page> allPages = this.playerController.getModel().getAllPages();
 	    for (Page page : allPages) {
 	        if (page.isReportable()){
 	            this.initiallyReportablePages.add(page);
 	        }
 	    }
	}

	private void setCurrentPageAsReportable(String pageID) {
	    IPage currentPage = this.playerController.getModel().getPageById(pageID);
	    if (this.initiallyReportablePages.contains(currentPage)) {
	        currentPage.setAsReportable();
	    }
	}

	private void initAllPagesAsNonReportable() {
        List<Page> allPages = this.playerController.getModel().getAllPages();
        allPages.remove(this.playerController.getCurrentPageIndex());
        for (Page page : allPages) {
            this.setPageNonReportable(page);
        }
	}

	private void setPageNonReportable(IPage page) {
		if (page != null) {
			page.setAsNonReportable();
		}
	}

	private void setPageReportable(IPage page) {
		if (page != null) {
			page.setAsReportable();
		}
	}

	//in advanced connector first page is always displayed, the second one is being checked for logic etc.
	//that's why we check whether we visited first page (notice that visitedPageIndexes increments after this condition check)
	private boolean isFirstCall() {
	    return this.visitedPageIndexes.size() == 1;
	}

	private int getCurrentPageStepIndex() {
		String id = this.playerController.getCurrentPageId();
		return getPageStep(id);
	}

}
