package com.lorepo.icplayer.client.module.api.event.builders;

import com.lorepo.icplayer.client.module.api.event.GradualShowAnswerEvent;

public class GradualShowAnswersBuilder extends EventBuilder<GradualShowAnswersBuilder> {

    private final String moduleID;
    private final String itemID;

    public GradualShowAnswersBuilder(String moduleID, String itemID) {
        this.moduleID = moduleID;
        this.itemID = itemID;
    }

    @Override
    protected GradualShowAnswersBuilder getThis() {
        return this;
    }

    @Override
    public GradualShowAnswersBuilder setScore(String score) {
        return this;
    }

    public GradualShowAnswerEvent build() {
        GradualShowAnswerEvent event = new GradualShowAnswerEvent();

        event.setItem(this.itemID);
        event.setModuleID(this.moduleID);

        return event;
    }
}
