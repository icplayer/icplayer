package com.lorepo.icplayer.client.module.sourcelist;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
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
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableItem;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableText;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemConsumedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemReturnedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemSelectedEvent;
import com.lorepo.icplayer.client.module.sourcelist.mockup.SourceListViewMockup;

public class SourceListPresenterTestCase {

	private SourceListModule module;
	private PlayerServicesMockup services;
	private SourceListViewMockup display;
	private SourceListPresenter presenter;
	private DraggableItem draggableItem;
	
	
	@Before
	public void runBeforeEveryTest() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		module = new SourceListModule();
		module.load(element, "");

		services = new PlayerServicesMockup();
		display = new SourceListViewMockup(module);
		presenter = new SourceListPresenter(module, services);
		presenter.addView(display);
	}
	
	@Test
	public void load() throws SAXException, IOException {
		
		assertEquals(4, display.getItems().size());
	}
	
	@Test
	public void select() {
		
		display.click("sl1-3");
		assertEquals("sl1-3", display.getSelectedId());
	}
	
	@Test
	public void selectOnlyOne() {
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		
		SourceListModule model1 = new SourceListModule();
		SourceListViewMockup display1 = new SourceListViewMockup(model1);
		SourceListPresenter presenter1 = new SourceListPresenter(model1, services);
		presenter1.addView(display1);
		
		SourceListModule model2 = new SourceListModule();
		SourceListViewMockup display2 = new SourceListViewMockup(model2);
		SourceListPresenter presenter2 = new SourceListPresenter(model2, services);
		presenter2.addView(display2);
		
		display1.click("3");
		display2.click("2");
		
		assertNull(display1.getSelectedId());
		assertEquals("2", display2.getSelectedId());
	}
	
	@Test
	public void deselectOnSecondClick() {
		
		display.click("sl1-3");
		assertEquals("sl1-3", display.getSelectedId());
		
		display.click("sl1-3");
		assertNull(display.getSelectedId());
	}
	
	@Test
	public void checkEvents() {

		draggableItem = null;
		services.getEventBus().addHandler(ItemSelectedEvent.TYPE, new ItemSelectedEvent.Handler() {
			public void onItemSelected(ItemSelectedEvent event) {
				draggableItem = event.getItem();
			}
		});
		
		display.click("sl1-3");
		assertTrue(draggableItem instanceof DraggableText);
		assertEquals("sl1-3", draggableItem.getId());
		assertEquals("C", draggableItem.getValue());
		
		display.click("sl1-3");
		assertNull(draggableItem);
	}
	
	@Test
	public void removeConsumedEvent() {

		String id = "sl1-3";
		
		assertNotNull(display.getItems().get(id));
		
		display.click(id);
		assertEquals(id, display.getSelectedId());
		
		draggableItem = new DraggableItem(id, "test");
		ItemConsumedEvent event = new ItemConsumedEvent(draggableItem);
		services.getEventBus().fireEventFromSource(event, this);

		assertNull(display.getItems().get(id));
		assertEquals(3, display.getItems().size());
	}
	
	@Test
	public void dontRemoveConsumedEvent() {

		String id = "sl1-3";
		
		assertNotNull(display.getItems().get(id));
		
		display.click(id);
		assertEquals(id, display.getSelectedId());
		
		draggableItem = new DraggableItem("abc", "test");
		ItemConsumedEvent event = new ItemConsumedEvent(draggableItem);
		services.getEventBus().fireEvent(event);

		assertNull(display.getSelectedId());
		assertNotNull(display.getItems().get(id));
	}
	
	@Test
	public void dontRemoveNotRemovable() throws SAXException, IOException {

		String id = "sl1-3";
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		module = new SourceListModule();
		module.load(element, "");
		assertNotNull(display.getItems().get(id));
		
		display = new SourceListViewMockup(module);
		presenter = new SourceListPresenter(module, services);
		presenter.addView(display);
		
		display.click(id);
		assertEquals(id, display.getSelectedId());
		
		draggableItem = new DraggableItem(id, "test");
		ItemConsumedEvent event = new ItemConsumedEvent(draggableItem);
		services.getEventBus().fireEventFromSource(event, this);

		assertNotNull(display.getItems().get(id));
	}
	
	@Test
	public void returnConsumedEvent() {

		String id = "sl1-3";
		
		assertNotNull(display.getItems().get(id));
		
		display.click(id);
		assertEquals(id, display.getSelectedId());
		assertEquals(4, display.getItems().size());
		
		draggableItem = new DraggableItem(id, "test");

		ItemConsumedEvent consumedEvent = new ItemConsumedEvent(draggableItem);
		services.getEventBus().fireEvent(consumedEvent);
		assertNull(display.getItems().get(id));
		assertEquals(3, display.getItems().size());
		
		ItemReturnedEvent returnedEvent = new ItemReturnedEvent(draggableItem);
		services.getEventBus().fireEvent(returnedEvent);
		assertNotNull(display.getItems().get(id));
		assertEquals(4, display.getItems().size());
	}
	
	@Test
	public void dontReturnConsumedEvent() throws SAXException, IOException {

		String id = "sl1-3";
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		module = new SourceListModule();
		module.load(element, "");
		display = new SourceListViewMockup(module);
		presenter = new SourceListPresenter(module, services);
		presenter.addView(display);
		
		display.click(id);
		assertEquals(4, display.getItems().size());
		
		draggableItem = new DraggableItem(id, "test");

		ItemConsumedEvent consumedEvent = new ItemConsumedEvent(draggableItem);
		services.getEventBus().fireEvent(consumedEvent);
		
		ItemReturnedEvent returnedEvent = new ItemReturnedEvent(draggableItem);
		services.getEventBus().fireEvent(returnedEvent);
		assertEquals(4, display.getItems().size());
		
	}
	
	@Test
	public void resetEvent() {

		String id = "sl1-3";
		
		assertNotNull(display.getItems().get(id));
		
		display.click(id);
		assertEquals(id, display.getSelectedId());
		
		draggableItem = new DraggableItem(id, "test");
		ItemConsumedEvent event = new ItemConsumedEvent(draggableItem);
		services.getEventBus().fireEventFromSource(event, this);

		assertNull(display.getItems().get(id));
		
		services.getEventBus().fireEvent(new ResetPageEvent());
		
		assertNotNull(display.getItems().get(id));
	}
	
}
