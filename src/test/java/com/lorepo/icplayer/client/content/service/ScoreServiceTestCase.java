package com.lorepo.icplayer.client.content.service;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import com.lorepo.icplayer.client.content.services.ScoreService;
import com.lorepo.icplayer.client.module.api.player.PageScore;

public class ScoreServiceTestCase {

	@Test
	public void totalScore() {
		
		ScoreService scoreService = new ScoreService();
		PageScore pageScore1 = scoreService.getPageScore("Page 1");
		pageScore1.setScore(3);
		pageScore1.setMaxScore(5);
		PageScore pageScore2 = scoreService.getPageScore("Page 2");
		pageScore2.setScore(4);
		pageScore2.setMaxScore(8);
		
		
		assertEquals(7, scoreService.getTotalScore());
		assertEquals(13, scoreService.getTotalMaxScore());
	}
}
