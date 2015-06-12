package com.lorepo.icplayer.client.module.api.player;

import java.util.HashMap;

import com.lorepo.icf.utils.JSONUtils;


/**
 * Contains information about page score
 */
public class PageScore {

	private final float	score;
	private final float	maxScore;
	private final int	checkCount;
	private final int	errorCount;
	private final int 	mistakeCount;
	private boolean hasScore = true;
	
	
	
	public PageScore(float score, float maxScore, int checkCount,
			int errorCount, int mistakeCount)
	{
		this.score = score;
		this.maxScore = maxScore;
		this.checkCount = checkCount;
		this.errorCount = errorCount;
		this.mistakeCount = mistakeCount;
	}

	
	public PageScore(float score, float maxScore)
	{
		this.score = score;
		this.maxScore = maxScore;
		this.checkCount = 0;
		this.errorCount = 0;
		this.mistakeCount = 0;
	}

	
	public PageScore() {
		this.score = 0;
		this.maxScore = 0;
		this.checkCount = 0;
		this.errorCount = 0;
		this.mistakeCount = 0;
		hasScore = false;
	}


	/**
	 * @return score
	 */
	public float getScore(){
		return score;
	}
	
	/**
	 * @return max score
	 */
	public float getMaxScore(){
		return maxScore;
	}

	/**
	 * @return percentage score
	 */
	public int getPercentageScore() {

		if(maxScore > 0){
			return (int) (score*100/maxScore);
		}
		else if(hasScore){
			return 100;
		}
		else{
			return 0;
		}
	}
	
	/**
	 * @return No of check pressed on the page
	 */
	public int getCheckCount(){
		return checkCount;
	}
	
	/**
	 * @return No of errors left on the page
	 */
	public int getErrorCount(){
		return errorCount;
	}


	public int getMistakeCount() {
		return mistakeCount;
	}


	public String getAsString() {
		HashMap<String, String> data = new HashMap<String, String>();
		
		data.put("score", Float.toString(score));
		data.put("maxScore", Float.toString(maxScore));
		data.put("checkCount", Integer.toString(checkCount));
		data.put("errorCount", Integer.toString(errorCount));
		data.put("mistakeCount", Integer.toString(mistakeCount));
		return JSONUtils.toJSONString(data);
	}


	static public PageScore loadFromString(String pageName, String state) {
		HashMap<String, String> data = JSONUtils.decodeHashMap(state);
		float score = Float.parseFloat(data.get("score"));
		float maxScore = Float.parseFloat(data.get("maxScore"));
		int checkCount = Integer.parseInt(data.get("checkCount"));
		int errorCount = Integer.parseInt(data.get("errorCount"));
		int mistakeCount = Integer.parseInt(data.get("mistakeCount"));
		return new PageScore(score, maxScore, checkCount, errorCount, mistakeCount);
	}


	public PageScore incrementCounters() {
		return new PageScore(score, maxScore, checkCount+1, 
				errorCount, mistakeCount+errorCount);  
	}


	public PageScore reset() {
		return new PageScore(0, maxScore, checkCount, 0, mistakeCount);  
	}
	
	public PageScore resetAllScores() {
		return new PageScore(0, maxScore, 0, 0, 0);
	}
	
	public PageScore resetScoreAndMistakes() {
		return new PageScore(0, maxScore, checkCount, 0, 0);
	}
	
	public PageScore resetScoreAndChecks() {
		return new PageScore(0, maxScore, 0, 0, mistakeCount);
	}

	public PageScore updateScore(float score, float maxScore, int errorCount) {
		return new PageScore(score, maxScore, checkCount, 
				errorCount, mistakeCount);  
	}
	
	public boolean hasScore(){
		return hasScore;
	}

}
