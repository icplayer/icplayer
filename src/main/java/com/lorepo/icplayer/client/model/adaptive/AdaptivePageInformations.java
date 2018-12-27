package com.lorepo.icplayer.client.model.adaptive;

import com.google.gwt.core.client.JavaScriptObject;

public class AdaptivePageInformations extends JavaScriptObject {
	protected AdaptivePageInformations() { }

	public final native String getDifficultyDescription(String pageID) /*-{
		if (this[pageID]) {
			return this[pageID].difficulty;
		}
		return undefined;
	}-*/;
}
