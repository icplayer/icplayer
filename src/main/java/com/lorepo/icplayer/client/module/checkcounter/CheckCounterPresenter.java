package com.lorepo.icplayer.client.module.checkcounter;

import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.PageScore;

public class CheckCounterPresenter implements IPresenter{

	public interface IDisplay extends IModuleView {
		public void setData(int value);
	}
	
	private CheckCounterModule module;
	private IDisplay view;
	private IPlayerServices playerServices;
	
	public CheckCounterPresenter(CheckCounterModule module, IPlayerServices services) {
		this.module = module;
		this.playerServices = services;
		
		connectHandlers();
	}
	
	private void connectHandlers() {
		if(playerServices != null){
			
			playerServices.getEventBus().addHandler(ShowErrorsEvent.TYPE, 
					new ShowErrorsEvent.Handler() {
						
						@Override
						public void onShowErrors(ShowErrorsEvent event) {
							updateDisplay();
						}
					});

			playerServices.getEventBus().addHandler(ResetPageEvent.TYPE, 
					new ResetPageEvent.Handler() {
						
						@Override
						public void onResetPage(ResetPageEvent event) {
							updateDisplay();
						}
					});
		}
	}

	public void updateDisplay() {
		IPlayerCommands pageService = playerServices.getCommands();
		PageScore pageScore = pageService.getCurrentPageScore();
		if(pageScore != null){
			view.setData(pageScore.getCheckCount());
		}		
	}
	
	@Override
	public void addView(IModuleView view) {
		if(view instanceof IDisplay){
			this.view = (IDisplay) view;
			updateDisplay();
		}
	}

	@Override
	public IModuleModel getModel() {
		return module;
	}
}
