package com.lorepo.icplayer.client.content.services;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONBoolean;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.lorepo.icplayer.client.module.api.player.IJsonServices;

public class JsonServices implements IJsonServices{

	@Override
	public String toJSONString(HashMap<String, String> data){
		
		JSONObject json = new JSONObject();
		
		for(String key : data.keySet()){
			String value = data.get(key);
			JSONString jsonValue = new JSONString(value);
			json.put(key, jsonValue); 
		}
		
		return json.toString();
	}

	@Override
	public HashMap<String,String> decodeHashMap(String jsonText){
		
		HashMap<String,String> output = new HashMap<String, String>();
		JSONValue jsonValue = JSONParser.parseStrict(jsonText);
		
		if(jsonValue instanceof JSONObject){
			JSONObject json = (JSONObject) jsonValue;
			for(String key : json.keySet()){
				if(json.get(key).isString() != null){
					String value = json.get(key).isString().stringValue();
					output.put(key, value);
				}
			}
		}
		
		return output;
	}

	@Override
	public String toJSONString(ArrayList<Boolean> list) {

		JSONArray json = new JSONArray();
		
		for(int i = 0; i < list.size(); i++){
			JSONBoolean jsonValue = JSONBoolean.getInstance(list.get(i).booleanValue());
			json.set(i, jsonValue); 
		}
		
		return json.toString();
	}

	@Override
	public ArrayList<Boolean> decodeArray(String jsonText) {

		ArrayList<Boolean> list = new ArrayList<Boolean>();
		JSONValue jsonValue = JSONParser.parseStrict(jsonText);
		
		if(jsonValue instanceof JSONArray){
			JSONArray json = (JSONArray) jsonValue;
			for(int i = 0; i < json.size(); i++){
				
				if(json.get(i).isBoolean() != null){
					boolean value = json.get(i).isBoolean().booleanValue();
					list.add(new Boolean(value));
				}
			}
		}
		
		return list;
	}

	@Override
	public List<String> decodeArrayValues(String string) {
		JSONValue parsedJsonValue = JSONParser.parseLenient(string);
		JSONArray parsedJsonArray = parsedJsonValue.isArray();

		if (parsedJsonArray == null) {
			return Collections.emptyList();
		}

		List<String> list = new ArrayList<String>();
		for (int i = 0; i < parsedJsonArray.size(); i++) {
			JSONValue jsonValue = parsedJsonArray.get(i);
			JSONString jsonString = jsonValue.isString();
			String stringValue = (jsonString == null) ? jsonValue.toString() : jsonString.stringValue();
			list.add(stringValue);
		}

		return list;
	}
}