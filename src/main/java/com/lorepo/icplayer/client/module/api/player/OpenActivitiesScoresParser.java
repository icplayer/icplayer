package com.lorepo.icplayer.client.module.api.player;

import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;
import com.lorepo.icplayer.client.module.api.player.PageOpenActivitiesScore;


public class OpenActivitiesScoresParser extends JavaScriptObject {

	protected OpenActivitiesScoresParser(){}

	public static HashMap<String, PageOpenActivitiesScore> toHashMap(JavaScriptObject jsObject) {
		OpenActivitiesScoresParser parser = createParser(jsObject);
		return parser.toHashMap();
	};

	private native static OpenActivitiesScoresParser createParser(JavaScriptObject jsObject) /*-{
		return jsObject;
	}-*/;
	
	public final HashMap<String, PageOpenActivitiesScore> toHashMap(){
		PageOpenActivitiesScore score;
		HashMap<String, PageOpenActivitiesScore> scores = new HashMap<String, PageOpenActivitiesScore>();
		
		for (int i = 0; i < this.length(); i++){
			String pageID = this.getPageID(i);
			if (scores.containsKey(pageID)) {
				score = scores.get(pageID);
			} else {
				score = new PageOpenActivitiesScore();
				scores.put(pageID, score);
			}
			score.addScore(
				this.getModuleID(i),
				this.getAIGradedScore(i),
				this.getManualGradedScore(i),
				this.getMaxScore(i),
				this.getAIRelevance(i)
			);
		}
		
		return scores;
	}

	public final native int length() /*-{
		return this.length;
	}-*/;
	
	public final Integer getAIGradedScore(int index) {
		Integer aiGradedScore = _getAIGradedScore(index);
		if (aiGradedScore == -1) {
			aiGradedScore = null;
		}
		return aiGradedScore;
	}
	
	public final native int _getAIGradedScore(int index) /*-{
		return (this[index].ai_score !== undefined && this[index].ai_score !== null) ? this[index].ai_score : -1;
	}-*/;
	
	public final Float getAIRelevance(int index) {
		Float aiRelevance = _getAIRelevance(index);
		if (aiRelevance == -1.0) {
			aiRelevance = null;
		}
		return aiRelevance;
	}
	
	public final native float _getAIRelevance(int index) /*-{
		return (this[index].ai_relevance !== undefined && this[index].ai_relevance !== null) ? this[index].ai_relevance : -1.0;
	}-*/;
	
	public final Integer getManualGradedScore(int index) {
		Integer manualGradedScore = _getManualGradedScore(index);
		if (manualGradedScore == -1) {
			manualGradedScore = null;
		}
		return manualGradedScore;
	}
	
	public final native int _getManualGradedScore(int index) /*-{
		return (this[index].score !== undefined && this[index].score !== null) ? this[index].score : -1;
	}-*/;
	
	public final Integer getMaxScore(int index) {
		Integer maxScore = _getMaxScore(index);
		if (maxScore == -1) {
			maxScore = null;
		}
		return maxScore;
	}
	
	public final native int _getMaxScore(int index) /*-{
		return (this[index].max_score !== undefined && this[index].max_score !== null) ? this[index].max_score : -1;
	}-*/;

	public final native String getPageID(int index) /*-{
		return this[index].page_id;
	}-*/;

	public final native String getModuleID(int index) /*-{
		return this[index].activity_id;
	}-*/;
}
