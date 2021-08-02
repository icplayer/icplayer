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
    },

    "test given model without resetDialogLabels when _upgradeModel is called then resetDialogLabels is added with default value": function () {
        var upgradeModel = this.presenter._internalUpgradeModel(this.model);

        assertTrue(upgradeModel["resetDialogLabels"] !== undefined);
        assertTrue(upgradeModel["resetDialogLabels"]['resetDialogText'] !== undefined);
        assertTrue(upgradeModel["resetDialogLabels"]['resetDialogText']['resetDialogLabel'] !== undefined);
        assertEquals("", upgradeModel["resetDialogLabels"]['resetDialogText']['resetDialogLabel']);
        assertTrue(upgradeModel["resetDialogLabels"]['resetDialogConfirm'] !== undefined);
        assertTrue(upgradeModel["resetDialogLabels"]['resetDialogConfirm']['resetDialogLabel'] !== undefined);
        assertEquals("", upgradeModel["resetDialogLabels"]['resetDialogConfirm']['resetDialogLabel']);
        assertTrue(upgradeModel["resetDialogLabels"]['resetDialogDeny'] !== undefined);
        assertTrue(upgradeModel["resetDialogLabels"]['resetDialogDeny']['resetDialogLabel'] !== undefined);
        assertEquals("", upgradeModel["resetDialogLabels"]['resetDialogDeny']['resetDialogLabel']);
    },

    "test given model with resetDialogLabels when _upgradeModel is called then resetDialogLabels values remain unchanged": function () {
        this.model["resetDialogLabels"] = {
            resetDialogText: {resetDialogLabel: "1"},
            resetDialogConfirm: {resetDialogLabel: "2"},
            resetDialogDeny: {resetDialogLabel: "3"}
        };

        var upgradeModel = this.presenter._internalUpgradeModel(this.model);

        assertTrue(upgradeModel["resetDialogLabels"] !== undefined);
        assertTrue(upgradeModel["resetDialogLabels"]['resetDialogText'] !== undefined);
        assertTrue(upgradeModel["resetDialogLabels"]['resetDialogText']['resetDialogLabel'] !== undefined);
        assertEquals("1", upgradeModel["resetDialogLabels"]['resetDialogText']['resetDialogLabel']);
        assertTrue(upgradeModel["resetDialogLabels"]['resetDialogConfirm'] !== undefined);
        assertTrue(upgradeModel["resetDialogLabels"]['resetDialogConfirm']['resetDialogLabel'] !== undefined);
        assertEquals("2", upgradeModel["resetDialogLabels"]['resetDialogConfirm']['resetDialogLabel']);
        assertTrue(upgradeModel["resetDialogLabels"]['resetDialogDeny'] !== undefined);
        assertTrue(upgradeModel["resetDialogLabels"]['resetDialogDeny']['resetDialogLabel'] !== undefined);
        assertEquals("3", upgradeModel["resetDialogLabels"]['resetDialogDeny']['resetDialogLabel']);
    },

    "test given model without disableRecording when _upgradeModel is called then disableRecording is added with default value": function () {
        var upgradeModel = this.presenter._internalUpgradeModel(this.model);

        assertTrue(upgradeModel["disableRecording"] !== undefined);
        assertEquals("False", upgradeModel["disableRecording"]);
    },

    "test given model with disableRecording when _upgradeModel is called then disableRecording value remains unchanged": function () {
        this.model["disableRecording"] = "True";
        var upgradeModel = this.presenter._internalUpgradeModel(this.model);

        assertTrue(upgradeModel["disableRecording"] !== undefined);
        assertEquals("True", upgradeModel["disableRecording"]);
    },

    "test given model without enableIntensityChangeEvents when _upgradeModel is called then enableIntensityChangeEvents is added with default value": function () {
        var upgradeModel = this.presenter._internalUpgradeModel(this.model);

        assertTrue(upgradeModel["enableIntensityChangeEvents"] !== undefined);
        assertEquals("False", upgradeModel["enableIntensityChangeEvents"]);
    },

    "test given model with enableIntensityChangeEvents when _upgradeModel is called then enableIntensityChangeEvents value remains unchanged": function () {
        this.model["enableIntensityChangeEvents"] = "True";
        var upgradeModel = this.presenter._internalUpgradeModel(this.model);

        assertTrue(upgradeModel["enableIntensityChangeEvents"] !== undefined);
        assertEquals("True", upgradeModel["enableIntensityChangeEvents"]);
    },
});