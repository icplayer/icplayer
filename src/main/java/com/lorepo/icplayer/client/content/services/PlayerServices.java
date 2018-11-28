package com.lorepo.icplayer.client.content.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.ResettableEventBus;
import com.google.gwt.event.shared.SimpleEventBus;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.PlayerApp;
import com.lorepo.icplayer.client.PlayerConfig;
import com.lorepo.icplayer.client.PlayerController;
import com.lorepo.icplayer.client.content.services.dto.ScaleInformation;
import com.lorepo.icplayer.client.model.page.group.GroupPresenter;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.event.CustomEvent;
import com.lorepo.icplayer.client.module.api.event.DefinitionEvent;
import com.lorepo.icplayer.client.module.api.event.PageLoadedEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableImage;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableItem;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableText;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemConsumedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemReturnedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemSelectedEvent;
import com.lorepo.icplayer.client.module.api.player.IAssetsService;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IReportableService;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.api.player.IStateService;
import com.lorepo.icplayer.client.module.api.player.ITimeService;
import com.lorepo.icplayer.client.page.PageController;

public class PlayerServices implements IPlayerServices {

	private static final String ITEM_SELECTED_EVENT_NAME = "ItemSelected";
	private static final String ITEM_CONSUMED_EVENT_NAME = "ItemConsumed";
	private static final String ITEM_RETURNED_EVENT_NAME = "ItemReturned";
	private static final String VALUE_CHANGED_EVENT_NAME = "ValueChanged";
	private static final String DEFINITION_EVENT_NAME = "Definition";
	private static final String PAGE_LOADED_EVENT_NAME = "PageLoaded";
	private static final String SHOW_ERRORS_EVENT_NAME = "ShowErrors";

	private final PlayerCommands playerCommands;
	private final PlayerEventBus eventBus;
	private final IPlayerController playerController;
	private final PageController pageController;
	private JavaScriptPlayerServices jsServiceImpl;
	private IJsonServices jsonServices = new JsonServices();
	private ScaleInformation scaleInformation;
	private JavaScriptObject jQueryPrepareOffsetsFunction = null;
	private boolean isAbleChangeLayout = true;
	private PlayerApp application = null;

	private final HashMap<String, List<JavaScriptObject>> listeners = new HashMap<String, List<JavaScriptObject>>();
	private final Map<String, List<JavaScriptObject>> pageLoadedListeners = new LinkedHashMap<String, List<JavaScriptObject>>();
	private final Map<String, List<JavaScriptObject>> pageLoadedListenersDelayed = new LinkedHashMap<String, List<JavaScriptObject>>();
	private final HashMap<String, List<JavaScriptObject>> listenersDelayed = new HashMap<String, List<JavaScriptObject>>();

	
	public PlayerServices(IPlayerController controller, PageController pageController) {
		this.playerController = controller;
		this.pageController = pageController;
		scaleInformation = new ScaleInformation();

		eventBus = new PlayerEventBus(new ResettableEventBus(new SimpleEventBus()));
		eventBus.setPlayerServices(this);

		playerCommands = new PlayerCommands(pageController, playerController);

		connectEventHandlers();
	}

	private void connectEventHandlers() {
		eventBus.addHandler(ItemSelectedEvent.TYPE, new ItemSelectedEvent.Handler() {
			@Override
			public void onItemSelected(ItemSelectedEvent event) {
				fireEvent(ITEM_SELECTED_EVENT_NAME, event.getData());
			}
		});

		eventBus.addHandler(ItemConsumedEvent.TYPE, new ItemConsumedEvent.Handler() {
			@Override
			public void onItemConsumed(ItemConsumedEvent event) {
				fireEvent(ITEM_CONSUMED_EVENT_NAME, event.getData());
			}
		});

		eventBus.addHandler(ItemReturnedEvent.TYPE, new ItemReturnedEvent.Handler() {
			@Override
			public void onItemReturned(ItemReturnedEvent event) {
				fireEvent(ITEM_RETURNED_EVENT_NAME, event.getData());
			}
		});

		eventBus.addHandler(ValueChangedEvent.TYPE, new ValueChangedEvent.Handler() {
			@Override
			public void onScoreChanged(ValueChangedEvent event) {
				fireEvent(VALUE_CHANGED_EVENT_NAME, event.getData());
			}
		});

		eventBus.addHandler(DefinitionEvent.TYPE, new DefinitionEvent.Handler() {
			@Override
			public void onDefinitionClicked(DefinitionEvent event) {
				fireEvent(DEFINITION_EVENT_NAME, event.getData());
			}
		});

		eventBus.addHandler(PageLoadedEvent.TYPE, new PageLoadedEvent.Handler() {
			@Override
			public void onPageLoaded(PageLoadedEvent event) {
				fireEvent(PAGE_LOADED_EVENT_NAME, event.getData());
			}
		});

		eventBus.addHandler(CustomEvent.TYPE, new CustomEvent.Handler() {
			@Override
			public void onCustomEventOccurred(CustomEvent event) {
				fireEvent(event.eventName, event.getData());
			}
		});

		eventBus.addHandler(ShowErrorsEvent.TYPE, new ShowErrorsEvent.Handler() {
			@Override
			public void onShowErrors(ShowErrorsEvent event) {
				fireEvent(SHOW_ERRORS_EVENT_NAME, event.getData());
			}
		});

	}
	
