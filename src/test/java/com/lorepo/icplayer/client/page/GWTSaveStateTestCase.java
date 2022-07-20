package com.lorepo.icplayer.client.page;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.Mockito;

import static org.mockito.Mockito.when;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.IPlayerController;
import com.lorepo.icplayer.client.content.services.PlayerServices;
import com.lorepo.icplayer.client.content.services.StateService;
import com.lorepo.icplayer.client.mockup.services.JsonMockup;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.layout.PageLayout;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.properties.PageHeightModifications;
import com.lorepo.icplayer.client.module.choice.ChoiceModel;
import com.lorepo.icplayer.client.module.choice.ChoiceOption;
import com.lorepo.icplayer.client.module.choice.mockup.ChoiceViewMockup;
import com.lorepo.icplayer.client.page.mockup.ModuleFactoryMockup;
import com.lorepo.icplayer.client.page.mockup.PageViewMockup;
import com.lorepo.icplayer.client.page.mockup.PlayerControllerMockup;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class GWTSaveStateTestCase extends GwtTest {
	Content contentMock;
	
	private void initContentMock() {
		Set<PageLayout> pageLayouts = new HashSet<PageLayout>(Arrays.asList(PageLayout.createDefaultPageLayout()));
		contentMock = Mockito.mock(Content.class);
		when(contentMock.getActualSemiResponsiveLayoutID()).thenReturn("default");
		when(contentMock.getLayoutNameByID("default")).thenReturn("default");
		when(contentMock.getActualSemiResponsiveLayouts()).thenReturn(pageLayouts);
	}
	
	@Before
	public void init() {
		this.initContentMock();
	}
	
	
	@Test
	public void testSaveLoadState() {
		PageViewMockup display = new PageViewMockup();
		IPlayerController playerController = new PlayerControllerMockup();
		
		PageController pageController = new PageController(playerController);

		pageController.setView(display);
		PlayerServices playerService = (PlayerServices) pageController.getPlayerServices();
		playerService.setJsonService(new JsonMockup());
		pageController.setModuleFactory(new ModuleFactoryMockup(playerService));
		Page page1 = createPageWithSingleChoice("Page 1", "/page1");
		Page page2 = createPageWithSingleChoice("Page 2", "/page2");
		
		
		pageController.setContent(contentMock);
		pageController.setPage(page1);
		ChoiceViewMockup choiceView1 = (ChoiceViewMockup) display.getViews().get(0);
		choiceView1.getOptions().get(0).setDown(true);

		HashMap<String, String> state = pageController.getState();
		

		((StateService)playerService.getStateService()).addState(state);
		pageController.setPage(page2);
		pageController.setPage(page1);
		
		ChoiceViewMockup choiceView2 = (ChoiceViewMockup) display.getViews().get(0);
		boolean isDown = choiceView2.getOptions().get(0).isDown();
		
		assertTrue(isDown);
	}

	@Test
	public void sameIdDifferentPageName() {
		PageViewMockup display = new PageViewMockup();
		IPlayerController playerController = new PlayerControllerMockup();
		PageController pageController = new PageController(playerController);
		pageController.setView(display);
		PlayerServices playerService = (PlayerServices) pageController.getPlayerServices();
		playerService.setJsonService(new JsonMockup());
		pageController.setModuleFactory(new ModuleFactoryMockup(playerService));
		pageController.setContent(contentMock);
		
		
		Page page1 = createPageWithSingleChoice("Page 1", "/page1");
		Page page2 = createPageWithSingleChoice("Page 2", "/page2");
		
		pageController.setPage(page1);
		ChoiceViewMockup choiceView1 = (ChoiceViewMockup) display.getViews().get(0);
		choiceView1.getOptions().get(0).setDown(true);
		
		pageController.setPage(page2);
		ChoiceViewMockup choiceView2 = (ChoiceViewMockup) display.getViews().get(0);
		boolean isDown = choiceView2.getOptions().get(0).isDown();
		
		assertFalse(isDown);
	}

	private static Page createPageWithSingleChoice(String pageName, String pageUrl) {
		Page page = new Page(pageName, pageUrl);
		
		page.heightModifications = Mockito.mock(PageHeightModifications.class);
		when(page.heightModifications.getState()).thenReturn("[]");
		
		ChoiceModel module = new ChoiceModel();
		module.setId("choice");
		module.removeAllOptions();
		module.addOption(new ChoiceOption("1", "A", 1));
		module.addOption(new ChoiceOption("2", "B", 0));
		page.getModules().add(module);
		
		return page;
	}
}
