TestCase("[Custom Scoring] Commands logic - setters", {
    setUp: function () {
        this.presenter = AddonCustom_Scoring_create();
        this.presenter.configuration = {
            scoring: {
                score: 0,
                errors: 0,
                maxScore: 5
            }
        };
    },

    'test proper score set': function () {
        this.presenter.setScore(5);

        assertEquals(5, this.presenter.configuration.scoring.score);
        assertEquals(0, this.presenter.configuration.scoring.errors);
    },

    'test score value is string': function () {
        this.presenter.setScore('3');

        assertEquals(3, this.presenter.configuration.scoring.score);
        assertEquals(0, this.presenter.configuration.scoring.errors);
    },

    'test invalid score value': function () {
        this.presenter.setScore('number');

        assertEquals(0, this.presenter.configuration.scoring.score);
        assertEquals(0, this.presenter.configuration.scoring.errors);
    },

    'test score value is bigger than max score': function () {
        this.presenter.setScore(6);

        assertEquals(0, this.presenter.configuration.scoring.score);
        assertEquals(0, this.presenter.configuration.scoring.errors);
    },

    'test proper errors set': function () {
        this.presenter.setErrors(5);

        assertEquals(5, this.presenter.configuration.scoring.errors);
        assertEquals(0, this.presenter.configuration.scoring.score);
    },

    'test errors value is string': function () {
        this.presenter.setErrors('3');

        assertEquals(3, this.presenter.configuration.scoring.errors);
        assertEquals(0, this.presenter.configuration.scoring.score);
    },

    'test errors value': function () {
        this.presenter.setErrors('number');

        assertEquals(0, this.presenter.configuration.scoring.errors);
        assertEquals(0, this.presenter.configuration.scoring.score);
    }
});

TestCase("[Custom Scoring] Commands logic - getters", {
    setUp: function () {
        this.presenter = AddonCustom_Scoring_create();
        this.presenter.configuration = {
            scoring: {
                score: 2,
                errors: 3,
                maxScore: 5
            }
        };

        sinon.stub(this.presenter, 'evaluateScript');
        this.presenter.evaluateScript.returns()
    },

    tearDown: function () {
        this.presenter.evaluateScript.restore();
    },

    'test get score': function () {
        assertEquals(2, this.presenter.getScore());
        assertTrue(this.presenter.evaluateScript.calledOnce);
    },

    'test get error count': function () {
        assertEquals(3, this.presenter.getErrorCount());
        assertTrue(this.presenter.evaluateScript.calledOnce);
    }
});