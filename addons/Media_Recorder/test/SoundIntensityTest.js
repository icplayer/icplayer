TestCase("[Media Recorder] Sound Intensity", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();
        let internalElements = this.presenter._internalElements();

        this.$view = $('<div></div>');

        this.soundIntensity = new internalElements.SoundIntensity(this.$view);
    },

    "test given widget when calling hide, the widget view will be hidden": function () {
        this.soundIntensity.hide();

        assertEquals("none", this.$view[0].style.display);
    },

    "test given hidden widget when calling show, the widget view will be displayed": function () {
        this.soundIntensity.hide();

        this.soundIntensity.show();

        assertEquals("", this.$view[0].style.display);
    }
});
