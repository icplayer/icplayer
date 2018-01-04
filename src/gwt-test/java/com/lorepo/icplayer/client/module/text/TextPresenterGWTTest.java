package com.lorepo.icplayer.client.module.text;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.IOException;
import java.io.InputStream;

import org.junit.Before;
import org.junit.Test;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.module.text.mockup.TextViewMockup;

public class TextPresenterGWTTest {

	private TextModel module;
	private PlayerServicesMockup services;
	private TextViewMockup display;
	private TextPresenter presenter;
	private String id1;
	private String id3;
	
	private static final String PAGE_VERSION = "2";


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
		id3 = module.gapInfos.get(0).getId();
	}
	
	@Test
	public void basic(){
		module = new TextModel();
		assertNotNull(module);
	}

	@Test
	public void getScore() throws SAXException, IOException {
		
		display.getListener().onValueChanged(id1, "likes");
		display.getListener().onValueChanged(id3, "Volvo");
		display = new TextViewMockup(module);
		presenter = new TextPresenter(module, services);
		presenter.addView(display);
		
		assertEquals(3, presenter.getScore());
	}
}
