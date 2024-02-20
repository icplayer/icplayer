package com.lorepo.icplayer.client.module.choice;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IStringType;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.metadata.*;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGPresenter;
import com.lorepo.icplayer.client.module.api.*;
import com.lorepo.icplayer.client.module.api.event.*;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.page.KeyboardNavigationController;
import com.lorepo.icplayer.client.module.text.AudioInfo;
import com.lorepo.icplayer.client.module.text.AudioWidget;
import com.lorepo.icplayer.client.module.text.AudioButtonWidget;

public class ChoicePresenter implements IPresenter, IStateful, IOptionListener, IActivity, ICommandReceiver, IWCAGPresenter, IGradualShowAnswersPresenter, IScoreWithMetadataPresenter {

	public interface IOptionDisplay{
		public ChoiceOption getModel();
		void setDown(boolean down);
		boolean isDown();
		void setWrongStyle();
		void setCorrectStyle();
		void setCorrectAnswerStyle();
		void resetStyles();
		void setEventBus(EventBus eventBus);
		public void markAsCorrect();
		public void markAsEmpty();
		public void markAsWrong();
		public void addBorder();
		public void removeBorder();
		public List<AudioInfo> getAudioInfos();
	}
	
	public interface IDisplay extends IModuleView{
		public List<IOptionDisplay> getOptions();
		public void setEnabled(boolean b);
		public void addListener(IOptionListener listener);
		public Element getElement();
		public void show();
		public void hide();
		public int[] getOryginalOrder();
		public void setVisibleVal(boolean val);
		public void getOrderedOptions();
		void isShowErrorsMode(boolean isShowErrorsMode);
		void connectAudios();
	}
	
	private IDisplay view;
	private ChoiceModel module;
	private IPlayerServices playerServices;
	private boolean isDisabled;
	private JavaScriptObject	jsObject;
	private boolean isVisible;
	private boolean isShowAnswersActive = false;
	private boolean isGradualShowAnswers = false;
	private String currentState = "";
	private int currentScore;
	private int currentMaxScore;
	private int currentErrorCount;
	

	public ChoicePresenter(ChoiceModel module, IPlayerServices services){
	
		this.module = module;
		this.playerServices = services;
		isDisabled = module.isDisabled();
		isVisible = module.isVisible();

		try{
			connectHandlers();
		}catch(Exception e){
		}
	}

	
	private void connectHandlers() {
		
		if (playerServices != null) {
			
			EventBus eventBus = playerServices.getEventBusService().getEventBus();
		
			eventBus.addHandler(ShowErrorsEvent.TYPE, new ShowErrorsEvent.Handler() {
				public void onShowErrors(ShowErrorsEvent event) {
					setShowErrorsMode();
				}
			});

			eventBus.addHandler(WorkModeEvent.TYPE, new WorkModeEvent.Handler() {
				public void onWorkMode(WorkModeEvent event) {
					setWorkMode();
				}
			});

			eventBus.addHandler(ResetPageEvent.TYPE, new ResetPageEvent.Handler() {
				public void onResetPage(ResetPageEvent event) {
					reset(event.getIsOnlyWrongAnswers());
				}
			});
			
			eventBus.addHandler(CustomEvent.TYPE, new CustomEvent.Handler() {
				@Override
				public void onCustomEventOccurred(CustomEvent event) {
					onEventReceived(event.eventName, event.getData());
				}
			});

			eventBus.addHandler(GradualShowAnswerEvent.TYPE, new GradualShowAnswerEvent.Handler() {
				@Override
				public void onGradualShowAnswers(GradualShowAnswerEvent event) {
					if (!isGradualShowAnswers) {
						setCurrentViewState();
						isGradualShowAnswers = true;
					}

					if (event.getModuleID().equals(module.getId())) {
						int itemIndex = event.getItem();
						handleGradualShowAnswers(itemIndex);
					}
				}
			});

			eventBus.addHandler(GradualHideAnswerEvent.TYPE, new GradualHideAnswerEvent.Handler() {
				@Override
				public void onGradualHideAnswers(GradualHideAnswerEvent event) {
					handleGradualHideAnswers();
				}
			});
			
		}
	}
	
