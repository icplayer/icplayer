package com.lorepo_patchers.icplayer.client.utils;

import com.googlecode.gwt.test.patchers.PatchClass;
import com.googlecode.gwt.test.patchers.PatchMethod;
import com.lorepo.icplayer.client.utils.DevicesUtils;

@PatchClass(DevicesUtils.class)
public class DevicesUtilsPatcher {
	@PatchMethod
	public static boolean isSafariMobile() {
		return false;
	}
	
	@PatchMethod
	public static boolean isMobile() {
		return false;
	}
}
