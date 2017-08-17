package com.lorepo.icplayer.client.module.api;

import com.google.gwt.core.client.JsArrayString;


public interface ITextToSpeechPresenter extends IPresenter {
	public void playTitle(String id);
	public void playDescription(String id);
	public void speak(String text);
	public void readGap(String text, int gapNumber);
	public JsArrayString getAddOnsOrder();
	public JsArrayString getMultiPartDescription(String id);
}
