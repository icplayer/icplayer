package com.lorepo.icplayer.client.content.services;

import java.util.HashMap;

import com.lorepo.icf.utils.JSONUtils;
import com.lorepo.icplayer.client.module.api.player.IReportableService;

public class ReportableService implements IReportableService{

	private HashMap<String, String>	isReportableMap = new HashMap<String, String>();

	
	public String getPageReportable(String key) {
		return isReportableMap.get(key);
	}
	
	public String getAsString(){
		return JSONUtils.toJSONString(isReportableMap);
	}
	
	
	public void loadFromString(String state){
		isReportableMap = JSONUtils.decodeHashMap(state);
	}


	public void addState(HashMap<String, String> state) {
		isReportableMap.putAll(state);
	}


	public HashMap<String, String> getStates() {
		return isReportableMap;
	}
	
	public void resetStates() {
		isReportableMap.clear();
	}

	@Override
	public void addValue(String key, boolean value) {
		isReportableMap.put(key, String.valueOf(value));
		
	}


}
