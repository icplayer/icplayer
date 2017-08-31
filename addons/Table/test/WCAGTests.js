TestCase("[Table] WCAG - buildKeyboardController", {

    setUp: function () {
        this.presenter = new AddonTable_create();
        this.presenter.getColumnsCount = sinon.stub().returns(1);

    },

    'test if build keyboard controller will create keyboard controller' : function () {
        this.presenter.getElementsForKeyboardNavigation = sinon.stub();
        var elements = [sinon.spy(), sinon.spy(), sinon.spy()];
        this.presenter.getElementsForKeyboardNavigation.returns(elements);

        this.presenter.buildKeyboardController();

        assertTrue(this.presenter.keyboardControllerObject !== null);
        assertEquals(this.presenter.keyboardControllerObject.keyboardNavigationElements, elements);
    }
});

TestCase("[Table] handle keyboard input", {

    setUp: function () {
        this.presenter = new AddonTable_create();

        var spaceKeycode = 32;

        this.stubs = {
            getElementsStub: sinon.stub(),
            spaceKeyActionStub: sinon.stub(),
            getColumnsCountStub: sinon.stub().returns(1)
        };

        this.presenter.getColumnsCount = this.stubs.getColumnsCountStub;
        this.presenter.getElementsForKeyboardNavigation = this.stubs.getElementsStub;
        var elements = [sinon.spy()];
        this.presenter.getElementsForKeyboardNavigation.returns(elements);

        this.presenter.buildKeyboardController();

        this.presenter.keyboardControllerObject.mapping[spaceKeycode] = this.stubs.spaceKeyActionStub;
    },

    'test action should be called when mapping for keycode exists' : function () {
        var keycodeSpace = 32;
        var isShiftDown = false;

        this.presenter.keyboardControllerObject.handle(keycodeSpace, isShiftDown)

        assertTrue(this.stubs.spaceKeyActionStub.calledOnce);
    },

    'test action shouldnt be called when mapping for keycode doesnt exist' : function () {
        var keycodeSpace = 32;
        var isShiftDown = false;
        this.presenter.keyboardControllerObject.mapping = {};
        this.presenter.keyboardControllerObject.shiftKeysMapping = {};

        this.presenter.keyboardControllerObject.handle(keycodeSpace, isShiftDown)

        assertTrue(this.stubs.spaceKeyActionStub.notCalled);
    }
});

TestCase("[Table] select action", {

    setUp: function () {
        this.presenter = new AddonTable_create();

        this.presenter.getColumnsCount = sinon.stub().returns(1);

        this.stubs = {
            getTargetStub: sinon.stub(),
            clickStub: sinon.stub(),
            enterSpaceStub: sinon.stub(),
            getElementsStub: sinon.stub(),
            getColumnsCountStub: sinon.stub().returns(1)
        };

        this.gapElement = {
            click: this.stubs.clickStub,
        };

        this.stubs.getTargetStub.returns(this.gapElement);


        this.presenter.getColumnsCount = this.stubs.getColumnsCountStub;
        this.presenter.getElementsForKeyboardNavigation = this.stubs.getElementsStub;
        var elements = [sinon.spy()];
        this.presenter.getElementsForKeyboardNavigation.returns(elements);

        this.presenter.enterSpace = this.stubs.enterSpaceStub;
        this.presenter.buildKeyboardController();
        this.presenter.keyboardControllerObject.getTarget = this.stubs.getTargetStub;
    },

    'test select action should call click' : function () {
        this.presenter.keyboardControllerObject.selectAction();

        assertTrue(this.stubs.clickStub.called);
    }
});