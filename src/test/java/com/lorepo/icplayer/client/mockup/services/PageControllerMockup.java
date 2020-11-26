package com.lorepo.icplayer.client.mockup.services;

import com.lorepo.icplayer.client.content.services.GradualShowAnswersService;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IPageController;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

import java.util.ArrayList;
import java.util.List;

public class PageControllerMockup implements IPageController {
    @Override
    public void updateScore(boolean value) {

    }

    @Override
    public IPage getPage() {
        return null;
    }

    @Override
    public List<IPresenter> getPresenters() {
        return new ArrayList<IPresenter>();
    }

    @Override
    public GradualShowAnswersService getGradualShowAnswersService() {
        return null;
    }

    @Override
    public IPlayerServices getPlayerServices() {
        return null;
    }
}
