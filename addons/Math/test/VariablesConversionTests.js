TestCase("[Math] Variables conversion", {
    setUp: function () {
        this.presenter = AddonMath_create();
    },

    'test empty variables': function () {
        var convertedVariables = this.presenter.convertVariables("", ["1 + 2 == 3"]);

        assertFalse(convertedVariables.isError);
        assertEquals([], convertedVariables.variables);
    },

    'test single variable': function () {
        var expectedVariables = [{ name: 'gap1', value: 'Text1.Gap1' }];

        var convertedVariables = this.presenter.convertVariables("gap1=Text1.Gap1", ["gap1 + 1 = 3"]);

        assertFalse(convertedVariables.isError);
        assertEquals(expectedVariables, convertedVariables.variables);
    },

    'test multiple variables': function () {
        var variables = "gap1 = Text1.Gap1\n" + "gap2 = Text1.Gap2\n" + "gap3 = Text2.Gap1";
        var expectedVariables = [
            { name: 'gap1', value: 'Text1.Gap1' },
            { name: 'gap2', value: 'Text1.Gap2' },
            { name: 'gap3', value: 'Text2.Gap1' }
        ];

        var convertedVariables = this.presenter.convertVariables(variables, ["gap1 + gap2 + gap3 > 0"]);

        assertFalse(convertedVariables.isError);
        assertEquals(expectedVariables, convertedVariables.variables);
    },

    'test missing assignment operator': function () {
        var convertedVariables = this.presenter.convertVariables("gap1Text1.Gap1", undefined);

        assertTrue(convertedVariables.isError);
        assertEquals('CV_01', convertedVariables.errorCode);
    },

    'test missing gap ID': function () {
        var convertedVariables = this.presenter.convertVariables("gap1=", undefined);

        assertTrue(convertedVariables.isError);
        assertEquals('CV_02', convertedVariables.errorCode);
    },

    'test unused variable': function () {
        var variables = "gap1 = Text1.Gap1\n" + "gap2 = Text1.Gap2\n" + "gap3 = Text2.Gap1";

        var convertedVariables = this.presenter.convertVariables(variables, ["gap1 + gap2 > 0"]);

        assertTrue(convertedVariables.isError);
        assertEquals('CV_03', convertedVariables.errorCode);
    }
});