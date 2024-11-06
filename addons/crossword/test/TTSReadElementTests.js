TestCase("[Crossword] Activation of methods to read element tests", {

    setUp: function () {
        this.presenter = new Addoncrossword_create();

        this.presenter.rowCount = 9;
        this.presenter.columnCount = 10;
        this.presenter.tabIndexBase = 5000;
        this.presenter.crossword = getCrosswordForNavigationTests();
        this.presenter.configuration = {
            langTag: ""
        };

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
        };

        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;

        this.presenter.onCellInputFocus = sinon.spy(() => {});
        this.presenter.onCellInputFocusOut = sinon.spy(() => {});

        this.view = document.createElement('div');
        this.presenter.$view = $(this.view);
        this.presenter.prepareCorrectAnswers();
        this.presenter.createGrid();
        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
        this.presenter.setSpeechTexts();

        this.spies = {
            readCurrentElement: sinon.spy(this.keyboardControllerObject, 'readCurrentElement'),
            readCurrentElementInShortForm: sinon.spy(this.keyboardControllerObject, 'readCurrentElementInShortForm'),
        }
    },

    tearDown : function() {
        this.spies.readCurrentElement.restore();
        this.spies.readCurrentElementInShortForm.restore();
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    markAndFocusElementWithPosition: function (x, y) {
        let newIndex = (this.keyboardControllerObject.columnsCount * y) + x;
        if (this.keyboardControllerObject.keyboardNavigationCurrentElement) {
            this.keyboardControllerObject.unmark(this.keyboardControllerObject.keyboardNavigationCurrentElement);
        }
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = newIndex;
        this.keyboardControllerObject.keyboardNavigationCurrentElement = this.keyboardControllerObject.keyboardNavigationElements[newIndex];
        this.keyboardControllerObject.mark(this.keyboardControllerObject.keyboardNavigationCurrentElement);
    },

    validateIsNotCalledAnyOfMethodsToRead: function () {
        assertFalse(this.spies.readCurrentElement.called);
        assertFalse(this.spies.readCurrentElementInShortForm.called);
    },

    validateIsCalledOnlyShortFormOfMethodToRead: function () {
        assertFalse(this.spies.readCurrentElement.called);
        assertTrue(this.spies.readCurrentElementInShortForm.calledOnce);
    },

    validateIsCalledOnlyFullFormOfMethodToRead: function () {
        assertTrue(this.spies.readCurrentElement.calledOnce);
        assertFalse(this.spies.readCurrentElementInShortForm.called);
    },

    getFirstReadText: function() {
        // gets first call
        return this.tts.speak.args[0][0];
    },

    // First enter tests

    'test given view when entering for the first time by TTS then call short form of method to read' : function() {
        activateEnterEvent(this.presenter);

        this.validateIsCalledOnlyShortFormOfMethodToRead();
    },

    // Left arrow event

    'test given view and TTS is active when moving to left editable cell then execute short form of method to read' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(2, 1);

        activateLeftArrowEvent(this.presenter);

        this.validateIsCalledOnlyShortFormOfMethodToRead();
    },

    'test given view and TTS is active when moving to left constant cell then execute short form of method to read' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(2, 4);

        activateLeftArrowEvent(this.presenter);

        this.validateIsCalledOnlyShortFormOfMethodToRead();
    },

    'test given view and TTS is active when cannot move to left blank cell then do not execute any of methods to read' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(0, 6);

        activateLeftArrowEvent(this.presenter);

        this.validateIsNotCalledAnyOfMethodsToRead();
    },

    // Right arrow event

    'test given view and TTS is active when moving to right editable cell then execute short form of method to read' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(4, 5);

        activateRightArrowEvent(this.presenter);

        this.validateIsCalledOnlyShortFormOfMethodToRead();
    },

    'test given view and TTS is active when moving to right constant cell then execute short form of method to read' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(6, 5);

        activateRightArrowEvent(this.presenter);

        this.validateIsCalledOnlyShortFormOfMethodToRead();
    },

    'test given view and TTS is active when cannot move to right blank cell then do not execute any of methods to read' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(7, 3);

        activateRightArrowEvent(this.presenter);

        this.validateIsNotCalledAnyOfMethodsToRead();
    },

    // Up arrow event

    'test given view and TTS is active when moving to up editable cell then execute short form of method to read' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(3, 1);

        activateUpArrowEvent(this.presenter);

        this.validateIsCalledOnlyShortFormOfMethodToRead();
    },

    'test given view and TTS is active when moving to up constant cell then execute short form of method to read' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(4, 4);

        activateUpArrowEvent(this.presenter);

        this.validateIsCalledOnlyShortFormOfMethodToRead();
    },

    'test given view and TTS is active when cannot move to up blank cell then do not execute any of methods to read' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(2, 1);

        activateUpArrowEvent(this.presenter);

        this.validateIsNotCalledAnyOfMethodsToRead();
    },

    // Down arrow event

    'test given view and TTS is active when moving to down editable cell then execute short form of method to read' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(3, 1);

        activateDownArrowEvent(this.presenter);

        this.validateIsCalledOnlyShortFormOfMethodToRead();
    },

    'test given view and TTS is active when moving to down constant cell then execute short form of method to read' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(5, 5);

        activateDownArrowEvent(this.presenter);

        this.validateIsCalledOnlyShortFormOfMethodToRead();
    },

    'test given view and TTS is active when cannot move to down blank cell then do not execute any of methods to read' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(2, 7);

        activateDownArrowEvent(this.presenter);

        this.validateIsNotCalledAnyOfMethodsToRead();
    },

    // Tab event

    'test given view and TTS is active when moving to next editable cell then execute short form of method to read' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(1, 3);

        activateTabEvent(this.presenter);

        this.validateIsCalledOnlyShortFormOfMethodToRead();
    },

    'test given view and TTS is active when moving to next constant cell then execute short form of method to read' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(6, 5);

        activateTabEvent(this.presenter);

        this.validateIsCalledOnlyShortFormOfMethodToRead();
    },

    // Tab + shift event

    'test given view and TTS is active when moving to previous editable cell then execute short form of method to read' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(3, 1);

        activateShiftTabEvent(this.presenter);

        this.validateIsCalledOnlyShortFormOfMethodToRead();
    },

    'test given view and TTS is active when moving to previous constant cell then execute short form of method to read' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(2, 4);

        activateShiftTabEvent(this.presenter);

        this.validateIsCalledOnlyShortFormOfMethodToRead();
    },

    // Enter event

    'test given view and TTS is active when activating enter on editable cell then execute full form of method to read' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(3, 0);

        activateEnterEvent(this.presenter);

        this.validateIsCalledOnlyFullFormOfMethodToRead();
    },

    'test given view and TTS is active when activating enter on constant cell then execute full form of method to read' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(1, 0);

        activateEnterEvent(this.presenter);

        this.validateIsCalledOnlyFullFormOfMethodToRead();
    },

    // Backspace event

    'test given view and TTS is active when activating backspace on constant cell then do not execute any of methods to read' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(1, 0);

        activateBackspaceEvent(this.presenter);

        this.validateIsNotCalledAnyOfMethodsToRead();
    },
});


