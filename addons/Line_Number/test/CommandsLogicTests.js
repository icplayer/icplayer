TestCase("[Line Number] Commands logic - setState", {
    setUp: function () {
        this.presenter = AddonLine_Number_create();
        this.presenter.configuration = {};

        sinon.stub(this.presenter, 'setVisibility');
        sinon.stub(this.presenter, 'redrawRanges');
    },

    tearDown: function () {
        this.presenter.setVisibility.restore();
        this.presenter.redrawRanges.restore();
    },

    'test setState with empty state': function () {
        this.presenter.setState(undefined);

        assertFalse(this.presenter.redrawRanges.called);
        assertFalse(this.presenter.setVisibility.called);
    },

    'test restore visible module': function () {
        var state = JSON.stringify({
            isVisible: true,
            drawnRangesData: { ranges: {} }
        });

        this.presenter.setState(state);

        assertTrue(this.presenter.redrawRanges.calledOnce);
        assertTrue(this.presenter.configuration.isCurrentlyVisible);
        assertTrue(this.presenter.setVisibility.calledWith(true));
    },

    'test restore invisible module': function () {
        var state = JSON.stringify({
            isVisible: false,
            drawnRangesData: { ranges: {} }
        });

        this.presenter.setState(state);

        assertTrue(this.presenter.redrawRanges.calledOnce);
        assertFalse(this.presenter.configuration.isCurrentlyVisible);
        assertTrue(this.presenter.setVisibility.calledWith(false));
    }
});