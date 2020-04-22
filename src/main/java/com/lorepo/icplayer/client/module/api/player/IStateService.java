package com.lorepo.icplayer.client.module.api.player;

import java.util.HashMap;


public interface IStateService {

	String getAsString();
	void loadFromString(String string);
	HashMap<String, String> getStates();
	void resetStates();
	void resetPageStates(IPage page);
}
