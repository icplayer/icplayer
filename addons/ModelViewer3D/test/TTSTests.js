TestCase("[ModelViewer3D] TTS setWCAGStatus tests", {
    setUp: function () {
        this.presenter = AddonModelViewer3D_create();
    },

    'test given WCAG status is off when setWCAGStatus called with true then isWCAGOn is true': function () {
        this.presenter.isWCAGOn = false;

        this.presenter.setWCAGStatus(true);

        assertTrue(this.presenter.isWCAGOn);
    },

    'test given WCAG status is on when setWCAGStatus called with false then isWCAGOn is false': function () {
        this.presenter.isWCAGOn = true;

        this.presenter.setWCAGStatus(false);

        assertFalse(this.presenter.isWCAGOn);
    }
});

TestCase("[ModelViewer3D] TTS speak tests", {
    setUp: function () {
        this.presenter = AddonModelViewer3D_create();
        this.ttsModule = {
            speak: sinon.mock()
        };
        this.presenter.playerController = {
            getModule: sinon.stub().returns(this.ttsModule)
        };
        this.presenter.isWCAGOn = true;
    },

    'test given WCAG is on and TTS module exists when speak called then TTS speak method is called': function () {
        this.presenter.speak("Test text");

        assertTrue(this.ttsModule.speak.calledWith("Test text"));
    },

    'test given WCAG is off when speak called then TTS speak method is not called': function () {
        this.presenter.isWCAGOn = false;

        this.presenter.speak("Test text");

        assertFalse(this.ttsModule.speak.called);
    },

    'test given TTS module does not exist when speak called then no error is thrown': function () {
        this.presenter.playerController.getModule = sinon.stub().returns(null);

        this.presenter.speak("Test text");

        assertFalse(this.ttsModule.speak.called);
    }
});

TestCase("[ModelViewer3D] Keyboard navigation and TTS tests", {
    setUp: function () {
        this.presenter = AddonModelViewer3D_create();

        this.stubs = {
            getTextVoiceObject: sinon.stub(window.TTSUtils, 'getTextVoiceObject'),
            preventDefault: sinon.stub(),
        };

        this.tts = {
            speak: sinon.spy()
        };

        this.playerController = {
            getModule: sinon.stub()
        };

        this.presenter.setPlayerController(this.playerController);
        this.presenter.configuration = {
            altText: "This is an alternative text.",
            langTag: "en-US"
        };
    },

    tearDown: function () {
        this.stubs.getTextVoiceObject.restore();
    },

    'test given enter key pressed when keyboardController is called then readAltText should be invoked': function () {
        const readAltTextSpy = sinon.spy(this.presenter, 'readAltText');
        const enterKeyCode = window.KeyboardControllerKeys.ENTER;

        this.presenter.keyboardController(enterKeyCode, false, { preventDefault: this.stubs.preventDefault });

        assertTrue(readAltTextSpy.calledOnce);
    },

    'test given other key pressed when keyboardController is called then readAltText should not be invoked': function () {
        const readAltTextSpy = sinon.spy(this.presenter, 'readAltText');
        const spaceKeyCode = window.KeyboardControllerKeys.SPACE;

        this.presenter.keyboardController(spaceKeyCode, false, { preventDefault: this.stubs.preventDefault });

        assertFalse(readAltTextSpy.called);
    },

    'test given WCAG is on and TTS module is available when readAltText is called then speak should be invoked with proper data': function () {
        this.playerController.getModule.withArgs('Text_To_Speech1').returns(this.tts);
        const expectedTextVoiceObject = { text: this.presenter.configuration.altText, lang: this.presenter.configuration.langTag };
        this.stubs.getTextVoiceObject.returns(expectedTextVoiceObject);
        this.presenter.setWCAGStatus(true);

        this.presenter.readAltText();

        assertTrue(this.stubs.getTextVoiceObject.calledWith(this.presenter.configuration.altText, this.presenter.configuration.langTag));
        assertTrue(this.tts.speak.calledWith([expectedTextVoiceObject]));
    },

    'test given WCAG is off when readAltText is called then speak should not be invoked': function () {
        this.playerController.getModule.withArgs('Text_To_Speech1').returns(this.tts);
        this.presenter.setWCAGStatus(false);

        this.presenter.readAltText();

        assertFalse(this.tts.speak.called);
    },

    'test given WCAG is on but TTS module is not available when readAltText is called then speak should not be invoked': function () {
        this.playerController.getModule.withArgs('Text_To_Speech1').returns(null);
        this.presenter.setWCAGStatus(true);

        this.presenter.readAltText();

        assertFalse(this.tts.speak.called);
    }
});
