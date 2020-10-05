package com.lorepo.icplayer.client.module.button;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.InputStream;

import org.junit.Before;
import org.junit.Test;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent;
import com.lorepo.icplayer.client.module.button.mockup.ButtonViewMockup;

public class ButtonPresenterTestCase {
	private static final String PAGE_VERSION = "2";
	private ButtonModule module;
	private PlayerServicesMockup services;
	private ButtonViewMockup display;
	private ButtonPresenter presenter;
	
	@Before
	public void runBeforeEveryTest() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/check.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		module = new ButtonModule();
		module.load(element, "", PAGE_VERSION);

		services = new PlayerServicesMockup();
		display = new ButtonViewMockup(module);
		presenter = new ButtonPresenter(module, services);
		presenter.addView(display);
	}
	
	@Test
	public void showCommand() {
		display.setVisible(false);
		
		presenter.show();
		
		assertTrue(display.isVisible());
	}
	
	@Test
	public void hideCommand() {
		presenter.hide();
		
		assertFalse(display.isVisible());
	}
	
	@Test
	public void reset(){
		display.setVisible(false);
		display.setErrorCheckingMode(true);
		display.setDisabled(true);
		services.getEventBus().fireEvent(new ResetPageEvent(false));
		
		assertTrue(display.isVisible());
		assertFalse(display.isErrorCheckingMode());
		assertFalse(display.isDisabled());
	}
	
	@Test
	public void saveLoadState(){
		presenter.hide();
		assertFalse(display.isVisible());
		String stateObj = presenter.getState();
		
		services.getEventBus().fireEvent(new ResetPageEvent(false));
		assertTrue(display.isVisible());
		
		presenter.setState(stateObj);
		assertFalse(display.isVisible());
	}
	
	@Test
	public void disable(){
		assertFalse(display.isErrorCheckingMode());
		assertFalse(display.isDisabled());
		
		services.getEventBus().fireEvent(new ShowErrorsEvent());
		assertTrue(display.isErrorCheckingMode());
		assertTrue(display.isDisabled());
		
		services.getEventBus().fireEvent(new WorkModeEvent());
		assertFalse(display.isErrorCheckingMode());
		assertFalse(display.isDisabled());
	}
}
