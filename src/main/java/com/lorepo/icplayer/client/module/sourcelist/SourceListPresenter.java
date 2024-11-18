package com.lorepo.icplayer.client.module.sourcelist;

import java.util.*;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.shared.EventBus;
import com.lorepo.icf.scripting.ICommandReceiver;
import com.lorepo.icf.scripting.IStringType;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icf.utils.JSONUtils;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.RandomUtils;
import com.lorepo.icf.utils.TextToSpeechVoice;
import com.lorepo.icplayer.client.model.alternativeText.AlternativeTextService;
import com.lorepo.icplayer.client.model.alternativeText.IToken;
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
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableItem;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableText;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemConsumedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemReturnedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemSelectedEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter.IOptionDisplay;
import com.lorepo.icplayer.client.module.choice.IOptionListener;
import com.lorepo.icplayer.client.page.KeyboardNavigationController;
import com.lorepo.icplayer.client.module.text.AudioInfo;

public class SourceListPresenter implements IPresenter, IStateful, ICommandReceiver, IOptionListener, IActivity, IWCAGPresenter {

	public interface IDisplay extends IModuleView{
		public void addItem(String id, String item, boolean callMathJax);
		public void removeItem(String id);
		public void removeAll();
		public void selectItem(String id);
		public void deselectItem(String id, boolean read);
		public void addListener(IViewListener l);
		public Element getElement();
		public void show();
		public void hide();
		public Element getItem(String id);
		public Set<String> getCurrentLabels();
		public void setPresenter(SourceListPresenter p);
		public void setDragMode();
		public void unsetDragMode();
		public void hideItem(String id);
		public void showItem(String id);
		void connectDOMNodeRemovedEvent(String id);
		public void rerenderMath();
		public void refreshMathJax();
	}

	private final int stateVersion = 1;

	private IDisplay view;
	private SourceListModule model;
	private IPlayerServices playerServices;
	private String selectedId;

	private Set<String> items = new HashSet<String>(); // items currently in module, "view" state
	private HashMap<String, ItemWrapper> itemsWrapper = new HashMap<String, ItemWrapper>(); // all items definitions

	private JavaScriptObject jsObject;
	private boolean isVisible;
	private boolean canDrag = true;
	private boolean returned = false;
	private boolean isTest = false;

	public SourceListPresenter(SourceListModule model, IPlayerServices services){
		this.playerServices = services;
		this.model = model;
		this.isVisible = model.isVisible();

		connectHandlers();
		loadItems();
	}

