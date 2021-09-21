package com.lorepo.icplayer.client.metadata;

import java.util.List;

public interface IScoreWithMetadataService {

    void addScoreWithMetadata(List<ScoreWithMetadata> scoreWithMetadataList);

    void addScoreWithMetadata(ScoreWithMetadata scoreWithMetadata);

    List<ScoreWithMetadata> getScoreWithMetadata();

    void setScoreWithMetadata(String state);
}
