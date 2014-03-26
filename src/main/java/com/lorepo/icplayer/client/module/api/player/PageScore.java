package com.lorepo.icplayer.client.module.api.player;

import java.util.HashMap;

import com.lorepo.icf.utils.JSONUtils;


/**
 * Contains information about page score
 */
public class PageScore {

	private final String 	pageName;
	private final float	score;
	private final float	maxScore;
	private final int	checkCount;
	private final int	errorCount;
	private final int 	mistakeCount;
	private boolean hasScore = true;
	
	
	
	public PageScore(String pageName, float score, float maxScore, int checkCount,
			int errorCount, int mistakeCount)
	{
		this.pageName = pageName;
		this.score = score;
		this.maxScore = maxScore;
		this.checkCount = checkCount;
		this.errorCount = errorCount;
		this.mistakeCount = mistakeCount;
	}

	
	public PageScore(String pageName, float score, float maxScore)
	{
		this.pageName = pageName;
		this.score = score;
		this.maxScore = maxScore;
		this.checkCount = 0;
		this.errorCount = 0;
		this.mistakeCount = 0;
	}

	
	public PageScore(String pageName) {
		this.pageName = pageName;
		this.score = 0;
		this.maxScore = 0;
		this.checkCount = 0;
		this.errorCount = 0;
		this.mistakeCount = 0;
		hasScore = false;
	}


	public String getPageName(){
		return pageName;
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
		return new PageScore(pageName, score, maxScore, checkCount, errorCount, mistakeCount);
	}


	public PageScore incrementCounters() {
		return new PageScore(pageName, score, maxScore, checkCount+1, 
				errorCount, mistakeCount+errorCount);  
	}


	public PageScore reset() {
		return new PageScore(pageName, 0, maxScore, checkCount, 0, mistakeCount);  
	}


	public PageScore updateScore(float score, float maxScore, int errorCount) {
		return new PageScore(pageName, score, maxScore, checkCount, 
				errorCount, mistakeCount);  
	}
	
	public boolean hasScore(){
		return hasScore;
	}

}
