TestCase("[Math] Expression evaluation", {
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
                        return '1a';
                }
            }
        }, text2 = {
            getGapValue: function (index) {
                switch (index) {
                    case '1':
                        return '1';
                    case '2':
                        return '2';
                    case '3':
                        return '3';
                    case '4':
                        return '1';
                    case '5':
                        return '2';
                    case '6':
                        return '5';
                }
            }
        }, text3 = {
            getGapValue: function () {
                return '0';
            }
        }, text4 = {
            getGapValue: function (index) {
                switch (index) {
                    case '1':
                        return '2';
                    case '2':
                        return 'x';
                    case '3':
                        return '50';
                }
            }
        }, text5 = {
            getGapValue: function (index) {
                switch (index) {
                    case '1':
                        return '10.2';
                    case '2':
                        return '73500';
                    case '3':
                        return '18375';
                }
            }
        };

        sinon.stub(this.presenter, 'getModule');
        this.presenter.getModule.withArgs('Text1').returns(text1);
        this.presenter.getModule.withArgs('Text2').returns(text2);
        this.presenter.getModule.withArgs('Text3').returns(text3);
        this.presenter.getModule.withArgs('Text4').returns(text4);
        this.presenter.getModule.withArgs('Text5').returns(text5);
        this.variables = [
            { name: 'gap1', value: 'Text1.1' },
            { name: 'gap2', value: 'Text1.2' },
            { name: 'gap3', value: 'Text1.3' },
            { name: 'gap4', value: 'Text2.1' },
            { name: 'gap5', value: 'Text2.2' },
            { name: 'gap6', value: 'Text2.3' },
            { name: 'gap7', value: 'Text2.4' },
            { name: 'gap8', value: 'Text2.5' },
            { name: 'gap9', value: 'Text2.6' }
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

    'test simple mathematical equality expression without variables': function () {
        var expression = "1 + 2 == 3";

        var evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.isValid);
    },

    'test simple mathematical expression without variables': function () {
        var expression = "1 + 2 > 9";

        var evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.isValid);
    },

    'test simple mathematical expression with one variable': function () {
        var expression = "gap1 + 2 == 3";

        var evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.isValid);
    },

    'test simple mathematical expression with multiple variables': function () {
        var expression = "gap1 + gap2 > gap3 - 18";

        var evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.isValid);
    },

    'test more complex mathematical expression with multiple variables': function () {
        var expression = "gap1 + gap2 > gap3 - 18";

        var evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.isValid);
    },

    'test complex mathematical expression with logical operators': function () {
        var expression = "gap1 == 1 && gap2 == 3 && gap3 < 12";

        var evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.isValid);
    },

    'test complex mathematical expression with logical operators and parenthesis': function () {
        var expression = "gap1 == 1 && ((gap2 = 3 || gap3 < 12) && 12 / 4 == 3)";

        var evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.isValid);
    },

    'test missing parenthesis error': function () {
        var expression = "gap1 == 1 && ((gap2 == 3 || gap3 < 12) && 12 / 4 == 3";

        var evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.isValid);
    },

    'test unknown variable error': function () {
        var expression = "gap1 == 1 && ((gap2 == 3 || gap3 < 12) && 12 / 4 == 3) && gap4 == 0.3";

        var evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.isValid);
    },

    'test simple expression with string comparison': function () {
        this.variables[0].value = 'Text1.4';
        var expression = "gap1 == '1a'";

        var evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.isValid);
    },

    'test more complex expression with string comparison': function () {
        this.variables[0].value = 'Text1.4';
        var expression = "gap1 == '1a' && gap2 + 17 == gap3 - 1";

        var evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.isValid);
    },

    'test fractions comparison': function () {
        var expression = "1 / 6 + 3 / 10 == gap4 / (gap5 * gap6) + (3 * gap7) / (gap8 * gap9)";

        var evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.isValid);
    },

    'test one of the gaps holds 0 value': function () {
        this.variables.push({ name: 'gap10', value: 'Text3.1' });
        var expression = "gap10 == 0";

        var evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.isValid);
    },

    'test if in expression is number and string returned value should work': function () {
        this.variables = [
            { name: 'gap1', value: 'Text4.1' },
            { name: 'gap2', value: 'Text4.2' },
            { name: 'gap3', value: 'Text4.3' }
        ];
        var expression = "gap1 == 'x' || gap1 == '2'";

        var evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.result);

        expression = "gap2 == 'x' || gap2 == '2'";

        evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.result);

        expression = "gap1 != gap2";

        evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.result);

        expression = "gap3 == '50'";

        evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.result);
    },

    'test expressions with variables without spaces works correctly': function () {
        var expression = "(gap1!='' && gap3!=''&& gap1!=gap2 && gap3!=gap4)";

        var evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.result);
    },

    'test expressions with decimals': function () {
        this.variables = [
            { name: 'gap1', value: 'Text5.1' }
        ];

        var expression = "gap1>9.2 && gap1<10.8";

        var evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.result);
    },

    'test expressions with variables being compared to numbers and strings': function () {
        this.variables = [
            { name: 'gap1', value: 'Text5.2' },
            { name: 'gap2', value: 'Text5.3'}
        ];

        var expression = "((gap1 == 73500 || gap1 == '73,500') && (gap2 == 18375 || gap2 == '18,375')) " +
            "|| ((gap2 == 73500 || gap2 == '73,500') && (gap1 == 18375 || gap1 == '18,375'))";

        var evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);

        assertTrue(evaluationResult.result);
    },

        'test expressions with variables being compared to numbers (including decimals) and strings': function () {
        this.variables = [
            { name: 'gap1', value: 'Text5.1' },
            { name: 'gap3', value: 'Text5.2' },
            { name: 'gap2', value: 'Text5.3'}
        ];

        var expression = "(((gap3 == 73500 || gap3 == '73,500') && (gap2 == 18375 || gap2 == '18,375')) " +
            "|| ((gap2 == 73500 || gap2 == '73,500') && (gap3 == 18375 || gap3 == '18,375')))" +
            " && (gap1>9.2 && gap1<10.8)";
        var evaluationResult = this.presenter.evaluateExpression(expression, this.variables, this.separators);
        assertTrue(evaluationResult.result);
    }
});