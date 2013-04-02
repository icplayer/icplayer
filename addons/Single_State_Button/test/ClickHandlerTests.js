TestCase("Click handler", {
    setUp: function () {
        this.presenter = AddonSingle_State_Button_create();

        this.presenter.configuration = {
            isDisabled: false,
            isErrorMode: false
        };

        sinon.stub(this.presenter, 'executeUserEventCode');
        sinon.stub(this.presenter, 'triggerButtonClickedEvent');
    },

    tearDown: function () {
        this.presenter.executeUserEventCode.restore();
        this.presenter.triggerButtonClickedEvent();
    },

    'test button click is disabled': function () {
        this.presenter.configuration.isDisabled = true;

        this.presenter.clickHandler();

        assertFalse(this.presenter.executeUserEventCode.called);
        assertFalse(this.presenter.triggerButtonClickedEvent.called);
    },

    'test addon in error checking mode': function () {
        this.presenter.configuration.isErrorMode = true;

        this.presenter.clickHandler();

        assertFalse(this.presenter.executeUserEventCode.called);
        assertFalse(this.presenter.triggerButtonClickedEvent.called);
    },

    'test button click is enabled and addon in working mode': function () {
        this.presenter.clickHandler();

        assertTrue(this.presenter.executeUserEventCode.calledOnce);
        assertTrue(this.presenter.triggerButtonClickedEvent.calledOnce);
    }
});