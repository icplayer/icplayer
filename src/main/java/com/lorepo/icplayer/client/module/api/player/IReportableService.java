package com.lorepo.icplayer.client.module.api.player;

import java.util.HashMap;


public interface IReportableService {

	String getAsString();
	void loadFromString(String string);
	HashMap<String, String> getStates();
	void resetStates();
	void addValue(String key, boolean value);
}
