package com.lorepo.icplayer.client.module.limitedcheck;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.content.services.PlayerEventBus;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.event.CustomEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.limitedcheck.LimitedCheckPresenter.IDisplay;
import com.lorepo.icplayer.client.page.PageController;

public class LimitedCheckView extends PushButton implements IDisplay, IWCAG, IWCAGModuleView {
    private static final String DISABLED_STYLE = "disabled";

    private LimitedCheckModule module;
    private IPlayerServices playerServices;
    private boolean isShowErrorsMode = false;
    private boolean isShowAnswersMode = false;
    private boolean isDisabled = false;
    private List<IPresenter> presenters;
    private String originalDisplay = "";
    private boolean isWCAGOn = false;
    private PageController pageController = null;

    public LimitedCheckView(LimitedCheckModule module, IPlayerServices services) {
        this.playerServices = services;
        this.module = module;

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

    public boolean isButtonPressed() {
        return isShowErrorsMode;
    }

    private void onCheck() {
    	onCheck(true);
    }
    
    public void setChecked() {
    	onCheck(false);
    }
    
    private void onCheck(boolean updateCheckCount) {
        PlayerEventBus eventBus = playerServices.getEventBusService().getEventBus();
        IPlayerCommands commands = playerServices.getCommands();
        boolean mistakesFromProvidedModules = module.getMistakesFromProvidedModules();

        isShowErrorsMode = true;
        updateStyle();

        if (isShowAnswersMode) {
            HashMap<String, String> connectedModulesEventData = getConnectedModules();
            eventBus.fireEventFromSource(new CustomEvent("LimitedHideAnswers", connectedModulesEventData), this);
            isShowAnswersMode = false;
        }

        presenters = getModulesPresenters();
        TotalScore totalScore = TotalScore.getFromPresenters(presenters);
        
        if (updateCheckCount) {
	        if (mistakesFromProvidedModules) {
	            commands.updateCurrentPageScoreWithMistakes(totalScore.errors);
	        } else {
	            commands.updateCurrentPageScore(true);
	        }
        }

        changeModulesMode();
        
        CustomEvent limitedCheckEvent = null;
        if (updateCheckCount) {
        	limitedCheckEvent = new CustomEvent("LimitedCheck", totalScore.getEventData(module));
        } else {
        	limitedCheckEvent = new CustomEvent("LimitedCheck", totalScore.getPageReloadedEventData(module));
        }
        eventBus.fireEventFromSource(limitedCheckEvent, this);
    }

    private HashMap<String, String> getConnectedModules() {
        List<String> connectedModules = module.getModules();
        HashMap<String, String> connectedModulesEventData = new HashMap<String, String>();
        for (int i = 0; i < connectedModules.size(); i++) {
            connectedModulesEventData.put("module" + i, connectedModules.get(i));
        }
        return connectedModulesEventData;
    }

    private void onUncheck() {
        isShowErrorsMode = false;
        updateStyle();

        presenters = getModulesPresenters();
        changeModulesMode();

        TotalScore totalScore = TotalScore.getFromPresenters(presenters);
        playerServices.getEventBusService().getEventBus().fireEventFromSource(new CustomEvent("LimitedCheck", totalScore.getModeButton(module, isShowErrorsMode)), this);
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
        } else {
            removeStyleName(DISABLED_STYLE);
        }
    }

    @Override
    public boolean isDisabled() {
        return isDisabled;
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

    @Override
    public String getName() {
        return "LimitedCheck";
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
	public TotalScore getTotalScore() {
        ArrayList<IPresenter> modulesPresenters = getModulesPresenters();
        TotalScore score = TotalScore.getFromPresenters(modulesPresenters);
        return score;
    }

    @Override
    public void enter(KeyDownEvent event, boolean isExiting) {
        boolean isCheck = !isButtonPressed();
        if (isCheck) {
            onCheck();
        } else {
            onUncheck();
        }
        if (isWCAGOn && pageController != null) {
            List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();

            if (isCheck) {
                addSpeechTextToVoicesArray(textVoices, LimitedCheckModule.EDIT_BLOCK_INDEX);
                textVoices.addAll(getConnectedModulesVoices());
                textVoices.addAll(getScoreVoices());
            } else {
                addSpeechTextToVoicesArray(textVoices, LimitedCheckModule.NO_EDIT_BLOCK_INDEX);
                textVoices.addAll(getConnectedModulesVoices());
            }

            speak(textVoices);
        }
    }

    private List<TextToSpeechVoice> getScoreVoices(){
        TotalScore score = getTotalScore();
        List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();

        if (score.maxScore == 0) return textVoices;

        int percentScore = (int) (100*score.score/score.maxScore);
        addSpeechTextToVoicesArray(textVoices, LimitedCheckModule.CORRECT_INDEX);
        textVoices.add(TextToSpeechVoice.create(String.valueOf(score.score), null));
        addSpeechTextToVoicesArray(textVoices, LimitedCheckModule.WRONG_INDEX);
        textVoices.add(TextToSpeechVoice.create(String.valueOf(score.errors), null));
        addSpeechTextToVoicesArray(textVoices, LimitedCheckModule.RESULT_INDEX);
        textVoices.add(TextToSpeechVoice.create(String.valueOf(percentScore) + "%", null));

        return textVoices;
    }

    private void addSpeechTextToVoicesArray (List<TextToSpeechVoice> textVoices, int id) {
        textVoices.add(TextToSpeechVoice.create(this.module.getSpeechTextItem(id), null));
    }

    private List<TextToSpeechVoice> getConnectedModulesVoices(){
        List<TextToSpeechVoice> textVoices = new ArrayList<TextToSpeechVoice>();

        if (pageController == null) return textVoices;

        List<String> moduleIDs = module.getModules();
        for (String id : moduleIDs) {
            String title = this.pageController.getTitle("main", id);
            textVoices.add(TextToSpeechVoice.create(title, null));
        }

        return textVoices;

    }

    @Override
    public String getTitlePostfix() {
        if (isButtonPressed()) {
            return this.module.getSpeechTextItem(LimitedCheckModule.SELECTED_INDEX);
        } else {
            return "";
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
