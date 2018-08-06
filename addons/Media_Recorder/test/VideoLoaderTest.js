TestCase("[Media Recorder] Video Loader", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();
        let internalElements = this.presenter._internalElements();

        this.$view = $('<div></div>');
        this.videoLoader = new internalElements.VideoLoader(this.$view);
    },

    "test view has not any style classes when loader is initialized": function () {
        assertEquals("", this.$view[0].className);
    },

    "test loader style class has been added when show method is called": function () {
        let styleClass = "video-loader";

        this.videoLoader.show();

        assertEquals(styleClass, this.$view[0].className);
    },

    "test loader style class has been removed when hide method is called": function () {
        this.videoLoader.hide();

        assertEquals("", this.$view[0].className);
    }
});