TestCase("[Basic Math Gaps] Gaps definition validation", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
    },

    'test validateGapsDefinition with valid model': function () {
        this.model = {
            'gapsDefinition' : '[1] + [2] = 3'
        };

        var validated = this.presenter.validateGapsDefinition(this.model, true,'.',{Addition: "", Subtraction: "", Division: "", Multiplication: ""});

        assertEquals(false, validated.isError);
        assertEquals(["1", "2"], validated.gapsValues);
    },

    'test validateGapsDefinition with invalid model' : function() {
        this.model = {
            gapsDefinition: '[1] + 3 = 3'
        };

        var validated = this.presenter.validateGapsDefinition(this.model, true,'.',{Addition: "", Subtraction: "", Division: "", Multiplication: ""});

        assertEquals(true, validated.isError);
        assertEquals('E01', validated.errorCode);
    },

    'test validateGapsDefinition with valid model and which is not equation' : function() {
        this.model = {
            'gapsDefinition' : '1 [<] 2'
        };

        var validated = this.presenter.validateGapsDefinition(this.model, false,'.',{Addition: "", Subtraction: "", Division: "", Multiplication: ""});

        assertEquals(false, validated.isError);
        assertEquals(['<'], validated.gapsValues);
    },

    'test validateGapsDefinition with fractional' : function() {
        this.model = {
            'gapsDefinition' : '[1/2] + [1/2] = 1'
        };

        var validated = this.presenter.validateGapsDefinition(this.model, true,'.',{Addition: "", Subtraction: "", Division: "", Multiplication: ""});
        assertEquals(true, validated.allElements[0].isFraction);
    },

    'test validateGapsDefinition with fractional one and a half' : function() {
        this.model = {
            'gapsDefinition' : '1 [1/2] + [1/2] = 2'
        };

        var validated = this.presenter.validateGapsDefinition(this.model, true,'.',{Addition: "", Subtraction: "", Division: "", Multiplication: ""});
        assertEquals(true, validated.allElements[0].isHiddenAdditionAfter);
    },

    'test validateGapsDefinition with decimals' : function() {
        this.model = {
            'gapsDefinition' : '1.2 + [2.2] = 3.4'
        };

        var validated = this.presenter.validateGapsDefinition(this.model, true,'.',{Addition: "", Subtraction: "", Division: "", Multiplication: ""});

        assertEquals(false, validated.isError);
        assertEquals([2.2], validated.gapsValues);
    }
});

TestCase("[Basic Math Gaps] Gaps width validation", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
    },

    'test validateGapsWidth with NaN width' : function() {
        var validatedGapWidth = this.presenter.validateGapWidth('a');

        assertTrue(validatedGapWidth.isError);
        assertEquals('E04', validatedGapWidth.errorCode);
    },

    'test validateGapsWidth with minus width' : function() {
        var gapWidth = this.presenter.validateGapWidth(-60);

        assertEquals('E04', gapWidth.errorCode);
    },

    'test validateGaps width with empty field should be set to default' : function() {
        var gapWidth = this.presenter.validateGapWidth('');

        assertEquals('34', gapWidth.value);
    },

    'test validateGapsWidth with 0 width should be set to default' : function() {
        var gapWidth = this.presenter.validateGapWidth(0);

        assertEquals('34', gapWidth.value);
    },

    'test validateGapsWidth with correct value 60px' : function() {
        var gapWidth = this.presenter.validateGapWidth(60);

        assertEquals(60, gapWidth.value);
    }
});

TestCase("[Basic Math Gaps] Decimal separator validation", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
    },

    'test decimal separator is a space' : function() {
        var decimalSeparator = this.presenter.validateDecimalSeparator(' ');

        assertEquals(true, decimalSeparator.isError);
        assertEquals('E02', decimalSeparator.errorCode);
    },

    'test decimal separator when field is empty' : function() {
        var decimalSeparator = this.presenter.validateDecimalSeparator('');

        assertEquals(false, decimalSeparator.isError);
        assertEquals('.', decimalSeparator.value);
    },

    'test decimal separator with correct separator' : function() {
        var decimalSeparator = this.presenter.validateDecimalSeparator(',');

        assertEquals(false, decimalSeparator.isError);
        assertEquals(',', decimalSeparator.value);
    }
});

