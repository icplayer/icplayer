package com.lorepo.icplayer.client.module.limitedreset;

import java.util.HashMap;
import java.util.List;
import java.util.HashSet;
import java.util.Set;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icf.utils.JSONUtils;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.IButton;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGPresenter;
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
import com.lorepo.icplayer.client.page.KeyboardNavigationController;

public class LimitedResetPresenter implements IPresenter, IStateful, ICommandReceiver, IWCAGPresenter, IButton {
	
	public interface IDisplay extends IModuleView {
		public void show();
		public void hide();
		public Element getElement();
		void setDisabled(boolean isDisabled);
		boolean isDisabled();
		public void setShowAnswersMode(boolean b);
		public void setLimitedShowAnswersMode(Set<String> m);
	}
	
	private LimitedResetModule model;
	private IDisplay view;
	private IPlayerServices playerServices;
	private JavaScriptObject jsObject;
	private boolean isVisible;
	private Set<String> activeShowAnswersModules = new HashSet<String>();
	public LimitedResetPresenter(LimitedResetModule model, IPlayerServices services) {
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
				onEventReceived(event.eventName, event.getData());
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
		} else if(commandName.compareTo("getWorksWithModulesList") == 0) {
			// the returned value is different from what is being returned by presenter.getWorksWithModulesList method.
			// This is because executeCommand can only return a String. There is little practical reason to make such
			// a command to get those values (an AC/custom addon script would use the method call instead) in the first
			// place, so this command was mostly added to avoid errors if anyone tried anyway
			value = model.getModules().toString();
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
	public void setShowErrorsMode() {
		if (view != null) {
			view.setDisabled(true);
		}
	}

	@Override
	public void setWorkMode() {
		if (view != null) {
			view.setDisabled(false);
		}
	}
	
	@Override
	public void reset(boolean onlyWrongAnswers) {
		// Module is not an activity
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
		return view.isDisabled();
	}

	private void jsOnEventReceived (String eventName, String jsonData) {
		this.onEventReceived(eventName, jsonData == null ? new HashMap<String, String>() : (HashMap<String, String>)JavaScriptUtils.jsonToMap(jsonData));
	}
	
	private native JavaScriptObject initJSObject(LimitedResetPresenter x) /*-{
		var presenter = function() {};
		
		presenter.show = function() {
			x.@com.lorepo.icplayer.client.module.limitedreset.LimitedResetPresenter::show()();
		}
		
		presenter.hide = function() {
			x.@com.lorepo.icplayer.client.module.limitedreset.LimitedResetPresenter::hide()();
		}
		
		presenter.getView = function() {
			return x.@com.lorepo.icplayer.client.module.limitedreset.LimitedResetPresenter::getView()();
		}
		
		presenter.onEventReceived = function (eventName, data) {
			x.@com.lorepo.icplayer.client.module.limitedreset.LimitedResetPresenter::jsOnEventReceived(Ljava/lang/String;Ljava/lang/String;)(eventName, JSON.stringify(data));
		};

		presenter.getWorksWithModulesList = function() {
			return x.@com.lorepo.icplayer.client.module.limitedreset.LimitedResetPresenter::getWorksWithModulesList()();
		}
		
		return presenter;
	}-*/;
	
	private Element getView() {
		if (view != null) {
			return view.getElement();
		}
		
		return null;
	}

	private JavaScriptObject getWorksWithModulesList() {
		JavaScriptObject array = JavaScriptUtils.createEmptyJsArray();
		for(String moduleId: model.getModules()) JavaScriptUtils.addElementToJSArray(array, moduleId);
		return array;
	}

    private void handleLimitedShowAnswersEvent(HashMap<String, String> data) {
        Set<String> activeLimitedShowModules = JSONUtils.decodeSet(data.get("item"));
        for (String moduleID : activeLimitedShowModules) {
            if (model.getModules().contains(moduleID)) {
                activeShowAnswersModules.add(data.get("source"));
                break;
            }
        }
        view.setLimitedShowAnswersMode(activeShowAnswersModules);
    };

	@Override
	public void onEventReceived(String eventName, HashMap<String, String> data) {
		if (eventName.equals("ShowAnswers")) {
			view.setShowAnswersMode(true);
			view.setDisabled(false);
		} else if (eventName.equals("HideAnswers")) {
			view.setShowAnswersMode(false);
		} else if (eventName.equals("LimitedShowAnswers")) {
			handleLimitedShowAnswersEvent(data);
		} else if (eventName.equals("LimitedHideAnswers")) {
			activeShowAnswersModules.remove(data.get("source"));
			view.setLimitedShowAnswersMode(activeShowAnswersModules);
		}
	}

    @Override
    public IWCAG getWCAGController() {
        return (IWCAG) this.view;
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
        boolean isVisible = !this.getView().getStyle().getVisibility().equals("hidden")
                && !this.getView().getStyle().getDisplay().equals("none")
                && !KeyboardNavigationController.isParentGroupDivHidden(view.getElement());
        return (isTextToSpeechOn || haveStandaloneKeyboardNavigationSupport()) && isVisible;
    }
	
	@Override
	public boolean haveStandaloneKeyboardNavigationSupport() {
		return !model.shouldOmitInKeyboardNavigation();
	}
}
