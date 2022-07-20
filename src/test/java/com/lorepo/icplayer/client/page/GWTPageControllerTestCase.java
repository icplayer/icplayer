package com.lorepo.icplayer.client.page;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.junit.Ignore;
import org.junit.Test;
import org.mockito.Mockito;
import org.xml.sax.SAXException;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.mockup.xml.PageFactoryMockup;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.layout.PageLayout;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.group.Group;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.page.mockup.ModuleFactoryMockup;
import com.lorepo.icplayer.client.page.mockup.PageViewMockup;
import com.lorepo.icplayer.client.page.mockup.PlayerControllerMockup;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTPageControllerTestCase extends GwtTest {

	private PageViewMockup display;
	
	public PageController init(String dataPath) throws SAXException, IOException {
		
		display = new PageViewMockup();
		IPlayerController playerController = new PlayerControllerMockup();
		PageController pageController = new PageController(playerController);
		pageController.setView(display);
		pageController.setModuleFactory(new ModuleFactoryMockup(pageController.getPlayerServices()));
		
		Page page = new PageFactoryMockup(new Page("Sizes", "")).loadFromFile(dataPath);
		
		Set<PageLayout> pageLayouts = new HashSet<PageLayout>(Arrays.asList(PageLayout.createDefaultPageLayout()));
		
		Content contentMock = Mockito.mock(Content.class);
		when(contentMock.getActualSemiResponsiveLayoutID()).thenReturn("default");
		when(contentMock.getLayoutNameByID("default")).thenReturn("default");
		when(contentMock.getActualSemiResponsiveLayouts()).thenReturn(pageLayouts);
		
		pageController.setContent(contentMock);
		
		pageController.setPage(page);
		return pageController;
	}
	
	@Test
	public void setDisplaySize() throws SAXException, IOException {
		init("testdata/pagecontroller/page.xml");
		
		assertEquals(100, display.getWidth());
		assertEquals(200, display.getHeight());
	}

	@Test
	public void dontSetDisplaySize() throws SAXException, IOException {
		init("testdata/pagecontroller/addon.page.xml");

		assertEquals(-1, display.getWidth());
		assertEquals(-1, display.getHeight());
	}

	@Test
	public void findModule() throws SAXException, IOException {
		PageController pageController = init("testdata/pagecontroller/page.xml");
		IPresenter presenter = pageController.findModule("sl2");

		assertNotNull(presenter);
	}
	
	@Test
	public void createGroupPresenters() throws SAXException, IOException {
		PageController pageController = init("testdata/pagecontroller/page.xml");
		
		Group group = new Group();
		group.add(pageController.findModule("sl1").getModel());
		group.add(pageController.findModule("sl2").getModel());
		
		ArrayList<IPresenter> presenters = pageController.createGroupPresenters(group);
		
		assertEquals(2, presenters.size());
		
		assertEquals(pageController.findModule("sl1"), presenters.get(0));
		assertEquals(pageController.findModule("sl2"), presenters.get(1));
	}
}
