package com.lorepo.icplayer.client.module.imagesource;

import java.util.HashMap;
import java.util.List;

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
import com.lorepo.icplayer.client.module.api.event.PageLoadedEvent;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableImage;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableItem;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemConsumedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemReturnedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemSelectedEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.page.KeyboardNavigationController;


public class ImageSourcePresenter implements IPresenter, IStateful, ICommandReceiver, IWCAGPresenter, IButton {

	public interface IDisplay extends IModuleView{
		public void show(boolean refreshPosition);
		public void hide();
		public void select();
		public void deselect();
		public void addListener(IViewListener l);
		public Element getElement();
		public void makeDraggable(ImageSourcePresenter imageSourcePresenter);
		public void getInitialPosition();
		public void setDisabled(boolean disable);
		boolean getDisabled();
		public void unsetDragMode();
		public void setDragMode();
	}
	
	private ImageSourceModule model;
	private IDisplay view;
	private IPlayerServices playerServices;
	boolean selected = false;
	boolean isImageVisible = true;
	private boolean isModuleVisible;
	private JavaScriptObject jsObject;
	private boolean canDrag = true;
	private boolean returned = false;
	
	private boolean positionsWereFetched = false;
	
	public ImageSourcePresenter(ImageSourceModule model, IPlayerServices services) {
		this.model = model;
		this.playerServices = services;
		this.isModuleVisible = model.isVisible();
		
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
		
		eventBus.addHandler(ItemSelectedEvent.TYPE, new ItemSelectedEvent.Handler() {
			public void onItemSelected(ItemSelectedEvent event) {
				if (event.getSource() != ImageSourcePresenter.this) {
					deselectImage();
				}
			}
		});
		
		eventBus.addHandler(ItemConsumedEvent.TYPE, new ItemConsumedEvent.Handler() {
			public void onItemConsumed(ItemConsumedEvent event) {
				itemConsumed(event.getItem());
			}
		});
		
		eventBus.addHandler(ItemReturnedEvent.TYPE, new ItemReturnedEvent.Handler() {
			public void onItemReturned(ItemReturnedEvent event) {
				itemReturned(event.getItem());
			}
		});
		
		eventBus.addHandler(ResetPageEvent.TYPE, new ResetPageEvent.Handler() {
			public void onResetPage(ResetPageEvent event) {
				reset(event.getIsOnlyWrongAnswers());
			}
		});
		
		eventBus.addHandler(PageLoadedEvent.TYPE, new PageLoadedEvent.Handler() {
			public void onPageLoaded(PageLoadedEvent event) {
				view.getInitialPosition();
				positionsWereFetched = true;
			}
		});
		
		eventBus.addHandler(CustomEvent.TYPE, new CustomEvent.Handler() {
			@Override
			public void onCustomEventOccurred(CustomEvent event) {
				onEventReceived(event.eventName, event.getData());
			}
		});
	}

	private void itemConsumed(DraggableItem draggableItem) {
		deselectImage();
		if (model.getId().compareTo(draggableItem.getId()) == 0 && model.isRemovable()) {
			view.hide();
			isImageVisible = false;
			returned = false;
		}
	}

	private void itemReturned(DraggableItem draggableItem) {
		if (model.getId().compareTo(draggableItem.getId()) == 0) {
			isImageVisible = true;
			
			if (isModuleVisible) {
				view.show(true);
				returned = true;
			}
		}
	}

	@Override
	public void reset(boolean isOnlyWrongAnswers) {
		view.setDisabled(false);
		deselectImage();
		isImageVisible = true;
		isModuleVisible = model.isVisible();
		canDrag = true;

		if (!this.positionsWereFetched) {
			view.getInitialPosition();
			this.positionsWereFetched = true;
		}
		
		if (isModuleVisible && isImageVisible) {
			view.show(true);
		} else {
			view.hide();
		}
		
		view.setDisabled(model.isDisabled());
	}

