package com.lorepo.icplayer.client.module.errorcounter;

import com.google.gwt.user.client.ui.Label;
import com.lorepo.icplayer.client.framework.module.StyleUtils;

public class ErrorCounterView extends Label implements ErrorCounterPresenter.IDisplay{

	private ErrorCounterModule module;
	
	
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
}
