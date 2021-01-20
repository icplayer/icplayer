package com.lorepo.icplayer.client.module.choice;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.InputStream;

import org.junit.Test;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.mockup.services.CommandsMockup;
import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.event.ShowErrorsEvent;
import com.lorepo.icplayer.client.module.api.event.ValueChangedEvent;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter.IOptionDisplay;
import com.lorepo.icplayer.client.module.choice.mockup.ChoiceViewMockup;
import com.lorepo.icplayer.client.module.choice.mockup.OptionViewMockup;
import com.lorepo.icplayer.client.module.choice.mockup.OptionViewMockup.StyleType;

public class PresenterTestCase {

	private boolean eventReceived;
	private static final String PAGE_VERSION = "2";
	
	@Test
	public void testViewMockup() {
		
		ChoiceModel model = new ChoiceModel();
		ChoiceViewMockup display = new ChoiceViewMockup(model);
		
		assertEquals(2, display.getOptions().size());
	}

	@Test
	public void reset() {
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		ChoiceModel model = new ChoiceModel();
		ChoiceViewMockup display = new ChoiceViewMockup(model);
		ChoicePresenter presenter = new ChoicePresenter(model, services);
		presenter.addView(display);
		
		IOptionDisplay optionView = display.getOptions().get(0);
		optionView.setDown(true);
		assertTrue(optionView.isDown());

		services.getEventBusService().getEventBus().fireEvent(new ResetPageEvent(false));
		
		assertFalse(optionView.isDown());
	}

	@Test
	public void multiChoiceManySelections() {
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		ChoiceModel model = new ChoiceModel();
		model.setMulti(true);
		ChoiceViewMockup display = new ChoiceViewMockup(model);
		ChoicePresenter presenter = new ChoicePresenter(model, services);
		presenter.addView(display);
		
		IOptionDisplay optionView1 = display.getOptions().get(0);
		IOptionDisplay optionView2 = display.getOptions().get(1);
		optionView1.setDown(true);
		optionView2.setDown(true);
		
		assertTrue(optionView1.isDown());
		assertTrue(optionView2.isDown());
	}

	/**
	 * W cwiczeniu single choice wybranie drugiej opcji powinno odznaczyć pierwsza
	 */
	@Test
	public void singleChoiceOneSelection() {
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		ChoiceModel model = new ChoiceModel();
		model.setMulti(false);
		ChoiceViewMockup display = new ChoiceViewMockup(model);
		ChoicePresenter presenter = new ChoicePresenter(model, services);
		presenter.addView(display);
		
		IOptionDisplay optionView1 = display.getOptions().get(0);
		IOptionDisplay optionView2 = display.getOptions().get(1);
		optionView1.setDown(true);
		optionView2.setDown(true);
		
		assertFalse(optionView1.isDown());
		assertTrue(optionView2.isDown());
	}

	@Test
	public void showAnswersStylesWrong() {
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		ChoiceModel model = new ChoiceModel();
		ChoiceViewMockup display = new ChoiceViewMockup(model);
		ChoicePresenter presenter = new ChoicePresenter(model, services);
		presenter.addView(display);
		
		OptionViewMockup optionView1 = (OptionViewMockup) display.getOptions().get(0);
		OptionViewMockup optionView2 = (OptionViewMockup) display.getOptions().get(1);
		optionView2.setDown(true);

		services.getEventBusService().getEventBus().fireEvent(new ShowErrorsEvent());
		
		assertEquals(StyleType.wrong, optionView1.getStyle());
		assertEquals(StyleType.wrong, optionView2.getStyle());
	}

	@Test
	public void showAnswersStylesCorrect() {
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		ChoiceModel model = new ChoiceModel();
		ChoiceOption option = new ChoiceOption("1", "Correct", 0);
		model.addOption(option);
		
		ChoiceViewMockup display = new ChoiceViewMockup(model);
		ChoicePresenter presenter = new ChoicePresenter(model, services);
		presenter.addView(display);
		
		OptionViewMockup optionView1 = (OptionViewMockup) display.getOptions().get(0);
		OptionViewMockup optionView2 = (OptionViewMockup) display.getOptions().get(1);
		OptionViewMockup optionView3 = (OptionViewMockup) display.getOptions().get(2);
		optionView1.setDown(true);
		
		services.getEventBusService().getEventBus().fireEvent(new ShowErrorsEvent());
		
		assertEquals(StyleType.correct, optionView1.getStyle());
		assertEquals(StyleType.correct, optionView2.getStyle());
		assertEquals(StyleType.correct, optionView3.getStyle());
	}

	@Test
	public void showFeedback() {
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		ChoiceModel model = new ChoiceModel();
		ChoiceOption option = new ChoiceOption("1", "Correct", 0);
		option.setFeedback("Demo feedback");
		model.addOption(option);
		
		ChoiceViewMockup display = new ChoiceViewMockup(model);
		ChoicePresenter presenter = new ChoicePresenter(model, services);
		presenter.addView(display);
		
		OptionViewMockup optionView3 = (OptionViewMockup) display.getOptions().get(2);
		optionView3.setDown(true);
		
		CommandsMockup commands = (CommandsMockup) services.getCommands();
		assertEquals("Demo feedback", commands.getLastCode());
	}

	@Test
	public void multiErrorCount() {
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		ChoiceModel model = new ChoiceModel();
		model.setMulti(true);
		model.addOption(new ChoiceOption("1", "C", 0));
		ChoiceViewMockup display = new ChoiceViewMockup(model);
		ChoicePresenter presenter = new ChoicePresenter(model, services);
		presenter.addView(display);
		
		IOptionDisplay optionView1 = display.getOptions().get(1);
		IOptionDisplay optionView2 = display.getOptions().get(2);
		optionView1.setDown(true);
		optionView2.setDown(true);
		
		assertEquals(2, presenter.getErrorCount());
	}

