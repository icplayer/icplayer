package com.lorepo.icplayer.client.module.api.event;

import com.google.gwt.event.shared.EventHandler;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent.Handler;

public class ResetPageEvent extends PlayerEvent<Handler> {
	protected boolean onlyWrongAnswers = false;

	public static final String NAME = "Reset";
	
	public ResetPageEvent(boolean onlyWrongAnswers) {
		super();
		this.onlyWrongAnswers = onlyWrongAnswers;
	}
	
	
	public interface Handler extends EventHandler {
		void onResetPage(ResetPageEvent event);
	}
	
	public static Type<Handler> TYPE = new Type<Handler>();

	@Override
	public Type<Handler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onResetPage(this);
	}

	@Override
	public String getName() {
		return NAME;
	}
	
	public boolean getIsOnlyWrongAnswers () {
		return this.onlyWrongAnswers;
	}
}

