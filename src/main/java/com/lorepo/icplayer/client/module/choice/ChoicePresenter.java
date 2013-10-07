package com.lorepo.icplayer.client.module.choice;

import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icplayer.client.module.api.IActivity;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IScoreService;

public class ChoicePresenter implements IPresenter, IStateful, IOptionListener, IActivity, ICommandReceiver{

	public interface IOptionDisplay{
		public ChoiceOption getModel();
		void setDown(boolean down);
		boolean isDown();
		void setWrongStyle();
		void setCorrectStyle();
		void resetStyles();
		void setEventBus(EventBus eventBus);
	}
	
	public interface IDisplay extends IModuleView{
		public List<IOptionDisplay> getOptions();
		public void setEnabled(boolean b);
		public void addListener(IOptionListener listener);
		public Element getElement();
	}
	
	private IDisplay view;
	private ChoiceModel module;
	private IPlayerServices playerServices;
	private boolean isDisabled;
	private JavaScriptObject	jsObject;
	
	
	public ChoicePresenter(ChoiceModel module, IPlayerServices services){
	
		this.module = module;
		this.playerServices = services;
		isDisabled = module.isDisabled();

		connectHandlers();
	}

	
	private void connectHandlers() {
		
		if(playerServices != null){
		
			playerServices.getEventBus().addHandler(ShowErrorsEvent.TYPE, 
					new ShowErrorsEvent.Handler() {
						public void onShowErrors(ShowErrorsEvent event) {
							setShowErrorsMode();
						}
					});

			playerServices.getEventBus().addHandler(WorkModeEvent.TYPE, 
					new WorkModeEvent.Handler() {
						public void onWorkMode(WorkModeEvent event) {
							setWorkMode();
						}
					});

			playerServices.getEventBus().addHandler(ResetPageEvent.TYPE, 
					new ResetPageEvent.Handler() {
						public void onResetPage(ResetPageEvent event) {
							reset();
						}
					});
		}
	}
	
	
	private void setShowErrorsMode() {

		for(IOptionDisplay optionView : view.getOptions()){
			ChoiceOption option = optionView.getModel();
			if(optionView.isDown()){
				if(option.getValue() > 0){
					optionView.setCorrectStyle();
				}
				else{
					optionView.setWrongStyle();
				}
			}
			else{
				if(option.getValue() > 0){
					optionView.setWrongStyle();
				}
				else{
					optionView.setCorrectStyle();
				}
			}
		}

		view.setEnabled(false);
	}	
	
	private void setWorkMode() {

		for(IOptionDisplay optionView : view.getOptions()){
			optionView.resetStyles();
		}
		
		view.setEnabled(!isDisabled);
	}	
	
	
	private void reset() {

		for(IOptionDisplay optionView : view.getOptions()){
			optionView.resetStyles();
			optionView.setDown(false);
		}
		
		isDisabled = module.isDisabled();
		view.setEnabled(!isDisabled);
		saveScore();
	}


	@Override
	public String getSerialId() {
		return module.getId();
	}

	@Override
	public String getState() {

		IJsonServices json = playerServices.getJsonServices();
		HashMap<String, String> state = new HashMap<String, String>();
		String optionState = "";
		
		for(IOptionDisplay option : view.getOptions()){
			if(option.isDown()){
				optionState += "1";
			}
			else{
				optionState += "0";
			}
		}
		
		state.put("options", optionState);
		state.put("isDisabled", Boolean.toString(isDisabled));
		return json.toJSONString(state);
	}

	
	@Override
	public void setState(String stateObj) {

		IJsonServices json = playerServices.getJsonServices();
		HashMap<String, String> state = json.decodeHashMap(stateObj);
		if(state.containsKey("options")){
			String optionState = state.get("options");
			int index = 0;
			for(IOptionDisplay option : view.getOptions()){
				
				if(optionState.length() < index+1){
					break;
				}
				
				boolean value = (optionState.charAt(index) == '1');
	
				if(value){
					option.setDown(true);
				}
				else{
					option.setDown(false);
				}
				
				index++;
			}
		}
		if(state.containsKey("isDisabled")){
			isDisabled = Boolean.parseBoolean(state.get("isDisabled"));
			if(isDisabled){
				disable();
			}
			else{
				enable();
			}
		}
		
	}


	private void enable() {
		isDisabled = false;
		view.setEnabled(true);
	}


	private void disable() {
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
			
			valueEvent = new ValueChangedEvent(module.getId(), id, "allOK", score);
			playerServices.getEventBus().fireEvent(valueEvent);
		}
	}

	
	// ------------------------------------------------------------------------
	// IActivity
	// ------------------------------------------------------------------------
	@Override
	public int getErrorCount() {

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
		if(module.isActivity()) return module.getMaxScore();
		else return 0;
	}

	@Override
	public int getScore() {
		
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
	public String executeCommand(String commandName, List<IType> _) {
		
		if(commandName.compareTo("enable") == 0){
			enable();
		}
		else if(commandName.compareTo("disable") == 0){
			disable();
		}
		
		return "";
	}


	@Override
	public String getName() {
		return module.getId();
	}

	
	public JavaScriptObject getAsJavaScript(){
		
		if(jsObject == null){
			jsObject = initJSObject(this);
		}

		return jsObject;
	}

	
	private native JavaScriptObject initJSObject(ChoicePresenter x) /*-{
	
		var presenter = function(){}
			
		presenter.disable = function(){ 
			x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::disable()();
		}
			
		presenter.enable = function(){ 
			x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::enable()();
		}
		presenter.getView = function() { 
			return x.@com.lorepo.icplayer.client.module.choice.ChoicePresenter::getView()();
		}
		
		return presenter;
	}-*/;
	
	private Element getView(){
		return view.getElement();
	}
}
