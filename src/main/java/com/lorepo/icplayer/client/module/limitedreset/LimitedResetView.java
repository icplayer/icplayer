package com.lorepo.icplayer.client.module.limitedreset;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icf.utils.JSONUtils;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.event.CustomEvent;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.limitedreset.LimitedResetPresenter.IDisplay;
import com.lorepo.icplayer.client.page.PageController;

public class LimitedResetView extends PushButton implements IDisplay, IWCAG, IWCAGModuleView {
	private static final String DISABLED_STYLE = "disabled";

	private LimitedResetModule module;
	private IPlayerServices playerServices;
	private boolean isDisabled = false;
	private boolean isShowAnswersMode = false;
	private Set<String> activeLimitedShowAnswersModules = new HashSet<String>();
	private String originalDisplay = "";
	private boolean isWCAGOn = false;
	private PageController pageController = null;
	
	public LimitedResetView(LimitedResetModule module, IPlayerServices services) {
		this.playerServices = services;
		this.module = module;

		createUI();
		getElement().setId(module.getId());
	}
	
	private void createUI() {
		StyleUtils.applyInlineStyle(this, module);
		originalDisplay = getElement().getStyle().getDisplay();
		
		StyleUtils.setButtonStyleName("ic_button_limited_reset", this, module);

		getUpFace().setText(module.getTitle());
		
		if (playerServices != null) {
			setVisible(module.isVisible());
			final LimitedResetView context = this;

			addClickHandler(new ClickHandler() {
				
				@Override
				public void onClick(ClickEvent event) {
					event.stopPropagation();
					event.preventDefault();
					context.performReset();
				}
			});		
		}
	}

	public void performReset() {
	    if (isDisabled) {
            return;
		}
		
		if (isShowAnswersMode) {
			playerServices.getEventBusService().getEventBus().fireEventFromSource(new CustomEvent("HideAnswers", new HashMap<String, String>()), this);
			
			isShowAnswersMode = false;
		}
		
		if (activeLimitedShowAnswersModules.size() != 0) {
			sendLimitedHideAnswerEvent();
		}
		
		playerServices.getCommands().resetPageScore();
		
		for (String moduleID : module.getModules()) {
			IPresenter presenter = playerServices.getModule(moduleID);
			
			if (presenter == null) {
				continue;
			}
			
			presenter.reset(module.getResetOnlyWrongAnswers());
		}
		sendResetClickedEvent(module.getId(), this);
	}

	private static native void sendResetClickedEvent(String moduleID, LimitedResetView x) /*-{
	    setTimeout(function(){
            // Timeout with 0 ms is for putting this message at the end of queue - issue performance on firefox
            x.@com.lorepo.icplayer.client.module.limitedreset.LimitedResetView::sendResetClickedEvent(Ljava/lang/String;)(moduleID);
        }, 0);
	}-*/;

	private void sendResetClickedEvent(String moduleID) {
	    ValueChangedEvent valueEvent = new ValueChangedEvent(moduleID, "", "resetClicked", "");
	    playerServices.getEventBusService().getEventBus().fireEvent(valueEvent);
	}

	private void sendLimitedHideAnswerEvent() {
		HashMap<String, String> eventData = new HashMap<String, String>() {{
			put("item", JSONUtils.toJSONString(activeLimitedShowAnswersModules));
			put("source", module.getId());
		}};
		playerServices.getEventBusService().getEventBus().fireEventFromSource(new CustomEvent("LimitedHideAnswers", eventData), this);
		activeLimitedShowAnswersModules.clear();
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

	public void setShowAnswersMode(boolean isShowAnswersMode) {
		this.isShowAnswersMode = isShowAnswersMode;
	}

	public void setLimitedShowAnswersMode(Set<String> activeShowAnswersModules) {
	    this.activeLimitedShowAnswersModules = activeShowAnswersModules;
	}

	@Override
	public String getName() {
		return "LimitedReset";
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
		if (isExiting) {
			return;
		}

		if (!isDisabled) {
		    this.performReset();
        }

		if (isWCAGOn && pageController != null) {
			List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();
			
			if (isDisabled) {
				addSpeechTextToVoicesArray(textVoices, LimitedResetModule.DISABLED_INDEX);
			} else {
				addSpeechTextToVoicesArray(textVoices, LimitedResetModule.RESET_INDEX);
			}
			
			speak(textVoices);
		}
	}
	
	private void addSpeechTextToVoicesArray (List<TextToSpeechVoice> textVoices, int id) {
		textVoices.add(TextToSpeechVoice.create(this.module.getSpeechTextItem(id), null));
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
