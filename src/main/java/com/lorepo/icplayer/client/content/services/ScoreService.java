package com.lorepo.icplayer.client.content.services;

import java.util.HashMap;

import com.lorepo.icf.utils.JSONUtils;
import com.lorepo.icplayer.client.model.Content.ScoreType;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.api.player.PageScore;

public class ScoreService implements IScoreService {

	private HashMap<String, Integer>	scores;
	// Helper field for mapping page name to its ID (backwards compatibility)
	private HashMap<String, String>	pagesNamesToIds;
	private HashMap<String, PageScore>	pageScores;
	private final boolean useLast;
	private ScoreType scoreType;
	private IPlayerServices playerServices;
	
	public ScoreService(ScoreType scoreType){
		this.scoreType = scoreType;
		this.useLast = scoreType == ScoreType.last;
		scores = new HashMap<String, Integer>();
		pagesNamesToIds = new HashMap<String, String>();
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
		ScoreType scoreType = getScoreType();
		
		if (scoreType.equals(ScoreType.last)) {
			playerServices.getCommands().updateCurrentPageScore(false);
		}
		
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
			score = new PageScore();
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
		PageScore pageScore = pageScores.get(page.getId());

		if (getScoreType().equals(ScoreType.last) || pageScore == null) {
			pageScores.put(page.getId(), score);
			pagesNamesToIds.put(page.getName(), page.getId());
		}
	}

	public boolean useLast() {
		return useLast;
	}

	public ScoreType getScoreType() {
		return scoreType;
	}
	
	public PageScore getPageScoreByName(String pageName) {
		String pageId = pagesNamesToIds.get(pageName);
		
		return getPageScoreById(pageId);
	}

	@Override
	public PageScore getPageScoreById(String pageId) {
		if (scoreType.equals(ScoreType.last)) {
			playerServices.getCommands().updateCurrentPageScore(false);
		}

		PageScore score = pageScores.get(pageId);

		if (score == null) {
			score = new PageScore();
		}

		return score;
	}


	public void setPlayerService(IPlayerServices playerServices) {
		this.playerServices = playerServices;	
	}
}
