package com.lorepo.icplayer.client.module.pageprogress;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.module.pageprogress.mockup.PageProgressViewMockup;

public class PageProgressPresenterResetTestCase {
    private PlayerServicesMockup services;
    private PageProgressModule module;
    private PageProgressViewMockup display;
    private PageProgressPresenter presenterSpy;

    @Before
    public void setUp() {
        services = new PlayerServicesMockup();
        module = new PageProgressModule();
    }

    private void buildDisplayAndPresenter() {
        display = new PageProgressViewMockup(module);
        PageProgressPresenter presenter = new PageProgressPresenter(module, services);
        presenter.addView(display);
        presenterSpy = Mockito.spy(presenter);
    }

    @Test
    public void givenVisibleByDefaultModuleWhenResettingThenCallsShow() {
        module.setIsVisible(true);
        buildDisplayAndPresenter();

        presenterSpy.reset(false);

        Mockito.verify(presenterSpy, Mockito.times(1)).show();
    }

    @Test
    public void givenVisibleByDefaultModuleWhenResettingThenDoesNotCallHide() {
        module.setIsVisible(true);
        buildDisplayAndPresenter();

        presenterSpy.reset(false);

        Mockito.verify(presenterSpy, Mockito.never()).hide();
    }

    @Test
    public void givenNotVisibleByDefaultModuleWhenResettingThenCallsHide() {
        module.setIsVisible(false);
        buildDisplayAndPresenter();

        presenterSpy.reset(false);

        Mockito.verify(presenterSpy, Mockito.times(1)).hide();
    }

    @Test
    public void givenNotVisibleByDefaultModuleWhenResettingThenDoesNotCallShow() {
        module.setIsVisible(false);
        buildDisplayAndPresenter();

        presenterSpy.reset(false);

        Mockito.verify(presenterSpy, Mockito.never()).show();
    }

}
