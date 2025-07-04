package com.lorepo.icplayer.client.module.imagegap;

import java.util.HashMap;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;

import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.imagegap.mockup.ImageGapViewMockup;

public class ImageGapPresenterShowAndHideTestCase {
    private PlayerServicesMockup services;
    private ImageGapModule module;
	private ImageGapViewMockup display;
    private ImageGapPresenter presenterSpy;

    @Before
    public void setUp() {
        services = new PlayerServicesMockup();
        module = new ImageGapModule();
        display = new ImageGapViewMockup(module);
    }

    private void buildPresenter() {
        ImageGapPresenter presenter = new ImageGapPresenter(module, services);
        presenter.addView(display);
        presenterSpy = Mockito.spy(presenter);
    }

    @Test
    public void givenVisibleByDefaultModuleWhenCallingShowThenCallsShowInViewObject() {
        module.setIsVisible(true);
        buildPresenter();

        presenterSpy.show();

        assertTrue(display.isVisible());
    }

    @Test
    public void givenVisibleByDefaultModuleWhenCallingHideThenCallsHideInViewObject() {
        module.setIsVisible(true);
        buildPresenter();

        presenterSpy.hide();

        assertFalse(display.isVisible());
    }

    @Test
    public void givenNotVisibleByDefaultModuleWhenCallingShowThenCallsShowInViewObject() {
        module.setIsVisible(false);
        buildPresenter();

        presenterSpy.show();

        assertTrue(display.isVisible());
    }

    @Test
    public void givenNotVisibleByDefaultModuleWhenCallingHideThenCallsHideInViewObject() {
        module.setIsVisible(false);
        buildPresenter();

        presenterSpy.hide();

        assertFalse(display.isVisible());
    }

    @Test
    public void givenVisibleByDefaultModuleWhenCallingShowThenStateIsVisibleIsTrue() {
        module.setIsVisible(true);
        buildPresenter();

        presenterSpy.show();

        String stateObj = presenterSpy.getState();
        IJsonServices json = services.getJsonServices();
		HashMap<String, String> state = json.decodeHashMap(stateObj);
        assertTrue(state.get("isVisible").equals("true"));
    }

    @Test
    public void givenVisibleByDefaultModuleWhenCallingHideThenStateIsVisibleIsFalse() {
        module.setIsVisible(true);
        buildPresenter();

        presenterSpy.hide();

        String stateObj = presenterSpy.getState();
        IJsonServices json = services.getJsonServices();
		HashMap<String, String> state = json.decodeHashMap(stateObj);
        assertTrue(state.get("isVisible").equals("false"));
    }

    @Test
    public void givenNotVisibleByDefaultModuleWhenCallingShowThenStateIsVisibleIsTrue() {
        module.setIsVisible(false);
        buildPresenter();

        presenterSpy.show();

        String stateObj = presenterSpy.getState();
        IJsonServices json = services.getJsonServices();
		HashMap<String, String> state = json.decodeHashMap(stateObj);
        assertTrue(state.get("isVisible").equals("true"));
    }

    @Test
    public void givenNotVisibleByDefaultModuleWhenCallingHideThenStateIsVisibleIsFalse() {
        module.setIsVisible(false);
        buildPresenter();

        presenterSpy.hide();

        String stateObj = presenterSpy.getState();
        IJsonServices json = services.getJsonServices();
		HashMap<String, String> state = json.decodeHashMap(stateObj);
        assertTrue(state.get("isVisible").equals("false"));
    }

}