TestCase("[Crossword] Read full form of current element tests - both numbering active", {

    setUp: function () {
        this.presenter = new Addoncrossword_create();

        this.presenter.rowCount = 9;
        this.presenter.columnCount = 10;
        this.presenter.tabIndexBase = 5000;
        this.presenter.crossword = getCrosswordForNavigationTests();
        this.presenter.wordNumbersHorizontal = true;
        this.presenter.wordNumbersVertical = true;
        this.presenter.configuration = {
            langTag: ""
        };

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
        };

        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;

        this.presenter.onCellInputFocus = sinon.spy(() => {});
        this.presenter.onCellInputFocusOut = sinon.spy(() => {});

        this.view = document.createElement('div');
        this.presenter.$view = $(this.view);
        this.presenter.prepareCorrectAnswers();
        this.presenter.createGrid();
        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
        this.presenter.setSpeechTexts();
        this.activateTTSWithoutReading();
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    markAndFocusElementWithPosition: function (x, y) {
        let newIndex = (this.keyboardControllerObject.columnsCount * y) + x;
        if (this.keyboardControllerObject.keyboardNavigationCurrentElement) {
            this.keyboardControllerObject.unmark(this.keyboardControllerObject.keyboardNavigationCurrentElement);
        }
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = newIndex;
        this.keyboardControllerObject.keyboardNavigationCurrentElement = this.keyboardControllerObject.keyboardNavigationElements[newIndex];
        this.keyboardControllerObject.mark(this.keyboardControllerObject.keyboardNavigationCurrentElement);
    },

    fillInKeyboardControllerCurrentElement: function () {
        $(this.keyboardControllerObject.getCurrentInputElement()).val("X");
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

    markAsCorrectCurrentElement: function () {
        $(this.keyboardControllerObject.getCurrentElement()).addClass(this.presenter.CSS_CLASSES.CELL_VALID);
    },

    markAsWrongCurrentElement: function () {
        $(this.keyboardControllerObject.getCurrentElement()).addClass(this.presenter.CSS_CLASSES.CELL_INVALID);
    },

    'test given empty editable cell representing char of horizontal word when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(2, 1);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell C 2",
            "across 4",
            "3 out of 8",
            "empty",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given filled in editable cell representing char of horizontal word when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(2, 1);
        this.fillInKeyboardControllerCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell C 2",
            "across 4",
            "3 out of 8",
            "X",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given empty editable cell representing char of vertical word when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 2);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 3",
            "down 2",
            "3 out of 7",
            "empty",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given filled in editable cell representing char of vertical word when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 2);
        this.fillInKeyboardControllerCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 3",
            "down 2",
            "3 out of 7",
            "X",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given empty editable cell representing char of vertical and horizontal words when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 1);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 2",
            "across 4",
            "4 out of 8",
            "down 2",
            "2 out of 7",
            "empty",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given filled in editable cell representing char of vertical and horizontal words when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 1);
        this.fillInKeyboardControllerCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 2",
            "across 4",
            "4 out of 8",
            "down 2",
            "2 out of 7",
            "X",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given empty editable cell representing char not belonging to any of words when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(8, 6);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell I 7",
            "empty",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given filled in editable cell representing char not belonging to any of words when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(8, 6);
        this.fillInKeyboardControllerCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell I 7",
            "X",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given constant cell representing char of horizontal word when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(7, 5);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell H 6",
            "across 9",
            "7 out of 7",
            "E",
            "disabled",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given constant cell representing char of vertical word when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(1, 0);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell B 1",
            "down 1",
            "1 out of 7",
            "G",
            "disabled",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given constant cell representing char of vertical and horizontal words when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 3);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 4",
            "across 5",
            "3 out of 7",
            "down 2",
            "4 out of 7",
            "M",
            "disabled",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given editable cell marked as correct when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 1);
        this.fillInKeyboardControllerCurrentElement();
        this.markAsCorrectCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 2",
            "across 4",
            "4 out of 8",
            "down 2",
            "2 out of 7",
            "X",
            "correct",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given editable cell marked as wrong when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 1);
        this.fillInKeyboardControllerCurrentElement();
        this.markAsWrongCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 2",
            "across 4",
            "4 out of 8",
            "down 2",
            "2 out of 7",
            "X",
            "wrong",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given constant cell marked as correct when calling full form of read method then do not speak about correctness' : function() {
        this.markAndFocusElementWithPosition(3, 3);
        this.markAsCorrectCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 4",
            "across 5",
            "3 out of 7",
            "down 2",
            "4 out of 7",
            "M",
            "disabled",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given constant cell marked as wrong when calling full form of read method then do not speak about correctness' : function() {
        this.markAndFocusElementWithPosition(3, 3);
        this.markAsWrongCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 4",
            "across 5",
            "3 out of 7",
            "down 2",
            "4 out of 7",
            "M",
            "disabled",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },
});

