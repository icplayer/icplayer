package com.lorepo.icplayer.client.module.api.player;



/**
 * Interface implementowany przez przez Player i podawany do modułów
 * @author Krzysztof Langner
 *
 */
public interface IPlayerCommands {

	public void checkAnswers();
	public void uncheckAnswers();
	public void reset();
	public void updateCurrentPageScore();
	public PageScore getCurrentPageScore();
	public long getTimeElapsed();

	public void	nextPage();
	public void	prevPage();
	public void	gotoPage(String name);
	public void	gotoPageIndex(int index);
	public void	gotoPageId(String pageId);
	public void showPopup(String pageName, String additinalClasses);
	public void closePopup();

	public void executeEventCode(String code);
}
