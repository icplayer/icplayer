package com.lorepo.icplayer.client.metadata;

import com.google.gwt.core.client.JavaScriptObject;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.player.IPage;

import java.util.ArrayList;
import java.util.List;

public class ScoreWithMetadata {
    String questionNumber = "";
    String moduleId = "";
    String moduleType = "";
    String questionType = "";
    String userAnswer = "";
    boolean isCorrect = false;
    List<String> allAnswers = new ArrayList<String>();
    IMetadata metadata = null;

    String pageName = "";
    int pageIndex = 0;

    public ScoreWithMetadata(String questionNumber) {
        this.questionNumber = questionNumber;
    }

    public String getQuestionNumber() {
        return questionNumber;
    }

    public String getModuleId() {
        return moduleId;
    }

    public String getModuleType() {
        return moduleType;
    }

    public String getQuestionType() {
        return questionType;
    }

    public String getUserAnswer() {
        return userAnswer;
    }

    public boolean getIsCorrect() {
        return isCorrect;
    }

    public List<String> getAllAnswers() {
        return allAnswers;
    }

    public String getPageName() {
        return pageName;
    }

    public int getPageIndex() {
        return pageIndex;
    }

    public IMetadata getMetadata() {
        return metadata;
    }

    public void setModule(IModuleModel model) {
        this.moduleId = model.getId();
        this.moduleType = model.getModuleTypeName();
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public void setPage(IPage page, int pageIndex) {
        this.pageIndex = pageIndex;
        this.pageName = page.getName();
    }

    public boolean setIsCorrect(boolean isCorrect) {
        return this.isCorrect = isCorrect;
    }

    public void setUserAnswer(String userAnswer) {
        this.userAnswer = userAnswer;
    }

    public void setAllAnswers(List<String> allAnswers) {
        this.allAnswers = allAnswers;
    }

    public void setMetadata(IMetadata metadata) {
        this.metadata = metadata;
    }

    public JavaScriptObject getJSObject() {
        return getJSObject(this);
    }

    private native JavaScriptObject getJSObject(ScoreWithMetadata x) /*-{
        var scoreWithMetadata = {};

        scoreWithMetadata.moduleId = x.@com.lorepo.icplayer.client.metadata.ScoreWithMetadata::getModuleId()();
        scoreWithMetadata.moduleType = x.@com.lorepo.icplayer.client.metadata.ScoreWithMetadata::getModuleType()();
        var questionType = x.@com.lorepo.icplayer.client.metadata.ScoreWithMetadata::getQuestionType()();
        if (questionType.length > 0) {
            scoreWithMetadata.questionType = questionType;
        }
        scoreWithMetadata.questionNumber = x.@com.lorepo.icplayer.client.metadata.ScoreWithMetadata::getQuestionNumber()();
        scoreWithMetadata.isCorrect = x.@com.lorepo.icplayer.client.metadata.ScoreWithMetadata::getIsCorrect()();
        scoreWithMetadata.userAnswer = x.@com.lorepo.icplayer.client.metadata.ScoreWithMetadata::getUserAnswer()();
        var allAnswers = x.@com.lorepo.icplayer.client.metadata.ScoreWithMetadata::getAllAnswersAsJSArray()();
        if (allAnswers.length > 0) {
            scoreWithMetadata.allAnswers = allAnswers;
        }
        scoreWithMetadata.metadata = x.@com.lorepo.icplayer.client.metadata.ScoreWithMetadata::getMetadataAsJS()();
        scoreWithMetadata.pageName = x.@com.lorepo.icplayer.client.metadata.ScoreWithMetadata::getPageName()();
        scoreWithMetadata.pageIndex = x.@com.lorepo.icplayer.client.metadata.ScoreWithMetadata::getPageIndex()();

        return scoreWithMetadata;
    }-*/;

    private JavaScriptObject getAllAnswersAsJSArray() {
        JavaScriptObject allAnswersJS = JavaScriptUtils.createEmptyJsArray();
        for (String answer: allAnswers) {
            JavaScriptUtils.addElementToJSArray(allAnswersJS, answer);
        }
        return allAnswersJS;
    }

    private JavaScriptObject getMetadataAsJS() {
        if (metadata != null) {
            return metadata.toJavaScript();
        }
        return null;
    }
}
