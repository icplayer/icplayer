package com.lorepo.icplayer.client.module.api.event.dnd;

import com.google.gwt.event.shared.EventHandler;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemConsumedEvent.Handler;

public class ItemConsumedEvent extends AbstractDraggableEvent<Handler> {

	public interface Handler extends EventHandler {
		void onItemConsumed(ItemConsumedEvent event);
	}
	
	public static Type<Handler> TYPE = new Type<Handler>();
	
	
	public ItemConsumedEvent(DraggableItem item){
		super(item);
	}
	
	
	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}

	@Override
	public String getName() {
		return "ItemConsumed";
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onItemConsumed(this);
	}
}

