package com.lorepo.icplayer.client.module.ordering;

import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.IWCAGPresenter;
import com.lorepo.icplayer.client.module.api.*;
import com.lorepo.icplayer.client.module.api.event.*;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.page.KeyboardNavigationController;
import com.lorepo.icplayer.client.module.text.AudioInfo;
import com.lorepo.icplayer.client.module.text.AudioWidget;
import com.lorepo.icplayer.client.module.text.AudioButtonWidget;

public class OrderingPresenter implements IPresenter, IStateful, IActivity, ICommandReceiver, IWCAGPresenter, IGradualShowAnswersPresenter {

	public interface IDisplay extends IModuleView {
		void addReorderListener(IReorderListener listener);
		void setWorkStatus(boolean b);
		boolean isDisabled();
		void setCorrectAnswersStyles();
		void setCorrectAnswersStyles(int index);
		void setCorrectAnswer();
		void setCorrectAnswer(int howManyElements);
		void removeCorrectAnswersStyles();
		String getState();
		void setState(String string);
		int getErrorCount();
		void setShowErrorsMode();
		void setWorkMode();
		void reset();
		String getInitialOrder();
		void show();
		void hide();
		public Element getElement();
		public void connectAudios();
		public int getWidgetCount();
		public Widget getWidget(int index);
	}

	private final OrderingModule module;
	private final IPlayerServices playerServices;
	private IDisplay view;
	private JavaScriptObject jsObject;
	private boolean isSolved = false;
	private String currentState = "";
	private String currentState_view = "";
	private int tmpErrorCount = 0;
	private int tmpScore = 0;
	private boolean isShowAnswersActive = false;
	private boolean isShowErrorsActive = false;
	private boolean isGradualShowAnswers = false;
	private boolean isVisible;

	public OrderingPresenter(OrderingModule module, IPlayerServices services) {

		this.module = module;
		this.playerServices = services;
		this.setVisible(module.isVisible());

		try{
			connectHandlers();
		}catch(Exception e){
		}
	}

