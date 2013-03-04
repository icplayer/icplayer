package com.lorepo.icplayer.client.content.services;

import java.util.HashMap;

import com.lorepo.icf.utils.JSONUtils;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.api.player.PageScore;

public class ScoreService implements IScoreService {

	private HashMap<String, Integer>	scores;
	private HashMap<String, PageScore>	pageScores;

	
	public ScoreService(){

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
		
		return total/pageScores.size();
	}

	@Override
	public void setScore(String moduleName, int score, int maxScore) {

		Integer scoreObj = new Integer(score);
		
		scores.put(moduleName, scoreObj);
	}


	@Override
	public PageScore getPageScore(String pageName) {
		
		PageScore pageScore = pageScores.get(pageName);
		
		if(pageScore == null){
			pageScore = new PageScore(pageName);
			pageScores.put(pageName, pageScore);
		}
		
		return pageScore;
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
			pageScore = new PageScore(pageName);
			pageScore.loadFromString(data.get(pageName));
			pageScores.put(pageName, pageScore);
		}
	}
}
