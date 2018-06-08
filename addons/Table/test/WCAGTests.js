TestCase("[Table] WCAG - buildKeyboardController", {

    setUp: function () {
        this.presenter = new AddonTable_create();
        this.presenter.configuration = {
            columnsCount: 1
        };

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

TestCase("[Table] handle keyboard input", {

    setUp: function () {
        this.presenter = new AddonTable_create();

        var spaceKeycode = 32;

        this.stubs = {
            getElementsStub: sinon.stub(),
            spaceKeyActionStub: sinon.spy()
        };
        var elements = [sinon.spy()];

        this.presenter.getElementsForKeyboardNavigation = this.stubs.getElementsStub.returns(elements);
        this.presenter.configuration = {
            columnsCount: 1
        };


        this.presenter.buildKeyboardController();

        this.presenter.keyboardControllerObject.mapping[spaceKeycode] = this.stubs.spaceKeyActionStub;
    },

    'test action should be called when mapping for keycode exists' : function () {
        var keycodeSpace = 32;
        var isShiftDown = false;

        $(document).on('keydown', this.presenter.keyboardController(keycodeSpace, isShiftDown));

        var event = jQuery.Event('keydown');
        event.which = keycodeSpace;
        $(document).trigger(event);

        assertTrue(this.stubs.spaceKeyActionStub.called);
    },

    'test action shouldnt be called when mapping for keycode doesnt exist' : function () {
        var keycodeSpace = 32;
        var isShiftDown = false;
        this.presenter.keyboardControllerObject.mapping = {};
        this.presenter.keyboardControllerObject.shiftKeysMapping = {};

        $(document).on('keydown', this.presenter.keyboardController(keycodeSpace, isShiftDown));

        var event = jQuery.Event('keydown');
        event.which = keycodeSpace;
        $(document).trigger(event);

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

        this.presenter.getElementsForKeyboardNavigation = this.stubs.getElementsStub;
        var elements = [sinon.spy()];
        this.presenter.getElementsForKeyboardNavigation.returns(elements);

        this.presenter.configuration = {
            columnsCount: 1
        };

        this.presenter.enterSpace = this.stubs.enterSpaceStub;
        this.presenter.buildKeyboardController();
        this.presenter.keyboardControllerObject.getTarget = this.stubs.getTargetStub;
    },

    'test select action should call click' : function () {
        this.presenter.keyboardControllerObject.selectAction();

        assertTrue(this.stubs.clickStub.called);
    }
});

TestCase("[Table] TTS tests", {

    setUp: function () {
        this.presenter = new AddonTable_create();

        this.stubs = {
            eventPreventDefaultStub: sinon.stub(),
            readCurrentElementStub: sinon.stub(),
            switchElementStub: sinon.stub(),
            getElementsStub: sinon.stub()
        };

        // mocked elements passed to navigation
        this.presenter.getElementsForKeyboardNavigation = this.stubs.getElementsStub;
        var elements = [sinon.spy(), sinon.spy(), sinon.spy(), sinon.spy()];
        this.presenter.getElementsForKeyboardNavigation.returns(elements);

        this.presenter.configuration = {
            columnsCount: 2,
            rowsCount: 2
        };



        this.presenter.buildKeyboardController();
        this.presenter.keyboardControllerObject.getTarget = this.stubs.getTargetStub;
        this.presenter.keyboardControllerObject.switchElement = this.stubs.switchElementStub;

        this.presenter.readCurrentNavigationElement = this.stubs.readCurrentElementStub;

        this.event = {
            preventDefault: this.stubs.eventPreventDefaultStub
        };
    },

    // TAB and RIGHT KEY

    'test element text should be read when in the LAST column and TAB or RIGHT key pressed' : function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 1;

        this.presenter.keyboardControllerObject.nextElement(this.event);

        assertTrue(this.stubs.readCurrentElementStub.called);
        assertFalse(this.stubs.switchElementStub.called);
    },

    'test element text should be read and element should be changed when not in the LAST column and TAB or RIGHT key pressed' : function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 0;

        this.presenter.keyboardControllerObject.nextElement(this.event);

        assertTrue(this.stubs.readCurrentElementStub.called);
        assertTrue(this.stubs.switchElementStub.called);
        assertTrue(this.stubs.switchElementStub.calledWith(1));
        assertTrue(this.stubs.switchElementStub.calledBefore(this.stubs.readCurrentElementStub));
    },

    // SHIT+TAB and LEFT KEY

    'test element text should read when in FIRST column and SHIFT+TAB or LEFT key pressed' : function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 0;

        this.presenter.keyboardControllerObject.previousElement(this.event);

        assertTrue(this.stubs.readCurrentElementStub.called);
        assertFalse(this.stubs.switchElementStub.called);
    },

    'test element text should read and element should be changed when not in FIRST column and SHIFT+TAB or LEFT key pressed' : function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 1;

        this.presenter.keyboardControllerObject.previousElement(this.event);

        assertTrue(this.stubs.readCurrentElementStub.called);
        assertTrue(this.stubs.switchElementStub.called);
        assertTrue(this.stubs.switchElementStub.calledWith(-1));
        assertTrue(this.stubs.switchElementStub.calledBefore(this.stubs.readCurrentElementStub));
    },

    // UP KEY

    'test element text should read when in FIRST row and UP key pressed' : function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 0;

        this.presenter.keyboardControllerObject.previousRow(this.event);

        assertTrue(this.stubs.readCurrentElementStub.called);
        assertFalse(this.stubs.switchElementStub.called);
    },

    'test element text should read and element should be changed when not in FIRST row and UP key pressed' : function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 2;

        this.presenter.keyboardControllerObject.previousRow(this.event);

        assertTrue(this.stubs.readCurrentElementStub.called);
        assertTrue(this.stubs.switchElementStub.called);
        assertTrue(this.stubs.switchElementStub.calledWith(-2));
        assertTrue(this.stubs.switchElementStub.calledBefore(this.stubs.readCurrentElementStub));
    },

     // DOWN KEY

    'test element text should read  when in LAST row and DOWN key pressed' : function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 2;

        this.presenter.keyboardControllerObject.nextRow(this.event);

        assertTrue(this.stubs.readCurrentElementStub.called);
        assertFalse(this.stubs.switchElementStub.called);
    },

    'test element text should read and element should be changed when not in LAST row and DOWN key pressed' : function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 0;

        this.presenter.keyboardControllerObject.nextRow(this.event);

        assertTrue(this.stubs.readCurrentElementStub.called);
        assertTrue(this.stubs.switchElementStub.called);
        assertTrue(this.stubs.switchElementStub.calledWith(2));
        assertTrue(this.stubs.switchElementStub.calledBefore(this.stubs.readCurrentElementStub));

    },
});