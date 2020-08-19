TestCase('[Audio] ExecuteCommand', {
    setUp: function () {
        this.presenter = AddonAudio_create();

        this.presenter.configuration = {
            narration: "123"
        };

    },

    'test given narration in config when getnarration command called then returns the narration from config': function () {
        var expected = this.presenter.configuration.narration;
        var given = this.presenter.executeCommand("getnarration");

        assertEquals(expected, given);
    }
});