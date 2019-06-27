TestCase("[Media Recorder] Audio Player", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();
        let internalElements = this.presenter._internalElements();

        this.$view = $('<div></div>');
        this.player = new internalElements.AudioPlayer(this.$view);
    },

    "test checking method returns true when media source is local": function (done) {
        let source = "/file/666666";

        let result = this.player._isNotOnlineResources(source);

        assertTrue(result);
    },

    "test checking method returns false when media source is online and starts with http://": function (done) {
        let source = "http://file/666666";

        let result = this.player._isNotOnlineResources(source);

        assertFalse(result);
    },

    "test checking method returns false when media source is online and starts with https://": function () {
        let source = "https://file/666666";

        let result = this.player._isNotOnlineResources(source);

        assertFalse(result);
    },

    "test checking method returns false when media source is online and starts with www.": function () {
        let source = "www.test.com/file/666666";

        let result = this.player._isNotOnlineResources(source);

        assertFalse(result);
    }
});