package com.lorepo.icplayer.client.module.api.player;

import java.util.HashMap;

import com.google.gwt.core.client.JavaScriptObject;
import com.lorepo.icplayer.client.module.api.player.PageOpenActivitiesScore;


public class OpenActivitiesScoresParser extends JavaScriptObject{

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
				this.getMaxScore(i)
			);
		}
		
		return scores;
	}

	public final native int length() /*-{
		return this.length;
	}-*/;

	public final native int getAIGradedScore(int index) /*-{
		return (this[index].ai_score !== undefined && this[index].ai_score !== null) ? this[index].ai_score : -1;
	}-*/;

	public final native int getManualGradedScore(int index) /*-{
		return (this[index].score !== undefined && this[index].score !== null) ? this[index].score : -1;
	}-*/;

	public final native int getMaxScore(int index) /*-{
		return (this[index].max_score !== undefined && this[index].max_score !== null) ? this[index].max_score : -1;
	}-*/;

	public final native String getPageID(int index) /*-{
		return this[index].page_id;
	}-*/;

	public final native String getModuleID(int index) /*-{
		return this[index].activity_id;
	}-*/;
}
