package com.lorepo.icplayer.client.module.api.event.dnd;

import com.google.gwt.event.shared.EventHandler;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemReturnedEvent.Handler;

public class ItemReturnedEvent extends AbstractDraggableEvent<Handler> {

	public interface Handler extends EventHandler {
		void onItemReturned(ItemReturnedEvent event);
	}
	
	public static Type<Handler> TYPE = new Type<Handler>();
	
	
	public ItemReturnedEvent(DraggableItem item){
		super(item);
	}
	
	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}

	@Override
	public String getName() {
		return "ItemReturned";
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onItemReturned(this);
	}	
}

