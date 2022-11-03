TestCase("[LottiePlayer] TTS tests", {

    setUp: function () {
        this.presenter = new AddonLottiePlayer_create();

        this.presenter.configuration = createSimpleLottiePLayerConfigurationForTests();
        this.buildView();
        this.presenter.animationsElements = this.presenter.view.querySelectorAll("lottie-player");
        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
        this.keyboardControllerObject.setElements(this.presenter.getElementsForKeyboardNavigation());

        this.presenter.setSpeechTexts();
        this.activateTTSWithoutReading();

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
            selectActionStub: sinon.stub(),
        };

        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;
        this.keyboardControllerObject.selectAction = this.stubs.selectActionStub;
    },

    buildView: function() {
        this.presenter.view = createLottiePlayerViewForTests(this.presenter.configuration);
        this.presenter.$view = $(this.presenter.view);
    },

    setAnimationIsPaused: function (animationIndex = 0, isPaused = true) {
        this.presenter.animationsElements[animationIndex].getLottie = () => ({
            isPaused: isPaused
        })
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    validateIsAllSpokenTextsEqualsToExpectedTexts: function (expectedTexts) {
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

    markElement: function (index) {
        if (this.keyboardControllerObject.keyboardNavigationCurrentElement) {
            this.keyboardControllerObject.unmark(this.keyboardControllerObject.keyboardNavigationCurrentElement);
        }
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = index;
        this.keyboardControllerObject.keyboardNavigationCurrentElement = this.keyboardControllerObject.keyboardNavigationElements[index];
        this.keyboardControllerObject.mark(this.keyboardControllerObject.keyboardNavigationCurrentElement);
    },

    // Read enter action method

    'test given any element when playing and calling read enter action method then speak text from altText' : function() {
        this.setAnimationIsPaused(0, false);
        this.keyboardControllerObject.speakEnterAction();

        const expectedTexts = [
            this.presenter.configuration.animations[this.presenter.currentAnimationIndex].altText
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given any element when not playing and calling read enter action method then speak text from altTextPreview' : function() {
        this.setAnimationIsPaused(0, true);
        this.keyboardControllerObject.speakEnterAction();

        const expectedTexts = [
            this.presenter.configuration.animations[this.presenter.currentAnimationIndex].altTextPreview
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    // Read current element method

    'test given play button element when not playing and calling read current element method then speak with correct TTS' : function() {
        this.setAnimationIsPaused(0, true);
        this.markElement(0);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = ["Play button"];
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given play button element when playing and calling read current element method then speak with correct TTS' : function() {
        this.setAnimationIsPaused(0, false);
        this.markElement(0);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = ["Pause button"];
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given stop button element when calling read current element method then speak with correct TTS' : function() {
        this.markElement(1);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = ["Stop button"];
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given loop button element when calling read current element method then speak with correct TTS' : function() {
        this.markElement(2);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = ["Loop button"];
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    // Select action

    'test given toggle button when not playing and activated space then do not speak' : function() {
        this.setAnimationIsPaused(0, true);
        this.markElement(2);

        activateSpaceEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given toggle button when playing and activated space then do not speak' : function() {
        this.setAnimationIsPaused(0, false);
        this.markElement(2);

        activateSpaceEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when executed play command then speak altText' : function() {
        this.presenter.play();

        const expectedTexts = [this.presenter.configuration.animations[0].altText];
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given view when executed pause command then speak "Paused"' : function() {
        this.presenter.pause();

        const expectedTexts = ["Paused"];
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given view when executed stop command then speak "Stopped"' : function() {
        this.presenter.stop();

        const expectedTexts = ["Stopped"];
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given view when executed playAll command then speak altText' : function() {
        this.presenter.playAll();

        const expectedTexts = [this.presenter.configuration.animations[0].altText];
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given view when executed pauseAll command then speak "Paused"' : function() {
        this.presenter.pauseAll();

        const expectedTexts = ["Paused"];
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given view when executed stopAll command then speak "Stopped"' : function() {
        this.presenter.stopAll();

        const expectedTexts = ["Stopped"];
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },
});

function activateSpaceEvent(presenter) {
    activateKeyboardEvent(presenter, 32);
}

function activateKeyboardEvent(presenter, keycode, isShiftDown = false) {
    const event = {
        'keyCode': keycode,
        preventDefault: () => {},
        stopPropagation: () => {},
    };
    presenter.keyboardController(keycode, isShiftDown, event);
}
