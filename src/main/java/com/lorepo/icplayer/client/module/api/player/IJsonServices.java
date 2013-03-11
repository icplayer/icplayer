package com.lorepo.icplayer.client.module.api.player;

import java.util.ArrayList;
import java.util.HashMap;

public interface IJsonServices {
	
	public String toJSONString(HashMap<String, String> data);
	public HashMap<String,String> decodeHashMap(String jsonText);
	public String toJSONString(ArrayList<Boolean> list);
	public ArrayList<Boolean> decodeArray(String jsonText);
}