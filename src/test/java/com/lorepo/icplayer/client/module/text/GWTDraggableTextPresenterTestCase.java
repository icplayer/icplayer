package com.lorepo.icplayer.client.module.text;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.module.text.mockup.TextViewMockup;
import org.junit.Before;
import org.junit.Test;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertFalse;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTDraggableTextPresenterTestCase extends GwtTest {
	private TextViewMockup display = null;
	private TextPresenter presenter = null;
	private TextModel module = null;

	@Before
	public void setUp() {
		module = new TextModel();

		PlayerServicesMockup services = new PlayerServicesMockup();
		display = new TextViewMockup(module);
		presenter = new TextPresenter(module, services);
		presenter.addView(display);
	}
	
	@Test
	public void testGivenViewListenerWhenGapDraggedThenWillCallRefreshMathOnlyForGap() {
		display.getListener().onGapDragged("");

		assertFalse(display.wasRefreshMathCalled());
		assertTrue(display.wasRefreshGapMathCalled());
	}

}
