package com.lorepo.icplayer.client.module.checkcounter;

import com.google.gwt.user.client.ui.Label;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.event.dom.client.KeyDownEvent;
import com.lorepo.icplayer.client.page.PageController;

public class CheckCounterView extends Label implements CheckCounterPresenter.IDisplay, IWCAG, IWCAGModuleView {

	private CheckCounterModule module;
	private boolean isWCAGOn = false;
	private PageController pageController;
	
	public CheckCounterView(CheckCounterModule module, boolean isPreview) {
		this.module = module;
		setStyleName("ic_checkcounter");
		StyleUtils.applyInlineStyle(this, module);
		if (isPreview) {
			setText("3");
		} else {
			setVisible(module.isVisible());
		}
		getElement().setId(module.getId());
	}

	@Override
	public void setData(int value) {
		if (value > 0) {
			setText(Integer.toString(value));
		} else {
			setText("");
		}
	}

	public void speak() {
		if (this.pageController != null) {
			String text = getText();
			List<TextToSpeechVoice> voiceTexts = new ArrayList<TextToSpeechVoice>();
			if (text.length() > 0) {
				TextToSpeechVoice t1 = TextToSpeechVoice.create(text,  this.module.getLangAttribute());
				voiceTexts.add(t1);	
			} else {
				TextToSpeechVoice t1 = TextToSpeechVoice.create("0",  this.module.getLangAttribute());
				voiceTexts.add(t1);
			}
			this.pageController.speak(voiceTexts);
		}
	}
	
	@Override
	public String getName() {
		return "CheckCounter";
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
	public void enter(boolean isExiting) {
		speak();
	}

	@Override
	public void space() {
	}

	@Override
	public void tab() {	
	}

	@Override
	public void left() {
	}

	@Override
	public void right() {
	}

	@Override
	public void down() {	
	}

	@Override
	public void up() {	
	}

	@Override
	public void escape() {	
	}

	@Override
	public void customKeyCode(KeyDownEvent event) {
	}

	@Override
	public void shiftTab() {
	}
}