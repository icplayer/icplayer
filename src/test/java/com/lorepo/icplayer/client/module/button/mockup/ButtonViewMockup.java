package com.lorepo.icplayer.client.module.button.mockup;

import com.google.gwt.dom.client.Element;
import com.lorepo.icplayer.client.module.button.ButtonModule;
import com.lorepo.icplayer.client.module.button.ButtonPresenter.IDisplay;

public class ButtonViewMockup implements IDisplay {
	private boolean isVisible = true;
	private boolean isErrorCheckingMode = false;
	private boolean isDisabled = false;
	
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

	@Override
	public void setErrorCheckingMode(boolean isErrorCheckingMode) {
		this.isErrorCheckingMode = isErrorCheckingMode;
		
	}

	@Override
	public boolean isErrorCheckingMode() {
		return isErrorCheckingMode;
	}

	@Override
	public void setDisabled(boolean isDisabled) {
		this.isDisabled = isDisabled;
	}

	public boolean isDisabled() {
		return isDisabled;
	}

	@Override
	public Element getElement() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void execute() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return false;
	}
}