TestCase("[Crossword] Read full form of current element tests - vertical numbering active", {

    setUp: function () {
        this.presenter = new Addoncrossword_create();

        this.presenter.rowCount = 9;
        this.presenter.columnCount = 10;
        this.presenter.tabIndexBase = 5000;
        this.presenter.crossword = getCrosswordForNavigationTests();
        this.presenter.wordNumbersHorizontal = false;
        this.presenter.wordNumbersVertical = true;
        this.presenter.configuration = {
            langTag: ""
        };

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
        };

        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;

        this.presenter.onCellInputFocus = sinon.spy(() => {});
        this.presenter.onCellInputFocusOut = sinon.spy(() => {});

        this.view = document.createElement('div');
        this.presenter.$view = $(this.view);
        this.presenter.prepareCorrectAnswers();
        this.presenter.createGrid();
        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
        this.presenter.setSpeechTexts();
        this.activateTTSWithoutReading();
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    markAndFocusElementWithPosition: function (x, y) {
        let newIndex = (this.keyboardControllerObject.columnsCount * y) + x;
        if (this.keyboardControllerObject.keyboardNavigationCurrentElement) {
            this.keyboardControllerObject.unmark(this.keyboardControllerObject.keyboardNavigationCurrentElement);
        }
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = newIndex;
        this.keyboardControllerObject.keyboardNavigationCurrentElement = this.keyboardControllerObject.keyboardNavigationElements[newIndex];
        this.keyboardControllerObject.mark(this.keyboardControllerObject.keyboardNavigationCurrentElement);
    },

    fillInKeyboardControllerCurrentElement: function () {
        $(this.keyboardControllerObject.getCurrentInputElement()).val("X");
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

    markAsCorrectCurrentElement: function () {
        $(this.keyboardControllerObject.getCurrentElement()).addClass(this.presenter.CSS_CLASSES.CELL_VALID);
    },

    markAsWrongCurrentElement: function () {
        $(this.keyboardControllerObject.getCurrentElement()).addClass(this.presenter.CSS_CLASSES.CELL_INVALID);
    },

    'test given empty editable cell representing char of horizontal word when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(2, 1);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell C 2",
            "empty",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given filled in editable cell representing char of horizontal word when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(2, 1);
        this.fillInKeyboardControllerCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell C 2",
            "X",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given empty editable cell representing char of vertical word when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 2);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 3",
            "down 2",
            "3 out of 7",
            "empty",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given filled in editable cell representing char of vertical word when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 2);
        this.fillInKeyboardControllerCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 3",
            "down 2",
            "3 out of 7",
            "X",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given empty editable cell representing char of vertical and horizontal words when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 1);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 2",
            "down 2",
            "2 out of 7",
            "empty",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given filled in editable cell representing char of vertical and horizontal words when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 1);
        this.fillInKeyboardControllerCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 2",
            "down 2",
            "2 out of 7",
            "X",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given empty editable cell representing char not belonging to any of words when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(8, 6);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell I 7",
            "empty",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given filled in editable cell representing char not belonging to any of words when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(8, 6);
        this.fillInKeyboardControllerCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell I 7",
            "X",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given constant cell representing char of horizontal word when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(7, 5);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell H 6",
            "E",
            "disabled",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given constant cell representing char of vertical word when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(1, 0);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell B 1",
            "down 1",
            "1 out of 7",
            "G",
            "disabled",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given constant cell representing char of vertical and horizontal words when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 3);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 4",
            "down 2",
            "4 out of 7",
            "M",
            "disabled",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given editable cell marked as correct when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 1);
        this.fillInKeyboardControllerCurrentElement();
        this.markAsCorrectCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 2",
            "down 2",
            "2 out of 7",
            "X",
            "correct",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given editable cell marked as wrong when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 1);
        this.fillInKeyboardControllerCurrentElement();
        this.markAsWrongCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 2",
            "down 2",
            "2 out of 7",
            "X",
            "wrong",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given constant cell marked as correct when calling full form of read method then do not speak about correctness' : function() {
        this.markAndFocusElementWithPosition(3, 3);
        this.markAsCorrectCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 4",
            "down 2",
            "4 out of 7",
            "M",
            "disabled",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given constant cell marked as wrong when calling full form of read method then do not speak about correctness' : function() {
        this.markAndFocusElementWithPosition(3, 3);
        this.markAsWrongCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 4",
            "down 2",
            "4 out of 7",
            "M",
            "disabled",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },
});

