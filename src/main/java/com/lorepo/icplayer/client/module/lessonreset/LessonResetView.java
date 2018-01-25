package com.lorepo.icplayer.client.module.lessonreset;

import java.util.HashMap;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.api.event.CustomEvent;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.lessonreset.LessonResetModule;
import com.lorepo.icplayer.client.module.lessonreset.LessonResetPresenter.IDisplay;

public class LessonResetView extends PushButton implements IDisplay {
	private static final String DISABLED_STYLE = "disabled";

	private LessonResetModule module;
	private IPlayerServices playerServices;
	private boolean isDisabled = false;
	private boolean isShowAnswersMode = false;
	
	public LessonResetView(LessonResetModule module, IPlayerServices services) {
		this.playerServices = services;
		this.module = module;
		
		createUI();
		getElement().setId(module.getId());
	}
	
	private void createUI() {
		StyleUtils.applyInlineStyle(this, module);
		
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

					if (isShowAnswersMode) {
						playerServices.getEventBus().fireEventFromSource(new CustomEvent("HideAnswers", new HashMap<String, String>()), this);
						
						isShowAnswersMode = false;
					}
					
					playerServices.getEventBus().fireEvent(new ValueChangedEvent(module.getId(), "Lesson Reset", "", ""));
					playerServices.getScoreService().lessonScoreReset(module.getResetChecks(), module.getResetMistakes());
					playerServices.getStateService().resetStates();
					playerServices.getEventBus().fireEvent(new ResetPageEvent());
				}
			});		
		}
	}
	
	@Override
	public void execute() {
		if (isDisabled) {
			return;
		}
		
		if (isShowAnswersMode) {
			playerServices.getEventBus().fireEventFromSource(new CustomEvent("HideAnswers", new HashMap<String, String>()), this);
			
			isShowAnswersMode = false;
		}
		
		playerServices.getScoreService().lessonScoreReset(module.getResetChecks(), module.getResetMistakes());
		playerServices.getStateService().resetStates();
		playerServices.getEventBus().fireEvent(new ResetPageEvent());
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
	public void setShowAnswersMode(boolean isShowAnswersMode) {
		this.isShowAnswersMode = isShowAnswersMode;		
	}

	@Override
	public String getName() {
		return "LessonReset";
	}
}
