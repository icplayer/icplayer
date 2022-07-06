TestCase("[Gradual Show Answer] Set speech texts tests", {

    setUp: function () {
        this.presenter = AddonGradual_Show_Answer_create();
    },

    "test given empty speechTexts when setSpeechText is called with empty dict as arg then set speechTexts to default values": function () {
        var newSpeechText = {};

        this.presenter.setSpeechTexts(newSpeechText);

        this.verifyIfPresenterSpeechTextsEqualsDefaultSpeechTexts();
    },

    "test given empty speechTexts when setSpeechText is called with null as arg then set speechTexts to default values": function () {
        var newSpeechText = null;

        this.presenter.setSpeechTexts(newSpeechText);

        this.verifyIfPresenterSpeechTextsEqualsDefaultSpeechTexts();
    },

    "test given empty speechTexts when setSpeechText is called with undefined as arg then set speechTexts to default values": function () {
        var newSpeechText = undefined;

        this.presenter.setSpeechTexts(newSpeechText);

        this.verifyIfPresenterSpeechTextsEqualsDefaultSpeechTexts();
    },

    "test given empty speechTexts when setSpeechText is called with dict with new speech texts as arg then insert given values to speechTexts ": function () {
       var newSpeechText = {
            AnswerHasBeenShown: {AnswerHasBeenShown: "Jedna odpowiedż zotała pokazana"},
            AnswersAreHidden: {AnswersAreHidden: "Odpowiedzi są schowane"},
            NoNewAnswerToShow: {NoNewAnswerToShow: "Brak nowej odpowiedzi do pokazania"},
            EditionIsBlocked: {EditionIsBlocked: "Edycja na stronie jest zablokowana"},
            EditionIsNotBlocked: {EditionIsNotBlocked: "Edycja na stronie nie jest zablokowana"},
            Disabled: {Disabled: "Zablokowany"},
       };

       this.presenter.setSpeechTexts(newSpeechText);

       assertNotUndefined(this.presenter.speechTexts);
       for (const [key, value] of Object.entries(newSpeechText)) {
           assertEquals(value[key], this.presenter.speechTexts[key]);
       }
    },

    generateExpectedDefaultPresenterSpeechTexts: function () {
        return {
            AnswerHasBeenShown: "One answer has been shown",
            AnswersAreHidden: "All answers are hidden",
            NoNewAnswerToShow: "No new answer to show",
            EditionIsBlocked: "Page edition is blocked",
            EditionIsNotBlocked: "Page edition is not blocked",
            Disabled: "Disabled",
        };
    },

    verifyIfPresenterSpeechTextsEqualsDefaultSpeechTexts: function () {
        const expectedResult = this.generateExpectedDefaultPresenterSpeechTexts();
        assertNotUndefined(this.presenter.speechTexts);
        assertEquals(expectedResult, this.presenter.speechTexts);
    },
});
