package com.lorepo.icplayer.client.module.imagegap;

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
import com.lorepo.icplayer.client.module.api.IActivity;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.CustomEvent;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableImage;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableItem;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemConsumedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemReturnedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemSelectedEvent;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter;
import com.lorepo.icplayer.client.page.KeyboardNavigationController;
import com.lorepo.icplayer.client.module.api.IGradualShowAnswersPresenter;
import com.lorepo.icplayer.client.module.api.event.GradualShowAnswerEvent;
import com.lorepo.icplayer.client.module.api.event.GradualHideAnswerEvent;

public class ImageGapPresenter implements IPresenter, IActivity, IStateful, ICommandReceiver, IWCAGPresenter, IButton, IGradualShowAnswersPresenter {

	public interface IDisplay extends IModuleView {
		public void addListener(IViewListener l);
		void setImageUrl(String url);
		void showAsError();
		void showAsCorrect();
		void resetStyles();
		void setDisabled(boolean disable);
		void showCorrectAnswers();
		public void show();
		public void hide();
		public void markGapAsEmpty();
		public void markGapAsWrong();
		public boolean isAttempted();
		public Element getElement();
		public void makeDraggable(ImageGapPresenter imageGapPresenter);
		public boolean getDisabled();
		public void makeDroppable(ImageGapPresenter imageGapPresenter);
		public void removeClass(String string);
		public void setAltText(String alt);
		public void clearAltText();
		public void setLangTag(String langTag);
		public String getLang();
		public void readInserted();
		public void readRemoved();
		public void handleLimitedCheck(int score, int error, boolean hideMarkContainer);
	}

	private final ImageGapModule model;
	private IDisplay view;
	private final IPlayerServices playerServices;
	private DraggableItem readyToDraggableItem;
	private DraggableItem consumedItem;
	private JavaScriptObject jsObject;
	private boolean isVisible;
	private boolean isShowAnswersActive = false;
	private String currentState = "";
	private HashMap<String, String> currentEventData;
	private boolean workModeDisabled = false;
	private boolean isShowErrorsMode = false;
	private boolean showAnswersModeDisabled = false;
	private boolean isConnectedWithMath = false;
	private boolean isSetGapAnswers = false;
	private boolean isGradualShowAnswers = false;

	public ImageGapPresenter(ImageGapModule model, IPlayerServices services) {
		this.model = model;
		this.playerServices = services;
		isVisible = model.isVisible();
		try {
			connectHandlers();
		} catch (Exception e) {
		}
	}

	private void connectHandlers() {
		EventBus eventBus = playerServices.getEventBus();

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

		eventBus.addHandler(ItemSelectedEvent.TYPE, new ItemSelectedEvent.Handler() {
			@Override
			public void onItemSelected(ItemSelectedEvent event) {
				if (event.getItem() instanceof DraggableImage) {
					if (event.getItem().getId() == null) {
						readyToDraggableItem = null;
					} else {
						readyToDraggableItem = event.getItem();
					}
				}
			}
		});

		eventBus.addHandler(ItemConsumedEvent.TYPE, new ItemConsumedEvent.Handler() {
			@Override
			public void onItemConsumed(ItemConsumedEvent event) {
				readyToDraggableItem = null;
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
                        isGradualShowAnswers = true;
				}

                if (event.getModuleID().equals(model.getId())) {
                    showAnswers();
				}
			}
		});

