package com.lorepo.icplayer.client.module.pageprogress;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.user.client.DOM;
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


	@Override
	public void setWCAGStatus(boolean isWCAGOn) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void setPageController(PageController pc) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public String getLang() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public void enter(boolean isExiting) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void space() {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void tab() {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void left() {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void right() {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void down() {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void up() {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void escape() {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void customKeyCode(KeyDownEvent event) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void shiftTab() {
		// TODO Auto-generated method stub
		
	}
}
