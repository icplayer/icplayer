package com.lorepo.icplayer.client.module.api.player;

public interface IGradualShowAnswersService {
    void hideAll();
    boolean showNext(String worksWith);
    void reset();
    void refreshCurrentPagePresenters();
}
