package com.lorepo.icplayer.client.module.api;

import com.google.gwt.core.client.JsArrayString;


public interface ITextToSpeechPresenter extends IPresenter {
	public void playTitle(String area, String id);
	public void speak(String text);
	public void readGap(String text, String currentGapContent, int gapNumber);
	public void readStartText();
	public void readExitText();
	public JsArrayString getAddOnsOrder();
}
