TestCase("[PointsLines] TTS tests", {

    setUp: function () {
        this.presenter = new AddonPointsLines_create();

        setUpPointsLinesForTests(this.presenter);

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
            selectActionStub: sinon.stub()
        };

        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;

        buildViewForPointsLinesTests(this.presenter);
        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
        this.keyboardControllerObject.selectAction = this.stubs.selectActionStub;
        this.presenter.setSpeechTexts();
        this.activateTTSWithoutReading();
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    validateIsAllSpokenTextsEqualsToExpectedTexts: function (expectedTexts) {
        const spokenText = this.getFirstReadText();
        assertTrue(this.tts.speak.calledOnce);
        for (let i = 0; i < spokenText.length; i++) {
            assertEquals(expectedTexts[i], spokenText[i]["text"]);
        }
        assertEquals(expectedTexts.length, spokenText.length);
    },

    validateIsSelectActionCalledOnce: function () {
        assertTrue(this.stubs.selectActionStub.calledOnce);
    },

    validateIsReadCurrentElementNotCalled: function () {
        assertFalse(this.stubs.getTextToSpeechOrNullStub.called);
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

    addSelectedCSSClassToCurrentPoint: function () {
        this.keyboardControllerObject.getCurrentElement().addClass('selected');
    },

    removeSelectedCSSClassToCurrentPoint: function () {
        this.keyboardControllerObject.getCurrentElement().removeClass('selected');
    },

    'test given not connected point when calling read method then speak with correct TTS' : function() {
        this.markElement(4);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "Point, 5",
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given not connected point in error mode when calling read method then speak with correct TTS' : function() {
        this.markElement(4);
        this.presenter.isErrorMode = true;

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "Point, 5",
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given not connected, selected point when calling read method then speak with correct TTS' : function() {
        this.markElement(4);
        this.addSelectedCSSClassToCurrentPoint();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "Point, 5",
            "Selected",
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given connected point when calling read method then speak with correct TTS' : function() {
        this.markElement(5);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "Point, 6",
            "Connected to",
            "Point, 3",
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given connected, selected point when calling read method then speak with correct TTS' : function() {
        this.markElement(5);
        this.addSelectedCSSClassToCurrentPoint();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "Point, 6",
            "Selected",
            "Connected to",
            "Point, 3",
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given multi connected point when calling read method then speak with correct TTS' : function() {
        this.markElement(1);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "Point, 2",
            "Connected to",
            "Point, 1",
            "Point, 3",
            "Point, 4",
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given selected, multi connected point when calling read method then speak with correct TTS' : function() {
        this.markElement(1);
        this.addSelectedCSSClassToCurrentPoint();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "Point, 2",
            "Selected",
            "Connected to",
            "Point, 1",
            "Point, 3",
            "Point, 4",
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given in scenario 1 and error mode point when calling read method then speak with correct TTS' : function() {
        // To see details of scenario 1 check comments in method buildViewForPointsLinesTests
        this.markElement(1);
        this.presenter.isErrorMode = true;

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "Point, 2",
            "Connected to",
            "Point, 1",
            "Correct",
            "Point, 3",
            "Point, 4",
            "Wrong",
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given selected, in scenario 2 and error mode point when calling read method then speak with correct TTS' : function() {
        // To see details of scenario 2 check comments in method buildViewForPointsLinesTests
        this.markElement(3);
        this.addSelectedCSSClassToCurrentPoint();
        this.presenter.isErrorMode = true;

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "Point, 4",
            "Selected",
            "Connected to",
            "Point, 1",
            "Correct",
            "Point, 2",
            "Wrong",
            "Point, 3"
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given multi connected point and alt texts when calling read method then speak with correct TTS' : function() {
        this.markElement(1);
        this.presenter.altTexts = ["Punkt 1", "Punkt 2", "Punkt 3", "Punkt 4", "Punkt 5", "Punkt 6"];

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "Punkt 2",
            "Connected to",
            "Punkt 1",
            "Punkt 3",
            "Punkt 4",
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given multi connected point and indexes when calling read method then speak with correct TTS' : function() {
        this.markElement(1);
        this.presenter.indexes = ["A", "B", "C", "D", "E", "F"];

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "Point, B",
            "Connected to",
            "Point, A",
            "Point, C",
            "Point, D",
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given multi connected point, indexes and alt texts when calling read method then speak with correct TTS' : function() {
        this.markElement(1);
        this.presenter.indexes = ["A", "B", "C", "D", "E", "F"];
        this.presenter.altTexts = ["Punkt 1", "", "Punkt 3", ];

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "Point, B",
            "Connected to",
            "Punkt 1",
            "Punkt 3",
            "Point, D",
        ]
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given unselected point when activated space then speak selected' : function() {
        this.markElement(1);
        this.stubs.selectActionStub.callsFake(() => this.addSelectedCSSClassToCurrentPoint());

        activateSpaceEvent(this.presenter);

        const expectedTexts = [
            "Selected",
        ]
        this.validateIsSelectActionCalledOnce();
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given selected point when activated space then speak deselected' : function() {
        this.markElement(1);
        this.addSelectedCSSClassToCurrentPoint();
        this.stubs.selectActionStub.callsFake(() => this.removeSelectedCSSClassToCurrentPoint());

        activateSpaceEvent(this.presenter);

        const expectedTexts = [
            "Deselected",
        ]
        this.validateIsSelectActionCalledOnce();
        this.validateIsAllSpokenTextsEqualsToExpectedTexts(expectedTexts);
    },

    'test given selected point and not work mode when activated space then speak deselected' : function() {
        this.markElement(1);
        this.addSelectedCSSClassToCurrentPoint();
        this.stubs.selectActionStub.callsFake(() => undefined);

        activateSpaceEvent(this.presenter);

        this.validateIsSelectActionCalledOnce();
        this.validateIsReadCurrentElementNotCalled();
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
