package com.lorepo.icplayer.client.module.api.event.builders;

import com.lorepo.icplayer.client.module.api.event.GradualShowAnswerEvent;

public class GradualShowAnswersBuilder extends EventBuilder<GradualShowAnswersBuilder> {

    private final String moduleID;
    private final int item;

    public GradualShowAnswersBuilder(String moduleID, int item) {
        this.moduleID = moduleID;
        this.item = item;
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

        event.setItem(this.item);
        event.setModuleID(this.moduleID);

        return event;
    }
}
