TestCase("[Double_State_Button] Navigating with keyboard test case", {
    setUp: function () {
        this.presenter = AddonDouble_State_Button_create();
        this.stubs = {
            'clickHandlerStub': sinon.stub()
        };

        this.presenter.clickHandler = this.stubs.clickHandlerStub;

        this.wrapper = $('<div class="doublestate-button-wrapper"> </div>');
    },

    'test when event keycode is space it should execute click logic': function () {
        var event = {
            'keyCode': 32,
            'preventDefault': function(){}
        };
        this.presenter.handleKeyboardEvents(event);

        assertTrue(this.stubs.clickHandlerStub.called);
    },

    'test when event keycode is enter it should execute click lgoic': function () {
        var event = {
            'keyCode': 13,
            'preventDefault': function(){}
        };
        this.presenter.handleKeyboardEvents(event);

        assertTrue(this.stubs.clickHandlerStub.called);
    }

});