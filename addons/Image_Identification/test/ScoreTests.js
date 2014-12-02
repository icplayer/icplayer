TestCase("Score", {
    setUp: function() {
        this.presenter = AddonImage_Identification_create();
    },

    'test SelectionCorrect checked and item selected': function() {
        this.presenter.configuration = {
            shouldBeSelected: true,
            isSelected: true,
            isActivity: true
        };

        var score = this.presenter.getScore();
        var error = this.presenter.getErrorCount();

        assertEquals(1, score);
        assertEquals(0, error);
    },

    'test SelectionCorrect checked and item not selected': function() {
        this.presenter.configuration = {
            shouldBeSelected: true,
            isSelected: false,
            isActivity: true
        };

        var score = this.presenter.getScore();
        var error = this.presenter.getErrorCount();

        assertEquals(0, score);
        assertEquals(0, error);
    },

    'test SelectionCorrect not checked and item selected': function() {
        this.presenter.configuration = {
            shouldBeSelected: false,
            isSelected: true,
            isActivity: true
        };

        var score = this.presenter.getScore();
        var error = this.presenter.getErrorCount();

        assertEquals(0, score);
        assertEquals(1, error);
    },

    'test SelectionCorrect not checked and item not selected': function() {
        this.presenter.configuration = {
            shouldBeSelected: false,
            isSelected: false,
            isActivity: true
        };

        var score = this.presenter.getScore();
        var error = this.presenter.getErrorCount();

        assertEquals(0, score);
        assertEquals(0, error);
    },

    'test SelectionCorrect checked, max score should be 1': function() {
        this.presenter.configuration = {
            shouldBeSelected: true,
            isActivity: true
        };

        var score = this.presenter.getMaxScore();

        assertEquals(1, score);
    },

    'test SelectionCorrect not checked, max score should be 0': function() {
        this.presenter.configuration = {
            shouldBeSelected: false,
            isActivity: true
        };

        var score = this.presenter.getMaxScore();

        assertEquals(0, score);
    },

    'test module is not in activity mode': function() {
        this.presenter.configuration = {
            shouldBeSelected: true,
            isSelected: true,
            isActivity: false
        };

        var maxScore = this.presenter.getMaxScore();
        var score = this.presenter.getScore();
        var errors = this.presenter.getErrorCount();

        assertEquals(0, maxScore);
        assertEquals(0, score);
        assertEquals(0, errors);
    },

    'test Score after setState should be 1': function() {
        this.presenter.configuration = {
            shouldBeSelected: true,
            isActivity: true
        };

        var state = {isSelected: true, isVisible: true},
            stateString = JSON.stringify(state);

        this.presenter.$view = {bind:function(){}};

        this.presenter.setState(stateString);

        var score = this.presenter.getScore();

        assertEquals(1, score);
    }
});