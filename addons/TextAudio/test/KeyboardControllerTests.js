TestCase("[TextAudio] Keyboard controller selected mode tests", {

    setUp: function () {
        this.presenter = new AddonTextAudio_create();

        this.presenter.configuration = {
            isEnabled: true,
        };

        this.stubs = {
            getElementsForKeyboardNavigationStub: sinon.stub(),
            speakCurrentElementStub: sinon.stub(),
            selectActionStub: sinon.stub(),
            pauseStub: sinon.stub(),
        };

        let elements = this.getElementsForKeyboardNavigation();
        this.stubs.getElementsForKeyboardNavigationStub.returns(elements);
        this.presenter.getElementsForKeyboardNavigation = this.stubs.getElementsForKeyboardNavigationStub;

        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;

        this.keyboardControllerObject.speakCurrentElement = this.stubs.speakCurrentElementStub;
        this.keyboardControllerObject.selectAction = this.stubs.selectActionStub;
        this.presenter.pause = this.stubs.pauseStub;
    },

    getElementsForKeyboardNavigation: function () {
        let elements = [];

        this.presenter.$playPauseBtn = $('<div>');
        this.presenter.$playPauseBtn.addClass(this.presenter.CSS_CLASSES.PLAY_PAUSE_BUTTON);
        elements.push(this.presenter.$playPauseBtn);

        this.presenter.$stopBtn = $('<div>');
        this.presenter.$stopBtn.addClass(this.presenter.CSS_CLASSES.STOP_BUTTON);
        elements.push(this.presenter.$stopBtn);

        this.presenter.$playbackRateControls = $('<div>');
        this.presenter.$playbackRateControls.addClass(this.presenter.CSS_CLASSES.AUDIO_SPEED_CONTROLLER);
        elements.push(this.presenter.$playbackRateControls);

        this.presenter.$slide = document.createElement("span");
        this.presenter.$slide.classList.add("textelement0");
        this.presenter.$slide.value = "Slide 0";
        elements.push($(this.presenter.$slide));

        return elements;
    },

    activateKeyboardNavigation: function() {
        this.keyboardControllerObject.keyboardNavigationActive = true;
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 0;
        this.keyboardControllerObject.keyboardNavigationCurrentElement = this.keyboardControllerObject.keyboardNavigationElements[0];
    },

    verifyIfActiveSelectedMode: function () {
        assertTrue(this.keyboardControllerObject.selectedMode);
    },

    verifyIfInactiveSelectedMode: function () {
        assertFalse(this.keyboardControllerObject.selectedMode);
    },

    'test given view when built keyboard controller then selected mode is off' : function() {
        this.verifyIfInactiveSelectedMode();
    },

    'test given view when activated space then activate selected mode' : function() {
        this.activateKeyboardNavigation();

        activateSpaceEvent(this.presenter);

        this.verifyIfActiveSelectedMode();
    },

    'test given view when double activated space then activate selected mode' : function() {
        this.activateKeyboardNavigation();

        activateSpaceEvent(this.presenter);
        activateSpaceEvent(this.presenter);

        this.verifyIfActiveSelectedMode();
    },

    'test given view when switching element then deactivate selected mode' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.selectedMode = true;

        this.keyboardControllerObject.switchElement(1);

        this.verifyIfInactiveSelectedMode();
    },

    'test given view when exiting WCAG mode then deactivate selected mode' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.selectedMode = true;

        activateEscEvent(this.presenter);

        this.verifyIfInactiveSelectedMode();
    },
});


