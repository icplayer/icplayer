package com.lorepo.icplayer.client.module.api;

import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;

public interface IPresenter {
	public void addView(IModuleView view);
	public IModuleModel getModel();
	public void setShowErrorsMode();
	public void setWorkMode();
	public void reset(boolean onlyWrongAnswers);
	public void onEventReceived(String eventName, HashMap<String, String> data);
	public JavaScriptObject getAsJavaScript();
	void setDisabled(boolean value);
	boolean isDisabled();
}
