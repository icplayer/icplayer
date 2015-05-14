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
	}
	
	private ImageSourceModule model;
	private IDisplay view;
	private IPlayerServices playerServices;
	boolean selected = false;
	boolean isImageVisible = true;
	private boolean isModuleVisible;
	private JavaScriptObject jsObject;
	
	public ImageSourcePresenter(ImageSourceModule model, IPlayerServices services) {
		this.model = model;
		this.playerServices = services;
		this.isModuleVisible = model.isVisible();
		
		connectHandlers();
	}

	private void connectHandlers() {
	
		EventBus eventBus = playerServices.getEventBus();
		
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
				String gotItem = event.getData().get("item");
				if (gotItem != getSerialId()) {
					return;
				}
				if (event.eventName == "itemDragged") {
					imageClicked();
				} else if (event.eventName == "itemStopped") {
					deselectImage();
					ItemSelectedEvent e = new ItemSelectedEvent(null);
					playerServices.getEventBus().fireEventFromSource(e, this);
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

	private void reset() {
		deselectImage();
		isImageVisible = true;
		isModuleVisible = model.isVisible();
		
		if (isModuleVisible && isImageVisible) {
			view.show();
		} else {
			view.hide();
		}
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
					imageClicked();
				}
				public void onDragged() {
					imageDragged();
				}
			});
		}
	}
	
	private void imageClicked() {
		DraggableItem draggableItem = new DraggableImage(null, null);
		
		selected = !selected;
		if (selected) {
			draggableItem = new DraggableImage(model.getId(), model.getUrl());
			view.select();
		} else {
			view.deselect();
		}
		
		ItemSelectedEvent event = new ItemSelectedEvent(draggableItem);
		playerServices.getEventBus().fireEventFromSource(event, this);
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
			JavaScriptUtils.log("Show");
			view.show();
		} else {
			JavaScriptUtils.log("Hide");
			view.hide();
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
		}
		
		return "";
	}
	
}
