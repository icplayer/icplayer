package com.lorepo.icplayer.client.module.api.event;

import java.util.HashMap;

import com.google.gwt.event.shared.EventHandler;
import com.lorepo.icplayer.client.module.api.event.DefinitionEvent.Handler;

public class DefinitionEvent extends PlayerEvent<Handler> {

	private String definition;
	
	public DefinitionEvent(String definition){
		this.definition = definition;
	}
	
	@Override
	public String getName() {
		return "Definition";
	}
	
	public String getDefinition(){
		return definition;
	}
	
	
	public interface Handler extends EventHandler {
		void onDefinitionClicked(DefinitionEvent event);
	}
	
	public static Type<Handler> TYPE = new Type<Handler>();

	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onDefinitionClicked(this);
	}

	@Override
	public HashMap<String, String> getData() {
		HashMap<String, String> data = new HashMap<String, String>();
		data.put("word", definition);
		return data;
	}
}

