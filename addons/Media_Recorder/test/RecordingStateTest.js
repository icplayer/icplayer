TestCase("[Media Recorder] Recording State", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();
        let internalElements = this.presenter._internalElements();

        this.recordingState = new internalElements.RecordingState();
    },

    "test serialization result is correct when state is new": function () {
        var serializedState = "{\"mediaSource\":null}";

        var result = this.recordingState.serialize();

        assertEquals(serializedState, result);
    },

    "test serialization result is correct when media state has been set": function () {
        var serializedState = "{\"mediaSource\":\"/file/666666\"}";

        this.recordingState.setMediaSource("/file/666666");
        var result = this.recordingState.serialize();

        assertEquals(serializedState, result);
    },

    "test serialization result is correct when state has been deserialized": function () {
        var serializedState = "{\"mediaSource\":\"/file/666666\"}";

        this.recordingState.deserialize(serializedState);
        var result = this.recordingState.serialize();

        assertEquals(serializedState, result);
    },

    "test serialization result is correct when state has been reset": function () {
        var serializedState = "{\"mediaSource\":null}";

        this.recordingState.setMediaSource("/file/666666");
        this.recordingState.reset();
        var result = this.recordingState.serialize();

        assertEquals(serializedState, result);
    }
});