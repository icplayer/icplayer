package com.lorepo.icplayer.client.module.api.player;

import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;
import com.lorepo.icf.utils.JavaScriptUtils;


/**
 * Contains information about page's modules with open activities scores
 */
public class PageOpenActivitiesScore {
	
	public static class ScoreInfo {
		int aiGradedScore = -1;
		int manualGradedScore = -1;
		int maxScore = -1;
		
		public ScoreInfo(int aiGradedScore, int manualGradedScore, int maxScore) {
			this.manualGradedScore = manualGradedScore;
			this.aiGradedScore = aiGradedScore;
			this.maxScore = maxScore;
		}
		
		public ScoreInfo(int aiGradedScore) {
			this.aiGradedScore = aiGradedScore;
		}

		public ScoreInfo() {}
		
		public void setAIGradedScore(int aiGradedScore) {
			this.aiGradedScore = aiGradedScore;
		}
		
		public int getScore() {
			JavaScriptUtils.log("MODULE");
			JavaScriptUtils.log(manualGradedScore);
			JavaScriptUtils.log(aiGradedScore);
			JavaScriptUtils.log("---MODULE---");
			if (manualGradedScore != -1) {
				return manualGradedScore;
			}
			if (aiGradedScore != -1) {
				return aiGradedScore;
			}
			return 0;
		}
		
		public int getMaxScore() {
			if (maxScore != -1) {
				return maxScore;
			}
			return 0;
		}
		
		public JavaScriptObject getAsJSObject() {
			return createJSObject(aiGradedScore, manualGradedScore);
		}
		
		private native JavaScriptObject createJSObject(int aiGradedScore, int manualGradedScore) /*-{
			return {
				"aiGradedScore": aiGradedScore === -1 ? null : aiGradedScore,
				"manualGradedScore": manualGradedScore === -1 ? null : manualGradedScore
			}
		}-*/;
	}
	
	private HashMap<String, ScoreInfo> scores;
	
	public PageOpenActivitiesScore() {
		this.scores = new HashMap<String, ScoreInfo>();
	}
	
	public ScoreInfo get(String moduleID) {
		return scores.get(moduleID);
	}
	
	public void addScore(String moduleID, int aiGradedScore, int manualGradedScore, int maxScore) {
		scores.put(moduleID, new ScoreInfo(aiGradedScore, manualGradedScore, maxScore));
	}
	
	public boolean hasScore(String moduleID) {
		return scores.containsKey(moduleID);
	}
	
	public int getScore(){
		int result = 0;
		JavaScriptUtils.log("START CALCULATING FOR PAGE");
		for (ScoreInfo scoreInfo : scores.values()) {
		    int score = scoreInfo.getScore();
			result += score;
			JavaScriptUtils.log("RESULT");
			JavaScriptUtils.log(score);
			JavaScriptUtils.log("---RESULT---");
		}
		JavaScriptUtils.log("STOP CALCULATING FOR PAGE");
		JavaScriptUtils.log(result);
		return result;
	}
	
	public int getMaxScore(){
		int result = 0;
		for (ScoreInfo scoreInfo : scores.values()) {
			result += scoreInfo.getMaxScore();
		}
		return result;
	}
	
	public void setModuleAIGradedScore(String moduleID, int aiGradedScore, int maxScore) {
		ScoreInfo scoreInfo = scores.get(moduleID);
		if (scoreInfo != null) {
			scoreInfo.setAIGradedScore(aiGradedScore);
		} else {
			addScore(moduleID, aiGradedScore, -1, maxScore);
		}
	}
}