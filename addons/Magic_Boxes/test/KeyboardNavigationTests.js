TestCase("[Magic Boxes] Keyboard navigation tests", {

    setUp: function () {
        this.presenter = new AddonMagic_Boxes_create();

        this.presenter.configuration = createMagicBoxesConfigurationForTests();
        this.presenter.$view = $(createMagicBoxesViewForTests(this.presenter.configuration));
        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
        this.activateTTSWithoutReading();

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            readCurrentElementStub: sinon.stub(this.keyboardControllerObject, "readCurrentElement"),
            getTextToSpeechOrNullStub: sinon.stub(this.presenter, "getTextToSpeechOrNull"),
        };
        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
    },

    tearDown: function () {
        this.keyboardControllerObject.readCurrentElement.restore();
        this.presenter.getTextToSpeechOrNull.restore();
    },

    markElementWithPosition: function (x, y) {
        let newIndex = (this.keyboardControllerObject.columnsCount * y) + x;
        if (this.keyboardControllerObject.keyboardNavigationCurrentElement) {
            this.keyboardControllerObject.unmark(this.keyboardControllerObject.keyboardNavigationCurrentElement);
        }
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = newIndex;
        this.keyboardControllerObject.keyboardNavigationCurrentElement = this.keyboardControllerObject.keyboardNavigationElements[newIndex];
        this.keyboardControllerObject.mark(this.keyboardControllerObject.keyboardNavigationCurrentElement);
    },

    validateIsElementMarked: function (x, y) {
        let elementIndex = (this.keyboardControllerObject.columnsCount * y) + x;
        let $expectedMarkedElement = $(this.keyboardControllerObject.keyboardNavigationElements[elementIndex]);
        assertTrue($expectedMarkedElement.hasClass("keyboard_navigation_active_element"));
    },

    validateIsReadCurrentElementCalledOnce: function () {
        assertTrue(this.stubs.readCurrentElementStub.calledOnce);
    },

    validateIsReadCurrentElementNotCalled: function () {
        assertFalse(this.stubs.readCurrentElementStub.called);
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    deactivateTTS: function() {
        this.presenter.setWCAGStatus(false);
        this.keyboardControllerObject.keyboardNavigationActive = false;
    },

    // First enter tests

    'test given view when entering for the first time then call read method' : function() {
        this.deactivateTTS();
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given view when entering for the first time then mark first selectable element' : function() {
        this.deactivateTTS();
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateIsElementMarked(0, 0);
    },

    // Enter

    'test given element when activated enter then call read method': function () {
        this.markElementWithPosition(2, 1);

        activateEnterEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    // Tab

    'test given element when activated tab and possible movement then call read method': function () {
        this.markElementWithPosition(2, 1);

        activateTabEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given element when activated tab and possible movement to right then mark next position': function () {
        this.markElementWithPosition(2, 1);

        activateTabEvent(this.presenter);

        this.validateIsElementMarked(3, 1);
    },

    'test given element when activated tab and possible movement to next row then mark next position': function () {
        this.markElementWithPosition(5, 1);

        activateTabEvent(this.presenter);

        this.validateIsElementMarked(0, 2);
    },

    'test given element when activated tab and possible movement to first row then mark next position': function () {
        this.markElementWithPosition(5, 4);

        activateTabEvent(this.presenter);

        this.validateIsElementMarked(0, 0);
    },

    // Shift + Tab

    'test given element when activated combination shift + tab and possible movement then call read method': function () {
        this.markElementWithPosition(2, 1);

        activateShiftTabEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given element when activated combination shift + tab and possible movement to left then mark previous position': function () {
        this.markElementWithPosition(2, 1);

        activateShiftTabEvent(this.presenter);

        this.validateIsElementMarked(1, 1);
    },

    'test given element when activated combination shift + tab and possible movement to previous row then mark previous position': function () {
        this.markElementWithPosition(0, 1);

        activateShiftTabEvent(this.presenter);

        this.validateIsElementMarked(5, 0);
    },

    'test given element when activated combination shift + tab and possible movement to last row then mark previous position': function () {
        this.markElementWithPosition(0, 0);

        activateShiftTabEvent(this.presenter);

        this.validateIsElementMarked(5, 4);
    },

    // Right arrow

    'test given element when activated right arrow and possible movement then call read method': function () {
        this.markElementWithPosition(2, 1);

        activateRightArrowEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given element when activated right arrow and possible movement then mark next position': function () {
        this.markElementWithPosition(2, 1);

        activateRightArrowEvent(this.presenter);

        this.validateIsElementMarked(3, 1);
    },

    'test given element when activated right arrow and not possible movement then do not call read method': function () {
        this.markElementWithPosition(5, 0);

        activateRightArrowEvent(this.presenter);

        this.validateIsReadCurrentElementNotCalled();
    },

    'test given element when activated right arrow and not possible movement then do not mark next position': function () {
        this.markElementWithPosition(5, 0);

        activateRightArrowEvent(this.presenter);

        this.validateIsElementMarked(5, 0);
    },

    // Left arrow

    'test given element when activated left arrow and possible movement then call read method': function () {
        this.markElementWithPosition(2, 1);

        activateLeftArrowEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given element when activated left arrow and possible movement then mark next position': function () {
        this.markElementWithPosition(2, 1);

        activateLeftArrowEvent(this.presenter);

        this.validateIsElementMarked(1, 1);
    },

    'test given element when activated left arrow and not possible movement then do not call read method': function () {
        this.markElementWithPosition(0, 1);

        activateLeftArrowEvent(this.presenter);

        this.validateIsReadCurrentElementNotCalled();
    },

    'test given element when activated left arrow and not possible movement then do not mark next position': function () {
        this.markElementWithPosition(0, 1);

        activateLeftArrowEvent(this.presenter);

        this.validateIsElementMarked(0, 1);
    },

    // Down arrow

    'test given element when activated down arrow and possible movement then call read method': function () {
        this.markElementWithPosition(2, 1);

        activateDownArrowEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given element when activated down arrow and possible movement then mark next position': function () {
        this.markElementWithPosition(2, 1);

        activateDownArrowEvent(this.presenter);

        this.validateIsElementMarked(2, 2);
    },

    'test given element when activated down arrow and not possible movement then do not call read method': function () {
        this.markElementWithPosition(2, 4);

        activateDownArrowEvent(this.presenter);

        this.validateIsReadCurrentElementNotCalled();
    },

    'test given element when activated down arrow and not possible movement then do not mark next position': function () {
        this.markElementWithPosition(2, 4);

        activateDownArrowEvent(this.presenter);

        this.validateIsElementMarked(2, 4);
    },

    // Up arrow

    'test given element when activated up arrow and possible movement then call read method': function () {
        this.markElementWithPosition(2, 1);

        activateUpArrowEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given element when activated up arrow and possible movement then mark next position': function () {
        this.markElementWithPosition(2, 1);

        activateUpArrowEvent(this.presenter);

        this.validateIsElementMarked(2, 0);
    },

    'test given element when activated up arrow and not possible movement then do not call read method': function () {
        this.markElementWithPosition(2, 0);

        activateUpArrowEvent(this.presenter);

        this.validateIsReadCurrentElementNotCalled();
    },

    'test given element when activated up arrow and not possible movement then do not mark next position': function () {
        this.markElementWithPosition(2, 0);

        activateUpArrowEvent(this.presenter);

        this.validateIsElementMarked(2, 0);
    },
});

function activateTabEvent(presenter) {
    activateKeyboardEvent(presenter, 9);
}

function activateShiftTabEvent(presenter) {
    activateKeyboardEvent(presenter, 9, true);
}

function activateEnterEvent(presenter) {
    activateKeyboardEvent(presenter, 13);
}

function activateLeftArrowEvent(presenter) {
    activateKeyboardEvent(presenter, 37);
}

function activateUpArrowEvent(presenter) {
    activateKeyboardEvent(presenter, 38);
}

function activateRightArrowEvent(presenter) {
    activateKeyboardEvent(presenter, 39);
}

function activateDownArrowEvent(presenter) {
    activateKeyboardEvent(presenter, 40);
}

function activateKeyboardEvent(presenter, keycode, isShiftDown = false) {
    const event = {
        'keyCode': keycode,
        preventDefault: () => {},
        stopPropagation: () => {},
    };
    presenter.keyboardController(keycode, isShiftDown, event);
}
