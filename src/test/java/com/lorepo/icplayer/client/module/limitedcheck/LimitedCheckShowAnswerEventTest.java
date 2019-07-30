package com.lorepo.icplayer.client.module.limitedcheck;

import static com.lorepo.icplayer.client.module.limitedcheck.LimitedCheckPresenter.*;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.*;

import java.util.*;

import com.google.gwt.event.shared.EventBus;
import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.ArgumentCaptor;
import org.powermock.reflect.Whitebox;
import org.powermock.modules.junit4.PowerMockRunner;

@RunWith(PowerMockRunner.class)
public class LimitedCheckShowAnswerEventTest {

    private EventBus eventBus;
    private IPlayerServices iPlayerServices;
    private IDisplay iDisplay;
    private IJsonServices jsonServices;

    @Before
    public void setUp(){
        LimitedCheckModule module = new LimitedCheckModule();
        List<String> modules = Arrays.asList("module1", "module2");
        Whitebox.setInternalState(module, "modules", modules);

        iPlayerServices = new PlayerServicesMockup();
        eventBus = iPlayerServices.getEventBus();

        iDisplay = Mockito.mock(IDisplay.class);

        LimitedCheckPresenter limitedCheckPresenter = new LimitedCheckPresenter(module, iPlayerServices);
        Whitebox.setInternalState(limitedCheckPresenter, "view", iDisplay);

        jsonServices = Mockito.mock(IJsonServices.class);
        Whitebox.setInternalState(iPlayerServices, "jsonMockup", jsonServices);
    }

    @Test
    public void whenLimitedHideAnswerEventHasOccurred_thenOnlyDisableShowAnswerMode() {
        // arrange
        List<String> eventItems = new ArrayList<String>();
        eventItems.add("module1");
        when(jsonServices.decodeArrayValues(any(String.class))).thenReturn(eventItems);

        ValueChangedEvent valueChangedEvent = new ValueChangedEvent(null, null, "LimitedHideAnswers", null);

        ArgumentCaptor<Boolean> argument = ArgumentCaptor.forClass(Boolean.class);

        // act
        eventBus.fireEventFromSource(valueChangedEvent, this);

        // assert
        verify(iDisplay).setShowAnswersMode(argument.capture());
        assertFalse(argument.getValue());

        verify(iDisplay, never()).setDisabled(true);
        verify(iDisplay, never()).setDisabled(false);
    }

    @Test
    public void whenLimitedHideAnswerEventWithMismatchingModulesHasOccurred_thenDoNothing() {
        // arrange
        List<String> eventItems = new ArrayList<String>();
        eventItems.add("module3");
        when(jsonServices.decodeArrayValues(any(String.class))).thenReturn(eventItems);

        ValueChangedEvent valueChangedEvent = new ValueChangedEvent(null, null, "LimitedHideAnswers", null);

        // act
        eventBus.fireEventFromSource(valueChangedEvent, this);

        // assert
        verify(iDisplay, never()).setShowAnswersMode(true);
        verify(iDisplay, never()).setShowAnswersMode(false);

        verify(iDisplay, never()).setDisabled(true);
        verify(iDisplay, never()).setDisabled(false);
    }

    @Test
    public void whenLimitedShowAnswerEventHasOccurred_thenEnableShowAnswerModeAndDisableModule() {
        // arrange
        List<String> eventItems = new ArrayList<String>();
        eventItems.add("module2");
        when(jsonServices.decodeArrayValues(any(String.class))).thenReturn(eventItems);

        ValueChangedEvent valueChangedEvent = new ValueChangedEvent(null, null, "LimitedShowAnswers", null);

        ArgumentCaptor<Boolean> argument = ArgumentCaptor.forClass(Boolean.class);

        // act
        eventBus.fireEventFromSource(valueChangedEvent, this);

        // assert
        verify(iDisplay).setShowAnswersMode(argument.capture());
        assertTrue(argument.getValue());

        verify(iDisplay).setDisabled(argument.capture());
        assertFalse(argument.getValue());
    }

    @Test
    public void whenLimitedShowAnswerEventWithMismatchingModulesHasOccurred_thenDoNothing() {
        // arrange
        List<String> eventItems = new ArrayList<String>();
        eventItems.add("module3");
        when(jsonServices.decodeArrayValues(any(String.class))).thenReturn(eventItems);

        ValueChangedEvent valueChangedEvent = new ValueChangedEvent(null, null, "LimitedShowAnswers", null);

        // act
        eventBus.fireEventFromSource(valueChangedEvent, this);

        // assert
        verify(iDisplay, never()).setShowAnswersMode(true);
        verify(iDisplay, never()).setShowAnswersMode(false);

        verify(iDisplay, never()).setDisabled(true);
        verify(iDisplay, never()).setDisabled(false);
    }
}