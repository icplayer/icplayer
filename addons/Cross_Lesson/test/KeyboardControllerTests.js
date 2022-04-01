TestCase("[Cross Lesson] Keyboard controller", {

    setUp: function () {
        this.presenter = new AddonCross_Lesson_create();
        this.presenter.configuration = {
            langTag: ""
        }

        this.tts = {
            speak: sinon.spy()
        };
        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
        };
        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.text = "Go to lesson with media recorder";
    },

    setUpWhenDefinedText: function () {
        this.createView(true);
        this.createKeyboardController();
    },

    setUpWhenNotDefinedText: function () {
        this.createView(false);
        this.createKeyboardController();
    },

    createKeyboardController: function () {
        this.presenter.buildKeyboardController();
        this.presenter.setSpeechTexts({});
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;
    },

    createView: function (withText = false) {
        this.presenter.$view = $('<div></div>');
        this.presenter.$view.addClass("addon_Cross_Lesson");

        this.$wrapper = $('<div></div>');
        this.$wrapper.addClass("cross-lesson-wrapper");
        this.$wrapper.appendTo(this.presenter.$view);

        this.$image = $(document.createElement('img'));
        this.$image.addClass("cross-lesson-image");
        this.$image.attr("src", "/file/server/123456");
        this.$image.appendTo(this.$wrapper);

        this.$text = $('<div></div>');
        this.$text.addClass("cross-lesson-text");
        if (withText) {
            this.$text.text(this.text);
        }
        this.$text.appendTo(this.$wrapper);
    },

    activateEnterEvent: function () {
        const keycode = 13;
        const event = {
            'keyCode': keycode,
            preventDefault: sinon.stub()
        };
        this.presenter.keyboardController(keycode, false, event);
    },

    activateTabEvent: function () {
        const keycode = 9;
        const event = {
            'keyCode': keycode,
            preventDefault: sinon.stub()
        };
        this.presenter.keyboardController(keycode, false, event);
    },

    activateKeyboardNavigation: function () {
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    activateTTSWithoutReading: function () {
        this.presenter.setWCAGStatus(true);
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    getFirstReadText: function() {
        // gets first call
        return this.tts.speak.args[0][0];
    },

    validateTTSForAddonWithDefinedText: function () {
        const readText = this.getFirstReadText();

        assertTrue(this.tts.speak.calledOnce);
        assertEquals(this.text, readText[0]["text"]);
    },

    validateTTSForAddonWithoutDefinedText: function () {
        const readText = this.getFirstReadText();

        assertTrue(this.tts.speak.calledOnce);
        assertEquals(this.presenter.speechTexts.GoToLesson, readText);
    },

    validateThatNoneOfTheElementsHaveKeyboardNavigationActiveElementCSSClass: function () {
        let elementsToCheck = [this.$wrapper, this.$image, this.$text];

        for (const $element of elementsToCheck) {
           assertFalse($element.hasClass("keyboard_navigation_active_element"));
       }
    },

    "test given keyboard controller when creating keyboard controller should have only wrapper element": function () {
        this.setUpWhenDefinedText();

        let expectedElements = [this.$wrapper];

        assertEquals(expectedElements.length, this.keyboardControllerObject.keyboardNavigationElements.length);
        for (let i = 0; i < expectedElements.length; i++) {
            assertEquals(expectedElements[i][0], this.keyboardControllerObject.keyboardNavigationElements[i]);
        }
    },

    // First enter tests

    'test given view when text not defined and entering for the first time by keyboard navigation should not mark any element' : function() {
        this.setUpWhenNotDefinedText();

        this.activateEnterEvent();

        this.validateThatNoneOfTheElementsHaveKeyboardNavigationActiveElementCSSClass();
    },

    'test given view when text not defined and entering for the first time by navigation with TTS should not mark any element' : function() {
        this.setUpWhenNotDefinedText();
        this.presenter.setWCAGStatus(true);

        this.activateEnterEvent();

        this.validateThatNoneOfTheElementsHaveKeyboardNavigationActiveElementCSSClass();
    },

    'test given view when text not defined and entering for the first time by keyboard navigation should not call tts.read' : function() {
        this.setUpWhenNotDefinedText();

        this.activateEnterEvent();

        assertFalse(this.tts.speak.called);
    },

    'test given view when text not defined and entering for the first time by navigation with TTS should call tts.read with proper text' : function() {
        this.setUpWhenNotDefinedText();
        this.presenter.setWCAGStatus(true);

        this.activateEnterEvent();

        this.validateTTSForAddonWithoutDefinedText();
    },

    'test given view when text defined and entering for the first time by keyboard navigation should not mark any element' : function() {
        this.setUpWhenDefinedText();

        this.activateEnterEvent();

        this.validateThatNoneOfTheElementsHaveKeyboardNavigationActiveElementCSSClass();
    },

    'test given view when text defined and entering for the first time by navigation with TTS should not mark any element' : function() {
        this.setUpWhenDefinedText();
        this.presenter.setWCAGStatus(true);

        this.activateEnterEvent();

        this.validateThatNoneOfTheElementsHaveKeyboardNavigationActiveElementCSSClass();
    },

    'test given view when text defined and entering for the first time by keyboard navigation should not call tts.read' : function() {
        this.setUpWhenDefinedText();

        this.activateEnterEvent();

        assertFalse(this.tts.speak.called);
    },

    'test given view when text defined and entering for the first time by navigation with TTS should call tts.read with proper text' : function() {
        this.setUpWhenDefinedText();
        this.presenter.setWCAGStatus(true);

        this.activateEnterEvent();

        this.validateTTSForAddonWithDefinedText();
    },

    // Wrapper texts

    'test given view when text defined and entering on wrapper by keyboard navigation should not mark any element' : function() {
        this.setUpWhenDefinedText();
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markCurrentElement(0);

        this.activateTabEvent();

        this.validateThatNoneOfTheElementsHaveKeyboardNavigationActiveElementCSSClass();
    },

    'test given view when text defined and entering on wrapper by keyboard navigation should not call tts.read' : function() {
        this.setUpWhenDefinedText();
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markCurrentElement(0);

        this.activateTabEvent();

        assertFalse(this.tts.speak.called);
    },

    'test given view when text defined and activate enter on wrapper by keyboard navigation should not call tts.read' : function() {
        this.setUpWhenDefinedText();
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markCurrentElement(0);

        this.activateEnterEvent();

        assertFalse(this.tts.speak.called);
    },

    'test given view when text defined and entering on wrapper by TTS should not mark any element' : function() {
        this.setUpWhenDefinedText();
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markCurrentElement(0);

        this.activateTabEvent();

        this.validateThatNoneOfTheElementsHaveKeyboardNavigationActiveElementCSSClass();
    },

    'test given view when text defined and entering on wrapper by TTS should call tts.read with proper text' : function() {
        this.setUpWhenDefinedText();
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markCurrentElement(0);

        this.activateTabEvent();

        this.validateTTSForAddonWithDefinedText();
    },

    'test given view when text defined and activate enter on wrapper by TTS should call tts.read with proper text' : function() {
        this.setUpWhenDefinedText();
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markCurrentElement(0);

        this.activateEnterEvent();

        this.validateTTSForAddonWithDefinedText();
    },

    'test given view when text not defined and entering on wrapper by keyboard navigation should not mark any element' : function() {
        this.setUpWhenNotDefinedText();
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markCurrentElement(0);

        this.activateTabEvent();

        this.validateThatNoneOfTheElementsHaveKeyboardNavigationActiveElementCSSClass();
    },

    'test given view when text not defined and entering on wrapper by keyboard navigation should not call tts.read' : function() {
        this.setUpWhenNotDefinedText();
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markCurrentElement(0);

        this.activateTabEvent();

        assertFalse(this.tts.speak.called);
    },

    'test given view when text not defined and activate enter on wrapper by keyboard navigation should not call tts.read' : function() {
        this.setUpWhenNotDefinedText();
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markCurrentElement(0);

        this.activateEnterEvent();

        assertFalse(this.tts.speak.called);
    },

    'test given view when text not defined and entering on wrapper by TTS should not mark any element' : function() {
        this.setUpWhenNotDefinedText();
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markCurrentElement(0);

        this.activateTabEvent();

        this.validateThatNoneOfTheElementsHaveKeyboardNavigationActiveElementCSSClass();
    },

    'test given view when text not defined and entering on wrapper by TTS should call tts.read with proper text' : function() {
        this.setUpWhenNotDefinedText();
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markCurrentElement(0);

        this.activateTabEvent();

        this.validateTTSForAddonWithoutDefinedText();
    },

    'test given view when text not defined and activate enter on wrapper by TTS should call tts.read with proper text' : function() {
        this.setUpWhenNotDefinedText();
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markCurrentElement(0);

        this.activateEnterEvent();

        this.validateTTSForAddonWithoutDefinedText();
    },
});
