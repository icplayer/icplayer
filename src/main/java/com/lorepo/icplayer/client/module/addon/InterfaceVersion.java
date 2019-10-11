package com.lorepo.icplayer.client.module.addon;

public enum InterfaceVersion {
	DEFAULT(1),
	DESTROY_LIFE_CYCLE(2);
	
	int version;
	
	private InterfaceVersion(int version) {
		this.version = version;
	}
	
	public static InterfaceVersion fromValue(int version) {
		if (version == 1) {
			return InterfaceVersion.DEFAULT;
		} else if (version == 2) {
			return InterfaceVersion.DESTROY_LIFE_CYCLE;
		}
		
		return InterfaceVersion.DEFAULT;
	}
}
