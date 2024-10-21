package com.lorepo.icplayer.client.module.api.player;

import static org.junit.Assert.assertEquals;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import com.lorepo.icplayer.client.module.api.player.PageOpenActivitiesScore;
import com.lorepo.icplayer.client.module.api.player.PageOpenActivitiesScore.ScoreInfo;

public class PageOpenActivitiesScoreTestCase {
	
	@Test
	public void givenEmptyPageScoreWhenAddedScoreThenGivenDataCanBeReturned() {
		String moduleName = "xxx";
		PageOpenActivitiesScore pageScore = new PageOpenActivitiesScore();
		
		pageScore.addScore(moduleName, 1, null, 3, 0.5f);
		
		ScoreInfo scoreInfo = pageScore.get(moduleName);
		assertEquals("Test for max score failed:", 3, scoreInfo.getMaxScore());
		assertEquals("Test for score failed:", 1, scoreInfo.getScore());
		assertEquals("Test for AI relevance failed:", 0.5f, scoreInfo.getAIRelevance().floatValue(), 0);
	}
	
	@Test
	public void givenPageScoreWithModuleScoreWhenSetAIDataWasExecutedThenGivenDataShouldBeenSet() {
		String moduleName = "xxx";
		PageOpenActivitiesScore pageScore = new PageOpenActivitiesScore();
		pageScore.addScore(moduleName, 1, null, 3, 0.5f);
		
		pageScore.setAIData(moduleName, 2, 0.7f);
		
		ScoreInfo scoreInfo = pageScore.get(moduleName);
		assertEquals("Test for max score failed:", 3, scoreInfo.getMaxScore());
		assertEquals("Test for score failed:", 2, scoreInfo.getScore());
		assertEquals("Test for AI relevance failed:", 0.7f, scoreInfo.getAIRelevance().floatValue(), 0);
	}
	
	@Test
	public void givenPageScoreWithModulesWhenGetScoreExecutedThenSumOfScoresShouldBeReturned() {
		PageOpenActivitiesScore pageScore = new PageOpenActivitiesScore();
		
		pageScore.addScore("xxx1", 1, null, 3, 0.5f);
		pageScore.addScore("xxx2", 3, null, 3, 0.5f);
		
		assertEquals(4, pageScore.getScore());
	}
	
	@Test
	public void givenPageScoreWithModulesAndManualGradedWhenGetScoreExecutedThenSumOfScoresShouldBeReturned() {
		PageOpenActivitiesScore pageScore = new PageOpenActivitiesScore();
		
		pageScore.addScore("xxx1", 1, 2, 3, 0.5f);
		pageScore.addScore("xxx2", 3, 2, 3, 0.5f);
		
		assertEquals(4, pageScore.getScore());
	}
	
	@Test
	public void givenPageScoreWithModulesWhenGetMaxScoreExecutedThenSumOfMaxScoresShouldBeReturned() {
		PageOpenActivitiesScore pageScore = new PageOpenActivitiesScore();
		
		pageScore.addScore("xxx1", 1, null, 3, 0.5f);
		pageScore.addScore("xxx2", 3, null, 3, 0.5f);

		assertEquals(6, pageScore.getMaxScore());
	}
}
