package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;


class CheckAnswersButton extends PushButton implements IWCAG {

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
	
	@Override
	public void enter(boolean isExiting) {
		if (!isExiting) {
			this.execute();
		}
	}

	@Override
	public void space() {
	}

	@Override
	public void tab() {
	}

	@Override
	public void left() {
	}

	@Override
	public void right() {
	}

	@Override
	public void down() {
	}

	@Override
	public void up() {
	}

	@Override
	public void escape() {
	}


	@Override
	public void customKeyCode(KeyDownEvent event) {
	}

}
