package com.lorepo.icplayer.client.page;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.model.Page;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.choice.ChoiceModel;
import com.lorepo.icplayer.client.module.choice.ChoiceOption;
import com.lorepo.icplayer.client.module.choice.mockup.ChoiceViewMockup;
import com.lorepo.icplayer.client.page.mockup.ModuleFactoryMockup;
import com.lorepo.icplayer.client.page.mockup.PageViewMockup;

public class SaveStateTestCase {

	@Test
	public void testSaveLoadState() {

		PageViewMockup display = new PageViewMockup();
		PageController pageController = new PageController(display);
		IPlayerServices services = new PlayerServicesMockup();
		pageController.setPlayerServices(services);
		pageController.setModuleFactory(new ModuleFactoryMockup(services));
		Page page1 = createPageWithSingleChoice("Page 1", "/page1");
		Page page2 = createPageWithSingleChoice("Page 2", "/page2");
		
		pageController.setPage(page1);
		ChoiceViewMockup choiceView1 = (ChoiceViewMockup) display.getViews().get(0);
		choiceView1.getOptions().get(0).setDown(true);
		
		pageController.closeCurrentPage();
		pageController.setPage(page2);
		pageController.closeCurrentPage();
		pageController.setPage(page1);
		
		ChoiceViewMockup choiceView2 = (ChoiceViewMockup) display.getViews().get(0);
		boolean isDown = choiceView2.getOptions().get(0).isDown();
		
		assertTrue(isDown);
	}

	@Test
	public void sameIdDifferentPageName() {

		PageViewMockup display = new PageViewMockup();
		PageController pageController = new PageController(display);
		IPlayerServices services = new PlayerServicesMockup();
		pageController.setPlayerServices(services);
		pageController.setModuleFactory(new ModuleFactoryMockup(services));
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

	private Page createPageWithSingleChoice(String pageName, String pageUrl) {

		Page page = new Page(pageName, pageUrl);
		
		ChoiceModel module = new ChoiceModel();
		module.setId("choice");
		module.removeAllOptions();
		module.addOption(new ChoiceOption("1", "A", 1));
		module.addOption(new ChoiceOption("2", "B", 0));
		page.getModules().add(module);
		
		return page;
	}
}
