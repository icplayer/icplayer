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
	 * Standard score method
	 */
	public static Result calculateStadardScore(List<IPresenter> presenters) {

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
}
