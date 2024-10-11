package com.lorepo.icplayer.client.content.service;

import static org.junit.Assert.assertEquals;

import java.util.HashMap;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import com.lorepo.icplayer.client.content.services.PlayerCommands;
import com.lorepo.icplayer.client.content.services.PlayerServices;
import com.lorepo.icplayer.client.content.services.ScoreService;
import com.lorepo.icplayer.client.mockup.services.PlayerServicesMockup;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.Content.ScoreType;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.PageScore;
import com.lorepo.icplayer.client.module.api.player.PageOpenActivitiesScore;
import com.lorepo.icplayer.client.module.api.player.PageOpenActivitiesScore.ScoreInfo;


public class ScoreServiceTestCase {
	private IPage mockedPage;
	private IContent mockedContent;
	private IPlayerServices mockedPlayerServices;
	private IPlayerCommands mockedCommands;
	private PageScore mockedPageScore;
	
	@Before
	public void setUp () {
		mockedCommands = Mockito.mock(PlayerCommands.class);
		
		mockedPage = Mockito.mock(Page.class);
		Mockito.when(mockedPage.getId()).thenReturn("someID");
		
		mockedContent = Mockito.mock(Content.class);
		Mockito.when(mockedContent.getPage(0)).thenReturn(mockedPage);
		
		mockedPlayerServices = Mockito.mock(PlayerServices.class);
		Mockito.when(mockedPlayerServices.getCurrentPageIndex()).thenReturn(0);
		Mockito.when(mockedPlayerServices.getModel()).thenReturn(mockedContent);
		Mockito.when(mockedPlayerServices.getCommands()).thenReturn(mockedCommands);
		
		mockedPageScore = Mockito.mock(PageScore.class);	
	}

	@Test
	public void totalScoreFirst() {
		ScoreService scoreService = new ScoreService(ScoreType.first);
		
		scoreService.setPlayerService(mockedPlayerServices);
				
		Page page1 = new Page("Page 1",  "");
		PageScore pageScore1 = new PageScore(3, 5);
		scoreService.setPageScore(page1, pageScore1);
		Page page2 = new Page("Page 2",  "");
		PageScore pageScore2 = new PageScore(4, 8);
		scoreService.setPageScore(page2, pageScore2);

		assertEquals(7, scoreService.getTotalScore());
		assertEquals(13, scoreService.getTotalMaxScore());

		Mockito.verify(mockedCommands, Mockito.times(0)).updateCurrentPageScore(false);
	}
	
	@Test
	public void totalScoreLast() {
		ScoreService scoreService = new ScoreService(ScoreType.last);
		
		scoreService.setPlayerService(mockedPlayerServices);

		Page page1 = new Page("Page 1",  "");
		PageScore pageScore1 = new PageScore(3, 5);
		scoreService.setPageScore(page1, pageScore1);
		Page page2 = new Page("Page 2",  "");
		PageScore pageScore2 = new PageScore(4, 8);
		scoreService.setPageScore(page2, pageScore2);

		assertEquals(7, scoreService.getTotalScore());
		assertEquals(13, scoreService.getTotalMaxScore());

		Mockito.verify(mockedCommands, Mockito.times(1)).updateCurrentPageScore(false);
	}
	
	@Test
	public void gettingPageScoreByIdInFirstTypeMode() {
		
		ScoreService scoreService = new ScoreService(ScoreType.first);
		scoreService.setPlayerService(mockedPlayerServices);
		
		Page page1 = new Page("Page 1",  "");
		
		PageScore pageScore1 = new PageScore(3, 5, 0, 0, 0);
		scoreService.setPageScore(page1, pageScore1);
		
		PageScore pageScore = scoreService.getPageScoreById(page1.getId());

		assertEquals(3, pageScore.getScore(), 0.1);
		assertEquals(5, pageScore.getMaxScore(), 0.1);
		
		PageScore pageScore2 = new PageScore(4, 8, 0, 0, 0);
		scoreService.setPageScore(page1, pageScore2);

		pageScore = scoreService.getPageScoreById(page1.getId());

		assertEquals(3, pageScore.getScore(), 0.1);
		assertEquals(5, pageScore.getMaxScore(), 0.1);
		Mockito.verify(mockedCommands, Mockito.times(0)).updateCurrentPageScore(false);

	}

