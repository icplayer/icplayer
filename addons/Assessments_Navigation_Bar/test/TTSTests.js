TestCase("[Assessments_Navigation_Bar] Text to speech test - speech texts", {
   setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
   },

    "test given empty string as rawValue when getSpeechTextProperty then return default value": function () {
        var rawValue = "";
        var defaultValue = "default";

        var result = this.presenter.getSpeechTextProperty(rawValue, defaultValue);

        assertEquals(defaultValue, result);
    },

    "test given null as rawValue when getSpeechTextProperty then return default value": function () {
        var rawValue = null;
        var defaultValue = "default";

        var result = this.presenter.getSpeechTextProperty(rawValue, defaultValue);

        assertEquals(defaultValue, result);
    },

    "test given undefined as rawValue when getSpeechTextProperty then return default value": function () {
        var rawValue = undefined;
        var defaultValue = "default";

        var result = this.presenter.getSpeechTextProperty(rawValue, defaultValue);

        assertEquals(defaultValue, result);
    },

    "test given valid rawValue when getSpeechTextProperty then return it": function () {
        var rawValue = "valid";
        var defaultValue = "default";

        var result = this.presenter.getSpeechTextProperty(rawValue, defaultValue);

        assertEquals(rawValue, result);
    },

    "test given empty speechTexts object when setSpeechText then presenter.speechText is default": function () {
       var speechText = {};
       var expectedResult = {
            PreviousPage: this.presenter.DEFAULT_TTS_PHRASES.PreviousPage,
            ShowPreviousPages: this.presenter.DEFAULT_TTS_PHRASES.ShowPreviousPages,
            Title: this.presenter.DEFAULT_TTS_PHRASES.Title,
            GoToPage: this.presenter.DEFAULT_TTS_PHRASES.GoToPage,
            ShowNextPages: this.presenter.DEFAULT_TTS_PHRASES.ShowNextPages,
            NextPage: this.presenter.DEFAULT_TTS_PHRASES.NextPage,
        };

       this.presenter.setSpeechTexts(speechText);

       assertNotUndefined(this.presenter.speechTexts);
       assertEquals(expectedResult, this.presenter.speechTexts);
    },

    "test given null speechTexts when setSpeechText then presenter.speechText is default": function () {
       var speechText = null;
       var expectedResult = {
            PreviousPage: this.presenter.DEFAULT_TTS_PHRASES.PreviousPage,
            ShowPreviousPages: this.presenter.DEFAULT_TTS_PHRASES.ShowPreviousPages,
            Title: this.presenter.DEFAULT_TTS_PHRASES.Title,
            GoToPage: this.presenter.DEFAULT_TTS_PHRASES.GoToPage,
            ShowNextPages: this.presenter.DEFAULT_TTS_PHRASES.ShowNextPages,
            NextPage: this.presenter.DEFAULT_TTS_PHRASES.NextPage,
        };

       this.presenter.setSpeechTexts(speechText);

       assertNotUndefined(this.presenter.speechTexts);
       assertEquals(expectedResult, this.presenter.speechTexts);
    },

    "test given undefined speechTexts when setSpeechText then presenter.speechText is default": function () {
       var speechText = undefined;
       var expectedResult = {
            PreviousPage: this.presenter.DEFAULT_TTS_PHRASES.PreviousPage,
            ShowPreviousPages: this.presenter.DEFAULT_TTS_PHRASES.ShowPreviousPages,
            Title: this.presenter.DEFAULT_TTS_PHRASES.Title,
            GoToPage: this.presenter.DEFAULT_TTS_PHRASES.GoToPage,
            ShowNextPages: this.presenter.DEFAULT_TTS_PHRASES.ShowNextPages,
            NextPage: this.presenter.DEFAULT_TTS_PHRASES.NextPage,
        };

       this.presenter.setSpeechTexts(speechText);

       assertNotUndefined(this.presenter.speechTexts);
       assertEquals(expectedResult, this.presenter.speechTexts);
    },

    "test given valid speechTexts when setSpeechText then presenter.speechText is equals to input": function () {
       var speechText = {
            PreviousPage: {PreviousPage: "Poprzednia strona"},
            ShowPreviousPages: {ShowPreviousPages: "Show previous pages"},
            Title: {Title: "Tytul"},
            GoToPage: {GoToPage: "Idz do strony"},
            ShowNextPages: {ShowNextPages: "Show next pages"},
            NextPage: {NextPage: "Nastepna strona"},
        };

       this.presenter.setSpeechTexts(speechText);

       assertNotUndefined(this.presenter.speechTexts);
       for (const [key, value] of Object.entries(speechText)) {
           assertEquals(value[key], this.presenter.speechTexts[key]);
       }
    }
});