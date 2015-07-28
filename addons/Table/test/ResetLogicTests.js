TestCase("[Table] Reset", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {};

        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();

        this.stubs = {
            setVisibility: sinon.stub(this.presenter, 'setVisibility'),
            reset: sinon.stub(this.presenter.GapsContainerObject.prototype, 'reset')
        };
    },

    tearDown: function () {
        this.presenter.setVisibility.restore();
        this.presenter.GapsContainerObject.prototype.reset.restore();
    },

    'test reset to visible': function () {
        this.presenter.configuration.isVisibleByDefault = true;

        this.presenter.reset();

        assertTrue(this.presenter.setVisibility.calledWith(true));
        assertTrue(this.stubs.reset.called);
    },

    'test reset to invisible': function () {
        this.presenter.configuration.isVisibleByDefault = false;

        this.presenter.reset();

        assertTrue(this.presenter.setVisibility.calledWith(false));
        assertTrue(this.stubs.reset.called);
    }
});