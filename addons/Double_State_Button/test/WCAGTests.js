TestCase('[Double State Button] WCAG', {
    setUp: function () {
        this.presenter = AddonDouble_State_Button_create();
    },

    'test on enter click will not be called': function () {
        this.presenter.clickHandler = sinon.mock();

        this.presenter.keyboardController(13);
        assertTrue(this.presenter.clickHandler.notCalled);
        this.presenter.keyboardController(12);
        assertTrue(this.presenter.clickHandler.notCalled);
    },

    'test on space click will be called': function () {
        this.presenter.clickHandler = sinon.mock();

        this.presenter.keyboardController(32);
        assertTrue(this.presenter.clickHandler.calledOnce);
        this.presenter.keyboardController(12);
        assertTrue(this.presenter.clickHandler.calledOnce);
    }
});