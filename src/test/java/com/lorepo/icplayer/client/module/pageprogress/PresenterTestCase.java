package com.lorepo.icplayer.client.module.pageprogress;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import com.google.gwt.dom.client.Element;
import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter.IOptionDisplay;
import com.lorepo.icplayer.client.module.pageprogress.PageProgressPresenter.IDisplay;

public class PresenterTestCase {

	private class TestDisplay implements IDisplay {

		public int value = 5;
		public boolean isVisible = false;
		private ArrayList<IOptionDisplay> options = new ArrayList<IOptionDisplay>();
		
		public TestDisplay(PageProgressModule model) {
		}
		
		@Override
		public void setData(int value, int limitedMaxScore) {
			this.value = value;
		}
		
		@Override
		public void show() {
			this.isVisible = true;
		}

		@Override
		public void hide() {
			this.isVisible = false;
		}

		@Override
		public List<IOptionDisplay> getOptions() {
			return options;
		}
		
		@Override
		public Element getElement() {
			// TODO Auto-generated method stub
			return null;
		}

		@Override
		public String getName() {
			// TODO Auto-generated method stub
			return null;
		}
	}

	@Test
	public void showMethodSetVisibilityToTrue() {
		PageProgressModule model = new PageProgressModule();
		TestDisplay display = new TestDisplay(model);
		
		display.show();
		
		assertEquals(true, display.isVisible);
	}
	
	@Test
	public void hideMethodSetVisiblityToFalse() {
		PageProgressModule model = new PageProgressModule();
		TestDisplay display = new TestDisplay(model);
		
		display.hide();
		
		assertEquals(false, display.isVisible);
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
		
		services.getEventBus().fireEvent(new ResetPageEvent(false));
		assertEquals(0, display.value);
	}

}
