package com.lorepo.icplayer.client.module.errorcounter;

import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.PageScore;

public class ErrorCounterPresenter implements IPresenter{

	public interface IDisplay extends IModuleView{
		public void setData(int errorCount, int mistakeCount);
	}
	
	
	private ErrorCounterModule module;
	private IDisplay view;
	private IPlayerServices playerServices;
	
	
	public ErrorCounterPresenter(ErrorCounterModule module, IPlayerServices services){
	
		this.module = module;
		this.playerServices = services;
		
		connectHandlers();
	}


	private void updateDisplay() {
		
		IPlayerCommands pageService = playerServices.getCommands();
		PageScore pageScore = pageService.getCurrentPageScore();
		if(pageScore != null){
			view.setData(pageScore.getErrorCount(), pageScore.getMistakeCount());
		}
		
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


	@Override
	public void addView(IModuleView display) {
		
		if(display instanceof IDisplay){
			view = (IDisplay) display;
			updateDisplay();
		}
	}


	@Override
	public IModuleModel getModel() {
		return module;
	}
}
