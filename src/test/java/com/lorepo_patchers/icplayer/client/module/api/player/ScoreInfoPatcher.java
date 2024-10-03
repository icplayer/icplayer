package com.lorepo_patchers.icplayer.client.module.api.player;

import org.mockito.Mockito;

import com.google.gwt.core.client.JavaScriptObject;
import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;

import com.lorepo.icplayer.client.module.api.player.PageOpenActivitiesScore.ScoreInfo;

@PatchClass(ScoreInfo.class)
public class ScoreInfoPatcher {
	
	@PatchMethod
	private static JavaScriptObject	createJSObject(int aiGradedScore, int manualGradedScore, float aiRelevance) {
		return Mockito.mock(JavaScriptObject.class);
	}
}
