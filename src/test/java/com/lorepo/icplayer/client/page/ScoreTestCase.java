package com.lorepo.icplayer.client.page;


import org.junit.Test;

import static org.junit.Assert.assertEquals;

import org.mockito.Mockito;

import com.lorepo.icplayer.client.model.page.Page.ScoringType;
import com.lorepo.icplayer.client.module.api.IActivity;
import com.lorepo.icplayer.client.page.Score.Result;

public class ScoreTestCase {

	@SuppressWarnings("static-access")
	@Test
	public void updatePageScoreOnDefaultGroup() {
		Score score = new Score();
		Result pageResult = new Result();
		Result groupResult = new Result();
		Result expectedResult;
		
		pageResult.score = 1;
		pageResult.maxScore = 1;
		pageResult.errorCount = 2;
		
		groupResult.score = 2;
		groupResult.maxScore = 2;
		groupResult.errorCount = 0;
		
		expectedResult = score.updateDefaultGroupResult(pageResult, groupResult);

		assertEquals((int) expectedResult.score, 3);
		assertEquals((int) expectedResult.maxScore, 3);
		assertEquals((int) expectedResult.errorCount, 2);
	}
	
	@SuppressWarnings("static-access")
	@Test
	public void updatePageScoreOnZeroMaxGroupWhenIsMax() {
		Score score = new Score();
		Result pageResult = new Result();
		Result groupResult = new Result();
		
		pageResult.score = 1;
		pageResult.maxScore = 1;
		pageResult.errorCount = 2;
		
		groupResult.score = 6;
		groupResult.maxScore = 6;
		groupResult.errorCount = 0;
		
		Result expectedResult = score.updateZeroMaxGroupResult(pageResult, groupResult, 4);

		assertEquals((int) expectedResult.score, 5); // pageResult.score + groupResult.score * scale[4/6]
		assertEquals((int) expectedResult.maxScore, 5);
		assertEquals((int) expectedResult.errorCount, 2);
	}
	
	@SuppressWarnings("static-access")
	@Test
	public void updatePageScoreOnZeroMaxGroupWhenIsNotMax() {
		Score score = new Score();
		Result pageResult = new Result();
		Result groupResult = new Result();
		Result expectedResult;
		
		pageResult.score = 1;
		pageResult.maxScore = 1;
		pageResult.errorCount = 2;
		
		groupResult.score = 4;
		groupResult.maxScore = 6;
		groupResult.errorCount = 0;
		
		expectedResult = score.updateZeroMaxGroupResult(pageResult, groupResult, 4);

		assertEquals((int) expectedResult.score, 1); // group score isn't max so page score is not updated
		assertEquals((int) expectedResult.maxScore, 5); //page max score + group max score * scale
		assertEquals((int) expectedResult.errorCount, 2);
	}
	
	@SuppressWarnings("static-access")
	@Test
	public void updatePageScoreOnGraduallyToMaxGroup() {
		Score score = new Score();
		Result pageResult = new Result();
		Result groupResult = new Result();
		Result expectedResult;
		
		pageResult.score = 1;
		pageResult.maxScore = 1;
		pageResult.errorCount = 2;
		
		groupResult.score = 6;
		groupResult.maxScore = 6;
		groupResult.errorCount = 0;
		
		expectedResult = score.updateGraduallyToMaxGroupResult(pageResult, groupResult, 3);

		assertEquals((int) expectedResult.score, 4); // pageResult.score + groupResult.score * scale[3/6] -> 1 + 6 * (1/2)
		assertEquals((int) expectedResult.maxScore, 4); 
		assertEquals((int) expectedResult.errorCount, 2);
	}
	
	@SuppressWarnings("static-access")
	@Test
	public void calculateZeroMaxScoreWhenModuleScoreIsMax() {
		Score score = new Score();
		Result pageResult = new Result();

		IActivity activity = (IActivity) Mockito.mock(IActivity.class);
				
		Mockito.when(activity.getScore()).thenReturn(6);
		Mockito.when(activity.getMaxScore()).thenReturn(6);
		Mockito.when(activity.getErrorCount()).thenReturn(1);
		
		Result expectedResult = score.calculateZeroMaxScore(pageResult, activity);

		assertEquals((int) expectedResult.score, 6);
		assertEquals((int) expectedResult.maxScore, 6);
		assertEquals((int) expectedResult.errorCount, 1);
	}
	
	@SuppressWarnings("static-access")
	@Test
	public void calculateZeroMaxScoreWhenModuleScoreIsNotMax() {
		Score score = new Score();
		Result pageResult = new Result();

		IActivity activity = (IActivity) Mockito.mock(IActivity.class);
				
		Mockito.when(activity.getScore()).thenReturn(3);
		Mockito.when(activity.getMaxScore()).thenReturn(6);
		Mockito.when(activity.getErrorCount()).thenReturn(1);
		
		Result expectedResult = score.calculateZeroMaxScore(pageResult, activity);

		assertEquals((int) expectedResult.score, 0);
		assertEquals((int) expectedResult.maxScore, 6); 
		assertEquals((int) expectedResult.errorCount, 1);
	}
	
	@SuppressWarnings("static-access")
	@Test
	public void calculateGraduallyToMaxScore() {
		Score score = new Score();
		Result pageResult = new Result();

		IActivity activity = (IActivity) Mockito.mock(IActivity.class);
				
		Mockito.when(activity.getScore()).thenReturn(4);
		Mockito.when(activity.getMaxScore()).thenReturn(6);
		Mockito.when(activity.getErrorCount()).thenReturn(1);
		
		Result expectedResult = score.calculateGraduallyScore(pageResult, activity);

		assertEquals((int) expectedResult.score, 4);
		assertEquals((int) expectedResult.maxScore, 6);
		assertEquals((int) expectedResult.errorCount, 1);
	}
	
