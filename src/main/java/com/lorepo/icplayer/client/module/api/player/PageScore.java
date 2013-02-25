package com.lorepo.icplayer.client.module.api.player;


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
}
