package com.lorepo.icplayer.client.module.limitedreset;

import java.util.HashMap;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.event.CustomEvent;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.limitedreset.LimitedResetPresenter.IDisplay;

public class LimitedResetView extends PushButton implements IDisplay {
	private static final String DISABLED_STYLE = "disabled";

	private LimitedResetModule module;
	private IPlayerServices playerServices;
	private boolean isDisabled = false;
	private boolean isShowAnswersMode = false;
	
	public LimitedResetView(LimitedResetModule module, IPlayerServices services) {
		this.playerServices = services;
		this.module = module;

		createUI();
		getElement().setId(module.getId());
	}
	
	private void createUI() {
		StyleUtils.applyInlineStyle(this, module);
		
		StyleUtils.setButtonStyleName("ic_button_limited_reset", this, module);

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
					
					playerServices.getCommands().resetPageScore();

					for (String moduleID : module.getModules()) {
						IPresenter presenter = playerServices.getModule(moduleID);
						
						if (presenter == null) {
							continue;
						}
						
						presenter.reset();
					}
					
					ValueChangedEvent valueEvent = new ValueChangedEvent(module.getId(), "", "resetClicked", "");
					playerServices.getEventBus().fireEvent(valueEvent);
				}
			});		
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
	
	public void setShowAnswersMode(boolean isShowAnswersMode) {
		this.isShowAnswersMode = isShowAnswersMode;
	}

	@Override
	public void onEnterKey() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onEscapeKey() {
		// TODO Auto-generated method stub
		
	}
}
