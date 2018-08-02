TestCase("[Media Recorder] Model validation", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();

        this.model = {
            ID: "mediaRecorder_1",
            "Is Visible": "True",
            maxTime: "10",
            type: "audio",
            defaultRecording: "/file/666666666",
            startRecordingSound: "/file/666666666",
            stopRecordingSound: "/file/666666666"
        };

        this.DEFAULT_VALUES = {
            MAX_TIME: 60,
            SUPPORTED_TYPES: {
                AUDIO: "audio",
                VIDEO: "video",
            }
        };
    },

    "test model is valid when the whole data is correct": function () {
        var validatedModel = this.presenter.validateModel(this.model, this.DEFAULT_VALUES);

        assertTrue(validatedModel.isValid);
    },

    "test 'Is Visible' is set up to false value when it is not a boolean": function () {
        this.model["Is Visible"] = "none";

        var validatedModel = this.presenter.validateModel(this.model, this.DEFAULT_VALUES);

        assertTrue(validatedModel.isValid);
        assertEquals(false, validatedModel.value["Is Visible"]);
    },

    "test model is invalid when maxTime is not a number": function () {
        this.model.maxTime = "none";

        var validatedModel = this.presenter.validateModel(this.model, this.DEFAULT_VALUES);

        assertFalse(validatedModel.isValid);
    },

    "test maxTime is set up by default value when it is not defined": function () {
        this.model.maxTime = "";

        var validatedModel = this.presenter.validateModel(this.model, this.DEFAULT_VALUES);

        assertTrue(validatedModel.isValid);
        assertEquals(this.DEFAULT_VALUES.MAX_TIME, validatedModel.value.maxTime);
    },

    "test model is invalid when maxTime is a negative number": function () {
        this.model.maxTime = "none";

        var validatedModel = this.presenter.validateModel(this.model, this.DEFAULT_VALUES);

        assertFalse(validatedModel.isValid);
    },

    "test model is invalid when type is not in the defined range": function () {
        this.model.type = "none";

        var validatedModel = this.presenter.validateModel(this.model, this.DEFAULT_VALUES);

        assertFalse(validatedModel.isValid);
    }
});