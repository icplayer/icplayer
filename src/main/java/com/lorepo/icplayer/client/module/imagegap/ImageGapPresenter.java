package com.lorepo.icplayer.client.module.imagegap;

import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IType;
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

public class ImageGapPresenter implements IPresenter, IActivity, IStateful, ICommandReceiver {

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

	public ImageGapPresenter(ImageGapModule model, IPlayerServices services) {
		this.model = model;
		this.playerServices = services;
		isVisible = model.isVisible();
		connectHandlers();
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
				reset();
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
				if (event.eventName.equals("ShowAnswers")) {
					showAnswers();
				} else if (event.eventName.equals("HideAnswers")) {
					hideAnswers();
				}
			}
		});
	}

	DraggableItem userReadyToDraggableItem = null;

	private void showAnswers() {
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
		if (!model.isActivity() || !this.isShowAnswersActive) { return; }

		this.isShowAnswersActive = false;

		reset();
		view.resetStyles();
		view.setDisabled(false);
		setState(currentState);
		readyToDraggableItem = userReadyToDraggableItem;
		userReadyToDraggableItem = null;
	}

	@Override
	public void setShowErrorsMode() {
		if (this.isShowAnswersActive) hideAnswers();
		isShowErrorsMode = true;
		workModeDisabled = view.getDisabled();
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
	public void reset() {
		readyToDraggableItem = null;
		consumedItem = null;
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
		if (consumedItem == null) {
			insertItem();
		} else {
			removeItem();
		}
	}

	private void removeItem() {
		if (consumedItem != null) {
			view.setImageUrl("");
			fireItemReturnedEvent(consumedItem);
			consumedItem = null;
			ValueChangedEvent valueEvent = new ValueChangedEvent(model.getId(), "", "", "0");
			playerServices.getEventBus().fireEvent(valueEvent);
		}
	}

	private void insertItem() {
		if (readyToDraggableItem != null) {
			view.setImageUrl(readyToDraggableItem.getValue());
			consumedItem = readyToDraggableItem;
			fireItemConsumedEvent();
			String score = Integer.toString(getScore());
			ValueChangedEvent valueEvent = new ValueChangedEvent(model.getId(), "", consumedItem.getId(), score);
			playerServices.getEventBus().fireEvent(valueEvent);
			view.makeDraggable(this);
		}
	}

	private void setCorrectImage() {
		String[] answers = model.getAnswerId().split(";");
		ImageSourcePresenter igp = (ImageSourcePresenter) playerServices.getModule(answers[0]);
		view.setImageUrl(igp.getImageUrl());
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
			view.makeDraggable(this);
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
	public String executeCommand(String commandName, List<IType> _) {

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
			reset();
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

	private String getValue() {
		return getState();
	}

	private void setGapAnswer(int index, String value) {
		ImageSourcePresenter igp = (ImageSourcePresenter) playerServices.getModule(value);
		view.setImageUrl(igp.getImageUrl());

		view.resetStyles();
		view.setDisabled(true);
		view.showCorrectAnswers();
	}

	private void setUserValue(int index, String value) {
		reset();
		setState(value);
	}

	private boolean isActivity() {
		return model.isActivity();
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
			x.@com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter::reset()();
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

	private void itemDragged() {
		CustomEvent dragEvent = new CustomEvent("itemDragged", prepareEventData());
		removeItem();
		playerServices.getEventBus().fireEvent(dragEvent);
	}

	private void itemStopped() {
		CustomEvent stopEvent = new CustomEvent("itemStopped", prepareEventData());
		playerServices.getEventBus().fireEvent(stopEvent);
	}

	private boolean isDragPossible() {
		if (this.isShowAnswersActive || view.getDisabled()) {
			return false;
		}
		return true;
	}

	private void dropHandler() {
		removeItem();
		insertItem();
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
		return getImageId() != "";
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
		return view.isAttempted();
	}

}