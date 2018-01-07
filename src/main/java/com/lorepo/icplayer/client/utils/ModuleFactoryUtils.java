package com.lorepo.icplayer.client.utils;

import com.lorepo.icplayer.client.module.api.IModuleModel;

public class ModuleFactoryUtils {
	// Backward compatibility checkButton Modules with older checkAnswers Buttons
	public static boolean isCheckAnswersButton(IModuleModel module) {

		if(module.getButtonType() != null && module.getButtonType().equals("checkAnswers")) {
			return true;
		}

		return false;
	}
}