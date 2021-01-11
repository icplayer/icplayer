package com.lorepo.icplayer.client.module.api.player;

public interface IGradualShowAnswersService {
    void hideAll();
    boolean showNext();
    void reset();
    void refreshCurrentPagePresenters();
}
