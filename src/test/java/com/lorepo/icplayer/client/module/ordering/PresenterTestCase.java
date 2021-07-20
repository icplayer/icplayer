package com.lorepo.icplayer.client.module.ordering;

import static org.junit.Assert.*;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;

import com.google.gwt.event.shared.EventBus;
import com.lorepo.icplayer.client.module.api.event.GradualShowAnswerEvent;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.reflect.Whitebox;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.module.ordering.mockup.OrderingViewMockup;


public class PresenterTestCase {

	private static final String PAGE_VERSION = "2";

	@Test
	public void getState() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/orderingPresenter.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		OrderingModule module = new OrderingModule();
		module.load(element, "", PAGE_VERSION);
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		OrderingViewMockup display = new OrderingViewMockup();
		display.setState("3,2,1");
		OrderingPresenter presenter = new OrderingPresenter(module, services);
		presenter.addView(display);
		
		HashMap<String,String> stateObject = presenter.prepareStateObject();
		
		assertEquals("3,2,1", stateObject.get("order"));
		assertEquals("false", stateObject.get("isSolved"));
		assertEquals("false", stateObject.get("isVisible"));
	}
	
	@Test
	public void setStateInOldFormat() throws SAXException, IOException {
		/**
		 * Before adding isVisible flag into state format was "<order>@<isSolved>".
		 * After that state is an JSON object and we need to ensure backwards compatibility. 
		 */
		InputStream inputStream = getClass().getResourceAsStream("testdata/orderingPresenter.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		OrderingModule module = new OrderingModule();
		module.load(element, "", PAGE_VERSION);
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		OrderingViewMockup display = new OrderingViewMockup();
		OrderingPresenter presenter = new OrderingPresenter(module, services);
		presenter.addView(display);
		
		presenter.setState("2,3,1@true");
		
		assertEquals("2,3,1", display.getState());
	}
	
	@SuppressWarnings("serial")
	@Test
	public void setStateInJSONFormat() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/orderingPresenter.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		OrderingModule module = new OrderingModule();
		module.load(element, "", PAGE_VERSION);
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		OrderingViewMockup display = new OrderingViewMockup();
		OrderingPresenter presenter = new OrderingPresenter(module, services);
		presenter.addView(display);
		
		presenter.setStateFromHashMap(new HashMap<String, String>(){{
	        put("order","2,3,1");
	        put("isSolved","true");
	        put("isVisible", "false");
	    }});
		
		assertEquals("2,3,1", display.getState());
		assertFalse(presenter.isVisible());
		assertTrue(presenter.isSolved());
	}

	@Test
	public void getActivitiesCountReturnsRequiredNumberOfSingleSwapsWhenShowAllAnswersInGradualShowAnswersModePropertyIsInactive() throws IOException, SAXException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/orderingPresenter.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);

		OrderingModule module = new OrderingModule();
		module.load(element, "", PAGE_VERSION);

		PlayerServicesMockup services = new PlayerServicesMockup();
		OrderingPresenter presenter = new OrderingPresenter(module, services);

		assertEquals(module.getItemCount() - 1, presenter.getActivitiesCount());
	}

	@Test
	public void getActivitiesCountReturns1WhenShowAllAnswersInGradualShowAnswersModePropertyIsActive() throws IOException, SAXException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/orderingPresenter2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);

		OrderingModule module = new OrderingModule();
		module.load(element, "", PAGE_VERSION);

		PlayerServicesMockup services = new PlayerServicesMockup();
		OrderingPresenter presenter = new OrderingPresenter(module, services);

		assertEquals(1, presenter.getActivitiesCount());
	}

	@Test
	public void onGradualShowAnswersSets1CorrectAnswerWhenShowAllAnswersInGradualShowAnswersModePropertyIsInactive() throws IOException, SAXException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/orderingPresenter.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);

		OrderingModule module = new OrderingModule();
		module.load(element, "", PAGE_VERSION);

		PlayerServicesMockup services = new PlayerServicesMockup();
		OrderingViewMockup display = PowerMockito.spy(Whitebox.newInstance(OrderingViewMockup.class));
		OrderingPresenter presenter = new OrderingPresenter(module, services);
		presenter.addView(display);

		EventBus eventBus = services.getEventBus();
		GradualShowAnswerEvent event = new GradualShowAnswerEvent();
		event.setModuleID(module.getId());
		eventBus.fireEvent(event);

		Mockito.verify(display, Mockito.times(1)).setCorrectAnswer(Mockito.any(Integer.class));
	}

	@Test
	public void onGradualShowAnswersSetsAllCorrectAnswerWhenShowAllAnswersInGradualShowAnswersModePropertyIsActive() throws IOException, SAXException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/orderingPresenter2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);

		OrderingModule module = new OrderingModule();
		module.load(element, "", PAGE_VERSION);

		PlayerServicesMockup services = new PlayerServicesMockup();
		OrderingViewMockup display = PowerMockito.spy(Whitebox.newInstance(OrderingViewMockup.class));
		OrderingPresenter presenter = new OrderingPresenter(module, services);
		presenter.addView(display);

		EventBus eventBus = services.getEventBus();
		GradualShowAnswerEvent event = new GradualShowAnswerEvent();
		event.setModuleID(module.getId());
		eventBus.fireEvent(event);

		Mockito.verify(display, Mockito.times(1)).setCorrectAnswer();
	}
}
