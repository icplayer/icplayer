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
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.CustomEvent;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableImage;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableItem;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemConsumedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemReturnedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemSelectedEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;


public class ImageSourcePresenter implements IPresenter, IStateful, ICommandReceiver{

	public interface IDisplay extends IModuleView{
		public void show();
		public void hide();
		public void select();
		public void deselect();
		public void addListener(IViewListener l);
		public void getImageUrl();
		public Element getElement();
		public void makeDraggable(ImageSourcePresenter imageSourcePresenter);
		public void setDisabled(boolean disable);
		boolean getDisabled();
	}
	
	private ImageSourceModule model;
	private IDisplay view;
	private IPlayerServices playerServices;
	boolean selected = false;
	boolean isImageVisible = true;
	private boolean isModuleVisible;
	private JavaScriptObject jsObject;
	private boolean canDrag = true;
	
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
				reset();
			}
		});
		
		eventBus.addHandler(CustomEvent.TYPE, new CustomEvent.Handler() {
			@Override
			public void onCustomEventOccurred(CustomEvent event) {
				if (event.eventName == "ShowAnswers") {
					canDrag = false;
				} else if (event.eventName == "HideAnswers") {
					canDrag = true;
				}
				String gotItem = event.getData().get("item");
				if (gotItem != getSerialId()) {
					return;
				}
				if (event.eventName == "itemDragged") {
					imageSelected();
				} else if (event.eventName == "itemStopped") {
					imageDeselected();
				}
			}
		});
	}

	private void itemConsumed(DraggableItem draggableItem) {
		deselectImage();
		if (model.getId().compareTo(draggableItem.getId()) == 0 && model.isRemovable()) {
			view.hide();
			isImageVisible = false;
		}
	}

	private void itemReturned(DraggableItem draggableItem) {
		if (model.getId().compareTo(draggableItem.getId()) == 0) {
			isImageVisible = true;
			
			if (isModuleVisible) {
				view.show();
			}
		}
	}

	@Override
	public void reset() {
		view.setDisabled(false);
		deselectImage();
		isImageVisible = true;
		isModuleVisible = model.isVisible();
		canDrag = true;
		
		if (isModuleVisible && isImageVisible) {
			view.show();
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
			view.show();
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
			return x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::reset()();
		}
		
		presenter.getImageUrl = function() {
			return x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::getImageUrl()();
		}
		
		presenter.isDragPossible = function() {
			return x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::isDragPossible()();
		}
		
		presenter.disable = function() {
			return x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::disable()();
		}
		
		presenter.enable = function() {
			return x.@com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter::enable()();
		}
		
		return presenter;
	}-*/;
	
	private void show(){
		isModuleVisible = true;

		if (view != null) {
			if (isImageVisible) {
				view.show();
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
			reset();
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
}
