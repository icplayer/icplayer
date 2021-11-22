TestCase("[Media Recorder] Sound Intensity", {
    setUp: function () {
        this.presenter = AddonMedia_Recorder_create();
        let internalElements = this.presenter._internalElements();

        this.$view = $('<div></div>');

        this.soundIntensity = new internalElements.SoundIntensity(this.$view);
    },


    "test given that analyser is enabled when calling hide, the widget view will be hidden": function () {
        this.soundIntensity.setEnableAnalyser(true);
        this.soundIntensity.hide();

        assertEquals("none", this.$view[0].style.display);
    },

    "test given that analyser is enabled when calling show, the widget view will be displayed": function () {
        this.soundIntensity.setEnableAnalyser(true);
        this.soundIntensity.show();

        assertEquals("", this.$view[0].style.display);
    },

    "test given that view is displayed when disabling analyser, then the widget view will be hidden": function () {
        this.soundIntensity.setEnableAnalyser(false);

        assertEquals("none", this.$view[0].style.display);
    },

    "test given that analyser is disabled, when calling show, then the widget view will be hidden": function () {
        this.soundIntensity.setEnableAnalyser(false);

        this.soundIntensity.show();

        assertEquals("none", this.$view[0].style.display);
    },

    "test given that analyser is disabled when calling show, the widget view will be hidden": function () {
        this.soundIntensity.setEnableAnalyser(false);

        this.soundIntensity.show();

        assertEquals("none", this.$view[0].style.display);
    },

    "test given that show was called when analyser was disabled when enabling analyser, the widget view will be displayed": function () {
        this.soundIntensity.setEnableAnalyser(false);
        this.soundIntensity.show();

        this.soundIntensity.setEnableAnalyser(true);

        assertEquals("", this.$view[0].style.display);
    },
});