TestCase("[Zoom Image] Upgrade states", {
    setUp: function() {
        this.presenter = AddonZoom_Image_create();
    },

    'test upgrade state for visibility': function() {
        var visibilityUpgradeStub = sinon.stub(this.presenter, 'upgradeStateForVisibility');

        this.presenter.upgradeState({});

        assertTrue(visibilityUpgradeStub.called);

        this.presenter.upgradeStateForVisibility.restore();
    },

    'test upgrade state when state is empty': function() {
        var state = {};

        var upgradedState = this.presenter.upgradeStateForVisibility(state);

        assertTrue(upgradedState.isVisible);
    },

    'test upgrade state when visibility is set to false': function() {
        var state = {
            "isVisible": false
        };

        var upgradedState = this.presenter.upgradeStateForVisibility(state);

        assertFalse(upgradedState.isVisible);
    }
});

TestCase("[Zoom Image] Get state", {
    setUp: function() {
        this.presenter = AddonZoom_Image_create();
        this.presenter.configuration = {};
        sinon.stub(this.presenter, 'setVisibility');
    },

    tearDown: function () {
        this.presenter.setVisibility.restore();
    },

    'test get state': function() {
        this.presenter.configuration.isVisible = false;

        var stateString = this.presenter.getState();

        assertEquals("{\"isVisible\":false}", stateString);
    }
});

TestCase("[Zoom Image] Set states", {
    setUp: function() {
        this.presenter = AddonZoom_Image_create();
        this.presenter.configuration = {};
        sinon.stub(this.presenter, 'setVisibility');
    },

    tearDown: function () {
        this.presenter.setVisibility.restore();
    },

    'test set state when state is undefined': function() {
        this.presenter.setState();

        assertFalse(this.presenter.setVisibility.calledOnce);
    },

    'test set state is property visible is undefined': function() {
        var state = JSON.stringify({});

        this.presenter.setState(state);

        assertTrue(this.presenter.setVisibility.calledOnce);
    },

    'test set state when property visible is false': function() {
        var state = JSON.stringify({
            isVisible: true,
            gaps: []
        });

        this.presenter.setState(state);

        assertTrue(this.presenter.setVisibility.calledWith(true));
    }
});