TestCase("[Puzzle] Scores tests", {
    setUp: function () {
        this.presenter = AddonPuzzle_create();

        this.presenter.configuration = {
            isNotActivity: false
        };
    },

    'test given normal conditions when calling getMaxScore then getMaxScore should return 1': function () {
        var maxScore = this.presenter.getMaxScore();

        assertEquals(1,maxScore);
    },

    'test given isNotActivity true when calling getMaxScore then getMaxScore should return 0': function () {
        this.presenter.configuration.isNotActivity = true;

        var maxScore = this.presenter.getMaxScore();

        assertEquals(0, maxScore);
    },
});