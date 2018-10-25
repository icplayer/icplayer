package com.lorepo.icplayer.client.module.addon;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.NativeEvent;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.Element;
import com.lorepo.icf.properties.IAudioProperty;
import com.lorepo.icf.properties.IEditableSelectProperty;
import com.lorepo.icf.properties.IFileProperty;
import com.lorepo.icf.properties.IHtmlProperty;
import com.lorepo.icf.properties.IImageProperty;
import com.lorepo.icf.properties.IListProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icf.properties.IStaticListProperty;
import com.lorepo.icf.properties.IStaticRowProperty;
import com.lorepo.icf.properties.IVideoProperty;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.IWCAGPresenter;
import com.lorepo.icplayer.client.module.addon.param.IAddonParam;
import com.lorepo.icplayer.client.module.api.IActivity;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent;
import com.lorepo.icplayer.client.module.api.player.IAddonDescriptor;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.page.PageController;


public class AddonPresenter implements IPresenter, IActivity, IStateful, ICommandReceiver, IWCAGPresenter, IWCAG, IWCAGModuleView {

	public interface IDisplay extends IModuleView{
		public Element getElement();
		public void setViewHTML(String viewHTML);
	}

	private AddonModel model;
	private JavaScriptObject jsObject;
	private IPlayerServices services;
	private IDisplay view;
	private IAddonDescriptor addonDescriptor;
	private static Set<String> buttonAddons = new HashSet<String>(Arrays.asList("single_state_button", "double_state_button", "show_answers", "limited_show_answers", "text_identification", "image_identification"));
	
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
	}
	
	private native void onKeyDown(JavaScriptObject obj, int keyCode, boolean isShiftDown, NativeEvent originalEvent) /*-{
		try{
			if(obj.keyboardController !== undefined && obj.keyboardController !== null) {
				obj.keyboardController(parseInt(keyCode, 10), isShiftDown, originalEvent);
			}
		}
		catch(err){
			console.log("err in activate" + err);
	  	}	
	}-*/;
	
	private native boolean haveWCAGSupport(JavaScriptObject obj) /*-{
		return (obj.keyboardController !== undefined && obj.keyboardController !== null);
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
		if (addonDescriptor != null) {
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
	
	// setting tabindex property according to editor preferences
	public void setProperTabindexValue (AddonModel model) {
		for (int i = 0; i < model.getPropertyCount(); i = i + 1 ) {
			if(model.getProperty(i).getName().equals("Is Tabindex Enabled")) {
				model.getProperty(i).setValue(model.isTabindexEnabled() ? "True" : "False");
			}
		}
	}
	
	public void run() {
		jsObject = initJavaScript("Addon" + model.getAddonId() + "_create");

		if(jsObject != null){
			setProperTabindexValue(model);
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
			} else if (property instanceof IStaticListProperty) {
				IStaticListProperty listProperty = (IStaticListProperty) property;
				JavaScriptObject listModel = JavaScriptObject.createObject();
				for(int j = 0; j < listProperty.getChildrenCount(); j++){
					IPropertyProvider child = listProperty.getChild(j);
					JavaScriptObject childModel = createModel(child);
					String name = this.getStringFromJSObject(childModel, "name");
					JavaScriptObject object = this.getObjectFromJSObject(childModel, "value");
					this.addPropertyToJSObject(listModel, name, object);
				}
				addPropertyToJSObject(jsModel, property.getName(), listModel);
			} else if (property instanceof IStaticRowProperty) {
				jsModel = JavaScriptObject.createObject();
				IStaticRowProperty listProperty = (IStaticRowProperty) property;
				JavaScriptObject listModel = JavaScriptObject.createObject();
				for(int j = 0; j < listProperty.getChildrenCount(); j++){
					if (listProperty.getChild(j).getPropertyCount() > 0) {
						addPropertyToModel(listModel,listProperty.getChild(j).getProperty(0));
					}
				}
				addPropertyToJSObject(jsModel, "value", listModel);
				addPropertyToJSObject(jsModel, "name", property.getName());
			} else if (property instanceof IEditableSelectProperty) {
				IEditableSelectProperty castedProperty = (IEditableSelectProperty)property;
				JavaScriptObject editableSelectModel = JavaScriptObject.createObject();
				addPropertyToJSObject(editableSelectModel, "value", castedProperty.getChild(castedProperty.getSelectedIndex()).getValue());
				addPropertyToJSObject(editableSelectModel, "name", castedProperty.getChild(castedProperty.getSelectedIndex()).getName());
				addPropertyToJSObject(jsModel, property.getName(), editableSelectModel);
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
		addPropertyToJSObject(jsModel, property.getName(), value);
	}
	
	private native String getStringFromJSObject (JavaScriptObject model, String name)  /*-{
		return model[name];
	}-*/; 
	
	private native JavaScriptObject getObjectFromJSObject (JavaScriptObject model, String name)  /*-{
		return model[name];
	}-*/; 
	
	private native void addPropertyToJSObject(JavaScriptObject model, String name, String value)  /*-{
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
	
	public JavaScriptObject getAsJavaScript(){
		return jsObject;
	}

	@Override
	public IWCAG getWCAGController() {
		return this;
	}

	private boolean isWCAGOn() {
		return services!=null && services.isWCAGOn();
	}
	
	@Override
	public void selectAsActive(String className) {
		this.view.getElement().addClassName(className);
		
		if ("ic_selected_module" == className && !services.isWCAGOn()) {
			this.view.getElement().focus();
		}
	}

	@Override
	public void deselectAsActive(String className) {
		this.view.getElement().removeClassName(className);
		if ("ic_selected_module" == className && !services.isWCAGOn()) {
			this.view.getElement().blur();
		}
	}

	@Override
	public boolean isSelectable(boolean isTextToSpeechOn) {
		boolean isVisible = this.model.isVisible();
		return (isTextToSpeechOn || this.haveWCAGSupport(this.jsObject)) && isVisible && !isDisabled();
	}
	
	@Override
	public void enter(KeyDownEvent event, boolean isExiting) {
		this.onKeyDown(this.jsObject, KeyCodes.KEY_ENTER, isExiting, event.getNativeEvent());
	}

	@Override
	public void space(KeyDownEvent event) {
		this.onKeyDown(this.jsObject, 32, event.isShiftKeyDown(), event.getNativeEvent());
	}

	@Override
	public void tab(KeyDownEvent event) {
		this.onKeyDown(this.jsObject, KeyCodes.KEY_TAB, event.isShiftKeyDown(), event.getNativeEvent());
	}

	@Override
	public void left(KeyDownEvent event) {
		this.onKeyDown(this.jsObject, KeyCodes.KEY_LEFT, event.isShiftKeyDown(), event.getNativeEvent());
	}

	@Override
	public void right(KeyDownEvent event) {
		this.onKeyDown(this.jsObject, KeyCodes.KEY_RIGHT, event.isShiftKeyDown(), event.getNativeEvent());
	}

	@Override
	public void down(KeyDownEvent event) {
		this.onKeyDown(this.jsObject, KeyCodes.KEY_DOWN, event.isShiftKeyDown(), event.getNativeEvent());
	}

	@Override
	public void up(KeyDownEvent event) {
		this.onKeyDown(this.jsObject, KeyCodes.KEY_UP, event.isShiftKeyDown(), event.getNativeEvent());
	}

	@Override
	public void escape(KeyDownEvent event) {
		this.onKeyDown(this.jsObject, KeyCodes.KEY_ESCAPE, event.isShiftKeyDown(), event.getNativeEvent());
	}

	@Override
	public void customKeyCode(KeyDownEvent event) {
		this.onKeyDown(this.jsObject, event.getNativeKeyCode(), event.isShiftKeyDown(), event.getNativeEvent());
	}

	@Override
	public void shiftTab(KeyDownEvent event) {
		this.onKeyDown(this.jsObject, KeyCodes.KEY_TAB, true, event.getNativeEvent());
	}

	public boolean isButton() {
		if (buttonAddons.contains(this.model.getAddonId().toLowerCase())) {
			return true;
		}
		return false;
	}
	
	public static boolean isButton(String addonId){
		return buttonAddons.contains(addonId.toLowerCase());
	}

	public boolean isDisabled() {
		for (IAddonParam propetry : this.model.getParams()){
			String propertyName = propetry.getName(); 
			if (propertyName.equalsIgnoreCase("Is Disabled") ||
				propertyName.equalsIgnoreCase("IsDisabled") ||
				propertyName.equalsIgnoreCase("Disable")) {
					return propetry.getAsProperty().getValue().equalsIgnoreCase("true");
			}
		}
		return false;
	}

	@Override
	public void setPageController (PageController pc) {
		// this can be empty for addons
		this.setWCAGStatus(true);
	}

	@Override
	public void setWCAGStatus (boolean isWCAGOn) {
		setWCAGStatus(jsObject, addonDescriptor.getAddonId(), isWCAGOn);
	}

	private native void setWCAGStatus (JavaScriptObject obj, String addonId, boolean isWCAGOn) /*-{
		try {
			if(obj.setWCAGStatus != undefined) {
				obj.setWCAGStatus(isWCAGOn);
			}
		} catch(err) {
			alert("[" + addonId + "] Exception in setWCAGStatus(): \n" + err);
		}
	}-*/;
	
	@Override
	public String getLang () {
		return null;
	}
	
	public  boolean isEnterable () {
		return this.isEnterable(this.getAsJavaScript());
	}
	
	public native boolean isEnterable (JavaScriptObject obj) /*-{
		if (obj !== undefined && obj !== null && obj.hasOwnProperty('isEnterable')) {
			return obj.isEnterable();
		};
		return true;
	}-*/;
	
	public  boolean isDeactivationBlocked () {
		return this.isDeactivationBlocked(this.getAsJavaScript());
	}
	
	public native boolean isDeactivationBlocked (JavaScriptObject obj) /*-{
		if (obj !== undefined && obj !== null && obj.hasOwnProperty('isDeactivationBlocked')) {
			return obj.isDeactivationBlocked();
		};
		return false;
	}-*/;

	@Override
	public void onEventReceived(String eventName, HashMap<String, String> data) {
		
	}
}
