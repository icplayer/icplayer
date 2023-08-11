TestCase("[Table Of Contents] Text to speech test - speech texts", {
    setUp: function () {
        this.presenter = AddonTable_Of_Contents_create();
    },

    generateExpectedDefaultPresenterSpeechTexts: function () {
        return {
            Title: this.presenter.DEFAULT_TTS_PHRASES.TITLE,
            GoToPage: this.presenter.DEFAULT_TTS_PHRASES.GO_TO_PAGE,
            GoToPageNumber: this.presenter.DEFAULT_TTS_PHRASES.GO_TO_PAGE_NUMBER,
            PagesList: this.presenter.DEFAULT_TTS_PHRASES.PAGES_LIST,
            Pagination: this.presenter.DEFAULT_TTS_PHRASES.PAGINATION,
            OutOf: this.presenter.DEFAULT_TTS_PHRASES.OUT_OFF,
            Selected: this.presenter.DEFAULT_TTS_PHRASES.SELECTED,
        };
    },

    "test given empty speechTexts object when setSpeechText then presenter.speechText is default": function () {
        var speechText = {};
        var expectedResult = this.generateExpectedDefaultPresenterSpeechTexts();

        this.presenter.setSpeechTexts(speechText);

        assertNotUndefined(this.presenter.speechTexts);
        assertEquals(expectedResult, this.presenter.speechTexts);
    },

    "test given null speechTexts when setSpeechText then presenter.speechText is default": function () {
        var speechText = null;
        var expectedResult = this.generateExpectedDefaultPresenterSpeechTexts();

        this.presenter.setSpeechTexts(speechText);

        assertNotUndefined(this.presenter.speechTexts);
        assertEquals(expectedResult, this.presenter.speechTexts);
    },

    "test given undefined speechTexts when setSpeechText then presenter.speechText is default": function () {
        var speechText = undefined;
        var expectedResult = this.generateExpectedDefaultPresenterSpeechTexts();

        this.presenter.setSpeechTexts(speechText);

        assertNotUndefined(this.presenter.speechTexts);
        assertEquals(expectedResult, this.presenter.speechTexts);
    },

    "test given valid speechTexts when setSpeechText then presenter.speechText is equals to input": function () {
       var speechText = {
           Title: {Title: "Tytuł"},
           GoToPage: {GoToPage: "Przejdź do strony"},
           GoToPageNumber: {GoToPageNumber: "Przejdź do strony nr"},
           PagesList: {PagesList: "Lista stron"},
           Pagination: {Pagination: "Paginacja"},
           OutOf: {OutOf: "Z"},
           Selected: {Selected: "Zaznaczony"},
        };

       this.presenter.setSpeechTexts(speechText);

       assertNotUndefined(this.presenter.speechTexts);
       for (const [key, value] of Object.entries(speechText)) {
           assertEquals(value[key], this.presenter.speechTexts[key]);
       }
    }
});