package com.lorepo.icplayer.client.module.api.player;

import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;


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

	public void setAIGradedScore(String moduleID, int aiGradedScore) {
		ScoreInfo score = get(moduleID);
		score.aiGradedScore = aiGradedScore;
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
	
	public void setModuleAIGradedScore(String moduleID, int aiGradedScore, int maxScore) {
		ScoreInfo scoreInfo = scores.get(moduleID);
		if (scoreInfo != null) {
			scoreInfo.setAIGradedScore(aiGradedScore);
		} else {
			addScore(moduleID, aiGradedScore, -1, maxScore);
		}
	}
}