	private boolean isShowAnswers() {
		if (!module.isActivity()) {
			return false;
		}
		
		return this.isShowAnswersActive;
	}

	private boolean shouldReturnSavedState() {
		return isShowAnswers() || isGradualShowAnswers;
	}
	
	private void showAnswers() {
	    resetAudio();

		if (!module.isActivity()) {
			return;
		}

		setCurrentViewState();

		this.isShowAnswersActive = true;

		clearStylesAndSelection(false);
		view.isShowErrorsMode(false);
		view.setEnabled(false);
		
		for(IOptionDisplay optionView : view.getOptions()){
			ChoiceOption option = optionView.getModel();
			
			if (option.getValue() > 0) {
				optionView.setDown(true);
				optionView.setCorrectAnswerStyle();
			} else {
				optionView.setWrongStyle();
			}
		}
	}
	
	private void hideAnswers() {
		if (!module.isActivity() || !this.isShowAnswersActive) {
			return;
		}

		clearStylesAndSelection(false);
		setState(this.currentState);
		this.isShowAnswersActive = false;
		setWorkMode();
	}
	
	@Override
	public void setShowErrorsMode() {
		if (isShowAnswers()) {
			hideAnswers();
		}

		resetAudio();
		
		if(module.isActivity()){
			for(IOptionDisplay optionView : view.getOptions()){
				ChoiceOption option = optionView.getModel();
				if (optionView.isDown()) {
					if(option.getValue() > 0){
						optionView.setCorrectStyle();
					} else{
						optionView.setWrongStyle();
					}
				} else {
					if (option.getValue() > 0) {
						optionView.setWrongStyle();
					} else {
						optionView.setCorrectStyle();
					}
				}
			}
		}

		view.isShowErrorsMode(true);
		view.setEnabled(false);
	}	
	
	@Override
	public void setWorkMode() {
		if (isShowAnswers()) {
			hideAnswers();
		}

		if(module.isActivity()){
			for(IOptionDisplay optionView : view.getOptions()){
				optionView.resetStyles();
			}
		}
			
		view.isShowErrorsMode(false);
		view.setEnabled(!isDisabled);
	}	
	
	@Override
	public void reset(boolean onlyWrongAnswers) {
		if (isShowAnswers()) {
			hideAnswers();
		}
		
		if(module.isVisible()) show();
		else view.hide();

		clearStylesAndSelection(onlyWrongAnswers);
		
		isDisabled = module.isDisabled();
		view.setEnabled(!isDisabled);
		if (module.isActivity()) {
			saveScore();
		}
		resetAudio();
	}
	
	private void reset() {
		this.reset(false);
	}


	private void clearStylesAndSelection(boolean onlyWrongAnswers) {
		for(IOptionDisplay optionView : view.getOptions()){
			if (onlyWrongAnswers) {
				if (optionView.isDown() && optionView.getModel().getValue() == 0) {
					optionView.setDown(false);
					optionView.resetStyles();
				}
			} else {
				optionView.setDown(false);
				optionView.resetStyles();
			}
		}
	}


	@Override
	public String getSerialId() {
		return module.getId();
	}

	@Override
	public String getState() {
		if (shouldReturnSavedState()) {
			return this.currentState;
		}

		IJsonServices json = playerServices.getJsonServices();
		HashMap<String, String> state = new HashMap<String, String>();
		String optionState = "";

		for(int i = 0; i < view.getOptions().size(); i++){
			IOptionDisplay option = view.getOptions().get(i);
			optionState += option.isDown() ? '1' : '0';
		}
		
		state.put("options", optionState);
		state.put("isDisabled", Boolean.toString(isDisabled));
		state.put("isVisible", Boolean.toString(isVisible));
		return json.toJSONString(state);
	}

	
	@Override
	public void setState(String stateObj) {
		if (stateObj.equals("")) {
			return;
		}
		
		IJsonServices json = playerServices.getJsonServices();
		HashMap<String, String> state = json.decodeHashMap(stateObj);
		if (state.containsKey("options")) {
			String optionState = state.get("options");

			for (int i = 0; i < view.getOptions().size(); i++) {
				
				IOptionDisplay option = view.getOptions().get(i);
				
				if(optionState.length() < i+1){
					break;
				}
				
				boolean value = (optionState.charAt(i) == '1');
				option.setDown(value);
			}
		}

		if (state.containsKey("isDisabled")) {
			isDisabled = Boolean.parseBoolean(state.get("isDisabled"));
			view.setEnabled(!isDisabled);
		}

		if (state.containsKey("isVisible")) {
			isVisible = Boolean.parseBoolean(state.get("isVisible"));
			view.setVisibleVal(isVisible);
		}
	}


