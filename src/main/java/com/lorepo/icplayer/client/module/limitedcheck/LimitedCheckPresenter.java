package com.lorepo.icplayer.client.module.limitedcheck;

import java.util.*;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.user.client.Timer;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.IButton;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGPresenter;
import com.lorepo.icplayer.client.module.ModuleUtils;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.*;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.page.KeyboardNavigationController;

public class LimitedCheckPresenter implements IPresenter, IStateful, ICommandReceiver, IWCAGPresenter, IButton {

    public interface IDisplay extends IModuleView {
        public void show();

        public void hide();

        public Element getElement();

        public void setShowErrorsMode(boolean b);

        public boolean isShowErrorsMode();

        public void setShowAnswersMode(boolean b);

        void setDisabled(boolean isDisabled);
        boolean isDisabled();

        public ArrayList<IPresenter> getModulesPresenters();
        
        public void setChecked();

        public TotalScore getTotalScore();

        public String getTitlePostfix();
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
                reset(event.getIsOnlyWrongAnswers());
            }
        });

        eventBus.addHandler(CustomEvent.TYPE, new CustomEvent.Handler() {
            @Override
            public void onCustomEventOccurred(CustomEvent event) {
                onEventReceived(event.eventName, event.getData());
            }
        });

        eventBus.addHandler(ValueChangedEvent.TYPE, new ValueChangedEvent.Handler() {
            @Override
            public void onScoreChanged(ValueChangedEvent event) {
                String eventValue = event.getValue();

                if (eventValue.equals("LimitedShowAnswers")) {
                    LimitedAnswerHandler handler = new LimitedAnswerHandler(event);
                    handler.handleShowAnswer();
                } else if (eventValue.equals("LimitedHideAnswers")) {
                    LimitedAnswerHandler handler = new LimitedAnswerHandler(event);
                    handler.handleHideAnswer();
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
        } else if (commandName.compareTo("hide") == 0) {
            hide();
        } else if (commandName.compareTo("getmodulesscore") == 0) {
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
        if (model.getMaintainState()) {
        	state.put("isShowErrorsMode", Boolean.toString(view.isShowErrorsMode()));
        }

        return json.toJSONString(state);
    }

    @Override
    public void setState(String state) {
        IJsonServices json = playerServices.getJsonServices();
        HashMap<String, String> decodedState = json.decodeHashMap(state);

        if (model.getMaintainState() && decodedState.containsKey("isShowErrorsMode")) {
        	boolean isShowErrorsMode = Boolean.parseBoolean(decodedState.get("isShowErrorsMode"));
        	if (isShowErrorsMode) {
        		Timer t = new Timer(){
        			@Override
        			public void run() {
        				view.setChecked();
        			}
        		};
        		t.schedule(250);
        	}
        }

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
    public void reset(boolean isOnlyWrongAnswers) {
        setWorkMode();
        if (view != null) {
            view.setShowAnswersMode(false);
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

    private void jsOnEventReceived(String eventName, String jsonData) {
        this.onEventReceived(eventName, jsonData == null ? new HashMap<String, String>() : (HashMap<String, String>) JavaScriptUtils.jsonToMap(jsonData));
    }

    private native JavaScriptObject initJSObject(LimitedCheckPresenter x) /*-{
        var presenter = function () {
        };

        presenter.show = function () {
            x.@com.lorepo.icplayer.client.module.limitedcheck.LimitedCheckPresenter::show()();
        }

        presenter.hide = function () {
            x.@com.lorepo.icplayer.client.module.limitedcheck.LimitedCheckPresenter::hide()();
        }

        presenter.getView = function () {
            return x.@com.lorepo.icplayer.client.module.limitedcheck.LimitedCheckPresenter::getView()();
        }

        presenter.getModulesScore = function () {
            return x.@com.lorepo.icplayer.client.module.limitedcheck.LimitedCheckPresenter::getModulesScore()();
        }

        presenter.onEventReceived = function (eventName, data) {
            x.@com.lorepo.icplayer.client.module.limitedcheck.LimitedCheckPresenter::jsOnEventReceived(Ljava/lang/String;Ljava/lang/String;)(eventName, JSON.stringify(data));
        };

        presenter.getTitlePostfix = function() {
			return x.@com.lorepo.icplayer.client.module.limitedcheck.LimitedCheckPresenter::getTitlePostfix()();
		}

        presenter.getWorksWithModulesList = function() {
            var moduleList = x.@com.lorepo.icplayer.client.module.limitedcheck.LimitedCheckPresenter::getModuleList()();
			return x.@com.lorepo.icplayer.client.module.limitedcheck.LimitedCheckPresenter::getWorksWithModules(Ljava/lang/String;)(moduleList);
		}

        return presenter;
    }-*/;

    private native JavaScriptObject getWorksWithModules(String moduleList) /*-{
        if (!moduleList.trim().length) return [];

        return moduleList.split(";");
    }-*/;

    private String getTitlePostfix() {
        return view.getTitlePostfix();
    }

    private String getModuleList() {
        return this.model.getWorksWithModulesList();
    }

    private Element getView() {
        if (view != null) {
            return view.getElement();
        }

        return null;
    }

    public JavaScriptObject getModulesScore() {
        if (view != null) {
            TotalScore score = view.getTotalScore();

            return score.toJavaScriptObject();
        }

        return null;
    }

    @Override
    public void onEventReceived(String eventName, HashMap<String, String> data) {
        if (eventName.equals("ShowAnswers")) {
            if (view.isShowErrorsMode()) {
                view.setShowErrorsMode(false);
            }

            view.setShowAnswersMode(true);
            view.setDisabled(false);
        } else if (eventName.equals("HideAnswers")) {
            view.setShowAnswersMode(false);
        }
    }

    private class LimitedAnswerHandler {
        private List<String> eventItems;

        LimitedAnswerHandler(ValueChangedEvent event) {
            HashMap<String, String> data = event.getData();
            eventItems = deserializeItemsString(data.get("item"));
        }

        void handleShowAnswer() {
            if (isEventItemDependent()) {
                if (view.isShowErrorsMode()) {
                    view.setShowErrorsMode(false);
                }
                view.setShowAnswersMode(true);
                view.setDisabled(false);
            }
        }

        void handleHideAnswer() {
            if (isEventItemDependent()) {
                view.setShowAnswersMode(false);
            }
        }

        private List<String> deserializeItemsString(String string) {
            IJsonServices jsonServices = playerServices.getJsonServices();
            return jsonServices.decodeArrayValues(string);
        }

        private boolean isEventItemDependent() {
            List<String> modules = model.getModules();
            for (String eventItem : eventItems) {
                if (modules.contains(eventItem))
                    return true;
            }
            return false;
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
        return !model.shouldOmitInKeyboardNavigation() && !isDisabled();
    }
}
