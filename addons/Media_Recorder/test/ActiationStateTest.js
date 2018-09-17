TestCase("[Media Recorder] Activation State", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();

        let internalElements = this.presenter._internalElements();

        this.state = new internalElements.ActivationState();
    },

    "test state is set up to new when is initialized": function () {
        assertTrue(this.state.isActive());
        assertFalse(this.state.isInactive());
    },

    "test state is set up to inactive when mutator is called": function () {
        this.state.setInactive();

        assertFalse(this.state.isActive());
        assertTrue(this.state.isInactive());
    },

    "test state is set up to active when mutator is called": function () {
        this.state.setInactive();
        this.state.setActive();

        assertTrue(this.state.isActive());
        assertFalse(this.state.isInactive());
    }
});