	private void enable() {
		if (isShowAnswers()) {
			hideAnswers();
		}

		isDisabled = false;
		view.setEnabled(true);
	}


	private void disable() {
		if (isShowAnswers()) {
			hideAnswers();
		}

		isDisabled = true;
		view.setEnabled(false);
	}


	@Override
	public void onValueChange(IOptionDisplay sourceOptionView, boolean selected) {

		if(!module.isMulti() && selected){
		
			for(IOptionDisplay optionView : view.getOptions()){
				if(optionView != sourceOptionView){
					optionView.setDown(false);
				}
			}
		}
		
		ChoiceOption option = sourceOptionView.getModel();
		String feedback = option.getFeedback();
		if(!feedback.isEmpty()){
			playerServices.getCommands().executeEventCode(feedback);
		}
		saveScore();
		
		String newValue = sourceOptionView.isDown()? "1" : "0";
		String id = option.getID();
		String score = "0";
		if(sourceOptionView.isDown()){
			score = Integer.toString(option.getValue());
		}

		sendValueChangedEvent(id, newValue, score);

		if(getScore() == getMaxScore() && getErrorCount() == 0){
			score = Integer.toString(getScore());
			sendValueChangedEvent(id, "allOK", score);
		}
	}

	@Override
	public void onAudioButtonClicked(AudioInfo audioInfo) {
	    AudioWidget audio = audioInfo.getAudio();
        AudioButtonWidget button = audioInfo.getButton();

        if (audio.isPaused()) {
            resetAudio();
            audio.play();
            button.setStopPlayingStyleClass();
        } else {
            audio.reset();
            button.setStartPlayingStyleClass();
        }
	}

	@Override
	public void onAudioEnded(AudioInfo audioInfo) {
	    AudioWidget audio = audioInfo.getAudio();
        AudioButtonWidget button = audioInfo.getButton();

        audio.reset();
        button.setStartPlayingStyleClass();
	}

	private void resetAudio() {
	    for(IOptionDisplay optionView : view.getOptions()){
	        List<AudioInfo> audioInfos = optionView.getAudioInfos();
            for (int i = 0; i < audioInfos.size(); i++) {
                AudioInfo audioInfo = audioInfos.get(i);
                AudioButtonWidget button = audioInfo.getButton();
                AudioWidget audio = audioInfo.getAudio();
                boolean isElementExists = button != null && audio != null;

                if (isElementExists && !audio.isPaused()) {
                    audio.reset();
                    button.setStartPlayingStyleClass();
                }
            }
	    }
	}
	
	// ------------------------------------------------------------------------
	// IActivity
	// ------------------------------------------------------------------------
	@Override
	public int getErrorCount() {
		if (shouldReturnSavedState()) {
			return this.currentErrorCount;
		}

		int errors = 0;
		if(module.isActivity()){
			for(IOptionDisplay optionView : view.getOptions()){
				if(optionView.isDown() && optionView.getModel().getValue() == 0){
					errors++;
				}
			}
		}
		
		return errors;
	}


	@Override
	public int getMaxScore() {
		if (shouldReturnSavedState()) {
			return this.currentMaxScore;
		}

		if(module.isActivity()) return module.getMaxScore();
		else return 0;
	}

