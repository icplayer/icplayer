package com.lorepo.icplayer.client.module.errorcounter;

import com.google.gwt.user.client.ui.Label;
import com.lorepo.icplayer.client.framework.module.StyleUtils;

public class ErrorCounterView extends Label implements ErrorCounterPresenter.IDisplay{

	public ErrorCounterView(ErrorCounterModule module){
	
		setStyleName("ic_errorcounter");
		StyleUtils.applyInlineStyle(this, module);
		setText("5");
		setVisible(module.isVisible());
		getElement().setId(module.getId());
	}


	@Override
	public void setData(int errorCount, int mistakeCount) {
		
		if(errorCount > 0 || mistakeCount > 0){
			setText(Integer.toString(errorCount) + "/" + Integer.toString(mistakeCount));
		}
		else{
			setText("");
		}
	}

}
