TestCase("[TextAudio] Set speech texts tests", {

    setUp: function () {
        this.presenter = AddonTextAudio_create();
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
            Play: {Play: "Play button"},
            Pause: {Pause: "Pause button"},
            Stop: {Stop: "Stop button"},
            AudioSpeedController: {AudioSpeedController: "Audio speed controller"},
       };

       this.presenter.setSpeechTexts(newSpeechText);

       assertNotUndefined(this.presenter.speechTexts);
       for (const [key, value] of Object.entries(newSpeechText)) {
           assertEquals(value[key], this.presenter.speechTexts[key]);
       }
    },

    verifyIfPresenterSpeechTextsEqualsDefaultSpeechTexts: function () {
        const expectedResult = this.generateExpectedDefaultPresenterSpeechTexts();
        assertNotUndefined(this.presenter.speechTexts);
        assertEquals(expectedResult, this.presenter.speechTexts);
    },

    generateExpectedDefaultPresenterSpeechTexts: function () {
        return {
            Play: "Play button",
            Pause: "Pause button",
            Stop: "Stop button",
            AudioSpeedController: "Audio speed controller",
        };
    },
});
