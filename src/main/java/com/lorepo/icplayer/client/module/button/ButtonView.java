package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.user.client.ui.ButtonBase;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.button.ButtonModule.ButtonType;
import com.lorepo.icplayer.client.module.button.ButtonPresenter.IDisplay;

public class ButtonView extends Composite implements IDisplay {
	private static final String DISABLED_STYLE = "disabled";
	
	private ButtonModule module;
	private boolean isErrorCheckingMode;
	private IPlayerServices playerServices;

	public ButtonView(ButtonModule module, IPlayerServices services) {
		this.module = module;
		this.isErrorCheckingMode = false;

		initWidget(createInnerButton(services));
		getElement().setId(module.getId());
		this.playerServices = services;
	}

	
	private Widget createInnerButton(IPlayerServices playerServices) {

		Widget button = null;
		
		IPlayerCommands pageService = null;
		if(playerServices != null){
			pageService = playerServices.getCommands();
		}
		
		ButtonType type = module.getType();
		
		if(ButtonType.checkAnswers == type){
			button = new CheckAnswersButton(playerServices);
		}
		else if(ButtonType.cancel == type){
			button = new ClosePopupButton(pageService, playerServices, module);
		}
		else if(ButtonType.nextPage == type){
			button = new NextPageButton(playerServices);
		}
		else if(ButtonType.popup == type){
			button = new PopupButton(module.getOnClick(), this, pageService, module.getAdditionalClasses(), playerServices, module);
		}
		else if(ButtonType.prevPage == type){
			button = new PrevPageButton(playerServices);
		}
		else if(ButtonType.gotoPage == type){
			button = new GotoPageButton(module.getOnClick(), module.getPageIndex(), playerServices);
		}
		else if(ButtonType.reset == type){
			button = new ResetButton(pageService);
		}
		else{
			button = new StandardButton(module, playerServices);
		}
		
		if(button instanceof ButtonBase){
			ButtonBase pushButton = (ButtonBase) button;
			StyleUtils.applyInlineStyle(pushButton, module);
	
			pushButton.setText(module.getText());
		}

		if(playerServices != null){
			button.setVisible(module.isVisible());
		}
		
		return button;
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
		ButtonType type = module.getType();
		if (ButtonType.popup != type) {
			return;
		}
		
		if (isDisabled) {
			addStyleName(DISABLED_STYLE);
		} else{
			removeStyleName(DISABLED_STYLE);
		}
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
	public void executeOnKeyCode(KeyDownEvent event) {
		int code = event.getNativeKeyCode();

		if (code == KeyCodes.KEY_ENTER) {
			event.preventDefault();
			enter();
		}
	}
	
	public void enter() {
		if (module.getType() == ButtonType.nextPage) {
			playerServices.getCommands().nextPage();
		} else if(module.getType() == ButtonType.prevPage) {
			playerServices.getCommands().prevPage();
		}
	}
}
