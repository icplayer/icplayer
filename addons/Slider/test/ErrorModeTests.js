TestCase("[Slider] Error mode", {
    setUp: function() {
        this.presenter = AddonSlider_create();
        this.presenter.configuration = {
            isErrorMode: false,
            shouldBlockInErrorMode: false
        };

        sinon.stub(this.presenter, 'addDisabledClass');
        sinon.stub(this.presenter, 'removeDisabledClass');
    },

    tearDown: function() {
        this.presenter.addDisabledClass.restore();
        this.presenter.removeDisabledClass.restore();
    },

    'test error mode without blocking': function() {
        this.presenter.setShowErrorsMode();

        assertTrue(this.presenter.configuration.isErrorMode);
        assertFalse(this.presenter.addDisabledClass.called);
        assertFalse(this.presenter.removeDisabledClass.called);
    },

    'test error mode with blocking': function() {
        this.presenter.configuration.shouldBlockInErrorMode = true;

        this.presenter.setShowErrorsMode();

        assertTrue(this.presenter.configuration.isErrorMode);
        assertTrue(this.presenter.addDisabledClass.calledOnce);
        assertFalse(this.presenter.removeDisabledClass.called);
    },

    'test work mode': function() {
        this.presenter.setWorkMode();

        assertFalse(this.presenter.configuration.isErrorMode);
        assertFalse(this.presenter.addDisabledClass.called);
        assertTrue(this.presenter.removeDisabledClass.calledOnce);
    }
});