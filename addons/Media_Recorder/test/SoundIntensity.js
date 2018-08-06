TestCase("[Media Recorder] Sound Intensity", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();

        let internalElements = this.presenter._internalElements();

        this.$view = [$('<div></div>')];
        this.soundIntensity = new internalElements.SoundIntensity(this.$view);
    },

    "test soundIntensity initialized": function () {
        // todo
    }
});