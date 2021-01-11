package com.lorepo.icplayer.client.module.api.event;

import com.google.gwt.event.shared.EventHandler;

public class GradualHideAnswerEvent extends PlayerEvent<GradualHideAnswerEvent.Handler> {

    public static final String NAME = "GradualHideAnswers";

    public static Type<GradualHideAnswerEvent.Handler> TYPE = new Type<GradualHideAnswerEvent.Handler>();

    public interface Handler extends EventHandler {
        void onGradualHideAnswers(GradualHideAnswerEvent event);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public Type<GradualHideAnswerEvent.Handler> getAssociatedType() {
        return TYPE;
    }

    @Override
    protected void dispatch(Handler handler) {
        handler.onGradualHideAnswers(this);
    }
}
