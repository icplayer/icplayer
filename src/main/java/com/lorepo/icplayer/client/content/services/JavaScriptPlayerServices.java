package com.lorepo.icplayer.client.content.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.GwtEvent;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.addon.AddonPresenter;
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
import com.lorepo.icplayer.client.module.api.player.IChapter;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.PageScore;
import com.lorepo.icplayer.client.module.button.ButtonPresenter;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter;
import com.lorepo.icplayer.client.module.image.ImagePresenter;
import com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter;
import com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter;
import com.lorepo.icplayer.client.module.ordering.OrderingPresenter;
import com.lorepo.icplayer.client.module.pageprogress.PageProgressPresenter;
import com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter;
import com.lorepo.icplayer.client.module.text.GapInfo;
import com.lorepo.icplayer.client.module.text.InlineChoiceInfo;
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
	private static final String SHOW_ERRORS_EVENT_NAME = "ShowErrors";
	
	
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
		
		eventBus.addHandler(CustomEvent.TYPE, new CustomEvent.Handler() {
			public void onCustomEventOccurred(CustomEvent event) {
				fireEvent(event.eventName, event.getData());
			}
		});
		
		eventBus.addHandler(ShowErrorsEvent.TYPE, new ShowErrorsEvent.Handler() {
			public void onShowErrors(ShowErrorsEvent event) {
				fireEvent(SHOW_ERRORS_EVENT_NAME, new HashMap<String, String>());
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

		var playerServices = function() {
		}

		playerServices.getPresentation = function() {
			var model = function() {
			};

			model.getPageCount = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPageCount()();
			}

			model.getPage = function(index) {
				var page = function() {
				}
				page.getName = function() {
					return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPageName(I)(index);
				}
				page.getId = function() {
					return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPageId(I)(index);
				}
				page.getBaseURL = function() {
					return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getBaseURL(I)(index);
				}
				page.isReportable = function() {
					return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::isPageReportable(I)(index);
				}
				page.isVisited = function() {
					return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::isPageVisited(I)(index);
				}
				page.getModules = function() {
					return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getModules(I)(index);
				}

				return page;
			}

			model.getTableOfContents = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getTableOfContents()();
			}

			return model;
		}

		playerServices.getCurrentPageIndex = function() {
			var index = x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getCurrentPageIndex()();
			return index;
		}

		playerServices.getCommands = function() {
			var commands = function() {
			};

			commands.gotoPage = function(pageName) {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::gotoPage(Ljava/lang/String;)(pageName);
			}
			commands.gotoPageIndex = function(index) {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::gotoPageIndex(I)(index);
			}
			commands.gotoPageId = function(pageId) {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::gotoPageId(Ljava/lang/String;)(pageId);
			}
			commands.executeEventCode = function(code) {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::executeEventCode(Ljava/lang/String;)(code);
			}
			commands.getTimeElapsed = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getTimeElapsed()();
			}
			commands.checkAnswers = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::checkAnswers()();
			}
			commands.uncheckAnswers = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::uncheckAnswers()();
			}
			commands.sendPageAllOkOnValueChanged = function(sendEvent) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::sendPageAllOkOnValueChanged(Z)(sendEvent);
			}

			return commands;
		}

		playerServices.getEventBus = function() {
			var commands = function() {
			};

			commands.addEventListener = function(name, listener) {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::addEventListener(Ljava/lang/String;Lcom/google/gwt/core/client/JavaScriptObject;)(name, listener);
			}

			commands.sendEvent = function(name, data) {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::sendEvent(Ljava/lang/String;Lcom/google/gwt/core/client/JavaScriptObject;)(name, data);
			}
			return commands;
		}

		playerServices.getTextParser = function() {
			var commands = function() {
			};

			commands.parse = function(text) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::parseText(Ljava/lang/String;)(text);
			}

			commands.parseGaps = function(text, options) {
				if (typeof options == 'undefined') {
					options = {
						isCaseSensitive: false
					};
				}
				
				if (!('isCaseSensitive' in options)) {
					options.isCaseSensitive = false;
				}

				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::parseGaps(Ljava/lang/String;Lcom/google/gwt/core/client/JavaScriptObject;)(text, options);
			}

			commands.connectLinks = function(node) {
				node
						.find('.ic_definitionLink')
						.click(
								function(e) {
									e.preventDefault();
									e.stopPropagation();
									var name = 'Definition'
									var data = {
										'word' : $wnd.$(this).html()
									}
									x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::sendEvent(Ljava/lang/String;Lcom/google/gwt/core/client/JavaScriptObject;)(name, data);
								});
			}

			return commands;
		}

		playerServices.getModule = function(id) {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getModule(Ljava/lang/String;)(id);
		}
	
		playerServices.getHeaderModule = function(id) {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getHeaderModule(Ljava/lang/String;)(id);
		}
		
		playerServices.getFooterModule = function(id) {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getFooterModule(Ljava/lang/String;)(id);
		}
		
		playerServices.getScore = function() {
			var score = function() {
			};

			score.getMaxScore = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getMaxScore()();
			}

			score.getTotalScore = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getTotalScore()();
			}

			score.getPageScore = function(name) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPageScore(Ljava/lang/String;)(name);
			}

			score.getPageScoreById = function(pageId) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPageScoreById(Ljava/lang/String;)(pageId);
			}

			return score;
		}

		playerServices.getStaticFilesPath = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getStaticFilesPath()();
		}

		playerServices.isBookMode = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::isBookMode()();
		}

		playerServices.hasCover = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::hasCover()();
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

	private String getPageId(int index){
		return playerServices.getModel().getPage(index).getId();
	}
	
	private String getBaseURL(int index){
		return playerServices.getModel().getPage(index).getBaseURL();
	}

	private boolean isPageReportable(int index){
		return playerServices.getModel().getPage(index).isReportable();
	}
	
	private boolean isPageVisited(int index){
		if (playerServices.getCurrentPageIndex() == index) {
			return true;
		}
		
		String pageId = playerServices.getModel().getPage(index).getId();

		return playerServices.getScoreService().getPageScoreById(pageId).hasScore();
	}
	
	private JavaScriptObject getModules(int index) {
		JavaScriptObject model = JavaScriptObject.createArray();

		for(String id : playerServices.getModel().getPage(index).getModulesList()) {
			JavaScriptUtils.addElementToJSArray(model, id);
		}
		return model;
	}
	
	
	private void gotoPage(String pageName){
		playerServices.getCommands().gotoPage(pageName);
	}

	
	private void gotoPageIndex(int index){
		playerServices.getCommands().gotoPageIndex(index);
	}

	private void gotoPageId(String pageId){
		playerServices.getCommands().gotoPageId(pageId);
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
		parser.skipGaps();
		ParserResult result = parser.parse(text);
		return result.parsedText;
	}

	/**
	 * Parsing gaps and inline gaps
	 * 
	 * @return Hashmap with values - parsedText - string with replaced gaps
	 *         definitions - gaps - hashmap with gaps structure - inLineGaps -
	 *         hashmap with inline gaps structure
	 */
	private JavaScriptObject parseGaps(String text, JavaScriptObject options) {
		TextParser parser = new TextParser();
		Boolean isCaseSensitive = Boolean.valueOf(JavaScriptUtils.getArrayItemByKey(options, "isCaseSensitive"));
		parser.setCaseSensitiveGaps(isCaseSensitive);
		ParserResult result = parser.parse(text);

		JavaScriptObject inlineGaps = inLineChoiceToJs(result.choiceInfos);
		JavaScriptObject gaps = gapsToJs(result.gapInfos);

		JavaScriptObject model = JavaScriptObject.createArray();
		JavaScriptUtils.addObjectAsPropertyToJSArray(model, "inLineGaps",
				inlineGaps);
		JavaScriptUtils.addObjectAsPropertyToJSArray(model, "gaps", gaps);
		JavaScriptUtils.addPropertyToJSArray(model, "parsedText",
				result.parsedText);

		return model;
	}
	
	private JavaScriptObject getHeaderModule(String id){
		IPresenter presenter = playerServices.getHeaderModule(id);
		return getModulePresentationJSObject(presenter);
	}
	
	private JavaScriptObject getFooterModule(String id){
		IPresenter presenter = playerServices.getFooterModule(id);
		return getModulePresentationJSObject(presenter);
	}
	
	private JavaScriptObject getModule(String id){
		IPresenter presenter = playerServices.getModule(id);
		return getModulePresentationJSObject(presenter);
	}
	
	private JavaScriptObject getModulePresentationJSObject(IPresenter presenter) {
		if(presenter instanceof AddonPresenter){
			return ((AddonPresenter) presenter).getJavaScriptObject();
		}
		else if(presenter instanceof TextPresenter){
			return ((TextPresenter) presenter).getAsJavaScript();
		}
		else if(presenter instanceof ImagePresenter){
			return ((ImagePresenter) presenter).getAsJavaScript();
		}
		else if(presenter instanceof ImageGapPresenter){
			return ((ImageGapPresenter) presenter).getAsJavaScript();
		}
		else if(presenter instanceof ImageSourcePresenter){
			return ((ImageSourcePresenter) presenter).getAsJavaScript();
		}
		else if(presenter instanceof ChoicePresenter){
			return ((ChoicePresenter) presenter).getAsJavaScript();
		}
		else if(presenter instanceof OrderingPresenter){
			return ((OrderingPresenter) presenter).getAsJavaScript();
		}
		else if(presenter instanceof ButtonPresenter){
			return ((ButtonPresenter) presenter).getAsJavaScript();
		}
		else if(presenter instanceof SourceListPresenter){
			return ((SourceListPresenter) presenter).getAsJavaScript();
		}
		else if(presenter instanceof PageProgressPresenter){
			return ((PageProgressPresenter) presenter).getAsJavaScript();
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
		JavaScriptObject model = scoreToJs(score);
		
		return model;
	}

	
	private JavaScriptObject getPageScoreById(String id){
		
		playerServices.getCommands().updateCurrentPageScore();
		PageScore score = playerServices.getScoreService().getPageScoreById(id);
		JavaScriptObject model = scoreToJs(score);
		
		return model;
	}


	private static JavaScriptObject scoreToJs(PageScore score) {
		JavaScriptObject model = JavaScriptObject.createArray();
		JavaScriptUtils.addPropertyToJSArray(model, "score", (int)score.getScore());
		JavaScriptUtils.addPropertyToJSArray(model, "maxScore", (int)score.getMaxScore());
		JavaScriptUtils.addPropertyToJSArray(model, "checkCount", score.getCheckCount());
		JavaScriptUtils.addPropertyToJSArray(model, "errorCount", score.getErrorCount());
		JavaScriptUtils.addPropertyToJSArray(model, "mistakeCount", score.getMistakeCount());
		return model;
	}
	
	private static JavaScriptObject inLineChoiceToJs(List<InlineChoiceInfo> choiceInfos) {
		JavaScriptObject model = JavaScriptObject.createArray();

		for (int i = 0; i < choiceInfos.size(); i++) {
			JavaScriptObject gap = JavaScriptObject.createArray();
			JavaScriptUtils.addPropertyToJSArray(gap, "id", choiceInfos.get(i)
					.getId());
			JavaScriptUtils.addPropertyToJSArray(gap, "answer", choiceInfos
					.get(i).getAnswer());
			JavaScriptUtils.addPropertyToJSArray(gap, "value",
					(int) choiceInfos.get(i).getValue());
			JavaScriptObject distractors = JavaScriptObject.createArray();

			Iterator<String> gapDistractors = choiceInfos.get(i)
					.getDistractors();
			while (gapDistractors.hasNext()) {
				String dist = gapDistractors.next();
				JavaScriptUtils.addElementToJSArray(distractors, dist);
			}
			JavaScriptUtils.addObjectAsPropertyToJSArray(gap, "distractors",
					distractors);

			JavaScriptUtils.addObjectToJSArray(model, gap);
		}
		return model;
	}

	private static JavaScriptObject gapsToJs(List<GapInfo> gapInfos) {
		JavaScriptObject model = JavaScriptObject.createArray();

		for (int i = 0; i < gapInfos.size(); i++) {
			JavaScriptObject gap = JavaScriptObject.createArray();
			JavaScriptUtils.addPropertyToJSArray(gap, "id", gapInfos.get(i)
					.getId());
			JavaScriptUtils.addPropertyToJSArray(gap, "value", (int) gapInfos
					.get(i).getValue());

			JavaScriptObject answersArray = JavaScriptObject.createArray();
			Iterator<String> answers = gapInfos.get(i).getAnswers();
			while (answers.hasNext()) {
				String dist = answers.next();
				JavaScriptUtils.addElementToJSArray(answersArray, dist);
			}
			JavaScriptUtils.addObjectAsPropertyToJSArray(gap, "answers",
					answersArray);

			JavaScriptUtils.addObjectToJSArray(model, gap);
		}
		return model;
	}

	private String getStaticFilesPath(){
		return GWT.getModuleBaseForStaticFiles();
	}

	
	private int getTimeElapsed(){
		return (int)playerServices.getCommands().getTimeElapsed();
	}
	
	private void checkAnswers() {
		playerServices.getCommands().checkAnswers();
	}

	private void uncheckAnswers() {
		playerServices.getCommands().uncheckAnswers();
	}

	private void sendPageAllOkOnValueChanged(boolean sendEvent) {
		playerServices.getCommands().sendPageAllOkOnValueChanged(sendEvent);
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
		} else {
			String jsonString = JavaScriptUtils.toJsonString(eventData);
			event = new CustomEvent(eventName, (HashMap<String, String>)JavaScriptUtils.jsonToMap(jsonString));
		}
		
		
		
		if(event != null){
			playerServices.getEventBus().fireEventFromSource(event, this);
		}
	}

	
	private native void onEvent(JavaScriptObject listener, String name, JavaScriptObject data) /*-{
		listener.onEventReceived(name, data);
	}-*/;

	
	private boolean isBookMode(){
		return playerServices.isBookMode();
	}
	
	private boolean hasCover(){
		return playerServices.hasCover();
	}
	
	private JavaScriptObject getTableOfContents(){

		IChapter toc = playerServices.getModel().getTableOfContents();
		return toc.toJavaScript();
	}
	
}
