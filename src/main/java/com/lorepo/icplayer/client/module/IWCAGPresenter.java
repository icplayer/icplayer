package com.lorepo.icplayer.client.module;

public interface IWCAGPresenter {
	IWCAG getWCAGController();
	void selectAsActive(String className);
	void deselectAsActive(String className);
	boolean isSelectable();
}
