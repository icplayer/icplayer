package com.lorepo.icplayer.client.module;

public interface IWCAGPresenter {
	IWCAG getWCAGController();	// Return element which will be manage actions
	void selectAsActive(String className);	// Add class name to module
	void deselectAsActive(String className); // Remove class name from module
	boolean isSelectable(boolean isTextToSpeechOn); // If module is not selectable (for example: module is not visible, text don't have gaps) then return false and this module wont be selected by controller

	/*
	 * If module can be selectable in keyboard navigation mode (when isTextToSpeechOn set to false),
	 * then this method should return true. Returned value is one of the conditions for the possibility
	 * of selection by keyboard navigation. This method should be checked in isSelectable method.
	 */
	boolean haveStandaloneKeyboardNavigationSupport();
}
