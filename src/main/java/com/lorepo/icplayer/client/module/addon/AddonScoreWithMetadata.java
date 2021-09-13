package com.lorepo.icplayer.client.module.addon;

import com.google.gwt.core.client.JavaScriptObject;
import com.lorepo.icplayer.client.metadata.IMetadata;
import com.lorepo.icplayer.client.metadata.ScoreWithMetadata;
import com.lorepo.icplayer.client.metadata.ScoreWithMetadataUtils;

import java.util.ArrayList;
import java.util.List;

public class AddonScoreWithMetadata {

    AddonModel model = null;
    JavaScriptObject jsObject = null;

    public AddonScoreWithMetadata(AddonModel model, JavaScriptObject jsObject) {
        this.model = model;
        this.jsObject = jsObject;
    }

    private static class JavaScriptScoreWithMetadata extends JavaScriptObject {

        protected JavaScriptScoreWithMetadata() {};

        public final native boolean getIsCorrect() /*-{return this.isCorrect;}-*/;

        public final native String getUserAnswer() /*-{return this.userAnswer;}-*/;

        public final List<String> getAllAnswers() {
            List<String> answers = new ArrayList<String>();
            for (int i = 0; i < this.getAllAnswersCount(); i++) {
                answers.add(getAnswerByIndex(i));
            }
            return answers;
        };

        private final native int getAllAnswersCount() /*-{
			if (this.allAnswers == null) return 0;
			return this.allAnswers.length;
		}-*/;

        private final native String getAnswerByIndex(int index) /*-{return this.allAnswers[index];}-*/;


    }

    private native JavaScriptScoreWithMetadata getJsScoreFromList(JavaScriptObject jsScoreList, int index)/*-{
		return jsScoreList[index];
	}-*/;

    private native int getJsScoreListLength(JavaScriptObject jsScoreList)/*-{return jsScoreList.length;}-*/;


    public List<ScoreWithMetadata> getScoreWithMetadata() {
        IMetadata metadata = this.model.getMetadata();
        if (!ScoreWithMetadataUtils.validateMetadata(metadata)) {
            return null;
        }
        JavaScriptObject jsScoreList = getScoreWithMetadataFromJSPresenter(jsObject);
        if (jsScoreList == null) {
            return null;
        }

        List<ScoreWithMetadata> scores = new ArrayList<ScoreWithMetadata>();
        boolean isAlphabetical = ScoreWithMetadataUtils.enumerateAlphabetically(metadata);
        String enumerateStart = ScoreWithMetadataUtils.getEnumerateStart(metadata);
        int jsScoreListLen = getJsScoreListLength(jsScoreList);
        for (int i = 0; i < jsScoreListLen; i++) {
            JavaScriptScoreWithMetadata jsScore = getJsScoreFromList(jsScoreList, i);
            String questionNumber = ScoreWithMetadataUtils.getQuestionNumber(enumerateStart, i, isAlphabetical);
            ScoreWithMetadata score = new ScoreWithMetadata(questionNumber);
            score.setUserAnswer(jsScore.getUserAnswer());
            score.setIsCorrect(jsScore.getIsCorrect());
            score.setAllAnswers(jsScore.getAllAnswers());
            score.setModule(this.model);
            score.setMetadata(metadata);
            scores.add(score);
        }

        return scores;
    }

    private native JavaScriptObject getScoreWithMetadataFromJSPresenter(JavaScriptObject presenter) /*-{
		if (presenter && presenter.hasOwnProperty("getScoreWithMetadata")) {
			return presenter.getScoreWithMetadata();
		} else {
			return null;
		}
	}-*/;
}