	@Override
	public int getScore() {
		if (shouldReturnSavedState()) {
			return this.currentScore;
		}

		int score = 0;
		if(module.isActivity()){
			for(IOptionDisplay optionView : view.getOptions()){
				if(optionView.isDown()){
					score += optionView.getModel().getValue();
				}
			}
		}
		return score;
	}
	

	/**
	 * Update module score
	 */
	void saveScore() {

		if(playerServices != null){
		
			IScoreService scoreService = playerServices.getScoreService();
			scoreService.setScore(module.getId(), 0, module.getMaxScore());
			int score = 0;
	
			for(IOptionDisplay optionView : view.getOptions()){
				if(optionView.isDown()){
					score += optionView.getModel().getValue();
				}
			}
			
			scoreService.setScore(module.getId(), score, module.getMaxScore());
		}
	}


	@Override
	public void addView(IModuleView display) {
		
		if(display instanceof IDisplay){
			view = (IDisplay) display;
			view.addListener(this);
			for(IOptionDisplay optionView : view.getOptions()){
				optionView.setEventBus(playerServices.getEventBus());
			}
			view.connectAudios();
		}
	}


	@Override
	public IModuleModel getModel() {
		return module;
	}

	@Override
	public String executeCommand(String commandName, List<IType> params) {
		IStringType param = null;
		
		if (commandName.compareTo("enable") == 0) {
			enable();
		} else if (commandName.compareTo("disable") == 0) {
			disable();
		} else if (commandName.compareTo("show") == 0) {
			show();
		} else if (commandName.compareTo("hide") == 0) {
			hide();
		} else if (commandName.compareTo("reset") == 0) {
			reset();
		} else if (commandName.compareTo("isallok") == 0) {
            return String.valueOf(isAllOK());
        } else if (commandName.compareTo("markoptionascorrect") == 0 && params.size() == 1) {
			param = (IStringType) params.get(0);
        	markOptionAsCorrect(Integer.parseInt(param.getValue()));
        } else if (commandName.compareTo("markoptionaswrong") == 0 && params.size() == 1) {
			param = (IStringType) params.get(0);
        	markOptionAsWrong(Integer.parseInt(param.getValue()));
        } else if (commandName.compareTo("markoptionasempty") == 0 && params.size() == 1) {
			param = (IStringType) params.get(0);
        	markOptionAsEmpty(Integer.parseInt(param.getValue()));
        } else if (commandName.compareTo("getscore") == 0) {
			return String.valueOf(getScore());
		} else if (commandName.compareTo("geterrorcount") == 0) {
			return String.valueOf(getErrorCount());
		} else if (commandName.compareTo("getmaxscore") == 0) {
			return String.valueOf(getMaxScore());
		} else if (commandName.compareTo("setshowerrorsmode") == 0) {
			setShowErrorsMode();
		} else if (commandName.compareTo("setworkmode") == 0) {
			setWorkMode();
		} else if (commandName.compareTo("showanswers") == 0) {
			showAnswers();
		} else if (commandName.compareTo("hideanswers") == 0) {
			hideAnswers();
		}
		
		return "";
	}

	@Override
	public String getName() {
		return module.getId();
	}
	
	private void jsOnEventReceived (String eventName, String jsonData) {
		this.onEventReceived(eventName, jsonData == null ? new HashMap<String, String>() : (HashMap<String, String>)JavaScriptUtils.jsonToMap(jsonData));
	}

	public JavaScriptObject getAsJavaScript(){
		
		if(jsObject == null){
			jsObject = initJSObject(this);
		}

		return jsObject;
	}

	@Override
	public void setDisabled(boolean value) {
		if (value) {
			disable();
		} else {
			enable();
		}
	}

	@Override
	public boolean isDisabled() {
		return isDisabled;
	}

	public boolean isAllOK() {
		return getScore() == getMaxScore() && getErrorCount() == 0;
	}
	
