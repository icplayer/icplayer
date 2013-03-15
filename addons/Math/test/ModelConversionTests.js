TestCase("Model conversion", {
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