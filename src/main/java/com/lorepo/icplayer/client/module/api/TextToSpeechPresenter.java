package com.lorepo.icplayer.client.module.api;

import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArrayString;


public class TextToSpeechPresenter implements ITextToSpeechPresenter {
	private IPresenter presenter;
	
	public TextToSpeechPresenter (IPresenter p) {
		this.presenter = p;
	}
	
	@Override
	public void playTitle (String area, String id) {
		ITextToSpeechPresenter activity = (ITextToSpeechPresenter) presenter;
		activity.playTitle(area, id);
	}
	
	@Override
	public void speak (String text) {
		ITextToSpeechPresenter activity = (ITextToSpeechPresenter) presenter;
		activity.speak(text);
	}
	
	@Override
	public void readGap (String text, String currentGapContent, int gapNumber) {
		ITextToSpeechPresenter activity = (ITextToSpeechPresenter) presenter;
		activity.readGap(text, currentGapContent, gapNumber);
	}
	
	@Override
	public void readStartText() {
		ITextToSpeechPresenter activity = (ITextToSpeechPresenter) presenter;
		activity.readStartText();
	}

	@Override
	public void readExitText() {
		ITextToSpeechPresenter activity = (ITextToSpeechPresenter) presenter;
		activity.readExitText();
	}
	
	@Override
	public JsArrayString getAddOnsOrder () {
		if (presenter == null) {
			return (JsArrayString) JsArrayString.createArray();
		}
		
		ITextToSpeechPresenter activity = (ITextToSpeechPresenter) presenter;
		return activity.getAddOnsOrder();
	}
	
	@Override
	public void addView(IModuleView view) {
		presenter.addView(view);
	}
	
	@Override
	public IModuleModel getModel() {
		return presenter.getModel();
	}
	
	@Override
	public void setShowErrorsMode() {
		presenter.setShowErrorsMode();
	}
	
	@Override
	public void setWorkMode() {
		presenter.setWorkMode();
	}
	
	@Override
	public void reset(boolean isOnlyWrongAnswers) {
		presenter.reset(isOnlyWrongAnswers);
	}

	@Override
	public void onEventReceived(String eventName, HashMap<String, String> data) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public JavaScriptObject getAsJavaScript() {
		// TODO Auto-generated method stub
		return JavaScriptObject.createObject();
	}

	@Override
	public void setDisabled(boolean value) {

	}

	@Override
	public boolean isDisabled() {
		return false;
	}

}
