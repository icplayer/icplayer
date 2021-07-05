TestCase("[Media Recorder] Model upgrade", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();

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
            enableInErrorCheckingMode: "False"
        };

        this.DefaultValues = {
            MAX_TIME: 30 * 60,
            DEFAULT_MAX_TIME: 10
        };
    },

    "test given model without extendedMode when _upgradeModel is called then extendedMode is added with default value": function () {
        var upgradeModel = this.presenter._internalUpgradeModel(this.model);

        assertTrue(upgradeModel["extendedMode"] !== undefined);
        assertEquals("False", upgradeModel["extendedMode"]);
    },

    "test given model with extendedMode when _upgradeModel is called then extendedMode value remains unchanged": function () {
        this.model["extendedMode"] = "True";
        var upgradeModel = this.presenter._internalUpgradeModel(this.model);

        assertTrue(upgradeModel["extendedMode"] !== undefined);
        assertEquals("True", upgradeModel["extendedMode"]);
    }
});