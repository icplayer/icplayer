TestCase("[Math] Model conversion", {
    setUp: function () {
        this.presenter = AddonMath_create();
    },

    'test valid model': function () {
        var model = {
            Variables: "" +
                "gap1 = Text1.Gap1\n" +
                "gap2 = Text1.Gap2\n" +
                "gap3 = Text2.Gap1",
            Expressions: "gap1 > gap2 & gap3 = '2a'",
            onCorrect: 'feedback1.change("GOOD");',
            onIncorrect: 'feedback1.change("BAD");',
            onPartiallyCompleted: 'feedback1.change("PARTIAL");'
        };
        var expectedVariables = [
            { name: 'gap1', value: 'Text1.Gap1' },
            { name: 'gap2', value: 'Text1.Gap2' },
            { name: 'gap3', value: 'Text2.Gap1' }
        ];

        var convertedModel = this.presenter.convertModel(model);

        assertFalse(convertedModel.isError);
        assertEquals(expectedVariables, convertedModel.variables);
        assertEquals(["gap1 > gap2 & gap3 = '2a'"], convertedModel.expressions);
        assertEquals('feedback1.change("GOOD");', convertedModel.onCorrectEvent);
        assertEquals('feedback1.change("BAD");', convertedModel.onIncorrectEvent);
        assertEquals('feedback1.change("PARTIAL");', convertedModel.onPartialEvent);
        assertFalse(convertedModel.separators.isDecimalSeparatorSet);
        assertUndefined(convertedModel.separators.decimalSeparator);
        assertFalse(convertedModel.separators.isThousandSeparatorSet);
        assertUndefined(convertedModel.separators.thousandSeparator);
        assertEquals(convertedModel.answers, '');
    },

    'test decimal separator conversion': function () {
        var model = {
            Variables: "" +
                "gap1 = Text1.Gap1\n" +
                "gap2 = Text1.Gap2\n" +
                "gap3 = Text2.Gap1",
            Expressions: "gap1 > gap2 & gap3 = '2a'",
            onCorrect: 'feedback1.change("GOOD");',
            onIncorrect: 'feedback1.change("BAD");',
            onPartiallyCompleted: 'feedback1.change("PARTIAL");',
            "Decimal separator": ","
        };
        var expectedVariables = [
            { name: 'gap1', value: 'Text1.Gap1' },
            { name: 'gap2', value: 'Text1.Gap2' },
            { name: 'gap3', value: 'Text2.Gap1' }
        ];

        var convertedModel = this.presenter.convertModel(model);

        assertFalse(convertedModel.isError);
        assertEquals(expectedVariables, convertedModel.variables);
        assertEquals(["gap1 > gap2 & gap3 = '2a'"], convertedModel.expressions);
        assertEquals('feedback1.change("GOOD");', convertedModel.onCorrectEvent);
        assertEquals('feedback1.change("BAD");', convertedModel.onIncorrectEvent);
        assertEquals('feedback1.change("PARTIAL");', convertedModel.onPartialEvent);
        assertTrue(convertedModel.separators.isDecimalSeparatorSet);
        assertEquals(",", convertedModel.separators.decimalSeparator);
        assertEquals(convertedModel.answers, '');
    },

    'test thousand separator conversion': function () {
        var model = {
            Variables: "" +
                "gap1 = Text1.Gap1\n" +
                "gap2 = Text1.Gap2\n" +
                "gap3 = Text2.Gap1",
            Expressions: "gap1 > gap2 & gap3 = '2a'",
            onCorrect: 'feedback1.change("GOOD");',
            onIncorrect: 'feedback1.change("BAD");',
            onPartiallyCompleted: 'feedback1.change("PARTIAL");',
            "Thousand separator": "."
        };
        var expectedVariables = [
            { name: 'gap1', value: 'Text1.Gap1' },
            { name: 'gap2', value: 'Text1.Gap2' },
            { name: 'gap3', value: 'Text2.Gap1' }
        ];

        var convertedModel = this.presenter.convertModel(model);

        assertFalse(convertedModel.isError);
        assertEquals(expectedVariables, convertedModel.variables);
        assertEquals(["gap1 > gap2 & gap3 = '2a'"], convertedModel.expressions);
        assertEquals('feedback1.change("GOOD");', convertedModel.onCorrectEvent);
        assertEquals('feedback1.change("BAD");', convertedModel.onIncorrectEvent);
        assertEquals('feedback1.change("PARTIAL");', convertedModel.onPartialEvent);
        assertTrue(convertedModel.separators.isThousandSeparatorSet);
        assertEquals(".", convertedModel.separators.thousandSeparator);
        assertEquals(convertedModel.answers, '');
    },

    'test both separators conversion': function () {
        var model = {
            Variables: "" +
                "gap1 = Text1.Gap1\n" +
                "gap2 = Text1.Gap2\n" +
                "gap3 = Text2.Gap1",
            Expressions: "gap1 > gap2 & gap3 = '2a'",
            onCorrect: 'feedback1.change("GOOD");',
            onIncorrect: 'feedback1.change("BAD");',
            onPartiallyCompleted: 'feedback1.change("PARTIAL");',
            "Thousand separator": ".",
            "Decimal separator": ","
        };
        var expectedVariables = [
            { name: 'gap1', value: 'Text1.Gap1' },
            { name: 'gap2', value: 'Text1.Gap2' },
            { name: 'gap3', value: 'Text2.Gap1' }
        ];

        var convertedModel = this.presenter.convertModel(model);

        assertFalse(convertedModel.isError);
        assertEquals(expectedVariables, convertedModel.variables);
        assertEquals(["gap1 > gap2 & gap3 = '2a'"], convertedModel.expressions);
        assertEquals('feedback1.change("GOOD");', convertedModel.onCorrectEvent);
        assertEquals('feedback1.change("BAD");', convertedModel.onIncorrectEvent);
        assertEquals('feedback1.change("PARTIAL");', convertedModel.onPartialEvent);
        assertTrue(convertedModel.separators.isThousandSeparatorSet);
        assertEquals(".", convertedModel.separators.thousandSeparator);
        assertTrue(convertedModel.separators.isDecimalSeparatorSet);
        assertEquals(",", convertedModel.separators.decimalSeparator);
        assertEquals(convertedModel.answers, '');
    },

    'test same separators error': function () {
        var model = {
            Variables: "" +
                "gap1 = Text1.Gap1\n" +
                "gap2 = Text1.Gap2\n" +
                "gap3 = Text2.Gap1",
            Expressions: "gap1 > gap2 & gap3 = '2a'",
            onCorrect: 'feedback1.change("GOOD");',
            onIncorrect: 'feedback1.change("BAD");',
            onPartiallyCompleted: 'feedback1.change("PARTIAL");',
            "Thousand separator": ".",
            "Decimal separator": "."
        };

        var convertedModel = this.presenter.convertModel(model);

        assertTrue(convertedModel.isError);
        assertEquals('CV_04', convertedModel.errorCode);
    },

    'test variables assignment error': function () {
        var model = {
            Variables: "" +
                "gap1 = Text1.Gap1\n" +
                "gap2Text1.Gap2\n" +
                "gap3 = Text2.Gap1",
            Expressions: "gap1 > gap2 & gap3 = '2a'",
            onCorrect: 'feedback1.change("GOOD");',
            onIncorrect: 'feedback1.change("BAD");'
        };

        var convertedModel = this.presenter.convertModel(model);

        assertTrue(convertedModel.isError);
        assertEquals('CV_01', convertedModel.errorCode);
    }
});

