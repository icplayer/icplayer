TestCase("[Math] Checking which variables are present in expression", {
    setUp: function () {
        this.presenter = AddonMath_create();
        this.variables = [
            { name: 'gap1', value: '1' },
            { name: 'gap2', value: '3' },
            { name: 'gap3', value: '21' }
        ];
    },

    'test single variable present in expression': function () {
        var expression = "gap1 + 2 == 1";

        var presentVariables = this.presenter.selectVariablesFromExpression(expression, this.variables);

        assertEquals(['gap1'], presentVariables);
    },

    'test multiple variables present in expression': function () {
        var expression = "gap1 + gap3 == 1";

        var presentVariables = this.presenter.selectVariablesFromExpression(expression, this.variables);

        assertEquals(['gap1', 'gap3'], presentVariables);
    },

    'test expression without variables': function () {
        var expression = "1 + 3 == 2";

        var presentVariables = this.presenter.selectVariablesFromExpression(expression, this.variables);

        assertEquals([], presentVariables);
    },

    'test similar variable names': function () {
        this.variables[3] = { name: 'gap35', value: '355' };
        var expression = "1 + gap35 == 2";

        var presentVariables = this.presenter.selectVariablesFromExpression(expression, this.variables);

        assertEquals(['gap35'], presentVariables);
    }
});

TestCase("[Math] Expressions evaluation", {
    setUp: function () {
        this.presenter = AddonMath_create();
        var text1 = {
            getGapValue: function (index) {
                switch (index) {
                    case '1':
                        return '1';
                    case '2':
                        return '3';
                    case '3':
                        return '21';
                    case '4':
                        return '355';
                }
            }
        };

        sinon.stub(this.presenter, 'getModule');
        this.presenter.getModule.withArgs('Text1').returns(text1);
        this.variables = [
            { name: 'gap1', value: 'Text1.1' },
            { name: 'gap2', value: 'Text1.2' },
            { name: 'gap3', value: 'Text1.3' }
        ];
        this.separators =  {
            decimalSeparator: undefined,
            isDecimalSeparatorSet: false,
            thousandSeparator: undefined,
            isThousandSeparatorSet: false
        };
    },

    tearDown: function () {
        this.presenter.getModule.restore();
    },

    'test single expression evaluates to false': function () {
        var expressions = [
            "1 + 1 == 2",
            "gap1 + 2 == 4",
            "gap3 > gap1 + gap2"
        ];

        var evaluationResult = this.presenter.evaluateAllExpressions(expressions, this.variables, this.separators);

        assertFalse(evaluationResult.overall);
    },

    'test multiple expressions evaluates to false': function () {
        this.variables[3] = { name: 'gap35', value: 'Text1.4' };
        var expressions = [
            "gap3 == 21",
            "gap1 + 2 == 4",
            "0 > gap1 + gap2",
            "gap35 + 10 == 1"

        ];

        var evaluationResult = this.presenter.evaluateAllExpressions(expressions, this.variables, this.separators);

        assertFalse(evaluationResult.overall);
    },

    'test not all variables are used in expressions': function () {
        this.variables[3] = { name: 'gap35', value: 'Text1.4' };
        var expressions = [
            "1 + 1 == 2",
            "gap1 + 2 == 4",
            "gap3 > gap1 + gap2"
        ];

        var evaluationResult = this.presenter.evaluateAllExpressions(expressions, this.variables, this.separators);

        assertFalse(evaluationResult.overall);
    }
});