TestCase("[Gradual Show Answer] Keyboard controller and TTS activation tests", {

    setUp: function () {
        this.presenter = new AddonGradual_Show_Answer_create();

        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;

        this.stubs = {
            preventDefaultEvent: sinon.stub(this.keyboardControllerObject, 'preventDefaultEvent'),
            readCurrentElement: sinon.stub(this.keyboardControllerObject, 'readCurrentElement'),
            clickHandler: sinon.stub(this.presenter, 'clickHandler'),
        }

        // To use stub in mapping
        this.keyboardControllerObject.updateMapping();
    },

    tearDown: function() {
        this.stubs.readCurrentElement.restore();
        this.stubs.preventDefaultEvent.restore();
        this.stubs.clickHandler.restore();
    },

    activateKeyboardNavigation: function() {
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    verifyIfExecutedClickHandlerMethod: function () {
        assertTrue(this.stubs.clickHandler.calledOnce);
    },

    verifyIfExecutedReadMethod: function () {
        assertTrue(this.stubs.readCurrentElement.calledOnce);
    },

    verifyIfExecutedOnlyPreventDefaultEventMethod: function () {
        assertTrue(this.stubs.preventDefaultEvent.calledOnce);
        assertFalse(this.stubs.readCurrentElement.called);
        assertFalse(this.stubs.clickHandler.called);
    },

    // First enter tests

    'test given view when entering for the first time by keyboard navigation then execute click handler method' : function() {
        activateEnterEvent(this.presenter);

        this.verifyIfExecutedClickHandlerMethod();
    },

    'test given view when entering for the first time by TTS navigation then execute click handler method' : function() {
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.verifyIfExecutedClickHandlerMethod();
        this.verifyIfExecutedReadMethod();
    },

    // Enter event

    'test given view, keyboard navigation is active when activated enter then execute click handler method' : function() {
        this.activateKeyboardNavigation();

        activateEnterEvent(this.presenter);

        this.verifyIfExecutedClickHandlerMethod();
    },

    'test given view, TTS navigation is active when activated enter then execute click handler method' : function() {
        this.activateTTSWithoutReading();

        activateEnterEvent(this.presenter);

        this.verifyIfExecutedClickHandlerMethod();
        this.verifyIfExecutedReadMethod();
    },

    // Space event

    'test given view, keyboard navigation is active when activated space then execute preventDefaultEvent method' : function() {
        this.activateKeyboardNavigation();

        activateSpaceEvent(this.presenter);

        this.verifyIfExecutedOnlyPreventDefaultEventMethod();
    },

    'test given view, TTS navigation is active when activated space then execute preventDefaultEvent method' : function() {
        this.activateTTSWithoutReading();

        activateSpaceEvent(this.presenter);

        this.verifyIfExecutedOnlyPreventDefaultEventMethod();
    },

    // Left arrow event

    'test given view, keyboard navigation is active when activated left arrow then execute preventDefaultEvent method' : function() {
        this.activateKeyboardNavigation();

        activateLeftArrowEvent(this.presenter);

        this.verifyIfExecutedOnlyPreventDefaultEventMethod();
    },

    'test given view, TTS navigation is active when activated left arrow then execute preventDefaultEvent method' : function() {
        this.activateTTSWithoutReading();

        activateLeftArrowEvent(this.presenter);

        this.verifyIfExecutedOnlyPreventDefaultEventMethod();
    },

    // Right arrow event

    'test given view, keyboard navigation is active when activated right arrow then execute preventDefaultEvent method' : function() {
        this.activateKeyboardNavigation();

        activateRightArrowEvent(this.presenter);

        this.verifyIfExecutedOnlyPreventDefaultEventMethod();
    },

    'test given view, TTS navigation is active when activated right arrow then execute preventDefaultEvent method' : function() {
        this.activateTTSWithoutReading();

        activateRightArrowEvent(this.presenter);

        this.verifyIfExecutedOnlyPreventDefaultEventMethod();
    },

    // Up arrow event

    'test given view, keyboard navigation is active when activated up arrow then execute preventDefaultEvent method' : function() {
        this.activateKeyboardNavigation();

        activateUpArrowEvent(this.presenter);

        this.verifyIfExecutedOnlyPreventDefaultEventMethod();
    },

    'test given view, TTS navigation is active when activated up arrow then execute preventDefaultEvent method' : function() {
        this.activateTTSWithoutReading();

        activateUpArrowEvent(this.presenter);

        this.verifyIfExecutedOnlyPreventDefaultEventMethod();
    },

    // Down arrow event

    'test given view, keyboard navigation is active when activated down arrow then execute preventDefaultEvent method' : function() {
        this.activateKeyboardNavigation();

        activateDownArrowEvent(this.presenter);

        this.verifyIfExecutedOnlyPreventDefaultEventMethod();
    },

    'test given view, TTS navigation is active when activated down arrow then execute preventDefaultEvent method' : function() {
        this.activateTTSWithoutReading();

        activateDownArrowEvent(this.presenter);

        this.verifyIfExecutedOnlyPreventDefaultEventMethod();
    },

    // Tab event

    'test given view, keyboard navigation is active when activated Tab then execute preventDefaultEvent method' : function() {
        this.activateKeyboardNavigation();

        activateTabEvent(this.presenter);

        this.verifyIfExecutedOnlyPreventDefaultEventMethod();
    },

    'test given view, TTS navigation is active when activated Tab then execute preventDefaultEvent method' : function() {
        this.activateTTSWithoutReading();

        activateTabEvent(this.presenter);

        this.verifyIfExecutedOnlyPreventDefaultEventMethod();
    },

    // Tab + Shift event

    'test given view, keyboard navigation is active when activated Tab + Shift then execute preventDefaultEvent method' : function() {
        this.activateKeyboardNavigation();

        activateShiftTabEvent(this.presenter);

        this.verifyIfExecutedOnlyPreventDefaultEventMethod();
    },

    'test given view, TTS navigation is active when activated Tab + Shift then execute preventDefaultEvent method' : function() {
        this.activateTTSWithoutReading();

        activateShiftTabEvent(this.presenter);

        this.verifyIfExecutedOnlyPreventDefaultEventMethod();
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

function activateSpaceEvent(presenter) {
    activateKeyboardEvent(presenter, 32);
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
