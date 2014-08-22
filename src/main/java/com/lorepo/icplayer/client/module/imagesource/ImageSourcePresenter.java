package com.lorepo.icplayer.client.module.imagesource;

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
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableImage;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableItem;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemConsumedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemReturnedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemSelectedEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;


public class ImageSourcePresenter implements IPresenter, IStateful, ICommandReceiver{

	public interface IDisplay extends IModuleView{
		public void select();
		public void deselect();
		public void showImage();
		public void hideImage();
		public void addListener(IViewListener l);
		public void getImageUrl();
		public Element getElement();
	}
	
	private ImageSourceModule model;
	private IDisplay view;
	private IPlayerServices playerServices;
	boolean selected = false;
	boolean visible = true;
	private JavaScriptObject jsObject;
	
	
	public ImageSourcePresenter(ImageSourceModule model, IPlayerServices services){

		this.model = model;
		this.playerServices = services;
		
		connectHandlers();
	}


	private void connectHandlers() {
	
		EventBus eventBus = playerServices.getEventBus();
		
		eventBus.addHandler(ItemSelectedEvent.TYPE, new ItemSelectedEvent.Handler() {
			public void onItemSelected(ItemSelectedEvent event) {
				if(event.getSource() != ImageSourcePresenter.this){
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
		
	}

	
	private void itemConsumed(DraggableItem draggableItem) {
	
		deselectImage();
		if(model.getId().compareTo(draggableItem.getId()) == 0 && model.isRemovable()){
			view.hideImage();
			visible = false;
		}
	}

	private void itemReturned(DraggableItem draggableItem) {
		
		if(model.getId().compareTo(draggableItem.getId()) == 0){
			view.showImage();
			visible = true;
		}
	}

	private void reset() {
		deselectImage();
		visible = true;
		view.showImage();
	}


	private void deselectImage() {

		if(selected){
			selected = false;
			view.deselect();
		}
	}


	@Override
	public void addView(IModuleView display) {
		
		if(display instanceof IDisplay){
			view = (IDisplay) display;
			view.addListener(new IViewListener() {
				public void onClicked() {
					imageClicked();
				}
			});
		}
	}
	
	
	private void imageClicked(){
		
		DraggableItem draggableItem = null;
		
		selected = !selected;
		if(selected){
			view.select();
			draggableItem = new DraggableImage(model.getId(), model.getUrl());
		}
		else{
			view.deselect();
		}
		
		ItemSelectedEvent event = new ItemSelectedEvent(draggableItem);
		playerServices.getEventBus().fireEventFromSource(event, this);
		
	}


	@Override
	public String getSerialId() {
		return model.getId();
	}


	@Override
	public String getState() {
		return Boolean.toString(visible);
	}


	@Override
	public void setState(String state) {
		
		visible = Boolean.parseBoolean(state);
		if(!visible){
			view.hideImage();
		}
	}


	@Override
	public IModuleModel getModel() {
		return model;
	}
	
	public JavaScriptObject getAsJavaScript(){
		if(jsObject == null){
			jsObject = initJSObject(this);
		}
		return jsObject;
	}

	
	private native JavaScriptObject initJSObject(ImageSourcePresenter x) /*-{
	
		var presenter = function(){}
			
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
		if(commandName.compareTo("reset") == 0) {
			reset();
		}
		
		return "";
	}
	
}
