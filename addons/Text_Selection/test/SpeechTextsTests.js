TestCase("[Text Selection] Text to speech test - speech texts", {
    setUp: function () {
        this.presenter = AddonText_Selection_create();
    },

    generateExpectedDefaultPresenterSpeechTexts: function () {
        return {
            selectedSectionStart: "start of selected section",
            selectedSectionEnd: "end of selected section",
            selected: "selected",
            deselected: "deselected",
            wrong: "wrong",
            correct: "correct",
            phrase: "phrase",
            phraseEnd: "end of phrase",
        };
    },

    "test given empty speechTexts when setSpeechText then speechTexts is default": function () {
        var speechText = {};
        var expectedResult = this.generateExpectedDefaultPresenterSpeechTexts();

        this.presenter.setSpeechTexts(speechText);

        assertNotUndefined(this.presenter.speechTexts);
        assertEquals(expectedResult, this.presenter.speechTexts);
    },

    "test given null speechTexts when setSpeechText then speechTexts is default": function () {
        var speechText = null;
        var expectedResult = this.generateExpectedDefaultPresenterSpeechTexts();

        this.presenter.setSpeechTexts(speechText);

        assertNotUndefined(this.presenter.speechTexts);
        assertEquals(expectedResult, this.presenter.speechTexts);
    },

    "test given undefined speechTexts when setSpeechText then speechTexts is default": function () {
        var speechText = undefined;
        var expectedResult = this.generateExpectedDefaultPresenterSpeechTexts();

        this.presenter.setSpeechTexts(speechText);

        assertNotUndefined(this.presenter.speechTexts);
        assertEquals(expectedResult, this.presenter.speechTexts);
    },

    "test given valid speechTexts when setSpeechText then speechTexts is equals to input": function () {
       var speechText = {
           selectedSectionStart: {selectedSectionStart: "Początek zaznaczonej sekcji"},
           selectedSectionEnd: {selectedSectionEnd: "Koniec zaznaczonej sekcji"},
           selected: {selected: "zaznaczone"},
           deselected: {deselected: "odznaczone"},
           wrong: {wrong: "błędne"},
           correct: {correct: "poprawne"},
           phrase: {phrase: "Wyrażenie"},
           phraseEnd: {phraseEnd: "Koniec wyrażenia"},
       };

       this.presenter.setSpeechTexts(speechText);

       assertNotUndefined(this.presenter.speechTexts);
       for (const [key, value] of Object.entries(speechText)) {
           assertEquals(value[key], this.presenter.speechTexts[key]);
       }
    }
});
