TestCase("States tests", {
    setUp: function () {
        this.presenter = AddonCompletion_Progress_create();

        sinon.stub(this.presenter, 'updateProgressUI');
        sinon.stub(this.presenter, 'setVisibility');

        this.presenter.configuration = {};
    },

    tearDown: function () {
        this.presenter.updateProgressUI.restore();
        this.presenter.setVisibility.restore();
    },

    'test set state on empty state': function () {
        this.presenter.setState("");

        assertFalse(this.presenter.updateProgressUI.called);
        assertFalse(this.presenter.setVisibility.called);
    },

    'test set state on filled state': function () {
        this.presenter.currentProgress = 0;
        this.presenter.configuration.isVisible = false;

        var state = JSON.stringify({
            currentProgress: 10,
            isVisible: true
        });

        this.presenter.setState(state);

        assertTrue(this.presenter.updateProgressUI.calledWith(10));
        assertEquals(10, this.presenter.currentProgress);
        assertTrue(this.presenter.setVisibility.calledWith(true));
        assertTrue(this.presenter.configuration.isVisible);
    },

    'test get state': function () {
        this.presenter.configuration.isVisible = false;
        this.presenter.currentProgress = 55;

        var expectedState = JSON.stringify({
            isVisible: false,
            currentProgress: 55
        });

        assertEquals(expectedState, this.presenter.getState());
    }
});
