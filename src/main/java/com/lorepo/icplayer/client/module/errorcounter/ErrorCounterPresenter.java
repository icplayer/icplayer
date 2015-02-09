package com.lorepo.icplayer.client.module.errorcounter;

import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.PageScore;

public class ErrorCounterPresenter implements IPresenter, ICommandReceiver, IStateful {

	public interface IDisplay extends IModuleView{
		public void setData(int errorCount, int mistakeCount);
		public void show();
		public void hide();
		public Element getElement();
	}
	
	
	private ErrorCounterModule module;
	private IDisplay view;
	private IPlayerServices playerServices;
	private JavaScriptObject jsObject;
	private boolean isVisible;
	
	
	public ErrorCounterPresenter(ErrorCounterModule module, IPlayerServices services){
	
		this.module = module;
		this.playerServices = services;
		this.isVisible = module.isVisible();
		
		connectHandlers();
	}


	private void updateDisplay() {
		IPlayerCommands pageService = playerServices.getCommands();
		PageScore pageScore = pageService.getCurrentPageScore();
		if (pageScore != null) {
			view.setData(pageScore.getErrorCount(), pageScore.getMistakeCount());
		}
	}


	private void connectHandlers() {
		if (playerServices == null) {
			return;			
		}
		
		if (!module.isRealTimeCalculation()) {
			playerServices.getEventBus().addHandler(ShowErrorsEvent.TYPE, 
					new ShowErrorsEvent.Handler() {
						
						@Override
						public void onShowErrors(ShowErrorsEvent event) {
							updateDisplay();
						}
					});
		}
		
		playerServices.getEventBus().addHandler(ResetPageEvent.TYPE, 
				new ResetPageEvent.Handler() {
					
					@Override
					public void onResetPage(ResetPageEvent event) {
						reset();
					}
				});

		if (module.isRealTimeCalculation()) {
			playerServices.getEventBus().addHandler(ValueChangedEvent.TYPE, 
					new ValueChangedEvent.Handler() {
						@Override
						public void onScoreChanged(ValueChangedEvent event) {
							playerServices.getCommands().getPageController().updateScore(true);
							updateDisplay();
						}
					});
		}
	}

	private void reset() {
		if (module.isVisible()) {
			show();
		} else {
			hide();
		}
		
		updateDisplay();
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
	
	public JavaScriptObject getAsJavaScript(){
		
		if(jsObject == null){
			jsObject = initJSObject(this);
		}

		return jsObject;
	}
	
	private native JavaScriptObject initJSObject(ErrorCounterPresenter x) /*-{
		var presenter = function() {};
	
		presenter.show = function() {
			x.@com.lorepo.icplayer.client.module.errorcounter.ErrorCounterPresenter::show()();
		}
	
		presenter.hide = function() {
			x.@com.lorepo.icplayer.client.module.errorcounter.ErrorCounterPresenter::hide()();
		}
		
		presenter.getView = function() {
			return x.@com.lorepo.icplayer.client.module.errorcounter.ErrorCounterPresenter::getView()();
		}
	
		return presenter;
	}-*/;
	
	private Element getView(){
		return view.getElement();
	}
	
	private void show(){
		isVisible = true;
		
		if(view != null) {
			view.show();
		}
	}
	
	
	private void hide(){
		isVisible = false;

		if(view != null) {
			view.hide();
		}
	}


	@Override
	public String getName() {
		return module.getId();
	}


	@Override
	public String executeCommand(String commandName, List<IType> _) {
		if (commandName.compareTo("show") == 0) {
			show();
		} else if (commandName.compareTo("hide") == 0) {
			hide();
		}
		
		return "";
	}


	@Override
	public String getSerialId() {
		return module.getId();
	}


	@Override
	public String getState() {
		HashMap<String, String> state = new HashMap<String, String>();
		IJsonServices json = playerServices.getJsonServices();
		
		state.put("isVisible", Boolean.toString(isVisible));
		
		return json.toJSONString(state);
	}


	@Override
	public void setState(String state) {
		if (state == null || state.equals("")) {
			return;
		}
		
		IJsonServices json = playerServices.getJsonServices();
		HashMap<String, String> decodedState = json.decodeHashMap(state);
		
		if (decodedState.containsKey("isVisible")) {
			this.isVisible = Boolean.parseBoolean(decodedState.get("isVisible"));
			
			if (this.isVisible) {
				show();
			} else {
				hide();
			}
		}
	}
}
