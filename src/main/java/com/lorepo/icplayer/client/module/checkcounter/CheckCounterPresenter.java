package com.lorepo.icplayer.client.module.checkcounter;

import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

public class CheckCounterPresenter implements IPresenter, IStateful {

	public interface IDisplay extends IModuleView {
		public void setData(int value);
	}
	
	private CheckCounterModule module;
	private IDisplay view;
	private IPlayerServices playerServices;
	private int checkCount = 0;
	
	public CheckCounterPresenter(CheckCounterModule module, IPlayerServices services) {
		this.module = module;
		this.playerServices = services;
		
		connectHandlers();
	}
	
	private void connectHandlers() {
		if (playerServices != null) {
			playerServices.getEventBus().addHandler(ShowErrorsEvent.TYPE, 
					new ShowErrorsEvent.Handler() {
						@Override
						public void onShowErrors(ShowErrorsEvent event) {
							updateCounter();
						}
					});
		}
	}

	private void updateCounter() {
		checkCount ++;
		updateDisplay();
	}

	public void updateDisplay() {
		view.setData(checkCount);
	}
	
	@Override
	public String getSerialId() {
		return module.getId();
	}

	@Override
	public String getState() {
		return Integer.toString(checkCount);
	}

	@Override
	public void setState(String state) {
		checkCount = Integer.parseInt(state);
		updateDisplay();
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
