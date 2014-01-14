package com.lorepo.icplayer.client.page;

import java.util.List;

import com.lorepo.icplayer.client.module.api.IActivity;
import com.lorepo.icplayer.client.module.api.IPresenter;

public class Score {
	
	public static class Result{
		float score = 0;
		float maxScore = 0;
		int errorCount = 0;		
	}

	/**
	 * Standard percentage score method
	 */
	public static Result calculatePercentageScore(List<IPresenter> presenters) {

		Result result = new Result();
		
		for(IPresenter presenter : presenters){
			if(presenter instanceof IActivity){
				IActivity activity = (IActivity) presenter;
				result.score += activity.getScore();
				result.maxScore += activity.getMaxScore();
				result.errorCount += activity.getErrorCount();
			}
		}
		
		return result;
	}

	
	/**
	 * Zero - One score method. Activit has 0 or 100%
	 */
	public static Result calculateZeroOneScore(List<IPresenter> presenters) {

		Result result = new Result();
		
		for(IPresenter presenter : presenters){
			if(presenter instanceof IActivity){
				IActivity activity = (IActivity) presenter;
				if(activity.getScore() == activity.getMaxScore()){
					result.score += activity.getScore();
				}
				result.maxScore += activity.getMaxScore();
				result.errorCount += activity.getErrorCount();
			}
		}
		
		return result;
	}
	

	/**
	 * Standard percentage minus errors
	 */
	public static Result calculateMinusScore(List<IPresenter> presenters) {

		Result result = new Result();
		
		for(IPresenter presenter : presenters){
			if(presenter instanceof IActivity){
				IActivity activity = (IActivity) presenter;
				result.score += Math.max(activity.getScore()-activity.getErrorCount(), 0);
				result.maxScore += activity.getMaxScore();
				result.errorCount += activity.getErrorCount();
			}
		}
		
		return result;
	}
	
}
