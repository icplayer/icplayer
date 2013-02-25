package com.lorepo.icplayer.client.content.services;

import java.util.HashMap;

import com.lorepo.icf.utils.JSONUtils;

public class PlayerState {

	private HashMap<String, String>	sessionState = new HashMap<String, String>();

	
	public String getPageState(String key) {
		return sessionState.get(key);
	}


	public void setPageState(String key, String state) {
		sessionState.put(key, state);
	}

	
	public String getAsString(){
		return JSONUtils.toJSONString(sessionState);
	}
	
	
	public void loadFromString(String state){
		sessionState = JSONUtils.decodeHashMap(state);
	}
}
