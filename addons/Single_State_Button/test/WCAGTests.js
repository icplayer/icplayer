TestCase('[Single State Button] WCAG', {
    setUp: function () {
        this.presenter = AddonSingle_State_Button_create();

    },
    'test on enter click will be called': function () {
        this.presenter.clickHandler = sinon.mock();
        var event = {
            'preventDefault': sinon.stub()
        };

        this.presenter.keyboardController(13, false, event);
        assertTrue(this.presenter.clickHandler.calledOnce);
        this.presenter.keyboardController(12, false, event);
        assertTrue(this.presenter.clickHandler.calledOnce);
    }
});