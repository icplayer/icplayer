package com.lorepo.icplayer.client.content.services;

import java.util.HashMap;
import java.util.Map;

import com.lorepo.icf.utils.JSONUtils;
import com.lorepo.icplayer.client.model.Content.ScoreType;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.IScoreService;
import com.lorepo.icplayer.client.module.api.player.PageScore;
import com.lorepo.icplayer.client.module.api.player.PageOpenActivitiesScore;
import com.lorepo.icplayer.client.module.api.player.PageOpenActivitiesScore.ScoreInfo;

public class ScoreService implements IScoreService {

	private final HashMap<String, Integer>	scores;
	// Helper field for mapping page name to its ID (backwards compatibility)
	private final HashMap<String, String>	pagesNamesToIds;
	private final HashMap<String, PageScore>	pageScores;
	private HashMap<String, PageOpenActivitiesScore> pagesOpenActivitiesScores;
	private final boolean useLast;
	private final ScoreType scoreType;
	private IPlayerServices playerServices;

	public ScoreService(ScoreType scoreType){
		this.scoreType = scoreType;
		this.useLast = scoreType == ScoreType.last;
		scores = new HashMap<String, Integer>();
		pagesNamesToIds = new HashMap<String, String>();
		pageScores = new HashMap<String, PageScore>();
		pagesOpenActivitiesScores = new HashMap<String, PageOpenActivitiesScore>();
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
		for (PageScore scoreObj : pageScores.values()){
			max += scoreObj.getMaxScore() * scoreObj.getWeight();
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
		for (Map.Entry<String, PageScore> scoreEntry : pageScores.entrySet()) {
			String pageID = scoreEntry.getKey();
			PageScore pageScore = scoreEntry.getValue();
			PageScore updatedPageScore = updatePageScoreWithOpenActivitiesScore(pageScore, pageID);
			total += updatedPageScore.getScore() * updatedPageScore.getWeight();
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

		PageScore updatedPageScore = updatePageScoreWithOpenActivitiesScore(score, pageId);
		return updatedPageScore;
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
		score.setWeight(page.getPageWeight());
		PageScore pageScore = pageScores.get(page.getId());

		if (getScoreType().equals(ScoreType.last) || pageScore == null) {
			pageScores.put(page.getId(), score);
			pagesNamesToIds.put(page.getName(), page.getId());
		}
	}

	public boolean useLast() {
		return useLast;
	}

	@Override
	public ScoreType getScoreType() {
		return scoreType;
	}

	@Override
	public PageScore getPageScoreByName(String pageName) {
		if (scoreType.equals(ScoreType.last)) {
			playerServices.getCommands().updateCurrentPageScore(false);
		}

		return getPageScoreById(pagesNamesToIds.get(pageName));
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
		PageScore updatedPageScore = updatePageScoreWithOpenActivitiesScore(score, pageId);

		return updatedPageScore;
	}

	@Override
	public PageScore getPageScoreWithoutOpenActivitiesById(String pageID) {
		if (scoreType.equals(ScoreType.last)) {
			playerServices.getCommands().updateCurrentPageScore(false);
		}

		PageScore score = pageScores.get(pageID);

		if (score == null) {
			score = new PageScore();
		}

		return score;
	}

	public void setPlayerService(IPlayerServices playerServices) {
		this.playerServices = playerServices;
	}

	@Override
	public void lessonScoreReset(boolean resetChecks, boolean resetMistakes) {
		for (int i=0; i<playerServices.getModel().getPageCount(); i++) {
			IPage currentPage = playerServices.getModel().getPage(i);
			if (currentPage.isReportable()) {
				PageScore pageScore = playerServices.getScoreService().getPageScore(currentPage.getId());
				if (pageScore.hasScore()) {
					PageScore score;

					if (resetChecks && !resetMistakes) {
						score = pageScore.resetScoreAndChecks();
					}else if (!resetChecks && resetMistakes) {
						score = pageScore.resetScoreAndMistakes();
					}else if (resetChecks && resetMistakes){
						score = pageScore.resetAllScores();
					}else {
						score = pageScore.reset();
					}

					playerServices.getScoreService().setPageScore(currentPage, score);
				}
			}
		}
	}

	@Override
	public void setOpenActivitiesScores(HashMap<String, PageOpenActivitiesScore> scores) {
		this.pagesOpenActivitiesScores = scores;
	}

	@Override
	public ScoreInfo getOpenActivityScores(String pageID, String moduleID) {
		PageOpenActivitiesScore pageScore = pagesOpenActivitiesScores.get(pageID);
		if (pageScore == null) {
			return new ScoreInfo();
		}
		ScoreInfo scoreInfo = pageScore.get(moduleID);
		if (scoreInfo == null) {
			return new ScoreInfo();
		}
		return scoreInfo;
	}

	@Override
	public void updateOpenActivityScore(String pageID, String moduleID, String aiGrade, String aiRelevance) {
		int parsedAIGradedScore = Integer.parseInt(aiGrade);
		float parsedAIRelevance = Float.parseFloat(aiRelevance);
		
		PageOpenActivitiesScore pageScore = pagesOpenActivitiesScores.get(pageID);
		if (pageScore == null) {
			PageOpenActivitiesScore newPageScore = new PageOpenActivitiesScore();
			
			newPageScore.addScore(moduleID, parsedAIGradedScore, null, null, parsedAIRelevance);
			pagesOpenActivitiesScores.put(pageID, newPageScore);
			sendValueChangedEvent(moduleID);
			
			return;
		}
		
		ScoreInfo scoreInfo = pageScore.get(moduleID);
		if (scoreInfo == null) {
			pageScore.addScore(moduleID, parsedAIGradedScore, null, null, parsedAIRelevance);
			sendValueChangedEvent(moduleID);
			
			return;
		}
		
		pageScore.setAIData(moduleID, parsedAIGradedScore, parsedAIRelevance);
		sendValueChangedEvent(moduleID);
	}
	
	private void sendValueChangedEvent(String moduleID) {
		playerServices.getEventBusService().sendValueChangedEvent("", moduleID, "", "updateScore", "");
	}
	
	private PageScore updatePageScoreWithOpenActivitiesScore(PageScore pageScore, String pageID) {
		PageOpenActivitiesScore pageActivityScore = pagesOpenActivitiesScores.get(pageID);
		IPage page = playerServices.getModel().getPageById(pageID);
		if (pageActivityScore == null || page == null || !page.isReportable() || pageScore.getMaxScore() == 0) {
			return pageScore;
		}
		return pageScore.updateScoreWithOpenActivityScore(pageActivityScore.getScore());
	}

}
