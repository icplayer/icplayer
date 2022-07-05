TestCase("[Gradual Show Answer] TTS read current element tests", {

    setUp: function () {
        this.presenter = new AddonGradual_Show_Answer_create();

        this.presenter.state = {
            isDisabled: false,
            isGradualShowAnswers: false,
        }
        this.presenter.configuration = {
            isHideAnswers: false,
        }

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
        };

        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;

        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
        this.presenter.setSpeechTexts();
        this.activateTTSWithoutReading();
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

    'test given disabled addon, GSA is inactive and isHideAnswers set to false when executed read method with false as arg then speak disabled TTS' : function() {
        this.presenter.state.isDisabled = true;
        this.presenter.state.isGradualShowAnswers = false;
        this.presenter.configuration.isHideAnswers = false;
        const failedToShowAnswer = false;

        this.keyboardControllerObject.readCurrentElement(failedToShowAnswer);

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.DISABLED
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given disabled addon, GSA is inactive and isHideAnswers set to false when executed read method with true as arg then speak disabled TTS' : function() {
        this.presenter.state.isDisabled = true;
        this.presenter.state.isGradualShowAnswers = false;
        this.presenter.configuration.isHideAnswers = false;
        const failedToShowAnswer = true;

        this.keyboardControllerObject.readCurrentElement(failedToShowAnswer);

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.DISABLED
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given disabled addon, GSA is inactive and isHideAnswers set to true when executed read method with false as arg then speak disabled TTS' : function() {
        this.presenter.state.isDisabled = true;
        this.presenter.state.isGradualShowAnswers = false;
        this.presenter.configuration.isHideAnswers = true;
        const failedToHideAnswer = false;

        this.keyboardControllerObject.readCurrentElement(failedToHideAnswer);

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.DISABLED
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given disabled addon, GSA is inactive and isHideAnswers set to true when executed read method with true as arg then speak disabled TTS' : function() {
        this.presenter.state.isDisabled = true;
        this.presenter.state.isGradualShowAnswers = false;
        this.presenter.configuration.isHideAnswers = true;
        const failedToHideAnswer = true;

        this.keyboardControllerObject.readCurrentElement(failedToHideAnswer);

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.DISABLED
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given disabled addon, GSA is active and isHideAnswers set to false when executed read method with false as arg then speak TTS with information of no answer to show' : function() {
        this.presenter.state.isDisabled = true;
        this.presenter.state.isGradualShowAnswers = true;
        this.presenter.configuration.isHideAnswers = false;
        const failedToShowAnswer = false;

        this.keyboardControllerObject.readCurrentElement(failedToShowAnswer);

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.NO_NEW_ANSWER_TO_SHOW,
            this.presenter.DEFAULT_TTS_PHRASES.EDITION_IS_BLOCKED,
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given disabled addon, GSA is active and isHideAnswers set to false when executed read method with true as arg then speak TTS with information of one answer has been shown' : function() {
        this.presenter.state.isDisabled = true;
        this.presenter.state.isGradualShowAnswers = true;
        this.presenter.configuration.isHideAnswers = false;
        const failedToShowAnswer = true;

        this.keyboardControllerObject.readCurrentElement(failedToShowAnswer);

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.ANSWER_HAS_BEEN_SHOWN,
            this.presenter.DEFAULT_TTS_PHRASES.EDITION_IS_BLOCKED,
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given disabled addon, GSA is active and isHideAnswers set to true when executed read method with false as arg then speak disabled TTS' : function() {
        this.presenter.state.isDisabled = true;
        this.presenter.state.isGradualShowAnswers = true;
        this.presenter.configuration.isHideAnswers = true;
        const failedToHideAnswer = false;

        this.keyboardControllerObject.readCurrentElement(failedToHideAnswer);

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.DISABLED
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given disabled addon, GSA is active and isHideAnswers set to true when executed read method with true as arg then speak disabled TTS' : function() {
        this.presenter.state.isDisabled = true;
        this.presenter.state.isGradualShowAnswers = true;
        this.presenter.configuration.isHideAnswers = true;
        const failedToHideAnswer = true;

        this.keyboardControllerObject.readCurrentElement(failedToHideAnswer);

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.DISABLED
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given not disabled addon, GSA is inactive and isHideAnswers set to false when executed read method with false as arg then speak TTS with information of no answer to show' : function() {
        this.presenter.state.isDisabled = false;
        this.presenter.state.isGradualShowAnswers = false;
        this.presenter.configuration.isHideAnswers = false;
        const failedToShowAnswer = false;

        this.keyboardControllerObject.readCurrentElement(failedToShowAnswer);

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.NO_NEW_ANSWER_TO_SHOW,
            this.presenter.DEFAULT_TTS_PHRASES.EDITION_IS_BLOCKED,
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given not disabled addon, GSA is inactive and isHideAnswers set to false when executed read method with true as arg then speak TTS with information of one answer has been shown' : function() {
        this.presenter.state.isDisabled = false;
        this.presenter.state.isGradualShowAnswers = false;
        this.presenter.configuration.isHideAnswers = false;
        const failedToShowAnswer = true;

        this.keyboardControllerObject.readCurrentElement(failedToShowAnswer);

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.ANSWER_HAS_BEEN_SHOWN,
            this.presenter.DEFAULT_TTS_PHRASES.EDITION_IS_BLOCKED,
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given not disabled addon, GSA is inactive and isHideAnswers set to true when executed read method with false as arg then speak TTS with information of all answers are hidden' : function() {
        this.presenter.state.isDisabled = false;
        this.presenter.state.isGradualShowAnswers = false;
        this.presenter.configuration.isHideAnswers = true;
        const failedToHideAnswer = false;

        this.keyboardControllerObject.readCurrentElement(failedToHideAnswer);

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.ANSWERS_ARE_HIDDEN,
            this.presenter.DEFAULT_TTS_PHRASES.EDITION_IS_NOT_BLOCKED,
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given not disabled addon, GSA is inactive and isHideAnswers set to true when executed read method with true as arg then speak TTS with information of all answers are hidden' : function() {
        this.presenter.state.isDisabled = false;
        this.presenter.state.isGradualShowAnswers = false;
        this.presenter.configuration.isHideAnswers = true;
        const failedToHideAnswer = true;

        this.keyboardControllerObject.readCurrentElement(failedToHideAnswer);

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.ANSWERS_ARE_HIDDEN,
            this.presenter.DEFAULT_TTS_PHRASES.EDITION_IS_NOT_BLOCKED,
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given not disabled addon, GSA is active and isHideAnswers set to false when executed read method with false as arg then speak TTS with information of no answer to show' : function() {
        this.presenter.state.isDisabled = false;
        this.presenter.state.isGradualShowAnswers = true;
        this.presenter.configuration.isHideAnswers = false;
        const failedToShowAnswer = false;

        this.keyboardControllerObject.readCurrentElement(failedToShowAnswer);

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.NO_NEW_ANSWER_TO_SHOW,
            this.presenter.DEFAULT_TTS_PHRASES.EDITION_IS_BLOCKED,
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given not disabled addon, GSA is active and isHideAnswers set to false when executed read method with true as arg then speak TTS with information of one answer has been shown' : function() {
        this.presenter.state.isDisabled = false;
        this.presenter.state.isGradualShowAnswers = true;
        this.presenter.configuration.isHideAnswers = false;
        const failedToShowAnswer = true;

        this.keyboardControllerObject.readCurrentElement(failedToShowAnswer);

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.ANSWER_HAS_BEEN_SHOWN,
            this.presenter.DEFAULT_TTS_PHRASES.EDITION_IS_BLOCKED,
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given not disabled addon, GSA is active and isHideAnswers set to true when executed read method with false as arg then speak disabled TTS' : function() {
        this.presenter.state.isDisabled = false;
        this.presenter.state.isGradualShowAnswers = true;
        this.presenter.configuration.isHideAnswers = true;
        const failedToHideAnswer = false;

        this.keyboardControllerObject.readCurrentElement(failedToHideAnswer);

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.ANSWERS_ARE_HIDDEN,
            this.presenter.DEFAULT_TTS_PHRASES.EDITION_IS_NOT_BLOCKED,
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given not disabled addon, GSA is active and isHideAnswers set to true when executed read method with true as arg then speak disabled TTS' : function() {
        this.presenter.state.isDisabled = false;
        this.presenter.state.isGradualShowAnswers = true;
        this.presenter.configuration.isHideAnswers = true;
        const failedToHideAnswer = true;

        this.keyboardControllerObject.readCurrentElement(failedToHideAnswer);

        const expectedTexts = [
            this.presenter.DEFAULT_TTS_PHRASES.ANSWERS_ARE_HIDDEN,
            this.presenter.DEFAULT_TTS_PHRASES.EDITION_IS_NOT_BLOCKED,
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },
});
