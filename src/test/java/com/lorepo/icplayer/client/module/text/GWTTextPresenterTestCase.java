package com.lorepo.icplayer.client.module.text;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.InputStream;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.xml.sax.SAXException;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.xml.client.Element;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.mockup.services.CommandsMockup;
import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableImage;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableItem;
import com.lorepo.icplayer.client.module.api.event.dnd.DraggableText;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemConsumedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemReturnedEvent;
import com.lorepo.icplayer.client.module.api.event.dnd.ItemSelectedEvent;
import com.lorepo.icplayer.client.module.text.LinkInfo.LinkType;
import com.lorepo.icplayer.client.module.text.TextModel;
import com.lorepo.icplayer.client.module.text.TextPresenter;
import com.lorepo.icplayer.client.module.text.mockup.TextViewMockup;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTTextPresenterTestCase extends GwtTest{

	private static final String PAGE_VERSION = "2";
	private TextModel module;
	private PlayerServicesMockup services;
	private TextViewMockup display;
	private TextPresenter presenter;
	private boolean eventReceived;
	private String id1;
	private String id2;
	private String id3;


	@Before
	public void runBeforeEveryTest() throws SAXException, IOException {

		InputStream inputStream = getClass().getResourceAsStream("testdata/module1.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		module = new TextModel();
		module.load(element, "", PAGE_VERSION);

		services = new PlayerServicesMockup();
		display = new TextViewMockup(module);
		presenter = new TextPresenter(module, services);
		presenter.addView(display);
		id1 = module.choiceInfos.get(0).getId();
		id2 = module.choiceInfos.get(1).getId();
		id3 = module.gapInfos.get(0).getId();
	}


	@Test
	public void create() throws SAXException, IOException {

		TextModel module = new TextModel();

		PlayerServicesMockup services = new PlayerServicesMockup();
		TextViewMockup display = new TextViewMockup(module);
		TextPresenter presenter = new TextPresenter(module, services);
		presenter.addView(display);

		display.getListener().onLinkClicked(LinkType.PAGE, "Page 12", "");
		CommandsMockup commands = (CommandsMockup) services.getCommands();
		assertEquals("gotoPage: Page 12", commands.getCommand());
	}

	@Test
	public void maxScore() throws SAXException, IOException {

		assertEquals(5, presenter.getMaxScore());
	}

	@Test
	public void score() throws SAXException, IOException {

		display.getListener().onValueChanged(id1, "likes");
		display.getListener().onValueChanged(id3, "Volvo");
		assertEquals(3, presenter.getScore());
	}

	@Test
	public void errorCount() throws SAXException, IOException {

		display.getListener().onValueChanged(id1, "error1");
		display.getListener().onValueChanged(id3, "error2");
		assertEquals(2, presenter.getErrorCount());
	}

	@Test
	public void moduleScore() throws SAXException, IOException {

		display.getListener().onValueChanged(id1, "likes");
		display.getListener().onValueChanged(id3, "Volvo");

		int moduleScore = services.getScoreService().getScore("text");
		assertEquals(3, moduleScore);
	}

    @Test
    public void isAllOKShouldReturnTrue() throws SAXException, IOException {
        display.getListener().onValueChanged(id1, "likes");
        display.getListener().onValueChanged(id2, "I don't like it");
        display.getListener().onValueChanged(id3, "Volvo");

        assertTrue(presenter.isAllOK());
    }

    @Test
    public void isAllOKShouldReturnFalse() throws SAXException, IOException {
        display.getListener().onValueChanged(id1, "likes");
        display.getListener().onValueChanged(id3, "Volvo");

        assertFalse(presenter.isAllOK());
    }
	
	@Test
	public void caseSensitive() throws SAXException, IOException {
		
		display.getListener().onValueChanged(id1, "likes");
		// This is wrong. Should start from upper case
		display.getListener().onValueChanged(id3, "volvo");
		
		int moduleScore = services.getScoreService().getScore("text");
		assertEquals(2, moduleScore);
	}
	
	@Test
	public void sourceListEvent() throws SAXException, IOException {
		
		DraggableItem item = new DraggableText("1", "Sample text");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		services.getEventBus().fireEventFromSource(event, this);
		display.getListener().onGapClicked("Gap 1");
		
		assertEquals("Sample text", display.getValues().get("Gap 1"));
	}
	
	@Test
	public void dontSelectImage() throws SAXException, IOException {
		
		DraggableItem item = new DraggableImage("1", "Sample text");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		services.getEventBus().fireEventFromSource(event, this);
		display.getListener().onGapClicked("Gap 1");
		
		assertNull(display.getValues().get("Gap 1"));
	}
	
	@Test
	public void sendConsumedEvent() throws SAXException, IOException {
		
		EventBus eventBus = services.getEventBus();

		services.getEventBus().addHandler(ItemConsumedEvent.TYPE, new ItemConsumedEvent.Handler() {
			public void onItemConsumed(ItemConsumedEvent event) {
				eventReceived = true;
			}
		});
		
		eventReceived = false;
		DraggableItem item = new DraggableText("1", "Sample text");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		eventBus.fireEventFromSource(event, this);
		display.getListener().onGapClicked("Gap 1");
		
		assertTrue(eventReceived);
	}
	
	@Test
	public void sendReturnEvent() throws SAXException, IOException {
		
		EventBus eventBus = services.getEventBus();

		eventReceived = false;
		services.getEventBus().addHandler(ItemReturnedEvent.TYPE, new ItemReturnedEvent.Handler() {
			public void onItemReturned(ItemReturnedEvent event) {
				eventReceived = true;
			}
		});
		
		DraggableItem item = new DraggableText("1", "Sample text");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		eventBus.fireEvent(event);
		// consume
		display.getListener().onGapClicked("Gap 1");
		// return
		display.getListener().onGapClicked("Gap 1");
		
		assertTrue(eventReceived);
	}
	
	@Test
	public void draggableCorrect() throws SAXException, IOException {
		
		EventBus eventBus = services.getEventBus();
		DraggableItem item = new DraggableText("1", "I don't like it");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		eventBus.fireEvent(event);
		// consume
		
		display.getListener().onGapClicked(id2);
		assertEquals(2, presenter.getScore());
	}
	
	
	@Test
	public void nbspDraggable() throws SAXException, IOException {
		
		EventBus eventBus = services.getEventBus();
		DraggableItem item = new DraggableText("1", "I&nbsp;don't like it");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		eventBus.fireEvent(event);
		// consume
		display.getListener().onGapClicked(id2);

		assertEquals(2, presenter.getScore());
	}

	@Test
	public void valueChangedEventOnDrop() throws SAXException, IOException {
		
		eventReceived = false;
		services.getEventBus().addHandler(ValueChangedEvent.TYPE, new ValueChangedEvent.Handler() {
			public void onScoreChanged(ValueChangedEvent event) {
				eventReceived = true;
			}
		});

		DraggableItem item = new DraggableText("1", "Sample text");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		services.getEventBus().fireEventFromSource(event, this);
		display.getListener().onGapClicked("Gap 1");
		
		assertTrue(eventReceived);
	}

	
	@Test
	public void valueChangedChoice() throws SAXException, IOException {
		
		eventReceived = false;
		services.getEventBus().addHandler(ValueChangedEvent.TYPE, new ValueChangedEvent.Handler() {
			public void onScoreChanged(ValueChangedEvent event) {
				eventReceived = true;
			}
		});

		display.getListener().onValueChanged(module.getId()+"-1", "likes");
		
		assertTrue(eventReceived);
	}

	
	@Test
	public void valueChangedEditable() throws SAXException, IOException {
		
		eventReceived = false;
		services.getEventBus().addHandler(ValueChangedEvent.TYPE, new ValueChangedEvent.Handler() {
			public void onScoreChanged(ValueChangedEvent event) {
				eventReceived = true;
			}
		});

		display.getListener().onValueChanged(module.getId()+"-3", "volvo");
		
		assertTrue(eventReceived);
	}
	
	
	@Test
	public void noActivity() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		module = new TextModel();
		module.load(element, "", PAGE_VERSION);

		services = new PlayerServicesMockup();
		display = new TextViewMockup(module);
		presenter = new TextPresenter(module, services);
		presenter.addView(display);

		EventBus eventBus = services.getEventBus();
		DraggableItem item = new DraggableText("1", "I don't like it");
		ItemSelectedEvent event = new ItemSelectedEvent(item);
		eventBus.fireEvent(event);
		// consume
		display.getListener().onGapClicked(module.getId()+"-2");

		assertEquals(0, presenter.getScore());
		assertEquals(0, presenter.getMaxScore());
	}
	
	
	@Test
	public void testPunctuation() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module4.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		module = new TextModel();
		module.load(element, "", PAGE_VERSION);

		services = new PlayerServicesMockup();
		display = new TextViewMockup(module);
		presenter = new TextPresenter(module, services);
		presenter.addView(display);

		id1 = module.gapInfos.get(0).getId();
		display.getListener().onValueChanged(id1, "like's");
		
		int moduleScore = services.getScoreService().getScore("text");
		assertEquals(2, moduleScore);
	}
}
