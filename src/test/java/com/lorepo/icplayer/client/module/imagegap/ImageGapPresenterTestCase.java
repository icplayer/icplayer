package com.lorepo.icplayer.client.module.imagegap;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.xml.sax.SAXException;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.xml.client.Element;
import com.lorepo.icf.scripting.IType;
import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.WorkModeEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableImage;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableItem;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableText;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemConsumedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemReturnedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemSelectedEvent;
import com.lorepo.icplayer.client.module.imagegap.mockup.ImageGapViewMockup;

public class ImageGapPresenterTestCase {

	private ImageGapModule module;
	private PlayerServicesMockup services;
	private ImageGapViewMockup display;
	private ImageGapPresenter presenter;
	private boolean eventReceived;
	private final static String PAGE_VERSION = "2";
	
	@Before
	public void runBeforeEveryTest() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/module.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		module = new ImageGapModule();
		module.load(element, "", PAGE_VERSION);

		services = new PlayerServicesMockup();
		display = new ImageGapViewMockup(module);
		presenter = new ImageGapPresenter(module, services);
		presenter.addView(display);
	}
	
	@Test
	public void consumeImage(){
		
		DraggableItem item = new DraggableImage("is1", "/path");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		services.getEventBus().fireEventFromSource(event, this);
		display.getListener().onClicked();
		
		assertEquals("/path", display.getImageUrl());
	}
	
	@Test
	public void dontConsumeText(){
		
		DraggableItem item = new DraggableText("is1", "/path");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		services.getEventBus().fireEventFromSource(event, this);
		display.getListener().onClicked();
		
		assertNull(display.getImageUrl());
	}
	
	@Test
	public void sendConsumedEvent(){
		
		EventBus eventBus = services.getEventBus();

		services.getEventBus().addHandler(ItemConsumedEvent.TYPE, new ItemConsumedEvent.Handler() {
			public void onItemConsumed(ItemConsumedEvent event) {
				eventReceived = true;
			}
		});
		
		eventReceived = false;
		DraggableItem item = new DraggableImage("1", "Sample text");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		eventBus.fireEventFromSource(event, this);
		display.getListener().onClicked();
		
		assertTrue(eventReceived);
	}
	
	@Test
	public void sendReturnEvent() {
		EventBus eventBus = services.getEventBus();

		eventReceived = false;
		services.getEventBus().addHandler(ItemReturnedEvent.TYPE, new ItemReturnedEvent.Handler() {
			public void onItemReturned(ItemReturnedEvent event) {
				eventReceived = true;
			}
		});
		
		DraggableItem item = new DraggableImage("1", "Sample text");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		eventBus.fireEvent(event);
		// consume
		display.getListener().onClicked();
		// return
		display.getListener().onClicked();
		
		assertEquals("", display.getImageUrl());
		assertTrue(eventReceived);
	}
	
	@Test
	public void reset() {
		DraggableItem item = new DraggableImage("is1", "/path");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		services.getEventBus().fireEventFromSource(event, this);
		display.getListener().onClicked();
		
		assertEquals("/path", display.getImageUrl());
		
		services.getEventBus().fireEvent(new ResetPageEvent(false));
		assertEquals("", display.getImageUrl());
		
	}
	
	@Test
	public void maxScore() {
		assertEquals(1, presenter.getMaxScore());
	}

	@Test
	public void correct(){
		
		DraggableItem item = new DraggableImage("si1", "/path");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		services.getEventBus().fireEventFromSource(event, this);
		display.getListener().onClicked();
		assertEquals(1, presenter.getScore());
		assertEquals(0, presenter.getErrorCount());
	}
	
	@Test
	public void wrong() {
		DraggableImage item = new DraggableImage("si2", "/path");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		services.getEventBus().fireEventFromSource(event, this);
		display.getListener().onClicked();
		
		assertEquals(0, presenter.getScore());
		assertEquals(1, presenter.getErrorCount());
	}

	@Test
	public void saveLoadState() {
		DraggableItem item = new DraggableImage("si1", "/path");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		services.getEventBus().fireEventFromSource(event, this);
		display.getListener().onClicked();
		services.getEventBus().fireEvent(new ResetPageEvent(false));
		
		assertEquals(0, presenter.getScore());
		assertEquals("", display.getImageUrl());
	}
	
	@Test
	public void showCorrectStyle() {
		DraggableItem item = new DraggableImage("si1", "/path");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		services.getEventBus().fireEventFromSource(event, this);
		display.getListener().onClicked();
		services.getEventBus().fireEvent(new ShowErrorsEvent());
		
		assertEquals("correct", display.getStyle());
	}

	@Test
	public void showErrorStyle(){
		DraggableItem item = new DraggableImage("si2", "/path");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		services.getEventBus().fireEventFromSource(event, this);
		display.getListener().onClicked();
		services.getEventBus().fireEvent(new ShowErrorsEvent());
		
		assertEquals("error", display.getStyle());
	}
	
	@Test
	public void disable(){
		DraggableItem item = new DraggableItem("si2", "/path");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		services.getEventBus().fireEventFromSource(event, this);
		display.getListener().onClicked();
		
		assertFalse(display.isDisabled());
		services.getEventBus().fireEvent(new ShowErrorsEvent());
		assertTrue(display.isDisabled());
		services.getEventBus().fireEvent(new WorkModeEvent());
		assertFalse(display.isDisabled());
	}

	@Test
	public void correctMulti1() throws SAXException, IOException{
		InputStream inputStream = getClass().getResourceAsStream("testdata/module2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		module = new ImageGapModule();
		module.load(element, "", PAGE_VERSION);

		services = new PlayerServicesMockup();
		display = new ImageGapViewMockup(module);
		presenter = new ImageGapPresenter(module, services);
		presenter.addView(display);

		DraggableItem item = new DraggableImage("si1", "/path");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		services.getEventBus().fireEventFromSource(event, this);
		display.getListener().onClicked();
		
		assertEquals(1, presenter.getScore());
		assertEquals(0, presenter.getErrorCount());
	}
	
	@Test
	public void correctMulti2() throws SAXException, IOException{
		InputStream inputStream = getClass().getResourceAsStream("testdata/module2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		module = new ImageGapModule();
		module.load(element, "", PAGE_VERSION);

		services = new PlayerServicesMockup();
		display = new ImageGapViewMockup(module);
		presenter = new ImageGapPresenter(module, services);
		presenter.addView(display);

		DraggableItem item = new DraggableImage("si2", "/path");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		services.getEventBus().fireEventFromSource(event, this);
		display.getListener().onClicked();
		
		assertEquals(1, presenter.getScore());
		assertEquals(0, presenter.getErrorCount());
	}
	
	@Test
	public void getImageIdCommand(){
		EventBus eventBus = services.getEventBus();
		DraggableItem item = new DraggableImage("1", "Sample text");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		eventBus.fireEventFromSource(event, this);
		display.getListener().onClicked();
		String imageID = presenter.executeCommand("getimageid", new ArrayList<IType>());
		
		assertEquals("1", imageID);
	}

	@Test
	public void hideAfterState(){
		presenter.hide();
		String stateObj = presenter.getState();
		assertFalse(display.isVisible());
		presenter.show();
		presenter.setState(stateObj);
		assertFalse(display.isVisible());
	}

	/**
	 * In show errors mode don't change image even if not activity
	 * @throws SAXException
	 * @throws IOException
	 */
	@Test
	public void notActivityShowErrorsMode() throws SAXException, IOException{
		InputStream inputStream = getClass().getResourceAsStream("testdata/module2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		module = new ImageGapModule();
		module.load(element, "", PAGE_VERSION);

		services = new PlayerServicesMockup();
		display = new ImageGapViewMockup(module);
		presenter = new ImageGapPresenter(module, services);
		presenter.addView(display);
		services.getEventBus().fireEvent(new ShowErrorsEvent());

		assertTrue(display.isDisabled());
		
	}
	
	@Test 
	public void insertItemDoesNotThrowException() throws SAXException, IOException {
		Exception e = null; 
		try {
			InputStream inputStream = getClass().getResourceAsStream("testdata/module3.xml");
			XMLParserMockup xmlParser = new XMLParserMockup();
			Element element = xmlParser.parser(inputStream);
			module = new ImageGapModule();
			module.load(element, "", PAGE_VERSION);
			display = new ImageGapViewMockup(module);
			presenter = new ImageGapPresenter(module, services);
			presenter.addView(display);
			EventBus eventBus = services.getEventBus();
			DraggableItem item = new DraggableImage("1", "Sample text");
			ItemSelectedEvent event = new ItemSelectedEvent(item);
			eventBus.fireEventFromSource(event, this);
			display.getListener().onClicked();
		}catch(NullPointerException ex) {
			e = ex; 
		}
		assertNull(e);
	}
}
