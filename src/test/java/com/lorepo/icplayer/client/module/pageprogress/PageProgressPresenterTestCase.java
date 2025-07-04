package com.lorepo.icplayer.client.module.pageprogress;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.junit.Before;

import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.pageprogress.mockup.PageProgressViewMockup;

public class PageProgressPresenterTestCase {
	private PlayerServicesMockup services;
	private PageProgressModule module;
	private PageProgressViewMockup display;
	private PageProgressPresenter presenter;
	
	@Before
	public void setUp() {
		services = new PlayerServicesMockup();
		module = new PageProgressModule();
	}
	
	private void buildDisplayAndPresenter() {
		display = new PageProgressViewMockup(module);
		presenter = new PageProgressPresenter(module, services);
		presenter.addView(display);
	}
	
	@Test
	public void resetValueOnStart() {
		buildDisplayAndPresenter();
		
		assertEquals(0, display.value);
	}
	
	@Test
	public void showErrorsEvent() {
		buildDisplayAndPresenter();
		
		services.getEventBus().fireEvent(new ShowErrorsEvent());
		
		assertEquals(68, display.value);
	}
	
	@Test
	public void resetEvent() {
		buildDisplayAndPresenter();
		
		services.getEventBus().fireEvent(new ShowErrorsEvent());
		assertEquals(68, display.value);
		
		services.getEventBus().fireEvent(new ResetPageEvent(false));
		assertEquals(0, display.value);
	}

}