TestCase("[Math] Show Answers option parsing", {
    setUp: function () {
        this.presenter = AddonMath_create();
    },

    'test valid Show Answers': function () {
        var showAnswers = "" +
                "gap1 = 1\n" +
                "gap2 = 2\n" +
                "gap3 = 3",
            variables = [
                {name:"gap1", value:"Text1.Gap1"},
                {name:"gap2", value:"Text1.Gap2"},
                {name:"gap3", value:"Text2.Gap1"}
            ],
            convertedModel = this.presenter.parseShowAnswers(showAnswers, variables);

        assertFalse(convertedModel.isError);
        assertEquals(convertedModel.value, [
            {"name":"gap1", "value":"1", "users":""},
            {"name":"gap2", "value":"2", "users":""},
            {"name":"gap3", "value":"3", "users":""}
        ]);
    },

    'test Show Answers with more gaps than in Variables': function () {
        var ShowAnswers = "" +
                "gap1 = 1\n" +
                "gap2 = 2\n" +
                "gap3 = 3\n" +
                "gap4 = 4",
            variables = [
                {name:"gap1", value:"Text1.Gap1"},
                {name:"gap2", value:"Text1.Gap2"},
                {name:"gap3", value:"Text2.Gap1"}
            ],
        convertedModel = this.presenter.parseShowAnswers(ShowAnswers, variables);

        assertTrue(convertedModel.isError);
        assertEquals('CV_05', convertedModel.errorCode);
    },

    'test Show Answers with less gaps than in Variables': function () {
        var ShowAnswers = "" +
                "gap1 = 1",
            variables = [
                {name:"gap1", value:"Text1.Gap1"},
                {name:"gap2", value:"Text1.Gap2"},
                {name:"gap3", value:"Text2.Gap1"}
            ],
            convertedModel = this.presenter.parseShowAnswers(ShowAnswers, variables);

        assertTrue(convertedModel.isError);
        assertEquals('CV_05', convertedModel.errorCode);
    },

    'test Show Answers with incorrect gap name': function () {
        var ShowAnswers = "" +
                "gap1 = 1\n" +
                "gap2 = 2\n" +
                "gap4 = 3",
            variables = [
                {name:"gap1", value:"Text1.Gap1"},
                {name:"gap2", value:"Text1.Gap2"},
                {name:"gap3", value:"Text2.Gap1"}
            ],
        convertedModel = this.presenter.parseShowAnswers(ShowAnswers, variables);

        assertTrue(convertedModel.isError);
        assertEquals('CV_06', convertedModel.errorCode);
    },

    'test Show Answers with undefined gap name': function () {
        var ShowAnswers = "" +
                "gap1 = 1\n" +
                "= 2\n" +
                "gap4 = 3",
            variables = [
                {name:"gap1", value:"Text1.Gap1"},
                {name:"gap2", value:"Text1.Gap2"},
                {name:"gap3", value:"Text2.Gap1"}
            ],
            convertedModel = this.presenter.parseShowAnswers(ShowAnswers, variables);

        assertTrue(convertedModel.isError);
        assertEquals('SA02', convertedModel.errorCode);
    },

    'test Show Answers with undefined gap value': function () {
        var ShowAnswers = "" +
                "gap1 = 1\n" +
                "gap2 = \n" +
                "gap4 = 3",
            variables = [
                {name:"gap1", value:"Text1.Gap1"},
                {name:"gap2", value:"Text1.Gap2"},
                {name:"gap3", value:"Text2.Gap1"}
            ],
            convertedModel = this.presenter.parseShowAnswers(ShowAnswers, variables);

        assertTrue(convertedModel.isError);
        assertEquals('SA03', convertedModel.errorCode);
    },

    'test Show Answers with empty line': function () {
        var ShowAnswers = "" +
                "gap1 = 1\n" +
                "gap2 = 2\n" +
                "\n" +
                "gap3 = 3",
            variables = [
                {name:"gap1", value:"Text1.Gap1"},
                {name:"gap2", value:"Text1.Gap2"},
                {name:"gap3", value:"Text2.Gap1"}
            ],
            convertedModel = this.presenter.parseShowAnswers(ShowAnswers, variables);

        assertTrue(convertedModel.isError);
        assertEquals('SA04', convertedModel.errorCode);
    },

    'test Show Answers with white spaces': function () {
        var ShowAnswers = "" +
                "gap1     = 1    \n" +
                "gap2 =    2     \n" +
                "gap3 = 3",

            variables = [
                {name:"gap1", value:"Text1.Gap1"},
                {name:"gap2", value:"Text1.Gap2"},
                {name:"gap3", value:"Text2.Gap1"}
            ],
            convertedModel = this.presenter.parseShowAnswers(ShowAnswers, variables);

        assertFalse(convertedModel.isError);
        assertEquals(convertedModel.value, [
            {"name":"gap1", "value":"1", "users":""},
            {"name":"gap2", "value":"2", "users":""},
            {"name":"gap3", "value":"3", "users":""}
        ]);
    },

    'test Show Answers with no separator': function () {
        var ShowAnswers = "" +
                "gap1 = 1\n" +
                "gap2  2\n" +
                "gap3 = 3",
            variables = [
                {name:"gap1", value:"Text1.Gap1"},
                {name:"gap2", value:"Text1.Gap2"},
                {name:"gap3", value:"Text2.Gap1"}
            ],
            convertedModel = this.presenter.parseShowAnswers(ShowAnswers, variables);

        assertTrue(convertedModel.isError);
        assertEquals('SA02', convertedModel.errorCode);
    }
});