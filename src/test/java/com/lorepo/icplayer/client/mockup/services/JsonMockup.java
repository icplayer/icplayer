package com.lorepo.icplayer.client.mockup.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.lorepo.icplayer.client.module.api.player.IJsonServices;

public class JsonMockup implements IJsonServices {

	private HashMap<String, HashMap<String, String>> hashData = new HashMap<String, HashMap<String,String>>();
	
	@Override
	public String toJSONString(HashMap<String, String> data) {
		String key = Integer.toString(hashData.size());
		hashData.put(key, data);
		return key;
	}

	@Override
	public HashMap<String, String> decodeHashMap(String jsonText) {
		return hashData.get(jsonText);
	}

	@Override
	public String toJSONString(ArrayList<Boolean> list) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ArrayList<Boolean> decodeArray(String jsonText) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<String> decodeArrayValues(String string) {
		// TODO Auto-generated method stub
		return null;
	}
}
