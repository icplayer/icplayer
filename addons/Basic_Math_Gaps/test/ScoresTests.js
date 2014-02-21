TestCase("Score Tests", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.presenter.configuration = {
            'gapsDefinition' : '[1] + [2] = 3',
            'isEquation' : true,
            'gapsValues' : ['1', '2'],
            'leftValue' : '3.00',
            'rightValue' : '3.00',
            'isActivity' : true,
            'isDisabled' : false,
            'hasBeenStarted' : true
        };

        this.presenter.$view = $(
            '<div class="basic-math-gaps-wrapper">' +
                '<div class="basic-math-gaps-container">' +
                    '<input value="1" />' +
                    '<span class="element">+</span>' +
                    '<input value="2" />' +
                    '<span class="element">=</span>' +
                    '<span class="element">3</span>' +
                '</div>' +
            '</div>');

    },

    'test getScore for equation and valid user input' : function() {
        var score = this.presenter.getScore();

        assertEquals(1, score);
    },

    'test getScore for equation and invalid user input' : function() {
        this.presenter.$view = $(
            '<div class="basic-math-gaps-wrapper">' +
                '<div class="basic-math-gaps-container">' +
                '<input value="1" />' +
                '<span class="element">+</span>' +
                '<input value="3" />' +
                '<span class="element">=</span>' +
                '<span class="element">3</span>' +
                '</div>' +
                '</div>');

        var score = this.presenter.getScore();

        assertEquals(0, score);
    },

    'test getScore for NOT equation and valid user input' : function() {
        this.presenter.configuration.isEquation = false;
        this.presenter.configuration.gapsValues = ['1', '2'];
        this.presenter.$view = $(
            '<div class="basic-math-gaps-wrapper">' +
                '<div class="basic-math-gaps-container">' +
                    '<input value="1" />' +
                    '<span class="element">></span>' +
                    '<input value="2" />' +
                '</div>' +
            '</div>');

        var score = this.presenter.getScore();

        assertEquals(2, score);
    },

    'test getScore for NOT equation and invalid user input' : function() {
        this.presenter.configuration.isEquation = false;
        this.presenter.configuration.gapsValues = ['1', '2'];
        this.presenter.$view = $(
            '<div class="basic-math-gaps-wrapper">' +
                '<div class="basic-math-gaps-container">' +
                    '<input value="1" />' +
                    '<span class="element">></span>' +
                    '<input value="1" />' +
                '</div>' +
            '</div>');

        var score = this.presenter.getScore();

        assertEquals(1, score);
    },

    'test getErrorsCount' : function() {
        this.presenter.configuration.isEquation = false;
        this.presenter.configuration.gapsValues = ['1', '2'];
        this.presenter.$view = $(
            '<div class="basic-math-gaps-wrapper">' +
                '<div class="basic-math-gaps-container">' +
                    '<input value="1" />' +
                    '<span class="element">></span>' +
                    '<input value="1" />' +
                '</div>' +
            '</div>');

        var errors = this.presenter.getErrorCount();

        assertEquals(1, errors);
    },

    'test getMaxScore when isEquation' : function() {
        var maxScore = this.presenter.getMaxScore();

        assertEquals(1, maxScore);
    },


    'test getMaxScore when NOT isEquation' : function() {
        this.presenter.configuration.isEquation = false;

        var maxScore = this.presenter.getMaxScore();

        assertEquals(2, maxScore);
    },

    'test getMaxScore will return 0 when addon is NOT activity' : function() {
        this.presenter.configuration.isActivity = false;

        var maxScore = this.presenter.getMaxScore();

        assertEquals(0, maxScore);
    },

    'test an empty gap does NOT count to score and errors, but it returns max score' : function() {
        this.presenter.configuration.gapsValues = ['1', '2'];
        this.presenter.configuration.isEquation = false;
        this.presenter.$view = $(
            '<div class="basic-math-gaps-wrapper">' +
                '<div class="basic-math-gaps-container">' +
                '<input value="" />' +
                '<span class="element">></span>' +
                '<input value="" />' +
                '</div>' +
            '</div>');

        var score = this.presenter.getScore(),
            errors = this.presenter.getErrorCount(),
            maxScore = this.presenter.getMaxScore();

        assertEquals(0, score);
        assertEquals(0, errors);
        assertEquals(2, maxScore);
    }
});