package com.lorepo.icplayer.client.module.choice;

import java.util.List;

import com.google.gwt.event.shared.EventBus;
import com.lorepo.icplayer.client.module.api.IActivity;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IScoreService;

public class ChoicePresenter implements IPresenter, IStateful, IOptionListener, IActivity{

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
	}
	
	private IDisplay view;
	private ChoiceModel module;
	private IPlayerServices playerServices;
	
	
	public ChoicePresenter(ChoiceModel module, IPlayerServices services){
	
		this.module = module;
		this.playerServices = services;

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
		
		view.setEnabled(true);
	}	
	
	
	private void reset() {

		for(IOptionDisplay optionView : view.getOptions()){
			optionView.resetStyles();
			optionView.setDown(false);
		}
		
		view.setEnabled(true);
		saveScore();
	}


	@Override
	public String getSerialId() {
		return module.getId();
	}

	@Override
	public String getState() {

		String state = "";
		
		for(IOptionDisplay option : view.getOptions()){
			if(option.isDown()){
				state += "1";
			}
			else{
				state += "0";
			}
		}
		
		return state;
	}

	
	@Override
	public void setState(String state) {

		int index = 0;
		for(IOptionDisplay option : view.getOptions()){
			
			if(state.length() < index+1){
				break;
			}
			
			boolean value = (state.charAt(index) == '1');

			if(value){
				option.setDown(true);
			}
			else{
				option.setDown(false);
			}
			
			index++;
		}
		
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
		for(IOptionDisplay optionView : view.getOptions()){
			
			if(optionView.isDown() && optionView.getModel().getValue() == 0){
				errors++;
			}
		}
		
		return errors;
	}


	@Override
	public int getMaxScore() {
		return module.getMaxScore();
	}

	@Override
	public int getScore() {
		
		int score = 0;
		for(IOptionDisplay optionView : view.getOptions()){
			if(optionView.isDown()){
				score += optionView.getModel().getValue();
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

}
