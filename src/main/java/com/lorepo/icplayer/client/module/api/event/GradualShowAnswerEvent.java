package com.lorepo.icplayer.client.module.api.event;

import com.google.gwt.event.shared.EventHandler;

import java.util.HashMap;

public class GradualShowAnswerEvent extends PlayerEvent<GradualShowAnswerEvent.Handler> {

    public static final String NAME = "GradualShowAnswers";

    public static Type<GradualShowAnswerEvent.Handler> TYPE = new Type<GradualShowAnswerEvent.Handler>();
    private int item = 0;
    private String moduleID = "";

    public interface Handler extends EventHandler {
        void onGradualShowAnswers(GradualShowAnswerEvent event);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public Type<GradualShowAnswerEvent.Handler> getAssociatedType() {
        return TYPE;
    }

    @Override
    protected void dispatch(Handler handler) {
        handler.onGradualShowAnswers(this);
    }

    public int getItem() {
        return item;
    }

    public String getModuleID() {
        return moduleID;
    }

    public void setItem(int item) {
        this.item = item;
    }

    public void setModuleID(String moduleID) {
        this.moduleID = moduleID;
    }

    @Override
    public HashMap<String, String> getData() {
        HashMap<String, String> data = super.getData();
        data.put("item", String.valueOf(item));
        data.put("moduleID", moduleID);

        return data;
    }
}
