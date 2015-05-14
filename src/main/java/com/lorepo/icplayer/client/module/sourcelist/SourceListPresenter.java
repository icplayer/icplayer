package com.lorepo.icplayer.client.module.sourcelist;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IStringType;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icf.utils.JSONUtils;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.RandomUtils;
import com.lorepo.icplayer.client.module.api.IActivity;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.IStateful;
import com.lorepo.icplayer.client.module.api.event.CustomEvent;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableItem;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableText;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemConsumedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemReturnedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemSelectedEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter.IOptionDisplay;
import com.lorepo.icplayer.client.module.choice.IOptionListener;

public class SourceListPresenter implements IPresenter, IStateful, ICommandReceiver, IOptionListener, IActivity {

	public interface IDisplay extends IModuleView{
		public void addItem(String id, String item, boolean callMathJax);
		public void removeItem(String id);
		public void removeAll();
		public void selectItem(String id);
		public void deselectItem(String id);
		public void addListener(IViewListener l);
		public Element getElement();
		public void show();
		public void hide();
		public Element getItem(String id);
		public Set<String> getCurrentLabels();
	}
	
	private IDisplay view;
	private SourceListModule model;
	private IPlayerServices playerServices;
	private String selectedId;
	private HashMap<String, String> items = new HashMap<String, String>();
	private JavaScriptObject jsObject;
	private boolean isVisible;
	
	
	public SourceListPresenter(SourceListModule model, IPlayerServices services){

		this.playerServices = services;
		this.model = model;
		this.isVisible = model.isVisible();
		
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
		
		eventBus.addHandler(CustomEvent.TYPE, new CustomEvent.Handler() {
			@Override
			public void onCustomEventOccurred(CustomEvent event) {
				String gotItem = event.getData().get("item");
				if (!gotItem.startsWith(getItemPrefix())) {
					return;
				}
				if (event.eventName == "itemDragged") {
					selectItem(gotItem);
				} else if (event.eventName == "itemStopped") {
					deselectCurrentItem();
					playerServices.getEventBus().fireEventFromSource(new ItemSelectedEvent(null), this);
				}
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
	
	private String getItemPrefix() {
		return model.getId() + "-";
	}
	
	protected void returnItem(DraggableItem item) {

		if(model.isRemovable()) {
			if(item.getId().startsWith(getItemPrefix())) {
				items.put(item.getId(), item.getValue());
				view.addItem(item.getId(), item.getValue(), true);
			}
		}
	}

	
	protected void reset() {
		deselectCurrentItem();
		loadItems(true);
		
		isVisible = this.model.isVisible();
		if (isVisible) {
			view.show();
		} else {
			view.hide();
		}
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
		
		List<Integer> order;
		
		if (model.isRandomOrder()) {
			order = RandomUtils.singlePermutation(model.getItemCount());
		} else {
			order = new ArrayList<Integer>();
			for(int i = 0; i < model.getItemCount(); i ++) {
				order.add(i);
			}
		}

		for(int i = 0; i < order.size(); i++) {
			Integer index = order.get(i);
			String itemText = model.getItem(index);
			String id = getItemPrefix() + (index+1);
			items.put(id, itemText);
			view.addItem(id, itemText, callMathJax);
		}
	}


	private void selectItem(String id) {
		DraggableItem draggableItem = null;
		String oldSelection = selectedId;
		deselectCurrentItem();
		
		if(oldSelection == null || oldSelection.compareTo(id) != 0) {
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
		HashMap<String, String> state = new HashMap<String, String>();
		state.put("isVisible", Boolean.toString(isVisible));
		state.put("items", JSONUtils.toJSONString(items));
		
		return JSONUtils.toJSONString(state);
	}


	@Override
	public void setState(String state) {
		if (state == null || state.equals("")) {
			return;
		}
		
		HashMap<String, String> decodedState = JSONUtils.decodeHashMap(state);
		
		if (decodedState.containsKey("isVisible")) {
			isVisible = Boolean.parseBoolean(decodedState.get("isVisible"));
			items = JSONUtils.decodeHashMap(decodedState.get("items"));
		} else {
			isVisible = true;
			items = decodedState;
		}

		refreshView();
		
		if (isVisible) {
			view.show();
		} else {
			view.hide();
		}
	}
	
	private void refreshView() {
		
		Set<String> currentLabels = view.getCurrentLabels();
		
		for (String labelId : currentLabels) {
			if (!items.keySet().contains(labelId)) {
				view.removeItem(labelId);
			}
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
		
		presenter.reset = function() { 
			return x.@com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter::reset()();
		};
		
		presenter.show = function() {
			x.@com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter::show()();
		}

		presenter.hide = function() {
			x.@com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter::hide()();
		}
		
		presenter.getItem = function(id){ 
			return x.@com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter::getItem(I)(id);
		};
		
		presenter.getItemView = function(id){ 
			return x.@com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter::getItemView(Ljava/lang/String;)(id);
		};
		
		return presenter;
	}-*/;
	
	@Override
	public String executeCommand(String commandName, List<IType> params) {
		
		IStringType param = null;
		
		if(commandName.compareTo("reset") == 0) {
			reset();
		} else if (commandName.compareTo("getitem") == 0) {
			if (params.size() > 0 && params.get(0) instanceof IStringType) {
				param = (IStringType) params.get(0);
				return getItem(Integer.valueOf(param.getValue()));
			}
		} else if (commandName.compareTo("show") == 0){
			show();
		} else if (commandName.compareTo("hide") == 0){
			hide();
		}
		
		return "";
	}
	
	private String getItem(int index) {
		if(view != null && index > 0 && index <= model.getItemCount()){
			return model.getItem(index - 1);
		}
		
		return "[error]";
	}
	
	private Element getView(){
		return view.getElement();
	}
	
	private Element getItemView(String id){
		return view.getItem(id);
	}

	@Override
	public String getName() {
		return model.getId();
	}


	@Override
	public int getErrorCount() {
		// TODO Auto-generated method stub
		return 0;
	}


	@Override
	public int getMaxScore() {
		// TODO Auto-generated method stub
		return 0;
	}


	@Override
	public int getScore() {
		// TODO Auto-generated method stub
		return 0;
	}


	@Override
	public void onValueChange(IOptionDisplay option, boolean selected) {
		// TODO Auto-generated method stub
		
	}
	
	private void show(){
		isVisible = true;
		if(view != null){
			view.show();
		}
	}
	
	
	private void hide(){
		isVisible = false;
		if(view != null){
			view.hide();
		}
	}
}
