TestCase("[MathText] Answer correctness test case", {
    setUp: function () {
        this.presenter = AddonMathText_create();

        // stubs
        this.stubs = {
            getCorrectAnswerStub: sinon.stub(),
            requestForQuizzesCorrectnessStub: sinon.stub()
        };


        this.presenter.configuration = {
            isActivity: true
        };

        this.presenter.answerObject = {
            getCorrectAnswer: this.stubs.getCorrectAnswerStub
        }

        this.presenter.requestForQuizzesCorrectness = this.stubs.requestForQuizzesCorrectnessStub;
    },

    'test when not activity should return false': function () {
        this.presenter.configuration.isActivity = false;

        var result = this.presenter.checkIfAnswerIsCorrect('ab');

        assertFalse(result);
    },

    'test should return true if correct answer is empty and current user text is empty mathml': function () {
        this.stubs.getCorrectAnswerStub.returns('');
        var userText = '<math xmlns="http://www.w3.org/1998/Math/MathML"/>';

        var result = this.presenter.checkIfAnswerIsCorrect(userText);

        assertTrue(result);
    },

    'test should call quizzes api for answer evaulation when correct answer isnt empty': function () {
        this.stubs.getCorrectAnswerStub.returns('not empty');
        var userText = '<math xmlns="http://www.w3.org/1998/Math/MathML"/>';

        this.presenter.checkIfAnswerIsCorrect(userText);

        assertTrue(this.stubs.requestForQuizzesCorrectnessStub.called);
    },

    'test should call quizzes api for answer evaulation when answer is empty and user text isnt empty': function () {
        this.stubs.getCorrectAnswerStub.returns('');
        var userText = '<math xmlns="http://www.w3.org/1998/Math/MathML"> not empty</math>';

        this.presenter.checkIfAnswerIsCorrect(userText);

        assertTrue(this.stubs.requestForQuizzesCorrectnessStub.called);
    }
});