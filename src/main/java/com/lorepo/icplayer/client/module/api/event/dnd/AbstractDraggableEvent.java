package com.lorepo.icplayer.client.module.api.event.dnd;

import java.util.HashMap;

import com.google.gwt.event.shared.EventHandler;
import com.lorepo.icplayer.client.module.api.event.PlayerEvent;

abstract class AbstractDraggableEvent<H extends EventHandler> extends PlayerEvent<H> {
	private DraggableItem item;
	
	
	public AbstractDraggableEvent(DraggableItem item){
		this.item = item;
	}
	
	public DraggableItem getItem(){
		return item;
	}
	
	public HashMap<String, String>	getData(){
		
		HashMap<String, String> data = new HashMap<String, String>();
		if(item instanceof DraggableImage){
			data.put("type", "image");
		} else if (item instanceof DraggableAudio){
			data.put("type", "audio");
		} else{
			data.put("type", "string");
		}
		
		if(item != null){
			data.put("value", item.getValue());
			data.put("item", item.getId());
		}
	
		return data;
	}
}

