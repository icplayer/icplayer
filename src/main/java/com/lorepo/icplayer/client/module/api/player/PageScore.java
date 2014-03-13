package com.lorepo.icplayer.client.module.api.player;

import java.util.HashMap;

import com.lorepo.icf.utils.JSONUtils;


/**
 * Informacja o wyniku strony
 * @author Krzysztof Langner
 *
 */
public class PageScore {

	private String 	pageName;
	private float	score;
	private float	maxScore;
	private int		checkCount;
	private int		errorCount;
	private int 	mistakeCount;
	
	
	
	public PageScore(String pageName){
		this.pageName = pageName;
		score = 0;
		maxScore = 1;
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
		else{
			return 100;
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


	public void setScore(float score) {

		this.score = score;
	}


	public void setMaxScore(float max) {
		this.maxScore = max;
	}


	public void setErrorCount(int count) {
		this.errorCount = count;
	}
	
	public void incrementCheckCount(){
		checkCount ++;
	}

	public void incrementMistakeCount(){
		mistakeCount += errorCount;
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


	public void loadFromString(String state) {
		HashMap<String, String> data = JSONUtils.decodeHashMap(state);
		score = Float.parseFloat(data.get("score"));
		maxScore = Float.parseFloat(data.get("maxScore"));
		checkCount = Integer.parseInt(data.get("checkCount"));
		errorCount = Integer.parseInt(data.get("errorCount"));
		mistakeCount = Integer.parseInt(data.get("mistakeCount"));
	}


	public PageScore copy() {
		PageScore copyScore = new PageScore(pageName);
		copyScore.setErrorCount(getErrorCount());
		copyScore.setMaxScore(getMaxScore());
		copyScore.setScore(getScore());
		return copyScore;
	}
}
