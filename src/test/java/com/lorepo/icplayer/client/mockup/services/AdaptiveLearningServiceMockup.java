package com.lorepo.icplayer.client.mockup.services;

import com.google.gwt.core.client.JsArray;
import com.lorepo.icplayer.client.model.adaptive.AdaptiveConnection;
import com.lorepo.icplayer.client.module.api.player.IAdaptiveLearningService;

public class AdaptiveLearningServiceMockup implements IAdaptiveLearningService {

	@Override
	public JsArray<AdaptiveConnection> getConnectionsForPage(String pageID) {
		return null;
	}

	@Override
	public JsArray<AdaptiveConnection> getConnectionsForPage() {
		return null;
	}

	@Override
	public int getPageStep(String pageID) {
		return 0;
	}

	@Override
	public void addAndMoveToNextPage(String pageID) { }

	@Override
	public boolean isNextPageAvailable() {
		return false;
	}

	@Override
	public void moveToNextPage() { }

	@Override
	public void moveToPrevPage() { }

	@Override
	public void resetHistory() { }

	@Override
	public boolean isFirstStep() {
		return false;
	}

	@Override
	public boolean isLastStep() {
		return false;
	}

	@Override
	public String getStateAsString() {
		return "";
	}

	@Override
	public void loadFromString(String state) {	}

	@Override
	public String getPageDifficulty(String pageID) {
		return "0";
	}

}
