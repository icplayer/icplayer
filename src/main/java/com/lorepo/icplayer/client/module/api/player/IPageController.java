package com.lorepo.icplayer.client.module.api.player;

import com.lorepo.icplayer.client.module.api.IPresenter;

import java.util.List;

public interface IPageController {
    void updateScore(boolean value);
    IPage getPage();
    void hideAnswers(String source);
    void showAnswers(String source);
    List<IPresenter> getPresenters();
    IGradualShowAnswersService getGradualShowAnswersService();
    IPlayerServices getPlayerServices();
}