TestCase("[Crossword] Read full form of current element tests - horizontal numbering active", {

    setUp: function () {
        this.presenter = new Addoncrossword_create();

        this.presenter.rowCount = 9;
        this.presenter.columnCount = 10;
        this.presenter.tabIndexBase = 5000;
        this.presenter.crossword = getCrosswordForNavigationTests();
        this.presenter.wordNumbersHorizontal = true;
        this.presenter.wordNumbersVertical = false;
        this.presenter.configuration = {
            langTag: ""
        };

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
        };

        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;

        this.presenter.onCellInputFocus = sinon.spy(() => {});
        this.presenter.onCellInputFocusOut = sinon.spy(() => {});

        this.view = document.createElement('div');
        this.presenter.$view = $(this.view);
        this.presenter.prepareCorrectAnswers();
        this.presenter.createGrid();
        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
        this.presenter.setSpeechTexts();
        this.activateTTSWithoutReading();
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    markAndFocusElementWithPosition: function (x, y) {
        let newIndex = (this.keyboardControllerObject.columnsCount * y) + x;
        if (this.keyboardControllerObject.keyboardNavigationCurrentElement) {
            this.keyboardControllerObject.unmark(this.keyboardControllerObject.keyboardNavigationCurrentElement);
        }
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = newIndex;
        this.keyboardControllerObject.keyboardNavigationCurrentElement = this.keyboardControllerObject.keyboardNavigationElements[newIndex];
        this.keyboardControllerObject.mark(this.keyboardControllerObject.keyboardNavigationCurrentElement);
    },

    fillInKeyboardControllerCurrentElement: function () {
        $(this.keyboardControllerObject.getCurrentInputElement()).val("X");
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

    markAsCorrectCurrentElement: function () {
        $(this.keyboardControllerObject.getCurrentElement()).addClass(this.presenter.CSS_CLASSES.CELL_VALID);
    },

    markAsWrongCurrentElement: function () {
        $(this.keyboardControllerObject.getCurrentElement()).addClass(this.presenter.CSS_CLASSES.CELL_INVALID);
    },

    'test given empty editable cell representing char of horizontal word when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(2, 1);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell C 2",
            "across 1",
            "3 out of 8",
            "empty",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given filled in editable cell representing char of horizontal word when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(2, 1);
        this.fillInKeyboardControllerCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell C 2",
            "across 1",
            "3 out of 8",
            "X",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given empty editable cell representing char of vertical word when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 2);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 3",
            "empty",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given filled in editable cell representing char of vertical word when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 2);
        this.fillInKeyboardControllerCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 3",
            "X",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given empty editable cell representing char of vertical and horizontal words when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 1);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 2",
            "across 1",
            "4 out of 8",
            "empty",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given filled in editable cell representing char of vertical and horizontal words when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 1);
        this.fillInKeyboardControllerCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 2",
            "across 1",
            "4 out of 8",
            "X",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given empty editable cell representing char not belonging to any of words when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(8, 6);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell I 7",
            "empty",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given filled in editable cell representing char not belonging to any of words when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(8, 6);
        this.fillInKeyboardControllerCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell I 7",
            "X",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given constant cell representing char of horizontal word when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(7, 5);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell H 6",
            "across 4",
            "7 out of 7",
            "E",
            "disabled",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given constant cell representing char of vertical word when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(1, 0);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell B 1",
            "G",
            "disabled",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given constant cell representing char of vertical and horizontal words when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 3);

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 4",
            "across 2",
            "3 out of 7",
            "M",
            "disabled",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given editable cell marked as correct when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 1);
        this.fillInKeyboardControllerCurrentElement();
        this.markAsCorrectCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 2",
            "across 1",
            "4 out of 8",
            "X",
            "correct",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given editable cell marked as wrong when calling full form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(3, 1);
        this.fillInKeyboardControllerCurrentElement();
        this.markAsWrongCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 2",
            "across 1",
            "4 out of 8",
            "X",
            "wrong",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given constant cell marked as correct when calling full form of read method then do not speak about correctness' : function() {
        this.markAndFocusElementWithPosition(3, 3);
        this.markAsCorrectCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 4",
            "across 2",
            "3 out of 7",
            "M",
            "disabled",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given constant cell marked as wrong when calling full form of read method then do not speak about correctness' : function() {
        this.markAndFocusElementWithPosition(3, 3);
        this.markAsWrongCurrentElement();

        this.keyboardControllerObject.readCurrentElement();

        const expectedTexts = [
            "cell D 4",
            "across 2",
            "3 out of 7",
            "M",
            "disabled",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },
});

