package com.lorepo.icplayer.client.content.services;

import com.lorepo.icplayer.client.module.api.IGradualShowAnswersPresenter;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.event.builders.GradualShowAnswersBuilder;
import com.lorepo.icplayer.client.module.api.player.IGradualShowAnswersService;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;

import java.util.ArrayList;
import java.util.List;

public class GradualShowAnswersService implements IGradualShowAnswersService {
    private final IPlayerServices playerServices;
    private int currentModule = 0;
    private int currentModuleItem = 0;
    private final List<IGradualShowAnswersPresenter> presenters;

    public GradualShowAnswersService(IPlayerServices playerServices) {
        this.playerServices = playerServices;

        presenters = new ArrayList<IGradualShowAnswersPresenter>();

        for (IPresenter presenter : this.playerServices.getCommands().getPageController().getPresenters()) {
            if (presenter instanceof IGradualShowAnswersPresenter) {
                presenters.add((IGradualShowAnswersPresenter) presenter);
            }
        }
    }

    /**
     * @return boolean - if no more answers to show, then returns false.
     */
    @Override
    public boolean showNext() {
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
        this.currentModuleItem = 0;
        this.currentModule = 0;
    }

    private void switchOffOtherModes() {

    }

    private IGradualShowAnswersPresenter getNextPresenter() {
        if (this.currentModule < this.presenters.size()) {
            return this.presenters.get(this.currentModule);
        }
        return null;
    }

    private void sendEvent(String moduleID, int itemIndex) {
        GradualShowAnswersBuilder builder = new GradualShowAnswersBuilder(moduleID, String.valueOf(itemIndex));

        this.playerServices.getEventBus().fireEvent(builder.build());
    }
}