TestCase("[TextAudio] Keyboard controller and TTS activation tests", {

    setUp: function () {
        this.presenter = new AddonTextAudio_create();

        this.presenter.configuration = {
            isEnabled: true,
        };

        this.stubs = {
            getElementsForKeyboardNavigationStub: sinon.stub(),
            speakCurrentElementStub: sinon.stub(),
            selectActionStub: sinon.stub(),
            changePlaybackRateStub: sinon.stub(),
            isCurrentElementVisibleStub: sinon.stub()
        };

        let elements = this.getElementsForKeyboardNavigation();
        this.stubs.getElementsForKeyboardNavigationStub.returns(elements);
        this.presenter.getElementsForKeyboardNavigation = this.stubs.getElementsForKeyboardNavigationStub;

        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;

        this.presenter.changePlaybackRate = this.stubs.changePlaybackRateStub;
        this.keyboardControllerObject.speakCurrentElement = this.stubs.speakCurrentElementStub;
        this.keyboardControllerObject.selectAction = this.stubs.selectActionStub;

        this.stubs.isCurrentElementVisibleStub.returns(true);
        this.keyboardControllerObject.isCurrentElementVisible = this.stubs.isCurrentElementVisibleStub;

        this.spies = {
            switchElementSpy: sinon.spy(this.keyboardControllerObject, 'switchElement'),
        };
    },

    tearDown: function() {
        this.spies.switchElementSpy.restore();
    },

    activateKeyboardNavigation: function() {
        this.keyboardControllerObject.keyboardNavigationActive = true;
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 0;
        this.keyboardControllerObject.keyboardNavigationCurrentElement = this.keyboardControllerObject.keyboardNavigationElements[0];
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.keyboardControllerObject.keyboardNavigationActive = true;
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 0;
        this.keyboardControllerObject.keyboardNavigationCurrentElement = this.keyboardControllerObject.keyboardNavigationElements[0];
    },

    activateSelectedMode: function () {
        this.keyboardControllerObject.selectedMode = true;
    },

    getElementsForKeyboardNavigation: function () {
        let elements = [];

        this.presenter.$playPauseBtn = $('<div>');
        this.presenter.$playPauseBtn.addClass(this.presenter.CSS_CLASSES.PLAY_PAUSE_BUTTON);
        elements.push(this.presenter.$playPauseBtn);

        this.presenter.$stopBtn = $('<div>');
        this.presenter.$stopBtn.addClass(this.presenter.CSS_CLASSES.STOP_BUTTON);
        elements.push(this.presenter.$stopBtn);

        this.presenter.$playbackRateControls = $('<div>');
        this.presenter.$playbackRateControls.addClass(this.presenter.CSS_CLASSES.AUDIO_SPEED_CONTROLLER);
        elements.push(this.presenter.$playbackRateControls);

        let slide = document.createElement("span");
        slide.classList.add("textelement0");
        slide.value = "Slide 0";
        this.presenter.$slide = $(slide);
        elements.push(this.presenter.$slide);

        return elements;
    },

    getFirstReadText: function() {
        // gets first call
        return this.tts.speak.args[0][0];
    },

    moveToPlayButton: function () {
        this.presenter.isPlaying = false;
        this.keyboardControllerObject.markCurrentElement(0);
    },

    moveToAudioSpeedController: function () {
        this.keyboardControllerObject.markCurrentElement(2);
    },

    verifyIfExecutedActionHandlerMethod: function () {
        assertTrue(this.stubs.selectActionStub.calledOnce);
    },

    verifyIfExecutedReadMethod: function () {
        assertTrue(this.stubs.speakCurrentElementStub.calledOnce);
    },

    verifyIfNotExecutedReadMethod: function () {
        assertFalse(this.stubs.speakCurrentElementStub.called);
    },

    validateIfOnlyStopButtonHasKeyboardNavigationActiveClass: function () {
        assertTrue(hasKeyboardNavigationActiveElementClass(this.presenter.$stopBtn));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.presenter.$playbackRateControls));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.presenter.$playPauseBtn));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.presenter.$slide));
    },

    validateIfOnlySlideHasKeyboardNavigationActiveClass: function () {
        assertTrue(hasKeyboardNavigationActiveElementClass(this.presenter.$slide));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.presenter.$playbackRateControls));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.presenter.$stopBtn));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.presenter.$playPauseBtn));
    },

    activateAndValidateUpArrowEventInSelectedModeOnEveryElementExpectAudioSpeedController: function () {
        this._activateAndValidateGivenKeyEventInSelectedModeOnEveryElementExpectAudioSpeedController(activateUpArrowEvent, -1);
    },

    activateAndValidateDownArrowEventInSelectedModeOnEveryElementExpectAudioSpeedController: function () {
        this._activateAndValidateGivenKeyEventInSelectedModeOnEveryElementExpectAudioSpeedController(activateDownArrowEvent, 1);
    },

    _activateAndValidateGivenKeyEventInSelectedModeOnEveryElementExpectAudioSpeedController: function (keyEventMethod, expectedMove) {
        const audioSpeedControllerID = 2;
        const navigationElementsNumber = this.keyboardControllerObject.keyboardNavigationElements.length;
        for (var elementID = 0; elementID < navigationElementsNumber; elementID++) {
            if (elementID === audioSpeedControllerID) {
                continue;
            }

            this.keyboardControllerObject.markCurrentElement(elementID);
            this.activateSelectedMode();

            keyEventMethod(this.presenter);

            assertTrue(this.spies.switchElementSpy.calledWith(expectedMove));
        }
        assertEquals(navigationElementsNumber - 1, this.spies.switchElementSpy.callCount);
    },

    // Read method execution tests

    'test given view, keyboard navigation is active when switching navigation element then not call read method' : function() {
        this.activateKeyboardNavigation();
        this.moveToPlayButton();

        this.keyboardControllerObject.switchElement(1);

        this.verifyIfNotExecutedReadMethod();
    },

    'test given view, TTS navigation is active when switching navigation element then call read method' : function() {
        this.activateTTSWithoutReading();
        this.moveToPlayButton();

        this.keyboardControllerObject.switchElement(1);

        this.verifyIfExecutedReadMethod();
    },

    // Enter event

    'test given view, keyboard navigation is active when activated enter then not call read method' : function() {
        this.activateKeyboardNavigation();
        this.moveToPlayButton();

        activateEnterEvent(this.presenter);

        this.verifyIfNotExecutedReadMethod();
    },

    'test given view, TTS navigation is active when activated enter then call read method' : function() {
        this.activateTTSWithoutReading();
        this.moveToPlayButton();

        activateEnterEvent(this.presenter);

        this.verifyIfExecutedReadMethod();
    },

    // Space event

    'test given view, keyboard navigation is active, marked audio speed controller when activated space then execute action handler method' : function() {
        this.activateKeyboardNavigation();
        this.moveToAudioSpeedController();

        activateSpaceEvent(this.presenter);

        this.verifyIfExecutedActionHandlerMethod();
    },

    'test given view, TTS navigation is active, marked audio speed controller when activated space then execute action handler method' : function() {
        this.activateTTSWithoutReading();
        this.moveToAudioSpeedController();

        activateSpaceEvent(this.presenter);

        this.verifyIfExecutedActionHandlerMethod();
    },

    // Left arrow event

    'test given view, keyboard navigation is active, marked audio speed controller when activated left arrow then mark stop button' : function() {
        this.activateKeyboardNavigation();
        this.moveToAudioSpeedController();

        activateLeftArrowEvent(this.presenter);

        this.validateIfOnlyStopButtonHasKeyboardNavigationActiveClass();
    },

    'test given view, TTS navigation is active, marked audio speed controller when activated left arrow then mark stop button' : function() {
        this.activateTTSWithoutReading();
        this.moveToAudioSpeedController();

        activateLeftArrowEvent(this.presenter);

        this.validateIfOnlyStopButtonHasKeyboardNavigationActiveClass();
    },

    'test given view, keyboard navigation is active, marked and selected audio speed controller when activated left arrow then mark stop button' : function() {
        this.activateKeyboardNavigation();
        this.moveToAudioSpeedController();
        this.activateSelectedMode();

        activateLeftArrowEvent(this.presenter);

        this.validateIfOnlyStopButtonHasKeyboardNavigationActiveClass();
    },

    'test given view, TTS navigation is active, marked and selected audio speed controller when activated left arrow then mark stop button' : function() {
        this.activateTTSWithoutReading();
        this.moveToAudioSpeedController();
        this.activateSelectedMode();

        activateLeftArrowEvent(this.presenter);

        this.validateIfOnlyStopButtonHasKeyboardNavigationActiveClass();
    },

    // Right arrow event

    'test given view, keyboard navigation is active, marked audio speed controller when activated right arrow then mark slide element' : function() {
        this.activateKeyboardNavigation();
        this.moveToAudioSpeedController();

        activateRightArrowEvent(this.presenter);

        this.validateIfOnlySlideHasKeyboardNavigationActiveClass();
    },

    'test given view, TTS navigation is active, marked audio speed controller when activated right arrow then mark slide element' : function() {
        this.activateTTSWithoutReading();
        this.moveToAudioSpeedController();

        activateRightArrowEvent(this.presenter);

        this.validateIfOnlySlideHasKeyboardNavigationActiveClass();
    },

    'test given view, keyboard navigation is active, marked and selected audio speed controller when activated right arrow then mark slide element' : function() {
        this.activateKeyboardNavigation();
        this.moveToAudioSpeedController();
        this.activateSelectedMode();

        activateRightArrowEvent(this.presenter);

        this.validateIfOnlySlideHasKeyboardNavigationActiveClass();
    },

    'test given view, TTS navigation is active, marked and selected audio speed controller when activated right arrow then mark slide element' : function() {
        this.activateTTSWithoutReading();
        this.moveToAudioSpeedController();
        this.activateSelectedMode();

        activateRightArrowEvent(this.presenter);

        this.validateIfOnlySlideHasKeyboardNavigationActiveClass();
    },

    // Up arrow event

    'test given view, keyboard navigation is active, marked audio speed controller when activated up arrow then mark slide element' : function() {
        this.activateKeyboardNavigation();
        this.moveToAudioSpeedController();

        activateUpArrowEvent(this.presenter);

        this.validateIfOnlyStopButtonHasKeyboardNavigationActiveClass();
    },

    'test given view, TTS navigation is active, marked audio speed controller when activated up arrow then mark slide element' : function() {
        this.activateTTSWithoutReading();
        this.moveToAudioSpeedController();

        activateUpArrowEvent(this.presenter);

        this.validateIfOnlyStopButtonHasKeyboardNavigationActiveClass();
    },

    'test given view, keyboard navigation is active, marked and selected audio speed controller when activated up arrow then increase audio speed' : function() {
        this.activateKeyboardNavigation();
        this.moveToAudioSpeedController();
        this.activateSelectedMode();

        activateUpArrowEvent(this.presenter);

        assertTrue(this.stubs.changePlaybackRateStub.calledWith(this.presenter.OPERATION_TYPE.INCREASE));
        assertTrue(this.stubs.changePlaybackRateStub.calledOnce);
        assertFalse(this.spies.switchElementSpy.called);
    },

    'test given view, TTS navigation is active, marked and selected audio speed controller when activated up arrow then increase audio speed' : function() {
        this.activateTTSWithoutReading();
        this.moveToAudioSpeedController();
        this.activateSelectedMode();

        activateUpArrowEvent(this.presenter);

        assertTrue(this.stubs.changePlaybackRateStub.calledWith(this.presenter.OPERATION_TYPE.INCREASE));
        assertTrue(this.stubs.changePlaybackRateStub.calledOnce);
        assertFalse(this.spies.switchElementSpy.called);
    },

    'test given view, keyboard navigation is active, marked and selected any other element than audio speed controller when activated up arrow then execute switch element on next element' : function() {
        this.activateKeyboardNavigation();

        this.activateAndValidateUpArrowEventInSelectedModeOnEveryElementExpectAudioSpeedController();
    },

    'test given view, TTS navigation is active, marked and selected any other element than audio speed controller when activated up arrow then execute switch element on next element' : function() {
        this.activateTTSWithoutReading();

        this.activateAndValidateUpArrowEventInSelectedModeOnEveryElementExpectAudioSpeedController();
    },

    // Down arrow event

    'test given view, keyboard navigation is active, marked audio speed controller when activated down arrow then mark slide element' : function() {
        this.activateKeyboardNavigation();
        this.moveToAudioSpeedController();

        activateDownArrowEvent(this.presenter);

        this.validateIfOnlySlideHasKeyboardNavigationActiveClass();
    },

    'test given view, TTS navigation is active, marked audio speed controller when activated down arrow then mark slide element' : function() {
        this.activateTTSWithoutReading();
        this.moveToAudioSpeedController();

        activateDownArrowEvent(this.presenter);

        this.validateIfOnlySlideHasKeyboardNavigationActiveClass();
    },

    'test given view, keyboard navigation is active, marked and selected audio speed controller when activated down arrow then decrease audio speed' : function() {
        this.activateKeyboardNavigation();
        this.moveToAudioSpeedController();
        this.activateSelectedMode();

        activateDownArrowEvent(this.presenter);

        assertTrue(this.stubs.changePlaybackRateStub.calledWith(this.presenter.OPERATION_TYPE.DECREASE));
        assertTrue(this.stubs.changePlaybackRateStub.calledOnce);
        assertFalse(this.spies.switchElementSpy.called);
    },

    'test given view, TTS navigation is active, marked and selected audio speed controller when activated down arrow then decrease audio speed' : function() {
        this.activateTTSWithoutReading();
        this.moveToAudioSpeedController();
        this.activateSelectedMode();

        activateDownArrowEvent(this.presenter);

        assertTrue(this.stubs.changePlaybackRateStub.calledWith(this.presenter.OPERATION_TYPE.DECREASE));
        assertTrue(this.stubs.changePlaybackRateStub.calledOnce);
        assertFalse(this.spies.switchElementSpy.called);
    },

    'test given view, keyboard navigation is active, marked and selected any other element than audio speed controller when activated down arrow then execute switch element on previous element' : function() {
        this.activateKeyboardNavigation();

        this.activateAndValidateDownArrowEventInSelectedModeOnEveryElementExpectAudioSpeedController();
    },

    'test given view, TTS navigation is active, marked and selected any other element than audio speed controller when activated down arrow then execute switch element on previous element' : function() {
        this.activateTTSWithoutReading();

        this.activateAndValidateDownArrowEventInSelectedModeOnEveryElementExpectAudioSpeedController();
    },

    // Shift + Tab event

    'test given view, keyboard navigation is active, marked audio speed controller when activated shift + tab then mark stop button' : function() {
        this.activateKeyboardNavigation();
        this.moveToAudioSpeedController();

        activateShiftTabEvent(this.presenter);

        this.validateIfOnlyStopButtonHasKeyboardNavigationActiveClass();
    },

    'test given view, TTS navigation is active, marked audio speed controller when activated shift + tab then mark stop button' : function() {
        this.activateTTSWithoutReading();
        this.moveToAudioSpeedController();

        activateShiftTabEvent(this.presenter);

        this.validateIfOnlyStopButtonHasKeyboardNavigationActiveClass();
    },

    'test given view, keyboard navigation is active, marked and selected audio speed controller when activated shift + tab then mark stop button' : function() {
        this.activateKeyboardNavigation();
        this.moveToAudioSpeedController();
        this.activateSelectedMode();

        activateShiftTabEvent(this.presenter);

        this.validateIfOnlyStopButtonHasKeyboardNavigationActiveClass();
    },

    'test given view, TTS navigation is active, marked and selected audio speed controller when activated shift + tab then mark stop button' : function() {
        this.activateTTSWithoutReading();
        this.moveToAudioSpeedController();
        this.activateSelectedMode();

        activateShiftTabEvent(this.presenter);

        this.validateIfOnlyStopButtonHasKeyboardNavigationActiveClass();
    },

    // Tab event

    'test given view, keyboard navigation is active, marked audio speed controller when activated tab then mark slide element' : function() {
        this.activateKeyboardNavigation();
        this.moveToAudioSpeedController();

        activateTabEvent(this.presenter);

        this.validateIfOnlySlideHasKeyboardNavigationActiveClass();
    },

    'test given view, TTS navigation is active, marked audio speed controller when activated tab then mark slide element' : function() {
        this.activateTTSWithoutReading();
        this.moveToAudioSpeedController();

        activateTabEvent(this.presenter);

        this.validateIfOnlySlideHasKeyboardNavigationActiveClass();
    },

    'test given view, keyboard navigation is active, marked and selected audio speed controller when activated tab then mark slide element' : function() {
        this.activateKeyboardNavigation();
        this.moveToAudioSpeedController();
        this.activateSelectedMode();

        activateTabEvent(this.presenter);

        this.validateIfOnlySlideHasKeyboardNavigationActiveClass();
    },

    'test given view, TTS navigation is active, marked and selected audio speed controller when activated tab then mark slide element' : function() {
        this.activateTTSWithoutReading();
        this.moveToAudioSpeedController();
        this.activateSelectedMode();

        activateTabEvent(this.presenter);

        this.validateIfOnlySlideHasKeyboardNavigationActiveClass();
    },

    'test given view, keyboard navigation is active and all elements are hidden when activated tab then move on every element and stop after' : function() {
        this.activateKeyboardNavigation();
        this.moveToPlayButton();
        this.stubs.isCurrentElementVisibleStub.returns(false);
        this.keyboardControllerObject.lastVisibleElementIndex = 0

        activateTabEvent(this.presenter);

        this.verifyIfNotExecutedReadMethod();
        assertEquals(this.spies.switchElementSpy.callCount, this.keyboardControllerObject.keyboardNavigationElementsLen);
        assertEquals(this.keyboardControllerObject.lastVisibleElementIndex, this.keyboardControllerObject.keyboardNavigationCurrentElementIndex);
    },

    'test given view, TTS navigation is active and all elements are hidden when activated tab then move on every element and stop after' : function() {
        this.activateTTSWithoutReading();
        this.moveToPlayButton();
        this.stubs.isCurrentElementVisibleStub.returns(false);
        this.keyboardControllerObject.lastVisibleElementIndex = 0

        activateTabEvent(this.presenter);

        this.verifyIfNotExecutedReadMethod();
        assertEquals(this.spies.switchElementSpy.callCount, this.keyboardControllerObject.keyboardNavigationElementsLen);
        assertEquals(this.keyboardControllerObject.lastVisibleElementIndex, this.keyboardControllerObject.keyboardNavigationCurrentElementIndex);
    }
});

function hasKeyboardNavigationActiveElementClass($element) {
    return $element.hasClass("keyboard_navigation_active_element");
}

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

function activateEscEvent(presenter) {
    activateKeyboardEvent(presenter, 27);
}

function activateKeyboardEvent(presenter, keycode, isShiftDown = false) {
    const event = {
        'keyCode': keycode,
        preventDefault: () => {},
        stopPropagation: () => {},
    };
    presenter.keyboardController(keycode, isShiftDown, event);
}
