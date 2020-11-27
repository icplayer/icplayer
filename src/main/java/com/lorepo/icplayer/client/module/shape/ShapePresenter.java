package com.lorepo.icplayer.client.module.shape;

import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

public class ShapePresenter implements IPresenter, IStateful, ICommandReceiver {

	public interface IDisplay extends IModuleView {
		public Element getElement();
		public void show();
		public void hide();
	}
	
	private IDisplay view;
	private ShapeModule model;
	private JavaScriptObject jsObject;
	private boolean isVisible;
	private IPlayerServices playerServices;
	
	public ShapePresenter(ShapeModule model, IPlayerServices services) {
		this.model = model;
		isVisible = model.isVisible();
		this.playerServices = services;
		
		connectHandlers();
	}
	
	private void connectHandlers() {
		
		playerServices.getEventBus().addHandler(ResetPageEvent.TYPE, 
			new ResetPageEvent.Handler() {
					
				@Override
				public void onResetPage(ResetPageEvent event) {
					reset(event.getIsOnlyWrongAnswers());
				}
		});
	}

	@Override
	public void addView(IModuleView view) {
		if (view instanceof IDisplay) {
			this.view = (IDisplay) view;
		}
	}

	@Override
	public IModuleModel getModel() {
		return model;
	}
	
	@Override
	public String executeCommand(String commandName, List<IType> args) {
		
		if(commandName.compareTo("show") == 0){
			show();
		}
		else if(commandName.compareTo("hide") == 0){
			hide();
		}
		
		return "";
	}
	
	public JavaScriptObject getAsJavaScript(){
		if (jsObject == null) {
			jsObject = initJSObject(this);
		}

		return jsObject;
	}

	private void jsOnEventReceived (String eventName, String jsonData) {
		this.onEventReceived(eventName, jsonData == null ? new HashMap<String, String>() : (HashMap<String, String>)JavaScriptUtils.jsonToMap(jsonData));
	}
	
	private native JavaScriptObject initJSObject(ShapePresenter x) /*-{
		var presenter = function(){}
			
		presenter.getView = function() { 
			return x.@com.lorepo.icplayer.client.module.shape.ShapePresenter::getView()();
		}
		
		presenter.show = function(){ 
			x.@com.lorepo.icplayer.client.module.shape.ShapePresenter::show()();
		}
		
		presenter.hide = function(){ 
			x.@com.lorepo.icplayer.client.module.shape.ShapePresenter::hide()();
		}
		
		presenter.onEventReceived = function (eventName, data) {
			x.@com.lorepo.icplayer.client.module.shape.ShapePresenter::jsOnEventReceived(Ljava/lang/String;Ljava/lang/String;)(eventName, JSON.stringify(data));
		};
		
		return presenter;
	}-*/;
	
	private Element getView(){
		return view.getElement();
	}

	
	private void show(){
		isVisible = true;
		if(view != null){
			view.show();
		}
	}
	
	
	private void hide(){
		isVisible = false;
		if(view != null){
			view.hide();
		}
	}
	
	@Override
	public String getState() {
		IJsonServices json = playerServices.getJsonServices();
		HashMap<String, String> state = new HashMap<String, String>();
		state.put("isVisible", Boolean.toString(isVisible));
		
		return json.toJSONString(state);
	}


	@Override
	public void setState(String stateObj) {
		if (stateObj == null || stateObj.equals("")) {
			return;
		}
		
		IJsonServices json = playerServices.getJsonServices();
		HashMap<String, String> state = json.decodeHashMap(stateObj);

		if (state.containsKey("isVisible")) {
			isVisible = Boolean.parseBoolean(state.get("isVisible"));
			if (isVisible) { 
				view.show();
			} else {
				view.hide();
			}
		}
	}

	@Override
	public String getName() {
		return model.getId();
	}

	@Override
	public String getSerialId() {
		return model.getId();
	}

	@Override
	public void reset(boolean isOnlyWrongAnswers) {
		if (model.isVisible()) {
			show();
		} else {
			hide();
		}
		
	}

	@Override
	public void setShowErrorsMode() {
		// Module is not an activity
	}

	@Override
	public void setWorkMode() {
        // Module is not an activity
	}

	@Override
	public void setDisabled(boolean value) {
		// Module is not an activity
	}

	@Override
	public boolean isDisabled() {
		return false;
	}

	@Override
	public void onEventReceived(String eventName, HashMap<String, String> data) {
		// TODO Auto-generated method stub
		
	}
}
