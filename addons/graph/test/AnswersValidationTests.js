TestCase("[Graph] Answers validation", {
    setUp: function () {
        this.presenter = Addongraph_create();
        this.presenter.configuration = {
            isDecimalSeparatorSet: false
        };
    },

    'test proper answers': function () {
        var answers = [
                { Answer: "0" }, { Answer: "1.1" }, { Answer: "2.2" },
                { Answer: "3.3" }, { Answer: "4.4" }, { Answer: "5.5" }
            ],
            expectedAnswers = [0, 1.1, 2.2, 3.3, 4.4, 5.5];

        var validatedAnswers = this.presenter.validateAnswers(answers, 6);

        assertTrue(validatedAnswers.isValid);
        assertEquals(expectedAnswers, validatedAnswers.answers);
        assertUndefined(validatedAnswers.errorCode);
    },

    'test proper answers with decimal separator': function () {
        var answers = [
                { Answer: "0" }, { Answer: "1,1" }, { Answer: "2,2" },
                { Answer: "3,3" }, { Answer: "4,4" }, { Answer: "5,5" }
            ],
            expectedAnswers = [0, 1.1, 2.2, 3.3, 4.4, 5.5];

        this.presenter.configuration.isDecimalSeparatorSet = true;
        this.presenter.configuration.decimalSeparator = ',';

        var validatedAnswers = this.presenter.validateAnswers(answers, 6);

        assertTrue(validatedAnswers.isValid);
        assertEquals(expectedAnswers, validatedAnswers.answers);
        assertUndefined(validatedAnswers.errorCode);
    },

    'test invalid one of the answers': function () {
        var answers = [
                { Answer: "0" }, { Answer: "1.1" }, { Answer: "2.2" },
                { Answer: "nan" }, { Answer: "4.4" }, { Answer: "5.5" }
            ];

        var validatedAnswers = this.presenter.validateAnswers(answers, 6);

        assertFalse(validatedAnswers.isValid);
        assertEquals('ANSWER_NOT_NUMERIC', validatedAnswers.errorCode);
        assertEquals({ answer: 4 }, validatedAnswers.errorMessageSubstitutions);
    },

    'test number of answers is not equal bars count': function () {
        var answers = [
            { Answer: "0" }, { Answer: "1.1" }, { Answer: "2.2" },
            { Answer: "3.3" }, { Answer: "4.4" }, { Answer: "5.5" }
        ];

        var validatedAnswers = this.presenter.validateAnswers(answers, 7);

        assertFalse(validatedAnswers.isValid);
        assertEquals('ANSWERS_AMOUNT_INVALID', validatedAnswers.errorCode);
        assertEquals( { answers: 6, bars: 7 }, validatedAnswers.errorMessageSubstitutions);
    }
});