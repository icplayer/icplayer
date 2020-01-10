TestCase("[Shooting_Range - score and errors] score", {
    setUp: function () {
        this.presenter = AddonShooting_Range_create();

        this.presenter.state.score = 4;
        this.presenter.configuration.definitions = [
            {correctAnswers: [1,2]},
            {correctAnswers: [2]}
        ];
    },

    'test get score returns score from state': function () {
        assertEquals(4, this.presenter.getScore());
    },

    'test get max score properly calculate max score form definitions': function () {
        assertEquals(3, this.presenter.getMaxScore());
    }
});

TestCase("[Shooting_Range - score and errors] error count", {
    setUp: function () {
        this.presenter = AddonShooting_Range_create();

        this.presenter.state.errorCount = 4;
    },

    'test get error count returns count from state': function () {
        assertEquals(4, this.presenter.getErrorCount());
    },

    'test get error count reset value in state': function () {
        this.presenter.getErrorCount();

        assertEquals(4, this.presenter.state.errorCount);
    }
});