	@Override
	public void setAbleChangeLayout(boolean isAbleChangeLayout) {
		boolean oldIsAbleChangeLayout = this.isAbleChangeLayout;
		this.isAbleChangeLayout = isAbleChangeLayout;
		if (!oldIsAbleChangeLayout && isAbleChangeLayout && application != null) {
			this.application.updateLayout();
		}
	}
	
	@Override
	public void setApplication(PlayerApp application) {
		this.application = application;
	}
	
	@Override
	public boolean isAbleChangeLayout() {
		return this.isAbleChangeLayout;
	}

	@Override
	public IScoreService getScoreService() {
		return 	playerController.getScoreService();
	}

	@Override
	public IAssetsService getAssetsService() {
		return 	playerController.getAssetsService();
	}

	@Override
	public IPlayerCommands getCommands() {
		return playerCommands;
	}

	@Override
	public EventBus getEventBus() {
		return eventBus;
	}

	public void resetEventBus() {
		eventBus.removeHandlers();

        listeners.clear();
		listenersDelayed.clear();
		
		pageLoadedListeners.clear();
		pageLoadedListenersDelayed.clear();
		
		connectEventHandlers();
	}

	@Override
	public IContent getModel() {
		return playerController.getModel();
	}

	@Override
	public PlayerConfig getPlayerConfig() {
		return playerController.getPlayerConfig();
	}

	@Override
	public int getCurrentPageIndex() {
		return playerController.getCurrentPageIndex();
	}

	@Override
	public JavaScriptObject getAsJSObject() {
		if (jsServiceImpl == null) {
			jsServiceImpl = new JavaScriptPlayerServices(this);
		}
		return jsServiceImpl.getJavaScriptObject();
	}

	@Override
	public IPresenter getModule(String moduleId) {
		return pageController.findModule(moduleId);
	}

	
	@Override
	public GroupPresenter getGroup(String groupId) {
		return pageController.findGroup(groupId); 
	}
	
	
	@Override
	public IPresenter getHeaderModule(String moduleId) {
		return playerController.findHeaderModule(moduleId);
	}

	@Override
	public IPresenter getFooterModule(String moduleId) {
		return playerController.findFooterModule(moduleId);
	}

	@Override
	public IJsonServices getJsonServices() {
		return jsonServices;
	}

	@Override
	public IStateService getStateService() {
		return 	playerController.getStateService();
	}

	public void setJsonService(IJsonServices services) {
		jsonServices = services;
	}

	@Override
	public void sendAnalytics(String event, HashMap<String, String> params) {
		playerController.sendAnalytics(event, params);
	}

	@Override
	public boolean isBookMode() {
		return playerController.isBookMode();
	}

	@Override
	public boolean hasCover() {
		return playerController.hasCover();
	}

	@Override
	public ITimeService getTimeService() {
		return playerController.getTimeService();
	}

	@Override
	public int getPageWeight() {
		return pageController.getPage().getPageWeight();
	}

	@Override
	public void outstretchHeight(int y, int height, boolean dontMoveModules) {
		this.pageController.outstretchHeight(y, height, dontMoveModules);
	}

	@Override
	public IReportableService getReportableService() {
		return this.playerController.getReportableService();
	}

	@Override
	public ScaleInformation getScaleInformation() {
		return this.scaleInformation;
	}

	@Override
	public void setScaleInformation(String scaleX, 
									String scaleY,
									String transform, 
									String transformOrigin) 
	{
		ScaleInformation scaleInfo = new ScaleInformation();
		scaleInfo.scaleX = Double.parseDouble(scaleX);
		scaleInfo.scaleY = Double.parseDouble(scaleY);
		if (transform!=null) {
			scaleInfo.transform = transform;
		} else {
			throw new NullPointerException("ScaleInformation.transform cannot be null");
		};
		if (transformOrigin!=null) {
			scaleInfo.transformOrigin = transformOrigin;
		} else {
			throw new NullPointerException("ScaleInformation.transformOrigin cannot be null");
		}
		this.scaleInformation = scaleInfo;
		
		this.fixDroppable();
	}
	