	private native JavaScriptObject initJSObject(ChoicePresenter x) /*-{

		var presenter = function() {};

		presenter.isAllOK = function() {
			return x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::isAllOK()();
		}

		presenter.disable = function() {
			x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::disable()();
		}

		presenter.enable = function() {
			x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::enable()();
		}

		presenter.show = function() {
			x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::show()();
		}

		presenter.hide = function() {
			x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::hide()();
		}

		presenter.reset = function(onlyWrongAnswers) {
			x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::reset(Z)(onlyWrongAnswers);
		}

		presenter.isAttempted = function() {
			return x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::isAttempted()();
		}

		presenter.getView = function() {
			return x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::getView()();
		}

		presenter.markOptionAsCorrect = function(index) {
			x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::markOptionAsCorrect(I)(index);
		}

		presenter.markOptionAsWrong = function(index) {
			x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::markOptionAsWrong(I)(index);
		}

		presenter.markOptionAsEmpty = function(index) {
			x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::markOptionAsEmpty(I)(index);
		}

		presenter.isOptionSelected = function(index) {
			return x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::isOptionSelected(I)(index);
		}

		presenter.onEventReceived = function (eventName, data) {
			x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::jsOnEventReceived(Ljava/lang/String;Ljava/lang/String;)(eventName, JSON.stringify(data));
		};

		presenter.getScore = function() {
			return x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::getScore()();
		};

		presenter.getErrorCount = function() {
			return x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::getErrorCount()();
		};

		presenter.getMaxScore = function() {
			return x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::getMaxScore()();
		};

		presenter.setShowErrorsMode = function() {
			x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::setShowErrorsMode()();
		};

		presenter.setWorkMode = function() {
			x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::setWorkMode()();
		};

		presenter.showAnswers = function() {
			x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::showAnswers()();
		};

		presenter.hideAnswers = function() {
			x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::hideAnswers()();
		};

		return presenter;
	}-*/;
	
	private Element getView(){
		return view.getElement();
	}
	
	private void markOptionAsCorrect(int index){
		if (isShowAnswers()) {
			hideAnswers();
		}

		if(index <= view.getOptions().size()){
			view.getOptions().get(index-1).markAsCorrect();
		}
	}
	
	private void markOptionAsWrong(int index){
		if (isShowAnswers()) {
			hideAnswers();
		}

		if(index <= view.getOptions().size()){
			view.getOptions().get(index-1).markAsWrong();
		}
	}
	
	private void markOptionAsEmpty(int index){
		if (isShowAnswers()) {
			hideAnswers();
		}

		if(index <= view.getOptions().size()){
			view.getOptions().get(index-1).markAsEmpty();
		}
	}
	
	private boolean isOptionSelected(int index){
		if (isShowAnswers()) {
			hideAnswers();
		}

		if(index <= view.getOptions().size()){
			return view.getOptions().get(index-1).isDown();
		}
		return false;
	}


	private void show(){
		if (isShowAnswers()) {
			hideAnswers();
		}

		isVisible = true;
		if(view != null){
			view.show();
		}
	}
	
	
	private void hide(){
		if (isShowAnswers()) {
			hideAnswers();
		}

		isVisible = false;
		if(view != null){
			view.hide();
		}
	}
	
	
	/**
	 * Check if module has any option selected 
	 */
	private boolean isAttempted() {
		if (isShowAnswers()) {
			hideAnswers();
		}

		for(IOptionDisplay optionView : view.getOptions()){
			if(optionView.isDown()){
				return true;
			}
		}
		
		return false;
	}


	@Override
	public IWCAG getWCAGController() {
		return (IWCAG) this.view;
	}


	@Override
	public void selectAsActive(String className) {
		this.view.getElement().addClassName(className);
		
	}


	@Override
	public void deselectAsActive(String className) {
		this.view.getElement().removeClassName(className);
	}


	@Override
	public boolean isSelectable(boolean isTextToSpeechOn) {
		boolean isVisible = !this.getView().getStyle().getVisibility().equals("hidden") && !this.getView().getStyle().getDisplay().equals("none");
		boolean isGroupDivHidden = KeyboardNavigationController.isParentGroupDivHidden(view.getElement());
		return (isTextToSpeechOn || haveStandaloneKeyboardNavigationSupport()) && isVisible && !isGroupDivHidden;
	}
	
