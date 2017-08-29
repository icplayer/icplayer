package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;


class CheckAnswersButton extends ExecutableButton {

	private IPlayerServices playerServices;
	private boolean checkAnswersModeOn = false;
	
	
	public CheckAnswersButton(IPlayerServices services){
	
		this.playerServices = services;
		setStyleName("ic_button_check");

		addClickHandler(new ClickHandler() {
			
			@Override
			public void onClick(ClickEvent event) {

				event.stopPropagation();
				event.preventDefault();
				execute();
			}
		});
		
		connectHandlers();
		
	}


	private void connectHandlers() {
		
		if(playerServices != null){
		
			playerServices.getEventBus().addHandler(ShowErrorsEvent.TYPE, 
					new ShowErrorsEvent.Handler() {
						
						@Override
						public void onShowErrors(ShowErrorsEvent event) {
							showErrorsMode();
						}
					});

			playerServices.getEventBus().addHandler(ResetPageEvent.TYPE, 
					new ResetPageEvent.Handler() {
						
						@Override
						public void onResetPage(ResetPageEvent event) {
							reset();
						}
					});
		}
	}

	
	private void showErrorsMode() {
		checkAnswersModeOn = true;
		setStyleName("ic_button_uncheck");
		setTitle("");
	}


	private void reset() {
		checkAnswersModeOn = false;
		setStyleName("ic_button_check");
	}


	public void execute() {
		this.checkAnswersModeOn = !this.checkAnswersModeOn;
		
		if(this.checkAnswersModeOn) {
			setStyleName("ic_button_uncheck");
			setTitle("");
			this.playerServices.getCommands().checkAnswers();
		}
		else{
			setStyleName("ic_button_check");
			this.playerServices.getCommands().uncheckAnswers();
		}
	}
}
