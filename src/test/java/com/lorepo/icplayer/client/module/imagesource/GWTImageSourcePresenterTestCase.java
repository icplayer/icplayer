package com.lorepo.icplayer.client.module.imagesource;

import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.powermock.reflect.Whitebox;
import org.xml.sax.SAXException;

import com.google.gwt.xml.client.Element;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.PlayerController;
import com.lorepo.icplayer.client.PlayerEntryPoint;
import com.lorepo.icplayer.client.content.services.PlayerServices;
import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.page.PageView;
import com.lorepo.icplayer.client.page.mockup.PlayerControllerMockup;
import com.lorepo.icplayer.client.ui.PlayerView;
import com.lorepo.icplayer.client.xml.content.parsers.ContentParser_v0;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTImageSourcePresenterTestCase extends GwtTest{

	private ImageSourceModule module;
	private IPlayerServices services;
	private ImageSourceView display;
	private ImageSourcePresenter presenter;
	private Element element;
	private PageView mainPageView;
	
	private IPlayerController playerController;
	
	private Content initContentFromFile(String path) throws SAXException, IOException {
		InputStream inputStream = getClass().getResourceAsStream(path);
		XMLParserMockup xmlParser = new XMLParserMockup();
		Element element = xmlParser.parser(inputStream);
	
		ContentParser_v0 parser = new ContentParser_v0();
		parser.setPagesSubset(new ArrayList<Integer> ());
		return (Content) parser.parse(element);
	}
	
	
	@Before
	public void runBeforeEveryTest() throws Exception {
		Content content = initContentFromFile("testdata/content4.xml");
	
		Page main = new Page("main", "main");
		playerController = new PlayerControllerMockup();
		services = new PlayerServicesMockup();

		PageController mainPageController = new PageController(this.playerController);
		Whitebox.setInternalState(mainPageController, IPlayerServices.class, services);
		mainPageController.setContent(content);

		mainPageView = new PageView("main");

		mainPageController.setView(mainPageView);
		mainPageController.setPage(main);	

		InputStream inputStream = getClass().getResourceAsStream("testdata/module.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		element = xmlParser.parser(inputStream);
	}	
	
	
/*
	Testing case when following script was attached to Image source, and on navigation to next slide, 
	it would cause the image to have position reseted to 0,0 
	
		EVENTSTART
		Name:PageLoaded
		Source:^((?!header|footer).)*$
		SCRIPTSTART
		
		var Image_source1 = presenter.playerController.getModule('Image_source1');
		Image_source1.reset();
		
		SCRIPTEND
		EVENTEND
		
*/	

	@Test
	public void checkPosAfterReset() { 
		
		class SomeToMock extends ImageSourceView {

			public SomeToMock(ImageSourceModule module, boolean isPreview) {
				super(module, isPreview);
			}
			
			@Override
			protected void connectHandlers() { }
			
			@Override
			public void makeDraggable(ImageSourcePresenter p) { }
			
			@Override
			public void setDisabled(boolean x) { }
			
		}
		
		module = new ImageSourceModule();
		module.load(element, "", "2");
		
		display = new SomeToMock(module, false); 	
		presenter = new ImageSourcePresenter(module, services);
		
		mainPageView.addModuleView(display, module);
		presenter.addView(display);
		
		int initialLeft = Whitebox.getInternalState(display, "initialLeft");
		int initialTop = Whitebox.getInternalState(display, "initialTop");

		assertEquals(0, initialLeft);
		assertEquals(0, initialTop);
		
		presenter.reset(false);

		initialLeft = Whitebox.getInternalState(display, "initialLeft");
		initialTop = Whitebox.getInternalState(display, "initialTop");

		assertEquals(module.getLeft(), initialLeft);
		assertEquals(module.getTop(), initialTop);
		
	}

	
	
}
