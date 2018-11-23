package com.lorepo.icplayer.client.module.api.event;

import java.util.HashMap;

import com.google.gwt.event.shared.EventHandler;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent.Handler;

public class ValueChangedEvent extends PlayerEvent<Handler> {

	private String moduleId;
	private String itemId;
	private String value;
	private String score;
	
	
	public ValueChangedEvent(String moduleID, String itemID, String value, String score){
		this.moduleId = moduleID;
		this.itemId = itemID;
		this.value = value;
		this.score = score;
	}
	
	
	public String getModuleID(){
		return moduleId;
	}
	
	
	public String getItemID(){
		return itemId;
	}
	
	
	public String getValue(){
		return value;
	}
	
	
	public interface Handler extends EventHandler {
		void onScoreChanged(ValueChangedEvent event);
	}
	
	public static Type<Handler> TYPE = new Type<Handler>();

	
	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onScoreChanged(this);
	}


	public HashMap<String, String> getData() {

		HashMap<String, String> data = new HashMap<String, String>();
		data.put("source", moduleId);
		data.put("item", itemId);
		data.put("value", value);
		data.put("score", score);
		data.put("pageId", pageId);
	
		return data;
	}


	@Override
	public String getName() {
		return "ValueChanged";
	}
	
}

