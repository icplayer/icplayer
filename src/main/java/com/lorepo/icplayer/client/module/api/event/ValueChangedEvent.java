package com.lorepo.icplayer.client.module.api.event;

import java.util.HashMap;

import com.google.gwt.event.shared.EventHandler;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent.Handler;

public class ValueChangedEvent extends PlayerEvent<Handler> {
	
	private final String moduleID;
	private final String itemID;
	private final String value;
	private final String score;

	public final static String NAME = "ValueChanged";

	public ValueChangedEvent(String moduleID, String itemID, String value, String score){
		this.moduleID = moduleID;
		this.itemID = itemID;
		this.value = value;
		this.score = score;
	}

	public String getModuleID(){
		return moduleID;
	}
	
	
	public String getItemID(){
		return itemID;
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

    @Override
	public HashMap<String, String> getData() {

		HashMap<String, String> data = new HashMap<String, String>();
		data.put("source", moduleID);
		data.put("item", itemID);
		data.put("value", value);
		data.put("score", score);
		data.put("pageId", pageID);
		data.put("moduleType", moduleType);
		data.put("pageAdaptiveStep", pageAdaptiveStep);
	
		return data;
	}


	@Override
	public String getName() {
		return NAME;
	}
	
}

