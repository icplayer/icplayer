TestCase("[Page Counter] State Tests", {
    setUp: function () {
        this.presenter = AddonPage_Counter_create();
        this.presenter.updateVisibility = function () {};
    },

    'test state value for set state is undefined': function () {
        this.presenter.setState();

        assertTrue(this.presenter.isCurrentlyVisible); // Default value
    },

    'test setState correctly set visible value': function () {
        var state = JSON.stringify({visible: false});

        this.presenter.setState(state);

        assertFalse(this.presenter.isCurrentlyVisible);
    }
});