	private void deselectImage() {
		if (selected) {
			selected = false;
			view.deselect();
		}
	}

	@Override
	public void addView(IModuleView display) {
		
		if (display instanceof IDisplay) {
			view = (IDisplay) display;
			view.addListener(new IViewListener() {
				public void onClicked() {
					if (!canDrag) {
						return;
					}
					imageClicked();
				}
				public void onDragged() {
					if (!canDrag) {
						return;
					}
					imageDragged();
				}
			});
			view.makeDraggable(this);
			view.setDisabled(model.isDisabled());
		}
	}
	
	private void imageClicked() {
		selected = !selected;
		if (selected) {
			imageSelected();
		} else {
			imageDeselected();
		}
	}
	
	private void imageSelected() {
		selected = true;
		DraggableItem draggableItem = new DraggableImage(model.getId(), model.getUrl());
		view.select();
		ItemSelectedEvent event = new ItemSelectedEvent(draggableItem);
		playerServices.getEventBus().fireEventFromSource(event, this);
	}
	
	private void imageDeselected() {
		selected = false;
		DraggableItem draggableItem = new DraggableImage(null, null);
		view.deselect();
		ItemSelectedEvent deselectItemEvent = new ItemSelectedEvent(draggableItem);
		playerServices.getEventBus().fireEventFromSource(deselectItemEvent, this);
	}
	
	private void imageDragged() {
		selected = true;
		DraggableItem draggableItem = new DraggableImage(model.getId(), model.getUrl());
		view.select();
		
		ItemSelectedEvent event = new ItemSelectedEvent(draggableItem);
		playerServices.getEventBus().fireEventFromSource(event, this);
	}

	@Override
	public String getSerialId() {
		return model.getId();
	}

	@Override
	public String getState() {
		HashMap<String, String> state = new HashMap<String, String>();
		state.put("isImageVisible", Boolean.toString(isImageVisible));
		state.put("isModuleVisible", Boolean.toString(isModuleVisible));
		state.put("isDisabled", Boolean.toString(view.getDisabled()));
		
		return JSONUtils.toJSONString(state);
	}

