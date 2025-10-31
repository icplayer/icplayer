package com.lorepo.icplayer.client.module.api.event;

import java.util.HashMap;

import com.google.gwt.event.shared.EventHandler;
import com.lorepo.icplayer.client.module.api.event.PreDestroyedEvent.Handler;

public class PreDestroyedEvent extends PlayerEvent<Handler> {

	private final String moduleID;
	private final String itemID;
	private final String value;

	public final static String NAME = "PreDestroyed";

	public PreDestroyedEvent(String moduleID, String itemID, String value){
		this.moduleID = moduleID;
		this.itemID = itemID;
		this.value = value;
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
		void onPreDestroyed(PreDestroyedEvent event);
	}

	public static Type<Handler> TYPE = new Type<Handler>();

	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onPreDestroyed(this);
	}

    @Override
	public HashMap<String, String> getData() {

		HashMap<String, String> data = new HashMap<String, String>();
		data.put("source", moduleID);
		data.put("value", value);
		data.put("pageId", pageID);
		if (itemID.length() > 0)  data.put("item", itemID);
		data.put("moduleType", moduleType);

		return data;
	}

	@Override
	public String getName() {
		return NAME;
	}

}