	public void fixDroppable() {
		if (this.jQueryPrepareOffsetsFunction == null) {
			this.jQueryPrepareOffsetsFunction = this.getJQueryUIPrepareOffsetFunction();
		}
		
		if (this.scaleInformation.scaleX != 1.0 && this.scaleInformation.scaleY != 1.0) {
			this.jQueryUiDroppableScaleFix(this.jQueryPrepareOffsetsFunction);
			this.jQueryUiDroppableIntersectFix();
		}
	}
	
	public boolean changeSemiResponsiveLayout(String layoutIDOrName) {
		boolean result = this.application.changeLayout(layoutIDOrName);
		if (result) {
			return result;
		} 
		
		return this.application.changeLayoutByName(layoutIDOrName);
	}
	
	
	private native void jQueryUiDroppableScaleFix(JavaScriptObject originalPrepare)  /*-{
		function scaleFixDecorator(func) {
			function prepareOffsetWithScale(t, event) {
	            func(t, event);
	            var droppables = $wnd.$.ui.ddmanager.droppables[t.options.scope] || [];
	
	            for (var i = 0; i < droppables.length; i++) {	            	
	                droppables[i].proportions.width = droppables[i].element[0].getBoundingClientRect().width;
	                droppables[i].proportions.height = droppables[i].element[0].getBoundingClientRect().height;
	            }
	        }
	        
	        return prepareOffsetWithScale;
		}
		
		$wnd.$.ui.ddmanager.prepareOffsets = scaleFixDecorator(originalPrepare);
	}-*/;

	private native void jQueryUiDroppableIntersectFix()  /*-{
		
		// function from jquery-ui adjusted with scaling (getBoundingClientRect function)
		// https://github.com/jquery/jquery-ui/blob/1.8.20/ui/jquery.ui.droppable.js
		$wnd.$.ui.intersect = $wnd.$.ui.intersect = function(draggable, droppable, toleranceMode) {
			if (!droppable.offset) return false;
	
			var x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.element[0].getBoundingClientRect().width,
				y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.element[0].getBoundingClientRect().height;
			var l = droppable.offset.left, r = l + droppable.element[0].getBoundingClientRect().width,
				t = droppable.offset.top, b = t + droppable.element[0].getBoundingClientRect().height;
		
			switch (toleranceMode) {
				case 'fit':
					return (l <= x1 && x2 <= r
						&& t <= y1 && y2 <= b);
					break;
				case 'intersect':
					return (l < x1 + (draggable.helperProportions.width / 2) // Right Half
						&& x2 - (draggable.helperProportions.width / 2) < r // Left Half
						&& t < y1 + (draggable.helperProportions.height / 2) // Bottom Half
						&& y2 - (draggable.helperProportions.height / 2) < b ); // Top Half
					break;
				case 'pointer':
					var draggableLeft = ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left),
						draggableTop = ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top),
						isOver = $wnd.$.ui.isOver(draggableTop, draggableLeft, t, l, droppable.proportions.height, droppable.proportions.width);
					return isOver;
					break;
				case 'touch':
					return (
							(y1 >= t && y1 <= b) ||	// Top edge touching
							(y2 >= t && y2 <= b) ||	// Bottom edge touching
							(y1 < t && y2 > b)		// Surrounded vertically
						) && (
							(x1 >= l && x1 <= r) ||	// Left edge touching
							(x2 >= l && x2 <= r) ||	// Right edge touching
							(x1 < l && x2 > r)		// Surrounded horizontally
						);
					break;
				default:
					return false;
					break;
			}
		};
	
	}-*/;

	private native JavaScriptObject getJQueryUIPrepareOffsetFunction() /*-{
		return $wnd.$.ui.ddmanager.prepareOffsets;
	}-*/;
	
	public boolean isPlayerInCrossDomain() {
		return this.playerController.isPlayerInCrossDomain();
	}
	
	@Override
	public boolean isWCAGOn() {
		if(playerController instanceof PlayerController) {
			PlayerController pc = (PlayerController) playerController;
			return pc.isWCAGOn();
		}
		return false;
	}
	
