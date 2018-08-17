TestCase("[Double_State_Button] Handling keyboard events test case", {
    setUp: function () {
        this.presenter = AddonDouble_State_Button_create();
        this.stubs = {
            'clickHandlerStub': sinon.stub()
        };

        this.presenter.clickHandler = this.stubs.clickHandlerStub;

        this.presenter.wrapper = document.createElement('div');
        this.presenter.addKeyboardListeners();
    },

    'test when event keycode is space it should execute click logic': function () {
        var event = new KeyboardEvent('keydown', {keyCode: 32});

        this.presenter.wrapper.dispatchEvent(event);

        assertTrue(this.stubs.clickHandlerStub.called);
    },

    'test when event keycode is enter it should execute click logic': function () {
         var event = new KeyboardEvent('keydown', {keyCode: 13});

        this.presenter.wrapper.dispatchEvent(event);

        assertTrue(this.stubs.clickHandlerStub.called);
    },

    'test when event keycode is not enter nor space it should not execute click logic': function () {
         var event = new KeyboardEvent('keydown', {keyCode: 355});

        this.presenter.wrapper.dispatchEvent(event);

        assertFalse(this.stubs.clickHandlerStub.called);
    }
});