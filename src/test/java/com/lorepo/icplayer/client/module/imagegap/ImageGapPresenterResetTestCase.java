package com.lorepo.icplayer.client.module.imagegap;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.module.imagegap.mockup.ImageGapViewMockup;

public class ImageGapPresenterResetTestCase {
    private PlayerServicesMockup services;
    private ImageGapModule module;
    private ImageGapViewMockup display;
    private ImageGapPresenter presenterSpy;
    
    @Before
    public void setUp() {
        services = new PlayerServicesMockup();
        module = new ImageGapModule();
    }
    
    private void buildDisplayAndPresenter() {
        display = new ImageGapViewMockup(module);
        ImageGapPresenter presenter = new ImageGapPresenter(module, services);
        presenter.addView(display);
        presenterSpy = Mockito.spy(presenter);
    }
    
    @Test
    public void givenNotErrorsModeWhenResettingThenDoesNotCallSetWorkMode() {
        buildDisplayAndPresenter();

        presenterSpy.reset(false);

        Mockito.verify(presenterSpy, Mockito.never()).setWorkMode();
    }
    
    @Test
    public void givenErrorsModeWhenResettingThenCallsSetWorkMode() {
        buildDisplayAndPresenter();
        presenterSpy.setShowErrorsMode();

        presenterSpy.reset(false);
        
        Mockito.verify(presenterSpy, Mockito.times(1)).setWorkMode();
    }
    
    @Test
    public void givenVisibleByDefaultModuleWheResettingThenCallsShow() {
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
