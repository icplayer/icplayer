TestCase("[Quiz] WCAG - buildKeyboardController", {

    setUp: function () {
        this.presenter = new AddonQuiz_create();

        this.presenter.getElementsForKeyboardNavigation = sinon.stub();
        this.elements = [sinon.spy(), sinon.spy(), sinon.spy()];
        this.presenter.getElementsForKeyboardNavigation.returns(this.elements);
    },

    'test if build keyboard controller will create keyboard controller' : function () {
        this.presenter.buildKeyboardController();

        assertTrue(this.presenter.keyboardControllerObject !== null);
        assertEquals(this.presenter.keyboardControllerObject.keyboardNavigationElements, this.elements);
    }
});

TestCase("[Quiz] handle keyboard input", {

    setUp: function () {
        this.presenter = new AddonQuiz_create();

        this.spaceKeycode = 32;

        this.stubs = {
            getElementsStub: sinon.stub(),
            spaceKeyActionStub: sinon.spy()
        };

        var elements = [sinon.spy()];
        this.stubs.getElementsStub.returns(elements);
        this.presenter.getElementsForKeyboardNavigation = this.stubs.getElementsStub;

        this.presenter.buildKeyboardController();
        this.presenter.keyboardControllerObject.mapping[this.spaceKeycode] = this.stubs.spaceKeyActionStub;
    },

    'test action should be called when mapping for keycode exists' : function () {
        var isShiftDown = false;
        var event = jQuery.Event('keydown');
        event.which = this.spaceKeycode;

        this.presenter.keyboardController(this.spaceKeycode, isShiftDown, event);

        assertTrue(this.stubs.spaceKeyActionStub.called);
    }
});

TestCase("[Quiz] select action", {

    setUp: function () {
        this.presenter = new AddonQuiz_create();

        this.stubs = {
            getTargetStub: sinon.stub(),
            clickStub: sinon.stub(),
            enterSpaceStub: sinon.stub(),
            getElementsStub: sinon.stub(),
        };

        this.gapElement = {
            click: this.stubs.clickStub,
        };

        var elements = [sinon.spy()];
        this.stubs.getElementsStub.returns(elements);
        this.presenter.getElementsForKeyboardNavigation = this.stubs.getElementsStub;

        this.presenter.enterSpace = this.stubs.enterSpaceStub;

        this.presenter.buildKeyboardController();

        this.stubs.getTargetStub.returns(this.gapElement);
        this.presenter.keyboardControllerObject.getTarget = this.stubs.getTargetStub;
    },

    'test select action should call click' : function () {
        this.presenter.keyboardControllerObject.selectAction();

        assertTrue(this.stubs.clickStub.called);
    }
});

TestCase("[Quiz] TTS tests", {

    setUp: function () {
        this.presenter = new AddonQuiz_create();

        this.stubs = {
            eventPreventDefaultStub: sinon.stub(),
            readCurrentElementStub: sinon.stub(),
            switchElementStub: sinon.stub(),
            getElementsStub: sinon.stub(),
            markCurrentElementStub: sinon.stub()
        };

        var elements = [sinon.spy(), sinon.spy(), sinon.spy(), sinon.spy()];
        this.stubs.getElementsStub.returns(elements);
        this.presenter.getElementsForKeyboardNavigation = this.stubs.getElementsStub;

        this.presenter.setSpeechTexts();

        this.presenter.buildKeyboardController();
        this.presenter.keyboardControllerObject.switchElement = this.stubs.switchElementStub;
        this.presenter.keyboardControllerObject.readCurrentElement = this.stubs.readCurrentElementStub;

        this.event = {
            preventDefault: this.stubs.eventPreventDefaultStub
        };
    },

    // ENTER KEY
    'test enter press reads element content' : function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 0;

        this.presenter.keyboardControllerObject.enter(this.event);

        assertTrue(this.stubs.readCurrentElementStub.called);
    },
});
