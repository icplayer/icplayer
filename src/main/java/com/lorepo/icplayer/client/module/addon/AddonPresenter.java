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
import com.lorepo.icf.properties.IScriptProperty;
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
import com.lorepo.icplayer.client.content.services.PlayerEventBusWrapper;
import com.lorepo.icplayer.client.metadata.*;
import com.lorepo.icplayer.client.module.IOpenEndedContentPresenter;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGModuleView;
import com.lorepo.icplayer.client.module.IWCAGPresenter;
import com.lorepo.icplayer.client.module.addon.param.IAddonParam;
import com.lorepo.icplayer.client.module.api.*;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent;
import com.lorepo.icplayer.client.module.api.player.IAddonDescriptor;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.page.KeyboardNavigationController;
import com.lorepo.icplayer.client.page.PageController;


public class AddonPresenter implements IPresenter, IActivity, IStateful, ICommandReceiver, IWCAGPresenter, IWCAG, IWCAGModuleView, IGradualShowAnswersPresenter, IOpenEndedContentPresenter, IScoreWithMetadataPresenter {

	public interface IDisplay extends IModuleView{
		public Element getElement();
		public void setViewHTML(String viewHTML);
	}

	private AddonModel model;
	private JavaScriptObject jsObject;
	private IPlayerServices services;
	private IDisplay view;
	private IAddonDescriptor addonDescriptor;
	private static Set<String> buttonAddons = new HashSet<String>(Arrays.asList("single_state_button", "double_state_button", "show_answers", "limited_show_answers", "text_identification", "image_identification", "limited_submit", "external_link_button", "gradual_show_answer"));
	private InterfaceVersion interfaceVersion = InterfaceVersion.DEFAULT;
	private ResetVersion resetVersion = ResetVersion.DEFAULT;
	
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
				reset(event.getIsOnlyWrongAnswers());
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
	public void reset(boolean onlyWrongAnswers) {
		reset(jsObject, addonDescriptor.getAddonId(), onlyWrongAnswers, this.resetVersion == ResetVersion.ONLY_WRONG_ANSWERS);
	}
	
	private void reset() {
		this.reset(false);
	}

	private native void reset(JavaScriptObject obj, String addonId, boolean onlyWrongAnswers, boolean supportedOnlyWrongAnswers) /*-{
		// supportedOnlyWrongAnswers is added because some of modules could not support reset with additional flag (like Catch module).
		// In case like this, we need to be sure if this module can accept this flag in reset method.
		// It can be added to any module if resetInterfaceVersion is set to 2.
		try{
			if (obj.reset != undefined) {
				if (supportedOnlyWrongAnswers) {
					obj.reset(onlyWrongAnswers);
				} else {
					obj.reset();
				}
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
				var result = obj.getErrorCount();
				if (result === undefined) return 0;
				return result;

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
				var result = obj.getMaxScore();
				if (result === undefined) return 0;
				return result;
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
				var result = obj.getScore();
				if (result === undefined) return 0;
				return result;
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
		this.setListenerOnRelease();
		String addonName = "Addon" + model.getAddonId() + "_create";

		this.interfaceVersion = InterfaceVersion.fromValue(this.getSupportedVersion(addonName));
		this.resetVersion = ResetVersion.fromValue(this.getSupportedResetVersion(addonName));
		
		jsObject = initJavaScript(addonName);

		if(jsObject != null){
			setProperTabindexValue(model);
			JavaScriptObject jsModel = createModel(model);
			setPlayerController(jsObject, services.getAsJSObject());
			setEventBus(jsObject);
			run(jsObject, view.getElement(), jsModel, model.getAddonId());
		}
	}
	
	public void setListenerOnRelease () {
		this.model.setReleaseAction(new AddonModel.OnAddonReleaseAction() {
			@Override
			public void onRelease() {
				destroy();
			}
		});
	}
	
	public void destroy() {
		if (this.interfaceVersion.version >= InterfaceVersion.DESTROY_LIFE_CYCLE.version) {
			this.destroyAddon(jsObject, addonDescriptor.getAddonId());
		}
		
	}
	
	private native void destroyAddon(JavaScriptObject obj, String addonId) /*-{
		try {
			if(obj.onDestroy) {
			    obj.onDestroy();	
			}
		} catch (err) {
			alert("[" + addonId + "] Exception in onDestroy(): \n" + err + addonId);
			console.error(err);
		}
	}-*/;

