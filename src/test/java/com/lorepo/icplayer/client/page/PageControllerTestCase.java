package com.lorepo.icplayer.client.page;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

import org.junit.Test;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.model.page.Group;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.page.mockup.ModuleFactoryMockup;
import com.lorepo.icplayer.client.page.mockup.PageViewMockup;
import com.lorepo.icplayer.client.page.mockup.PlayerControllerMockup;
import com.lorepo.icplayer.client.xml.page.parsers.PageParser_v1;

public class PageControllerTestCase {

	private PageViewMockup display;
	private PageController pageController;
	
	private void loadPage(String xmlFile, Page page) {
		InputStream inputStream = getClass().getResourceAsStream(xmlFile);
		try {
			XMLParserMockup xmlParser = new XMLParserMockup();
			Element element = xmlParser.parser(inputStream);
			PageParser_v1 parser = new PageParser_v1();
			parser.setPage(page);
			page = (Page) parser.parse(element);
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void init(String pageURL) throws SAXException, IOException {
		
		display = new PageViewMockup();
		IPlayerController playerController = new PlayerControllerMockup();
		pageController = new PageController(playerController);
		pageController.setView(display);
		pageController.setModuleFactory(new ModuleFactoryMockup(pageController.getPlayerServices()));
		
		Page page = new Page("Sizes", "");
		loadPage(pageURL, page);
		
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
	
	@Test
	public void createGroupPresenters() throws SAXException, IOException {
		init("testdata/page.xml");
		
		Group group = new Group();
		group.add(pageController.findModule("sl1").getModel());
		group.add(pageController.findModule("sl2").getModel());
		
		ArrayList<IPresenter> presenters = pageController.createGroupPresenters(group);
		
		assertEquals(2, presenters.size());
		
		assertEquals(pageController.findModule("sl1"), presenters.get(0));
		assertEquals(pageController.findModule("sl2"), presenters.get(1));
	}
}
