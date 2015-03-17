TestCase("[Coloring] Upgrade state", {
    setUp: function () {
        this.presenter = AddonColoring_create();
        this.stubs = {
            upgradeUserAreas: sinon.stub(this.presenter, 'upgradeUserAreas')
        };
    },

    tearDown: function () {
        this.presenter.upgradeUserAreas.restore();
    },

    'test upgrading user areas': function () {
        this.stubs.upgradeUserAreas.returns({});
        var upgradedState = this.presenter.upgradeState({});

        assertTrue(this.stubs.upgradeUserAreas.called);
    },

    'test not upgrading user areas': function () {
        this.stubs.upgradeUserAreas.returns({});
        var upgradedState = this.presenter.upgradeState({userAreas: []});

        assertFalse(this.stubs.upgradeUserAreas.called);
    }
});

TestCase("[Coloring] Upgrade user areas", {
    setUp: function () {
        this.presenter = AddonColoring_create();
    },

    'test user areas upgrade': function () {
        var upgradedState = this.presenter.upgradeUserAreas({isErase: false, testAttribute: 5});

        assertEquals({isErase: false, testAttribute: 5, userAreas: []}, upgradedState);
    }
});