TestCase("[Basic Math Gaps] Signs validation", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
    },

    'test correct filled property sign' : function() {
        this.presenter.signs = [{
            Addition: "a",
            Subtraction: "s",
            Division: "d",
            Multiplication: "m"
        }];
        var signs = this.presenter.validateSigns(this.presenter.signs);

        assertEquals({Addition: "a", Subtraction: "s", Division: "d", Multiplication: "m"}, signs.value);
    },

    'test not filled property sign' : function() {
        this.presenter.signs = [{
            Addition: "",
            Subtraction: "",
            Division: "",
            Multiplication: ""
        }];
        var signs = this.presenter.validateSigns(this.presenter.signs);

        assertEquals({Addition: "", Subtraction: "", Division: "", Multiplication: ""}, signs.value);
    },

    'test invalid signs' : function() {
        this.presenter.signs = [{
            Addition: "]",
            Subtraction: "",
            Division: "",
            Multiplication: ""
        }];
        var signs = this.presenter.validateSigns(this.presenter.signs);

        assertTrue(signs.isError);
        assertEquals('E05', signs.errorCode);
    },

    'test multiple signs' : function() {
        this.presenter.signs = [
            {
                Addition: "a",
                Subtraction: "s",
                Division: "d",
                Multiplication: "m"
            },
            {
                Addition: "m",
                Subtraction: "d",
                Division: "s",
                Multiplication: "a"
            }
        ];
        var signs = this.presenter.validateSigns(this.presenter.signs);

        assertEquals({Addition: "a", Subtraction: "s", Division: "d", Multiplication: "m"}, signs.value);
    },

    'test multiple signs but not all configured in first one' : function() {
        this.presenter.signs = [
            {
                Addition: "",
                Subtraction: "s",
                Division: "",
                Multiplication: "m"
            },
            {
                Addition: "m",
                Subtraction: "d",
                Division: "s",
                Multiplication: "a"
            }
        ];
        var signs = this.presenter.validateSigns(this.presenter.signs);

        assertEquals({Addition: "", Subtraction: "s", Division: "", Multiplication: "m"}, signs.value);
    },

    'test when signs is undefined' : function() {

        var signs = this.presenter.validateSigns(undefined);

        assertEquals({Addition: "", Subtraction: "", Division: "", Multiplication: ""}, signs.value);
    },

    'test convert sign function' : function() {
        this.presenter.signs = {
                Addition: "a",
                Subtraction: "s",
                Division: "d",
                Multiplication: "m"
            }
        ;
        var convertedSigns = [];
        var signs = ['+', '-', '/', '*'];

        for (var i = 0; i < signs.length; i++) {
            convertedSigns.push(this.presenter.convertSign(this.presenter.signs, signs[i]))
        }

        assertEquals(['a','s','d','m'], convertedSigns);
    },

    'test convert sign function without arithmetic symbols' : function() {
        this.presenter.signs = {
                Addition: "a",
                Subtraction: "s",
                Division: "d",
                Multiplication: "m"
            }
        ;
        var convertedSigns = [];
        var signs = ['A', 'a', '5', '#',','];

        for (var i = 0; i < signs.length; i++) {
            convertedSigns.push(this.presenter.convertSign(this.presenter.signs, signs[i]))
        }

        assertEquals(['A', 'a', '5', '#',','], convertedSigns);
    },

    'test convert sign function when signs is undefined' : function() {

        var convertedSigns = [];
        var signs = ['A', 'a', '5', '#',','];

        for (var i = 0; i < signs.length; i++) {
            convertedSigns.push(this.presenter.convertSign(this.presenter.signs, signs[i]))
        }

        assertEquals(undefined, this.presenter.signs);
        assertEquals(['A', 'a', '5', '#',','], convertedSigns);
    },

    'test reconvert sign function' : function() {
        this.presenter.configuration = {
            Signs: {
                    Addition: "a",
                    Subtraction: "s",
                    Division: "d",
                    Multiplication: "m"
            }
        };
        var convertedSigns = [];
        var signs = ['+', '-', '/', '*'];

        for (var i = 0; i < signs.length; i++) {
            convertedSigns.push(this.presenter.reconvertSign(this.presenter.configuration.Signs, signs[i]))
        }

        assertEquals(["+","-","/","*"], convertedSigns);
    },

    'test reconvert sign function with arithmetic symbols' : function() {
        this.presenter.configuration = {
            Signs: {
                    Addition: "a",
                    Subtraction: "s",
                    Division: "d",
                    Multiplication: "m"
            }
        };
        var convertedSigns = [];
        var signs = ['a', 's', 'd', 'm'];

        for (var i = 0; i < signs.length; i++) {
            convertedSigns.push(this.presenter.reconvertSign(this.presenter.configuration.Signs, signs[i]))
        }

        assertEquals(['+', '-', '/','*'], convertedSigns);
    },

    'test reconvert sign function when signs is undefined' : function() {

        var convertedSigns = [];
        var signs = ['A', 'a', '5', '#',','];

        for (var i = 0; i < signs.length; i++) {
            convertedSigns.push(this.presenter.reconvertSign(this.presenter.signs, signs[i]))
        }

        assertEquals(undefined, this.presenter.signs);
        assertEquals(['A', 'a', '5', '#',','], convertedSigns);
    },

    'test reconvert expression' : function() {
        this.presenter.configuration = {
            Signs: {
                    Addition: "d",
                    Subtraction: "m",
                    Division: "p",
                    Multiplication: "r"
            }
        };
        var splittedUserExpression = ['3','d','3','m', '0', '=', '6', 'r', '2', 'p', '2'];

        var reconvertedExpression = this.presenter.reconvertExpression(splittedUserExpression);

        assertEquals("3 + 3 - 0 = 6 * 2 / 2", reconvertedExpression);
    }
});