	private JavaScriptObject createModel(IPropertyProvider provider) {
		return model.createJsModel(provider);
	}

	private native JavaScriptObject initJavaScript(String name) /*-{
		if($wnd.window[name] == null){
			return function(){};
		}
		
		return $wnd.window[name]();
	}-*/; 
	
	private native int getSupportedVersion(String name) /*-{
		var addonFunction = $wnd.window[name];
		if (!addonFunction ) {
			return 1;
		}
		
		if (!addonFunction.__supported_player_options__) {
			return 1;
		}
		
		if (!addonFunction.__supported_player_options__.interfaceVersion) {
			return 1;
		}
		
		return addonFunction.__supported_player_options__.interfaceVersion;
	}-*/;
	
	private native int getSupportedResetVersion(String name) /*-{
		var addonFunction = $wnd.window[name];
		if (!addonFunction ) {
			return 1;
		}
		
		if (!addonFunction.__supported_player_options__) {
			return 1;
		}
		
		if (!addonFunction.__supported_player_options__.resetInterfaceVersion) {
			return 1;
		}
		
		return addonFunction.__supported_player_options__.resetInterfaceVersion;
	}-*/;

	
	private native void setPlayerController(JavaScriptObject obj, JavaScriptObject controller ) /*-{
	
		if(obj.setPlayerController != undefined){
			return obj.setPlayerController(controller);
		}
	}-*/;
	
	
	private native void run(JavaScriptObject obj, Element element, JavaScriptObject model, String addonId ) /*-{

		try{
			if (obj.setCurrentLayoutName) {
				obj.setCurrentLayoutName(this.@com.lorepo.icplayer.client.module.addon.AddonPresenter::getCurrentLayoutName()());
			}
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
				var result = obj.getState();
				if (result === undefined) return "";
				return result;
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
	public void setDisabled(boolean value) {
		List<IType> params = new ArrayList<IType>();
		if (value) {
			executeCommand("disable", params);
		} else {
			executeCommand("enable", params);
		}
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
		boolean wasExecuted = selectAsActiveInPresenter(jsObject, className);
		if (wasExecuted) {
		    return;
		}
		this.view.getElement().addClassName(className);

		if ("ic_selected_module" == className && !services.isWCAGOn()) {
			this.view.getElement().focus();
		}
	}

	private native boolean selectAsActiveInPresenter( JavaScriptObject presenter, String className ) /*-{
		if (presenter !== null && presenter.selectAsActive !== undefined){
			presenter.selectAsActive(className);
			return true;
		}
		return false;
	}-*/;

	@Override
	public void deselectAsActive(String className) {
		boolean wasExecuted = deselectAsActiveInPresenter(jsObject, className);
		if (wasExecuted) {
		    return;
		}
		this.view.getElement().removeClassName(className);
		if ("ic_selected_module" == className && !services.isWCAGOn()) {
			this.view.getElement().blur();
		}
	}

	private native boolean deselectAsActiveInPresenter( JavaScriptObject presenter, String className ) /*-{
		if (presenter !== null && presenter.deselectAsActive !== undefined){
			presenter.deselectAsActive(className);
			return true;
		}
		return false;
	}-*/;

	@Override
	public boolean isSelectable(boolean isTextToSpeechOn) {
		boolean isVisible = !this.view.getElement().getStyle().getVisibility().equals("hidden") 
				&& !this.view.getElement().getStyle().getDisplay().equals("none")
				&& !KeyboardNavigationController.isParentGroupDivHidden(view.getElement());
		boolean isSelectableJSObject = isSelectableJSObject(this.jsObject, isTextToSpeechOn);
		boolean isDisplayed = isDisplayed(this.view.getElement());

		return (isTextToSpeechOn || haveStandaloneKeyboardNavigationSupport()) && isSelectableJSObject && isVisible && isDisplayed;
	}
	
