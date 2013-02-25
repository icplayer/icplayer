package com.lorepo.icplayer.client.module.pageprogress;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.pageprogress.PageProgressPresenter.IDisplay;

public class PresenterTestCase {

	private class TestDisplay implements IDisplay{

		public int value = 5;
		
		public TestDisplay(PageProgressModule model) {
		}
		
		@Override
		public void setData(int value) {
			this.value = value;
		}

	}

	
	@Test
	public void resetValueOnStart() {
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		PageProgressModule model = new PageProgressModule();
		TestDisplay display = new TestDisplay(model);
		PageProgressPresenter presenter = new PageProgressPresenter(model, services);
		presenter.addView(display);
		
		assertEquals(0, display.value);
	}

	
	@Test
	public void showErrorsEvent() {
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		PageProgressModule model = new PageProgressModule();
		TestDisplay display = new TestDisplay(model);
		PageProgressPresenter presenter = new PageProgressPresenter(model, services);
		presenter.addView(display);
		
		services.getEventBus().fireEvent(new ShowErrorsEvent());
		
		assertEquals(68, display.value);
	}


	@Test
	public void resetEvent() {
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		PageProgressModule model = new PageProgressModule();
		TestDisplay display = new TestDisplay(model);
		PageProgressPresenter presenter = new PageProgressPresenter(model, services);
		presenter.addView(display);
		
		services.getEventBus().fireEvent(new ShowErrorsEvent());
		assertEquals(68, display.value);
		
		services.getEventBus().fireEvent(new ResetPageEvent());
		assertEquals(0, display.value);
	}

}
