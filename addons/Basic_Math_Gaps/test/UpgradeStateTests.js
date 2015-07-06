TestCase("[Basic Math Gaps] Upgrade state", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.stubs = {
            upgradeSources: sinon.stub(this.presenter, 'upgradeSources')
        };
    },

    tearDown: function () {
        this.presenter.upgradeSources.restore();
    },

    'test upgrading sources': function () {
        this.stubs.upgradeSources.returns({});

        this.presenter.upgradeState({});

        assertTrue(this.stubs.upgradeSources.called);
    },

    'test not upgrading sources if they exist': function () {
        this.presenter.upgradeState({sources: []});

        assertFalse(this.stubs.upgradeSources.called);
    }
});

TestCase("[Basic Math Gaps] Upgrade sources validation", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.values = [1, 2, 3, 4, 5, 6];
        this.expectedSources = ["", "", "", "", "", ""];

        this.notUpgradedState = {
            values: this.values
        };
    },

    'test sources should have length of values answers': function () {
        var upgradedState = this.presenter.upgradeSources(this.notUpgradedState);

        assertNotUndefined(upgradedState.sources);
        assertEquals(this.values.length, upgradedState.sources.length);

    },

    'test upgrading sources should be empty strings': function () {
        var upgradedState = this.presenter.upgradeSources(this.notUpgradedState);

        assertNotUndefined(upgradedState.sources);
        assertEquals(this.expectedSources, upgradedState.sources);
    }
});