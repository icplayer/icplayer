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
        var upgradedModel = this.presenter._internalUpgradeModel(this.model);

        assertNotUndefined(upgradedModel["extendedMode"]);
        assertEquals("False", upgradedModel["extendedMode"]);
    },

    "test given model with extendedMode when _upgradeModel is called then extendedMode value remains unchanged": function () {
        this.model["extendedMode"] = "True";
        var upgradedModel = this.presenter._internalUpgradeModel(this.model);

        assertNotUndefined(upgradedModel["extendedMode"]);
        assertEquals("True", upgradedModel["extendedMode"]);
    },

    "test given model without resetDialogLabels when _upgradeModel is called then resetDialogLabels is added with default value": function () {
        var upgradedModel = this.presenter._internalUpgradeModel(this.model);

        assertTrue(upgradedModel["resetDialogLabels"] !== undefined);
        assertTrue(upgradedModel["resetDialogLabels"]['resetDialogText'] !== undefined);
        assertTrue(upgradedModel["resetDialogLabels"]['resetDialogText']['resetDialogLabel'] !== undefined);
        assertEquals("", upgradedModel["resetDialogLabels"]['resetDialogText']['resetDialogLabel']);
        assertTrue(upgradedModel["resetDialogLabels"]['resetDialogConfirm'] !== undefined);
        assertTrue(upgradedModel["resetDialogLabels"]['resetDialogConfirm']['resetDialogLabel'] !== undefined);
        assertEquals("", upgradedModel["resetDialogLabels"]['resetDialogConfirm']['resetDialogLabel']);
        assertTrue(upgradedModel["resetDialogLabels"]['resetDialogDeny'] !== undefined);
        assertTrue(upgradedModel["resetDialogLabels"]['resetDialogDeny']['resetDialogLabel'] !== undefined);
        assertEquals("", upgradedModel["resetDialogLabels"]['resetDialogDeny']['resetDialogLabel']);
    },

    "test given model with resetDialogLabels when _upgradeModel is called then resetDialogLabels values remain unchanged": function () {
        this.model["resetDialogLabels"] = {
            resetDialogText: {resetDialogLabel: "1"},
            resetDialogConfirm: {resetDialogLabel: "2"},
            resetDialogDeny: {resetDialogLabel: "3"}
        };

        var upgradedModel = this.presenter._internalUpgradeModel(this.model);

        assertTrue(upgradedModel["resetDialogLabels"] !== undefined);
        assertTrue(upgradedModel["resetDialogLabels"]['resetDialogText'] !== undefined);
        assertTrue(upgradedModel["resetDialogLabels"]['resetDialogText']['resetDialogLabel'] !== undefined);
        assertEquals("1", upgradedModel["resetDialogLabels"]['resetDialogText']['resetDialogLabel']);
        assertTrue(upgradedModel["resetDialogLabels"]['resetDialogConfirm'] !== undefined);
        assertTrue(upgradedModel["resetDialogLabels"]['resetDialogConfirm']['resetDialogLabel'] !== undefined);
        assertEquals("2", upgradedModel["resetDialogLabels"]['resetDialogConfirm']['resetDialogLabel']);
        assertTrue(upgradedModel["resetDialogLabels"]['resetDialogDeny'] !== undefined);
        assertTrue(upgradedModel["resetDialogLabels"]['resetDialogDeny']['resetDialogLabel'] !== undefined);
        assertEquals("3", upgradedModel["resetDialogLabels"]['resetDialogDeny']['resetDialogLabel']);
    },

    "test given model without disableRecording when _upgradeModel is called then disableRecording is added with default value": function () {
        var upgradedModel = this.presenter._internalUpgradeModel(this.model);

        assertNotUndefined(upgradedModel["disableRecording"]);
        assertEquals("False", upgradedModel["disableRecording"]);
    },

    "test given model with disableRecording when _upgradeModel is called then disableRecording value remains unchanged": function () {
        this.model["disableRecording"] = "True";
        var upgradedModel = this.presenter._internalUpgradeModel(this.model);

        assertNotUndefined(upgradedModel["disableRecording"]);
        assertEquals("True", upgradedModel["disableRecording"]);
    },

    "test given model without enableIntensityChangeEvents when _upgradeModel is called then enableIntensityChangeEvents is added with default value": function () {
        var upgradedModel = this.presenter._internalUpgradeModel(this.model);

        assertNotUndefined(upgradedModel["enableIntensityChangeEvents"]);
        assertEquals("False", upgradedModel["enableIntensityChangeEvents"]);
    },

    "test given model with enableIntensityChangeEvents when _upgradeModel is called then enableIntensityChangeEvents value remains unchanged": function () {
        this.model["enableIntensityChangeEvents"] = "True";
        var upgradedModel = this.presenter._internalUpgradeModel(this.model);

        assertNotUndefined(upgradedModel["enableIntensityChangeEvents"]);
        assertEquals("True", upgradedModel["enableIntensityChangeEvents"]);
    },

    "test given model without langAttribute when _upgradeModel is called then langAttribute is added with default value": function () {
        var upgradedModel = this.presenter._internalUpgradeModel(this.model);

        assertNotUndefined(upgradedModel["langAttribute"]);
        assertEquals("", upgradedModel["langAttribute"]);
    },

    "test given model with langAttribute when _upgradeModel is called then langAttribute value remains unchanged": function () {
        this.model["langAttribute"] = "PL-pl";
        var upgradedModel = this.presenter._internalUpgradeModel(this.model);

        assertNotUndefined(upgradedModel["langAttribute"]);
        assertEquals("PL-pl", upgradedModel["langAttribute"]);
    },
});

