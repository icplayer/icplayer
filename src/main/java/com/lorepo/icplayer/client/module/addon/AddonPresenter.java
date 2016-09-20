package com.lorepo.icplayer.client.module.addon;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.Element;
import com.lorepo.icf.properties.IAudioProperty;
import com.lorepo.icf.properties.IFileProperty;
import com.lorepo.icf.properties.IHtmlProperty;
import com.lorepo.icf.properties.IImageProperty;
import com.lorepo.icf.properties.IListProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.properties.IStaticMapProperty;
import com.lorepo.icf.properties.IStaticRowProperty;
import com.lorepo.icf.properties.IVideoProperty;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icplayer.client.module.api.IActivity;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.ModuleActivatedEvent;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent;
import com.lorepo.icplayer.client.module.api.player.IAddonDescriptor;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

public class AddonPresenter implements IPresenter, IActivity, IStateful, ICommandReceiver{

	public interface IDisplay extends IModuleView{
		public Element getElement();
		public void setViewHTML(String viewHTML);
	}
	
	
	private AddonModel model;
	private JavaScriptObject	jsObject;
	private IPlayerServices services;
	private IDisplay view;
	private IAddonDescriptor	addonDescriptor;
	
	
	public AddonPresenter(AddonModel model, IPlayerServices services){

		this.model = model;
		this.services = services;
		this.addonDescriptor = services.getModel().getAddonDescriptor(model.getAddonId());
		connectHandlers();
	}


	private void connectHandlers() {

		EventBus eventBus = services.getEventBus();
		eventBus.addHandler(ShowErrorsEvent.TYPE, new ShowErrorsEvent.Handler() {
			public void onShowErrors(ShowErrorsEvent event) {
				setShowErrorsMode();
			}
		});

		eventBus.addHandler(WorkModeEvent.TYPE, new WorkModeEvent.Handler() {
			public void onWorkMode(WorkModeEvent event) {
				setWorkMode();
			}
		});

		eventBus.addHandler(ResetPageEvent.TYPE, new ResetPageEvent.Handler() {
			public void onResetPage(ResetPageEvent event) {
				reset();
			}
		});
		
		eventBus.addHandler(ModuleActivatedEvent.TYPE, new ModuleActivatedEvent.Handler() {
			public void onActivated(ModuleActivatedEvent event) {
				activate(event.moduleName, event.moduleStatus);
			}
		});
	}
	
	private void activate(String moduleName, String moduleStatus) {
		if (moduleName.equals(model.getId())) {
			activate(jsObject, moduleName, moduleStatus);
		}
	}
	
	private native void activate(JavaScriptObject obj, String moduleName, String keyCode) /*-{
		try{
			if(obj.keyboardController != undefined) {
				obj.keyboardController(parseInt(keyCode, 10));
			}
		}
		catch(err){
			console.log("err in activate" + err);
	  	}	
	}-*/;
	
	@Override
	public void setShowErrorsMode() {
		setShowErrorsMode(jsObject, addonDescriptor.getAddonId());
	}

	private native void setShowErrorsMode(JavaScriptObject obj, String addonId) /*-{
	
		try{
			if(obj.setShowErrorsMode != undefined){
				obj.setShowErrorsMode();
			}
		}
		catch(err){
	  		alert("[" + addonId + "] Exception in setShowErrorsMode(): \n" + err);
	  	}		
	}-*/;

	@Override
	public void setWorkMode() {
		setWorkMode(jsObject, addonDescriptor.getAddonId());
	}
	
	private native void setWorkMode(JavaScriptObject obj, String addonId) /*-{
	
		try{
			if(obj.setWorkMode != undefined){
				obj.setWorkMode();
			}
		}
		catch(err){
	  		alert("[" + addonId + "] Exception in setWorkMode(): \n" + err);
	  	}		
	}-*/;
	
	@Override
	public void reset() {
		reset(jsObject, addonDescriptor.getAddonId());
	}

	private native void reset(JavaScriptObject obj, String addonId) /*-{
	
		try{
			if(obj.reset != undefined){
				obj.reset();
			}
		}
		catch(err){
	  		alert("[" + addonId + "] Exception in reset(): \n" + err);
	  	}		
	}-*/;
	
	
	
	public void startAddon() {
		
		if(addonDescriptor != null){
			view.setViewHTML(addonDescriptor.getViewHTML());
			run();
		}
	}


	@Override
	public void addView(IModuleView view) {
		
		if(view instanceof IDisplay){
			this.view = (IDisplay) view;
			startAddon();
		}
	}


	@Override
	public int getErrorCount() {
		return getErrorCount(jsObject, addonDescriptor.getAddonId());
	}

	private native int getErrorCount(JavaScriptObject obj, String addonId) /*-{
	
		try{
			if(obj.getErrorCount != undefined){
				return obj.getErrorCount();
			}
		}
		catch(err){
	  		alert("[" + addonId + "] Exception in getErrorCount(): \n" + err);
	  	}		
		
		return 0;
	}-*/;

	
	@Override
	public int getMaxScore() {
		return getMaxScore(jsObject, addonDescriptor.getAddonId());
	}

	private native int getMaxScore(JavaScriptObject obj, String addonId) /*-{
	
		try{
			if(obj.getMaxScore != undefined){
				return obj.getMaxScore();
			}
		}
		catch(err){
	  		alert("[" + addonId + "] Exception in getMaxScore(): \n" + err);
	  	}		
		
		return 0;
	}-*/;
	
	
	@Override
	public int getScore() {
		return getScore(jsObject, addonDescriptor.getAddonId());
	}

