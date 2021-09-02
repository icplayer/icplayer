package com.lorepo.icplayer.client.metadata;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtTest;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.choice.ChoiceModel;
import org.junit.Test;
import org.mockito.Mockito;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@GwtModule("com.lorepo.icplayer.Icplayer")
public class ScoreWithMetadataTestCase extends GwtTest {

    @Test
    public void givenScoreWithMetadataObjectWhenCallingGetQuestionNumberThenReturnCorrectValue() {
        String expectedQuestionNumber = "5.1";
        ScoreWithMetadata score = new ScoreWithMetadata(expectedQuestionNumber);

        String questionNumber = score.getQuestionNumber();

        assertEquals(expectedQuestionNumber, questionNumber);
    }

    @Test
    public void givenScoreWithMetadataWithSetModuleWhenCallingGetModuleIDThenReturnCorrectValue() {
        String expectedModuleId = "Choice1";
        ScoreWithMetadata score = new ScoreWithMetadata("5.1");
        ChoiceModel module = Mockito.mock(ChoiceModel.class);
        Mockito.doReturn(expectedModuleId).when(module).getId();
        Mockito.doReturn("Choice").when(module).getModuleTypeName();
        score.setModule(module);

        String moduleId = score.getModuleId();

        assertEquals(expectedModuleId, moduleId);
    }

    @Test
    public void givenScoreWithMetadataWithSetModuleWhenCallingGetModuleTypeThenReturnCorrectValue() {
        String expectedModuleType = "Choice";
        ScoreWithMetadata score = new ScoreWithMetadata("5.1");
        ChoiceModel module = Mockito.mock(ChoiceModel.class);
        Mockito.doReturn("Choice1").when(module).getId();
        Mockito.doReturn(expectedModuleType).when(module).getModuleTypeName();
        score.setModule(module);

        String moduleType = score.getModuleType();

        assertEquals(expectedModuleType, moduleType);
    }

    @Test
    public void givenScoreWithMetadataObjectWhenCallingGetUserAnswerThenReturnCorrectValue() {
        String expectedUserAnswer = "this is the user's answer";
        ScoreWithMetadata score = new ScoreWithMetadata("5.1");
        score.setUserAnswer(expectedUserAnswer);

        String userAnswer = score.getUserAnswer();

        assertEquals(expectedUserAnswer, userAnswer);
    }

    @Test
    public void givenScoreWithMetadataObjectWhenCallingGetQuestionTypeThenReturnCorrectValue() {
        String expectedQuestionType = "dropdown";
        ScoreWithMetadata score = new ScoreWithMetadata("5.1");
        score.setQuestionType(expectedQuestionType);

        String questionType = score.getQuestionType();

        assertEquals(expectedQuestionType, questionType);
    }

    @Test
    public void givenScoreWithMetadataObjectWhenCallingGetIsCorrectThenReturnCorrectValue() {
        boolean expectedIsCorrect = true;
        ScoreWithMetadata score = new ScoreWithMetadata("5.1");
        score.setIsCorrect(expectedIsCorrect);

        boolean isCorrect = score.getIsCorrect();

        assertEquals(expectedIsCorrect, isCorrect);
    }

    @Test
    public void givenScoreWithMetadataObjectWhenCallingGetPageNameThenReturnCorrectValue() {
        String expectedPageName = "page_name";
        ScoreWithMetadata score = new ScoreWithMetadata("5.1");
        Page page1 = Mockito.mock(Page.class);
        Mockito.doReturn(expectedPageName).when(page1).getName();
        score.setPage(page1, 13);

        String pageName = score.getPageName();

        assertEquals(expectedPageName, pageName);
    }

    @Test
    public void givenScoreWithMetadataObjectWhenCallingGetPageIndexThenReturnCorrectValue() {
        int expectedPageIndex = 13;
        ScoreWithMetadata score = new ScoreWithMetadata("5.1");
        Page page1 = Mockito.mock(Page.class);
        Mockito.doReturn("page_name").when(page1).getName();
        score.setPage(page1, expectedPageIndex);

        int pageIndex = score.getPageIndex();

        assertEquals(expectedPageIndex, pageIndex);
    }

    @Test
    public void givenScoreWithMetadataObjectWhenCallingGetMetadataThenReturnCorrectValue() {
        ScoreWithMetadata score = new ScoreWithMetadata("5.1");
        Metadata expectedMetadata = new Metadata();
        expectedMetadata.put("key1", "value1");
        expectedMetadata.put("key2", "value2");
        expectedMetadata.put("key3", "value3");
        score.setMetadata(expectedMetadata);

        IMetadata metadata = score.getMetadata();
        assertEquals(3, metadata.getKeys().size());
        assertTrue(metadata.hasKey("key1"));
        assertEquals("value1", metadata.getValue("key1"));
        assertTrue(metadata.hasKey("key2"));
        assertEquals("value2", metadata.getValue("key2"));
        assertTrue(metadata.hasKey("key3"));
        assertEquals("value3", metadata.getValue("key3"));
    }
}