	@Override
	public void setState(String state) {
		if (state == null || state.equals("")) {
			return;
		}
		
		if (state.equals("true") || state.equals("false")) {
			isImageVisible = Boolean.parseBoolean(state);
			isModuleVisible = true;
		} else {
			HashMap<String, String> decodedState = JSONUtils.decodeHashMap(state);
			isImageVisible = Boolean.parseBoolean(decodedState.get("isImageVisible"));
			isModuleVisible = Boolean.parseBoolean(decodedState.get("isModuleVisible"));
		}
		
		if (isImageVisible && isModuleVisible) {
			view.show(false);
		} else {
			view.hide();
		}
		
		HashMap<String, String> stateHash = JSONUtils.decodeHashMap(state);
		if(stateHash.containsKey("isDisabled")){
			if(Boolean.parseBoolean(stateHash.get("isDisabled"))){
				view.setDisabled(true);
			}else{
				view.setDisabled(false);
			}
		}else{
			view.setDisabled(false);
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
		return view.getDisabled();
	}

	private void jsOnEventReceived (String eventName, String jsonData) {
		this.onEventReceived(eventName, jsonData == null ? new HashMap<String, String>() : (HashMap<String, String>)JavaScriptUtils.jsonToMap(jsonData));
	}
	
	private native JavaScriptObject initJSObject(ImageSourcePresenter x) /*-{
	
		var presenter = function() {};
			
		presenter.show = function(){ 
			x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::show()();
		};
			
		presenter.hide = function(){ 
			x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::hide()();
		};
		
		presenter.getView = function() { 
			return x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::getView()();
		};
		
		presenter.reset = function() { 
			return x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::reset(Z)(false);
		}
		
		presenter.getAltText = function() {
			return x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::getAltText()();
		}
		
		presenter.getLangAttribute = function() {
			return x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::getLangAttribute()();
		}
		
		presenter.getImageUrl = function() {
			return x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::getImageUrl()();
		}
		
		presenter.isDragPossible = function() {
			return x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::isDragPossible()();
		};
		
		presenter.shouldRevert = function() { 
			return x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::shouldRevert()();
		};
		
		presenter.isRemovable = function() { 
			return x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::isRemovable()();
		};
		
		presenter.disable = function() {
			return x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::disable()();
		}
		
		presenter.enable = function() {
			return x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::enable()();
		}
		
		presenter.setDragMode = function() {
			x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::setDragMode()();
		}
		
		presenter.unsetDragMode = function() {
			x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::unsetDragMode()();
		}
		
		presenter.onEventReceived = function (eventName, data) {
			x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::jsOnEventReceived(Ljava/lang/String;Ljava/lang/String;)(eventName, JSON.stringify(data));
		};
		
		return presenter;
	}-*/;
	
	public boolean shouldRevert() {
		return selected;
	}
	
	private boolean isRemovable() {
		return model.isRemovable();
	}
	
	private void setDragMode() {
		view.setDragMode();
	}
	
	private void unsetDragMode() {
		view.unsetDragMode();
	}
	
	private void show(){
		isModuleVisible = true;

		if (view != null) {
			if (isImageVisible) {
				if (!this.positionsWereFetched) {
					view.getInitialPosition();
					this.positionsWereFetched = true;
				}
				view.show(true);
			}
		}
	}
	
	
	private void hide(){
		isModuleVisible = false;
		if (view != null) {
			view.hide();
		}
	}
	
	private Element getView(){
		return view.getElement();
	}

	@Override
	public String getName() {
		return model.getId();
	}

	public String getImageUrl() {
		return model.getUrl();
	}
	
	private boolean isDragPossible() {
		return canDrag;
	}
	
	@Override
	public String executeCommand(String commandName, List<IType> params) {
		if(commandName.compareTo("show") == 0) {
			show();
		} else if (commandName.compareTo("hide") == 0) {
			hide();
		} else if (commandName.compareTo("reset") == 0) {
			reset(false);
		} else if (commandName.compareTo("getimageurl") == 0) {
			return getImageUrl();
		}else if (commandName.compareTo("disable") == 0) {
			disable();
		}else if (commandName.compareTo("enable") == 0) {
			enable();
		}
		
		return "";
	}

	@Override
	public void setShowErrorsMode() {
		// Module is not an activity
		canDrag = false;
	}

	@Override
	public void setWorkMode() {
		// Module is not an activity
		canDrag = true;
	}
	
	public void disable() {
		view.setDisabled(true);
	}
	
	public void enable(){
		view.setDisabled(false);
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
		final boolean isVisible = !this.getView().getStyle().getVisibility().equals("hidden") 
				&& !this.getView().getStyle().getDisplay().equals("none")
				&& !KeyboardNavigationController.isParentGroupDivHidden(view.getElement());
		return (isTextToSpeechOn || haveStandaloneKeyboardNavigationSupport()) && isVisible;
	}
	
	@Override
	public boolean haveStandaloneKeyboardNavigationSupport() {
		return !model.shouldOmitInKeyboardNavigation() && !this.view.getDisabled();
	}

	public String getAltText(){
		return this.model.getAlttext();
	}
	
	public String getLangAttribute(){
		return this.model.getLangAttribute();
	}

	@Override
	public void onEventReceived(String eventName, HashMap<String, String> data) {
		if (eventName == "ShowAnswers") {
			canDrag = false;
			return;
		} else if (eventName == "HideAnswers") {
			canDrag = true;
			return;
		}
		String gotItem = data.get("item");
		if (gotItem != getSerialId()) {
			return;
		}
		if (eventName == "itemDragged") {
			imageSelected();
			if (model.isRemovable()) {
				view.hide();
			}
		} else if (eventName == "itemStopped") {
			imageDeselected();
			if (model.isRemovable() && returned) {
				view.show(true);
			}
		}
		
	}
}
