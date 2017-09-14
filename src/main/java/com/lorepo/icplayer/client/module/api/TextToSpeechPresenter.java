package com.lorepo.icplayer.client.module.api;

import com.google.gwt.core.client.JsArrayString;


public class TextToSpeechPresenter implements ITextToSpeechPresenter {
	private IPresenter presenter;
	
	public TextToSpeechPresenter (IPresenter p) {
		this.presenter = p;
	}
	
	@Override
	public void playTitle (String id) {
		ITextToSpeechPresenter activity = (ITextToSpeechPresenter) presenter;
		activity.playTitle(id);
	}
	
	@Override
	public void playDescription (String id) {
		ITextToSpeechPresenter activity = (ITextToSpeechPresenter) presenter;
		activity.playDescription(id);
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
	public JsArrayString getAddOnsOrder () {
		if (presenter == null) {
			return (JsArrayString) JsArrayString.createArray();
		}
		
		ITextToSpeechPresenter activity = (ITextToSpeechPresenter) presenter;
		return activity.getAddOnsOrder();
	}
	
	@Override
	public JsArrayString getMultiPartDescription(String id) {
		if (presenter == null) {
			return (JsArrayString) JsArrayString.createArray();
		}
		
		ITextToSpeechPresenter activity = (ITextToSpeechPresenter) presenter;
		return activity.getMultiPartDescription(id);
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
	public void reset() {
		presenter.reset();
	}
	
}
