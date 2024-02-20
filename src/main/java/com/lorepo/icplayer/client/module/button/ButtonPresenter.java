package com.lorepo.icplayer.client.module.button;

import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.IButton;
import com.lorepo.icplayer.client.module.IEnterable;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGPresenter;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.button.ButtonModule.ButtonType;
import com.lorepo.icplayer.client.page.KeyboardNavigationController;

public class ButtonPresenter implements IPresenter, IStateful, ICommandReceiver, IWCAGPresenter, IButton, IEnterable {
	
	public interface IDisplay extends IModuleView {
		public void show();
		public void hide();
		void setErrorCheckingMode(boolean isErrorCheckingMode);
		boolean isErrorCheckingMode();
		void setDisabled(boolean isDisabled);
		boolean isEnabled();
		public Element getElement();
		void execute();
	}
	
	private ButtonModule model;
	private IDisplay view;
	private IPlayerServices playerServices;
	private JavaScriptObject jsObject;
	private boolean isVisible;
	
	public ButtonPresenter(ButtonModule model, IPlayerServices services) {
		this.model = model;
		this.playerServices = services;
		this.isVisible = model.isVisible();
		
		connectHandlers();
	}
	
	private void connectHandlers() {
		EventBus eventBus = playerServices.getEventBus();
		
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
	
	@Override
	public String getName() {
		return model.getId();
	}

	@Override
	public String getSerialId() {
		return model.getId();
	}

	@Override
	public String getState() {
		IJsonServices json = playerServices.getJsonServices();
		HashMap<String, String> state = new HashMap<String, String>();

		state.put("isVisible", Boolean.toString(isVisible));		
		
		return json.toJSONString(state);
	}

	@Override
	public void setState(String state) {
		IJsonServices json = playerServices.getJsonServices();
		HashMap<String, String> decodedState = json.decodeHashMap(state);
		
		if (decodedState.containsKey("isVisible")) {
			isVisible = Boolean.parseBoolean(decodedState.get("isVisible"));
			if (!isVisible){
				hide();
			}
			else{
				show();
			}
		}
	}

	@Override
	public void addView(IModuleView display) {
		if (display instanceof IDisplay){
			view = (IDisplay) display;
		}
	}

	@Override
	public IModuleModel getModel() {
		return model;
	}
	
	@Override
	public String executeCommand(String commandName, List<IType> args) {
		String value = "";
		
		if (commandName.compareTo("show") == 0) {
			show();
		} else if(commandName.compareTo("hide") == 0) {
			hide();
		} else if(commandName.compareTo("execute") == 0){
			execute();
		}
		
		return value;
	}
	
	protected void show() {
		if (view != null) {
			view.show();
			isVisible = true;
		}
	}
	
	
	protected void hide() {
		if (view != null) {
			view.hide();
			isVisible = false;
		}
	}
	
	@Override
	public void reset(boolean onlyWrongAnswers) {
		if (model.isVisible()) {
			view.show();
		} else{
			view.hide();
            isVisible = false;
		}
		view.setErrorCheckingMode(false);
		view.setDisabled(false);
	}
	
	@Override
	public void setShowErrorsMode() {
		if(model.getType() != ButtonType.popup){
			view.setErrorCheckingMode(true);
			view.setDisabled(true);
		}
	}

	@Override
	public void setWorkMode() {
		if(model.getType() != ButtonType.popup){
			view.setErrorCheckingMode(false);
			view.setDisabled(false);
		}
	}
	
	public JavaScriptObject getAsJavaScript() {
		if (jsObject == null) {
			jsObject = initJSObject(this);
		}

		return jsObject;
	}

	@Override
	public void setDisabled(boolean value) {
		view.setDisabled(value);
	}

	@Override
	public boolean isDisabled() {
		return !view.isEnabled();
	}

	public void execute(){
		if(this.view != null){
			this.view.execute();	
		}
	}
	
	private void jsOnEventReceived (String eventName, String jsonData) {
		this.onEventReceived(eventName, jsonData == null ? new HashMap<String, String>() : (HashMap<String, String>)JavaScriptUtils.jsonToMap(jsonData));
	}

	private native JavaScriptObject initJSObject(ButtonPresenter x) /*-{
		var presenter = function() {}
		
		presenter.show = function() { 
			x.@com.lorepo.icplayer.client.module.button.ButtonPresenter::show()();
		}
		
		presenter.hide = function() { 
			x.@com.lorepo.icplayer.client.module.button.ButtonPresenter::hide()();
		}
		
		presenter.getView = function() { 
			return x.@com.lorepo.icplayer.client.module.button.ButtonPresenter::getView()();
		}
		
		presenter.execute = function() {
			return x.@com.lorepo.icplayer.client.module.button.ButtonPresenter::execute()();
		}
		
		presenter.onEventReceived = function (eventName, data) {
			x.@com.lorepo.icplayer.client.module.button.ButtonPresenter::jsOnEventReceived(Ljava/lang/String;Ljava/lang/String;)(eventName, JSON.stringify(data));
		};
		
		return presenter;
	}-*/;
	
	private Element getView(){
		return view.getElement();
	}

	@Override
	public IWCAG getWCAGController() {
		if (this.view instanceof IWCAG) {
			return (IWCAG) this.view;
		}
		return null;
	}

	@Override
	public void selectAsActive(String className) {
		this.view.getElement().addClassName(className);
	}

	@Override
	public void deselectAsActive(String className) {
		this.view.getElement().removeClassName(className);
	}

	@Override
	public boolean isSelectable(boolean isTextToSpeechOn) {
		boolean isHidden = this.getView().getStyle().getVisibility().equals("hidden");
		boolean isNone = this.getView().getStyle().getDisplay().equals("none");
		boolean isGroupDivHidden  = KeyboardNavigationController.isParentGroupDivHidden(view.getElement());
		
		boolean isVisible = !isHidden && !isNone && !isGroupDivHidden;
		return (isTextToSpeechOn || haveStandaloneKeyboardNavigationSupport()) && isVisible;
	}
	
	@Override
	public boolean haveStandaloneKeyboardNavigationSupport() {
		return !model.shouldOmitInKeyboardNavigation() && this.view.isEnabled();
	}

	@Override
	public void onEventReceived(String eventName, HashMap<String, String> data) {
		
	}

	@Override
	public boolean isEnterable() {
		if (model.getType() == ButtonType.reset) {
			ButtonView buttonView = (ButtonView) view;
			return model.getConfirmReset() && !buttonView.shouldSkipOpeninDialog();
		}
		return false;
	}
}
