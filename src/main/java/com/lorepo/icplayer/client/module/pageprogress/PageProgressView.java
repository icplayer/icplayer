package com.lorepo.icplayer.client.module.pageprogress;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.user.client.DOM;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter.IOptionDisplay;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.utils.widget.ProgressBar;

public class PageProgressView extends ProgressBar implements PageProgressPresenter.IDisplay, IWCAG, IWCAGModuleView {

//	private ProgressBar progress;
	private PageProgressModule module;
	private ArrayList<IOptionDisplay> optionWidgets = new ArrayList<IOptionDisplay>();
	private boolean isWCAGOn = false;
	private PageController pageController;
	private String originalDisplay = "";
	
	public PageProgressView(PageProgressModule module, boolean isPreview){
		
		this.module = module;
		createUI(isPreview);
	}


	private void createUI(boolean isPreview) {

		if(!isPreview){
			setVisible(module.isVisible());
		}
		setStyleName("ic_pageprogress");
		StyleUtils.applyInlineStyle(this, module);
		originalDisplay = getElement().getStyle().getDisplay();
		setProgress(50);
		getElement().setId(module.getId());
	}
	
	@Override
	public void setData(int value, int maxScore) {
		if(maxScore > 0) {
			setMaxProgress(maxScore);
		}
		
		setProgress(value);
	}

	@Override
	protected void onLoad() {
		super.onLoad();
		DOM.setStyleAttribute(getElement(), "position", "absolute");
	}
	
	@Override
	public void hide() {
		setVisible(false);
	}


	@Override
	public void show() {
		setVisible(true);
		redraw();
	}
	
	@Override
	public List<IOptionDisplay> getOptions() {
		return optionWidgets;
	}


	@Override
	public String getName() {
		return "PageProgress";
	}

	private void speak() {
		if (this.pageController != null) {		
			List<TextToSpeechVoice> voiceTexts = new ArrayList<TextToSpeechVoice>();
			TextToSpeechVoice t1 = TextToSpeechVoice.create(Double.toString(getProgress()),  this.module.getLangAttribute());
			voiceTexts.add(t1);
			
			this.pageController.speak(voiceTexts);
		}
	}
	
	@Override
	public void setWCAGStatus(boolean isWCAGOn) {
		this.isWCAGOn = isWCAGOn;
	}


	@Override
	public void setPageController(PageController pc) {
		this.setWCAGStatus(true);
		this.pageController = pc;
	}


	@Override
	public String getLang() {
		return null;
	}

	@Override
	public void enter(KeyDownEvent event, boolean isExiting) {
		speak();
	}

	@Override
	public void space(KeyDownEvent event) {
		event.preventDefault(); 
	}

	@Override
	public void tab(KeyDownEvent event) {}

	@Override
	public void left(KeyDownEvent event) {}

	@Override
	public void right(KeyDownEvent event) {}

	@Override
	public void down(KeyDownEvent event) {
			event.preventDefault();
	}

	@Override
	public void up(KeyDownEvent event) {
			event.preventDefault();
	}

	@Override
	public void escape(KeyDownEvent event) {
			event.preventDefault();
	}

	@Override
	public void customKeyCode(KeyDownEvent event) {}

	@Override
	public void shiftTab(KeyDownEvent event) {}
	
	@Override
	public void setVisible(boolean visible) {
		if (visible) {
			super.setVisible(true);
			getElement().getStyle().setProperty("display", originalDisplay);	
		} else {
			super.setVisible(false);
		}
	}
	
}
