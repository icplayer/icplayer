TestCase('[TextAudio] Round Entry Time', {
    setUp: function () {
        this.presenter = AddonTextAudio_create();
    },

    'test time withe longer miliseconds': function () {
        assertEquals('00:00.5', this.presenter.roundTimeEntry('00:00.45567'));
        assertEquals('00:00.3', this.presenter.roundTimeEntry('00:00.33567'));
    },

    'test time with decimal miliseconds': function () {
        assertEquals('00:01.5', this.presenter.roundTimeEntry('00:01.5'));
    }
});
