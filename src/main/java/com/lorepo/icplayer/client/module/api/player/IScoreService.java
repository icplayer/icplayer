package com.lorepo.icplayer.client.module.api.player;

import com.lorepo.icplayer.client.model.Content.ScoreType;


public interface IScoreService {

	public int getScore(String moduleName);
	public PageScore getPageScore(String pageName);
	public PageScore getPageScoreById(String pageId);
	public PageScore getPageScoreByName(String pageName);
	public void	setScore(String moduleName, int score, int maxScore);
	int getTotalMaxScore();
	int getTotalScore();
	String getAsString();
	void loadFromString(String state);
	void setPageScore(IPage page, PageScore score);
	public ScoreType getScoreType();
	void lessonScoreReset(boolean resetChecks, boolean resetMistakes);
}
