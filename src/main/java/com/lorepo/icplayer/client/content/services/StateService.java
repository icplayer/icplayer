package com.lorepo.icplayer.client.content.services;

import java.util.HashMap;

import com.lorepo.icf.utils.JSONUtils;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IStateService;

public class StateService implements IStateService{

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


	public void addState(HashMap<String, String> state) {
		sessionState.putAll(state);
	}


	public HashMap<String, String> getStates() {
		return sessionState;
	}
	
	public void resetStates() {
		sessionState.clear();
	}
	
	public void resetPageStates(IPage page) {
		String id = page.getId();
		for (String key: sessionState.keySet()) {
			if (key.startsWith(id)) {
				sessionState.remove(key);
			}
		}
	}
	
}
