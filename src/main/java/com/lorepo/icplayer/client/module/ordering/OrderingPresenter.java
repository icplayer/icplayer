package com.lorepo.icplayer.client.module.ordering;

import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
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
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

public class OrderingPresenter implements IPresenter, IStateful, IActivity, ICommandReceiver {

	public interface IDisplay extends IModuleView{

		void addReorderListener(IReorderListener listener);
	}
	
	private OrderingModule	module;
	private IPlayerServices playerServices;
	private OrderingView view;
	private JavaScriptObject jsObject;
	private boolean isSolved = false;
	
	
	
	public OrderingPresenter(OrderingModule module, IPlayerServices services){
		
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
							setShowErrorsMode();
						}
					});

			playerServices.getEventBus().addHandler(WorkModeEvent.TYPE, 
					new WorkModeEvent.Handler() {
						
						@Override
						public void onWorkMode(WorkModeEvent event) {
							setWorkMode();
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
	
	@Override
	public String getSerialId() {
		return module.getId();
	}

	@Override
	public String getState() {

		String state = "";
		
		if(view != null){
			state = view.getState() + "@" + isSolved;
		}

		return state;
	}

	@Override
	public void setState(String stateObj) {

		String[] tokens = stateObj.split("@");
		if(view != null && tokens.length == 2){
			view.setState(tokens[0]);
			isSolved = Boolean.parseBoolean(tokens[1]);
		}
	}
	
	// ------------------------------------------------------------------------
	// IActivity
	// ------------------------------------------------------------------------
	@Override
	public int getErrorCount() {

		int errors = 0;
		if(view != null && isSolved && module.isActivity()){
			errors = view.getErrorCount();
		}
		
		return errors;
	}

	
	private void setShowErrorsMode() {

		isSolved = true;
		if(view != null){
			view.setShowErrorsMode();
		}
	}


	private void setWorkMode() {

		if(view != null){
			view.setWorkMode();
		}
	}


	private void reset() {

		isSolved = true;
		if(view != null){
			view.reset();
		}
	}


	@Override
	public int getMaxScore() {
		if(module.isActivity()){
			return module.getMaxScore();
		}
		else{
			return 0;
		}
	}


	public int getScore() {

		if(module.isActivity()){
			return getMaxScore()-view.getErrorCount();
		}
		else{
			return 0;
		}
	}

	
	@Override
	public void addView(IModuleView view) {

		if(view instanceof OrderingView){
			this.view = (OrderingView) view;
			this.view.addReorderListener(new IReorderListener() {
				
				@Override
				public void onItemMoved(int sourceIndex, int destIndex) {
					onValueChanged(sourceIndex, destIndex);
				}
			});
		}
	}


	@Override	
	public IModuleModel getModel() {
		return module;
	}
	
	public JavaScriptObject getAsJavaScript(){
		
		if(jsObject == null){
			jsObject = initJSObject(this);
		}

		return jsObject;
	}
	
	private native JavaScriptObject initJSObject(OrderingPresenter x) /*-{
		var presenter = function(){}
	
		presenter.isAllOK = function() {
			return x.@com.lorepo.icplayer.client.module.ordering.OrderingPresenter::isAllOK()();
		};
		
		presenter.isAttempted = function() {
			return x.@com.lorepo.icplayer.client.module.ordering.OrderingPresenter::isAttempted()();
		};
		
		return presenter;
	}-*/;
	

	private void onValueChanged(int sourceIndex, int destIndex) {

		isSolved = true;
		String id = Integer.toString(sourceIndex+1);
		String newValue = Integer.toString(destIndex+1);
		String score = Integer.toString(getScore());
		ValueChangedEvent valueEvent = new ValueChangedEvent(module.getId(), id, newValue, score);
		playerServices.getEventBus().fireEvent(valueEvent);
	}
	
	public boolean isAllOK() {
		return getScore() == getMaxScore() && getErrorCount() == 0;
	}


	@Override
	public String getName() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public String executeCommand(String commandName, List<IType> params) {
		if(commandName.compareTo("isallok") == 0){
            return String.valueOf(isAllOK());
        }
		
		return "";
	}
	
	private boolean isAttempted() {
		return view.getInitialOrder() != view.getState();
	}
}
