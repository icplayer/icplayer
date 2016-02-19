package com.lorepo.icplayer.client.module.errorcounter;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import com.google.gwt.dom.client.Element;
import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.errorcounter.ErrorCounterPresenter.IDisplay;

public class PresenterTestCase {

	private class TestDisplay implements IDisplay{

		public int value = 5;
		
		public TestDisplay(ErrorCounterModule model) {
		}
		
		@Override
		public void setData(int errorCount, int mistakeCount) {
			this.value = errorCount;
		}

		@Override
		public void show() {
			// TODO Auto-generated method stub
			
		}

		@Override
		public void hide() {
			// TODO Auto-generated method stub
			
		}

		@Override
		public Element getElement() {
			// TODO Auto-generated method stub
			return null;
		}
<<<<<<< HEAD
=======

>>>>>>> 1a4d29499a61b38702006c62b190961a45d12ba3
	}

	
	@Test
	public void showErrorsEvent() {
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		ErrorCounterModule model = new ErrorCounterModule();
		TestDisplay display = new TestDisplay(model);
		ErrorCounterPresenter presenter = new ErrorCounterPresenter(model, services);
		presenter.addView(display);
		
		services.getEventBus().fireEvent(new ShowErrorsEvent());
		
		assertEquals(13, display.value);
	}

}
