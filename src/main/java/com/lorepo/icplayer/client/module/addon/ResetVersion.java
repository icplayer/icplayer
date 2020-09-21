package com.lorepo.icplayer.client.module.addon;

public enum ResetVersion {
	DEFAULT(1),
	ONLY_WRONG_ANSWERS(2);
	
	int version;
	
	private ResetVersion(int version) {
		this.version = version;
	}
	
	public static ResetVersion fromValue(int version) {
		if (version == 1) {
			return ResetVersion.DEFAULT;
		} else if (version == 2) {
			return ResetVersion.ONLY_WRONG_ANSWERS;
		}
		
		return ResetVersion.DEFAULT;
	}
}
