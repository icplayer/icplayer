package com.lorepo.icplayer.client.content.service;

import static org.junit.Assert.assertEquals;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import com.lorepo.icplayer.client.content.services.PlayerCommands;
import com.lorepo.icplayer.client.content.services.PlayerServices;
import com.lorepo.icplayer.client.content.services.ScoreService;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.Content.ScoreType;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.PageScore;

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
	
}
