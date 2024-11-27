TestCase("[Crossword] Set direction when move methods executed tests", {

    setUp: function () {
        this.presenter = new Addoncrossword_create();

        this.presenter.rowCount = 3;
        this.presenter.columnCount = 3;
        this.presenter.tabIndexBase = 5000;
        this.presenter.crossword = [
            [" ", " ", " "],
            [" ", "B", " "],
            [" ", " ", " "],
        ];
        this.presenter.configuration = {
            langTag: ""
        };

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
            isAutoNavigationInOffMode: sinon.stub(),
            isAutoNavigationInSimpleMode: sinon.stub(),
            isAutoNavigationInExtendedMode: sinon.stub(),
        };

        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;

        this.presenter.onCellInputFocus = sinon.spy(() => {});
        this.presenter.onCellInputFocusOut = sinon.spy(() => {});

        this.view = document.createElement('div');
        this.presenter.$view = $(this.view);
        this.presenter.createGrid();
        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
        this.presenter.setSpeechTexts();
    },

    setAutoNavigationInOffMode: function () {
        this.stubs.isAutoNavigationInOffMode.returns(true);
        this.stubs.isAutoNavigationInSimpleMode.returns(false);
        this.stubs.isAutoNavigationInExtendedMode.returns(false);
        this.setToPresenterMethodsStubs();
    },

    setAutoNavigationInSimpleMode: function () {
        this.stubs.isAutoNavigationInOffMode.returns(false);
        this.stubs.isAutoNavigationInSimpleMode.returns(true);
        this.stubs.isAutoNavigationInExtendedMode.returns(false);
        this.setToPresenterMethodsStubs();
    },

    setAutoNavigationInExtendedMode: function () {
        this.stubs.isAutoNavigationInOffMode.returns(false);
        this.stubs.isAutoNavigationInSimpleMode.returns(false);
        this.stubs.isAutoNavigationInExtendedMode.returns(true);
        this.setToPresenterMethodsStubs();
    },

    setToPresenterMethodsStubs: function () {
        this.presenter.isAutoNavigationInOffMode = this.stubs.isAutoNavigationInOffMode;
        this.presenter.isAutoNavigationInSimpleMode = this.stubs.isAutoNavigationInSimpleMode;
        this.presenter.isAutoNavigationInExtendedMode = this.stubs.isAutoNavigationInExtendedMode;
    },

    activateKeyboardNavigation: function() {
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    focusAndGetEditableElement: function () {
        let cellInput = this.presenter.$view.find(`.cell_row_${1}.cell_column_${1}`).find("input")[0];
        $(cellInput).focus();
        return cellInput;
    },

    markAndFocusKeyboardNavigationEditableElement: function () {
        let newIndex = (this.keyboardControllerObject.columnsCount * 1) + 1;
        if (this.keyboardControllerObject.keyboardNavigationCurrentElement) {
            this.keyboardControllerObject.unmark(this.keyboardControllerObject.keyboardNavigationCurrentElement);
        }
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = newIndex;
        this.keyboardControllerObject.keyboardNavigationCurrentElement = this.keyboardControllerObject.keyboardNavigationElements[newIndex];
        this.keyboardControllerObject.mark(this.keyboardControllerObject.keyboardNavigationCurrentElement);
    },

    // Left arrow event

    'test given view, extended auto navigation mode and keyboard navigation is not active when activated left arrow then set horizontal direction' : function() {
        this.setAutoNavigationInExtendedMode();
        let cellInput = this.focusAndGetEditableElement();

        activateLeftArrowEventOnCellInput(cellInput);

        assertTrue(this.presenter.isHorizontalDirection());
    },

    'test given view, extended auto navigation mode and keyboard navigation is active when activated left arrow then set horizontal direction' : function() {
        this.setAutoNavigationInExtendedMode();
        this.activateKeyboardNavigation();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateLeftArrowEvent(this.presenter);

        assertTrue(this.presenter.isHorizontalDirection());
    },

    'test given view, extended auto navigation mode and TTS is active when activated left arrow then set horizontal direction' : function() {
        this.setAutoNavigationInExtendedMode();
        this.activateTTSWithoutReading();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateLeftArrowEvent(this.presenter);

        assertTrue(this.presenter.isHorizontalDirection());
    },

    'test given view, simple auto navigation mode and keyboard navigation is not active when activated left arrow then set horizontal direction' : function() {
        this.setAutoNavigationInSimpleMode();
        let cellInput = this.focusAndGetEditableElement();

        activateLeftArrowEventOnCellInput(cellInput);

        assertTrue(this.presenter.isHorizontalDirection());
    },

    'test given view, simple auto navigation mode and keyboard navigation is active when activated left arrow then set horizontal direction' : function() {
        this.setAutoNavigationInSimpleMode();
        this.activateKeyboardNavigation();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateLeftArrowEvent(this.presenter);

        assertTrue(this.presenter.isHorizontalDirection());
    },

    'test given view, simple auto navigation mode and TTS is active when activated left arrow then set horizontal direction' : function() {
        this.setAutoNavigationInSimpleMode();
        this.activateTTSWithoutReading();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateLeftArrowEvent(this.presenter);

        assertTrue(this.presenter.isHorizontalDirection());
    },

    'test given view, off auto navigation mode and keyboard navigation is not active when activated left arrow then do not set direction' : function() {
        this.setAutoNavigationInOffMode();
        let cellInput = this.focusAndGetEditableElement();

        activateLeftArrowEventOnCellInput(cellInput);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given view, off auto navigation mode and keyboard navigation is active when activated left arrow then do not set direction' : function() {
        this.setAutoNavigationInOffMode();
        this.activateKeyboardNavigation();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateLeftArrowEvent(this.presenter);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given view, off auto navigation mode and TTS is active when activated left arrow then do not set direction' : function() {
        this.setAutoNavigationInOffMode();
        this.activateTTSWithoutReading();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateLeftArrowEvent(this.presenter);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    // Right arrow event

    'test given view, extended auto navigation mode and keyboard navigation is not active when activated right arrow then set horizontal direction' : function() {
        this.setAutoNavigationInExtendedMode();
        let cellInput = this.focusAndGetEditableElement();

        activateRightArrowEventOnCellInput(cellInput);

        assertTrue(this.presenter.isHorizontalDirection());
    },

    'test given view, extended auto navigation mode and keyboard navigation is active when activated right arrow then set horizontal direction' : function() {
        this.setAutoNavigationInExtendedMode();
        this.activateKeyboardNavigation();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateRightArrowEvent(this.presenter);

        assertTrue(this.presenter.isHorizontalDirection());
    },

    'test given view, extended auto navigation mode and TTS is active when activated right arrow then set horizontal direction' : function() {
        this.setAutoNavigationInExtendedMode();
        this.activateTTSWithoutReading();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateRightArrowEvent(this.presenter);

        assertTrue(this.presenter.isHorizontalDirection());
    },

    'test given view, simple auto navigation mode and keyboard navigation is not active when activated right arrow then set horizontal direction' : function() {
        this.setAutoNavigationInSimpleMode();
        let cellInput = this.focusAndGetEditableElement();

        activateRightArrowEventOnCellInput(cellInput);

        assertTrue(this.presenter.isHorizontalDirection());
    },

    'test given view, simple auto navigation mode and keyboard navigation is active when activated right arrow then set horizontal direction' : function() {
        this.setAutoNavigationInSimpleMode();
        this.activateKeyboardNavigation();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateRightArrowEvent(this.presenter);

        assertTrue(this.presenter.isHorizontalDirection());
    },

    'test given view, simple auto navigation mode and TTS is active when activated right arrow then set horizontal direction' : function() {
        this.setAutoNavigationInSimpleMode();
        this.activateTTSWithoutReading();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateRightArrowEvent(this.presenter);

        assertTrue(this.presenter.isHorizontalDirection());
    },

    'test given view, off auto navigation mode and keyboard navigation is not active when activated right arrow then do not set direction' : function() {
        this.setAutoNavigationInOffMode();
        let cellInput = this.focusAndGetEditableElement();

        activateRightArrowEventOnCellInput(cellInput);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given view, off auto navigation mode and keyboard navigation is active when activated right arrow then do not set direction' : function() {
        this.setAutoNavigationInOffMode();
        this.activateKeyboardNavigation();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateRightArrowEvent(this.presenter);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given view, off auto navigation mode and TTS is active when activated right arrow then do not set direction' : function() {
        this.setAutoNavigationInOffMode();
        this.activateTTSWithoutReading();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateRightArrowEvent(this.presenter);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    // Up arrow event

    'test given view, extended auto navigation mode and keyboard navigation is not active when activated up arrow then set vertical direction' : function() {
        this.setAutoNavigationInExtendedMode();
        let cellInput = this.focusAndGetEditableElement();

        activateUpArrowEventOnCellInput(cellInput);

        assertTrue(this.presenter.isVerticalDirection());
    },

    'test given view, extended auto navigation mode and keyboard navigation is active when activated up arrow then set vertical direction' : function() {
        this.setAutoNavigationInExtendedMode();
        this.activateKeyboardNavigation();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateUpArrowEvent(this.presenter);

        assertTrue(this.presenter.isVerticalDirection());
    },

    'test given view, extended auto navigation mode and TTS is active when activated up arrow then set vertical direction' : function() {
        this.setAutoNavigationInExtendedMode();
        this.activateTTSWithoutReading();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateUpArrowEvent(this.presenter);

        assertTrue(this.presenter.isVerticalDirection());
    },

    'test given view, simple auto navigation mode and keyboard navigation is not active when activated up arrow then set vertical direction' : function() {
        this.setAutoNavigationInSimpleMode();
        let cellInput = this.focusAndGetEditableElement();

        activateUpArrowEventOnCellInput(cellInput);

        assertTrue(this.presenter.isVerticalDirection());
    },

    'test given view, simple auto navigation mode and keyboard navigation is active when activated up arrow then set vertical direction' : function() {
        this.setAutoNavigationInSimpleMode();
        this.activateKeyboardNavigation();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateUpArrowEvent(this.presenter);

        assertTrue(this.presenter.isVerticalDirection());
    },

    'test given view, simple auto navigation mode and TTS is active when activated up arrow then set vertical direction' : function() {
        this.setAutoNavigationInSimpleMode();
        this.activateTTSWithoutReading();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateUpArrowEvent(this.presenter);

        assertTrue(this.presenter.isVerticalDirection());
    },

    'test given view, off auto navigation mode and keyboard navigation is not active when activated up arrow then not set vertical direction' : function() {
        this.setAutoNavigationInOffMode();
        let cellInput = this.focusAndGetEditableElement();

        activateUpArrowEventOnCellInput(cellInput);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given view, off auto navigation mode and keyboard navigation is active when activated up arrow then not set vertical direction' : function() {
        this.setAutoNavigationInOffMode();
        this.activateKeyboardNavigation();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateUpArrowEvent(this.presenter);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given view, off auto navigation mode and TTS is active when activated up arrow then not set vertical direction' : function() {
        this.setAutoNavigationInOffMode();
        this.activateTTSWithoutReading();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateUpArrowEvent(this.presenter);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    // Down arrow event

    'test given view, extended auto navigation mode and keyboard navigation is not active when activated down arrow then set vertical direction' : function() {
        this.setAutoNavigationInExtendedMode();
        let cellInput = this.focusAndGetEditableElement();

        activateDownArrowEventOnCellInput(cellInput);

        assertTrue(this.presenter.isVerticalDirection());
    },

    'test given view, extended auto navigation mode and keyboard navigation is active when activated down arrow then set vertical direction' : function() {
        this.setAutoNavigationInExtendedMode();
        this.activateKeyboardNavigation();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateDownArrowEvent(this.presenter);

        assertTrue(this.presenter.isVerticalDirection());
    },

    'test given view, extended auto navigation mode and TTS is active when activated down arrow then set vertical direction' : function() {
        this.setAutoNavigationInExtendedMode();
        this.activateTTSWithoutReading();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateDownArrowEvent(this.presenter);

        assertTrue(this.presenter.isVerticalDirection());
    },

    'test given view, simple auto navigation mode and keyboard navigation is not active when activated down arrow then set vertical direction' : function() {
        this.setAutoNavigationInSimpleMode();
        let cellInput = this.focusAndGetEditableElement();

        activateDownArrowEventOnCellInput(cellInput);

        assertTrue(this.presenter.isVerticalDirection());
    },

    'test given view, simple auto navigation mode and keyboard navigation is active when activated down arrow then set vertical direction' : function() {
        this.setAutoNavigationInSimpleMode();
        this.activateKeyboardNavigation();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateDownArrowEvent(this.presenter);

        assertTrue(this.presenter.isVerticalDirection());
    },

    'test given view, simple auto navigation mode and TTS is active when activated down arrow then set vertical direction' : function() {
        this.setAutoNavigationInSimpleMode();
        this.activateTTSWithoutReading();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateDownArrowEvent(this.presenter);

        assertTrue(this.presenter.isVerticalDirection());
    },

    'test given view, off auto navigation mode and keyboard navigation is not active when activated down arrow then do not set direction' : function() {
        this.setAutoNavigationInOffMode();
        let cellInput = this.focusAndGetEditableElement();

        activateDownArrowEventOnCellInput(cellInput);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given view, off auto navigation mode and keyboard navigation is active when activated down arrow then do not set direction' : function() {
        this.setAutoNavigationInOffMode();
        this.activateKeyboardNavigation();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateDownArrowEvent(this.presenter);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given view, off auto navigation mode and TTS is active when activated down arrow then do not set direction' : function() {
        this.setAutoNavigationInOffMode();
        this.activateTTSWithoutReading();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateDownArrowEvent(this.presenter);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    // Tab event

    'test given view, extended auto navigation mode and keyboard navigation is not active when activated Tab then set TabIndex direction' : function() {
        this.setAutoNavigationInExtendedMode();
        let cellInput = this.focusAndGetEditableElement();

        activateTabEventOnCellInput(cellInput);

        assertTrue(this.presenter.isTabIndexDirection());
    },

    'test given view, extended auto navigation mode and keyboard navigation is active when activated Tab then set TabIndex direction' : function() {
        this.setAutoNavigationInExtendedMode();
        this.activateKeyboardNavigation();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateTabEvent(this.presenter);

        assertTrue(this.presenter.isTabIndexDirection());
    },

    'test given view, extended auto navigation mode and TTS is active when activated Tab then set TabIndex direction' : function() {
        this.setAutoNavigationInExtendedMode();
        this.activateTTSWithoutReading();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateTabEvent(this.presenter);

        assertTrue(this.presenter.isTabIndexDirection());
    },

    'test given view, simple auto navigation mode and keyboard navigation is not active when activated Tab then do not set direction' : function() {
        this.setAutoNavigationInSimpleMode();
        let cellInput = this.focusAndGetEditableElement();

        activateTabEventOnCellInput(cellInput);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given view, simple auto navigation mode and keyboard navigation is active when activated Tab then do not set direction' : function() {
        this.setAutoNavigationInSimpleMode();
        this.activateKeyboardNavigation();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateTabEvent(this.presenter);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given view, simple auto navigation mode and TTS is active when activated Tab then do not set direction' : function() {
        this.setAutoNavigationInSimpleMode();
        this.activateTTSWithoutReading();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateTabEvent(this.presenter);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given view, off auto navigation mode and keyboard navigation is not active when activated Tab then do not set direction' : function() {
        this.setAutoNavigationInOffMode();
        let cellInput = this.focusAndGetEditableElement();

        activateTabEventOnCellInput(cellInput);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given view, off auto navigation mode and keyboard navigation is active when activated Tab then do not set direction' : function() {
        this.setAutoNavigationInOffMode();
        this.activateKeyboardNavigation();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateTabEvent(this.presenter);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given view, off auto navigation mode and TTS is active when activated Tab then do not set direction' : function() {
        this.setAutoNavigationInOffMode();
        this.activateTTSWithoutReading();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateTabEvent(this.presenter);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    // Tab + shift event

    'test given view, extended auto navigation mode and keyboard navigation is not active when activated Tab + shift then set TabIndex direction' : function() {
        this.setAutoNavigationInExtendedMode();
        let cellInput = this.focusAndGetEditableElement();

        activateShiftTabEventOnCellInput(cellInput);

        assertTrue(this.presenter.isTabIndexDirection());
    },

    'test given view, extended auto navigation mode and keyboard navigation is active when activated Tab + shift then set TabIndex direction' : function() {
        this.setAutoNavigationInExtendedMode();
        this.activateKeyboardNavigation();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateShiftTabEvent(this.presenter);

        assertTrue(this.presenter.isTabIndexDirection());
    },

    'test given view, extended auto navigation mode and TTS is active when activated Tab + shift then set TabIndex direction' : function() {
        this.setAutoNavigationInExtendedMode();
        this.activateTTSWithoutReading();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateShiftTabEvent(this.presenter);

        assertTrue(this.presenter.isTabIndexDirection());
    },

    'test given view, simple auto navigation mode and keyboard navigation is not active when activated Tab + shift then do not set direction' : function() {
        this.setAutoNavigationInSimpleMode();
        let cellInput = this.focusAndGetEditableElement();

        activateShiftTabEventOnCellInput(cellInput);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given view, simple auto navigation mode and keyboard navigation is active when activated Tab + shift then do not set direction' : function() {
        this.setAutoNavigationInSimpleMode();
        this.activateKeyboardNavigation();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateShiftTabEvent(this.presenter);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given view, simple auto navigation mode and TTS is active when activated Tab + shift then do not set direction' : function() {
        this.setAutoNavigationInSimpleMode();
        this.activateTTSWithoutReading();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateShiftTabEvent(this.presenter);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given view, off auto navigation mode and keyboard navigation is not active when activated Tab + shift then do not set direction' : function() {
        this.setAutoNavigationInOffMode();
        let cellInput = this.focusAndGetEditableElement();

        activateShiftTabEventOnCellInput(cellInput);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given view, off auto navigation mode and keyboard navigation is active when activated Tab + shift then do not set direction' : function() {
        this.setAutoNavigationInOffMode();
        this.activateKeyboardNavigation();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateShiftTabEvent(this.presenter);

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given view, off auto navigation mode and TTS is active when activated Tab + shift then do not set direction' : function() {
        this.setAutoNavigationInOffMode();
        this.activateTTSWithoutReading();
        this.markAndFocusKeyboardNavigationEditableElement();

        activateShiftTabEvent(this.presenter);

        assertTrue(this.presenter.isDirectionNotSet());
    },
});

TestCase("[Crossword] Keyboard controller and TTS move tests", {

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
            isAutoNavigationInOffMode: sinon.stub(),
            isAutoNavigationInSimpleMode: sinon.stub(),
            isAutoNavigationInExtendedMode: sinon.stub(),
        };

        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;

        this.stubs.isAutoNavigationInOffMode.returns(false);
        this.presenter.isAutoNavigationInOffMode = this.stubs.isAutoNavigationInOffMode;

        this.stubs.isAutoNavigationInSimpleMode.returns(false);
        this.presenter.isAutoNavigationInSimpleMode = this.stubs.isAutoNavigationInSimpleMode;

        this.stubs.isAutoNavigationInExtendedMode.returns(true);
        this.presenter.isAutoNavigationInExtendedMode = this.stubs.isAutoNavigationInExtendedMode;

        this.focusedCellInputPosition = undefined;

        this.presenter.onCellInputFocus = sinon.spy((event) => this.newOnCellInputFocus(event));
        this.presenter.onCellInputFocusOut = sinon.spy(() => {});

        this.view = document.createElement('div');
        this.presenter.$view = $(this.view);
        this.presenter.createGrid();
        this.presenter.prepareCorrectAnswers();
        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
        this.presenter.setSpeechTexts();
    },

    newOnCellInputFocus: function (event) {
        this.focusedCellInputPosition = this.presenter.getPosition($(event.target).parent(''));
    },

    activateKeyboardNavigation: function() {
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    getCellElement: function (x, y) {
        return this.presenter.$view.find(`.cell_row_${y}.cell_column_${x}`)[0];
    },

    validateIsCellMarkedAndCellInputFocused: function (x, y) {
        let expectedMarkedElement = this.getCellElement(x, y);
        this.validateIsElementHaveKeyboardNavigationActiveElementClass($(expectedMarkedElement));
        this.validateIsCellInputElementFocused(x, y);
    },

    validateIsCellMarkedAndCellInputNotFocused: function (x, y) {
        let expectedMarkedElement = this.getCellElement(x, y);
        this.validateIsElementHaveKeyboardNavigationActiveElementClass($(expectedMarkedElement));
        this.validateIsCellInputElementNotFocused(x, y);
    },

    validateIsCellInputElementFocused: function (x, y) {
        assertTrue(this.isCellInputElementFocused(x, y));
    },

    validateIsCellInputElementNotFocused: function (x, y) {
        assertFalse(this.isCellInputElementFocused(x, y));
    },

    isCellInputElementFocused: function (x, y) {
        console.log('isCellInputElementFocused ', this.focusedCellInputPosition)
        return !!this.focusedCellInputPosition
            && (this.focusedCellInputPosition.x === x
                && this.focusedCellInputPosition.y === y);
    },

    validateIsElementHaveKeyboardNavigationActiveElementClass: function ($element) {
        assertTrue($element.hasClass("keyboard_navigation_active_element"));
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

    focusAndGetEditableElementWithPosition: function (x, y) {
        let cellInput = this.presenter.$view.find(`.cell_row_${y}.cell_column_${x}`).find("input")[0];
        $(cellInput).focus();
        return cellInput;
    },

    // First enter tests

    'test given view when entering for the first time by keyboard navigation then tts.read should not be called' : function() {
        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when entering for the first time by TTS then mark first editable or constant cell and focus it input' : function() {
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        let expectedMarkedElement = this.getCellElement(1, 0);
        this.validateIsElementHaveKeyboardNavigationActiveElementClass($(expectedMarkedElement));
    },

    'test given view when entering for the first time by TTS then tts.read should be called' : function() {
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        assertTrue(this.tts.speak.called);
    },

    // Left arrow event - default navigation

    'test given view, keyboard navigation is not active and current element have on left editable cell when activated left arrow then move to next left editable cell' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(2, 1);

        activateLeftArrowEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(1, 1);
    },

    'test given view, keyboard navigation is not active and current element have on left constant cell and blank cell when activated left arrow then do not move' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(2, 4);

        activateLeftArrowEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(2, 4);
    },

    'test given view, keyboard navigation is not active and current element have on left constant cell and editable cell when activated left arrow then move to next left editable cell' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(6, 6);

        activateLeftArrowEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(4, 6);
    },

    'test given view, keyboard navigation is not active and current element have on left blank cell when activated left arrow then do not move' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(0, 6);

        activateLeftArrowEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(0, 6);
    },

    // Left arrow event - keyboard navigation

    'test given view, keyboard navigation is active and current element have on left editable cell when activated left arrow then move to next left editable cell' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(2, 1);

        activateLeftArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(1, 1);
    },

    'test given view, keyboard navigation is active and current element have on left constant cell and blank cell when activated left arrow then do not move' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(2, 4);

        activateLeftArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(2, 4);
    },

    'test given view, keyboard navigation is active and current element have on left constant cell and editable cell when activated left arrow then move to next left editable cell' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(6, 6);

        activateLeftArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(4, 6);
    },

    'test given view, keyboard navigation is active and current element have on left blank cell when activated left arrow then do not move' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(0, 6);

        activateLeftArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(0, 6);
    },

    // Left arrow event - keyboard navigation + TTS

    'test given view, TTS is active and current element have on left editable cell when activated left arrow then move to next left editable cell' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(2, 1);

        activateLeftArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(1, 1);
    },

    'test given view, TTS is active and current element have on left blank cell when activated left arrow then do not move' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(0, 6);

        activateLeftArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(0, 6);
    },

    // Right arrow event - default navigation

    'test given view, keyboard navigation is not active and current element have on right editable cell when activated right arrow then move to next right editable cell' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(4, 5);

        activateRightArrowEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(5, 5);
    },

    'test given view, keyboard navigation is not active and current element have on right constant cell and blank cell when activated right arrow then do not move' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(6, 5);

        activateRightArrowEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(6, 5);
    },

    'test given view, keyboard navigation is not active and current element have on right constant cell and editable cell when activated right arrow then move to next right editable cell' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(4, 6);

        activateRightArrowEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(6, 6);
    },

    'test given view, keyboard navigation is not active and current element have on right blank cell when activated right arrow then do not move' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(7, 3);

        activateRightArrowEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(7, 3);
    },

    // Right arrow event - keyboard navigation

    'test given view, keyboard navigation is active and current element have on right editable cell when activated right arrow then move to next right editable cell' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(4, 5);

        activateRightArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(5, 5);
    },

    'test given view, keyboard navigation is active and current element have on right constant cell and blank cell when activated right arrow then do not move' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(6, 5);

        activateRightArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(6, 5);
    },

    'test given view, keyboard navigation is active and current element have on right constant cell and editable cell when activated right arrow then move to next right editable cell' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(4, 6);

        activateRightArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(6, 6);
    },

    'test given view, keyboard navigation is active and current element have on right blank cell when activated right arrow then do not move' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(7, 3);

        activateRightArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(7, 3);
    },

    // Right arrow event - keyboard navigation + TTS

    'test given view, TTS is active and current element have on right editable cell when activated right arrow then move to next right editable cell' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(4, 5);

        activateRightArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(5, 5);
    },

    'test given view, TTS is active and current element have on right constant cell when activated right arrow then move to next right constant cell with focusing' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(6, 5);

        activateRightArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(7, 5);
    },

    'test given view, TTS is active and current element have on right blank cell when activated right arrow then do not move' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(7, 3);

        activateRightArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(7, 3);
    },

    // Up arrow event - default navigation

    'test given view, keyboard navigation is not active and current element have on up editable cell when activated up arrow then move to next up editable cell' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(3, 1);

        activateUpArrowEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(3, 0);
    },

    'test given view, keyboard navigation is not active and current element have on up constant cell and blank cell when activated up arrow then do not move' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(4, 4);

        activateUpArrowEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(4, 4);
    },

    'test given view, keyboard navigation is not active and current element have on up constant cell and editable cell when activated up arrow then move to next up editable cell' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(3, 4);

        activateUpArrowEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(3, 2);
    },

    'test given view, keyboard navigation is not active and current element have on up blank cell when activated up arrow then do not move' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(2, 1);

        activateUpArrowEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(2, 1);
    },

    // Up arrow event - keyboard navigation

    'test given view, keyboard navigation is active and current element have on up editable cell when activated up arrow then move to next up editable cell' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(3, 1);

        activateUpArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(3, 0);
    },

    'test given view, keyboard navigation is active and current element have on up constant cell and blank cell when activated up arrow then do not move' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(4, 4);

        activateUpArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(4, 4);
    },

    'test given view, keyboard navigation is active and current element have on up constant cell and editable cell when activated up arrow then move to next up editable cell' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(3, 4);

        activateUpArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(3, 2);
    },

    'test given view, keyboard navigation is active and current element have on up blank cell when activated up arrow then do not move' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(2, 1);

        activateUpArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(2, 1);
    },

    // Up arrow event - keyboard navigation + TTS

    'test given view, TTS is active and current element have on up editable cell when activated up arrow then move to next up editable cell' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(3, 1);

        activateUpArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(3, 0);
    },

    'test given view, TTS is active and current element have on up constant cell when activated up arrow then move to next up constant cell without focusing' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(4, 4);

        activateUpArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(4, 3);
    },

    'test given view, TTS is active and current element have on up blank cell when activated up arrow then do not move' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(2, 1);

        activateUpArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(2, 1);
    },

    // Down arrow event - default navigation

    'test given view, keyboard navigation is not active and current element have on down editable cell when activated down arrow then move to next down editable cell' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(3, 0);

        activateDownArrowEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(3, 1);
    },

    'test given view, keyboard navigation is not active and current element have on down constant cell and blank cell when activated down arrow then do not move' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(5, 5);

        activateDownArrowEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(5, 5);
    },

    'test given view, keyboard navigation is not active and current element have on down constant cell and editable cell when activated down arrow then move to next down editable cell' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(3, 2);

        activateDownArrowEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(3, 4);
    },

    'test given view, keyboard navigation is not active and current element have on down blank cell when activated down arrow then do not move' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(2, 7);

        activateDownArrowEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(2, 7);
    },

    // Down arrow event - keyboard navigation

    'test given view, keyboard navigation is active and current element have on down editable cell when activated down arrow then move to next down editable cell' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(3, 1);

        activateDownArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(3, 2);
    },

    'test given view, keyboard navigation is active and current element have on down constant cell and blank cell when activated down arrow then do not move' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(5, 5);

        activateDownArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(5, 5);
    },

    'test given view, keyboard navigation is active and current element have on down constant cell and editable cell when activated down arrow then move to next down editable cell' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(3, 2);

        activateDownArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(3, 4);
    },

    'test given view, keyboard navigation is active and current element have on down blank cell when activated down arrow then do not move' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(2, 7);

        activateDownArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(2, 7);
    },

    // Down arrow event - keyboard navigation + TTS

    'test given view, TTS is active and current element have on down editable cell when activated down arrow then move to next down editable cell' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(3, 1);

        activateDownArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(3, 2);
    },

    'test given view, TTS is active and current element have on down constant cell when activated down arrow then move to next down constant cell with focusing' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(5, 5);

        activateDownArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(5, 6);
    },

    'test given view, TTS is active and current element have on down blank cell when activated down arrow then do not move' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(2, 7);

        activateDownArrowEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(2, 7);
    },

    // Tab event - default navigation

    'test given view, keyboard navigation is not active and current element have on right editable cell when activated Tab then move to next right editable cell' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(1, 3);

        activateTabEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(2, 3);
    },

    'test given view, keyboard navigation is not active and current element have on right constant cell and blank cell when activated Tab then move to first editable cell of next row' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(6, 5);

        activateTabEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(0, 6);
    },

    'test given view, keyboard navigation is not active and current element have on right constant cell and editable cell when activated Tab then move to next right editable cell' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(4, 6);

        activateTabEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(6, 6);
    },

    'test given view, keyboard navigation is not active and current element have on right blank cell when activated Tab then move to first editable cell of next row' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(7, 3);

        activateTabEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(2, 4);
    },

    // Tab event - keyboard navigation

    'test given view, keyboard navigation is active and current element have on right editable cell when activated Tab then move to next right editable cell' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(1, 3);

        activateTabEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(2, 3);
    },

    'test given view, keyboard navigation is active and current element have on right constant cell and blank cell when activated Tab then move to first editable cell of next row' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(6, 5);

        activateTabEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(0, 6);
    },

    'test given view, keyboard navigation is active, current element is disabled and have blank cell on right then move to first editable cell of next row' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(7, 5);

        activateTabEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(0, 6);
    },

    'test given view, keyboard navigation is active and current element have on right blank cell when activated Tab then move to first editable cell of next row' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(7, 3);

        activateTabEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(2, 4);
    },

    // Tab event - keyboard navigation + TTS

    'test given view, TTS is active and current element have on right editable cell when activated Tab then move to next right editable cell' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(1, 3);

        activateTabEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(2, 3);
    },

    'test given view, TTS is active and current element have on right constant cell and blank cell when activated Tab then move to focusable cell' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(6, 5);

        activateTabEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(7, 5);
    },

    'test given view, TTS is active and current element have on right constant cell and editable cell when activated Tab then move to next right focusable cell' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(4, 6);

        activateTabEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(5, 6);
    },

    'test given view, TTS is active and current element have on right blank cell when activated Tab then move to first focusable cell of next row' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(7, 3);

        activateTabEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(1, 4);
    },

    // Tab + shift event - default navigation

    'test given view, keyboard navigation is not active and current element have on left editable cell when activated Tab + shift then move to next left editable cell' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(3, 1);

        activateShiftTabEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(2, 1);
    },

    'test given view, keyboard navigation is not active and current element have on left constant cell and blank cell when activated Tab + shift then move to last editable cell of previous row' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(2, 4);

        activateShiftTabEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(7, 3);
    },

    'test given view, keyboard navigation is not active and current element have on left constant cell and editable cell when activated Tab + shift then move to next left editable cell' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(6, 3);

        activateShiftTabEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(2, 3);
    },

    'test given view, keyboard navigation is not active and current element have on left blank cell when activated Tab + shift then move to last editable cell of previous row' : function() {
        let cellInput = this.focusAndGetEditableElementWithPosition(1, 3);

        activateShiftTabEventOnCellInput(cellInput);

        this.validateIsCellInputElementFocused(5, 2);
    },

    // Tab + shift event - keyboard navigation

    'test given view, keyboard navigation is active and current element have on left editable cell when activated Tab + shift then move to next left editable cell' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(3, 1);

        activateShiftTabEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(2, 1);
    },

    'test given view, keyboard navigation is active and current element have on left constant cell and blank cell when activated Tab + shift then move to last editable cell of previous row' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(2, 4);

        activateShiftTabEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(7, 3);
    },

    'test given view, keyboard navigation is active and current element have on left constant cell and editable cell when activated Tab + shift then move to next left editable cell' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(6, 3);

        activateShiftTabEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(2, 3);
    },

    'test given view, keyboard navigation is active and current element have on left blank cell when activated Tab + shift then move to last editable cell of previous row' : function() {
        this.activateKeyboardNavigation();
        this.markAndFocusElementWithPosition(1, 3);

        activateShiftTabEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(5, 2);
    },

    // Tab + shift event - keyboard navigation + TTS

    'test given view, TTS is active and current element have on left editable cell when activated Tab + shift then move to next left editable cell' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(3, 1);

        activateShiftTabEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(2, 1);
    },

    'test given view, TTS is active, current element is disabled and has on left blank cell when activated Tab + shift then move to last focusable cell of previous row' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(1, 4);

        activateShiftTabEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(7, 3);
    },

    'test given view, TTS is active and current element have on left constant cell and editable cell when activated Tab + shift then move to next left focusable cell' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(6, 3);

        activateShiftTabEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(5, 3);
    },

    'test given view, TTS is active and current element have on left blank cell when activated Tab + shift then move to last editable cell of previous row' : function() {
        this.activateTTSWithoutReading();
        this.markAndFocusElementWithPosition(1, 3);

        activateShiftTabEvent(this.presenter);

        this.validateIsCellMarkedAndCellInputFocused(5, 2);
    },
});

