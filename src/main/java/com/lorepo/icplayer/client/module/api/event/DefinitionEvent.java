package com.lorepo.icplayer.client.module.api.event;

import java.util.HashMap;

import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.lorepo.icplayer.client.module.api.event.DefinitionEvent.Handler;

/**
 * Event wysyłany gdy zostanie wybrany link z definicją
 * 
 * @author Krzysztof Langner
 *
 */
public class DefinitionEvent extends GwtEvent<Handler> {

	private String definition;
	
	public DefinitionEvent(String definition){
		this.definition = definition;
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


	public HashMap<String, String> getData() {
		HashMap<String, String> data = new HashMap<String, String>();
		data.put("word", definition);
		return data;
	}
	
}