TestCase("[Basic Math Gaps] Model validation", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();

        this.validateGapWidthStub = sinon.stub(this.presenter, 'validateGapWidth');
        this.validateGapsDefinitionStub = sinon.stub(this.presenter, 'validateGapsDefinition');
        this.validateDecimalSeparatorStub = sinon.stub(this.presenter, 'validateDecimalSeparator');
        this.validateSignsStub = sinon.stub(this.presenter, 'validateSigns');
        this.validateGapTypeStub = sinon.stub(this.presenter, 'validateGapType');
    },

    tearDown: function () {
        this.presenter.validateGapWidth.restore();
        this.presenter.validateGapsDefinition.restore();
        this.presenter.validateDecimalSeparator.restore();
        this.presenter.validateSigns.restore();
    },

    'test decimal separator validation failed': function () {
        this.validateDecimalSeparatorStub.returns({
            isError: true,
            errorCode: 'E03'
        });

        var validatedModel = this.presenter.validateModel({});

        assertTrue(validatedModel.isError);
        assertEquals('E03', validatedModel.errorCode);

        assertTrue(this.validateDecimalSeparatorStub.called);
        assertFalse(this.validateGapWidthStub.called);
        assertFalse(this.validateSignsStub.called);
        assertFalse(this.validateGapsDefinitionStub.called);
    },

    'test gap width validation failed': function () {
        this.validateDecimalSeparatorStub.returns({
            isError: false
        });

        this.validateGapWidthStub.returns({
            isError: true,
            errorCode: 'E01'
        });

        var validatedModel = this.presenter.validateModel({});

        assertTrue(validatedModel.isError);
        assertEquals('E01', validatedModel.errorCode);

        assertTrue(this.validateDecimalSeparatorStub.called);
        assertTrue(this.validateGapWidthStub.called);
        assertFalse(this.validateSignsStub.called);
        assertFalse(this.validateGapsDefinitionStub.called);
    },

    'test signs replacement validation failed': function () {
        this.validateDecimalSeparatorStub.returns({
            isError: false
        });

        this.validateGapWidthStub.returns({
            isError: false
        });

        this.validateSignsStub.returns({
            isError: true,
            errorCode: 'E05'
        });

        var validatedModel = this.presenter.validateModel({});

        assertTrue(validatedModel.isError);
        assertEquals('E05', validatedModel.errorCode);

        assertTrue(this.validateGapWidthStub.called);
        assertTrue(this.validateDecimalSeparatorStub.called);
        assertTrue(this.validateSignsStub.called);
        assertFalse(this.validateGapsDefinitionStub.called);

    },

    'test gaps definition validation failed': function () {
        this.validateDecimalSeparatorStub.returns({
            isError: false
        });

        this.validateGapWidthStub.returns({
            isError: false
        });

        this.validateSignsStub.returns({
            isError: false
        });

        this.validateGapsDefinitionStub.returns({
            isError: true,
            errorCode: 'E02'
        });

        var validatedModel = this.presenter.validateModel({});

        assertTrue(validatedModel.isError);
        assertEquals('E02', validatedModel.errorCode);

        assertTrue(this.validateGapWidthStub.called);
        assertTrue(this.validateSignsStub.called);
        assertTrue(this.validateGapsDefinitionStub.called);
        assertTrue(this.validateDecimalSeparatorStub.called);
    },

    'test proper model': function() {
        this.validateGapWidthStub.returns({
            isError: false,
            value: 40
        });

        this.validateGapsDefinitionStub.returns({
            isError: false,
            gapsValues: '["1", "2"]'
        });

        this.validateDecimalSeparatorStub.returns({
            isError: false,
            value: ','
        });

        this.validateSignsStub.returns({
            isError: false,
            value: {Addition: "a", Subtraction: "s", Division: "d", Multiplication: "m"}
        });

        this.validateGapTypeStub.returns({value: false});

        this.model = {
            'ID': 'Basic_Math_Gap_1',
            'Is Visible': 'True',
            'isEquation': 'True',
            'isNotActivity': 'True',
            'isDisabled': 'True',
            'gapType': "Editable"
        };

        var validatedModel = this.presenter.validateModel(this.model);

        assertEquals(false, validatedModel.isError);
        assertEquals('["1", "2"]', validatedModel.gapsValues);
        assertEquals(true, validatedModel.isEquation);
        assertEquals('Basic_Math_Gap_1', validatedModel.addonID);
        assertEquals(false, validatedModel.isActivity);
        assertEquals(true, validatedModel.isDisabled);
        assertEquals(true, validatedModel.isVisible);
        assertEquals(',', validatedModel.decimalSeparator);
        assertEquals(40, validatedModel.gapWidth);
        assertEquals({Addition: "a", Subtraction: "s", Division: "d", Multiplication: "m"}, validatedModel.Signs);
        assertFalse(validatedModel.isDraggable);
    }
});

