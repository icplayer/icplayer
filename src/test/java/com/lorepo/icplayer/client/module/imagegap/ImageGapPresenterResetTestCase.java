package com.lorepo.icplayer.client.module.imagegap;

import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.module.imagegap.mockup.ImageGapViewMockup;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

public class ImageGapPresenterResetTestCase {
    private ImageGapPresenter presenterSpy;

    @Before
    public void setUp() {
        PlayerServicesMockup services = new PlayerServicesMockup();
        ImageGapModule module = new ImageGapModule();

        ImageGapPresenter presenter = new ImageGapPresenter(module, services);
        presenter.addView(new ImageGapViewMockup(module));

        presenterSpy = Mockito.spy(presenter);
    }

    @Test
    public void givenNotErrorsModeWhenResettingModuleThenDoesNotCallSetWorkMode() {
        presenterSpy.reset(false);

        Mockito.verify(presenterSpy, Mockito.never()).setWorkMode();
    }

    @Test
    public void givenErrorsModeWhenResettingModuleThenCallsSetWorkMode() {
        presenterSpy.setShowErrorsMode();
        presenterSpy.reset(false);

        Mockito.verify(presenterSpy, Mockito.times(1)).setWorkMode();
    }

}
