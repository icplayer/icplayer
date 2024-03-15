package com.lorepo.icplayer.client.content.services;

import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.addon.AddonPresenter;
import com.lorepo.icplayer.client.module.api.IActivity;
import com.lorepo.icplayer.client.module.api.IGradualShowAnswersPresenter;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.event.GradualHideAnswerEvent;
import com.lorepo.icplayer.client.module.api.event.builders.GradualShowAnswersBuilder;
import com.lorepo.icplayer.client.module.api.player.IGradualShowAnswersService;
import com.lorepo.icplayer.client.module.api.player.IPageController;

import java.util.*;

public class GradualShowAnswersService implements IGradualShowAnswersService {
    private final IPageController pageController;
    private List<IGradualShowAnswersPresenter> presenters;
    private Map<String, Boolean> presenterDisabledState;
    private Map<String, Integer> presenterActivitiesCountUsed;

    public GradualShowAnswersService(IPageController pageController) {
        this.pageController = pageController;

        setCurrentPagePresenters();
    }

    @Override
    public void hideAll() {
        if (
            pageController.getPlayerServices().getPlayerStateService().isGradualShowAnswersMode() ||
            pageController.getPlayerServices().getPlayerStateService().isGradualShowAnswersModeBeforeCheck()
        ) {
            this.pageController.getPlayerServices().getEventBusService().getEventBus().fireEvent(new GradualHideAnswerEvent());
            enablePresenters();
            resetCounters();
        }
    }

    /**
     * @return boolean - if no more answers to show, then returns false.
     */
    @Override
    public boolean showNext(String worksWith) {
        List<String> worksWithList = new ArrayList<String>();
        if(worksWith != null) {
            for (String workWith : worksWith.split("\n")) {
                if (!workWith.isEmpty()) {
                    worksWithList.add(workWith.trim());
                }
            }
        }

        boolean firstCall = !this.pageController.getPlayerServices().getPlayerStateService().isGradualShowAnswersMode();
        IGradualShowAnswersPresenter currentPresenter = getPresenter(worksWithList);

        if (currentPresenter != null) {
            String id = currentPresenter.getModel().getId();
            int activities = presenterActivitiesCountUsed.get(id);
            this.setPresenterActivitiesCountUsed(id, activities + 1);
            if (firstCall) {
                disablePresenters();
            }
            this.sendEvent(currentPresenter.getModel().getId(), activities);
            return true;
        }

        return false;
    }

    public void setPresenterActivitiesCountUsed(String id, int activities){
        presenterActivitiesCountUsed.put(id, activities);
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
        for(String key: presenterActivitiesCountUsed.keySet()){
            presenterActivitiesCountUsed.put(key, 0);
        }
    }

    private void enablePresenters() {
        for (IPresenter presenter : this.pageController.getPresenters()) {
            String key = presenter.getModel().getId();
            Boolean wasDisabled = presenterDisabledState.get(key);

            // if it was disabled then leave it disabled
            if (wasDisabled != null && !wasDisabled) {
                try {
                    presenter.setDisabled(false);
                } catch (Exception e) {
                    JavaScriptUtils.error(e.getMessage());
                }
            }
        }
    }

    private void disablePresenters() {
        for (IPresenter presenter : this.pageController.getPresenters()) {
            if (presenter instanceof AddonPresenter) {
                AddonPresenter addonPresenter = (AddonPresenter)presenter;
                if (addonPresenter.isEnabledInGSAMode()) continue;
            }
            // remember the state of presenters, so it can be restored when the mode is switched off
            presenterDisabledState.put(presenter.getModel().getId(), presenter.isDisabled());

            presenter.setDisabled(true);
        }
    }

    private void setCurrentPagePresenters() {
        presenters = new ArrayList<IGradualShowAnswersPresenter>();
        presenterDisabledState = new HashMap<String, Boolean>();
        presenterActivitiesCountUsed = new HashMap<String, Integer>();

        List<IPresenter> pagePresenters = this.pageController.getPresenters();
        if (pagePresenters != null) {
            for (IPresenter presenter : pagePresenters) {
                if (presenter instanceof IActivity) {
                    boolean isActivity = ((IActivity)presenter).isActivity();
                    if (!isActivity) continue;
                }
                if (presenter instanceof IGradualShowAnswersPresenter) {
                    presenters.add((IGradualShowAnswersPresenter) presenter);
                    presenterActivitiesCountUsed.put(presenter.getModel().getId(), 0);
                }
            }
        }
    }

    private IGradualShowAnswersPresenter getPresenter(List<String> worksWith) {
        for(IGradualShowAnswersPresenter presenter: presenters){
            if(this.workWithThisPresenter(worksWith, presenter) && this.presenterHasFreeActivities(presenter)){
                return presenter;
            }
        }
        return null;
    }

    private boolean workWithThisPresenter(List<String> worksWith, IGradualShowAnswersPresenter presenter){
        String id = presenter.getModel().getId();
        return worksWith.size() == 0 || worksWith.contains(id);
    }

    private boolean presenterHasFreeActivities(IGradualShowAnswersPresenter presenter){
        String id = presenter.getModel().getId();
        Integer activitiesCount = presenter.getActivitiesCount();
        return presenterActivitiesCountUsed.get(id) < activitiesCount;
    }

    private void sendEvent(String moduleID, int itemIndex) {
        GradualShowAnswersBuilder builder = new GradualShowAnswersBuilder(moduleID, itemIndex);
        this.pageController.getPlayerServices().getEventBusService().getEventBus().fireEvent(builder.build());
    }
}
