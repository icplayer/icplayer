package com.lorepo.icplayer.client.module.checkcounter;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.checkcounter.CheckCounterPresenter.IDisplay;


public class PresenterTestCase {

	private class TestDisplay implements IDisplay{

		public int value = 7;
		
		public TestDisplay(CheckCounterModule model) {
		}
		
		@Override
		public void setData(int value) {
			this.value = value;
		}

	}

	
	@Test
	public void resetValueOnStart() {
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		CheckCounterModule model = new CheckCounterModule();
		TestDisplay display = new TestDisplay(model);
		CheckCounterPresenter presenter = new CheckCounterPresenter(model, services);
		presenter.addView(display);
		
		assertEquals(0, display.value);
	}

	
	@Test
	public void showErrorsEvent() {
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		CheckCounterModule model = new CheckCounterModule();
		TestDisplay display = new TestDisplay(model);
		CheckCounterPresenter presenter = new CheckCounterPresenter(model, services);
		presenter.addView(display);
		
		services.getEventBus().fireEvent(new ShowErrorsEvent());
		
		assertEquals(1, display.value);
	}

}
