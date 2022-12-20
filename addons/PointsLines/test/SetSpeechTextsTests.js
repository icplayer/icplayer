TestCase("[PointsLines] Set speech texts tests", {

    setUp: function () {
        this.presenter = AddonPointsLines_create();
    },

    "test given empty speechTexts when setSpeechText is called with empty dict as arg then set speechTexts to default values": function () {
        let newSpeechText = {};

        this.presenter.setSpeechTexts(newSpeechText);

        this.verifyIfPresenterSpeechTextsEqualsDefaultSpeechTexts();
    },

    "test given empty speechTexts when setSpeechText is called with null as arg then set speechTexts to default values": function () {
        let newSpeechText = null;

        this.presenter.setSpeechTexts(newSpeechText);

        this.verifyIfPresenterSpeechTextsEqualsDefaultSpeechTexts();
    },

    "test given empty speechTexts when setSpeechText is called with undefined as arg then set speechTexts to default values": function () {
        let newSpeechText = undefined;

        this.presenter.setSpeechTexts(newSpeechText);

        this.verifyIfPresenterSpeechTextsEqualsDefaultSpeechTexts();
    },

    "test given empty speechTexts when setSpeechText is called with dict with new speech texts as arg then insert given values to speechTexts ": function () {
       let newSpeechText = {
           Point: {Point: "Punkt"},
           Connected: {Connected: "Połączony"},
           Disconnected: {Disconnected: "Odłączony"},
           ConnectedTo: {ConnectedTo: "Połączony do"},
           Selected: {Selected: "Zaznaczony"},
           Deselected: {Deselected: "Odznaczony"},
           Correct: {Correct: "Poprawnie"},
           Wrong: {Wrong: "Źle"},
       };

       this.presenter.setSpeechTexts(newSpeechText);

       assertNotUndefined(this.presenter.speechTexts);
       for (const [key, value] of Object.entries(newSpeechText)) {
           assertEquals(value[key], this.presenter.speechTexts[key[0].toLowerCase() + key.slice(1)]);
       }
    },

    verifyIfPresenterSpeechTextsEqualsDefaultSpeechTexts: function () {
        const expectedResult = this.generateExpectedDefaultPresenterSpeechTexts();
        assertNotUndefined(this.presenter.speechTexts);
        assertEquals(expectedResult, this.presenter.speechTexts);
    },

    generateExpectedDefaultPresenterSpeechTexts: function () {
        return {
            point: "Point",
            connected: "Connected",
            disconnected: "Disconnected",
            connectedTo: "Connected to",
            selected: "Selected",
            deselected: "Deselected",
            correct: "Correct",
            wrong: "Wrong",
        };
    },
});
