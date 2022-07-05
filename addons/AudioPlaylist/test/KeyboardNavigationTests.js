TestCase("Keyboard navigation", {
    setUp: function () {
        this.presenter = AddonAudioPlaylist_create();
        this.presenter.viewItems = this.getViewItems();
        this.presenter.configuration = {};
        this.presenter.items = this.getAudioItems();

        this.playSpy = sinon.spy();
        this.pauseSpy = sinon.spy();

        this.presenter.audio = {
            src: "fake/source",
            play: this.playSpy,
            pause: this.pauseSpy,
            paused: true,
            readyState: 4,
            duration: 20,
            playbackRate: 1.0,
            volume: 0.5
        };
        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
        this.tts = {
            speak: sinon.spy()
        };
        this.stubs = {
            eventPreventDefaultStub: sinon.stub(),
            switchElementStub: sinon.stub(),
            markCurrentElementStub: sinon.stub(),
            getElementsStub: sinon.stub(),
            readCurrentElementStub: sinon.stub(),
            getTextToSpeechOrNullStub: sinon.stub(),
        };
        this.event = {
            preventDefault: this.stubs.eventPreventDefaultStub
        };
        this.presenter.keyboardControllerObject.readCurrentElement = this.stubs.readCurrentElementStub;
        this.presenter.keyboardControllerObject.getTarget = this.stubs.getTargetStub;
        this.presenter.keyboardControllerObject.switchElement = this.stubs.switchElementStub;
        this.presenter.keyboardControllerObject.markCurrentElement = this.stubs.markCurrentElementStub;
        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;
    },

    getViewItems: function() {
        return {
            playPauseButton: this.getHTMLElement('audio-playlist-play-pause-btn'),
            prevButton: this.getHTMLElement('audio-playlist-prev-btn'),
            nextButton: this.getHTMLElement('audio-playlist-next-btn'),
            volumeButton: this.getHTMLElement('audio-playlist-volume-btn'),
            volumeBar: this.getHTMLElement('addon-audio-playlist-volume-bar'),
            timerBar: this.getHTMLElement('audio-playlist-bar'),
            audioSpeedController: this.getHTMLElement('audio-speed-controller')
        };
    },

    getHTMLElement: function(className, elementType = 'div') {
        var element = document.createElement(elementType);
        element.classList.add(className);
        return element
    },

    getAudioItems: function() {
        return [
            {
                Mp3: "/file/mock/mp3",
                Name: "1",
                Ogg: "",
                button: document.createElement("div"),
                row: document.createElement("div")
            }
        ];
    },

    'test if build controller will create keyboard controller': function () {
        assertTrue(this.keyboardControllerObject !== null);
        assertEquals(this.keyboardControllerObject.keyboardNavigationElements.length, 6);
    },

    'test when tab was called then next element should be marked': function () {
        this.keyboardControllerObject.tab(this.event);

        assertTrue(this.stubs.switchElementStub.called);
        assertTrue(this.stubs.switchElementStub.calledWith(1));
        assertTrue(this.stubs.readCurrentElementStub.called);
    },

    'test when enter was called then should activate keyboard navigation and mark first element': function () {
        this.keyboardControllerObject.enter(this.event);

        assertTrue(this.presenter.keyboardControllerObject.keyboardNavigationActive);
        assertTrue(this.stubs.readCurrentElementStub.called);
    },

    'test given audio speed controller selected when up was called should increase audio playback rate': function () {
        this.presenter.selectedElement = 'AudioSpeedController';
        this.presenter.playbackRate = 1.0;

        this.keyboardControllerObject.up(this.event);

        assertEquals(this.presenter.playbackRate, 1.25);
        assertEquals(this.presenter.audio.playbackRate, 1.25);
    },

    'test given volume selected when up was called should increase volume level': function () {
        this.presenter.selectedElement = 'Volume';
        this.presenter.viewItems['volumeBarFill'] = document.createElement('div');
        this.presenter.viewItems['volumeBarFill'].style.width = '50%';

        this.keyboardControllerObject.up(this.event);

        assertEquals(this.presenter.audio.volume, 0.6);
        assertEquals(this.presenter.viewItems['volumeBarFill'].style.width, '60%');
    },

    'test given audio speed controller selected when down was called should decrease audio playback rate': function () {
        this.presenter.selectedElement = 'AudioSpeedController';
        this.presenter.playbackRate = 1.0;

        this.keyboardControllerObject.down(this.event);

        assertEquals(this.presenter.playbackRate, 0.75);
        assertEquals(this.presenter.audio.playbackRate, 0.75);
    },

    'test given volume selected when down was called should decrease volume level': function () {
        this.presenter.selectedElement = 'Volume';
        this.presenter.viewItems['volumeBarFill'] = document.createElement('div');
        this.presenter.viewItems['volumeBarFill'].style.width = '50%';

        this.keyboardControllerObject.down(this.event);

        assertEquals(this.presenter.audio.volume, 0.4);
        assertEquals(this.presenter.viewItems['volumeBarFill'].style.width, '40%');
    },

    'test given time selected when left was called should rewind audio': function () {
        this.presenter.selectedElement = 'Timer';
        this.presenter.audio['currentTime'] = 50;

        this.keyboardControllerObject.left(this.event);

        assertEquals(this.presenter.audio['currentTime'], 45);
    },

    'test given time selected when right was called should fast forward audio': function () {
        this.presenter.selectedElement = 'Timer';
        this.presenter.audio['currentTime'] = 50;

        this.keyboardControllerObject.right(this.event);

        assertEquals(this.presenter.audio['currentTime'], 55);
    },

    'test given playing audio when escape was called should stop playing': function () {
        this.presenter.audio.paused = false;
        this.presenter.state.isPlaying = true;
        this.presenter.selectedElement = 'Timer';

        this.keyboardControllerObject.escape(this.event);

        assertFalse(this.presenter.state.isPlaying);
        assertNull(this.presenter.selectedElement);
    },

    'test given play button HTML when getCurrentElement was called should return PLAY navigation type': function () {
        var playHTML = document.createElement('button');
        playHTML.classList.add('audio-playlist-play-pause-btn');
        playHTML.classList.add('audio-playlist-play-btn');
        this.presenter.state.isPlaying = false;

        var result = this.presenter.getCurrentElement(playHTML);

        assertEquals(result, 'Play');
    }
});