	private native int getScore(JavaScriptObject obj, String addonId) /*-{
	
		try{
			if(obj.getScore != undefined){
				return obj.getScore();
			}
		}
		catch(err){
	  		alert("[" + addonId + "] Exception in getScore(): \n" + err + addonId);
	  	}		
		
		return 0;
	}-*/;
	
	
	public void run() {
		jsObject = initJavaScript("Addon" + model.getAddonId() + "_create");

		if(jsObject != null){
			JavaScriptObject jsModel = createModel(model);
			setPlayerController(jsObject, services.getAsJSObject());
			run(jsObject, view.getElement(), jsModel, model.getAddonId());
		}
	}

	private JavaScriptObject createModel(IPropertyProvider provider) {

		JavaScriptObject jsModel = JavaScriptObject.createArray();
		for(int i=0; i < provider.getPropertyCount(); i++){
			IProperty property = provider.getProperty(i);
			if(property instanceof IListProperty){
				IListProperty listProperty = (IListProperty) property;
				JavaScriptObject listModel = JavaScriptObject.createArray();
				for(int j = 0; j < listProperty.getChildrenCount(); j++){
					JavaScriptObject providerModel = createModel(listProperty.getChild(j));
					addToJSArray(listModel, providerModel);
				}
				addPropertyToJSObject(jsModel, property.getName(), listModel);
			} else if (property instanceof IStaticMapProperty) {
				IStaticMapProperty listProperty = (IStaticMapProperty) property;
				JavaScriptObject listModel = JavaScriptObject.createObject();
				for(int j = 0; j < listProperty.getChildrenCount(); j++){
					IPropertyProvider child = listProperty.getChild(j);
					JavaScriptObject childModel = createModel(child);
					addPropertyToJSObject(listModel, child.getProperty(0).getName(), childModel);
				}
				addPropertyToJSObject(jsModel, property.getName(), listModel);
			} else if (property instanceof IStaticRowProperty) {
				IStaticRowProperty listProperty = (IStaticRowProperty) property;
				for(int j = 0; j < listProperty.getChildrenCount(); j++){
					addPropertyToModel(jsModel,listProperty.getChild(j).getProperty(0));
				}
			} else{
				addPropertyToModel(jsModel, property);
			}
		}
		return jsModel;
	}


	private void addPropertyToModel(JavaScriptObject jsModel, IProperty property){
		
		String value = property.getValue();
		
		if(	property instanceof IAudioProperty || 
			property instanceof IImageProperty ||
			property instanceof IVideoProperty ||
			property instanceof IFileProperty)
		{
			value = URLUtils.resolveURL(model.getBaseURL(), value);
		}
		else if(property instanceof IHtmlProperty){
			value = StringUtils.updateLinks(value, model.getBaseURL());
		}
		addPropertyToJSArray(jsModel, property.getName(), value);
	}
	
	
	private native void addPropertyToJSArray(JavaScriptObject model, String name, String value)  /*-{
		model[name] = value;
	}-*/; 


	private native void addPropertyToJSObject(JavaScriptObject model, String name, JavaScriptObject obj)  /*-{
		model[name] = obj;
	}-*/; 

	private native void addToJSArray(JavaScriptObject model, JavaScriptObject obj)  /*-{
		model.push(obj);
	}-*/; 



	private native JavaScriptObject initJavaScript(String name) /*-{
		if($wnd.window[name] == null){
			return function(){};
		}
		
		return $wnd.window[name]();
	}-*/; 

	
	private native void setPlayerController(JavaScriptObject obj, JavaScriptObject controller ) /*-{
	
		if(obj.setPlayerController != undefined){
			return obj.setPlayerController(controller);
		}
	}-*/;
	
	
	private native void run(JavaScriptObject obj, Element element, JavaScriptObject model, String addonId ) /*-{

		try{
			obj.getView = function(){return element};
			obj.run(element, model);
		}
		catch(err){
  			console.log("Can't load addon: " + addonId + "\n" + err);
  		}		
	}-*/;


	@Override
	public String getSerialId() {
		return model.getId();
	}


	@Override
	public String getState() {
		String state = getState(jsObject, addonDescriptor.getAddonId());
		return state;
	}

	private native String getState(JavaScriptObject obj, String addonId) /*-{
	
		try{
			if(obj.getState != undefined){
				return obj.getState();
			}
		}
		catch(err){
	  		alert("[" + addonId + "] Exception in getState(): \n" + err);
	  	}

		return "";
	}-*/;

	@Override
	public void setState(String state) {
		setState(jsObject, state, addonDescriptor.getAddonId());
	}

	private native void setState(JavaScriptObject obj, String state, String addonId) /*-{
		try {
			if(obj.setState != undefined) {
				obj.setState(state);
			}
		} catch(err) {
	  		alert("[" + addonId + "] Exception in setState(): \n" + err);
	  	}
	}-*/;


	private native String executeCommand(JavaScriptObject obj, String name, List<String> params) /*-{
	
		if(obj.executeCommand != undefined){
			
			values = [];
			for(i = 0; i < params.@java.util.List::size()(); i++){
				values.push(params.@java.util.List::get(I)(i));
			}
			return obj.executeCommand(name, values);
		}
	}-*/;


	@Override
	public String getName() {
		return model.getId();
	}


	@Override
	public String executeCommand(String commandName, List<IType> params) {

		List<String> values = new ArrayList<String>();
		for(IType param : params){
			values.add(param.asString());
		}
		return executeCommand(jsObject, commandName, values);
	}


	@Override
	public IModuleModel getModel() {
		return model;
	}

	
	public JavaScriptObject getJavaScriptObject(){
		return jsObject;
	}
}
