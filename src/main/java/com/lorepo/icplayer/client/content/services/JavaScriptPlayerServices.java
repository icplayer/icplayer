package com.lorepo.icplayer.client.content.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.GwtEvent;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.addon.AddonPresenter;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.event.DefinitionEvent;
import com.lorepo.icplayer.client.module.api.event.PageLoadedEvent;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableImage;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableItem;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableText;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemConsumedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemReturnedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemSelectedEvent;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.PageScore;
import com.lorepo.icplayer.client.module.image.ImagePresenter;
import com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter;
import com.lorepo.icplayer.client.module.text.TextParser;
import com.lorepo.icplayer.client.module.text.TextParser.ParserResult;
import com.lorepo.icplayer.client.module.text.TextPresenter;

/**
 * Implementacja serwisów udostępnianych przez playera jako obiekt JavaScript
 * @author Krzysztof Langner
 *
 */
public class JavaScriptPlayerServices{

	private static final String ITEM_SELECTED_EVENT_NAME = "ItemSelected";
	private static final String ITEM_CONSUMED_EVENT_NAME = "ItemConsumed";
	private static final String ITEM_RETURNED_EVENT_NAME = "ItemReturned";
	private static final String VALUE_CHANGED_EVENT_NAME = "ValueChanged";
	private static final String DEFINITION_EVENT_NAME = "Definition";
	private static final String PAGE_LOADED_EVENT_NAME = "PageLoaded";
	
	
	private IPlayerServices playerServices;
	private JavaScriptObject	jsObject;
	private JavaScriptObject	presentationObject;
	private HashMap<String, List<JavaScriptObject>> listeners = new HashMap<String, List<JavaScriptObject>>();
	
	
	public JavaScriptPlayerServices(IPlayerServices playerServices) {
	
		this.playerServices = playerServices;
		
		jsObject = initJSObject(this);
		connectEventHandlers();
	}
	
	
	public void resetEventListeners(){

		listeners.clear();
		connectEventHandlers();
	}


	public JavaScriptObject getJavaScriptObject(){
		return jsObject;
	}


	private void connectEventHandlers() {
		
		EventBus eventBus = playerServices.getEventBus();
		
		eventBus.addHandler(ItemSelectedEvent.TYPE, new ItemSelectedEvent.Handler() {
			public void onItemSelected(ItemSelectedEvent event) {
				fireEvent(ITEM_SELECTED_EVENT_NAME, event.getData());
			}
		});
		
		eventBus.addHandler(ItemConsumedEvent.TYPE, new ItemConsumedEvent.Handler() {
			public void onItemConsumed(ItemConsumedEvent event) {
				fireEvent(ITEM_CONSUMED_EVENT_NAME, event.getData());
			}
		});
	
		eventBus.addHandler(ItemReturnedEvent.TYPE, new ItemReturnedEvent.Handler() {
			public void onItemReturned(ItemReturnedEvent event) {
				fireEvent(ITEM_RETURNED_EVENT_NAME, event.getData());
			}
		});
		
		eventBus.addHandler(ValueChangedEvent.TYPE, new ValueChangedEvent.Handler() {
			public void onScoreChanged(ValueChangedEvent event) {
				fireEvent(VALUE_CHANGED_EVENT_NAME, event.getData());
			}
		});
		
		eventBus.addHandler(DefinitionEvent.TYPE, new DefinitionEvent.Handler() {
			public void onDefinitionClicked(DefinitionEvent event) {
				fireEvent(DEFINITION_EVENT_NAME, event.getData());
			}
		});
		
		eventBus.addHandler(PageLoadedEvent.TYPE, new PageLoadedEvent.Handler() {
			public void onPageLoaded(PageLoadedEvent event) {
				fireEvent(PAGE_LOADED_EVENT_NAME, event.getData());
			}
		});
		
	}


