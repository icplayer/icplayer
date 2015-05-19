package com.lorepo.icplayer.client.module.checkbutton;

import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.CustomEvent;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

public class CheckButtonPresenter implements IPresenter, IStateful, ICommandReceiver {
	
	public interface IDisplay extends IModuleView {
		public void show();
		public void hide();
		void setShowErrorsMode(boolean isErrorCheckingMode);
		boolean isShowErrorsMode();
		void setDisabled(boolean isDisabled);
		public Element getElement();
		public void uncheckAnswers();
	}
	
	private CheckButtonModule model;
	private IDisplay view;
	private IPlayerServices playerServices;
	private JavaScriptObject jsObject;
	private boolean isVisible;
	
	public CheckButtonPresenter(CheckButtonModule model, IPlayerServices services) {
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
				setWorkMode();
			}
		});
		
		eventBus.addHandler(CustomEvent.TYPE, new CustomEvent.Handler() {
			@Override
			public void onCustomEventOccurred(CustomEvent event) {
				if (event.eventName.equals("ShowAnswers")) {
					if (view.isShowErrorsMode()) {
						view.setShowErrorsMode(false);
					}
				}
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
			if (isVisible) {
				show();
			} else {
				hide();
			}
		}
	}

	@Override
	public void addView(IModuleView display) {
		if (display instanceof IDisplay) {
			view = (IDisplay) display;
		}
	}

	@Override
	public IModuleModel getModel() {
		return model;
	}
	
	@Override
	public String executeCommand(String commandName, List<IType> _) {
		String value = "";
		
		if (commandName.compareTo("show") == 0) {
			show();
		} else if(commandName.compareTo("hide") == 0) {
			hide();
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
	public void reset() {
		if (model.isVisible()) {
			view.show();
		} else {
			view.hide();
		}
		view.setShowErrorsMode(false);
		view.setDisabled(false);
	}
	
	@Override
	public void setShowErrorsMode() {
		view.setShowErrorsMode(true);
		view.setDisabled(true);
	}

	@Override
	public void setWorkMode() {
		view.setShowErrorsMode(false);
		view.setDisabled(false);
	}

	public JavaScriptObject getAsJavaScript() {
		if (jsObject == null) {
			jsObject = initJSObject(this);
		}

		return jsObject;
	}
	
	private native JavaScriptObject initJSObject(CheckButtonPresenter x) /*-{
		var presenter = function() {};
		
		presenter.show = function() {
			x.@com.lorepo.icplayer.client.module.checkbutton.CheckButtonPresenter::show()();
		}
		
		presenter.hide = function() {
			x.@com.lorepo.icplayer.client.module.checkbutton.CheckButtonPresenter::hide()();
		}
		
		presenter.getView = function() {
			return x.@com.lorepo.icplayer.client.module.checkbutton.CheckButtonPresenter::getView()();
		}
		
		return presenter;
	}-*/;
	
	private Element getView() {
		return view.getElement();
	}
}