	private void fireEvent(
			HashMap<String, List<JavaScriptObject>> listeners, 
			Map<String, List<JavaScriptObject>> pageLoadedListeners,
			String eventName, HashMap<String, String> data) {
		
		final JavaScriptObject jsData = JavaScriptUtils.createHashMap(data);
		
		List<JavaScriptObject> eventListeners = listeners.get(eventName);
		if (eventListeners != null) {
			if (eventName == PAGE_LOADED_EVENT_NAME) {
				final HashMap<String, String> pageLoadedData = new HashMap<String, String>();
				pageLoadedData.putAll(data);

				for (String eventSource : pageLoadedListeners.keySet()) {
					pageLoadedData.put("source", eventSource);
					final JavaScriptObject pageLoadedEventData = JavaScriptUtils.createHashMap(pageLoadedData);

					for (JavaScriptObject listener : pageLoadedListeners.get(eventSource)) {
						onEvent(listener, eventName, pageLoadedEventData);
					}

					pageLoadedListeners.get(eventSource).clear();
				}
				pageLoadedListeners.put(data.get("source"), new ArrayList<JavaScriptObject>());
			}

			for (JavaScriptObject listener : eventListeners) {
				onEvent(listener, eventName, jsData);
			}
		}
		
	}
	
	public void fireEvent(String eventName, HashMap<String, String> data) {
		this.fireEvent(listeners, pageLoadedListeners, eventName, data);
		this.fireEvent(listenersDelayed, pageLoadedListenersDelayed, eventName, data);
	}
	
	private void addEventListener(HashMap<String, List<JavaScriptObject>> listeners, Map<String, List<JavaScriptObject>> pageLoadedListeners,
			String eventName, 
			JavaScriptObject listener) 
	{
		List<JavaScriptObject> eventListeners = listeners.get(eventName);
		if (eventListeners == null) {
			eventListeners = new ArrayList<JavaScriptObject>();
			listeners.put(eventName, eventListeners);
		}

		if (eventName == PAGE_LOADED_EVENT_NAME) {
			for (String eventSource : pageLoadedListeners.keySet()) {
				pageLoadedListeners.get(eventSource).add(listener);
			}
		}

		eventListeners.add(listener);
	}
	
	public void addEventListener(String eventName, JavaScriptObject listener, boolean isDelayed) {
		if (isDelayed) {
			addEventListener(listenersDelayed, pageLoadedListenersDelayed, eventName, listener);
		} else {
			addEventListener(listeners, pageLoadedListeners, eventName, listener);
		}
	}
	
	public void sendEvent(String eventName, JavaScriptObject eventData){

		DraggableItem item;
		GwtEvent<?> event = null;

		String source = JavaScriptUtils.getArrayItemByKey(eventData, "source");
		String type = JavaScriptUtils.getArrayItemByKey(eventData, "type");
		String id = JavaScriptUtils.getArrayItemByKey(eventData, "item");
		String value = JavaScriptUtils.getArrayItemByKey(eventData, "value");
		String score = JavaScriptUtils.getArrayItemByKey(eventData, "score");
		String moduleType = JavaScriptUtils.getArrayItemByKey(eventData, "moduleType");
		String pageId = JavaScriptUtils.getArrayItemByKey(eventData, "pageId");

		if(type.compareTo("image") == 0) {
			item = new DraggableImage(id, value);
		} else {
			item = new DraggableText(id, value);
		}

		if (ITEM_CONSUMED_EVENT_NAME.compareTo(eventName) == 0) {
			event = new ItemConsumedEvent(item);
		} else if (ITEM_RETURNED_EVENT_NAME.compareTo(eventName) == 0) {
			event = new ItemReturnedEvent(item);
		} else if (ITEM_SELECTED_EVENT_NAME.compareTo(eventName) == 0) {
			event = new ItemSelectedEvent(item);
		} else if (VALUE_CHANGED_EVENT_NAME.compareTo(eventName) == 0) {
			event = new ValueChangedEvent(source, id, value, score, pageId, moduleType);
		} else if (DEFINITION_EVENT_NAME.compareTo(eventName) == 0) {
			String word = JavaScriptUtils.getArrayItemByKey(eventData, "word");
			event = new DefinitionEvent(word);
		} else {
			String jsonString = JavaScriptUtils.toJsonString(eventData);
			event = new CustomEvent(eventName, (HashMap<String, String>)JavaScriptUtils.jsonToMap(jsonString));
		}

		if (event != null) {
			eventBus.fireEventFromSource(event, this);
		}
	}

	private native void onEvent(JavaScriptObject listener, String name, JavaScriptObject data) /*-{
		listener.onEventReceived(name, data);
	}-*/;

}
