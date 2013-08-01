package com.lorepo.icplayer.client.module.button.mockup;

import com.lorepo.icplayer.client.module.button.ButtonModule;
import com.lorepo.icplayer.client.module.button.ButtonPresenter.IDisplay;

public class ButtonViewMockup implements IDisplay {
	private boolean isVisible = true;
	
	public ButtonViewMockup(ButtonModule module) {
	}

	@Override
	public void show() {
		isVisible = true;
	}

	@Override
	public void hide() {
		isVisible = false;
	}
	
	public boolean isVisible() {
		return isVisible;
	}
	
	public void setVisible (boolean isVisible) {
		this.isVisible = isVisible;
	}
}
