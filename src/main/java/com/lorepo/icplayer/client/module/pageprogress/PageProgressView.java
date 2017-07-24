package com.lorepo.icplayer.client.module.pageprogress;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.user.client.DOM;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter.IOptionDisplay;
import com.lorepo.icplayer.client.utils.widget.ProgressBar;

public class PageProgressView extends ProgressBar implements PageProgressPresenter.IDisplay {

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
}
