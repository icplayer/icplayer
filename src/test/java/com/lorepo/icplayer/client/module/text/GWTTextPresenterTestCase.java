package com.lorepo.icplayer.client.module.text;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.reflect.Whitebox;
import org.powermock.api.mockito.PowerMockito;
import org.xml.sax.SAXException;

import com.google.gwt.dom.client.Document;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.DOM;
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
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
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
	
	@Test
	public void showAnswersCorrectlyAddTextToGaps() throws Exception {
		TextModel module = new TextModel();
		module.setIsVisible(true);
		
		GapInfo gapInfo1 = new GapInfo("1", 1, false, false, 1, false);
		gapInfo1.addAnswer("1Answer");
		
		GapInfo gapInfo2 = new GapInfo("2", 2, false, false, 1, false);
		gapInfo2.addAnswer("2Answer");
		
		GapInfo gapInfo3 = new GapInfo("3", 3, false, false, 1, false);
		gapInfo3.addAnswer("3Answer");
		
		module.gapInfos.add(gapInfo1);
		module.gapInfos.add(gapInfo2);
		module.gapInfos.add(gapInfo3);
		
		IPlayerServices services = Mockito.mock(IPlayerServices.class);
		TextPresenter presenter = new TextPresenter(module, services);
		
		TextView textView = new TextView(module, false);

		com.google.gwt.user.client.Element widget1 = DOM.createElement("div");
		widget1.setId("1");
		Document.get().getBody().appendChild(widget1);
		
		com.google.gwt.user.client.Element widget2 = DOM.createElement("div");
		widget2.setId("2");
		Document.get().getBody().appendChild(widget2);
		
		com.google.gwt.user.client.Element widget3 = DOM.createElement("div");
		widget3.setId("3");
		Document.get().getBody().appendChild(widget3);
		
		GapWidget answer2Widget = new GapWidget(gapInfo2, null);
		
		GapWidget answer1Widget = new GapWidget(gapInfo1, null);
		
		GapWidget answer3Widget = new GapWidget(gapInfo3, null);

		
		textView.addElement(answer2Widget);
		textView.addElement(answer1Widget);
		textView.addElement(answer3Widget);
		
		Whitebox.setInternalState(presenter, "view", textView);
		
	
		Whitebox.invokeMethod(presenter, "setShowAnswersTextInGaps");
		
		assertEquals("1Answer", answer1Widget.getTextValue());
		assertEquals("2Answer", answer2Widget.getTextValue());
		assertEquals("3Answer", answer3Widget.getTextValue());
		
	}
	
	@Test
	public void getingElementTextWithDefaultValue() throws Exception {
		String placeHolder = "init"; 
		
		TextModel module = new TextModel();
		module.setIsVisible(true);
		
		GapInfo gapInfo1 = new GapInfo("1", 1, false, false, 1, false);
		gapInfo1.setPlaceHolder(placeHolder);
		
		
		IPlayerServices services = Mockito.mock(IPlayerServices.class);
		TextPresenter presenter = new TextPresenter(module, services);
		
		String res = Whitebox.invokeMethod(presenter, "getElementText", gapInfo1);
		
		assertEquals(placeHolder, res); 
	} 
	
	
	@Test
	public void checkingFilledGragScore() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/module5.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		module = new TextModel();
		module.load(element, "", PAGE_VERSION);

		services = new PlayerServicesMockup();
		display = new TextViewMockup(module);
		presenter = new TextPresenter(module, services);
		presenter.addView(display);
		
		id1 = module.gapInfos.get(0).getId();
		id2 = module.gapInfos.get(1).getId();
		
		display.getListener().onValueChanged(id1, "error1");
		display.getListener().onValueChanged(id2, "answer2");
		assertEquals(1, presenter.getScore());
	}
	
	
	@Test
	public void checkingFilledGragErrorCount() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/module5.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		module = new TextModel();
		module.load(element, "", PAGE_VERSION);

		services = new PlayerServicesMockup();
		display = new TextViewMockup(module);
		presenter = new TextPresenter(module, services);
		presenter.addView(display);
		
		id1 = module.gapInfos.get(0).getId();
		id2 = module.gapInfos.get(1).getId();
		
		display.getListener().onValueChanged(id1, "error1");
		display.getListener().onValueChanged(id2, "error2");
		assertEquals(2, presenter.getErrorCount());
	}
	
	@Test
	public void givenTwoAudioButtonsWhenOneIsPlayingAndSecondIsClickedThenFirstStopsPlaying() throws Exception {
		InputStream inputStream = getClass().getResourceAsStream("testdata/moduleWithAudio.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		module = new TextModel();
		module.load(element, "", PAGE_VERSION);

		services = new PlayerServicesMockup();
		display = new TextViewMockup(module);
		presenter = new TextPresenter(module, services);
		presenter.addView(display);

		List<AudioInfo> infos = module.getAudioInfos();
		AudioInfo oneToBeStopped = infos.get(0);
		AudioInfo oneToBePlaying = infos.get(1);

		AudioWidget audioToBeStopped = Mockito.mock(AudioWidget.class);
		AudioWidget audioToBePlayed = Mockito.mock(AudioWidget.class);
		
		oneToBeStopped.setAudio(audioToBeStopped);
		oneToBePlaying.setAudio(audioToBePlayed);
		
		// we don't care about this mock, but it needs to be here, so there won't be null pointer exception
		AudioButtonWidget abw = Mockito.mock(AudioButtonWidget.class);
		
		oneToBeStopped.setButton(abw);
		oneToBePlaying.setButton(abw);
	
		Mockito.when(audioToBeStopped.isPaused()).thenReturn(false);
		Mockito.when(audioToBePlayed.isPaused()).thenReturn(true);

		display.callAudioButtonClickedListenerWith(oneToBePlaying);

		Mockito.verify(audioToBeStopped, Mockito.times(1)).reset();
		Mockito.verify(audioToBePlayed, Mockito.times(1)).play();
		
	}

	@Test
	public void givenPlaceholderThatEqualsTextAndIgnoreDefaultIsFalseWhenGetErrorCountThenGetsError() {
	    GapInfo gi = module.gapInfos.get(0);
	    gi.setPlaceHolder("An");

        Whitebox.setInternalState(this.module, "ignoreDefaultPlaceholderWhenCheck", false);
		display.getListener().onValueChanged(id3, "An");

		assertEquals(1, presenter.getErrorCount());
	}

	@Test
	public void givenPlaceholderThatEqualsTextAndIgnoreDefaultIsTrueWhenGetErrorCountThenDontGetError() {
	    GapInfo gi = module.gapInfos.get(0);
	    gi.setPlaceHolder("An");

	    GapWidget gw = PowerMockito.mock(GapWidget.class);
	    Mockito.when(gw.getId()).thenReturn(gi.getId());

	    TextViewMockup mockedView = Mockito.mock(TextViewMockup.class);
		Mockito.when(mockedView.getChildrenCount()).thenReturn(1);
		Mockito.when(mockedView.getChild(0)).thenReturn(gw);
		mockedView.setGapWidget(gw);
		presenter.addView(mockedView);

        Whitebox.setInternalState(this.module, "ignoreDefaultPlaceholderWhenCheck", true);
		display.getListener().onValueChanged(id3, "An");

		assertEquals(0, presenter.getErrorCount());
	}

	@Test
	public void givenPlaceholderThatDiffersFromTextAndIgnoreDefaultIsFalseWhenGetErrorCountThenGetsError() {
	    GapInfo gi = module.gapInfos.get(0);
	    gi.setPlaceHolder("An");

        Whitebox.setInternalState(this.module, "ignoreDefaultPlaceholderWhenCheck", false);
		display.getListener().onValueChanged(id3, "Ans");

		assertEquals(1, presenter.getErrorCount());
	}

	@Test
	public void givenPlaceholderThatDiffersFromTextAndIgnoreDefaultIsTrueWhenGetErrorCountThenGetsError() {
	    GapInfo gi = module.gapInfos.get(0);
	    gi.setPlaceHolder("An");

        Whitebox.setInternalState(this.module, "ignoreDefaultPlaceholderWhenCheck", true);
		display.getListener().onValueChanged(id3, "Ans");

		assertEquals(1, presenter.getErrorCount());
	}

	@Test
	public void givenNoGapsWhenGetActivitiesCountIsCalledThenReturnZero() {
		TextViewMockup mockedView = Mockito.mock(TextViewMockup.class);
		Mockito.when(mockedView.getGapCount()).thenReturn(0);
		presenter.addView(mockedView);
		assertEquals(0, presenter.getActivitiesCount());
	}

	@Test
	public void givenDisplayWithGapsWhenGetActivitiesCountIsCalledThenReturnNumberOfGaps() {
		TextViewMockup mockedView = Mockito.mock(TextViewMockup.class);
		Mockito.when(mockedView.getGapCount()).thenReturn(5);
		presenter.addView(mockedView);
		assertEquals(5, presenter.getActivitiesCount());
	}
}
