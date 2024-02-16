TestCase("[Writing Calculations] Was all filled", {
    'setUp' : function() {
        this.presenter = AddonWritingCalculations_create();

        sinon.stub(this.presenter, 'getEmptyBoxesInputs');
        sinon.stub(this.presenter, 'getHelpBoxesInputs');
    },

    tearDown: function () {
        this.presenter.getEmptyBoxesInputs.restore();
        this.presenter.getHelpBoxesInputs.restore();
    },

    'test all inputs are filled': function() {
        const $inputs = [$('<input value="4" />'), $('<input value="1" />'), $('<input value="2" />'), $('<input value="3" />')];
        this.presenter.getEmptyBoxesInputs.returns($inputs);

        assertTrue(this.presenter.isAllEmptyBoxInputsFilled());
    },

    'test all inputs are filled even when help boxes are not filled': function() {
        const $emptyBoxesInputs = [$('<input value="4" />'), $('<input value="1" />'), $('<input value="2" />'), $('<input value="3" />')];
        this.presenter.getEmptyBoxesInputs.returns($emptyBoxesInputs);

        const $helpBoxesInputs = [$('<input value="" />'), $('<input value="1" />'), $('<input value="22" />')];
        this.presenter.getHelpBoxesInputs.returns($helpBoxesInputs);

        assertTrue(this.presenter.isAllEmptyBoxInputsFilled());
    },

    'test no input is filled': function() {
        const inputs = [$('<input value="" />'), $('<input value="" />'), $('<input value="" />'), $('<input value="" />')];
        this.presenter.getEmptyBoxesInputs.returns(inputs);

        assertFalse(this.presenter.isAllEmptyBoxInputsFilled());
    },

    'test one input is not filled': function() {
        const inputs = [$('<input value="4" />'), $('<input value="7" />'), $('<input value="" />'), $('<input value="3" />')];
        this.presenter.getEmptyBoxesInputs.returns(inputs);

        assertFalse(this.presenter.isAllEmptyBoxInputsFilled());
    }
});

TestCase("[Writing Calculations] Get all answers", {
    'setUp' : function() {
        this.presenter = AddonWritingCalculations_create();
    },

    'test results are not identical': function() {
        var inputs =
            [
                $('<input class="writing-calculations-input" value="1" row="1" cell="1"/>'),
                $('<input class="writing-calculations-input" value="2" row="1" cell="2"/>'),
                $('<div class="container-number" row="2" cell="1">3</div>'),
                $('<input class="writing-calculations-input" value="4" row="2" cell="2" />')
            ];

        assertEquals([["1","2"],["3","4"]], this.presenter.getAllAnswers(inputs));
    }
});

TestCase("[Writing Calculations] Compare user answers and declared answers", {
    'setUp' : function() {
        this.presenter = AddonWritingCalculations_create();
        this.presenter.correctAnswersList = [
            {"rowIndex" : 1, "cellIndex" : 1, "value" : 3},
            {"rowIndex" : 2, "cellIndex" : 2, "value" : 5}
        ];
    },

    'test all answers are correct': function() {
        var answers = [[1, 2], [3, 4], [4, 6]];
        var correctAnswers = [[3, 4], [1, 2], [4, 6]];

        assertTrue(this.presenter.compareAnswers(correctAnswers, answers));
    },

    'test two identical answers': function() {
        var answers = [[1, 2], [1, 2], [4, 6]];
        var correctAnswers = [[3, 4], [1, 2], [4, 6]];

        assertFalse(this.presenter.compareAnswers(correctAnswers, answers));
    },

    'test some answers are incorrect': function() {
        var answers = [[1, 2], [3, 4], [4, 6]];
        var correctAnswers = [[3, 4], [3, 4], [4, 6]];

        assertFalse(this.presenter.compareAnswers(correctAnswers, answers));
    },

    'test all answers are filled correctly but results are different': function() {
        var answers = [[1, 2], [3, 4], [4, 7]];
        var correctAnswers = [[1, 4], [3, 4], [4, 6]];

        assertFalse(this.presenter.compareAnswers(correctAnswers, answers));
    }
});

TestCase("[Writing Calculations] Was declared row found in user answers", {
    'setUp' : function() {
        this.presenter = AddonWritingCalculations_create();
    },

    'test all answers are correctly': function() {
        var correctAnswers = [[3, 4], [1, 2], [4, 6]];
        var answers = [[1, 2], [3, 4], [4, 6]];

        assertTrue(this.presenter.wasRowFound(correctAnswers[0], answers));
    },

    'test two identical answers': function() {
        var correctAnswers = [[3, 4], [1, 2], [4, 6]];
        var answers = [[1, 2], [1, 2], [4, 6]];

        assertFalse(this.presenter.wasRowFound(correctAnswers[0], answers));
    },

    'test all answers are not correctly': function() {
        var correctAnswers = [[3, 4], [3, 4], [4, 6]];
        var answers = [[1, 2], [3, 4], [4, 6]];

        assertTrue(this.presenter.wasRowFound(correctAnswers[0], answers));
    }
});

TestCase("[Writing Calculations] Compare results", {
    'setUp' : function() {
        this.presenter = AddonWritingCalculations_create();
    },

    'test results are not identical': function() {
        var userResult = [[3, 4]];
        var declaredResult = [[3, 4]];

        assertTrue(this.presenter.compareResults(userResult, declaredResult));
    },

    'test results are identical': function() {
        var declaredResult = [[3, 4]];
        var userResult = [[1, 2]];

        assertFalse(this.presenter.compareResults(userResult, declaredResult));
    }
});
