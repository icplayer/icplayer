package com.lorepo.icplayer.client.content.services;

import java.util.HashMap;

import com.lorepo.icf.utils.JSONUtils;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.api.player.PageScore;

public class ScoreService implements IScoreService {

	private HashMap<String, Integer>	scores;
	private HashMap<String, PageScore>	pageScoresByName;
	private HashMap<String, PageScore>	pageScores;
	private final boolean useLast;

	
	public ScoreService(boolean useLast){

		this.useLast = useLast;
		scores = new HashMap<String, Integer>();
		pageScoresByName = new HashMap<String, PageScore>();
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
	public void setScore(String moduleName, int score, int maxScore) {
		Integer scoreObj = new Integer(score);
		scores.put(moduleName, scoreObj);
	}


	@Override
	public PageScore getPageScore(String pageId) {
		
		PageScore score = pageScores.get(pageId);
		if(score == null){
			score = pageScoresByName.get(pageId);
			if(score == null){
				score = new PageScore();
			}
		}
		
		assert(score != null);
		return score;
	}

	@Override
	public String getAsString(){
		HashMap<String, String> data = new HashMap<String, String>();
		for(String name : pageScores.keySet()){
			PageScore score = pageScores.get(name);
			data.put(name, score.getAsString());
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
	public void setPageScore(IPage page, PageScore score) {
		if(useLast || pageScores.get(page.getId()) == null){
			pageScores.put(page.getId(), score);
			pageScoresByName.put(page.getName(), score);
		}
	}


	public boolean useLast() {
		return useLast;
	}


	@Override
	public PageScore getPageScoreById(String pageId) {
		
		PageScore score = pageScores.get(pageId);
		if(score == null){
			score = new PageScore();
		}

		return score;
	}
}
