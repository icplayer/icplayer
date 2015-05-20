package com.lorepo.icplayer.client.module.limitedcheck;

import java.util.ArrayList;
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

public class LimitedCheckPresenter implements IPresenter, IStateful, ICommandReceiver {
	public interface IDisplay extends IModuleView {
		public void show();
		public void hide();
		public Element getElement();
		public void setShowErrorsMode(boolean b);
		public boolean isShowErrorsMode();
		public void setShowAnswersMode(boolean b);
		void setDisabled(boolean isDisabled);
		public ArrayList<IPresenter> getModulesPresenters();
	}
	
	private LimitedCheckModule model;
	private IDisplay view;
	private IPlayerServices playerServices;
	private JavaScriptObject jsObject;
	private boolean isVisible;
	
	public LimitedCheckPresenter(LimitedCheckModule model, IPlayerServices services) {
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

					view.setShowAnswersMode(true);
					view.setDisabled(false);
				} else if (event.eventName.equals("HideAnswers")) {
					view.setShowAnswersMode(false);
				}
			}
		});
	}

	@Override
	public String getName() {
		return model.getId();
	}

	@Override
	public String executeCommand(String commandName, List<IType> params) {
		String value = "";
		
		if (commandName.compareTo("show") == 0) {
			show();
		} else if(commandName.compareTo("hide") == 0) {
			hide();
		} else if(commandName.compareTo("getmodulesscore") == 0) {
			JavaScriptObject modulesScore = getModulesScore();
			if (modulesScore != null) {
				value = modulesScore.toString();
			}
		}
		
		return value;
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
	public void setShowErrorsMode() {
		if (view != null) {
			view.setShowErrorsMode(true);
			view.setDisabled(true);
		}
	}

	@Override
	public void setWorkMode() {
		if (view != null) {
			view.setShowErrorsMode(false);
			view.setDisabled(false);
		}
	}
	
	@Override
	public void reset() {
		setWorkMode();
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
	
	public JavaScriptObject getAsJavaScript() {
		if (jsObject == null) {
			jsObject = initJSObject(this);
		}

		return jsObject;
	}
	
	private native JavaScriptObject initJSObject(LimitedCheckPresenter x) /*-{
		var presenter = function() {};
		
		presenter.show = function() {
			x.@com.lorepo.icplayer.client.module.limitedcheck.LimitedCheckPresenter::show()();
		}
		
		presenter.hide = function() {
			x.@com.lorepo.icplayer.client.module.limitedcheck.LimitedCheckPresenter::hide()();
		}
		
		presenter.getView = function() {
			return x.@com.lorepo.icplayer.client.module.limitedcheck.LimitedCheckPresenter::getView()();
		}
		
		presenter.getModulesScore = function() {
			return x.@com.lorepo.icplayer.client.module.limitedcheck.LimitedCheckPresenter::getModulesScore()();
		}
		
		return presenter;
	}-*/;
	
	private Element getView() {
		if (view != null) {
			return view.getElement();
		}
		
		return null;
	}
	
	private JavaScriptObject getModulesScore() {
		if (view != null) {
			ArrayList<IPresenter> modulesPresenters = view.getModulesPresenters();
			TotalScore score = TotalScore.getFromPresenters(modulesPresenters);

			return score.toJavaScriptObject();
		}

		return null;
	}
}
