package com.lorepo.icplayer.client.module.image;

import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;


public class ImagePresenter implements IPresenter, ICommandReceiver, IStateful{

	public interface IDisplay extends IModuleView{
		public void show();
		public void hide();
	}
	
	private IDisplay view;
	private IPlayerServices playerServices;
	private ImageModule module;
	private JavaScriptObject	jsObject;
	private boolean isVisible;
	
	
	public ImagePresenter(ImageModule module, IPlayerServices services){

		this.module = module;
		this.playerServices = services;
		isVisible = module.isVisible();
		
		connectHandlers();
	}
	
	
	private void connectHandlers() {
		
		EventBus eventBus = playerServices.getEventBus();
		
		eventBus.addHandler(ResetPageEvent.TYPE, new ResetPageEvent.Handler() {
			public void onResetPage(ResetPageEvent event) {
				reset();
			}
		});
	}
	
	
	protected void reset() {

		isVisible = module.isVisible();
		if(view != null){
			if(module.isVisible()){
				view.show();
			}
			else{
				view.hide();
			}
		}
	}


	@Override
	public void addView(IModuleView display) {
		
		if(display instanceof IDisplay){
			this.view = (IDisplay) display;
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

	
	private native JavaScriptObject initJSObject(ImagePresenter x) /*-{
	
		var presenter = function(){}
			
		presenter.show = function(){ 
			x.@com.lorepo.icplayer.client.module.image.ImagePresenter::show()();
		}
			
		presenter.hide = function(){ 
			x.@com.lorepo.icplayer.client.module.image.ImagePresenter::hide()();
		}
			
		return presenter;
	}-*/;
	
	
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
	public String getName() {
		return module.getId();
	}


	@Override
	public String executeCommand(String commandName, List<String> params) {
		
		if(commandName.compareTo("show") == 0){
			show();
		}
		else if(commandName.compareTo("hide") == 0){
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
		return Boolean.toString(isVisible);
	}


	@Override
	public void setState(String state) {
		
		isVisible = Boolean.parseBoolean(state);
		if(!isVisible){
			view.hide();
		}
		else{
			view.show();
		}
	}


}
