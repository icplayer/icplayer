package com.lorepo.icplayer.client.content.services;

import com.google.gwt.core.client.JsArray;
import com.lorepo.icplayer.client.model.adaptive.AdaptiveConnection;
import com.lorepo.icplayer.client.model.adaptive.AdaptiveStructure;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.api.player.IAdaptiveLearningService;
import com.lorepo.icplayer.client.page.PageController;

public class AdaptiveLearningService implements IAdaptiveLearningService {
	private AdaptiveStructure structure;
	private PageController pageController;
	
	public AdaptiveLearningService(PageController pageController, String adaptiveStructure) {
		this.pageController = pageController;
		this.structure = new AdaptiveStructure(adaptiveStructure);
	}

	@Override
	public JsArray<AdaptiveConnection> getConnectionsForPage(String pageID) {
		return this.structure.getConnectionsForPage(pageID);
	}

	@Override
	public JsArray<AdaptiveConnection> getConnectionsForPage() {
		String id = this.pageController.getPage().getId();
		return this.getConnectionsForPage(id);
	}
	

}
