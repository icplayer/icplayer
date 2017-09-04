package com.lorepo.icplayer.client.module;

public interface IWCAGPresenter {
	IWCAG getWCAGController();	// Return element which will be manage actions
	void selectAsActive(String className);	// Add class name to module
	void deselectAsActive(String className); // Remove class name from module
	boolean isSelectable(); // If module is not selectable (for example: module is not visible, text don't have gaps) then return false and this module wont be selected by controller
}
