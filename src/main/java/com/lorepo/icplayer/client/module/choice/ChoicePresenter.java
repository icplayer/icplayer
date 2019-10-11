package com.lorepo.icplayer.client.module.choice;

import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IStringType;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGPresenter;
import com.lorepo.icplayer.client.module.api.IActivity;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.CustomEvent;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IScoreService;

public class ChoicePresenter implements IPresenter, IStateful, IOptionListener, IActivity, ICommandReceiver, IWCAGPresenter {

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
	}
	
	private IDisplay view;
	private ChoiceModel module;
	private IPlayerServices playerServices;
	private boolean isDisabled;
	private JavaScriptObject	jsObject;
	private boolean isVisible;
	private boolean isShowAnswersActive = false;
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
			
			EventBus eventBus = playerServices.getEventBus();
		
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
					reset();
				}
			});
			
			eventBus.addHandler(CustomEvent.TYPE, new CustomEvent.Handler() {
				@Override
				public void onCustomEventOccurred(CustomEvent event) {
					onEventReceived(event.eventName, event.getData());
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
	
	private void showAnswers() {
		if (!module.isActivity()) {
			return;
		}
				
		this.currentScore = getScore();
		this.currentMaxScore = getMaxScore();
		this.currentErrorCount = getErrorCount();
		this.currentState = getState();
		this.isShowAnswersActive = true;

		clearStylesAndSelection();
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
		if (!module.isActivity()) {
			return;
		}
		clearStylesAndSelection();
		setState(this.currentState);
		this.isShowAnswersActive = false;
		setWorkMode();
	}
	
	@Override
	public void setShowErrorsMode() {
		if (isShowAnswers()) {
			hideAnswers();
		}
		
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
	public void reset() {
		if (isShowAnswers()) {
			hideAnswers();
		}
		
		if(module.isVisible()) show();
		else view.hide();

		clearStylesAndSelection();
		
		isDisabled = module.isDisabled();
		view.setEnabled(!isDisabled);
		if (module.isActivity()) {
			saveScore();
		}
	}


	private void clearStylesAndSelection() {
		for(IOptionDisplay optionView : view.getOptions()){
			optionView.setDown(false);
			optionView.resetStyles();
		}
	}


	@Override
	public String getSerialId() {
		return module.getId();
	}

	@Override
	public String getState() {
		if (isShowAnswers()) {
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
		if (stateObj == "" || stateObj.equals("")) {
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
		ValueChangedEvent valueEvent = new ValueChangedEvent(module.getId(), id, newValue, score);
		playerServices.getEventBus().fireEvent(valueEvent);

		if(getScore() == getMaxScore() && getErrorCount() == 0){
			score = Integer.toString(getScore());
			valueEvent = new ValueChangedEvent(module.getId(), id, "allOK", score);
			playerServices.getEventBus().fireEvent(valueEvent);
		}
	}

	
	// ------------------------------------------------------------------------
	// IActivity
	// ------------------------------------------------------------------------
	@Override
	public int getErrorCount() {
		if (isShowAnswers()) {
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
		if (isShowAnswers()) {
			return this.currentMaxScore;
		}

		if(module.isActivity()) return module.getMaxScore();
		else return 0;
	}

	@Override
	public int getScore() {
		if (isShowAnswers()) {
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
	 * @param value
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

		presenter.reset = function() {
			x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::reset()();
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
		boolean isEnabled = !this.module.isDisabled();
		return isVisible && isEnabled;
	}


	@Override
	public void onEventReceived(String eventName, HashMap<String, String> data) {
		if (eventName.equals("ShowAnswers")) {
			showAnswers();
		} else if (eventName.equals("HideAnswers")) {
			hideAnswers();
		}
	}
}
