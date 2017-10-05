package com.lorepo.icplayer.client.module.imagesource;

import static org.junit.Assert.assertEquals;

import java.io.InputStream;

import org.junit.Before;
import org.junit.Test;
import org.powermock.reflect.Whitebox;

import com.google.gwt.xml.client.Element;
import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.PlayerController;
import com.lorepo.icplayer.client.PlayerEntryPoint;
import com.lorepo.icplayer.client.content.services.PlayerServices;
import com.lorepo.icplayer.client.mockup.xml.XMLParserMockup;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.page.PageController;
import com.lorepo.icplayer.client.page.PageView;
import com.lorepo.icplayer.client.ui.PlayerView;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTImageSourcePresenterTestCase extends GwtTest{

	private ImageSourceModule module;
	private IPlayerServices services;
	private ImageSourceView display;
	private ImageSourcePresenter presenter;
	private Element element;
	private PageView mainPageView;
	
	private PlayerController playerController;
	
	@Before
	public void runBeforeEveryTest() throws Exception {
		Content content = new Content();
		PlayerView view = new PlayerView();
		PlayerEntryPoint playerEntryPoint = new PlayerEntryPoint();
		
		Page main = new Page("main", "main");
		
		playerController = new PlayerController(content, view, false, playerEntryPoint);
		
		PageController mainPageController = new PageController(this.playerController);
		
		mainPageView = new PageView("main");
		
		mainPageController.setView(mainPageView);
		mainPageController.setPage(main);	
			
		
		InputStream inputStream = getClass().getResourceAsStream("testdata/module.xml");
		XMLParserMockup xmlParser = new XMLParserMockup();
		element = xmlParser.parser(inputStream);
				
		services = new PlayerServices(playerController, mainPageController);
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
		module.load(element, "");
		
		display = new SomeToMock(module, false); 	
		presenter = new ImageSourcePresenter(module, services);
		
		mainPageView.addModuleView(display, module);
		presenter.addView(display);
		
		int initialLeft = Whitebox.getInternalState(display, "initialLeft");
		int initialTop = Whitebox.getInternalState(display, "initialTop");

		assertEquals(0, initialLeft);
		assertEquals(0, initialTop);
		
		presenter.reset();

		initialLeft = Whitebox.getInternalState(display, "initialLeft");
		initialTop = Whitebox.getInternalState(display, "initialTop");

		assertEquals(module.getLeft(), initialLeft);
		assertEquals(module.getTop(), initialTop);
		
	}

	
	
}
