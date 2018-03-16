package com.lorepo.icplayer.client.page;

import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.Page.ScoringType;
import com.lorepo.icplayer.client.module.api.IActivity;

public class Score {

	public static class Result {
		float score = 0;
		float maxScore = 0;
		int errorCount = 0;
	}

	public static Result updateDefaultGroupResult(Result result, Result groupResult) {
		result.score += groupResult.score;
		result.maxScore += groupResult.maxScore;
		result.errorCount += groupResult.errorCount;

		return result;
	}

	public static Result updateZeroMaxGroupResult(Result result, Result groupResult, int groupMaxScore) {
		// if total modules score is greater or equals to max score group
		int multipliedScore = (int) Math.floor(groupResult.score * (groupMaxScore / groupResult.maxScore));

		if (multipliedScore == groupMaxScore) {
			result.score += multipliedScore;
		}

		result.maxScore += groupMaxScore;
		result.errorCount += groupResult.errorCount;

		return result;
	}

	public static Result updateGraduallyToMaxGroupResult(Result result, Result groupResult, int groupMaxScore) {
		result.score += Math.floor(groupResult.score * (groupMaxScore / groupResult.maxScore));
		result.maxScore += groupMaxScore;
		result.errorCount += groupResult.errorCount;

		return result;
	}
	
	public static Result updateMinusErrorsGroupResult(Result result, Result groupResult) {
		result.score += Math.max(groupResult.score, 0);
		result.maxScore += groupResult.maxScore;
		result.errorCount += groupResult.errorCount;
		
		return result;
	}

	// Calculate default group score in depending of its type.
	public static Result calculateDefaultScore(Result result, IActivity activity, ScoringType type) {
		if (type == Page.ScoringType.percentage) {
			result = Score.calculatePercentageScore(result, activity);
		} else if(type == Page.ScoringType.zeroOne) {
			result = Score.calculateZeroOneScore(result, activity);
		} else if (type == Page.ScoringType.minusErrors) {
			result = Score.calculateMinusScore(result, activity);
		}

		return result;
	}

	public static Result calculateZeroMaxScore(Result result, IActivity activity) {
		if(activity.getScore() == activity.getMaxScore()){
			result.score += activity.getScore();
		}
		result.maxScore += activity.getMaxScore();
		result.errorCount += activity.getErrorCount();

		return result;
	}

	public static Result calculateGraduallyScore(Result result, IActivity activity) {
		result.score += activity.getScore();
		result.maxScore += activity.getMaxScore();
		result.errorCount += activity.getErrorCount();

		return result;
	}


	/**
	 * Standard percentage score method
	 */
	public static Result calculatePercentageScore(Result result, IActivity activity) {
		result.score += activity.getScore();
		result.maxScore += activity.getMaxScore();
		result.errorCount += activity.getErrorCount();

		return result;
	}


	/**
	 * Zero - One score method. Activit has 0 or 100%
	 */
	public static Result calculateZeroOneScore(Result result, IActivity activity) {
		if(activity.getScore() == activity.getMaxScore() && activity.getErrorCount() == 0){
			result.score += activity.getScore();
		}
		result.maxScore += activity.getMaxScore();
		result.errorCount += activity.getErrorCount();

		return result;
	}


	/**
	 * Standard percentage minus errors
	 */
	public static Result calculateMinusScore(Result result, IActivity activity) {
		result.score += Math.max(activity.getScore() - activity.getErrorCount(), 0);
		result.maxScore += activity.getMaxScore();
		result.errorCount += activity.getErrorCount();

		return result;
	}
	
	public static Result calculateMinusScoreForGroup(Result result, IActivity activity) {
		result.score += activity.getScore() - activity.getErrorCount();
		result.maxScore += activity.getMaxScore();
		result.errorCount += activity.getErrorCount();

		return result;		
	}

}
