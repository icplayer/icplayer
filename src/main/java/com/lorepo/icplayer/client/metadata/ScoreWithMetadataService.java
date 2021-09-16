package com.lorepo.icplayer.client.metadata;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.json.client.JSONParser;

public class ScoreWithMetadataService implements IScoreWithMetadataService {

    HashMap<String, ScoreWithMetadata> scores = new HashMap<String, ScoreWithMetadata>();

    @Override
    public void addScoreWithMetadata(List<ScoreWithMetadata> scoreWithMetadataList) {
        if (scoreWithMetadataList != null) {
            for (ScoreWithMetadata scoreWithMetadata : scoreWithMetadataList) {
                addScoreWithMetadata(scoreWithMetadata);
            }
        }
    }

    @Override
    public void addScoreWithMetadata(ScoreWithMetadata scoreWithMetadata) {
        if (scoreWithMetadata != null) {
            scores.put(scoreWithMetadata.getQuestionNumber(), scoreWithMetadata);
        }
    }

    @Override
    public List<ScoreWithMetadata> getScoreWithMetadata() {
        return new ArrayList<ScoreWithMetadata>(scores.values());
    }

    @Override
    public void setScoreWithMetadata(String state) {
        JSONValue parsedJsonValue = JSONParser.parseLenient(state);
        JSONArray parsedJsonArray = parsedJsonValue.isArray();
        if (parsedJsonArray == null) {
            return;
        }
        for (int i = 0; i < parsedJsonArray.size(); i++) {
            JSONObject object = parsedJsonArray.get(i).isObject();
            ScoreWithMetadata swm = new ScoreWithMetadata(object);
            this.addScoreWithMetadata(swm);
        }
    }

}