	@Override
	public boolean haveStandaloneKeyboardNavigationSupport() {
		return this.haveWCAGSupport(this.jsObject) && !model.shouldOmitInKeyboardNavigation() && !this.isDisabled();
	}

	private native boolean isSelectableJSObject (JavaScriptObject obj, boolean isTextToSpeechOn) /*-{
		if (obj !== undefined && obj !== null && obj.hasOwnProperty('isSelectable')) {
			return obj.isSelectable(isTextToSpeechOn);
		};
		return true;
	}-*/;

	private native boolean isDisplayed (Element view) /*-{
		return $wnd.$(view).css('display') !== 'none';
	}-*/;
	
	
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
				propertyName.equalsIgnoreCase("isDisable") ||
				propertyName.equalsIgnoreCase("Disable")) {
					boolean isDisabled = isAddonDisabled(this.getAsJavaScript());
					if (isDisabled == true || isDisabled == false) {
						return isDisabled;
					}
					return propetry.getAsProperty().getValue().equalsIgnoreCase("true");
			}
		}
		return false;
	}

	private native boolean isAddonDisabled(JavaScriptObject obj) /*-{
		if (obj !== undefined && obj !== null && obj.hasOwnProperty('isDisabled')) {
			try {
				return obj.isDisabled();
			} catch (err) {
				return null;
			}
		};
		return null;
	}-*/;

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

	public boolean isEnabledInGSAMode() {
		return this.isEnabledInGSAMode(this.getAsJavaScript());
	}

	public native boolean isEnabledInGSAMode (JavaScriptObject obj) /*-{
		if (obj !== undefined && obj !== null && obj.hasOwnProperty('isEnabledInGSAMode')) {
			return obj.isEnabledInGSAMode();
		};
		return false;
	}-*/;

	@Override
	public void onEventReceived(String eventName, HashMap<String, String> data) {
		
	}

	@Override
	public int getActivitiesCount() {
		return jsObject == null ? 0 : getJSActivitiesCount(jsObject);
	}

	private native int getJSActivitiesCount(JavaScriptObject presenter) /*-{
		if (presenter.getActivitiesCount !== undefined) {
			return presenter.getActivitiesCount();
		}
		return 0;
	}-*/;

	private void setEventBus(JavaScriptObject presenter) {
		PlayerEventBusWrapper eventBus = new PlayerEventBusWrapper(services, this.model.getAddonId().toLowerCase());
		setEventBus(presenter, eventBus.getAsJSObject());
	}
	
	private native void setEventBus(JavaScriptObject presenter, JavaScriptObject eventBusWrapper) /*-{
		if (presenter.setEventBus != undefined) {
			presenter.setEventBus(eventBusWrapper);
		}
	}-*/;

	@Override
	public String getOpenEndedContent() {
		return getOpenEndedContent(jsObject);
	}

	private native String getOpenEndedContent(JavaScriptObject presenter)/*-{
		if (presenter && presenter.hasOwnProperty("getOpenEndedContent")) {
			return presenter.getOpenEndedContent();
		} else {
			return null;
		}
	}-*/;

	@Override
	public List<ScoreWithMetadata> getScoreWithMetadata() {
		IMetadata metadata = this.model.getMetadata();
		if (!ScoreWithMetadataUtils.validateMetadata(metadata)) {
			return null;
		}

		AddonScoreWithMetadata addonScoreWithMetadata = new AddonScoreWithMetadata(model, jsObject);

		return addonScoreWithMetadata.getScoreWithMetadata();
	}

	@Override
	public boolean isActivity() {
		for (IProperty property: model.getProperties()) {
			String propertyName = property.getName().toLowerCase();
			if ((propertyName.startsWith("is") || propertyName.startsWith("not")) && propertyName.endsWith("activity")) {
				boolean value = Boolean.parseBoolean(property.getValue());
				if (propertyName.contains("not")) {
					return !value;
				} else {
					return value;
				}
			}
		}
		return true;
	}
	
	private String getCurrentLayoutName() {
		return services.getModel().getActualSemiResponsiveLayoutName();
	}
}
