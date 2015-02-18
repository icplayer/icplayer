TestCase("[Animated Page Progress] Calculations tests", {
    setUp: function () {
        this.presenter = AddonAnimated_Page_Progress_create();
        this.presenter.configuration = {
            ranges: {
                maxScores: [0, 35, 65, 100]
            }
        }
    },

    'test percentage score when score is 0': function () {
        var pageScore = {
            score: 0,
            maxScore: 100
        };

        var score = this.presenter.getRange(pageScore);

        assertEquals(0, score);
    },

    'test percentage score when score is 100': function () {
        var pageScore = {
            score: 100,
            maxScore: 100
        };

        var score = this.presenter.getRange(pageScore);

        assertEquals(3, score);
    },

    'test percentage score when score is 21': function () {
        var pageScore = {
            score: 21,
            maxScore: 100
        };

        var score = this.presenter.getRange(pageScore);

        assertEquals(0, score);
    },

    'test percentage score when score is 35': function () {
        var pageScore = {
            score: 35,
            maxScore: 100
        };

        var score = this.presenter.getRange(pageScore);

        assertEquals(1, score);
    },

    'test percentage score when score is 50': function () {
        var pageScore = {
            score: 50,
            maxScore: 100
        };

        var score = this.presenter.getRange(pageScore);

        assertEquals(1, score);
    },

    'test percentage score when score is 65': function () {
        var pageScore = {
            score: 65,
            maxScore: 100
        };

        var score = this.presenter.getRange(pageScore);

        assertEquals(2, score);
    },

    'test percentage score when score is 70': function () {
        var pageScore = {
            score: 14,
            maxScore: 20
        };

        var score = this.presenter.getRange(pageScore);

        assertEquals(2, score);
    },

    'test percentage score when maxScore is 0': function () {
        var pageScore = {
            score: 0,
            maxScore: 0
        };

        var score = this.presenter.getRange(pageScore);

        assertEquals(0, score);
    },

    'test percentage score when score is NaN': function () {
        var pageScore = {
            score: 'a',
            maxScore: 20
        };

        var score = this.presenter.getRange(pageScore);

        assertEquals(0, score);
    },

    'test percentage score when maxScore is NaN': function () {
        var pageScore = {
            score: 13,
            maxScore: 'a'
        };

        var score = this.presenter.getRange(pageScore);

        assertEquals(0, score);
    }
});
