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
	private int weight;
	private boolean hasScore = true;
	private int	openActivitiesScore;
	private boolean hasOpenActivitiesScore = false;


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
		return getScoreWithOpenActivityScore();
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

		if (maxScore > 0) {
			float summedScore = getScoreWithOpenActivityScore();
			int percentageScore = Math.round(summedScore*100/maxScore);
			if (percentageScore == 100 && summedScore != maxScore) return 99;
			if (percentageScore == 0 && summedScore != 0) return 1;
			return percentageScore;
		}

		return hasScore ? 100 : 0;
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
	
	/**
	 * @return scaled score
	 */
	public float getScaledScore() {
		return maxScore == 0 ? 0 : getScoreWithOpenActivityScore() / maxScore;
	}


	public String getAsString() {
		HashMap<String, String> data = new HashMap<String, String>();

		data.put("score", Float.toString(score));
		data.put("maxScore", Float.toString(maxScore));
		data.put("checkCount", Integer.toString(checkCount));
		data.put("errorCount", Integer.toString(errorCount));
		data.put("mistakeCount", Integer.toString(mistakeCount));
		data.put("weight", Integer.toString(weight));
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


	public PageScore incrementProvidedMistakes(int mistakes) {
		return new PageScore(score, maxScore, checkCount+1,
				errorCount, mistakeCount+mistakes);
	}
	
	public PageScore incrementCounters() {
		return new PageScore(score, maxScore, checkCount+1,
				errorCount, mistakeCount+errorCount);
	}

	public PageScore increaseMistakeCounter() {
		return new PageScore(score, maxScore, checkCount,
				errorCount, mistakeCount+1);
	}

	public PageScore incrementCheckCounter() {
		return new PageScore(score, maxScore, checkCount+1,
				errorCount, mistakeCount);
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
		return new PageScore(score, maxScore, checkCount, errorCount, mistakeCount);
	}

	public boolean hasScore(){
		return hasScore;
	}

	public void setWeight(int w) {
		this.weight = w;
	}

	public int getWeight() {
		return this.weight;
	}
	
	public PageScore updateScoreWithOpenActivityScore(int score) {
		PageScore newPageScore = new PageScore(this.score, maxScore, checkCount, errorCount, mistakeCount);
		newPageScore.setOpenActivityScore(score);
		newPageScore.setWeight(this.getWeight());
		return newPageScore;
	}
	
	protected void setOpenActivityScore(int score) {
		this.openActivitiesScore = score;
		this.hasOpenActivitiesScore = true;
		this.hasScore = true;
	}
	
	public boolean hasOpenActivitiesScore(){
		return hasOpenActivitiesScore;
	}
	
	private float getScoreWithOpenActivityScore() {
		return hasOpenActivitiesScore ? (score + (float) openActivitiesScore) : score;
	}

}
