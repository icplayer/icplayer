package com.lorepo.icplayer.client.module.pageprogress;

import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.PageScore;

public class PageProgressPresenter implements IPresenter, IStateful{

	public interface IDisplay extends IModuleView{
		public void setData(int value);
	}
	
	private PageProgressModule module;
	private IDisplay view;
	private IPlayerServices playerServices;
	private int score = 0;
	
	
	public PageProgressPresenter(PageProgressModule module, IPlayerServices services){
	
		this.module = module;
		this.playerServices = services;
		
		connectHandlers();
	}

	
	private void updateDisplay() {
		
		view.setData(score);
	}
	
	
	private void connectHandlers() {
		
		if(playerServices != null){
		
			playerServices.getEventBus().addHandler(ShowErrorsEvent.TYPE, 
					new ShowErrorsEvent.Handler() {
						
						@Override
						public void onShowErrors(ShowErrorsEvent event) {
							updateScore();
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
	
	
	private void updateScore() {

		PageScore pageScore = playerServices.getCommands().getCurrentPageScore();
		score = pageScore.getPercentageScore();
		updateDisplay();
	}
	

	private void reset() {
		score = 0;
		updateDisplay();
	}
	

	
	@Override
	public String getSerialId() {
		return module.getId();
	}


	@Override
	public String getState() {
		return Integer.toString(score);
	}


	@Override
	public void setState(String stateObj) {

		Integer state = Integer.parseInt(stateObj);
		score = state.intValue();
		updateDisplay();
	}


	@Override
	public void addView(IModuleView display) {
		
		if(display instanceof IDisplay){
			this.view = (IDisplay) display;
			updateDisplay();
		}
	}


	@Override
	public IModuleModel getModel() {
		return module;
	}
}
