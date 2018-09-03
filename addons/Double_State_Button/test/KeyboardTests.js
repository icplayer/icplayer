TestCase("[Double_State_Button] Handling keyboard events test case", {
    setUp: function () {
        this.presenter = AddonDouble_State_Button_create();
        this.stubs = {
            'clickHandlerStub': sinon.stub(),
            'preventDefaultStub': sinon.stub()
        };

        this.presenter.clickHandler = this.stubs.clickHandlerStub;

        this.event = {
            preventDefault: this.stubs.preventDefaultStub,
            keyCode: 0
        };

        this.presenter.wrapper = document.createElement('div');
        this.presenter.addKeyboardListeners();
    },

    'test when event keycode is space it should execute click logic': function () {
        this.event.keyCode = 32;

        this.presenter.handleKeyboardEvents(this.event);

        assertTrue(this.stubs.clickHandlerStub.called);
        assertTrue(this.stubs.preventDefaultStub.called);
    },

    'test when event keycode is enter it should execute click logic': function () {
        this.event.keyCode = 13;
        this.presenter.handleKeyboardEvents(this.event);

        assertTrue(this.stubs.clickHandlerStub.called);
        assertTrue(this.stubs.preventDefaultStub.called);
    },

    'test when event keycode is not enter nor space it should not execute click logic': function () {
        this.presenter.handleKeyboardEvents(this.event);

        assertFalse(this.stubs.clickHandlerStub.called);
        assertFalse(this.stubs.preventDefaultStub.called);
    }
});