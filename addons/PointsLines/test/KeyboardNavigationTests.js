TestCase("[PointsLines] Keyboard navigation tests", {

    setUp: function () {
        this.presenter = new AddonPointsLines_create();

        setUpPointsLinesForTests(this.presenter);
        buildViewForPointsLinesTests(this.presenter);

        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
        this.activateTTSWithoutReading();

        this.tts = {
            speak: sinon.spy(),
        };

        this.stubs = {
            readCurrentElementStub: sinon.stub(this.keyboardControllerObject, "readCurrentElement"),
            getTextToSpeechOrNullStub: sinon.stub(this.presenter, "getTextToSpeechOrNull")
        };
        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
    },

    tearDown: function () {
        this.keyboardControllerObject.readCurrentElement.restore();
        this.presenter.getTextToSpeechOrNull.restore();
    },

    markElement: function (index) {
        if (this.keyboardControllerObject.keyboardNavigationCurrentElement) {
            this.keyboardControllerObject.unmark(this.keyboardControllerObject.keyboardNavigationCurrentElement);
        }
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = index;
        this.keyboardControllerObject.keyboardNavigationCurrentElement = this.keyboardControllerObject.keyboardNavigationElements[index];
        this.keyboardControllerObject.mark(this.keyboardControllerObject.keyboardNavigationCurrentElement);
    },

    validateIsElementMarked: function (index) {
        let $expectedMarkedElement = $(this.keyboardControllerObject.keyboardNavigationElements[index]);
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

    'test given view when entering for the first time then mark first point' : function() {
        this.deactivateTTS();
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateIsElementMarked(0);
    },

    // Enter

    'test given point when activated enter then call read method': function () {
        this.markElement(1);

        activateEnterEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    // Tab

    'test given point when activated tab and possible movement then call read method': function () {
        this.markElement(2);

        activateTabEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given point when activated tab and possible movement then mark next position': function () {
        this.markElement(2);

        activateTabEvent(this.presenter);

        this.validateIsElementMarked(3);
    },

    'test given last point when activated tab then call read method': function () {
        this.markElement(5);

        activateTabEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given last point when activated tab then do not change marked point': function () {
        this.markElement(5);

        activateTabEvent(this.presenter);

        this.validateIsElementMarked(5);
    },

    // Shift + Tab

    'test given point when activated combination shift + tab and possible movement then call read method': function () {
        this.markElement(2);

        activateShiftTabEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given point when activated combination shift + tab and possible movement then mark previous position': function () {
        this.markElement(2);

        activateShiftTabEvent(this.presenter);

        this.validateIsElementMarked(1);
    },

    'test given first point when activated combination shift + tab then call read method': function () {
        this.markElement(0);

        activateShiftTabEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given first point when activated combination shift + tab then do not change marked point': function () {
        this.markElement(0);

        activateShiftTabEvent(this.presenter);

        this.validateIsElementMarked(0);
    },

    // Right arrow

    'test given point when activated right arrow and possible movement then call read method': function () {
        this.markElement(2);

        activateRightArrowEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given point when activated right arrow and possible movement then mark next position': function () {
        this.markElement(2);

        activateRightArrowEvent(this.presenter);

        this.validateIsElementMarked(3);
    },

    'test given last point when activated right arrow then call read method': function () {
        this.markElement(5);

        activateRightArrowEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given last point when activated right arrow then do not change marked point': function () {
        this.markElement(5);

        activateRightArrowEvent(this.presenter);

        this.validateIsElementMarked(5);
    },

    // Left arrow

    'test given point when activated left arrow and possible movement then call read method': function () {
        this.markElement(2);

        activateLeftArrowEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given point when activated left arrow and possible movement then mark previous position': function () {
        this.markElement(2);

        activateLeftArrowEvent(this.presenter);

        this.validateIsElementMarked(1);
    },

    'test given first point when activated left arrow then call read method': function () {
        this.markElement(0);

        activateLeftArrowEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given first point when activated left arrow then do not change marked point': function () {
        this.markElement(0);

        activateLeftArrowEvent(this.presenter);

        this.validateIsElementMarked(0);
    },

    // Down arrow

    'test given point when activated down arrow and possible movement then call read method': function () {
        this.markElement(2);

        activateDownArrowEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given point when activated down arrow and possible movement then mark next position': function () {
        this.markElement(2);

        activateDownArrowEvent(this.presenter);

        this.validateIsElementMarked(3);
    },

    'test given last point when activated down arrow then call read method': function () {
        this.markElement(5);

        activateDownArrowEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given last point when activated down arrow then do not change marked point': function () {
        this.markElement(5);

        activateDownArrowEvent(this.presenter);

        this.validateIsElementMarked(5);
    },

    // Up arrow

    'test given point when activated up arrow and possible movement then call read method': function () {
        this.markElement(2);

        activateUpArrowEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given point when activated up arrow and possible movement then mark previous position': function () {
        this.markElement(2);

        activateUpArrowEvent(this.presenter);

        this.validateIsElementMarked(1);
    },

    'test given first point when activated up arrow then call read method': function () {
        this.markElement(0);

        activateUpArrowEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given first point when activated up arrow then do not change marked point': function () {
        this.markElement(0);

        activateUpArrowEvent(this.presenter);

        this.validateIsElementMarked(0);
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