	@Test
	public void singleErrorCount() {
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		ChoiceModel model = new ChoiceModel();
		model.setMulti(false);
		model.addOption(new ChoiceOption("1", "C", 0));
		ChoiceViewMockup display = new ChoiceViewMockup(model);
		ChoicePresenter presenter = new ChoicePresenter(model, services);
		presenter.addView(display);
		
		IOptionDisplay optionView1 = display.getOptions().get(1);
		IOptionDisplay optionView2 = display.getOptions().get(2);
		optionView1.setDown(true);
		optionView2.setDown(true);
		
		assertEquals(1, presenter.getErrorCount());
	}

	@Test
	public void multiScore() {
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		ChoiceModel model = new ChoiceModel();
		model.setMulti(true);
		model.addOption(new ChoiceOption("1", "C", 1));
		model.addOption(new ChoiceOption("2", "D", 0));
		ChoiceViewMockup display = new ChoiceViewMockup(model);
		ChoicePresenter presenter = new ChoicePresenter(model, services);
		presenter.addView(display);
		
		IOptionDisplay optionView1 = display.getOptions().get(0);
		IOptionDisplay optionView2 = display.getOptions().get(2);
		optionView1.setDown(true);
		optionView2.setDown(true);
		
		assertEquals(presenter.getMaxScore(), presenter.getScore(), 0);
	}

	@Test
	public void givenIsMultiTrueWhenGetMaxScoreThanScoresShouldBeAdded() {

		PlayerServicesMockup services = new PlayerServicesMockup();
		ChoiceModel model = new ChoiceModel();
		model.setMulti(true);

		//From ChoiceModel: "A" - value = 1, "B? - value = 0
		model.addOption(new ChoiceOption("1", "C", 1));
		model.addOption(new ChoiceOption("2", "D", 2));
		ChoiceViewMockup display = new ChoiceViewMockup(model);
		ChoicePresenter presenter = new ChoicePresenter(model, services);
		presenter.addView(display);
		
		assertEquals(presenter.getMaxScore(), 4);
	}

	@Test
	public void givenIsMultiTrueWhenGetMaxScoreThanMaxValueShouldBeMaxScore() {

		PlayerServicesMockup services = new PlayerServicesMockup();
		ChoiceModel model = new ChoiceModel();
		model.setMulti(false);

		//From ChoiceModel: "A" - value = 1, "B" - value = 0
		model.addOption(new ChoiceOption("1", "C", 1));
		model.addOption(new ChoiceOption("2", "D", 2));
		ChoiceViewMockup display = new ChoiceViewMockup(model);
		ChoicePresenter presenter = new ChoicePresenter(model, services);
		presenter.addView(display);

		assertEquals(presenter.getMaxScore(), 2);
	}

	@Test
	public void scoreFromXML() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/choice1.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ChoiceModel module = new ChoiceModel();
		module.load(element, "", PAGE_VERSION);
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		ChoiceViewMockup display = new ChoiceViewMockup(module);
		ChoicePresenter presenter = new ChoicePresenter(module, services);
		presenter.addView(display);
		
		IOptionDisplay optionView1 = display.getOptions().get(0);
		IOptionDisplay optionView2 = display.getOptions().get(3);
		IOptionDisplay optionView3 = display.getOptions().get(5);
		optionView1.setDown(true);
		optionView2.setDown(true);
		optionView3.setDown(true);
		
		assertEquals(presenter.getMaxScore(), presenter.getScore(), 0);
	}
	
	
	@Test
	public void valueChangedEvent() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/choice1.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ChoiceModel module = new ChoiceModel();
		module.load(element, "", PAGE_VERSION);
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		ChoiceViewMockup display = new ChoiceViewMockup(module);
		ChoicePresenter presenter = new ChoicePresenter(module, services);
		presenter.addView(display);
		
		eventReceived = false;
		services.getEventBusService().getEventBus().addHandler(ValueChangedEvent.TYPE, new ValueChangedEvent.Handler() {
			@Override
			public void onScoreChanged(ValueChangedEvent event) {
				eventReceived = true;
			}
		});
		
		IOptionDisplay optionView1 = display.getOptions().get(0);
		IOptionDisplay optionView2 = display.getOptions().get(3);
		IOptionDisplay optionView3 = display.getOptions().get(5);
		optionView1.setDown(true);
		optionView2.setDown(true);
		optionView3.setDown(true);
		
		assertTrue(eventReceived);
	}
	
	@Test
	public void noActivity() throws SAXException, IOException {
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/choice2.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ChoiceModel module = new ChoiceModel();
		module.load(element, "", PAGE_VERSION);
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		ChoiceViewMockup display = new ChoiceViewMockup(module);
		ChoicePresenter presenter = new ChoicePresenter(module, services);
		presenter.addView(display);

		IOptionDisplay optionView1 = display.getOptions().get(0);
		optionView1.setDown(true);
		
		assertEquals(0, presenter.getMaxScore());
		assertEquals(0, presenter.getMaxScore());
	}

	@Test
	public void resetVisibility() throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream("testdata/choice3.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		ChoiceModel module = new ChoiceModel();
		module.load(element, "", PAGE_VERSION);
		
		PlayerServicesMockup services = new PlayerServicesMockup();
		ChoiceViewMockup display = new ChoiceViewMockup(module);
		ChoicePresenter presenter = new ChoicePresenter(module, services);
		presenter.addView(display);

		assertFalse(display.isVisible());
		presenter.executeCommand("show", null);
		assertTrue(display.isVisible());
		presenter.executeCommand("reset", null);
		assertFalse(display.isVisible());
	}
}
