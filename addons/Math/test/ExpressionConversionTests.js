TestCase("[Math] Finding text occurrences", {
    setUp: function () {
        this.presenter = AddonMath_create();
    },

    'test no occurrences': function () {
        assertEquals([], this.presenter.findTextOccurrences('1 + 2 = 3', 'gap1'));
    },

    'test single occurrence': function () {
        assertEquals([0], this.presenter.findTextOccurrences('gap1 == 10', 'gap1'));
        assertEquals([14], this.presenter.findTextOccurrences('1 + 2 == 3 && gap1 == 10', 'gap1'));
        assertEquals([6], this.presenter.findTextOccurrences('10 == gap1', 'gap1'));
    },

    'test multiple occurrences': function () {
        assertEquals([0, 14], this.presenter.findTextOccurrences('gap1 == 10 && gap1 !== gap2', 'gap1'));
        assertEquals([6, 23], this.presenter.findTextOccurrences('10 == gap1 && gap2 !== gap1', 'gap1'));
        assertEquals([6, 23, 31], this.presenter.findTextOccurrences('10 == gap1 && gap2 !== gap1 || gap1 == gap3', 'gap1'));
    }
});

TestCase("[Math] Adding prefix to variable in expression", {
    setUp: function () {
        this.presenter = AddonMath_create();
    },

    'test variable single occurrence in expression': function () {
        var replacedExpression = this.presenter.replaceVariableNameWithReference('gap1 == 10', 'gap1');

        assertEquals('variables["\gap1\"] == 10', replacedExpression);
    },

    'test variable two occurrences in expression': function () {
        var replacedExpression = this.presenter.replaceVariableNameWithReference('gap1 == 10 && gap1 !== gap2', 'gap1');

        assertEquals('variables["\gap1\"] == 10 && variables["\gap1\"] !== gap2', replacedExpression);
    },

    'test variable multiple occurrences in expression': function () {
        var replacedExpression = this.presenter.replaceVariableNameWithReference('gap1 == gap1 + 10 && gap1 !== gap2', 'gap1');

        assertEquals('variables["\gap1\"] == variables["\gap1\"] + 10 && variables["\gap1\"] !== gap2', replacedExpression);
    }
});

TestCase("[Math] Expression conversion", {
    setUp: function () {
        this.presenter = AddonMath_create();
        this.variables = [
            { name: 'gap1', value: '1' },
            { name: 'gap2', value: '12' },
            { name: 'gap3', value: '1a' }
        ];
    },

    'test expression without variables': function () {
        var convertedExpression = this.presenter.convertExpression('1 + 2 > 4', this.variables);

        assertEquals('result = 1 + 2 > 4', convertedExpression);
    },

    'test expression with single variable occurrence': function () {
        var convertedExpression = this.presenter.convertExpression('1 + 2 > 4 && gap1 + 2 == 3', this.variables);

        assertEquals('result = 1 + 2 > 4 && variables[\"gap1\"] + 2 == 3', convertedExpression);
    },

    'test expression with single variable multiple occurrences': function () {
        var convertedExpression = this.presenter.convertExpression('1 + 2 > 4 && gap1 + 2 < gap1 + 3', this.variables);

        assertEquals('result = 1 + 2 > 4 && variables[\"gap1\"] + 2 < variables[\"gap1\"] + 3', convertedExpression);
    },

    'test expression with multiple variables occurrences': function () {
        var convertedExpression = this.presenter.convertExpression('1 + 2 > 4 && gap2 + 2 < gap1 + 3 || gap3 > gap1 + gap2', this.variables);

        assertEquals('result = 1 + 2 > 4 && variables["gap2"] + 2 < variables["gap1"] + 3 || variables["gap3"] > variables["gap1"] + variables["gap2"]', convertedExpression);
    }
});