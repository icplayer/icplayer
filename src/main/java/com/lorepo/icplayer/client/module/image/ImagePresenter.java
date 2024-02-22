package com.lorepo.icplayer.client.module.image;

import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.IButton;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGPresenter;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.page.KeyboardNavigationController;


public class ImagePresenter implements IPresenter, ICommandReceiver, IStateful, IWCAGPresenter, IButton{

	public interface IDisplay extends IModuleView{
		public void show();
		public void hide();
		public Element getElement();
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
				reset(event.getIsOnlyWrongAnswers());
			}
		});
	}
	
	@Override
	public void reset(boolean isOnlyWrongAnswers) {

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

	@Override
	public void setDisabled(boolean value) {

	}

	@Override
	public boolean isDisabled() {
		return false;
	}

	private void jsOnEventReceived (String eventName, String jsonData) {
		this.onEventReceived(eventName, jsonData == null ? new HashMap<String, String>() : (HashMap<String, String>)JavaScriptUtils.jsonToMap(jsonData));
	}
	
	private native JavaScriptObject initJSObject(ImagePresenter x) /*-{
	
		var presenter = function(){}
			
		presenter.show = function(){ 
			x.@com.lorepo.icplayer.client.module.image.ImagePresenter::show()();
		}
			
		presenter.hide = function(){ 
			x.@com.lorepo.icplayer.client.module.image.ImagePresenter::hide()();
		}
		presenter.getView = function() { 
			return x.@com.lorepo.icplayer.client.module.image.ImagePresenter::getView()();
		}
	
		presenter.onEventReceived = function (eventName, data) {
			x.@com.lorepo.icplayer.client.module.image.ImagePresenter::jsOnEventReceived(Ljava/lang/String;Ljava/lang/String;)(eventName, JSON.stringify(data));
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
	public String getName() {
		return module.getId();
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


	@Override
	public void setShowErrorsMode() {
		// Module is not an activity
	}

	@Override
	public void setWorkMode() {
		// Module is not an activity	
	}


	@Override
	public IWCAG getWCAGController() {
		return (IWCAG) this.view;
	}


	@Override
	public void selectAsActive(String className) {
		if(className != "ic_active_module") {
			this.view.getElement().addClassName(className);
		}
	}


	@Override
	public void deselectAsActive(String className) {
		this.view.getElement().removeClassName(className);
		
	}


	@Override
	public boolean isSelectable(boolean isTextToSpeechOn) {
		boolean isVisible = !this.view.getElement().getStyle().getVisibility().equals("hidden")
				&& !this.view.getElement().getStyle().getDisplay().equals("none") 
				&& !KeyboardNavigationController.isParentGroupDivHidden(this.getView());
		return (isTextToSpeechOn || haveStandaloneKeyboardNavigationSupport()) && isVisible;
	}
	
	@Override
	public boolean haveStandaloneKeyboardNavigationSupport() {
		return false;
	}

	@Override
	public void onEventReceived(String eventName, HashMap<String, String> data) {
		// TODO Auto-generated method stub
		
	}
}
