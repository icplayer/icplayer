TestCase("[Multiple Gap] Upgrade state", {
    setUp: function () {
        this.presenter = Addonmultiplegap_create();

        sinon.stub(this.presenter, 'upgradeStateForVisibility');
    },

    tearDown: function () {
        this.presenter.upgradeStateForVisibility.restore();
    },

    'test show command when addon is hidden' : function() {
        var upgradedState = this.presenter.upgradeState({});

        assertTrue(this.presenter.upgradeStateForVisibility.calledOnce);
    }
});

TestCase("[Multiple Gap] Upgrade state for visibility", {
    setUp: function () {
        this.presenter = Addonmultiplegap_create();
    },

    'test state should be upgraded': function () {
        var placeholders = [1, 2, 3];

        var upgradedState = this.presenter.upgradeStateForVisibility(placeholders);

        assertEquals(placeholders, upgradedState.placeholders);
        assertTrue(upgradedState.isVisible);
    },

    'test state should not be upgraded - it is in JSON format and has visibility info': function () {
        var placeholders = [1, 2, 3];

        var upgradedState = this.presenter.upgradeStateForVisibility({placeholders: placeholders, isVisible: false});

        assertEquals(placeholders, upgradedState.placeholders);
        assertFalse(upgradedState.isVisible);
    }
});