package com.lorepo.icplayer.client.module.api.player;

import com.google.gwt.core.client.JsArray;
import com.lorepo.icplayer.client.model.adaptive.AdaptiveConnection;
import com.lorepo.icplayer.client.model.page.Page;

public interface IAdaptiveLearningService {
	public JsArray<AdaptiveConnection> getConnectionsForPage(String pageID);
	public JsArray<AdaptiveConnection> getConnectionsForPage();
	public void moveToNextPage(String pageID);
	public void moveToPrevPage();
	
	public String getStateAsString();
	public void setState(String state);
}
