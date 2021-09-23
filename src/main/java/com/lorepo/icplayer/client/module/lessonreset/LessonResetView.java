package com.lorepo.icplayer.client.module.lessonreset;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.api.event.CustomEvent;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.lessonreset.LessonResetModule;
import com.lorepo.icplayer.client.module.lessonreset.LessonResetPresenter.IDisplay;
import com.lorepo.icplayer.client.page.PageController;

public class LessonResetView extends PushButton implements IDisplay, IWCAG, IWCAGModuleView {
	private static final String DISABLED_STYLE = "disabled";

	private LessonResetModule module;
	private IPlayerServices playerServices;
	private boolean isDisabled = false;
	private boolean isShowAnswersMode = false;
	private String originalDisplay = "";
	private boolean isWCAGOn = false;
	private PageController pageController = null;
	
	public LessonResetView(LessonResetModule module, IPlayerServices services) {
		this.playerServices = services;
		this.module = module;
		
		createUI();
		getElement().setId(module.getId());
	}
	
	private void createUI() {
		StyleUtils.applyInlineStyle(this, module);
		originalDisplay = getElement().getStyle().getDisplay();
		StyleUtils.setButtonStyleName("ic_button_lesson_reset", this, module);

		getUpFace().setText(module.getTitle());
		
		if (playerServices != null) {
			setVisible(module.isVisible());
			
			addClickHandler(new ClickHandler() {
				
				@Override
				public void onClick(ClickEvent event) {

					event.stopPropagation();
					event.preventDefault();

					if (isDisabled) {
						return;
					}

					if (module.getResetVisitedPages()) {
						playerServices.clearVisitedPages();
					}

					if (isShowAnswersMode) {
						playerServices.getEventBusService().getEventBus().fireEventFromSource(new CustomEvent("HideAnswers", new HashMap<String, String>()), this);
						
						isShowAnswersMode = false;
					}

					playerServices.getEventBusService().getEventBus().fireEvent(new ValueChangedEvent(module.getId(), "Lesson Reset", "", ""));
					playerServices.getScoreService().lessonScoreReset(module.getResetChecks(), module.getResetMistakes());
					playerServices.getStateService().resetStates();
					playerServices.getEventBusService().getEventBus().fireEvent(new ResetPageEvent(false));
				}
			});		
		}
	}

	@Override
	public void executeAndClearVisitedPages() {
		execute(true);
	}
	
	@Override
	public void execute() {
		execute(false);
	}

	void execute(boolean forceClearVisitedPages) {
		if (isDisabled) {
			return;
		}

		if (module.getResetVisitedPages() || forceClearVisitedPages) {
			playerServices.clearVisitedPages();
		}

		if (isShowAnswersMode) {
			playerServices.getEventBusService().getEventBus().fireEventFromSource(new CustomEvent("HideAnswers", new HashMap<String, String>()), this);

			isShowAnswersMode = false;
		}

		playerServices.getScoreService().lessonScoreReset(module.getResetChecks(), module.getResetMistakes());
		playerServices.getStateService().resetStates();
		playerServices.getEventBusService().getEventBus().fireEvent(new ResetPageEvent(false));
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
	public void setShowAnswersMode(boolean isShowAnswersMode) {
		this.isShowAnswersMode = isShowAnswersMode;		
	}

	@Override
	public String getName() {
		return "LessonReset";
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

	@Override
	public void enter(KeyDownEvent event, boolean isExiting) {
		if (!isExiting) {
			execute();
			if (isWCAGOn) {
				List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();
				textVoices.add(0,TextToSpeechVoice.create(this.module.getSpeechTextItem(0), this.getLang()));
				speak(textVoices);
			}
		}
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

	private void speak (List<TextToSpeechVoice> textVoices) {
		if (this.pageController != null) {
			this.pageController.speak(textVoices);
		}
	}
}
