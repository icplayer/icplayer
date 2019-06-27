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
        var event = jQuery.Event('keydown');
        event.which = keycodeSpace;

        this.presenter.keyboardController(keycodeSpace, isShiftDown, event);


        assertTrue(this.stubs.spaceKeyActionStub.called);
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
            readCurrentCellStub: sinon.stub(),
            switchElementStub: sinon.stub(),
            getElementsStub: sinon.stub(),
            selectGapStub: sinon.stub(),
            markCurrentElementStub: sinon.stub()
        };

        // mocked elements passed to navigation
        this.presenter.getElementsForKeyboardNavigation = this.stubs.getElementsStub;
        var elements = [sinon.spy(), sinon.spy(), sinon.spy(), sinon.spy()];
        this.presenter.getElementsForKeyboardNavigation.returns(elements);

        this.presenter.configuration = {
            columnsCount: 2,
            rowsCount: 2
        };
        this.presenter.setSpeechTexts();


        this.presenter.buildKeyboardController();
        this.presenter.keyboardControllerObject.getTarget = this.stubs.getTargetStub;
        this.presenter.keyboardControllerObject.switchElement = this.stubs.switchElementStub;
        this.presenter.keyboardControllerObject.markCurrentElement = this.stubs.markCurrentElementStub;

        this.presenter.readCurrentNavigationElement = this.stubs.readCurrentElementStub;
        this.presenter.readCurrentCellTitle = this.stubs.readCurrentCellStub;
        this.presenter.selectGap = this.stubs.selectGapStub;

        this.event = {
            preventDefault: this.stubs.eventPreventDefaultStub
        };
    },

    // RIGHT KEY

    'test element text should be read when in the LAST column and RIGHT key pressed' : function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 1;

        this.presenter.keyboardControllerObject.nextElement(this.event);

        assertTrue(this.stubs.readCurrentCellStub.called);
        assertFalse(this.stubs.switchElementStub.called);
    },

    'test element text should be read and element should be changed when not in the LAST column and RIGHT key pressed' : function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 0;

        this.presenter.keyboardControllerObject.nextElement(this.event);

        assertTrue(this.stubs.readCurrentCellStub.called);
        assertTrue(this.stubs.switchElementStub.called);
        assertTrue(this.stubs.switchElementStub.calledWith(1));
        assertTrue(this.stubs.switchElementStub.calledBefore(this.stubs.readCurrentCellStub));
    },

    // LEFT KEY

    'test element text should read when in FIRST column and LEFT key pressed' : function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 0;

        this.presenter.keyboardControllerObject.previousElement(this.event);

        assertTrue(this.stubs.readCurrentCellStub.called);
        assertFalse(this.stubs.switchElementStub.called);
    },

    'test element text should read and element should be changed when not in FIRST column and SHIFT+TAB or LEFT key pressed' : function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 1;

        this.presenter.keyboardControllerObject.previousElement(this.event);

        assertTrue(this.stubs.readCurrentCellStub.called);
        assertTrue(this.stubs.switchElementStub.called);
        assertTrue(this.stubs.switchElementStub.calledWith(-1));
        assertTrue(this.stubs.switchElementStub.calledBefore(this.stubs.readCurrentCellStub));
    },

    // UP KEY

    'test element text should read when in FIRST row and UP key pressed' : function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 0;

        this.presenter.keyboardControllerObject.previousRow(this.event);

        assertTrue(this.stubs.readCurrentCellStub.called);
        assertFalse(this.stubs.switchElementStub.called);
    },

    'test element text should read and element should be changed when not in FIRST row and UP key pressed' : function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 2;

        this.presenter.keyboardControllerObject.previousRow(this.event);

        assertTrue(this.stubs.readCurrentCellStub.called);
        assertTrue(this.stubs.switchElementStub.called);
        assertTrue(this.stubs.switchElementStub.calledWith(-2));
        assertTrue(this.stubs.switchElementStub.calledBefore(this.stubs.readCurrentCellStub));
    },

     // DOWN KEY

    'test element text should read  when in LAST row and DOWN key pressed' : function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 2;

        this.presenter.keyboardControllerObject.nextRow(this.event);

        assertTrue(this.stubs.readCurrentCellStub.called);
        assertFalse(this.stubs.switchElementStub.called);
    },

    'test element text should read and element should be changed when not in LAST row and DOWN key pressed' : function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 0;

        this.presenter.keyboardControllerObject.nextRow(this.event);

        assertTrue(this.stubs.readCurrentCellStub.called);
        assertTrue(this.stubs.switchElementStub.called);
        assertTrue(this.stubs.switchElementStub.calledWith(2));
        assertTrue(this.stubs.switchElementStub.calledBefore(this.stubs.readCurrentCellStub));

    },

    // ENTER KEY
    'test enter press activates gap navigation and reads cell content' : function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 0;
        this.presenter.addonKeyboardNavigationActive = true;

        this.presenter.keyboardControllerObject.enter(this.event);

        assertTrue(this.stubs.selectGapStub.called);
        assertTrue(this.presenter.gapNavigation);
        assertTrue(this.stubs.readCurrentElementStub.called);

    },

    'test first enter press activates keyboard navigation and reads cell title' : function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 0;

        this.presenter.keyboardControllerObject.enter(this.event);

        assertFalse(this.stubs.selectGapStub.called);
        assertFalse(this.presenter.gapNavigation);
        assertTrue(this.presenter.addonKeyboardNavigationActive);
        assertTrue(this.stubs.readCurrentCellStub.called);
        assertFalse(this.stubs.readCurrentElementStub.called);

    },

    'test addonKeyboardNavigationActive must be set to false in escape when gap navigation not activated': function() {
        this.presenter.addonKeyboardNavigationActive = true;
        this.presenter.gapNavigation = false;

        var keycode = 27;
        var event = {
            preventDefault: sinon.stub()
        };

        this.presenter.keyboardController(keycode, false, event);

        assertFalse(this.presenter.addonKeyboardNavigationActive);
    },

    'test addonKeyboardNavigationActive must be set to true in escape when gap navigation is activated': function() {
        this.presenter.addonKeyboardNavigationActive = true;
        this.presenter.gapNavigation = true;

        var keycode = 27;
        var event = {
            stopPropagation: sinon.stub(),
            preventDefault: sinon.stub()
        };

        this.presenter.keyboardController(keycode, false, event);

        assertTrue(this.presenter.addonKeyboardNavigationActive);
    }
});