TestCase("[Media Recorder] Model validation", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();
        let internalElements = this.presenter._internalElements();
        this.validateModel = internalElements.validateModel;

        this.model = {
            ID: "mediaRecorder_1",
            "Is Visible": "True",
            maxTime: "10",
            type: "audio",
            defaultRecording: "/file/666666666",
            startRecordingSound: "/file/666666666",
            stopRecordingSound: "/file/666666666",
            isResetRemovesRecording: "False",
            isShowedTimer: "False",
            isShowedDefaultRecordingButton: "False",
            isDisabled: "False",
            enableInErrorCheckingMode: "False",
            extendedMode: "False",
            disableRecording: "False",
            enableIntensityChangeEvents: "False",
            resetDialogLabels: {
                resetDialogText: {resetDialogLabel: ""},
                resetDialogConfirm: {resetDialogLabel: ""},
                resetDialogDeny: {resetDialogLabel: ""}
            },
            langAttribute: "pl"
        };

        this.DefaultValues = {
            MAX_TIME: 30 * 60,
            DEFAULT_MAX_TIME: 10
        };
    },

    "test model is valid when the whole data is correct": function () {
        var validatedModel = this.validateModel(this.model);

        assertTrue(validatedModel.isValid);
    },

    "test 'Is Visible' is set up to false value when it is not a boolean": function () {
        this.model["Is Visible"] = "none";

        var validatedModel = this.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertEquals(false, validatedModel.value["Is Visible"]);
    },

    "test model is invalid when maxTime is not a number": function () {
        this.model.maxTime = "none";

        var validatedModel = this.validateModel(this.model);

        assertFalse(validatedModel.isValid);
    },

    "test maxTime is set up by default value when it is not defined": function () {
        this.model.maxTime = "";

        var validatedModel = this.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertEquals(this.DefaultValues.DEFAULT_MAX_TIME, validatedModel.value.maxTime);
    },

    "test model is invalid when maxTime is larger than defined value": function () {
        this.model.maxTime = "" + this.DefaultValues.MAX_TIME + 1;

        var validatedModel = this.validateModel(this.model);

        assertFalse(validatedModel.isValid);
    },

    "test model is invalid when maxTime is a negative number": function () {
        this.model.maxTime = "none";

        var validatedModel = this.validateModel(this.model);

        assertFalse(validatedModel.isValid);
    }
});