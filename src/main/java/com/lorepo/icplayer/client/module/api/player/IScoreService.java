package com.lorepo.icplayer.client.module.api.player;


public interface IScoreService {

	public int getScore(String moduleName);
	public PageScore getPageScore(String pageName);
	public void	setScore(String moduleName, int score, int maxScore);
	int getTotalMaxScore();
	int getTotalScore();
	String getAsString();
	void loadFromString(String state);
	void setPageScore(PageScore score);
}
