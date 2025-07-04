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

public class ImageGapPresenterVisibilityTestCase {
    private PlayerServicesMockup services;
    private ImageGapModule module;
    private ImageGapViewMockup display;
    private ImageGapPresenter presenter;
    
    @Before
    public void setUp() {
        services = new PlayerServicesMockup();
        module = new ImageGapModule();
    }
    
    private void buildDisplayAndPresenter() {
        display = new ImageGapViewMockup(module);
        presenter = new ImageGapPresenter(module, services);
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
