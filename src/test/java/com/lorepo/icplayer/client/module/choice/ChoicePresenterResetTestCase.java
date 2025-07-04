package com.lorepo.icplayer.client.module.choice;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.module.choice.mockup.ChoiceViewMockup;

public class ChoicePresenterResetTestCase {
    private PlayerServicesMockup services;
    private ChoiceModel module;
    private ChoiceViewMockup display;
    private ChoicePresenter presenterSpy;

    @Before
    public void setUp() {
        services = new PlayerServicesMockup();
        module = new ChoiceModel();
    }

    private void buildDisplayAndPresenter() {
        display = new ChoiceViewMockup(module);
        ChoicePresenter presenter = new ChoicePresenter(module, services);
        presenter.addView(display);
        presenterSpy = Mockito.spy(presenter);
    }

    @Test
    public void givenVisibleByDefaultModuleWhenCallingShowThenCallsShowInView() {
        module.setIsVisible(true);
        buildDisplayAndPresenter();

        presenterSpy.reset(false);

        Mockito.verify(presenterSpy, Mockito.times(1)).show();
    }

    @Test
    public void givenVisibleByDefaultModuleWhenResettingModuleThenDoesNotCallHideInView() {
        module.setIsVisible(true);
        buildDisplayAndPresenter();

        presenterSpy.reset(false);

        Mockito.verify(presenterSpy, Mockito.never()).hide();
    }

    @Test
    public void givenNotVisibleByDefaultModuleWhenResettingModuleThenCallsHide() {
        module.setIsVisible(false);
        buildDisplayAndPresenter();

        presenterSpy.reset(false);

        Mockito.verify(presenterSpy, Mockito.times(1)).hide();
    }

    @Test
    public void givenNotVisibleByDefaultModuleWhenResettingModuleThenDoesNotCallShowInView() {
        module.setIsVisible(false);
        buildDisplayAndPresenter();

        presenterSpy.reset(false);

        Mockito.verify(presenterSpy, Mockito.never()).show();
    }

}
