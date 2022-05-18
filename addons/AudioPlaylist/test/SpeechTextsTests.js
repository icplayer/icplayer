TestCase("Speech texts", {
    setUp: function () {
        this.presenter = AddonAudioPlaylist_create();
        this.tts = {
            speak: sinon.spy()
        };
        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
        };
        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;
    },

    getDefaultSpeechText: function () {
        return {
            Play: 'Play button',
            Pause: 'Pause button',
            PreviousAudio: 'Previous audio',
            NextAudio: 'Next audio',
            AudioSpeedController: 'Audio speed controller',
            Volume: 'Volume level',
            Timer: 'Time',
            AudioItem: 'Audio item'
        };
    },

    getChangedSpeechTextsFromModule: function () {
        return {
            play: {play: 'Graj'},
            pause: {pause: 'Stop'},
            prev: {prev: 'Poprzedni'},
            next: {next: 'Natepny'},
            audioSpeedController: {audioSpeedController: 'Predkosc odtwarzania'},
            volume: {volume: 'Poziom glosnosci'},
            timer: {timer: 'Czas'},
            audioItem: {audioItem: 'Utwor'}
        }
    },

    getChangedSpeechTexts: function () {
        return {
            Play: 'Graj',
            Pause: 'Stop',
            PreviousAudio: 'Poprzedni',
            NextAudio: 'Natepny',
            AudioSpeedController: 'Predkosc odtwarzania',
            Volume: 'Poziom glosnosci',
            Timer: 'Czas',
            AudioItem: 'Utwor'
        }
    },

    'test given true when setWCAGStatus was called should set isWCAGOn on true': function () {
        this.presenter.setWCAGStatus(true);

        assertTrue(this.presenter.isWCAGOn);
    },

    'test given empty value when setSpeechTexts was called should set default speech texts value': function() {
        this.presenter['speechTexts'] = {};

        this.presenter.setSpeechTexts();

        assertEquals(this.presenter.speechTexts, this.getDefaultSpeechText());
    },

    'test given edited speech texts when setSpeechTexts was called should set edited speech texts value': function() {
        this.presenter['speechTexts'] = {};

        this.presenter.setSpeechTexts(this.getChangedSpeechTextsFromModule());

        assertEquals(this.presenter.speechTexts, this.getChangedSpeechTexts());
    },

    'test given Play HTML element when getTextToRead should return text stored in speech text for play value': function () {
        var $playHTML = $(document.createElement('div'));
        $playHTML.addClass('audio-playlist-play-pause-btn');
        $playHTML.addClass('audio-playlist-play-btn');
        this.presenter.state.isPlaying = false;
        this.presenter.speechTexts = this.getDefaultSpeechText();

        var result = this.presenter.getTextToRead($playHTML);

        assertEquals(result, 'Play button');
    },

    'test given Audio Item HTML element when getTextToRead should return edited text for Audio item': function () {
        var $audioItemHTML = $(document.createElement('div'));
        $audioItemHTML.addClass('addon-audio-playlist-item');
        $audioItemHTML.text('Test Title');
        this.presenter.speechTexts = this.getDefaultSpeechText();
        this.presenter.items = [
            {name: 'Test Title', index: 0}
        ];

        var result = this.presenter.getTextToRead($audioItemHTML);

        assertEquals(result, '1 Audio item Test Title');
    }
});