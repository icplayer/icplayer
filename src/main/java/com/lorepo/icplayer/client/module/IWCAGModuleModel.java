package com.lorepo.icplayer.client.module;

public interface IWCAGModuleModel {
	/*
	 * This is a marker interface meant to indicate
	 * That the module associated with this model implements WCAG
	 * */

	public static final List<String> STANDALONE_KEYBOARD_NAVIGATION_NOT_SUPPORTED_MODULES = Arrays.asList(
		"Check Counter",
		"ErrorCounter",
		"Image",
		"Page Progress"
	);
}
