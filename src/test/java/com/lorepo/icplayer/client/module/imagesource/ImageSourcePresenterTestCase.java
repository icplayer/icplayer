package com.lorepo.icplayer.client.module.imagesource;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.InputStream;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import org.junit.Before;
import org.junit.Test;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableImage;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableItem;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemConsumedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemReturnedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemSelectedEvent;
import com.lorepo.icplayer.client.module.imagesource.mockup.ImageSourceViewMockup;

public class ImageSourcePresenterTestCase {

	private ImageSourceModule module;
	private PlayerServicesMockup services;
	private ImageSourceViewMockup display;
	private ImageSourcePresenter presenter;
	private DraggableItem draggableItem;
	private static final String PAGE_VERSION = "2";
	
	@Before
	public void runBeforeEveryTest() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		module = new ImageSourceModule();
		module.load(element, "", PAGE_VERSION);

		services = new PlayerServicesMockup();
		display = new ImageSourceViewMockup(module);
		presenter = new ImageSourcePresenter(module, services);
		presenter.addView(display);
	}
	
	@Test
	public void load() throws SAXException, IOException {
		
		assertFalse(display.isSelected());
	}

	@Test
	public void select() {
		
		display.click();
		assertTrue(display.isSelected());
	}

	@Test
	public void deselectOnSecondClick() {
		
		display.click();
		assertTrue(display.isSelected());
		
		display.click();
		assertFalse(display.isSelected());
	}

	@Test
	public void checkEvents() {

		draggableItem = null;
		services.getEventBus().addHandler(ItemSelectedEvent.TYPE, new ItemSelectedEvent.Handler() {
			public void onItemSelected(ItemSelectedEvent event) {
				draggableItem = event.getItem();
			}
		});
		
		display.click();
		assertTrue(draggableItem instanceof DraggableImage);
		assertEquals("is1", draggableItem.getId());
		assertEquals("media/river.jpg", draggableItem.getValue());
		
		display.click();
		assertNull(draggableItem.getId());
	}

	@Test
	public void removeConsumedEvent() {

		assertTrue(display.isVisible());
		
		display.click();
		
		draggableItem = new DraggableItem(module.getId(), "test");
		ItemConsumedEvent event = new ItemConsumedEvent(draggableItem);
		services.getEventBus().fireEventFromSource(event, this);

		assertFalse(display.isVisible());
	}
	
	@Test
	public void dontRemoveConsumedEvent() {

		assertTrue(display.isVisible());
		
		display.click();
		
		draggableItem = new DraggableItem("11111", "test");
		ItemConsumedEvent event = new ItemConsumedEvent(draggableItem);
		services.getEventBus().fireEventFromSource(event, this);

		assertTrue(display.isVisible());
	}

	@Test
	public void returnConsumedEvent() {

		display.click();
		
		draggableItem = new DraggableItem(module.getId(), "test");
		ItemConsumedEvent event = new ItemConsumedEvent(draggableItem);
		services.getEventBus().fireEventFromSource(event, this);

		assertFalse(display.isVisible());
		
		ItemReturnedEvent returnedEvent = new ItemReturnedEvent(draggableItem);
		services.getEventBus().fireEvent(returnedEvent);
		
		assertTrue(display.isVisible());
	}
	

	@Test
	public void dontReturnConsumed() {

		display.click();
		
		draggableItem = new DraggableItem(module.getId(), "test");
		ItemConsumedEvent event = new ItemConsumedEvent(draggableItem);
		services.getEventBus().fireEventFromSource(event, this);

		assertFalse(display.isVisible());
		
		draggableItem = new DraggableItem("ffg", "test2");
		ItemSelectedEvent selectedEvent = new ItemSelectedEvent(draggableItem);
		services.getEventBus().fireEvent(selectedEvent);
		
		assertFalse(display.isVisible());
	}
	

	@Test
	public void resetEvent() {

		display.click();
		
		draggableItem = new DraggableItem(module.getId(), "test");
		ItemConsumedEvent event = new ItemConsumedEvent(draggableItem);
		services.getEventBus().fireEventFromSource(event, this);

		assertFalse(display.isVisible());
		
		services.getEventBus().fireEvent(new ResetPageEvent(false));
		
		assertTrue(display.isVisible());
	}

	@Test
	public void dontRemoveNotRemovable() throws SAXException, IOException {

		InputStream inputStream = getClass().getResourceAsStream("testdata/module2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		module = new ImageSourceModule();
		module.load(element, "", PAGE_VERSION);

		services = new PlayerServicesMockup();
		display = new ImageSourceViewMockup(module);
		presenter = new ImageSourcePresenter(module, services);
		presenter.addView(display);
		
		assertTrue(display.isVisible());
		
		display.click();
		
		draggableItem = new DraggableItem(module.getId(), "test");
		ItemConsumedEvent event = new ItemConsumedEvent(draggableItem);
		services.getEventBus().fireEventFromSource(event, this);

		assertTrue(display.isVisible());
	}
	
}
