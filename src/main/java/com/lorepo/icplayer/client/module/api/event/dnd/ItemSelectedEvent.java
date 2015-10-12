package com.lorepo.icplayer.client.module.api.event.dnd;

import com.google.gwt.event.shared.EventHandler;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemSelectedEvent.Handler;

public class ItemSelectedEvent extends AbstractDraggableEvent<Handler> {

	public interface Handler extends EventHandler {
		void onItemSelected(ItemSelectedEvent event);
	}
	
	public static Type<Handler> TYPE = new Type<Handler>();
	
	public ItemSelectedEvent(DraggableItem item){
		super(item);
	}
	
	
	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}

	@Override
	public String getName() {
		return "ItemSelected";
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onItemSelected(this);
	}
}

