package com.lorepo.icplayer.client.content.service;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import com.lorepo.icplayer.client.content.services.ScoreService;
import com.lorepo.icplayer.client.module.api.player.PageScore;

public class ScoreServiceTestCase {

	@Test
	public void totalScore() {
		
		ScoreService scoreService = new ScoreService(true);
		PageScore pageScore1 = scoreService.getPageScore("Page 1");
		pageScore1.setScore(3);
		pageScore1.setMaxScore(5);
		PageScore pageScore2 = scoreService.getPageScore("Page 2");
		pageScore2.setScore(4);
		pageScore2.setMaxScore(8);
		
		
		assertEquals(7, scoreService.getTotalScore());
		assertEquals(13, scoreService.getTotalMaxScore());
	}

	@Test
	public void historyFirst() {
		
		ScoreService scoreService = new ScoreService(false);
		PageScore pageScore1 = scoreService.getPageScore("Page 1");
		pageScore1.setScore(3);
		pageScore1.setMaxScore(5);
		scoreService.updateHistory("Page 1");
		assertEquals(3, scoreService.getTotalScore());
		assertEquals(5, scoreService.getTotalMaxScore());

		pageScore1 = scoreService.getPageScore("Page 1");
		pageScore1.setScore(4);
		pageScore1.setMaxScore(8);
		
		PageScore pageScore = scoreService.getArchivedPageScore("Page 1");
		assertEquals(3, pageScore.getScore(), 0.1);
		assertEquals(5, pageScore.getMaxScore(), 0.1);
	}

	@Test
	public void historyLast() {
		
		ScoreService scoreService = new ScoreService(true);
		PageScore pageScore1 = scoreService.getPageScore("Page 1");
		pageScore1.setScore(3);
		pageScore1.setMaxScore(5);
		scoreService.updateHistory("Page 1");
		assertEquals(3, scoreService.getTotalScore());
		assertEquals(5, scoreService.getTotalMaxScore());

		pageScore1 = scoreService.getPageScore("Page 1");
		pageScore1.setScore(4);
		pageScore1.setMaxScore(8);
		
		PageScore pageScore = scoreService.getArchivedPageScore("Page 1");
		assertEquals(4, pageScore.getScore(), 0.1);
		assertEquals(8, pageScore.getMaxScore(), 0.1);
	}
}
