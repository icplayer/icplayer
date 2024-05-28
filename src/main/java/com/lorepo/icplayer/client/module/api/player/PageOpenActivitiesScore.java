package com.lorepo.icplayer.client.module.api.player;

import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;


/**
 * Contains information about page's modules with open activities scores
 */
public class PageOpenActivitiesScore {
	
	public static class ScoreInfo {
		Integer aiGradedScore;
		Integer manualGradedScore;
		Integer maxScore;
		
		public ScoreInfo(Integer aiGradedScore, Integer manualGradedScore, Integer maxScore) {
			this.manualGradedScore = manualGradedScore;
			this.aiGradedScore = aiGradedScore;
			this.maxScore = maxScore;
		}
		
		public ScoreInfo(Integer aiGradedScore) {
			this.aiGradedScore = aiGradedScore;
		}
		
		public void setAIGradedScore(Integer aiGradedScore) {
			this.aiGradedScore = aiGradedScore;
		}
		
		public int getScore() {
			if (manualGradedScore != null) {
				return manualGradedScore;
			}
			if (aiGradedScore != null) {
				return aiGradedScore;
			}
			return 0;
		}
		
		public int getMaxScore() {
			if (maxScore != null) {
				return maxScore;
			}
			return 0;
		}
		
		public JavaScriptObject getAsJSObject() {
			return createJSObject(aiGradedScore, manualGradedScore);
		}
		
		private native JavaScriptObject createJSObject(Integer aiGradedScore, Integer manualGradedScore) /*-{
			return {
				"aiGradedScore": aiGradedScore,
				"manualGradedScore": manualGradedScore
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
	
	public void addScore(String moduleID, Integer aiGradedScore, Integer manualGradedScore, Integer maxScore) {
		scores.put(moduleID, new ScoreInfo(aiGradedScore, manualGradedScore, maxScore));
	}
	
	public boolean hasScore(String moduleID) {
		return scores.containsKey(moduleID);
	}
	
	public int getScore(){
		int result = 0;
		for (ScoreInfo scoreInfo : scores.values()) {
			result += scoreInfo.getScore();
		}
		return result;
	}
	
	public int getMaxScore(){
		int result = 0;
		for (ScoreInfo scoreInfo : scores.values()) {
			result += scoreInfo.getMaxScore();
		}
		return result;
	}
	
	public void setModuleAIGradedScore(String moduleID, Integer aiGradedScore, Integer maxScore) {
		ScoreInfo scoreInfo = scores.get(moduleID);
		if (scoreInfo != null) {
			scoreInfo.setAIGradedScore(aiGradedScore);
		} else {
			addScore(moduleID, aiGradedScore, null, maxScore);
		}
	}
}