	@Test
	public void gettingPageScoreByIdInLastTypeMode() {
		
		ScoreService scoreService = new ScoreService(ScoreType.last);
		
		scoreService.setPlayerService(mockedPlayerServices);

		Page page1 = new Page("Page 1",  "");
		PageScore pageScore1 = new PageScore(3, 5);
		
		scoreService.setPageScore(page1, pageScore1);
		
		assertEquals(3, scoreService.getTotalScore());
		assertEquals(5, scoreService.getTotalMaxScore());

		pageScore1 = new PageScore(4, 8);
		scoreService.setPageScore(page1, pageScore1);
		
		PageScore pageScore = scoreService.getPageScoreById(page1.getId());
		
		assertEquals(4, pageScore.getScore(), 0.1);
		assertEquals(8, pageScore.getMaxScore(), 0.1);
		
		Mockito.verify(mockedCommands, Mockito.times(2)).updateCurrentPageScore(false);

	}
	
	@Test
	public void givenScoreServiceWhenSetSomeOpenActivitiesScoresThenOnGetPassedDataShouldBeenReturned() {
		// GIVEN
		ScoreService scoreService = new ScoreService(ScoreType.last);
		scoreService.setPlayerService(mockedPlayerServices);
		
		HashMap<String, PageOpenActivitiesScore> pagesOpenActivitiesScores = new HashMap<String, PageOpenActivitiesScore>();
		String page1ID = "page1";
		String page1ModuleID = "xxx";
		PageOpenActivitiesScore pageOpenActivitiesScore1 = new PageOpenActivitiesScore();
		pageOpenActivitiesScore1.addScore(page1ModuleID, 1, null, 3, 0.5f);
		pagesOpenActivitiesScores.put(page1ID, pageOpenActivitiesScore1);
		
		String page2ID = "page2";
		String page2ModuleID = "xxx";
		PageOpenActivitiesScore pageOpenActivitiesScore2 = new PageOpenActivitiesScore();
		pageOpenActivitiesScore2.addScore(page2ModuleID, 4, null, 5, null);
		pagesOpenActivitiesScores.put(page2ID, pageOpenActivitiesScore2);
		
		// WHEN
		scoreService.setOpenActivitiesScores(pagesOpenActivitiesScores);
		
		// THEN
		ScoreInfo page1ModuleScoreInfo = scoreService.getOpenActivityScores(page1ID, page1ModuleID);
		assertEquals("Test for max score of module in page 1 failed:", 3, page1ModuleScoreInfo.getMaxScore());
		assertEquals("Test for score of module in page 1 failed:", 1, page1ModuleScoreInfo.getScore());
		assertEquals("Test for AI reference of module in page 1 failed:", 0.5f, page1ModuleScoreInfo.getAIRelevance(), 0);
		
		ScoreInfo page2ModuleScoreInfo = scoreService.getOpenActivityScores(page2ID, page2ModuleID);
		assertEquals("Test for max score of module in page 2 failed:", 5, page2ModuleScoreInfo.getMaxScore());
		assertEquals("Test for score of module in page 2 failed:", 4, page2ModuleScoreInfo.getScore());
		assertEquals("Test for AI reference of module in page 2 failed:", null, page2ModuleScoreInfo.getAIRelevance());
	}
	
	@Test
	public void givenScoreServiceWhenSetNoOpenActivitiesScoresThenOnGetShouldBeenReturnedEmptyScoreInfo() {
		// GIVEN
		ScoreService scoreService = new ScoreService(ScoreType.last);
		scoreService.setPlayerService(mockedPlayerServices);
		
		HashMap<String, PageOpenActivitiesScore> pagesOpenActivitiesScores = new HashMap<String, PageOpenActivitiesScore>();
		
		// WHEN
		scoreService.setOpenActivitiesScores(pagesOpenActivitiesScores);
		
		// THEN
		ScoreInfo scoreInfo = scoreService.getOpenActivityScores("xxx", "xxx1");
		assertEquals("Test for max score failed:", 0, scoreInfo.getMaxScore());
		assertEquals("Test for score failed:", 0, scoreInfo.getScore());
		assertEquals("Test for AI reference failed:", null, scoreInfo.getAIRelevance());
	}
	
