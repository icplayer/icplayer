TestCase("Reset logic", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {};

        sinon.stub(this.presenter, 'setVisibility');
    },

    tearDown: function () {
        this.presenter.setVisibility.restore();
    },

    'test reset to visible': function () {
        this.presenter.configuration.isVisibleByDefault = true;

        this.presenter.reset();

        assertTrue(this.presenter.setVisibility.calledWith(true));
    },

    'test reset to invisible': function () {
        this.presenter.configuration.isVisibleByDefault = false;

        this.presenter.reset();

        assertTrue(this.presenter.setVisibility.calledWith(false));
    }
});