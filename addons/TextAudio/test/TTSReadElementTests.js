TestCase("[TextAudio] TTS read current element tests", {

    setUp: function () {
        this.presenter = new AddonTextAudio_create();

        this.presenter.isPlaying = false;

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
            getElementsForKeyboardNavigationStub: sinon.stub(),
        };

        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;

        let elements = this.getElementsForKeyboardNavigation();
        this.stubs.getElementsForKeyboardNavigationStub.returns(elements);
        this.presenter.getElementsForKeyboardNavigation = this.stubs.getElementsForKeyboardNavigationStub;

        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
        this.presenter.setSpeechTexts();
        this.activateTTSWithoutReading();
    },

    getElementsForKeyboardNavigation: function () {
        let elements = [];

        this.presenter.$playPauseBtn = $('<div>');
        this.presenter.$playPauseBtn.addClass(this.presenter.CSS_CLASSES.PLAY_PAUSE_BUTTON);
        elements.push(this.presenter.$playPauseBtn);

        let $stopBtn = $('<div>');
        $stopBtn.addClass(this.presenter.CSS_CLASSES.STOP_BUTTON);
        elements.push($stopBtn);

        let $playbackRateControls = $('<div>');
        $playbackRateControls.addClass(this.presenter.CSS_CLASSES.AUDIO_SPEED_CONTROLLER);
        elements.push($playbackRateControls);

        for (var i = 0; i <= 3; i++ ) {
            let span = document.createElement("span");
            span.classList.add("textelement" + i);
            span.value = "Slide " + i;
            elements.push($(span));
        }

        return elements;
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    validateAreEqualExpectedTextsToSpokenTexts: function (expectedTexts) {
        const spokenText = this.getFirstReadText();
        assertTrue(this.tts.speak.calledOnce);
        assertEquals(expectedTexts.length, spokenText.length);
        for (let i = 0; i < spokenText.length; i++) {
            assertEquals(expectedTexts[i], spokenText[i]["text"]);
        }
    },

    getFirstReadText: function() {
        // gets first call
        return this.tts.speak.args[0][0];
    },

    moveToPlayButton: function () {
        this.presenter.isPlaying = false;
        this.keyboardControllerObject.markCurrentElement(0);
    },

    moveToPauseButton: function () {
        this.presenter.isPlaying = true;
        this.keyboardControllerObject.markCurrentElement(0);
    },

    moveToStopButton: function () {
        this.keyboardControllerObject.markCurrentElement(1);
    },

    moveToAudioSpeedController: function () {
        this.keyboardControllerObject.markCurrentElement(2);
    },

    moveToSlide: function () {
        this.keyboardControllerObject.markCurrentElement(3);
    },

    'test given focused by keyboard navigation play button when executed speak method then speak play button TTS' : function() {
        this.moveToPlayButton();

        this.keyboardControllerObject.speakCurrentElement();

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.PLAY_BUTTON
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given focused by keyboard navigation pause button when executed speak method then speak pause button TTS' : function() {
        this.moveToPauseButton();

        this.keyboardControllerObject.speakCurrentElement();

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.PAUSE_BUTTON
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given focused by keyboard navigation stop button when executed speak method then speak stop button TTS' : function() {
        this.moveToStopButton();

        this.keyboardControllerObject.speakCurrentElement();

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.STOP_BUTTON
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given focused by keyboard navigation audio speed controller when executed speak method then speak audio speed controller TTS' : function() {
        this.moveToAudioSpeedController();

        this.keyboardControllerObject.speakCurrentElement();

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.AUDIO_SPEED_CONTROLLER
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given focused by keyboard navigation audio slide when executed speak method then do not speak' : function() {
        this.moveToSlide();

        this.keyboardControllerObject.speakCurrentElement();

        assertFalse(this.tts.speak.called);
    },
});