	@Test
	public void givenScoreServiceWithOpenActivitiesScoresWhenUpdateCalledThenDataShouldBeenUpdated() {
		// GIVEN
		ScoreService scoreService = new ScoreService(ScoreType.last);
		PlayerServicesMockup services = new PlayerServicesMockup();
		scoreService.setPlayerService(services);
		
		HashMap<String, PageOpenActivitiesScore> pagesOpenActivitiesScores = new HashMap<String, PageOpenActivitiesScore>();
		String pageID = "page1";
		String moduleID = "xxx";
		PageOpenActivitiesScore pageOpenActivitiesScore = new PageOpenActivitiesScore();
		pageOpenActivitiesScore.addScore(moduleID, 1, null, 3, 0.5f);
		pagesOpenActivitiesScores.put(pageID, pageOpenActivitiesScore);
		scoreService.setOpenActivitiesScores(pagesOpenActivitiesScores);
		
		// WHEN
		scoreService.updateOpenActivityScore(pageID, moduleID, "2", "0.72");
		
		// THEN
		ScoreInfo scoreInfo = scoreService.getOpenActivityScores(pageID, moduleID);
		assertEquals("Test for max score of module failed:", 3, scoreInfo.getMaxScore());
		assertEquals("Test for score of module failed:", 2, scoreInfo.getScore());
		assertEquals("Test for AI reference of module failed:", 0.72f, scoreInfo.getAIRelevance(), 0);
	}
	
	@Test
	public void givenScoreServiceWithoutOpenActivitiesScoresWhenUpdateCalledThenNewScoreInfoShouldBeenCreated() {
		// GIVEN
		ScoreService scoreService = new ScoreService(ScoreType.last);
		PlayerServicesMockup services = new PlayerServicesMockup();
		scoreService.setPlayerService(services);
		
		HashMap<String, PageOpenActivitiesScore> pagesOpenActivitiesScores = new HashMap<String, PageOpenActivitiesScore>();
		String pageID = "page1";
		String moduleID = "xxx";
		
		// WHEN
		scoreService.updateOpenActivityScore(pageID, moduleID, "2", "0.72");
		
		// THEN
		ScoreInfo scoreInfo = scoreService.getOpenActivityScores(pageID, moduleID);
		assertEquals("Test for max score of module failed:", 0, scoreInfo.getMaxScore());
		assertEquals("Test for score of module failed:", 2, scoreInfo.getScore());
		assertEquals("Test for AI reference of module failed:", 0.72f, scoreInfo.getAIRelevance(), 0);
	}
	
	@Test
	public void givenScoreServiceWithOpenActivitiesScoresWhenUpdateCalledForNotExistingModuleThenDataShouldBeenCreated() {
		// GIVEN
		ScoreService scoreService = new ScoreService(ScoreType.last);
		PlayerServicesMockup services = new PlayerServicesMockup();
		scoreService.setPlayerService(services);
		
		HashMap<String, PageOpenActivitiesScore> pagesOpenActivitiesScores = new HashMap<String, PageOpenActivitiesScore>();
		String pageID = "page1";
		String moduleID = "xxx";
		String moduleID2 = "aaa";
		PageOpenActivitiesScore pageOpenActivitiesScore = new PageOpenActivitiesScore();
		pageOpenActivitiesScore.addScore(moduleID, 1, null, 3, 0.5f);
		pagesOpenActivitiesScores.put(pageID, pageOpenActivitiesScore);
		scoreService.setOpenActivitiesScores(pagesOpenActivitiesScores);
		
		// WHEN
		scoreService.updateOpenActivityScore(pageID, moduleID2, "2", "0.72");
		
		// THEN
		ScoreInfo scoreInfo = scoreService.getOpenActivityScores(pageID, moduleID2);
		assertEquals("Test for max score of module failed:", 0, scoreInfo.getMaxScore());
		assertEquals("Test for score of module failed:", 2, scoreInfo.getScore());
		assertEquals("Test for AI reference of module failed:", 0.72f, scoreInfo.getAIRelevance(), 0);
	}
}