TestCase("[Media Recorder] Upgrade model - speech texts", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();

        this.expectedEmpty = {
            DefaultRecordingPlayButton: {DefaultRecordingPlayButton: ""},
            RecordingButton: {RecordingButton: ""},
            PlayButton: {PlayButton: ""},
            ResetButton: {ResetButton: ""},
            DownloadButton: {DownloadButton: ""},
            ResetDialog: {ResetDialog: ""},
            StartRecording: {StartRecording: ""},
            StopRecording: {StopRecording: ""},
            Disabled: {Disabled: ""},
        };

        this.expectedEmptyPaginationAndTitle = {
            DefaultRecordingPlayButton: {DefaultRecordingPlayButton: "Default recording play button"},
            PlayButton: {PlayButton: "Play button"},
            ResetButton: {ResetButton: "Reset button"},
            ResetDialog: {ResetDialog: "Reset dialog"},
            StartRecording: {StartRecording: "Start recording"},
            Disabled: {Disabled: "Disabled"},
            RecordingButton: {RecordingButton: ""},
            DownloadButton: {DownloadButton: ""},
            StopRecording: {StopRecording: ""},
        };
    },

    "test given empty model when upgrading model then sets empty object to speech texts": function () {
        var upgradedModel = this.presenter._internalUpgradeModel({});

        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, this.expectedEmpty);
    },

    "test given valid input model when upgrading model then sets correct object to speech texts": function () {
        var inputModel = {
            speechTexts: {
                DefaultRecordingPlayButton: {DefaultRecordingPlayButton: "Default recording play button"},
                RecordingButton: {RecordingButton: "Recording button"},
                PlayButton: {PlayButton: "Play button"},
                ResetButton: {ResetButton: "Reset button"},
                DownloadButton: {DownloadButton: "Download button"},
                ResetDialog: {ResetDialog: "Reset dialog"},
                StartRecording: {StartRecording: "Start recording"},
                StopRecording: {StopRecording: "Recording stopped"},
                Disabled: {Disabled: "Disabled"},
            }
        };

        var upgradedModel = this.presenter._internalUpgradeModel(inputModel);

        assertNotUndefined(upgradedModel.speechTexts);
        assertNotEquals(upgradedModel.speechTexts, this.expectedEmpty);
        assertEquals(upgradedModel.speechTexts, inputModel.speechTexts);
    },

    "test given not fully completed model by speech texts when upgrading model then sets correct object to speech texts": function () {
        var inputModel = {
            speechTexts: {
                DefaultRecordingPlayButton: {DefaultRecordingPlayButton: "Default recording play button"},
                PlayButton: {PlayButton: "Play button"},
                ResetButton: {ResetButton: "Reset button"},
                ResetDialog: {ResetDialog: "Reset dialog"},
                StartRecording: {StartRecording: "Start recording"},
                Disabled: {Disabled: "Disabled"},
            }
        };

        var upgradedModel = this.presenter._internalUpgradeModel(inputModel);

        assertNotUndefined(upgradedModel.speechTexts);
        assertNotEquals(upgradedModel.speechTexts, this.expectedEmpty);
        assertEquals(upgradedModel.speechTexts, this.expectedEmptyPaginationAndTitle);
    },
});
