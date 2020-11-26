package com.lorepo.icplayer.client.content.services;

import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.api.IGradualShowAnswersPresenter;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.event.GradualHideAnswerEvent;
import com.lorepo.icplayer.client.module.api.event.builders.GradualShowAnswersBuilder;
import com.lorepo.icplayer.client.module.api.player.IGradualShowAnswersService;
import com.lorepo.icplayer.client.module.api.player.IPageController;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.page.PageController;

import java.util.ArrayList;
import java.util.List;

public class GradualShowAnswersService implements IGradualShowAnswersService {
    private final IPageController pageController;
    private int currentModule = 0;
    private int currentModuleItem = 0;
    private List<IGradualShowAnswersPresenter> presenters;


    public GradualShowAnswersService(IPageController pageController) {
        this.pageController = pageController;

        setCurrentPagePresenters();
    }

    @Override
    public void hideAll() {
        this.pageController.getPlayerServices().getEventBus().fireEvent(new GradualHideAnswerEvent());
        setDisabled(false);
    }

    /**
     * @return boolean - if no more answers to show, then returns false.
     */
    @Override
    public boolean showNext() {
        boolean firstCall = !this.pageController.getPlayerServices().getPlayerStateService().isGradualShowAnswersMode();
        if (firstCall) {
            //TODO: switch off other modes?
            setDisabled(true);
        }

        IGradualShowAnswersPresenter currentPresenter = getNextPresenter();

        if (currentPresenter != null) {
            int activitiesCount = currentPresenter.getActivitiesCount();
            if (this.currentModuleItem >= activitiesCount) {
                this.currentModule++;
                this.currentModuleItem = 0;
                // try to show item answer for next module
                return showNext();
            } else {
                this.sendEvent(currentPresenter.getModel().getId(), this.currentModuleItem);
                this.currentModuleItem++;
                return true;
            }
        }

        return false;
    }

    @Override
    public void reset() {
        resetCounters();
    }

    @Override
    public void refreshCurrentPagePresenters() {
        setCurrentPagePresenters();
    }

    private void resetCounters() {
        this.currentModuleItem = 0;
        this.currentModule = 0;
    }

    private void setDisabled(boolean value) {
        for (IPresenter presenter : this.pageController.getPresenters()) {
            presenter.setDisabled(value);
        }
    }

    private void setCurrentPagePresenters() {
        presenters = new ArrayList<IGradualShowAnswersPresenter>();

        List<IPresenter> pagePresenters = this.pageController.getPresenters();
        if (pagePresenters != null) {
            for (IPresenter presenter : pagePresenters) {
                if (presenter instanceof IGradualShowAnswersPresenter) {
                    presenters.add((IGradualShowAnswersPresenter) presenter);
                }
            }
        }

        resetCounters();
    }


    private IGradualShowAnswersPresenter getNextPresenter() {
        if (this.currentModule < this.presenters.size()) {
            return this.presenters.get(this.currentModule);
        }
        return null;
    }

    private void sendEvent(String moduleID, int itemIndex) {
        GradualShowAnswersBuilder builder = new GradualShowAnswersBuilder(moduleID, itemIndex);

        this.pageController.getPlayerServices().getEventBus().fireEvent(builder.build());
    }
}
