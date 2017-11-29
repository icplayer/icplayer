package com.lorepo.icplayer.client.module.errorcounter;

import com.google.gwt.user.client.ui.Label;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.page.ResponsiveVoiceOnEndCallback;
import com.google.gwt.event.dom.client.KeyDownEvent;

public class ErrorCounterView extends Label implements ErrorCounterPresenter.IDisplay, IWCAG, IWCAGModuleView{

	private ErrorCounterModule module;
	private boolean isWCAGOn = false;
	private PageController pageController;
	
	
	public ErrorCounterView(ErrorCounterModule module, boolean isPreview){
	
		this.module = module;
		setStyleName("ic_errorcounter");
		StyleUtils.applyInlineStyle(this, module);
		if(isPreview){
			setText("5");
		}else{
			setVisible(module.isVisible());
		}
		getElement().setId(module.getId());
	}


	@Override
	public void setData(int errorCount, int mistakeCount) {
		
		if(errorCount > 0 || mistakeCount > 0){
			if(module.getShowErrorCounter() && module.getShowMistakeCounter()){
				setText(Integer.toString(errorCount) + "/" + Integer.toString(mistakeCount));
			}
			else if(module.getShowErrorCounter()){
				setText(Integer.toString(errorCount));
			}
			else if(module.getShowMistakeCounter()){
				setText(Integer.toString(mistakeCount));
			}
		}
		else{
			setText("");
		}
	}


	@Override
	public void show() {
		setVisible(true);
		
	}


	@Override
	public void hide() {
		setVisible(false);
	}


	@Override
	public String getName() {
		return "ErrorCounter";
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


	public void speak() {
		if (this.pageController != null) {
			String text = getText();
			if (text.contains("/")) {
				String[] splittedText = text.split("/");
				this.pageController.speak(splittedText[0] + " " + splittedText[1], this.module.getLangAttribute(), new ResponsiveVoiceOnEndCallback());	
			} else {
				this.pageController.speak(getText(), this.module.getLangAttribute(), new ResponsiveVoiceOnEndCallback());	
			}
		}
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
