TestCase("[PieChart] getActivitiesCount function", {
    setUp: function () {
        this.presenter = AddonPieChart_create();
    },

    'test given not active addon then return 0': function () {
        this.presenter.activity = false;

        assertEquals(0, this.presenter.getActivitiesCount());
    },

    'test given active addon then return 1': function () {
        this.presenter.activity = true;

        assertEquals(1, this.presenter.getActivitiesCount());
    }
});