	@Override
	public boolean haveStandaloneKeyboardNavigationSupport() {
		return !module.shouldOmitInKeyboardNavigation() && !this.module.isDisabled();
	}

	@Override
	public void onEventReceived(String eventName, HashMap<String, String> data) {
		if (eventName.equals("ShowAnswers")) {
			showAnswers();
		} else if (eventName.equals("HideAnswers")) {
			hideAnswers();
		}
	}

	@Override
	public int getActivitiesCount() {
		return module.getCorrectOptionCount();
	}

	public void handleGradualShowAnswers(int itemIndex) {
		if (module.isMulti()) {
			this.markCorrectMultiChoices(itemIndex);
        } else {
            this.markCorrectSingleChoice(itemIndex);
        }
	}

	private void markCorrectMultiChoices(int itemIndex) {
	    int currentCorrectOption = 0;

	    if (itemIndex == 0) {
            clearStylesAndSelection(false);
        }

        for (IOptionDisplay option : view.getOptions()) {
            if (option.getModel().getValue() > 0 && currentCorrectOption <= itemIndex) {
            	option.setDown(true);
                option.setCorrectAnswerStyle();
                currentCorrectOption++;
            }
        }
	}

	private void markCorrectSingleChoice(int itemIndex) {
		int currentCorrectOption = 0;
		clearStylesAndSelection(false);
		
		for (IOptionDisplay option : view.getOptions()) {
			if (option.getModel().isCorrect()) {
				if (currentCorrectOption == itemIndex) {
					option.setDown(true);
					option.setCorrectAnswerStyle();

					break;
				} else {
					currentCorrectOption++;
				}
			}
		}
	}

	public void handleGradualHideAnswers() {
		isGradualShowAnswers = false;
		boolean isVisibleBeforeSetState = isVisible;

		clearStylesAndSelection(false);
		setState(this.currentState);

		isVisible = isVisibleBeforeSetState;
		view.setVisibleVal(isVisibleBeforeSetState);
	}

	public void sendValueChangedEvent(String itemID, String value, String score) {
		String moduleType = this.module.getModuleTypeName();
		String moduleID = this.module.getId();
		
		this.playerServices.getEventBusService().sendValueChangedEvent(moduleType, moduleID, itemID, value, score);
	}

	@Override
	public List<ScoreWithMetadata> getScoreWithMetadata() {
		IMetadata metadata = this.module.getMetadata();
		if (!ScoreWithMetadataUtils.validateMetadata(metadata)){
			return null;
		}

		List<ScoreWithMetadata> list = new ArrayList<ScoreWithMetadata>();
		boolean isAlphabetical = ScoreWithMetadataUtils.enumerateAlphabetically(metadata);
		String enumerateStart = ScoreWithMetadataUtils.getEnumerateStart(metadata);
		String questionNumber = ScoreWithMetadataUtils.getQuestionNumber(enumerateStart, 0, isAlphabetical);

		ScoreWithMetadata scoreWithMetadata = new ScoreWithMetadata(questionNumber);
		scoreWithMetadata.setModule(this.module);
		scoreWithMetadata.setMetadata(module.getMetadata());

		List<String> allAnswers = new ArrayList<String>();
		for(int i = 0; i < view.getOptions().size(); i++){
			IOptionDisplay option = view.getOptions().get(i);
			String optionLetter = ScoreWithMetadataUtils.getLetterWithIndex(i);
			allAnswers.add(optionLetter);
			if (option.isDown()) {
				scoreWithMetadata.setUserAnswer(optionLetter);
				scoreWithMetadata.setIsCorrect(option.getModel().isCorrect());
			}
		}
		scoreWithMetadata.setAllAnswers(allAnswers);
		list.add(scoreWithMetadata);
		return list;
	}

	private void setCurrentViewState() {
		this.currentScore = getScore();
		this.currentErrorCount = getErrorCount();
		this.currentMaxScore = getMaxScore();
		this.currentState = getState();
	}

	@Override
	public boolean isActivity() {
		return this.module.isActivity();
	}
}
