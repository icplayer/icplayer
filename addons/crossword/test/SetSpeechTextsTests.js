TestCase("[Crossword] Set speech texts tests", {
    setUp: function () {
        this.presenter = Addoncrossword_create();
    },

    generateExpectedDefaultPresenterSpeechTexts: function () {
        return {
            Cell: "cell",
            Across: "across",
            Down: "down",
            Correct: "correct",
            Wrong: "wrong",
            Empty: "empty",
            Disabled: "disabled",
            OutOf: "out of",
        };
    },

    "test given empty speechTexts when setSpeechText is called with empty dict as arg then set speechTexts to default values": function () {
        var newSpeechText = {};

        this.presenter.setSpeechTexts(newSpeechText);

        var expectedResult = this.generateExpectedDefaultPresenterSpeechTexts();
        assertNotUndefined(this.presenter.speechTexts);
        assertEquals(expectedResult, this.presenter.speechTexts);
    },

    "test given empty speechTexts when setSpeechText is called with null as arg then set speechTexts to default values": function () {
        var newSpeechText = null;

        this.presenter.setSpeechTexts(newSpeechText);

        var expectedResult = this.generateExpectedDefaultPresenterSpeechTexts();
        assertNotUndefined(this.presenter.speechTexts);
        assertEquals(expectedResult, this.presenter.speechTexts);
    },

    "test given empty speechTexts when setSpeechText is called with undefined as arg then set speechTexts to default values": function () {
        var newSpeechText = undefined;

        this.presenter.setSpeechTexts(newSpeechText);

        var expectedResult = this.generateExpectedDefaultPresenterSpeechTexts();
        assertNotUndefined(this.presenter.speechTexts);
        assertEquals(expectedResult, this.presenter.speechTexts);
    },

    "test given empty speechTexts when setSpeechText is called with dict with new speech texts as arg then insert given values to speechTexts ": function () {
       var newSpeechText = {
           Cell: {Cell: "komórka"},
           Across: {Across: "wzdłuż"},
           Down: {Down: "w dół"},
           Correct: {Correct: "dobrze"},
           Wrong: {Wrong: "źle"},
           Empty: {Empty: "pusty"},
           Disabled: {Disabled: "zablokowany"},
           OutOf: {OutOf: "z"},
       };

       this.presenter.setSpeechTexts(newSpeechText);

       assertNotUndefined(this.presenter.speechTexts);
       for (const [key, value] of Object.entries(newSpeechText)) {
           assertEquals(value[key], this.presenter.speechTexts[key]);
       }
    }
});