		eventBus.addHandler(GradualHideAnswerEvent.TYPE, new GradualHideAnswerEvent.Handler() {
			@Override
			public void onGradualHideAnswers(GradualHideAnswerEvent event) {
				isGradualShowAnswers = false;
				hideAnswers();
			}
		});
	}

	DraggableItem userReadyToDraggableItem = null;

	private void showAnswers() {
		if(!model.isActivity() && isConnectedWithMath){
			this.isShowAnswersActive = true;
			if(!isSetGapAnswers){
				view.resetStyles();
			}
			view.setDisabled(true);
			view.removeClass("ui-state-disabled");
		}

		if (!model.isActivity() || this.isShowAnswersActive) { return; }

		this.isShowAnswersActive = true;
		userReadyToDraggableItem = readyToDraggableItem;

		showAnswersModeDisabled = view.getDisabled();
		this.currentState = getState();
		view.resetStyles();
		view.setDisabled(true);
		setCorrectImage();
		view.showCorrectAnswers();
		view.removeClass("ui-state-disabled");
	}

	private void hideAnswers() {
		if (!model.isActivity() && isConnectedWithMath) {
			this.isShowAnswersActive = false;
			view.setDisabled(false);
		}

		if ((!model.isActivity() || !this.isShowAnswersActive)) { return; }

		this.isShowAnswersActive = false;

		view.resetStyles();
		view.setDisabled(false);
		view.clearAltText();
		view.setImageUrl("");
		setState(currentState);
		readyToDraggableItem = userReadyToDraggableItem;
		userReadyToDraggableItem = null;
	}

	private void handleLimitedCheck(HashMap<String, String> data) {
		if (!model.displayResponseContainer()) {
			return;
		}

		if (data.containsKey("score") && data.containsKey("errors")) {
			view.handleLimitedCheck(Integer.parseInt(data.get("score")), Integer.parseInt(data.get("errors")), false);
		} else if (data.containsKey("value")) {
			view.handleLimitedCheck(-1, -1, true);
		}
	}

	@Override
	public void setShowErrorsMode() {
		if (this.isShowAnswersActive) hideAnswers();
		if (!isShowErrorsMode) {
			workModeDisabled = view.getDisabled();
		}

		isShowErrorsMode = true;
		view.setDisabled(true);
		if (model.isActivity()) {
			if (getScore() > 0) {
				view.showAsCorrect();
			} else {
				view.showAsError();
			}
		}
		view.removeClass("ui-state-disabled");
	}

	@Override
	public void setWorkMode() {
		view.resetStyles();
		view.setDisabled(workModeDisabled);
		isShowErrorsMode = false;
	}

	@Override
	public void reset(boolean isOnlyWrongAnswers) {
		if (isShowAnswersActive) {
			hideAnswers();
		}

		if (isShowErrorsMode) {
			setWorkMode();
		}

		if (this.consumedItem != null) {
			this.removeItem(false);
		}

		readyToDraggableItem = null;
		consumedItem = null;
		view.clearAltText();
		view.setImageUrl("");
		view.setDisabled(model.isDisabled());

		if (model.isVisible()) {
			view.show();
		} else {
			view.hide();
		}
	}

	@Override
	public void addView(IModuleView display) {
		if (display instanceof IDisplay) {
			view = (IDisplay) display;
			view.addListener(new IViewListener() {
				@Override
				public void onClicked() {
					viewClicked();
				}
			});
			view.makeDroppable(this);
			view.setDisabled(model.isDisabled());
		}
	}

	private void viewClicked() {
		if (this.isShowAnswersActive || this.isShowErrorsMode) {
			return;
		}
		if (consumedItem == null) {
			insertItem();
		} else if (readyToDraggableItem != null) {
			removeItem(false);
			insertItem();
		} else {
			removeItem(true);
		}
	}

	private void removeItem(boolean shouldSendEvent) {
		if (consumedItem != null) {
			view.readRemoved();
			view.setImageUrl("");
			fireItemReturnedEvent(consumedItem);
			consumedItem = null;
			view.clearAltText();
			if(shouldSendEvent){
				ValueChangedEvent valueEvent = new ValueChangedEvent(model.getId(), "", "", "0");
				playerServices.getEventBus().fireEvent(valueEvent);
			}
			view.setLangTag("");
		}
	}

	private void insertItem() {
		if (readyToDraggableItem != null) {
			view.setAltText(getImageSourceAltText(readyToDraggableItem.getId()));
			view.setImageUrl(readyToDraggableItem.getValue());
			consumedItem = readyToDraggableItem;
			String langAttribute = getSourceLangTag(consumedItem.getId());
			fireItemConsumedEvent();
			String score = Integer.toString(getScore());
			ValueChangedEvent valueEvent = new ValueChangedEvent(model.getId(), "", consumedItem.getId(), score);
			playerServices.getEventBus().fireEvent(valueEvent);
			if (getScore() == 1) {
				ValueChangedEvent isAllOKEvent = new ValueChangedEvent(model.getId(), "all", "", "");
				playerServices.getEventBus().fireEvent(isAllOKEvent);
			}
			view.makeDraggable(this);
			if (getScore() == 0 && model.shouldBlockWrongAnswers()) {
				removeItem(false);
			}
			view.setLangTag(langAttribute);
			view.readInserted();
		}
	}

	private String getSourceLangTag(String id) {
		IPresenter presenter = playerServices.getModule(id);
		if (presenter != null && presenter instanceof ImageSourcePresenter) {
			ImageSourcePresenter isp = (ImageSourcePresenter) presenter;
			return isp.getLangAttribute();
		}
		return "";
	}

	private void setCorrectImage() {
		String[] answers = model.getAnswerId().split(";");

		if (answers[0].isEmpty()) {
		    return;
		}

		ImageSourcePresenter imageSourcePresenter = (ImageSourcePresenter) playerServices.getModule(answers[0]);
		view.setImageUrl(imageSourcePresenter.getImageUrl());
		view.setAltText(imageSourcePresenter.getAltText());
		view.setLangTag(imageSourcePresenter.getLangAttribute());
	}

	private void fireItemReturnedEvent(DraggableItem previouslyConsumedItem) {
		ItemReturnedEvent event = new ItemReturnedEvent(previouslyConsumedItem);
		playerServices.getEventBus().fireEvent(event);

		sendEventCode(model.getEventCode(ImageGapModule.EVENT_EMPTY));
	}

	private void sendEventCode(String eventCode) {
		if (eventCode != null && !eventCode.isEmpty()) {
			playerServices.getCommands().executeEventCode(eventCode);
		}
	}

	private void fireItemConsumedEvent() {
		ItemConsumedEvent event = new ItemConsumedEvent(readyToDraggableItem);
		playerServices.getEventBus().fireEventFromSource(event, this);

		if (isCorrect()) {
			sendEventCode(model.getEventCode(ImageGapModule.EVENT_CORRECT));
		} else {
			sendEventCode(model.getEventCode(ImageGapModule.EVENT_WRONG));
		}
	}

	@Override
	public String getSerialId() {
		return model.getId();
	}

	@Override
	public String getState() {
		IJsonServices json = playerServices.getJsonServices();
		HashMap<String, String> state = new HashMap<String, String>();
		if (consumedItem != null) {
			state.put("consumed",  consumedItem.toString());
			state.put("langTag", view.getLang());
		}
		state.put("isVisible", Boolean.toString(isVisible));
		if (isShowErrorsMode) {
			state.put("isDisabled", Boolean.toString(workModeDisabled));
		} else if (this.isShowAnswersActive) {
			state.put("isDisabled", Boolean.toString(showAnswersModeDisabled));
		} else {
			state.put("isDisabled", Boolean.toString(view.getDisabled()));
		}

		return json.toJSONString(state);
	}

	private String getImageURL(DraggableItem item) {
		String moduleId = item.getId();
		ImageSourcePresenter imageSource = (ImageSourcePresenter) this.playerServices.getModule(moduleId);

		return imageSource.getImageUrl();
	}

	@Override
	public void setState(String stateObj) {
		IJsonServices json = playerServices.getJsonServices();
		HashMap<String, String> state = json.decodeHashMap(stateObj);
		if (state.containsKey("consumed")) {
			consumedItem = DraggableItem.createFromString(state.get("consumed"));
			view.setImageUrl(getImageURL(consumedItem));
			view.setAltText(getImageSourceAltText(consumedItem.getId()));
			view.makeDraggable(this);
			if (state.containsKey("langTag")){
				view.setLangTag(state.get("langTag"));
			}
		}
		if (state.containsKey("isVisible")) {
			if (Boolean.parseBoolean(state.get("isVisible"))) {
				show();
			} else {
				hide();
			}
		}

		if (state.containsKey("isDisabled")) {
			view.setDisabled(Boolean.parseBoolean(state.get("isDisabled")));
		}
	}

	@Override
	public int getErrorCount() {
	    return consumedItem != null && getScore() == 0 && model.isActivity() ? 1 : 0;
	}

	@Override
	public int getMaxScore() {
	    return model.isActivity() ? 1 : 0;
	}

	@Override
	public int getScore() {
	    return model.isActivity() && isCorrect() ? 1 : 0;
	}

	public boolean isCorrect() {
		if (consumedItem != null) {
			String[] answers = model.getAnswerId().split(";");
			for (int i = 0; i < answers.length; i++) {
				String answer = answers[i];
				if (consumedItem.getId().compareTo(answer) == 0) {
					return true;
				}
			}
		}

		return false;
	}

	@Override
	public String getName() {
		return model.getId();
	}

	@Override
	public String executeCommand(String commandName, List<IType> args) {

		String value = "";

		if (commandName.compareTo("getimageid") == 0) {
			if (consumedItem != null) {
				value = getImageId();
			}
		} else if(commandName.compareTo("show") == 0) {
			show();
		} else if(commandName.compareTo("hide") == 0) {
			hide();
		} else if(commandName.compareTo("markgapascorrect") == 0) {
			markGapAsCorrect();
		} else if(commandName.compareTo("markgapaswrong") == 0) {
			markGapAsWrong();
		} else if(commandName.compareTo("markgapasempty") == 0) {
			markGapAsEmpty();
		} else if(commandName.compareTo("disable") == 0) {
			disable();
		} else if(commandName.compareTo("enable") == 0) {
			enable();
		} else if(commandName.compareTo("reset") == 0) {
			reset(false);
		} else if (commandName.compareTo("getscore") == 0) {
			return String.valueOf(getScore());
		} else if (commandName.compareTo("geterrorcount") == 0) {
			return String.valueOf(getErrorCount());
		} else if (commandName.compareTo("getmaxscore") == 0) {
			return String.valueOf(getMaxScore());
		} else if (commandName.compareTo("setshowerrorsmode") == 0) {
			setShowErrorsMode();
		} else if (commandName.compareTo("setworkmode") == 0) {
			setWorkMode();
		} else if (commandName.compareTo("showanswers") == 0) {
			showAnswers();
		} else if (commandName.compareTo("hideanswers") == 0) {
			hideAnswers();
		}

		return value;
	}

	public void disable() {
		view.setDisabled(true);
	}

	public void enable(){
		view.setDisabled(false);
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
		return view.getDisabled();
	}

	@Override
	public int getActivitiesCount() {
		return 1;
	}

	private String getValue() {
		return getState();
	}

	private void setGapAnswer(int index, String value) {
		isSetGapAnswers = true;
		ImageSourcePresenter igp = (ImageSourcePresenter) playerServices.getModule(value.replaceAll("\"", ""));
		view.setImageUrl(igp.getImageUrl());
		view.resetStyles();
		view.setDisabled(true);
		view.showCorrectAnswers();
		view.removeClass("ui-state-disabled");
	}

	private void setUserValue(int index, String value) {
		reset(false);
		setState(value);
	}

	@Override
	public boolean isActivity() {
		return model.isActivity();
	}

	private void markConnectionWithMath() {
		isConnectedWithMath = true;
	}

	private void jsOnEventReceived (String eventName, String jsonData) {
		this.onEventReceived(eventName, jsonData == null ? new HashMap<String, String>() : (HashMap<String, String>)JavaScriptUtils.jsonToMap(jsonData));
	}

	private native JavaScriptObject initJSObject(ImageGapPresenter x) /*-{

		var presenter = function() {};

		presenter.getValue = function(index) {
			return x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::getValue()();
		}

		presenter.setGapAnswer = function(index, val) {
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::setGapAnswer(ILjava/lang/String;)(index, val);
		}

		presenter.setUserValue = function(index, val) {
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::setUserValue(ILjava/lang/String;)(index, val);
		}
		
		presenter.markConnectionWithMath = function() {
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::markConnectionWithMath()();
		}

		presenter.isActivity = function() {
			return x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::isActivity()();
		}

		presenter.getImageId = function() {
			return x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::getImageId()();
		}

		presenter.getGapValue = function() {
			return x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::getImageId()();
		}

		presenter.isGapAttempted = function() {
			return x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::isGapAttempted()();
		}

		presenter.show = function() {
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::show()();
		}

		presenter.hide = function() {
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::hide()();
		}

		presenter.reset = function() {
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::reset(Z)(false);
		}

		presenter.markGapAsCorrect = function() {
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::markGapAsCorrect()();
		}

		presenter.markGapAsWrong = function() {
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::markGapAsWrong()();
		}

		presenter.markGapAsEmpty = function() {
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::markGapAsEmpty()();
		}
		presenter.isAttempted = function() {
			return x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::isAttempted()();
		}
		presenter.getView = function() {
			return x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::getView()();
		}
		presenter.itemDragged = function() {
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::itemDragged()();
		}
		presenter.itemStopped = function() {
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::itemStopped()();
		}
		presenter.isDragPossible = function() {
			return x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::isDragPossible()();
		}
		presenter.dropHandler = function() {
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::dropHandler()();
		}
		presenter.disable = function() {
			return x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::disable()();
		}
		presenter.enable = function() {
			return x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::enable()();
		}
		presenter.isAllOK = function() {
			return x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::isAllOK()();
		}
		
		presenter.onEventReceived = function (eventName, data) {
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::jsOnEventReceived(Ljava/lang/String;Ljava/lang/String;)(eventName, JSON.stringify(data));
		};

		presenter.getScore = function() {
			return x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::getScore()();
		};

		presenter.getErrorCount = function() {
			return x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::getErrorCount()();
		};

		presenter.getMaxScore = function() {
			return x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::getMaxScore()();
		};

		presenter.setShowErrorsMode = function() {
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::setShowErrorsMode()();
		};

		presenter.setWorkMode = function() {
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::setWorkMode()();
		};

		presenter.showAnswers = function() {
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::showAnswers()();
		};

		presenter.hideAnswers = function() {
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::hideAnswers()();
		};

		return presenter;
	}-*/;

	private HashMap<String, String> prepareEventData() {
		if (consumedItem != null) {
			HashMap<String, String> eventData = new HashMap<String, String>();
			eventData.put("item", consumedItem.getId());
			eventData.put("type", "image");
			eventData.put("value", consumedItem.getValue());
			currentEventData = eventData;
		}
		return currentEventData;
	}

	private boolean isElementToDrag () {
		return this.consumedItem != null || this.currentEventData != null;
	}

	private void itemDragged() {
		if (!this.isElementToDrag()) {
			return;
		}

		CustomEvent dragEvent = new CustomEvent("itemDragged", prepareEventData());
		removeItem(true);
		playerServices.getEventBus().fireEvent(dragEvent);
	}

	private void itemStopped() {
		if (!this.isElementToDrag()) {
			return;
		}

		CustomEvent stopEvent = new CustomEvent("itemStopped", prepareEventData());
		playerServices.getEventBus().fireEvent(stopEvent);
	}

	private boolean isDragPossible() {
		if (this.isShowAnswersActive || view.getDisabled() || !this.isElementToDrag()) {
			return false;
		}
		return true;
	}

	private void dropHandler() {
		removeItem(true);
		insertItem();
	}

	private boolean isAllOK() {
		if (getScore() == 1) {
			return true;
		} else {
			return false;
		}
	}

	private Element getView() {
		return view.getElement();
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

	private String getImageId() {
		return consumedItem == null ? "" : consumedItem.getId();
	}

	private boolean isGapAttempted() {
		return !getImageId().equals("");
	}

	private void markGapAsCorrect() {
		view.showAsCorrect();
	}

	private void markGapAsWrong() {
		view.markGapAsWrong();
	}

	private void markGapAsEmpty() {
		view.markGapAsEmpty();
	}

	private boolean isAttempted() {
		if (model.isActivity()) {
			return view.isAttempted();
		} else {
			return true;
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
		boolean isVisible = !this.getView().getStyle().getVisibility().equals("hidden") && !this.getView().getStyle().getDisplay().equals("none");
		boolean isGroupDivHidden = KeyboardNavigationController.isParentGroupDivHidden(view.getElement());
		return (isTextToSpeechOn || haveStandaloneKeyboardNavigationSupport()) && isVisible && !isGroupDivHidden;
	}
	
	@Override
	public boolean haveStandaloneKeyboardNavigationSupport() {
		return !model.shouldOmitInKeyboardNavigation() && !this.model.isDisabled();
	}

	private String getImageSourceAltText(String id) {
		IPresenter presenter = playerServices.getModule(id);
		if(presenter instanceof ImageSourcePresenter) {
			ImageSourcePresenter imageSourcePresenter = (ImageSourcePresenter) presenter;
			return imageSourcePresenter.getAltText();
		}
		return "";
	}

	@Override
	public void onEventReceived(String eventName, HashMap<String, String> data) {
		if (eventName == "ShowAnswers") {
			showAnswers();
		} else if (eventName == "HideAnswers") {
			hideAnswers();
		} else if (eventName == "LimitedCheck") {
			handleLimitedCheck(data);
		}
	}

}