	private void connectHandlers() {

		if (playerServices != null) {
			EventBus eventBus = playerServices.getEventBusService().getEventBus();

			eventBus.addHandler(ShowErrorsEvent.TYPE, new ShowErrorsEvent.Handler() {
				@Override
				public void onShowErrors(ShowErrorsEvent event) {
					setShowErrorsMode();
				}
			});

			eventBus.addHandler(WorkModeEvent.TYPE, new WorkModeEvent.Handler() {
				@Override
				public void onWorkMode(WorkModeEvent event) {
					setWorkMode();
				}
			});

			eventBus.addHandler(ResetPageEvent.TYPE, new ResetPageEvent.Handler() {
				@Override
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

			eventBus.addHandler(GradualShowAnswerEvent.TYPE, new GradualShowAnswerEvent.Handler() {
				@Override
				public void onGradualShowAnswers(GradualShowAnswerEvent event) {
					if (!isGradualShowAnswers) {
						setCurrentViewState();
						isGradualShowAnswers = true;
					}

					if (event.getModuleID().equals(module.getId())) {
						if (module.isShowAllAnswersInGradualShowAnswersMode()) {
							view.setCorrectAnswer();
						} else {
							int itemIndex = event.getItem();
							handleGradualShowAnswers(itemIndex);
						}
					}
				}
			});

			eventBus.addHandler(GradualHideAnswerEvent.TYPE, new GradualHideAnswerEvent.Handler() {
				@Override
				public void onGradualHideAnswers(GradualHideAnswerEvent event) {
					handleGradualHideAnswers();
				}
			});
		}
	}

	private boolean isShowAnswers() {
		if (!module.isActivity()) {
			return false;
		}

		return this.isShowAnswersActive;
	}

	private void showAnswers() {
		resetAudio();
		if (!module.isActivity()) {
			return;
		}

		if (this.isShowErrorsActive) {
			setWorkMode();
		}

		setCurrentViewState();
		this.isShowAnswersActive = true;

		view.setWorkStatus(false);
		view.setCorrectAnswersStyles();
		view.setCorrectAnswer();
	}

	private void hideAnswers() {
		if (!module.isActivity() || !this.isShowAnswersActive) {
			return;
		}

		view.removeCorrectAnswersStyles();
		this.isShowAnswersActive = false;

		setState(this.currentState);

		view.setWorkStatus(true);
	}

	@Override
	public String getSerialId() {
		return module.getId();
	}

	protected HashMap<String, String> prepareStateObject() {
		HashMap<String, String> stateMap = new HashMap<String, String>();

		stateMap.put("order", view.getState());
		stateMap.put("isSolved", Boolean.toString(isSolved()));
		stateMap.put("isVisible", Boolean.toString(isVisible()));

		return stateMap;
	}

	@Override
	public String getState() {
		if (isShowAnswers() || isGradualShowAnswers) {
			return this.currentState;
		}

		if (view == null)
			return "";

		IJsonServices json = playerServices.getJsonServices();

		return json.toJSONString(prepareStateObject());
	}

	protected void setStateFromHashMap(HashMap<String, String> state) {
		view.setState(state.get("order"));
		setSolved(Boolean.parseBoolean(state.get("isSolved")));

		if (Boolean.parseBoolean(state.get("isVisible"))) {
			show();
		} else {
			hide();
		}
	}

	@Override
	public void setState(String stateObj) {
		if (view == null) {
			return;
		}

		if (stateObj.indexOf("@") != -1) {
			String[] tokens = stateObj.split("@");
			if (view != null && tokens.length == 2) {
				view.setState(tokens[0]);
				setSolved(Boolean.parseBoolean(tokens[1]));
			}
		} else {
			IJsonServices json = playerServices.getJsonServices();
			HashMap<String, String> state = json.decodeHashMap(stateObj);

			setStateFromHashMap(state);
		}
	}

	// ------------------------------------------------------------------------
	// IActivity
	// ------------------------------------------------------------------------
	@Override
	public int getErrorCount() {
		if (isShowAnswers() || isGradualShowAnswers) {
			return this.tmpErrorCount;	// It's saved in showAnswers
		}

		int errors = 0;
		if (view != null && isSolved() && module.isActivity()) {
			errors = view.getErrorCount();
		}

		return errors;
	}

	@Override
	public void setShowErrorsMode() {
		if (isShowAnswers()) {
			hideAnswers();
		}

		this.isShowErrorsActive = true;

		setSolved(true);
		if (view != null) {
			view.setShowErrorsMode();
		}
		resetAudio();
	}

	@Override
	public void setWorkMode() {
		if (isShowAnswers()) {
			hideAnswers();
		}

		this.isShowErrorsActive = false;

		if (view != null) {
			view.setWorkMode();
		}
	}

	@Override
	public void reset(boolean isOnlyWrongAnswers) {
		if (isShowAnswers()) {
			hideAnswers();
		}

		setSolved(true);

		if (module.isVisible()) {
			show();
		} else {
			hide();
		}

		if (view != null) {
			view.reset();
		}
		resetAudio();
	}

	@Override
	public int getMaxScore() {
		return module.isActivity() ? module.getMaxScore() : 0;
	}

	@Override
	public int getScore() {
		if (isShowAnswers() || isGradualShowAnswers) {
			return this.tmpScore;	// It's saved in showAnserts
		}

		return module.isActivity() ? getMaxScore() - view.getErrorCount() : 0;
	}

	@Override
	public void addView(IModuleView view) {

		if (view instanceof IDisplay) {
			this.view = (IDisplay) view;
			this.view.addReorderListener(new IReorderListener() {

				@Override
				public void onItemMoved(int sourceIndex, int destIndex) {
					onValueChanged(sourceIndex, destIndex);
				}

				@Override
				public void onAudioButtonClicked(AudioInfo audioInfo) {
					AudioWidget audio = audioInfo.getAudio();
					AudioButtonWidget button = audioInfo.getButton();

					if (audio.isPaused()) {
						// in future if audio can be paused and replayed from stopped moment
						// reset would need to omit audio which was currently pressed
						resetAudio();

						audio.play();
						button.setStopPlayingStyleClass();
					} else {
						audio.reset();
						button.setStartPlayingStyleClass();
					}
				}

				@Override
				public void onAudioEnded(AudioInfo audioInfo) {
					AudioWidget audio = audioInfo.getAudio();
					AudioButtonWidget button = audioInfo.getButton();

					audio.reset();
					button.setStartPlayingStyleClass();
				}
			});

			this.view.connectAudios();
		}
	}

	@Override
	public IModuleModel getModel() {
		return module;
	}

	public JavaScriptObject getAsJavaScript() {

		if (jsObject == null) {
			jsObject = initJSObject(this);
		}

		return jsObject;
	}

	@Override
	public void setDisabled(boolean value) {
		view.setWorkStatus(!value);
	}

	@Override
	public boolean isDisabled() {
		return view.isDisabled();
	}

	private void jsOnEventReceived (String eventName, String jsonData) {
		this.onEventReceived(eventName, jsonData == null ? new HashMap<String, String>() : (HashMap<String, String>)JavaScriptUtils.jsonToMap(jsonData));
	}

	private native JavaScriptObject initJSObject(OrderingPresenter x) /*-{
		var presenter = function(){};

		presenter.isAllOK = function() {
			return x.@com.lorepo.icplayer.client.module.ordering.OrderingPresenter::isAllOK()();
		};

		var isActivity = x.@com.lorepo.icplayer.client.module.ordering.OrderingPresenter::isActivity()();

		if (isActivity) {
			presenter.isAttempted = function() {
				return x.@com.lorepo.icplayer.client.module.ordering.OrderingPresenter::isAttempted()();
			};
		}

		presenter.getView = function() { 
			return x.@com.lorepo.icplayer.client.module.ordering.OrderingPresenter::getView()();
		}

		presenter.show = function() {
			x.@com.lorepo.icplayer.client.module.ordering.OrderingPresenter::show()();
		}

		presenter.hide = function() {
			x.@com.lorepo.icplayer.client.module.ordering.OrderingPresenter::hide()();
		}

		presenter.reset = function() {
			x.@com.lorepo.icplayer.client.module.ordering.OrderingPresenter::reset(Z)(false);
		}
		
		presenter.onEventReceived = function (eventName, data) {
			x.@com.lorepo.icplayer.client.module.ordering.OrderingPresenter::jsOnEventReceived(Ljava/lang/String;Ljava/lang/String;)(eventName, JSON.stringify(data));
		};

		presenter.getScore = function() {
			return x.@com.lorepo.icplayer.client.module.ordering.OrderingPresenter::getScore()();
		};

		presenter.getErrorCount = function() {
			return x.@com.lorepo.icplayer.client.module.ordering.OrderingPresenter::getErrorCount()();
		};

		presenter.getMaxScore = function() {
			return x.@com.lorepo.icplayer.client.module.ordering.OrderingPresenter::getMaxScore()();
		};

		presenter.setShowErrorsMode = function() {
			x.@com.lorepo.icplayer.client.module.ordering.OrderingPresenter::setShowErrorsMode()();
		};

		presenter.setWorkMode = function() {
			x.@com.lorepo.icplayer.client.module.ordering.OrderingPresenter::setWorkMode()();
		};

		presenter.showAnswers = function() {
			x.@com.lorepo.icplayer.client.module.ordering.OrderingPresenter::showAnswers()();
		};

		presenter.hideAnswers = function() {
			x.@com.lorepo.icplayer.client.module.ordering.OrderingPresenter::hideAnswers()();
		};

		return presenter;
	}-*/;


	private void onValueChanged(int sourceIndex, int destIndex) {
		setSolved(true);
		String id = Integer.toString(sourceIndex+1);
		String newValue = Integer.toString(destIndex+1);
		String score = Integer.toString(getScore());
		ValueChangedEvent valueEvent = new ValueChangedEvent(module.getId(), id, newValue, score);
		playerServices.getEventBus().fireEvent(valueEvent);
	}

	public boolean isAllOK() {
		return getScore() == getMaxScore() && getErrorCount() == 0;
	}

	@Override
	public String getName() {
		return module.getId();
	}

	@Override
	public String executeCommand(String commandName, List<IType> params) {
		if (commandName.compareTo("isallok") == 0) {
			return String.valueOf(isAllOK());
		}

		if (commandName.compareTo("isattempted") == 0 && module.isActivity()) {
			return String.valueOf(isAttempted());
		}

		if (commandName.compareTo("show") == 0) {
			show();
		}

		if (commandName.compareTo("hide") == 0) {
			hide();
		}

		if (commandName.compareTo("reset") == 0) {
			reset(false);
		}

		if (commandName.compareTo("getscore") == 0) {
			return String.valueOf(getScore());
		}

		if (commandName.compareTo("geterrorcount") == 0) {
			return String.valueOf(getErrorCount());
		}

		if (commandName.compareTo("getmaxscore") == 0) {
			return String.valueOf(getMaxScore());
		}

		if (commandName.compareTo("setshowerrorsmode") == 0) {
			setShowErrorsMode();
		}

		if (commandName.compareTo("setworkmode") == 0) {
			setWorkMode();
		}

		if (commandName.compareTo("showanswers") == 0) {
			showAnswers();
		}

		if (commandName.compareTo("hideanswers") == 0) {
			hideAnswers();
		}

		return "";
	}

	@Override
	public boolean isActivity () {
		return module.isActivity();
	}

	private boolean isAttempted() {
		if (isShowAnswers()) {
			hideAnswers();
		}

		return view.getInitialOrder() != view.getState();
	}

	private Element getView() {
		return view.getElement();
	}

	private void show() {
		if (isShowAnswers()) {
			hideAnswers();
		}

		setVisible(true);
		if (view != null) {
			view.show();
		}
	}

	private void hide() {
		if (isShowAnswers()) {
			hideAnswers();
		}

		setVisible(false);
		if (view != null) {
			view.hide();
		}
	}

	protected boolean isVisible() {
		return isVisible;
	}

	protected void setVisible(boolean isVisible) {
		this.isVisible = isVisible;
	}

	public boolean isSolved() {
		return isSolved;
	}

	public void setSolved(boolean isSolved) {
		this.isSolved = isSolved;
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
		boolean isVisible = !this.view.getElement().getStyle().getVisibility().equals("hidden")
			&& !this.view.getElement().getStyle().getDisplay().equals("none")
			&& !KeyboardNavigationController.isParentGroupDivHidden(view.getElement());
		return (isTextToSpeechOn || haveStandaloneKeyboardNavigationSupport()) && isVisible;
	}
	
	@Override
	public boolean haveStandaloneKeyboardNavigationSupport() {
		return !module.shouldOmitInKeyboardNavigation();
	}

	@Override
	public void onEventReceived(String eventName, HashMap<String, String> data) {
		if (eventName.equals("ShowAnswers")) {
			showAnswers();
		} else if (eventName.equals("HideAnswers")) {
			hideAnswers();
		}
	}

	@Override
	public int getActivitiesCount() {
		if (module.isShowAllAnswersInGradualShowAnswersMode()) {
			return 1;
		}
		// returning - 1 because when handling gradual show answers it will require N - 1 swaps
		return module.getItemCount() - 1;
	}

	public void handleGradualShowAnswers(int itemIndex) {
		view.setCorrectAnswer(itemIndex + 1);
		view.setCorrectAnswersStyles(itemIndex);
	}

	public void handleGradualHideAnswers() {
		isGradualShowAnswers = false;
		view.removeCorrectAnswersStyles();
		setState(currentState);

		view.setWorkStatus(true);
	}

	private void setCurrentViewState() {
		this.tmpScore = getScore();
		this.tmpErrorCount = getErrorCount();
		this.currentState = getState();
		this.currentState_view = view.getState();
	}

	private void resetAudio() {
		for (int itemWidgetIndex = 0; itemWidgetIndex < this.view.getWidgetCount(); itemWidgetIndex++) {
			Widget widget = this.view.getWidget(itemWidgetIndex);
			if (widget instanceof ItemWidget) {
				ItemWidget itemWidget = (ItemWidget) widget;
				resetAudioInItem(itemWidget);
			}
		}
	}

	private void resetAudioInItem(ItemWidget itemWidget) {
		List<AudioInfo> audioInfos = itemWidget.getAudioInfos();
		for (int i = 0; i < audioInfos.size(); i++) {
			AudioInfo audioInfo = audioInfos.get(i);
			AudioButtonWidget button = audioInfo.getButton();
			AudioWidget audio = audioInfo.getAudio();

			boolean isElementExists = button != null && audio != null;
			if (isElementExists && !audio.isPaused()) {
				audio.reset();
				button.setStartPlayingStyleClass();
			}
		}
	}
}