TestCase("[Basic Math Gaps] Gap type validation", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
    },

    'test if gap type draggable it should return true': function () {
        var expectedResult = {
            value: true
        };

        var validatedGapType = this.presenter.validateGapType({gapType: "Draggable"});

        assertEquals(expectedResult, validatedGapType);
    },

    'test if gap type editable it should return false': function () {
        var expectedResult = {
            value: false
        };

        var validatedGapType = this.presenter.validateGapType({gapType: "Editable"});

        assertEquals(expectedResult, validatedGapType);
    }
});

TestCase("[Basic Math Gaps] [Gaps Definition] Gap type validation", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
    },

    'test gaps should have editable input gap type and non-gaps element gap': function () {
        this.model = {
            'gapsDefinition' : '[1] + [2] = 3'
        };

        var validated = this.presenter.validateGapsDefinition(this.model, true,'.',{Addition: "", Subtraction: "", Division: "", Multiplication: ""});

        assertEquals(this.presenter.ObjectFactory.PRODUCTION_TYPE.EDITABLE_INPUT_GAP, validated.allElements[0].gapType);
        assertEquals(this.presenter.ObjectFactory.PRODUCTION_TYPE.ELEMENT_GAP, validated.allElements[1].gapType);
    },

    'test fractions should have fraction gap type' : function() {
        this.model = {
            'gapsDefinition' : '[1/2] + [1/2] = 1'
        };

        var validated = this.presenter.validateGapsDefinition(this.model, true,'.',{Addition: "", Subtraction: "", Division: "", Multiplication: ""});
        assertEquals(this.presenter.ObjectFactory.PRODUCTION_TYPE.FRACTION_GAP, validated.allElements[0].gapType);
    }
});