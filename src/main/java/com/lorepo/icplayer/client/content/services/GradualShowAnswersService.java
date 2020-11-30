package com.lorepo.icplayer.client.content.services;

import com.lorepo.icplayer.client.module.api.IGradualShowAnswersPresenter;
import com.lorepo.icplayer.client.module.api.IPlayerStateService;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.event.GradualHideAnswerEvent;
import com.lorepo.icplayer.client.module.api.event.builders.GradualShowAnswersBuilder;
import com.lorepo.icplayer.client.module.api.player.IGradualShowAnswersService;
import com.lorepo.icplayer.client.module.api.player.IPageController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GradualShowAnswersService implements IGradualShowAnswersService {
    private final IPageController pageController;
    private int currentModule = 0;
    private int currentModuleItem = 0;
    private List<IGradualShowAnswersPresenter> presenters;
    private Map<String, Boolean> presenterDisabledState;


    public GradualShowAnswersService(IPageController pageController) {
        this.pageController = pageController;

        setCurrentPagePresenters();
    }

    @Override
    public void hideAll() {
        if (pageController.getPlayerServices().getPlayerStateService().isGradualShowAnswersMode()) {
            this.pageController.getPlayerServices().getEventBusService().getEventBus().fireEvent(new GradualHideAnswerEvent());
            enablePresenters();
            resetCounters();
        }
    }

    /**
     * @return boolean - if no more answers to show, then returns false.
     */
    @Override
    public boolean showNext() {
        boolean firstCall = !this.pageController.getPlayerServices().getPlayerStateService().isGradualShowAnswersMode();

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
                if (firstCall) {
                    disablePresenters();
                }
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

    private void enablePresenters() {
        for (IPresenter presenter : this.pageController.getPresenters()) {
            String key = presenter.getModel().getId();
            Boolean wasDisabled = presenterDisabledState.get(key);

            // if it was disabled then leave it disabled
            if (wasDisabled != null && !wasDisabled) {
                presenter.setDisabled(false);
            }
        }
    }

    private void disablePresenters() {
        for (IPresenter presenter : this.pageController.getPresenters()) {
            // remember the state of presenters, so it can be restored when the mode is switched off
            presenterDisabledState.put(presenter.getModel().getId(), presenter.isDisabled());

            presenter.setDisabled(true);
        }
    }

    private void setCurrentPagePresenters() {
        presenters = new ArrayList<IGradualShowAnswersPresenter>();
        presenterDisabledState = new HashMap<String, Boolean>();

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

    private void switchOffOtherModes() {
        IPlayerStateService pss = this.pageController.getPlayerServices().getPlayerStateService();
        if (pss.isCheckErrorsMode() || pss.isLimitedCheckAnswersMode()) {
            this.pageController.getPlayerServices().getCommands().uncheckAnswers();
        } else if (pss.isShowAnswersMode() || pss.isLimitedShowAnswersMode()) {
            this.pageController.getPlayerServices().getCommands().hideAnswers("");
        }
    }


    private IGradualShowAnswersPresenter getNextPresenter() {
        if (this.currentModule < this.presenters.size()) {
            return this.presenters.get(this.currentModule);
        }
        return null;
    }

    private void sendEvent(String moduleID, int itemIndex) {
        GradualShowAnswersBuilder builder = new GradualShowAnswersBuilder(moduleID, itemIndex);

        this.pageController.getPlayerServices().getEventBusService().getEventBus().fireEvent(builder.build());
    }
}