function activateBackspaceEvent(presenter) {
    activateKeyboardEvent(presenter, 8);
}

function activateBackspaceEventOnCellInput(cellInput) {
    activateKeyboardEventOnCell(cellInput, 8);
}

function activateTabEvent(presenter) {
    activateKeyboardEvent(presenter, 9);
}

function activateTabEventOnCellInput(cellInput) {
    activateKeyboardEventOnCell(cellInput, 9);
}

function activateShiftTabEvent(presenter) {
    activateKeyboardEvent(presenter, 9, true);
}

function activateShiftTabEventOnCellInput(cellInput) {
    activateKeyboardEventOnCell(cellInput, 9, true);
}

function activateEnterEvent(presenter) {
    activateKeyboardEvent(presenter, 13);
}

function activateLeftArrowEvent(presenter) {
    activateKeyboardEvent(presenter, 37);
}

function activateLeftArrowEventOnCellInput(cellInput) {
    activateKeyboardEventOnCell(cellInput, 37);
}

function activateUpArrowEvent(presenter) {
    activateKeyboardEvent(presenter, 38);
}

function activateUpArrowEventOnCellInput(cellInput) {
    activateKeyboardEventOnCell(cellInput, 38);
}

function activateRightArrowEvent(presenter) {
    activateKeyboardEvent(presenter, 39);
}

function activateRightArrowEventOnCellInput(cellInput) {
    activateKeyboardEventOnCell(cellInput, 39);
}

function activateDownArrowEvent(presenter) {
    activateKeyboardEvent(presenter, 40);
}

function activateDownArrowEventOnCellInput(cellInput) {
    activateKeyboardEventOnCell(cellInput, 40);
}

function activateKeyboardEvent(presenter, keycode, isShiftDown = false) {
    const event = {
        'keyCode': keycode,
        preventDefault: () => {},
        stopPropagation: () => {},
    };
    presenter.keyboardController(keycode, isShiftDown, event);
}

function activateKeyboardEventOnCell(cellInput, keycode, isShiftDown = false) {
    const keyDownEvent = jQuery.Event("keydown");
    keyDownEvent.keyCode = keycode;
    keyDownEvent.shiftKey = isShiftDown;
    $(cellInput).trigger(keyDownEvent);

    const keyUpEvent = jQuery.Event("keyup");
    keyUpEvent.keyCode = keycode;
    keyDownEvent.shiftKey = isShiftDown;
    $(cellInput).trigger(keyUpEvent);
}
