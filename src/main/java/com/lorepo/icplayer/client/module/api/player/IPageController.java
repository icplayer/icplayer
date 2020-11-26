package com.lorepo.icplayer.client.module.api.player;

import com.lorepo.icplayer.client.content.services.GradualShowAnswersService;
import com.lorepo.icplayer.client.module.api.IPresenter;
import java.util.List;

public interface IPageController {
    void updateScore(boolean value);
    IPage getPage();
    List<IPresenter> getPresenters();
    GradualShowAnswersService getGradualShowAnswersService();
    IPlayerServices getPlayerServices();
}
