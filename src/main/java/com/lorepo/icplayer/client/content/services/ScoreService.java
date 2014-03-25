package com.lorepo.icplayer.client.content.services;

import java.util.HashMap;

import com.lorepo.icf.utils.JSONUtils;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.api.player.PageScore;

public class ScoreService implements IScoreService {

	private HashMap<String, Integer>	scores;
	private HashMap<String, PageScore>	pageScores;
	private final boolean useLast;

	
	public ScoreService(boolean useLast){

		this.useLast = useLast;
		scores = new HashMap<String, Integer>();
		pageScores = new HashMap<String, PageScore>();
	}
	
	
	@Override
	public int getScore(String moduleName) {

		Integer scoreObj = scores.get(moduleName);
		if(scoreObj != null){
			return scoreObj.intValue();
		}
		return 0;
	}


	@Override
	public int getTotalMaxScore() {

		int max = 0;
		for(PageScore scoreObj : pageScores.values()){
			max += scoreObj.getMaxScore();
		}
		
		return max;
	}

	@Override
	public int getTotalScore() {

		int total = 0;
		for(PageScore scoreObj : pageScores.values()){
			total += scoreObj.getScore();
		}
		
		return total;
	}
	
	@Override
	public int getTotalPercentage() {

		int total = 0;
		for(PageScore scoreObj : pageScores.values()){
			total += scoreObj.getPercentageScore();
		}
		
		if(pageScores.size() > 0){
			return total/pageScores.size();
		}
		
		return 0;
	}

	@Override
	public void setScore(String moduleName, int score, int maxScore) {

		Integer scoreObj = new Integer(score);
		
		scores.put(moduleName, scoreObj);
	}


	@Override
	public PageScore getPageScore(String pageName) {
		
		PageScore score = pageScores.get(pageName);
		if(score == null){
			score = new PageScore(pageName);
		}
		
		return score;
	}

	@Override
	public String getAsString(){
		HashMap<String, String> data = new HashMap<String, String>();
		for(PageScore score : pageScores.values()){
			data.put(score.getPageName(), score.getAsString());
		}
		return JSONUtils.toJSONString(data);
	}

	@Override
	public void loadFromString(String state){
		HashMap<String, String> data = JSONUtils.decodeHashMap(state);
		for(String pageName : data.keySet()){
			PageScore pageScore = pageScores.get(pageName);
			pageScore = PageScore.loadFromString(pageName, data.get(pageName));
			pageScores.put(pageName, pageScore);
		}
	}


	@Override
	public void setPageScore(PageScore score) {
		if(useLast || pageScores.get(score.getPageName()) == null){
			pageScores.put(score.getPageName(), score);
		}
	}


	public boolean useLast() {
		return useLast;
	}
}
