package com.lorepo_patchers.icplayer.client;

import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icplayer.client.PlayerController;

@PatchClass(PlayerController.class)
public class PlayerControllerPatcher {
	@PatchMethod
	public static int getIFrameScroll (PlayerController a, PlayerController x) {
		return 0;
	}

	@PatchMethod
	public static int handleCurrentPageIdRequest (PlayerController a, PlayerController x) {
		return 0;
	}
	
	@PatchMethod
	private static boolean checkIsPlayerInCrossDomain(PlayerController a) {
		return false;
	}
}
