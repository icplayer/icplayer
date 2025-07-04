package com.lorepo.icplayer.client.module.pageprogress;

import java.util.HashMap;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.pageprogress.mockup.PageProgressViewMockup;

public class PageProgressPresenterVisibilityTestCase {
    private PlayerServicesMockup services;
    private PageProgressModule module;
    private PageProgressViewMockup display;
    private PageProgressPresenter presenter;

    @Before
    public void setUp() {
        services = new PlayerServicesMockup();
        module = new PageProgressModule();
    }

    private void buildDisplayAndPresenter() {
        display = new PageProgressViewMockup(module);
        presenter = new PageProgressPresenter(module, services);
        presenter.addView(display);
    }

    private HashMap<String, String> getState() {
        String stateObj = presenter.getState();
        IJsonServices json = services.getJsonServices();
        return json.decodeHashMap(stateObj);
    }

    @Test
    public void givenVisibleByDefaultModuleWhenBuildingPresenterThenStateIsVisibleIsTrue() {
        module.setIsVisible(true);
        buildDisplayAndPresenter();

        assertTrue(getState().get("isVisible").equals("true"));
    }

    @Test
    public void givenNotVisibleByDefaultModuleWhenBuildingPresenterThenStateIsVisibleIsFalse() {
        module.setIsVisible(false);
        buildDisplayAndPresenter();

        assertTrue(getState().get("isVisible").equals("false"));
    }

    @Test
    public void givenVisibleByDefaultModuleWhenCallingShowThenShowsView() {
        module.setIsVisible(true);
        buildDisplayAndPresenter();

        presenter.show();

        assertTrue(display.isVisible());
    }

    @Test
    public void givenVisibleByDefaultModuleWhenCallingHideThenHidesView() {
        module.setIsVisible(true);
        buildDisplayAndPresenter();

        presenter.hide();

        assertFalse(display.isVisible());
    }

    @Test
    public void givenNotVisibleByDefaultModuleWhenCallingShowThenShowsView() {
        module.setIsVisible(false);
        buildDisplayAndPresenter();

        presenter.show();

        assertTrue(display.isVisible());
    }

    @Test
    public void givenNotVisibleByDefaultModuleWhenCallingHideThenHidesView() {
        module.setIsVisible(false);
        buildDisplayAndPresenter();

        presenter.hide();

        assertFalse(display.isVisible());
    }

    @Test
    public void givenVisibleByDefaultModuleWhenCallingShowThenStateIsVisibleIsTrue() {
        module.setIsVisible(true);
        buildDisplayAndPresenter();

        presenter.show();

        assertTrue(getState().get("isVisible").equals("true"));
    }

    @Test
    public void givenVisibleByDefaultModuleWhenCallingHideThenStateIsVisibleIsFalse() {
        module.setIsVisible(true);
        buildDisplayAndPresenter();

        presenter.hide();

        assertTrue(getState().get("isVisible").equals("false"));
    }

    @Test
    public void givenNotVisibleByDefaultModuleWhenCallingShowThenStateIsVisibleIsTrue() {
        module.setIsVisible(false);
        buildDisplayAndPresenter();

        presenter.show();

        assertTrue(getState().get("isVisible").equals("true"));
    }

    @Test
    public void givenNotVisibleByDefaultModuleWhenCallingHideThenStateIsVisibleIsFalse() {
        module.setIsVisible(false);
        buildDisplayAndPresenter();

        presenter.hide();

        assertTrue(getState().get("isVisible").equals("false"));
    }

}
