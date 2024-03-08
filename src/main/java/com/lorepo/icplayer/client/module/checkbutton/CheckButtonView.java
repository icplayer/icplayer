package com.lorepo.icplayer.client.module.checkbutton;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.PageScore;
import com.lorepo.icplayer.client.module.checkbutton.CheckButtonPresenter.IDisplay;
import com.lorepo.icplayer.client.page.PageController;

public class CheckButtonView extends PushButton implements IDisplay, IWCAG, IWCAGModuleView {
	private static final String DISABLED_STYLE = "disabled";
	
	private CheckButtonModule module;
	private boolean isShowErrorsMode;
	private boolean isWCAGOn;
	private IPlayerServices playerServices;
	private PageController pageController;
	private String originalDisplay;
	private boolean isDisabled;

	public CheckButtonView(CheckButtonModule module, IPlayerServices services) {
		this.playerServices = services;
		this.module = module;
		this.isShowErrorsMode = false;

		createUI();
		getElement().setId(module.getId());
	}
	
	private void createUI() {

		StyleUtils.applyInlineStyle(this, module);
		originalDisplay = getElement().getStyle().getDisplay();
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
			playerServices.getCommands().checkAnswers(!module.getDisableScoreUpdate());
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
		this.isDisabled = isDisabled;
		if (isDisabled) {
			addStyleName(DISABLED_STYLE);
		} else{
			removeStyleName(DISABLED_STYLE);
		}
	}

	@Override
	public boolean isDisabled() {
		return isDisabled;
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
	public void enter(KeyDownEvent event, boolean isExiting) {
		if (!isExiting) {
			this.enter();
			if (this.isWCAGOn) {
				if(this.isShowErrorsMode){
					List<TextToSpeechVoice> textVoices = getScoreVoices();
					textVoices.add(0,TextToSpeechVoice.create(this.module.getSpeechTextItem(CheckButtonModule.EDIT_BLOCK_INDEX), this.getLang()));
					this.speak(textVoices);
				} else {
					this.speak(TextToSpeechVoice.create(this.module.getSpeechTextItem(CheckButtonModule.NO_EDIT_BLOCK_INDEX), this.getLang()));
				};
			}
		}
		
	}
	
	private List<TextToSpeechVoice> getScoreVoices(){
		String pageId = this.pageController.getPage().getId();
		PageScore score = this.pageController.getPlayerServices().getScoreService().getPageScore(pageId);
		List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();

		addSpeechTextToVoicesArray(textVoices, CheckButtonModule.CORRECT_INDEX);
		addStringToVoicesArray(textVoices, Float.toString(score.getScore()));
		addSpeechTextToVoicesArray(textVoices, CheckButtonModule.WRONG_INDEX);
		addStringToVoicesArray(textVoices, Integer.toString(score.getErrorCount()));
		addSpeechTextToVoicesArray(textVoices, CheckButtonModule.RESULT_INDEX);
		addStringToVoicesArray(textVoices, Integer.toString(score.getPercentageScore())+"%");
		return textVoices;
	}

	private void addStringToVoicesArray (List<TextToSpeechVoice> textVoices, String text) {
		textVoices.add(TextToSpeechVoice.create(text, this.getLang()));
	}
	
	private void addSpeechTextToVoicesArray (List<TextToSpeechVoice> textVoices, int id) {
		textVoices.add(TextToSpeechVoice.create(this.module.getSpeechTextItem(id), this.getLang()));
	}

	@Override
	public void space(KeyDownEvent event) {
		event.preventDefault();
	}

	@Override
	public void tab(KeyDownEvent event) {}

	@Override
	public void left(KeyDownEvent event) {}

	@Override
	public void right(KeyDownEvent event) {}

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
	public void customKeyCode(KeyDownEvent event) {}

	@Override
	public void shiftTab(KeyDownEvent event) {}

	@Override
	public String getName() {
		return "CheckButton";
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
		return null;
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
	public String getTitlePostfix() {
		if(this.isShowErrorsMode){
			String titlePostfix = this.module.getSpeechTextItem(0);
			return titlePostfix;
		} else {
			return "";
		}
	}
	
	@Override
	public void setVisible(boolean visible) {
		if (visible) {
			super.setVisible(true);
			getElement().getStyle().setProperty("display", originalDisplay);	
		} else {
			super.setVisible(false);
		}
	}
}
