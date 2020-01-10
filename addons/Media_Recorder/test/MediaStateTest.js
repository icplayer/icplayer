TestCase("[Media Recorder] State", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();

        let internalElements = this.presenter._internalElements();

        this.state = new internalElements.MediaState();
    },

    "test state is set up to new when it is initialized": function () {
        assertTrue(this.state.isNew());
        assertFalse(this.state.isRecording());
        assertFalse(this.state.isLoading());
        assertFalse(this.state.isLoaded());
        assertFalse(this.state.isPlaying());
        assertFalse(this.state.isBlocked());
    },

    "test state is set up to recording when mutator is called": function () {
        this.state.setRecording();

        assertFalse(this.state.isNew());
        assertTrue(this.state.isRecording());
        assertFalse(this.state.isLoading());
        assertFalse(this.state.isLoaded());
        assertFalse(this.state.isPlaying());
        assertFalse(this.state.isBlocked());
    },

    "test state is set up to loading when mutator is called": function () {
        this.state.setLoading();

        assertFalse(this.state.isNew());
        assertFalse(this.state.isRecording());
        assertTrue(this.state.isLoading());
        assertFalse(this.state.isLoaded());
        assertFalse(this.state.isPlaying());
        assertFalse(this.state.isBlocked());
    },

    "test state is set up to loaded when mutator is called": function () {
        this.state.setLoaded();

        assertFalse(this.state.isNew());
        assertFalse(this.state.isRecording());
        assertFalse(this.state.isLoading());
        assertTrue(this.state.isLoaded());
        assertFalse(this.state.isPlaying());
        assertFalse(this.state.isBlocked());
    },

    "test state is set up to playing when mutator is called": function () {
        this.state.setPlaying();

        assertFalse(this.state.isNew());
        assertFalse(this.state.isRecording());
        assertFalse(this.state.isLoading());
        assertFalse(this.state.isLoaded());
        assertTrue(this.state.isPlaying());
        assertFalse(this.state.isBlocked());
    },

    "test state is set up to blocked when mutator is called": function () {
        this.state.setBlocked();

        assertFalse(this.state.isNew());
        assertFalse(this.state.isRecording());
        assertFalse(this.state.isLoading());
        assertFalse(this.state.isLoaded());
        assertFalse(this.state.isPlaying());
        assertTrue(this.state.isBlocked());
    },

    "test state is set up to new when mutator is called": function () {
        this.state.setNew();

        assertTrue(this.state.isNew());
        assertFalse(this.state.isRecording());
        assertFalse(this.state.isLoading());
        assertFalse(this.state.isLoaded());
        assertFalse(this.state.isPlaying());
        assertFalse(this.state.isBlocked());
    },

    "test state is set up correctly when many mutators is called": function () {
        this.state.setRecording();
        this.state.setBlocked();
        this.state.setPlaying();

        assertFalse(this.state.isNew());
        assertFalse(this.state.isRecording());
        assertFalse(this.state.isLoading());
        assertFalse(this.state.isLoaded());
        assertTrue(this.state.isPlaying());
        assertFalse(this.state.isBlocked());
    }
});