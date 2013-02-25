package com.lorepo.icplayer.client.page;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.IOException;
import java.io.InputStream;

import org.junit.Test;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.page.mockup.ModuleFactoryMockup;
import com.lorepo.icplayer.client.page.mockup.PageViewMockup;

public class PageControllerTestCase {

	private PageViewMockup display;
	private PageController pageController;
	
	
	public void init(String pageURL) throws SAXException, IOException {
		
		display = new PageViewMockup();
		pageController = new PageController(display);
		IPlayerServices services = new PlayerServicesMockup();
		pageController.setPlayerServices(services);
		pageController.setModuleFactory(new ModuleFactoryMockup(services));
		
		InputStream inputStream = getClass().getResourceAsStream(pageURL);
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
		
		Page page = new Page("Sizes", "");
		page.load(element, "");
		
		pageController.setPage(page);
	}
	
	
	@Test
	public void setDisplaySize() throws SAXException, IOException {

		init("testdata/page.xml");
		
		assertEquals(100, display.getWidth());
		assertEquals(200, display.getHeight());
	}

	@Test
	public void dontSetDisplaySize() throws SAXException, IOException {

		init("testdata/addon.page.xml");

		assertEquals(-1, display.getWidth());
		assertEquals(-1, display.getHeight());
	}

	@Test
	public void findModule() throws SAXException, IOException {

		init("testdata/page.xml");
		IPresenter presenter = pageController.findModule("sl2");

		assertNotNull(presenter);
	}

}
