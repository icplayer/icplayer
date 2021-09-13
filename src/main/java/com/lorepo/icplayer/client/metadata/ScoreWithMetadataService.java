package com.lorepo.icplayer.client.metadata;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import com.lorepo.icf.utils.JavaScriptUtils;

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
    public void setScoreWithMetadata(String oldState) {
        JavaScriptUtils.log(oldState);
    }

}
