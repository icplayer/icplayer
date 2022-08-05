TestCase("[Puzzle] Upgrade Model", {

    setUp: function () {
        this.presenter = AddonPuzzle_create();
    },

    "test given empty model when upgrading isNotActivity then sets isNotActivity to false": function () {
        const upgradedModel = this.presenter.upgradeIsNotActivity({});

        assertNotUndefined(upgradedModel.isNotActivity);
        assertFalse(upgradedModel.isNotActivity);
    },

    "test given model with isNotActivity being true when upgrading model then sets isNotActivity to true": function () {
        const isNotActivity = true;
        const upgradedModel = this.presenter.upgradeIsNotActivity({'isNotActivity': isNotActivity});

        assertNotUndefined(upgradedModel.isNotActivity);
        assertTrue(upgradedModel.isNotActivity);
    },

});