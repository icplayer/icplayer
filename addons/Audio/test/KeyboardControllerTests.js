TestCase("[Audio] Keyboard controller tests", {
    setUp: function () {
        this.LETTER_S_KEY_CODE = 83;
        this.presenter = AddonAudio_create();
    },

    createEvent: function (keycode) {
        return {
            which: keycode,
            preventDefault: sinon.stub()
        };
    },

    'test given keyboard controller when pressed UP arrow then increase volume': function () {
        const keyCode = window.KeyboardControllerKeys.ARROW_UP;
        const isShift = false;
        const event = this.createEvent(keyCode);
        this.presenter.audio.volume = 0.5;

        this.presenter.keyboardController(keyCode, isShift, event);

        const expectedVolume = 0.6;
        assertEquals(expectedVolume, this.presenter.audio.volume);
    },

    'test given keyboard controller and volume set to 1.0 when pressed UP arrow then do not change volume': function () {
        const keyCode = window.KeyboardControllerKeys.ARROW_UP;
        const isShift = false;
        const event = this.createEvent(keyCode);
        this.presenter.audio.volume = 1.0;

        this.presenter.keyboardController(keyCode, isShift, event);

        const expectedVolume = 1.0;
        assertEquals(expectedVolume, this.presenter.audio.volume);
    },

    'test given keyboard controller when pressed DOWN arrow then decrease volume': function () {
        const keyCode = window.KeyboardControllerKeys.ARROW_DOWN;
        const isShift = false;
        const event = this.createEvent(keyCode);
        this.presenter.audio.volume = 0.5;

        this.presenter.keyboardController(keyCode, isShift, event);

        const expectedVolume = 0.4;
        assertEquals(expectedVolume, this.presenter.audio.volume);
    },

    'test given keyboard controller and volume set to 0.0 when pressed DOWN arrow then do not change volume': function () {
        const keyCode = window.KeyboardControllerKeys.ARROW_DOWN;
        const isShift = false;
        const event = this.createEvent(keyCode);
        this.presenter.audio.volume = 0.0;

        this.presenter.keyboardController(keyCode, isShift, event);

        const expectedVolume = 0.0;
        assertEquals(expectedVolume, this.presenter.audio.volume);
    },

    'test given keyboard controller when pressed S and UP arrow then increase playback rate': function () {
        const keyCode = window.KeyboardControllerKeys.ARROW_UP;
        const isShift = false;
        const event = this.createEvent(keyCode);
        const keysDownCodes = [this.LETTER_S_KEY_CODE, keyCode];
        this.presenter.audio.playbackRate = this.presenter.playbackRate = 1.0;

        this.presenter.keyboardController(keyCode, isShift, event, keysDownCodes);

        const expectedPlaybackRate = 1.25;
        assertEquals(expectedPlaybackRate, this.presenter.audio.playbackRate);
        assertEquals(expectedPlaybackRate, this.presenter.playbackRate);
    },

    'test given keyboard controller and playback rate set to 2.0 when pressed S and UP arrow then do not change playback rate': function () {
        const keyCode = window.KeyboardControllerKeys.ARROW_UP;
        const isShift = false;
        const event = this.createEvent(keyCode);
        const keysDownCodes = [this.LETTER_S_KEY_CODE, keyCode];
        this.presenter.audio.playbackRate = this.presenter.playbackRate = 2.0;

        this.presenter.keyboardController(keyCode, isShift, event, keysDownCodes);

        const expectedPlaybackRate = 2.0;
        assertEquals(expectedPlaybackRate, this.presenter.audio.playbackRate);
        assertEquals(expectedPlaybackRate, this.presenter.playbackRate);
    },

    'test given keyboard controller when pressed S and DOWN arrow then decrease playback rate': function () {
        const keyCode = window.KeyboardControllerKeys.ARROW_DOWN;
        const isShift = false;
        const event = this.createEvent(keyCode);
        const keysDownCodes = [this.LETTER_S_KEY_CODE, keyCode];
        this.presenter.audio.playbackRate = this.presenter.playbackRate = 1.0;

        this.presenter.keyboardController(keyCode, isShift, event, keysDownCodes);

        const expectedPlaybackRate = 0.75;
        assertEquals(expectedPlaybackRate, this.presenter.audio.playbackRate);
        assertEquals(expectedPlaybackRate, this.presenter.playbackRate);
    },

    'test given keyboard controller and playback rate set to 0.25 when pressed S and DOWN arrow then do not change playback rate': function () {
        const keyCode = window.KeyboardControllerKeys.ARROW_DOWN;
        const isShift = false;
        const event = this.createEvent(keyCode);
        const keysDownCodes = [this.LETTER_S_KEY_CODE, keyCode];
        this.presenter.audio.playbackRate = this.presenter.playbackRate = 0.25;

        this.presenter.keyboardController(keyCode, isShift, event, keysDownCodes);

        const expectedPlaybackRate = 0.25;
        assertEquals(expectedPlaybackRate, this.presenter.audio.playbackRate);
        assertEquals(expectedPlaybackRate, this.presenter.playbackRate);
    }
});
