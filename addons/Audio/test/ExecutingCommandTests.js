TestCase('[Audio] ExecuteCommand', {
    setUp: function () {
        this.presenter = AddonAudio_create();
    },

    'test given narration in config when getnarration command called then returns the narration from config': function () {
        this.presenter.configuration = {
            narration: "123"
        };

        var expected = this.presenter.configuration.narration;
        var given = this.presenter.executeCommand("getnarration");

        assertEquals(expected, given);
    },

    'test given empty config when getnarration command called then returns undefined': function () {
        this.presenter.configuration = {};

        var expected = undefined;
        var given = this.presenter.executeCommand("getnarration");

        assertEquals(expected, given);
    },

    'test given empty narration when getnarration command called then returns undefined': function () {
        this.presenter.configuration = {
            narration: ""
        };

        var expected = "";
        var given = this.presenter.executeCommand("getnarration");

        assertEquals(expected, given);
    }
});
