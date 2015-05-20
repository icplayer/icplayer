package com.lorepo.icplayer.client.module.limitedcheck;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.event.CustomEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.limitedcheck.LimitedCheckPresenter.IDisplay;

public class LimitedCheckView extends PushButton implements IDisplay {
	private static final String DISABLED_STYLE = "disabled";
	
	private LimitedCheckModule module;
	private IPlayerServices playerServices;
	private boolean isShowErrorsMode = false;
	private boolean isShowAnswersMode = false;
	private boolean isDisabled = false;
	private List<IPresenter> presenters;

	public LimitedCheckView(LimitedCheckModule module, IPlayerServices services) {
		this.playerServices = services;
		this.module = module;

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
					
					if (isDisabled) {
						return;
					}
					
					if (isShowErrorsMode) {
						onUncheck();
					} else {
						onCheck();
					}
				}
			});		
		}
	}
	
	private void onCheck() {
		isShowErrorsMode = true;
		updateStyle();
		
		if (isShowAnswersMode) {
			playerServices.getEventBus().fireEventFromSource(new CustomEvent("HideAnswers", new HashMap<String, String>()), this);
			
			isShowAnswersMode = false;
		}

		playerServices.getCommands().updateCurrentPageScore(true);

		presenters = getModulesPresenters();
		changeModulesMode();
		TotalScore totalScore = TotalScore.getFromPresenters(presenters);
		
		playerServices.getEventBus().fireEventFromSource(new CustomEvent("LimitedCheck", totalScore.getEventData(module)), this);
	}
	
	private void onUncheck () {
		isShowErrorsMode = false;
		updateStyle();
		
		presenters = getModulesPresenters();
		changeModulesMode();
	}
	
	public ArrayList<IPresenter> getModulesPresenters() {
		ArrayList<IPresenter> presenters = new ArrayList<IPresenter>();
		
		for (String moduleID : module.getModules()) {
			IPresenter presenter = playerServices.getModule(moduleID);
			
			if (presenter != null) {
				presenters.add(presenter);
			}
		}
		
		return presenters;
	}
	
	private void changeModulesMode() {
		for (IPresenter presenter : presenters) {
			if (isShowErrorsMode) {
				presenter.setShowErrorsMode();
			} else {
				presenter.setWorkMode();
			}
		}
	}
	
	private void updateStyle() {
		if (isShowErrorsMode) {
			StyleUtils.setButtonStyleName("ic_button_limited_uncheck", this, module);

			getUpFace().setText(module.getUnCheckText());
		} else {
			StyleUtils.setButtonStyleName("ic_button_limited_check", this, module);

			getUpFace().setText(module.getCheckText());
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
	public void setShowErrorsMode(boolean isShowErrorsMode) {
		
		this.isShowErrorsMode = isShowErrorsMode;
		updateStyle();
	}

	@Override
	public boolean isShowErrorsMode() {
		return this.isShowErrorsMode;
	}
	
	public void setShowAnswersMode(boolean isShowAnswersMode) {
		this.isShowAnswersMode = isShowAnswersMode;
	}
}
