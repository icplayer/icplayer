package com.lorepo.icplayer.client.module.checkcounter;

import com.google.gwt.user.client.ui.Label;
import com.lorepo.icplayer.client.framework.module.StyleUtils;

public class CheckCounterView extends Label implements CheckCounterPresenter.IDisplay{

	
	public CheckCounterView(CheckCounterModule module){
	
		setStyleName("ic_checkcounter");
		StyleUtils.applyInlineStyle(this, module);
		setText("3");
		setVisible(module.isVisible());
		getElement().setId(module.getId());
	}


	@Override
	public void setData(int value) {
		
		if(value > 0){
			setText(Integer.toString(value));
		}
		else{
			setText("");
		}
	}

}
