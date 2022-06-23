package com.lorepo.icplayer.client.module.limitedreset;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.After;
import org.junit.Test;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.doNothing;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;

import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo_patchers.icfoundation.TextToSpeechVoicePatcher;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTLimitedResetViewWCAGTestCase extends GwtTest {
	LimitedResetView view = null;
	LimitedResetView viewSpy = null;
	LimitedResetModule module = null;
	PageController pageControllerMock = null;
	PlayerServicesMockup servicesMock = null;
	
	@Before
	public void setUp() {
		this.module = new LimitedResetModule();
		this.servicesMock = new PlayerServicesMockup();
		this.view = new LimitedResetView(this.module, this.servicesMock);
		
		this.viewSpy = spy(this.view);
		doNothing().when(this.viewSpy).performReset();
		
		pageControllerMock = mock(PageController.class);
		this.viewSpy.setPageController(pageControllerMock);
	}

	@After
	public void tearDown() {
		TextToSpeechVoicePatcher.resetCallCount();
	}

	@Test
	public void testGivenDisabledViewWhenFirstEnterPressThenDoNotPerformResetAndReadDisabledSpeechText() {
		this.viewSpy.setDisabled(true);

		this.pressEnter();

		this.verifyIfNotPerformedReset();
		this.verifyIfSpeechTextCreatedCountEqualTo(1);
		this.verifyIfSpokenDisabledSpeechText();
	}
	
	@Test
	public void testGivenViewWhenEnterPressThenDoNotPerformResetAndReadDisabledSpeechText() {
		this.viewSpy.setDisabled(true);
		this.activateWCAG();

		this.pressEnter();

		this.verifyIfNotPerformedReset();
		this.verifyIfSpeechTextCreatedCountEqualTo(1);
		this.verifyIfSpokenDisabledSpeechText();
	}

	@Test
	public void testGivenViewWhenFirstEnterPressThenPerformResetAndReadResetSpeechText() {
		this.pressEnter();

		this.verifyIfPerformedReset();
		this.verifyIfSpeechTextCreatedCountEqualTo(1);
		this.verifyIfSpokenResetSpeechText();
	}
	
	@Test
	public void testGivenViewWhenEnterPressThenPerformResetAndReadResetSpeechText() {
		this.activateWCAG();

		this.pressEnter();

		this.verifyIfPerformedReset();
		this.verifyIfSpeechTextCreatedCountEqualTo(1);
		this.verifyIfSpokenResetSpeechText();
	}

	@Test
	public void textGivenViewWhenSpacePressThenDoNotPerformResetAndDoNotSpeek() {
		this.activateWCAG();

		this.pressSpace();

		this.verifyIfNotPerformedReset();
		this.verifyIfSpeechTextCreatedCountEqualTo(0);
	}

	private void activateWCAG() {
		this.viewSpy.setWCAGStatus(true);
	}

	private void deactivateWCAG() {
		this.viewSpy.setWCAGStatus(false);
	}

	private void pressEnter() {
		KeyDownEvent eventMock = mock(KeyDownEvent.class);

		this.viewSpy.enter(eventMock, false);
	}

	private void pressSpace() {
		KeyDownEvent eventMock = mock(KeyDownEvent.class);

		this.viewSpy.space(eventMock);
	}

	private void verifyIfSpeechTextCreatedCountEqualTo(int expectedCount) {
		assertEquals(
			"Speech text should be created " + expectedCount + " times but was " + TextToSpeechVoicePatcher.callCount(),
			expectedCount,
			TextToSpeechVoicePatcher.callCount()
		);
	}

	private void verifyIfSpokenDisabledSpeechText() {
		String message = "Disabled";
		assertEquals(
			"Spoken speech text should be '" + message + "' but was '" + TextToSpeechVoicePatcher.lastCreatedItemText() + "'",
			message,
			TextToSpeechVoicePatcher.lastCreatedItemText()
		);
	}

	private void verifyIfSpokenResetSpeechText() {
		String message = "Activity has been reset";
		assertEquals(
			"Spoken speech text should be '" + message + "' but was '" + TextToSpeechVoicePatcher.lastCreatedItemText() + "'",
			message,
			TextToSpeechVoicePatcher.lastCreatedItemText()
		);
	}

	private void verifyIfPerformedReset() {
		verify(this.viewSpy, times(1)).performReset();
	}

	private void verifyIfNotPerformedReset() {
		verify(this.viewSpy, times(0)).performReset();
	}
}
