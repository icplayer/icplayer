TestCase('Calling Commands', {
    setUp: function () {
        this.presenter = AddonAudioPlaylist_create();
        this.presenter.viewItems = {
            playPauseButton: document.createElement("div")
        }
        this.presenter.configuration = {};
        this.presenter.items = [
            {
                Mp3: "/file/mock/mp3",
                Name: "1",
                Ogg: "",
                button: document.createElement("div"),
                row: document.createElement("div")
            }
        ];

        this.playSpy = sinon.spy();
        this.pauseSpy = sinon.spy();

        this.presenter.audio = {
            src: "fake/source",
            play: this.playSpy,
            pause: this.pauseSpy,
            paused: true,
            readyState: 4,
            duration: 20
        };
    },

    'test given audio when play was called then play the audio': function () {
        this.presenter.play();

        assertTrue(this.presenter.audio.play.calledOnce);
        assertTrue(this.presenter.state.isPlaying);
    },

    'test given playback rate when play was called then set the audio rate': function () {
        this.presenter.playbackRate = 2;

        this.presenter.play();

        assertEquals(this.presenter.audio.playbackRate, 2);
    },

    'test given playing audio when pause was called then paused the audio': function () {
        this.presenter.audio.paused = false;

        this.presenter.pause();

        assertTrue(this.presenter.audio.pause.calledOnce);
        assertFalse(this.presenter.state.isPlaying);
    },

    'test given playing audio when stop was called then paused the audio': function () {
        this.presenter.audio.paused = false;

        this.presenter.stop();

        assertTrue(this.presenter.audio.pause.calledOnce);
        assertFalse(this.presenter.state.isPlaying);
    },

    'test given index another audio when changeItem was called then play chosen audio': function () {
        this.presenter.items.push({
            Mp3: "/file/mock/mp3",
            Name: "2",
            Ogg: "",
            button: document.createElement("div"),
            row: document.createElement("div")
        });

        var result = this.presenter.changeItem(1);

        assertTrue(result);
        assertEquals(this.presenter.state.currentItemIndex, '1');
    },

    'test when previous button was clicked then play prev audio': function () {
        this.presenter.items.push({
            Mp3: "/file/mock/mp3",
            Name: "2",
            Ogg: "",
            button: document.createElement("div"),
            row: document.createElement("div")
        });
        this.presenter.items.push({
            Mp3: "/file/mock/mp3",
            Name: "3",
            Ogg: "",
            button: document.createElement("div"),
            row: document.createElement("div")
        });
        this.presenter.changeItem(1);

        var result = this.presenter.prev();

        assertTrue(result);
        assertEquals(this.presenter.state.currentItemIndex, '0');
    },

    'test when next button was clicked then play next audio': function () {
        this.presenter.items.push({
            Mp3: "/file/mock/mp3",
            Name: "2",
            Ogg: "",
            button: document.createElement("div"),
            row: document.createElement("div")
        });
        this.presenter.items.push({
            Mp3: "/file/mock/mp3",
            Name: "3",
            Ogg: "",
            button: document.createElement("div"),
            row: document.createElement("div")
        });
        this.presenter.changeItem(1);

        var result = this.presenter.next();

        assertTrue(result);
        assertEquals(this.presenter.state.currentItemIndex, '2');
    },

    'test given playback rate when setPlaybackRate was called then set audio playback rate': function () {
        this.presenter.setPlaybackRate('1.75');

        assertEquals(this.presenter.audio.playbackRate, '1.75');
        assertEquals(this.presenter.playbackRate, '1.75');
    }
});
