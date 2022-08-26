TestCase("[Media Recorder] Text to speech test - speech texts", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();
        this.presenter.mediaRecorder.model = {
            extendedMode: false
        };

        this.presenter.mediaRecorder._buildKeyboardController();
        this.keyboardControllerObject = this.presenter.mediaRecorder.keyboardControllerObject;
    },

    generateExpectedDefaultPresenterSpeechTexts: function () {
        return {
            DefaultRecordingPlayButton: "Default recording play button",
            RecordingButton: "Recording button",
            PlayButton: "Play button",
            ResetButton: "Reset button",
            DownloadButton: "Download button",
            ResetDialog: "Reset dialog",
            StartRecording: "Start recording",
            StopRecording: "Recording stopped",
            Disabled: "Disabled",
        };
    },

    "test given empty speechTexts when setSpeechText then speechTexts is default": function () {
        var speechText = {};
        var expectedResult = this.generateExpectedDefaultPresenterSpeechTexts();

        this.keyboardControllerObject.setSpeechTexts(speechText);

        assertNotUndefined(this.keyboardControllerObject.speechTexts);
        assertEquals(expectedResult, this.keyboardControllerObject.speechTexts);
    },

    "test given null speechTexts when setSpeechText then speechTexts is default": function () {
        var speechText = null;
        var expectedResult = this.generateExpectedDefaultPresenterSpeechTexts();

        this.keyboardControllerObject.setSpeechTexts(speechText);

        assertNotUndefined(this.keyboardControllerObject.speechTexts);
        assertEquals(expectedResult, this.keyboardControllerObject.speechTexts);
    },

    "test given undefined speechTexts when setSpeechText then speechTexts is default": function () {
        var speechText = undefined;
        var expectedResult = this.generateExpectedDefaultPresenterSpeechTexts();

        this.keyboardControllerObject.setSpeechTexts(speechText);

        assertNotUndefined(this.keyboardControllerObject.speechTexts);
        assertEquals(expectedResult, this.keyboardControllerObject.speechTexts);
    },

    "test given valid speechTexts when setSpeechText then speechTexts is equals to input": function () {
       var speechText = {
           DefaultRecordingPlayButton: {DefaultRecordingPlayButton: "Przycisk odtwarzania domyślnego nagrania"},
           RecordingButton: {RecordingButton: "Przycisk nagrywania"},
           PlayButton: {PlayButton: "Przycisk odtwarzania"},
           ResetButton: {ResetButton: "Przycisk resetu"},
           DownloadButton: {DownloadButton: "Przycisk pobierania"},
           ResetDialog: {ResetDialog: "Dialog resetu"},
           StartRecording: {StartRecording: "Rozpocznij nagrywanie"},
           StopRecording: {StopRecording: "Zatrzymaj nagrywanie"},
           Disabled: {Disabled: "Zablokowany"},
       };

       this.keyboardControllerObject.setSpeechTexts(speechText);

       assertNotUndefined(this.keyboardControllerObject.speechTexts);
       for (const [key, value] of Object.entries(speechText)) {
           assertEquals(value[key], this.keyboardControllerObject.speechTexts[key]);
       }
    }
});