	public SourceListPresenter(SourceListModule model, IPlayerServices services, Boolean isTest){
		this(model, services);
		this.isTest = isTest;
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
				if(event.getSource() != SourceListPresenter.this){
					deselectCurrentItem(false);
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
				onEventReceived(event.eventName, event.getData());
			}
		});

		eventBus.addHandler(ResetPageEvent.TYPE, new ResetPageEvent.Handler() {
			public void onResetPage(ResetPageEvent event) {
				reset(event.getIsOnlyWrongAnswers());
			}
		});

	}

	private void itemConsumed(ItemConsumedEvent event) {
		returned = false;
		deselectCurrentItem(false);
		if(model.isRemovable()){
			removeItem(event.getItem().getId());
		}
	}
	private String getItemPrefix() {
		return model.getId() + "-";
	}

	protected void returnItem(DraggableItem item) {
		returned = true;
		if(model.isRemovable()) {
			if (item.getId().startsWith(getItemPrefix())) {
				items.add(item.getId());
				String visibleText = itemsWrapper.get(item.getId()).getVisibleText();
				view.addItem(item.getId(), visibleText, true);
			}
		}
	}

	@Override
	public void reset(boolean isOnlyWrongAnswers) {
		deselectCurrentItem(false);
		addItemsToView(true);
		canDrag = true;

		isVisible = this.model.isVisible();
		if (isVisible) {
			view.show();
		} else {
			view.hide();
		}

		refreshMathJaxWithTimeout(this);
	}

	public native int refreshMathJaxWithTimeout(SourceListPresenter x) /*-{
		setTimeout(function() {
			x.@com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter::refreshMathJax()();
		}, 200);
	}-*/;

	public void refreshMathJax() {
		view.refreshMathJax();
	}

	protected void removeItem(String id) {
		if (items.contains(id)) {
			view.removeItem(id);
			items.remove(id);
		}
	}

	private void loadItems() {
		for (int i = 0; i < model.getItemCount(); i++) {
			String id = getItemPrefix() + (i + 1);
			String unparsedText = model.getItem(i);

			List<IToken> tokens = AlternativeTextService.parseAltText(unparsedText);
			String itemVisibleText = AlternativeTextService.getVisibleText(tokens);
			List<TextToSpeechVoice> itemReadableText = AlternativeTextService.getReadableText(tokens, model.getLangAttribute());

			itemsWrapper.put(id, new ItemWrapper(unparsedText, itemVisibleText, itemReadableText));
		}
	}

	private void addItemsToView(boolean callMathJax) {
		items.clear();
		view.removeAll();

		List<Integer> order;

		if (model.isRandomOrder()) {
			order = RandomUtils.singlePermutation(model.getItemCount());
		} else {
			order = new ArrayList<Integer>();
			for (int i = 0; i < model.getItemCount(); i++) {
				order.add(i);
			}
		}

		for (Integer index : order) {
			String id = getItemPrefix() + (index + 1);

			String itemVisibleText = itemsWrapper.get(id).getVisibleText();

			items.add(id);
			view.addItem(id, itemVisibleText, false);
			if (callMathJax) {
				view.rerenderMath();
			}
		}
	}


	private void clickItem(String id) {
		DraggableItem draggableItem = new DraggableText(null, null);
		final String oldSelection = selectedId;
		deselectCurrentItem(oldSelection != null && oldSelection.compareTo(id) == 0);

		if (oldSelection == null || oldSelection.compareTo(id) != 0) {
			selectedId = id;
			view.selectItem(id);
			draggableItem = new DraggableText(selectedId, itemsWrapper.get(id).getUnparsedText());
		}

		ItemSelectedEvent event = new ItemSelectedEvent(draggableItem);
		playerServices.getEventBus().fireEventFromSource(event, this);
	}

	private void selectItem(String id) {
		deselectCurrentItem(false);
		selectedId = id;
		view.selectItem(id);
		DraggableItem draggableItem = new DraggableText(selectedId, itemsWrapper.get(selectedId).getUnparsedText());
		ItemSelectedEvent event = new ItemSelectedEvent(draggableItem);
		playerServices.getEventBus().fireEventFromSource(event, this);
	}

	private void deselectCurrentItem (boolean read) {
		if (selectedId != null) {
			view.deselectItem(selectedId, read);
		}
		selectedId = null;
	}

	@Override
	public void addView(IModuleView display) {
		if (display instanceof IDisplay) {
			view = (IDisplay) display;
			view.setPresenter(this);
			view.addListener(new IViewListener() {
				public void onItemCliked(String id) {
					if (!canDrag) {
						return;
					}
					clickItem(id);
				}

				public void onItemDragged(String id) {
					if (!canDrag) {
						return;
					}
					selectItem(id);
				}
			});

			addItemsToView(false);
		}
		if (!this.isTest) {
			view.connectDOMNodeRemovedEvent(model.getId());
		}
	}


	@Override
	public String getSerialId() {
		return model.getId();
	}


	@Override
	public String getState() {
		HashMap<String, String> state = new HashMap<String, String>();
		state.put("stateVersion", String.valueOf(stateVersion));
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

		if (decodedState.containsKey("stateVersion")) {
			setStateV2(decodedState);
		} else {
			setStateV1(decodedState);
		}

		refreshViewState();
	}

	public void refreshViewState() {
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
			if (!items.contains(labelId)) {
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

	@Override
	public void setDisabled(boolean value) {
		canDrag = !value;
	}

	@Override
	public boolean isDisabled() {
		return !canDrag;
	}

	private void jsOnEventReceived (String eventName, String jsonData) {
		this.onEventReceived(eventName, jsonData == null ? new HashMap<String, String>() : (HashMap<String, String>)JavaScriptUtils.jsonToMap(jsonData));
	}

	private native JavaScriptObject initJSObject(SourceListPresenter x) /*-{
		var presenter = function() {}
		
		presenter.getView = function() { 
			return x.@com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter::getView()();
		}
		
		presenter.reset = function() { 
			return x.@com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter::reset(Z)(false);
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
		
		presenter.isDragPossible = function(){ 
			return x.@com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter::isDragPossible()();
		};
		
		presenter.shouldRevert = function(){ 
			return x.@com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter::shouldRevert()();
		};
		
		presenter.isRemovable = function(){ 
			return x.@com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter::isRemovable()();
		};
		
		presenter.setDragMode = function(){
			x.@com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter::setDragMode()();
		};
		
		presenter.unsetDragMode = function(){
			x.@com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter::unsetDragMode()();
		};
		
		presenter.onEventReceived = function (eventName, data) {
			x.@com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter::jsOnEventReceived(Ljava/lang/String;Ljava/lang/String;)(eventName, JSON.stringify(data));
		};
		
		
		return presenter;
	}-*/;

	private void setDragMode() {
		view.setDragMode();
	}

	private void unsetDragMode() {
		view.unsetDragMode();
	}

	private boolean shouldRevert() {
		return selectedId != null;
	}

	private boolean isRemovable() {
		return model.isRemovable();
	}

	@Override
	public String executeCommand(String commandName, List<IType> params) {

		IStringType param = null;

		if (commandName.compareTo("reset") == 0) {
			reset(false);
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

	private Element getView() {
		return view.getElement();
	}

	private Element getItemView(String id){
		return view.getItem(id);
	}

	private boolean isDragPossible() {
		return canDrag;
	}

	@Override
	public String getName() {
		return model.getId();
	}


	@Override
	public int getErrorCount() {
		return 0;
	}


	@Override
	public int getMaxScore() {
		return 0;
	}


	@Override
	public int getScore() {
		return 0;
	}


	@Override
	public void onValueChange(IOptionDisplay option, boolean selected) {

	}

	@Override
	public void onAudioButtonClicked(AudioInfo audioInfo) {
	    //not implemented
	}

	@Override
	public void onAudioEnded(AudioInfo audioInfo) {
	    //not implemented
	}

	private void show() {
		isVisible = true;
		if(view != null){
			view.show();
		}
	}

	private void hide() {
		isVisible = false;
		if(view != null){
			view.hide();
		}
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

	@Override
	public IWCAG getWCAGController() {
		return (IWCAG) this.view;
	}

	@Override
	public void selectAsActive(String className) {
		this.getView().addClassName(className);
	}

	@Override
	public void deselectAsActive(String className) {
		this.getView().removeClassName(className);
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
		return !model.shouldOmitInKeyboardNavigation();
	}

	@Override
	public void onEventReceived(String eventName, HashMap<String, String> data) {
		if (eventName.equals("ShowAnswers")) {
			canDrag = false;
			return;
		} else if (eventName.equals("HideAnswers")) {
			canDrag = true;
			return;
		}

		if (eventName.toLowerCase().equals("limitedcheck")) {
			return;
		}

		if (!eventName.equals("itemDragged") && !eventName.equals("itemStopped")) {
			return;
		}

		String gotItem = data.get("item");

		if (!gotItem.startsWith(getItemPrefix())) {
			return;
		}
		if (eventName.equals("itemDragged")) {
			selectItem(gotItem);
			if (model.isRemovable()) {
				view.hideItem(gotItem);
			}
		} else if (eventName.equals("itemStopped")) {
			if (model.isRemovable() && returned) {
				view.showItem(gotItem);
			}
			deselectCurrentItem(true);
			ItemSelectedEvent removeSelectionEvent = new ItemSelectedEvent(new DraggableText(null, null));
			playerServices.getEventBus().fireEventFromSource(removeSelectionEvent, this);
			view.rerenderMath();
		}
	}

	public List<TextToSpeechVoice> getTextToSpeechVoices(String id) {
		if (itemsWrapper.containsKey(id)) {
			return itemsWrapper.get(id).getReadableText();
		}
		return null;
	}

	private void setStateV1(HashMap<String, String> decodedState) {
		// original model state contained only items as array, later isVisible was added, but no version, so this function in fact handles two state types
		if (decodedState.containsKey("isVisible")) {
			isVisible = Boolean.parseBoolean(decodedState.get("isVisible"));
			HashMap<String, String> items = JSONUtils.decodeHashMap(decodedState.get("items"));

			this.items.retainAll(items.keySet());
		} else {
			isVisible = true;
			this.items.retainAll(decodedState.keySet());
		}
	}

	private void setStateV2(HashMap<String, String> decodedState) {
		isVisible = Boolean.parseBoolean(decodedState.get("isVisible"));
		this.items = JSONUtils.decodeSet(decodedState.get("items"));
	}

	@Override
	public boolean isActivity() {
		return true;
	}
}