	private void fireEvent(String eventName, HashMap<String, String> data) {
		
		List<JavaScriptObject> eventListeners = listeners.get(eventName);
		if(eventListeners != null){
			JavaScriptObject jsData = JavaScriptUtils.createHashMap(data);
			for(JavaScriptObject listener : eventListeners){
				onEvent(listener, eventName, jsData);
			}
		}
	}


	private native JavaScriptObject initJSObject(JavaScriptPlayerServices x) /*-{
		
		var playerServices = function(){}
			
		playerServices.getPresentation = function(){
			var model = function(){};

			model.getPageCount = function(){
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPageCount()();
			}
				
			model.getPage = function(index){
				var page = function(){}
				page.getName = function(){
					return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPageName(I)(index);
				}
				page.getBaseURL = function(){
					return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getBaseURL(I)(index);
				}
				
				return page;
			}
				
			return model;
		}
			
		playerServices.getCurrentPageIndex = function(){ 
			var index = x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getCurrentPageIndex()();
			return index;
		}
			
		playerServices.getCommands = function(){
			var commands = function(){};

			commands.gotoPage = function(pageName){
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::gotoPage(Ljava/lang/String;)(pageName);
			}
			commands.executeEventCode = function(code){
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::executeEventCode(Ljava/lang/String;)(code);
			}
			commands.getTimeElapsed = function(){
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getTimeElapsed()();
			}
			return commands;
		}	
		
		playerServices.getEventBus = function(){
			var commands = function(){};

			commands.addEventListener = function(name, listener){
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::addEventListener(Ljava/lang/String;Lcom/google/gwt/core/client/JavaScriptObject;)(name, listener);
			}

			commands.sendEvent = function(name, data){
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::sendEvent(Ljava/lang/String;Lcom/google/gwt/core/client/JavaScriptObject;)(name, data);
			}
			return commands;
		}	
		
		playerServices.getTextParser = function(){
			var commands = function(){};

			commands.parse = function(text){
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::parseText(Ljava/lang/String;)(text);
			}

			commands.connectLinks = function(node){
				
				$wnd.$(".ic_definitionLink").click(function(){
					var name = 'Definition'
					var data = {'word': $wnd.$(this).html()}
					x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::sendEvent(Ljava/lang/String;Lcom/google/gwt/core/client/JavaScriptObject;)(name, data);
				});
				
			}

			return commands;
		}	
		
		playerServices.getModule = function(name){ 
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getModule(Ljava/lang/String;)(name);
		}
			
		playerServices.getScore = function(){
			var score = function(){};

			score.getMaxScore = function(){
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getMaxScore()();
			}

			score.getTotalScore = function(){
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getTotalScore()();
			}

			score.getPageScore = function(name){
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPageScore(Ljava/lang/String;)(name);
			}

			return score;
		}	
		
		playerServices.getAssetsPath = function(){ 
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getAssetsPath()();
		}
		
		return playerServices;
	}-*/;
	
	
	private int getCurrentPageIndex(){
		return playerServices.getCurrentPageIndex();
	}

	
	private int getPageCount(){
		return playerServices.getModel().getPageCount();
	}

	
	private String getPageName(int index){
		return playerServices.getModel().getPage(index).getName();
	}

	private String getBaseURL(int index){
		return playerServices.getModel().getPage(index).getBaseURL();
	}

