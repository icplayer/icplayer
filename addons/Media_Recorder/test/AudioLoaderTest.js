TestCase("[Media Recorder] Audio Loader", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();
        let internalElements = this.presenter._internalElements();

        this.$view = $('<div></div>');
        this.audioLoader = new internalElements.AudioLoader(this.$view);
    },

    "test view has not any style classes when loader is initialized": function () {
        assertEquals("", this.$view[0].className);
    },

    "test view has not any style classes when show method is called": function () {
        let styleClassName = "audio-loader";

        this.audioLoader.show();

        assertEquals(styleClassName, this.$view[0].className);
    },

    "test view has not any style classes when hide method is called": function () {
        this.audioLoader.hide();

        assertEquals("", this.$view[0].className);
    }
});