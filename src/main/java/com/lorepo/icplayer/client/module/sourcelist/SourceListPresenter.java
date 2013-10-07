package com.lorepo.icplayer.client.module.sourcelist;

import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icf.utils.JSONUtils;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableItem;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableText;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemConsumedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemReturnedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemSelectedEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;


public class SourceListPresenter implements IPresenter, IStateful{

	public interface IDisplay extends IModuleView{
		public void addItem(String id, String item, boolean callMathJax);
		public void removeItem(String id);
		public void removeAll();
		public void selectItem(String id);
		public void deselectItem(String id);
		public void addListener(IViewListener l);
		public Element getElement();
	}
	
	private IDisplay view;
	private SourceListModule model;
	private IPlayerServices playerServices;
	private String selectedId;
	private HashMap<String, String> items = new HashMap<String, String>();
	private JavaScriptObject jsObject;
	
	
	public SourceListPresenter(SourceListModule model, IPlayerServices services){

		this.playerServices = services;
		this.model = model;
		
		connectHandlers();
	}


	private void connectHandlers() {
	
		EventBus eventBus = playerServices.getEventBus();
		
		eventBus.addHandler(ItemSelectedEvent.TYPE, new ItemSelectedEvent.Handler() {
			public void onItemSelected(ItemSelectedEvent event) {
				if(event.getSource() != SourceListPresenter.this){
					deselectCurrentItem();
				}
			}
		});
		
		eventBus.addHandler(ItemConsumedEvent.TYPE, new ItemConsumedEvent.Handler() {
			public void onItemConsumed(ItemConsumedEvent event) {
				itemConsumed(event);
			}
		});
		
		eventBus.addHandler(ItemReturnedEvent.TYPE, new ItemReturnedEvent.Handler() {
			public void onItemReturned(ItemReturnedEvent event) {
				returnItem(event.getItem());
			}
		});
		
		eventBus.addHandler(ResetPageEvent.TYPE, new ResetPageEvent.Handler() {
			public void onResetPage(ResetPageEvent event) {
				reset();
			}
		});
		
	}

	
	private void itemConsumed(ItemConsumedEvent event) {
		
		deselectCurrentItem();
		if(model.isRemovable()){
			removeItem(event.getItem().getId());
		}
	}
	
	
	protected void returnItem(DraggableItem item){

		if(model.isRemovable()){
			String prefix = model.getId() + "-";
			if(item.getId().startsWith(prefix)){
				
				items.put(item.getId(), item.getValue());
				view.addItem(item.getId(), item.getValue(), true);
			}
		}
	}

	
	protected void reset() {
		deselectCurrentItem();
		loadItems(true);
	}


	protected void removeItem(String id) {
		if(items.containsKey(id)){
			view.removeItem(id);
			items.remove(id);
		}
	}


	private void loadItems(boolean callMathJax) {

		items.clear();
		view.removeAll();
		for(int i = 0; i < model.getItemCount(); i++){
			String itemText = model.getItem(i);
			String id = model.getId() + "-" + (i+1);
			items.put(id, itemText);
			view.addItem(id, itemText, callMathJax);
		}
	}


	private void selectItem(String id) {
		
		DraggableItem draggableItem = null;
		String oldSelection = selectedId;
		deselectCurrentItem();
		
		if(oldSelection == null || oldSelection.compareTo(id) != 0){
			selectedId = id;
			view.selectItem(id);
			draggableItem = new DraggableText(selectedId, items.get(selectedId));
		}
		
		ItemSelectedEvent event = new ItemSelectedEvent(draggableItem);
		playerServices.getEventBus().fireEventFromSource(event, this);
	}
	
	
	private void deselectCurrentItem() {
		
		if(selectedId != null){
			view.deselectItem(selectedId);
			selectedId = null;
		}
	}


	@Override
	public void addView(IModuleView display) {
		
		if(display instanceof IDisplay){
			view = (IDisplay) display;
			view.addListener(new IViewListener() {
				public void onItemCliked(String id) {
					selectItem(id);
				}
		
			});
			
			loadItems(false);
		}
	}


	@Override
	public String getSerialId() {
		return model.getId();
	}


	@Override
	public String getState() {
		return JSONUtils.toJSONString(items);
	}


	@Override
	public void setState(String state) {
		
		items = JSONUtils.decodeHashMap(state);
		refreshView();
	}
	
	private void refreshView() {

		view.removeAll();
		for(String id : items.keySet()){
			String text = items.get(id);
			view.addItem(id, text, false);
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

	private native JavaScriptObject initJSObject(SourceListPresenter x) /*-{
		var presenter = function() {}
		
		presenter.getView = function() { 
			return x.@com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter::getView()();
		}
		
		return presenter;
	}-*/;
	
	private Element getView(){
		return view.getElement();
	}
}