	@SuppressWarnings("static-access")
	@Test
	public void calculateDefaultScoreForPercentagePage() {
		Score score = new Score();
		Result pageResult = new Result();

		IActivity activity = (IActivity) Mockito.mock(IActivity.class);
				
		Mockito.when(activity.getScore()).thenReturn(4);
		Mockito.when(activity.getMaxScore()).thenReturn(6);
		Mockito.when(activity.getErrorCount()).thenReturn(1);
		
		Result expectedResult = score.calculateDefaultScore(pageResult, activity, ScoringType.percentage);

		assertEquals((int) expectedResult.score, 4);
		assertEquals((int) expectedResult.maxScore, 6);
		assertEquals((int) expectedResult.errorCount, 1);
	}
	
	@SuppressWarnings("static-access")
	@Test
	public void calculateDefaultScoreForZeroOnePageWhenGroupScoreIsMax() {
		Score score = new Score();
		Result pageResult = new Result();

		IActivity activity = (IActivity) Mockito.mock(IActivity.class);
				
		Mockito.when(activity.getScore()).thenReturn(6);
		Mockito.when(activity.getMaxScore()).thenReturn(6);
		Mockito.when(activity.getErrorCount()).thenReturn(0);
		
		Result expectedResult = score.calculateDefaultScore(pageResult, activity, ScoringType.zeroOne);

		assertEquals((int) expectedResult.score, 6);
		assertEquals((int) expectedResult.maxScore, 6);
		assertEquals((int) expectedResult.errorCount, 0);
	}
	
	@SuppressWarnings("static-access")
	@Test
	public void calculateDefaultScoreForZeroOnePageWhenGroupScoreIsNotMax() {
		Score score = new Score();
		Result pageResult = new Result();

		IActivity activity = (IActivity) Mockito.mock(IActivity.class);
				
		Mockito.when(activity.getScore()).thenReturn(3);
		Mockito.when(activity.getMaxScore()).thenReturn(6);
		Mockito.when(activity.getErrorCount()).thenReturn(0);
		
		Result expectedResult = score.calculateDefaultScore(pageResult, activity, ScoringType.zeroOne);

		assertEquals((int) expectedResult.score, 0);
		assertEquals((int) expectedResult.maxScore, 6); 
		assertEquals((int) expectedResult.errorCount, 0);
	}
	
	@SuppressWarnings("static-access")
	@Test
	public void calculateDefaultScoreForMinusErrorsPageWhenThereAreErrors() {
		Score score = new Score();
		Result pageResult = new Result();

		IActivity activity = (IActivity) Mockito.mock(IActivity.class);
				
		Mockito.when(activity.getScore()).thenReturn(5);
		Mockito.when(activity.getMaxScore()).thenReturn(6);
		Mockito.when(activity.getErrorCount()).thenReturn(2);
		
		Result expectedResult = score.calculateDefaultScore(pageResult, activity, ScoringType.minusErrors);

		assertEquals((int) expectedResult.score, 3); // score - errors = 3
		assertEquals((int) expectedResult.maxScore, 6); 
		assertEquals((int) expectedResult.errorCount, 2);
	}
	
	@SuppressWarnings("static-access")
	@Test
	public void calculateDefaultScoreForMinusErrorsPageWhenThereArentErrors() {
		Score score = new Score();
		Result pageResult = new Result();

		IActivity activity = (IActivity) Mockito.mock(IActivity.class);
				
		Mockito.when(activity.getScore()).thenReturn(5);
		Mockito.when(activity.getMaxScore()).thenReturn(6);
		Mockito.when(activity.getErrorCount()).thenReturn(0);
		
		Result expectedResult = score.calculateDefaultScore(pageResult, activity, ScoringType.minusErrors);

		assertEquals((int) expectedResult.score, 5);
		assertEquals((int) expectedResult.maxScore, 6); 
		assertEquals((int) expectedResult.errorCount, 0);
	}
	
	@Test
	public void calculateScoreForGroupWithMinusError() {
		Result result = new Result();
		result.errorCount = 2;
		result.maxScore = 4;
		result.score = 3;
		
		IActivity activity = (IActivity) Mockito.mock(IActivity.class);
		
		Mockito.when(activity.getScore()).thenReturn(6);
		Mockito.when(activity.getMaxScore()).thenReturn(6);
		Mockito.when(activity.getErrorCount()).thenReturn(1);
		
		result = Score.calculateMinusScoreForGroup(result, activity);
		
		assertEquals(8, (int)result.score);
		assertEquals(10, (int)result.maxScore);
		assertEquals(3, (int)result.errorCount);
		
	}
	
	@Test
	public void updateMinusErrorForGroupReturnsValueEqualsOrAbove0() {
		Result groupResult = new Result();
		groupResult.errorCount = 15;
		groupResult.score = -12;
		groupResult.maxScore = 18;
		
		Result output = new Result();
		
		Score.updateMinusErrorsGroupResult(output, groupResult);
		
		assertEquals(0, (int)output.score);
		assertEquals(15, (int)output.errorCount);
		assertEquals(18, (int)output.maxScore);
	}
	
	@Test
	public void updateMinusErrorFourGroupCorrectlyAddValues () {
		Result groupResult = new Result();
		groupResult.errorCount = 2;
		groupResult.score = 2;
		groupResult.maxScore = 4;
		
		Result output = new Result();
		output.errorCount = 2;
		output.score = 4;
		output.maxScore = 6;
		
		Score.updateMinusErrorsGroupResult(output, groupResult);
		
		assertEquals(6, (int)output.score);
		assertEquals(4, (int)output.errorCount);
		assertEquals(10, (int)output.maxScore);		
	}
}
