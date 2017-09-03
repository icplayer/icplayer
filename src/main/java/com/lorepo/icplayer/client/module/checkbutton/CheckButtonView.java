package com.lorepo.icplayer.client.module.checkbutton;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.checkbutton.CheckButtonPresenter.IDisplay;

public class CheckButtonView extends PushButton implements IDisplay, IWCAG {
	private static final String DISABLED_STYLE = "disabled";
	
	private CheckButtonModule module;
	private boolean isShowErrorsMode;
	private IPlayerServices playerServices;

	public CheckButtonView(CheckButtonModule module, IPlayerServices services) {
		this.playerServices = services;
		this.module = module;
		this.isShowErrorsMode = false;

		createUI();
		getElement().setId(module.getId());
	}
	
	private void createUI() {

		StyleUtils.applyInlineStyle(this, module);
		updateStyle();

		if (playerServices != null) {
			setVisible(module.isVisible());
			
			addClickHandler(new ClickHandler() {
				
				@Override
				public void onClick(ClickEvent event) {

					event.stopPropagation();
					event.preventDefault();
					
					toggleAnswers();
				}
			});		
		}
	}
	
	private void toggleAnswers() {
		isShowErrorsMode = !isShowErrorsMode;
		updateStyle();
		
		if (isShowErrorsMode) {
			playerServices.getCommands().checkAnswers();
		} else {
			playerServices.getCommands().uncheckAnswers();
		}
	}
	
	private void updateStyle() {
		if (isShowErrorsMode) {
			StyleUtils.setButtonStyleName("ic_button_uncheck", this, module);

			getUpFace().setText(module.getUnCheckTitle());
		} else {
			StyleUtils.setButtonStyleName("ic_button_check", this, module);

			getUpFace().setText(module.getCheckTitle());
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
	public void setDisabled(boolean isDisabled) {
		if (isDisabled) {
			addStyleName(DISABLED_STYLE);
		} else{
			removeStyleName(DISABLED_STYLE);
		}
	}

	@Override
	public void setShowErrorsMode(boolean mode) {
		this.isShowErrorsMode = mode;
		updateStyle();
	}

	@Override
	public boolean isShowErrorsMode() {
		return isShowErrorsMode;
	}
	
	@Override
	public void uncheckAnswers() {
		if (isShowErrorsMode) toggleAnswers();
	}
	
	private void enter() {
		toggleAnswers();
	}

	@Override
	public void enter(boolean isExiting) {
		if (!isExiting) {
			this.enter();
		}
		
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

	@Override
	public String getName() {
		return "CheckButton";
	}
}
