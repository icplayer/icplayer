TestCase("[Timer] TTS Tests", {
    setUp: function () {
        this.presenter = AddonTimer_create();
        this.view = document.createElement('div');
        this.presenter.$view = $(this.view);
        this.presenter.$view.addClass('ic_active_module');
        this.presenter.isWCAGOn = true;

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub()
        };

        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;
    },

    'test given TTS and active module with text to read when speak was called then the speak should be called with text': function () {
        const textToRead = 'Text to read';

        this.presenter.speak(textToRead);

        assertTrue(this.tts.speak.calledWith(textToRead));
    },

    'test given TTS and Timer mode when readOnStart was called then the speak should be called with speech text': function () {
        const timerStartText = 'Start timer';
        const stopwatchStartText = 'Start stopwatch';
        this.presenter.speechTexts = {
            'TimerStarted': timerStartText,
            'StopwatchStarted': stopwatchStartText
        };
        this.presenter.configuration = {
            mode: 'Timer'
        };

        this.presenter.readOnStart();

        assertTrue(this.tts.speak.calledWith(timerStartText));
    },

    'test given TTS and Stopwatch mode when readOnStart was called then the speak should be called with speech text': function () {
        const timerStartText = 'Start timer';
        const stopwatchStartText = 'Start stopwatch';
        this.presenter.speechTexts = {
            'TimerStarted': timerStartText,
            'StopwatchStarted': stopwatchStartText
        };
        this.presenter.configuration = {
            mode: 'Stopwatch'
        };

        this.presenter.readOnStart();

        assertTrue(this.tts.speak.calledWith(stopwatchStartText));
    },

    'test given model when setSpeechTexts was called then speechText should be created with model values': function () {
        const model = {
            speechTexts: {
                Hours: {Hours: 'Godzin'},
                Minutes: {Minutes: 'Minut'},
                Seconds: {Seconds: 'Sekund'},
                StopwatchStarted: {StopwatchStarted: ''},
                StopwatchStopped: {StopwatchStopped: ''},
                TimerEnded: {TimerEnded: ''},
                TimerStarted: {TimerStarted: ''},
            }
        };

        this.presenter.setSpeechTexts(model);

        assertEquals(this.presenter.speechTexts.Hours, 'Godzin');
        assertEquals(this.presenter.speechTexts.Seconds, 'Sekund');
    },

    'test given empty model when setSpeechTexts was called then speechText should be created with default values': function () {
        const model = {
            speechTexts: {
                Hours: {Hours: ''},
                Minutes: {Minutes: ''},
                Seconds: {Seconds: ''},
                StopwatchStarted: {StopwatchStarted: ''},
                StopwatchStopped: {StopwatchStopped: ''},
                TimerEnded: {TimerEnded: ''},
                TimerStarted: {TimerStarted: ''},
            }
        };

        this.presenter.setSpeechTexts(model);

        assertEquals(this.presenter.speechTexts.Hours, 'Hours');
        assertEquals(this.presenter.speechTexts.TimerStarted, 'Timer started');
    },
});