package com.lorepo.icplayer.client.module.imagegap;

import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.module.imagegap.mockup.ImageGapViewMockup;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

public class ImageGapPresenterResetTestCase {
    private PlayerServicesMockup services;
    private ImageGapViewMockup display;
    private ImageGapModule module;
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
    public void givenVisibleByDefaultModuleWhenCallingShowThenCallsShowInView() {
        module.setIsVisible(true);
        buildPresenter();
        
        presenterSpy.reset(false);
        
        Mockito.verify(presenterSpy, Mockito.times(1)).show();
    }
    
    @Test
    public void givenVisibleByDefaultModuleWhenResettingModuleThenDoesNotCallHide() {
        module.setIsVisible(true);
        buildPresenter();
        
        presenterSpy.reset(false);
        
        Mockito.verify(presenterSpy, Mockito.never()).hide();
    }
    
    @Test
    public void givenNotVisibleByDefaultModuleWhenResettingModuleThenCallsHide() {
        module.setIsVisible(false);
        buildPresenter();
        
        presenterSpy.reset(false);
        
        Mockito.verify(presenterSpy, Mockito.times(1)).hide();
    }
    
    @Test
    public void givenNotVisibleByDefaultModuleWhenResettingModuleThenDoesNotCallShow() {
        module.setIsVisible(false);
        buildPresenter();
        
        presenterSpy.reset(false);
        
        Mockito.verify(presenterSpy, Mockito.never()).show();
    }

}
