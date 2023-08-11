TestCase("[Puzzle] Upgrade Model", {

    setUp: function () {
        this.presenter = AddonPuzzle_create();
    },

    "test given empty model when upgrading isNotActivity then sets isNotActivity to False": function () {
        const upgradedModel = this.presenter.upgradeIsNotActivity({});

        assertNotUndefined(upgradedModel.isNotActivity);
        assertEquals("False", upgradedModel.isNotActivity);
    },

    "test given model with isNotActivity when upgradeModel is called then isNotActivity value remains unchanged": function () {
        const isNotActivity = "True";

        const upgradedModel = this.presenter.upgradeIsNotActivity({"isNotActivity": isNotActivity});

        assertNotUndefined(upgradedModel.isNotActivity);
        assertEquals("True", upgradedModel.isNotActivity);
    },
});
