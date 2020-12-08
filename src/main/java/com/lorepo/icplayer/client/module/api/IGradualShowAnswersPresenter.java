package com.lorepo.icplayer.client.module.api;

public interface IGradualShowAnswersPresenter extends IPresenter {
    int getActivitiesCount();
    void handleGradualShowAnswers(int itemIndex);
    void handleGradualHideAnswers();
}
