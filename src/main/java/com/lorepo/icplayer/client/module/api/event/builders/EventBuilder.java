package com.lorepo.icplayer.client.module.api.event.builders;

import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;

public class EventBuilder {
	protected JavaScriptObject data;
	protected String eventName;
	
	
	public EventBuilder(String eventName, JavaScriptObject eventData) {
		this.data = eventData;
		
		
	}
	
//	public PlayerEvent<?> createEvent() {
//		PlayerEvent<?> event;
//		
//		if (ITEM_CONSUMED_EVENT_NAME.compareTo(eventName) == 0) {
//			event = new ItemConsumedEvent(item);
//		} else if (ITEM_RETURNED_EVENT_NAME.compareTo(eventName) == 0) {
//			event = new ItemReturnedEvent(item);
//		} else if (ITEM_SELECTED_EVENT_NAME.compareTo(eventName) == 0) {
//			event = new ItemSelectedEvent(item);
//		} else if (VALUE_CHANGED_EVENT_NAME.compareTo(eventName) == 0) {
//			event = new ValueChangedEvent(source, id, value, score);
//		} else if (DEFINITION_EVENT_NAME.compareTo(eventName) == 0) {
//			String word = JavaScriptUtils.getArrayItemByKey(eventData, "word");
//			event = new DefinitionEvent(word);
//		} else {
//			String jsonString = JavaScriptUtils.toJsonString(eventData);
//			event = new CustomEvent(eventName, (HashMap<String, String>)JavaScriptUtils.jsonToMap(jsonString));
//		}
//
//		String source = JavaScriptUtils.getArrayItemByKey(eventData, "source");
//		String type = JavaScriptUtils.getArrayItemByKey(eventData, "type");
//		String id = JavaScriptUtils.getArrayItemByKey(eventData, "item");
//		String value = JavaScriptUtils.getArrayItemByKey(eventData, "value");
//		String score = JavaScriptUtils.getArrayItemByKey(eventData, "score");
//
//		if(type.compareTo("image") == 0) {
//			item = new DraggableImage(id, value);
//		} else {
//			item = new DraggableText(id, value);
//		}
//		
//		return event;
//	}
	
}
