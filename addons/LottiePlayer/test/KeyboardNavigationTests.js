TestCase("[LottiePlayer] Keyboard navigation tests", {

    setUp: function () {
        this.presenter = new AddonLottiePlayer_create();

        this.presenter.configuration = createSimpleLottiePLayerConfigurationForTests();
        this.buildView();
        this.activateTTSWithoutReading();

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            readCurrentElementStub: sinon.stub(this.keyboardControllerObject, "readCurrentElement"),
            speakEnterActionStub: sinon.stub(this.keyboardControllerObject, "speakEnterAction"),
            getTextToSpeechOrNullStub: sinon.stub(this.presenter, "getTextToSpeechOrNull"),
        };
        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
    },

    buildView: function() {
        this.presenter.view = createLottiePlayerViewForTests(this.presenter.configuration);
        this.presenter.$view = $(this.presenter.view);
        this.presenter.animationsElements = this.presenter.view.querySelectorAll("lottie-player");
        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
        this.keyboardControllerObject.setElements(this.presenter.getElementsForKeyboardNavigation());
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
        let expectedMarkedElement = this.keyboardControllerObject.keyboardNavigationElements[index];
        assertTrue(expectedMarkedElement.hasAttribute("part"));
        assertEquals("keyboard_navigation_active_element", expectedMarkedElement.getAttribute("part"));
    },

    validateIsReadCurrentElementCalledOnce: function () {
        assertTrue(this.stubs.readCurrentElementStub.calledOnce);
        assertFalse(this.stubs.speakEnterActionStub.called);
    },

    validateIsSpeakEnterActionCalledOnce: function () {
        assertTrue(this.stubs.speakEnterActionStub.calledOnce);
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

    'test given view when entering for the first time then call read enter action method' : function() {
        this.deactivateTTS();
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateIsSpeakEnterActionCalledOnce();
    },

    'test given view when entering for the first time then mark first selectable element' : function() {
        this.deactivateTTS();
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateIsElementMarked(0);
    },

    // Enter

    'test given element when activated enter then call read enter action method': function () {
        this.markElement(1);

        activateEnterEvent(this.presenter);

        this.validateIsSpeakEnterActionCalledOnce();
    },

    // Tab

    'test given element when activated tab and possible movement to right then call read current element method': function () {
        this.markElement(1);

        activateTabEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given element when activated tab and possible movement to right then mark next position': function () {
        this.markElement(1);

        activateTabEvent(this.presenter);

        this.validateIsElementMarked(2);
    },

    'test given last element in row when activated tab then mark first element in row': function () {
        this.markElement(2);

        activateTabEvent(this.presenter);

        this.validateIsElementMarked(0);
    },

    // Shift + Tab

    'test given element when activated combination shift + tab and possible movement to left then call read method': function () {
        this.markElement(1);

        activateShiftTabEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given element when activated combination shift + tab and possible movement to left then mark previous position': function () {
        this.markElement(1);

        activateShiftTabEvent(this.presenter);

        this.validateIsElementMarked(0);
    },

    'test given first element in row when activated combination shift + tab then mark last element in row': function () {
        this.markElement(0);

        activateShiftTabEvent(this.presenter);

        this.validateIsElementMarked(2);
    },

    // Right arrow

    'test given element when activated right arrow and possible movement to right then call read current element method': function () {
        this.markElement(1);

        activateRightArrowEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given element when activated right arrow and possible movement to right then mark next position': function () {
        this.markElement(1);

        activateRightArrowEvent(this.presenter);

        this.validateIsElementMarked(2);
    },

    'test given last element in row when activated right arrow then mark first element in row': function () {
        this.markElement(2);

        activateRightArrowEvent(this.presenter);

        this.validateIsElementMarked(0);
    },

    // Left arrow

    'test given element when activated left arrow and possible movement to left then call read method': function () {
        this.markElement(1);

        activateLeftArrowEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given element when activated left arrow and possible movement to left then mark previous position': function () {
        this.markElement(1);

        activateLeftArrowEvent(this.presenter);

        this.validateIsElementMarked(0);
    },

    'test given first element in row when activated left arrow then mark last element in row': function () {
        this.markElement(0);

        activateLeftArrowEvent(this.presenter);

        this.validateIsElementMarked(2);
    },

    // Down arrow

    'test given element when activated down arrow and possible movement to right then call read current element method': function () {
        this.markElement(1);

        activateDownArrowEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given element when activated down arrow and possible movement to right then mark next position': function () {
        this.markElement(1);

        activateDownArrowEvent(this.presenter);

        this.validateIsElementMarked(2);
    },

    'test given last element in row when activated down arrow then mark first element in row': function () {
        this.markElement(2);

        activateDownArrowEvent(this.presenter);

        this.validateIsElementMarked(0);
    },

    // Up arrow

    'test given element when activated up arrow and possible movement to left then call read method': function () {
        this.markElement(1);

        activateUpArrowEvent(this.presenter);

        this.validateIsReadCurrentElementCalledOnce();
    },

    'test given element when activated up arrow and possible movement to left then mark previous position': function () {
        this.markElement(1);

        activateUpArrowEvent(this.presenter);

        this.validateIsElementMarked(0);
    },

    'test given first element in row when activated up arrow then mark last element in row': function () {
        this.markElement(0);

        activateUpArrowEvent(this.presenter);

        this.validateIsElementMarked(2);
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