TestCase("[Crossword] Read short form of current element tests", {

    setUp: function () {
        this.presenter = new Addoncrossword_create();

        this.presenter.rowCount = 9;
        this.presenter.columnCount = 10;
        this.presenter.tabIndexBase = 5000;
        this.presenter.crossword = getCrosswordForNavigationTests();
        this.presenter.configuration = {
            langTag: ""
        };

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
        };

        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;

        this.presenter.onCellInputFocus = sinon.spy(() => {});
        this.presenter.onCellInputFocusOut = sinon.spy(() => {});

        this.view = document.createElement('div');
        this.presenter.$view = $(this.view);
        this.presenter.prepareCorrectAnswers();
        this.presenter.createGrid();
        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
        this.presenter.setSpeechTexts();
        this.activateTTSWithoutReading();
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    markAndFocusElementWithPosition: function (x, y) {
        let newIndex = (this.keyboardControllerObject.columnsCount * y) + x;
        if (this.keyboardControllerObject.keyboardNavigationCurrentElement) {
            this.keyboardControllerObject.unmark(this.keyboardControllerObject.keyboardNavigationCurrentElement);
        }
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = newIndex;
        this.keyboardControllerObject.keyboardNavigationCurrentElement = this.keyboardControllerObject.keyboardNavigationElements[newIndex];
        this.keyboardControllerObject.mark(this.keyboardControllerObject.keyboardNavigationCurrentElement);
    },

    fillInKeyboardControllerCurrentElement: function () {
        $(this.keyboardControllerObject.getCurrentInputElement()).val("X");
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

    markAsCorrectCurrentElement: function () {
        $(this.keyboardControllerObject.getCurrentElement()).addClass(this.presenter.CSS_CLASSES.CELL_VALID);
    },

    markAsWrongCurrentElement: function () {
        $(this.keyboardControllerObject.getCurrentElement()).addClass(this.presenter.CSS_CLASSES.CELL_INVALID);
    },

    'test given empty editable cell when calling short form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(2, 1);

        this.keyboardControllerObject.readCurrentElementInShortForm();

        const expectedTexts = [
            "cell C 2",
            "empty",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given filled in editable cell when calling short form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(2, 1);
        this.fillInKeyboardControllerCurrentElement();

        this.keyboardControllerObject.readCurrentElementInShortForm();

        const expectedTexts = [
            "cell C 2",
            "X",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given constant cell when calling short form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(7, 5);

        this.keyboardControllerObject.readCurrentElementInShortForm();

        const expectedTexts = [
            "cell H 6",
            "E",
            "disabled",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given editable cell marked as correct when calling short form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(2, 1);
        this.fillInKeyboardControllerCurrentElement();
        this.markAsCorrectCurrentElement();

        this.keyboardControllerObject.readCurrentElementInShortForm();

        const expectedTexts = [
            "cell C 2",
            "X",
            "correct",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given editable cell marked as wrong when calling short form of read method then speak with correct TTS' : function() {
        this.markAndFocusElementWithPosition(2, 1);
        this.fillInKeyboardControllerCurrentElement();
        this.markAsWrongCurrentElement();

        this.keyboardControllerObject.readCurrentElementInShortForm();

        const expectedTexts = [
            "cell C 2",
            "X",
            "wrong",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given constant cell marked as correct when calling short form of read method then do not speak about correctness' : function() {
        this.markAndFocusElementWithPosition(3, 3);
        this.markAsCorrectCurrentElement();

        this.keyboardControllerObject.readCurrentElementInShortForm();

        const expectedTexts = [
            "cell D 4",
            "M",
            "disabled",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },

    'test given constant cell marked as wrong when calling short form of read method then do not speak about correctness' : function() {
        this.markAndFocusElementWithPosition(3, 3);
        this.markAsWrongCurrentElement();

        this.keyboardControllerObject.readCurrentElementInShortForm();

        const expectedTexts = [
            "cell D 4",
            "M",
            "disabled",
        ]
        this.validateAreEqualExpectedTextsToSpokenTexts(expectedTexts);
    },
});
