package com.lorepo.icplayer.client.content.service;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.content.services.externalNotifications.ObservableValue;
import com.lorepo.icplayer.client.content.services.externalNotifications.ObserverService;
import com.lorepo.icplayer.client.mockup.services.ObserverMockup;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class ObserverServiceTestCase extends GwtTest {
    private ObserverService service;

    @Before
    public void setUp() {
        this.service = new ObserverService();
    }

    @Test
    public void givenObserverWhenNotNotifiedThenWillNotBeCalled() {
        ObserverMockup observerMockup = new ObserverMockup();

        this.service.addObserver(ObservableValue.SAVE, observerMockup);

        assertFalse(observerMockup.wasCalled());
    }

    @Test
    public void givenObserverWhenNotifiedThenWillBeCalled() {
        ObserverMockup observerMockup = new ObserverMockup();

        this.service.addObserver(ObservableValue.SAVE, observerMockup);
        this.service.notifySave();

        assertTrue(observerMockup.wasCalled());
        assertEquals(1, observerMockup.getCallCount());
    }

    @Test
    public void givenObserverWhenNotifiedTwiceThenWillBeCalledTwice() {
        ObserverMockup observerMockup = new ObserverMockup();

        this.service.addObserver(ObservableValue.SAVE, observerMockup);
        this.service.notifySave();
        this.service.notifySave();

        assertTrue(observerMockup.wasCalled());
        assertEquals(2, observerMockup.getCallCount());
    }

    @Test
    public void givenTwoObserversWhenNotifiedThenBothWillBeCalled() {
        ObserverMockup observerMockup = new ObserverMockup();
        ObserverMockup observerMockup2 = new ObserverMockup();

        this.service.addObserver(ObservableValue.SAVE, observerMockup);
        this.service.addObserver(ObservableValue.SAVE, observerMockup2);
        this.service.notifySave();

        assertTrue(observerMockup.wasCalled());
        assertTrue(observerMockup2.wasCalled());
    }
}
