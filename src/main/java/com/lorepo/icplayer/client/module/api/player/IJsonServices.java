package com.lorepo.icplayer.client.module.api.player;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public interface IJsonServices {

    String toJSONString(HashMap<String, String> data);
    HashMap<String, String> decodeHashMap(String jsonText);
    String toJSONString(ArrayList<Boolean> list);
    ArrayList<Boolean> decodeArray(String jsonText);
    List<String> decodeArrayValues(String string);
}