	private void gotoPage(String pageName){
		playerServices.getCommands().gotoPage(pageName);
	}

	
	private void executeEventCode(String code){
		playerServices.getCommands().executeEventCode(code);
	}

	
	private void addEventListener(String eventName, JavaScriptObject listener){

		List<JavaScriptObject> eventListeners = listeners.get(eventName);
		if(eventListeners == null){
			eventListeners = new ArrayList<JavaScriptObject>();
			listeners.put(eventName, eventListeners);
		}
		eventListeners.add(listener);
	}

	
	/**
	 * Parsuje definicje w tekście
	 * @return Hashmap z wartościami
	 * - text - zmieniony tekst
	 * - defCount - ilość linków z definicjami
	 */
	private String parseText(String text){

		TextParser parser = new TextParser();
		ParserResult result = parser.parse(text);
		return result.parsedText;
	}

	
	private JavaScriptObject getModule(String name){

		IPresenter presenter = playerServices.getModule(name);
		
		if(presenter instanceof AddonPresenter){
			return ((AddonPresenter)presenter).getJavaScriptObject();
		}
		else if(presenter instanceof TextPresenter){
			return ((TextPresenter)presenter).getAsJavaScript();
		}
		else if(presenter instanceof ImagePresenter){
			return ((ImagePresenter)presenter).getAsJavaScript();
		}
		else if(presenter instanceof ImageGapPresenter){
			return ((ImageGapPresenter)presenter).getAsJavaScript();
		}
		
		return null;
	}

	
	private int getMaxScore(){
		return playerServices.getScoreService().getTotalMaxScore();
	}

	
	private int getTotalScore(){
		playerServices.getCommands().updateCurrentPageScore();
		return playerServices.getScoreService().getTotalScore();
	}

	
	private JavaScriptObject getPageScore(String pageName){
		
		playerServices.getCommands().updateCurrentPageScore();
		PageScore score = playerServices.getScoreService().getPageScore(pageName);
		JavaScriptObject model = JavaScriptObject.createArray();
		
		JavaScriptUtils.addPropertyToJSArray(model, "score", (int)score.getScore());
		JavaScriptUtils.addPropertyToJSArray(model, "maxScore", (int)score.getMaxScore());
		JavaScriptUtils.addPropertyToJSArray(model, "checkCount", score.getCheckCount());
		JavaScriptUtils.addPropertyToJSArray(model, "errorCount", score.getErrorCount());
		JavaScriptUtils.addPropertyToJSArray(model, "mistakeCount", score.getMistakeCount());
		
		return model;
	}
	
	
	private String getAssetsPath(){
		return GWT.getModuleBaseForStaticFiles();
	}

	
	private int getTimeElapsed(){
		return (int)playerServices.getCommands().getTimeElapsed();
	}

	
	private void sendEvent(String eventName, JavaScriptObject eventData){

		DraggableItem item;
		GwtEvent<?> event = null;
		
		String source = JavaScriptUtils.getArrayItemByKey(eventData, "source");
		String type = JavaScriptUtils.getArrayItemByKey(eventData, "type");
		String id = JavaScriptUtils.getArrayItemByKey(eventData, "item");
		String value = JavaScriptUtils.getArrayItemByKey(eventData, "value");
		String score = JavaScriptUtils.getArrayItemByKey(eventData, "score");
		
		if(type.compareTo("image") == 0){
			item = new DraggableImage(id, value);
		}
		else{
			item = new DraggableText(id, value);
		}
	
		if(ITEM_CONSUMED_EVENT_NAME.compareTo(eventName) == 0){
			event = new ItemConsumedEvent(item);
		}
		else if(ITEM_RETURNED_EVENT_NAME.compareTo(eventName) == 0){
			event = new ItemReturnedEvent(item);
		}
		else if(ITEM_SELECTED_EVENT_NAME.compareTo(eventName) == 0){
			event = new ItemSelectedEvent(item);
		}
		else if(VALUE_CHANGED_EVENT_NAME.compareTo(eventName) == 0){
			event = new ValueChangedEvent(source, id, value, score);
		}
		else if(DEFINITION_EVENT_NAME.compareTo(eventName) == 0){
			String word = JavaScriptUtils.getArrayItemByKey(eventData, "word");
			event = new DefinitionEvent(word);
		}
		
		if(event != null){
			playerServices.getEventBus().fireEventFromSource(event, this);
		}
	}

	
	private native void onEvent(JavaScriptObject listener, String name, JavaScriptObject data) /*-{
		listener.onEventReceived(name, data);
	}-*/;

	
}
