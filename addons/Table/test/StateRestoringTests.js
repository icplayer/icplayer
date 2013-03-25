TestCase("State restoring", {
    setUp: function () {
        this.presenter = AddonTable_create();

        sinon.stub(this.presenter, 'setVisibility');
    },

    tearDown: function () {
        this.presenter.setVisibility.restore();
    },

    'test restore visible table': function () {
        this.presenter.setState(JSON.stringify({ isVisible: true}));

        assertTrue(this.presenter.setVisibility.calledWith(true));
    },

    'test restore invisible table': function () {
        this.presenter.setState(JSON.stringify({ isVisible: false}));

        assertTrue(this.presenter.setVisibility.calledWith(false));
    }
});