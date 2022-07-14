TestCase("[Magic Boxes] TTS tests", {

    setUp: function () {
        this.presenter = new AddonMagic_Boxes_create();

        this.presenter.configuration = createMagicBoxesConfigurationForTests();

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
            selectActionStub: sinon.stub()
        };

        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;

        this.presenter.$view = $(createMagicBoxesViewForTests(this.presenter.configuration));
        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
        this.keyboardControllerObject.selectAction = this.stubs.selectActionStub;
        this.presenter.setSpeechTexts();
        this.activateTTSWithoutReading();
        this.markAndFocusTestSelectableElement();
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

    markAndFocusTestSelectableElement: function () {
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 0;
        this.keyboardControllerObject.keyboardNavigationCurrentElement = this.keyboardControllerObject.keyboardNavigationElements[0];
        this.keyboardControllerObject.mark(this.keyboardControllerObject.keyboardNavigationCurrentElement);
    },

    addSelectedCSSClassToCurrentSelectableElement: function () {
        this.keyboardControllerObject.getCurrentSelectableElement().addClass(this.presenter.CSS_CLASSES.SELECTED);
    },

    removeSelectedCSSClassFromCurrentSelectableElement: function () {
        this.keyboardControllerObject.getCurrentSelectableElement().removeClass(this.presenter.CSS_CLASSES.SELECTED);
    },

    addShowAnswerCSSClassToCurrentSelectableElement: function () {
        this.keyboardControllerObject.getCurrentSelectableElement().addClass(this.presenter.CSS_CLASSES.SHOW_ANSWERS);
    },

    addCorrectCSSClassToCurrentSelectableElement: function () {
        this.keyboardControllerObject.getCurrentSelectableElement().addClass(this.presenter.CSS_CLASSES.CORRECT_SELECTED);
    },

    addWrongCSSClassToCurrentSelectableElement: function () {
        this.keyboardControllerObject.getCurrentSelectableElement().addClass(this.presenter.CSS_CLASSES.WRONG_SELECTED);
    },

    'test given selectable element when calling read method then speak with correct TTS' : function() {
        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "Cell A 1",
            "O",
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given selected element when calling read method then speak with correct TTS' : function() {
        this.addSelectedCSSClassToCurrentSelectableElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "Cell A 1",
            "O",
            "Selected"
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given element in Show Answers state when calling read method then speak with correct TTS' : function() {
        this.addShowAnswerCSSClassToCurrentSelectableElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "Cell A 1",
            "O",
            "Selected"
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given marked as correct element when calling read method then speak with correct TTS' : function() {
        this.addSelectedCSSClassToCurrentSelectableElement();
        this.addCorrectCSSClassToCurrentSelectableElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "Cell A 1",
            "O",
            "Selected",
            "Correct",
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given marked as wrong element when calling read method then speak with correct TTS' : function() {
        this.addSelectedCSSClassToCurrentSelectableElement();
        this.addWrongCSSClassToCurrentSelectableElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "Cell A 1",
            "O",
            "Selected",
            "Wrong",
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given element and selection is not possible when activated space then do not speak' : function() {
        this.presenter.isSelectionPossible = false;

        activateSpaceEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given selectable element when activated space then speak with correct TTS' : function() {
        this.stubs.selectActionStub.callsFake(() => this.addSelectedCSSClassToCurrentSelectableElement());

        activateSpaceEvent(this.presenter);

        const expectedTexts = [
            "Selected",
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given selected selectable element when activated space then speak with correct TTS' : function() {
        this.addSelectedCSSClassToCurrentSelectableElement();
        this.stubs.selectActionStub.callsFake(() => this.removeSelectedCSSClassFromCurrentSelectableElement());

        activateSpaceEvent(this.presenter);

        const expectedTexts = [
            "Deselected",
        ]
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
