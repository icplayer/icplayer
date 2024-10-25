package com.lorepo.icplayer.client.module.api.player;

import static org.junit.Assert.assertEquals;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import com.lorepo.icplayer.client.module.api.player.PageOpenActivitiesScore.ScoreInfo;

public class ScoreInfoTestCase {
	
	@Test
	public void givenScoreInfoWithoutProvidedMaxScoreWhenExecutedGetMaxScoreThenReturnZero() {
		ScoreInfo info = new ScoreInfo(null, null, null, null);
		
		assertEquals(0, info.getMaxScore());
	}
	
	@Test
	public void givenScoreInfoWithoutProvidedArgsWhenExecutedGetMaxScoreThenReturnZero() {
		ScoreInfo info = new ScoreInfo();
		
		assertEquals(0, info.getMaxScore());
	}
	
	@Test
	public void givenScoreInfoWithProvidedMaxScoreWhenExecutedGetMaxScoreThenReturnGivenValue() {
		ScoreInfo info = new ScoreInfo(null, null, 2, null);
		
		assertEquals(2, info.getMaxScore());
	}
	
	@Test
	public void givenScoreInfoWithProvidedAIScoreWhenExecutedGetScoreThenReturnGivenValue() {
		ScoreInfo info = new ScoreInfo(1, null, null, null);

		assertEquals(1, info.getScore());
	}
	
	@Test
	public void givenScoreInfoWithProvidedManualGradedScoreWhenExecutedGetScoreThenReturnGivenValue() {
		ScoreInfo info = new ScoreInfo(null, 2, null, null);
		
		assertEquals(2, info.getScore());
	}
	
	@Test
	public void givenScoreInfoWithProvidedManualGradedAndAIScoreWhenExecutedGetScoreThenReturnManualGradedScore() {
		ScoreInfo info = new ScoreInfo(1, 2, null, null);
		
		assertEquals(2, info.getScore());
	}
	
	@Test
	public void givenScoreInfoWithoutProvidedArgsWhenExecutedGetScoreThenReturnZero() {
		ScoreInfo info = new ScoreInfo();
		
		assertEquals(0, info.getScore());
	}
	
	@Test
	public void givenScoreInfoWithoutProvidedManualGradedAndAIScoreWhenExecutedGetScoreThenReturnZero() {
		ScoreInfo info = new ScoreInfo(null, null, null, null);
		
		assertEquals(0, info.getScore());
	}
}
