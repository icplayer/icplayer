package com.lorepo.icplayer.client.module.button;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.user.client.ui.ButtonBase;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.FocusWidget;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.button.ButtonModule.ButtonType;
import com.lorepo.icplayer.client.module.button.ButtonPresenter.IDisplay;
import com.lorepo.icplayer.client.page.PageController;

public class ButtonView extends Composite implements IDisplay, IWCAG, IWCAGModuleView {
	private static final String DISABLED_STYLE = "disabled";
	
	private ButtonModule module;
	private boolean isErrorCheckingMode;
	private IPlayerServices playerServices;
	private PageController pageController;
	private boolean isWCAGOn = false;

	public ButtonView(ButtonModule module, IPlayerServices services) {
		this.module = module;
		this.isErrorCheckingMode = false;

		initWidget(this.createInnerButton(services));
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
			button = new PopupButton(module.getOnClick(), this, pageService, module.getPopupTopPosition(), module.getPopupLeftPosition(), module.getAdditionalClasses(), playerServices, module);
		}
		else if(ButtonType.prevPage == type){
			button = new PrevPageButton(playerServices, module.getGoToLastPage());
		}
		else if(ButtonType.gotoPage == type){
			button = new GotoPageButton(module.getOnClick(), module.getPageIndex(), playerServices);
		}
		else if(ButtonType.reset == type){
			button = new ResetButton(pageService, module.getConfirmReset(), module.getConfirmInfo(), module.getConfirmYesInfo(), module.getConfirmNoInfo());
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
	
	public boolean isEnabled(){
		Widget widget = this.getWidget();
		if (widget instanceof FocusWidget) {
			return ((FocusWidget) widget).isEnabled();
		}
		
		return true;		
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
	public void execute() {
		Widget widget = this.getWidget();
		if (widget instanceof ResetButton){
			((ResetButton) widget).execute();
		}
	}


	@Override
	public void enter (KeyDownEvent event, boolean isExiting) {
		if (isExiting) {
			return;
		}
		
		Widget buttonWidget = this.getWidget();
		if (buttonWidget instanceof ExecutableButton) {
			((ExecutableButton) buttonWidget).execute();
			
			if (isWCAGOn) {
				ButtonType type = module.getType();
				if (ButtonType.reset == type) {
					speak(TextToSpeechVoice.create(module.getResetSpeechTextItem(ButtonModule.RESET_BUTTON_RESET_INDEX)));
				}
			}
		}
	}


	@Override
	public void space(KeyDownEvent event) {
		event.preventDefault(); 
	}


	@Override
	public void tab(KeyDownEvent event) {	
	}


	@Override
	public void left(KeyDownEvent event) {	
	}


	@Override
	public void right(KeyDownEvent event) {	
	}


	@Override
	public void down(KeyDownEvent event) {	
		event.preventDefault(); 
	}


	@Override
	public void up(KeyDownEvent event) {
		event.preventDefault(); 
	}


	@Override
	public void escape(KeyDownEvent event) {	
		event.preventDefault(); 
	}


	@Override
	public void customKeyCode(KeyDownEvent event) {	
	}


	@Override
	public void shiftTab(KeyDownEvent event) {

	}

	@Override
	public String getName() {
		return "Button";
	}
	
	private void speak (TextToSpeechVoice t1) {
		List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();
		textVoices.add(t1);
		
		this.speak(textVoices);
	}
	
	private void speak (List<TextToSpeechVoice> textVoices) {
		if (this.pageController != null) {
			this.pageController.speak(textVoices);
		}
	}


	@Override
	public void setPageController(PageController pc) {
		this.setWCAGStatus(true);
		this.pageController = pc;
		
	}


	@Override
	public void setWCAGStatus(boolean isWCAGOn) {
		this.isWCAGOn = isWCAGOn;
		
	}


	@Override
	public String getLang() {
		// TODO Auto-generated method stub
		return null;
	}
}
