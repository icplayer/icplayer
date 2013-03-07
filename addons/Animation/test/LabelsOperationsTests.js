TestCase("Labels operations", {
    setUp: function () {
        this.presenter = AddonAnimation_create();
    },

    'test empty labels array': function () {
        var labels = [];

        var labelsIndexes = this.presenter.getLabelIndexesForFrame(labels, 1);

        assertEquals([], labelsIndexes);
    },

    'test single label meets criteria': function () {
        var labels = [
            {frames: [1, 2, 3]},
            {frames: [2, 3, 4]}
        ];

        var labelsIndexes = this.presenter.getLabelIndexesForFrame(labels, 1);

        assertEquals([0], labelsIndexes);
    },

    'test multiple labels meets criteria': function () {
        var labels = [
            {frames: [1, 2, 3]},
            {frames: [2, 3, 4, 5]},
            {frames: [2, 3, 4]},
            {frames: [2, 3, 4, 5, 7]}
        ];

        var labelsIndexes = this.presenter.getLabelIndexesForFrame(labels, 5);

        assertEquals([1, 3], labelsIndexes);
    }
});