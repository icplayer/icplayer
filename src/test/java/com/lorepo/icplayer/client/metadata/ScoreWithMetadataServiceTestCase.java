package com.lorepo.icplayer.client.metadata;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import org.junit.Test;
import org.mockito.Mockito;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class ScoreWithMetadataServiceTestCase extends GwtTest {


    @Test
    public void whenAddingMetadataObjectsToScoreWithMetadataServiceAndGettingTheirListThenReturnCorrectValue() {
        ScoreWithMetadataService service = new ScoreWithMetadataService();
        ScoreWithMetadata s1 = new ScoreWithMetadata("3.1");
        ScoreWithMetadata s2 = new ScoreWithMetadata("4.1");
        ScoreWithMetadata s3 = new ScoreWithMetadata("5.1");

        service.addScoreWithMetadata(s1);
        service.addScoreWithMetadata(s2);
        service.addScoreWithMetadata(s3);
        List<ScoreWithMetadata> scores = service.getScoreWithMetadata();

        assertEquals(3, scores.size());
        boolean sw1Present = false;
        boolean sw2Present = false;
        boolean sw3Present = false;
        for (ScoreWithMetadata score: scores) {
            if (score.getQuestionNumber().equals("3.1")) sw1Present = true;
            if (score.getQuestionNumber().equals("4.1")) sw2Present = true;
            if (score.getQuestionNumber().equals("5.1")) sw3Present = true;
        }
        assertTrue(sw1Present);
        assertTrue(sw2Present);
        assertTrue(sw3Present);
    }

    @Test
    public void whenAddingMetadataObjectsListToScoreWithMetadataServiceAndGettingTheirListThenReturnCorrectValue() {
        ScoreWithMetadataService service = new ScoreWithMetadataService();
        ScoreWithMetadata s1 = new ScoreWithMetadata("3.1");
        ScoreWithMetadata s2 = new ScoreWithMetadata("4.1");
        ScoreWithMetadata s3 = new ScoreWithMetadata("5.1");
        List<ScoreWithMetadata> scoresList = new ArrayList<ScoreWithMetadata>();
        scoresList.add(s1);
        scoresList.add(s2);
        scoresList.add(s3);
        service.addScoreWithMetadata(scoresList);

        List<ScoreWithMetadata> scores = service.getScoreWithMetadata();

        assertEquals(3, scores.size());
        boolean sw1Present = false;
        boolean sw2Present = false;
        boolean sw3Present = false;
        for (ScoreWithMetadata score: scores) {
            if (score.getQuestionNumber().equals("3.1")) sw1Present = true;
            if (score.getQuestionNumber().equals("4.1")) sw2Present = true;
            if (score.getQuestionNumber().equals("5.1")) sw3Present = true;
        }
        assertTrue(sw1Present);
        assertTrue(sw2Present);
        assertTrue(sw3Present);
    }

    @Test
    public void whenAddingMetadataObjectsWithDuplicateQuestionNumberToScoreWithMetadataServiceThenOldValueIsOverwritten() {
        ScoreWithMetadataService service = new ScoreWithMetadataService();
        ScoreWithMetadata s1 = new ScoreWithMetadata("3.1");
        s1.setUserAnswer("ans1");
        ScoreWithMetadata s2 = new ScoreWithMetadata("3.1");
        s2.setUserAnswer("ans2");

        service.addScoreWithMetadata(s1);
        service.addScoreWithMetadata(s2);
        List<ScoreWithMetadata> scores = service.getScoreWithMetadata();

        assertEquals(1, scores.size());
        ScoreWithMetadata score = scores.get(0);
        assertEquals("3.1", score.getQuestionNumber());
        assertEquals("ans2", score.getUserAnswer());
    }

}
