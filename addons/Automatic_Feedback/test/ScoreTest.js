TestCase("Score test", {
    setUp: function () {
        this.presenter = AddonAutomatic_Feedback_create();

    },

    'test given correct score when score testing methods are called then return correct result': function () {
        var score = 2;
        var maxScore = 2;
        var errorCount = 0;

        assertTrue(this.presenter.isScoreCorrect(score, maxScore, errorCount));
        assertFalse(this.presenter.isScoreIncorrect(score, maxScore, errorCount));
        assertFalse(this.presenter.isScoreEmpty(score, maxScore, errorCount));
        assertFalse(this.presenter.isScorePartial(score, maxScore, errorCount));
    },

    'test given incorrect score when score testing methods are called then return correct result': function () {
        var score = 1;
        var maxScore = 2;
        var errorCount = 1;

        assertFalse(this.presenter.isScoreCorrect(score, maxScore, errorCount));
        assertTrue(this.presenter.isScoreIncorrect(score, maxScore, errorCount));
        assertFalse(this.presenter.isScoreEmpty(score, maxScore, errorCount));
        assertFalse(this.presenter.isScorePartial(score, maxScore, errorCount));
    },

    'test given empty score when score testing methods are called then return correct result': function () {
        var score = 0;
        var maxScore = 2;
        var errorCount = 0;

        assertFalse(this.presenter.isScoreCorrect(score, maxScore, errorCount));
        assertFalse(this.presenter.isScoreIncorrect(score, maxScore, errorCount));
        assertTrue(this.presenter.isScoreEmpty(score, maxScore, errorCount));
        assertFalse(this.presenter.isScorePartial(score, maxScore, errorCount));
    },

    'test given partially correct score when score testing methods are called then return correct result': function () {
        var score = 1;
        var maxScore = 2;
        var errorCount = 0;

        assertFalse(this.presenter.isScoreCorrect(score, maxScore, errorCount));
        assertFalse(this.presenter.isScoreIncorrect(score, maxScore, errorCount));
        assertFalse(this.presenter.isScoreEmpty(score, maxScore, errorCount));
        assertTrue(this.presenter.isScorePartial(score, maxScore, errorCount));
    }
});