TestCase("[Basic Math Gaps] Gaps definition validation", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
    },

    'test validateGapsDefinition with valid model': function () {
        this.model = {
            'gapsDefinition' : '[1] + [2] = 3'
        };

        var validated = this.presenter.validateGapsDefinition(this.model, true);

        assertEquals(false, validated.isError);
        assertEquals(["1", "2"], validated.gapsValues);
    },

    'test validateGapsDefinition with invalid model' : function() {
        this.model = {
            gapsDefinition: '[1] + 3 = 3'
        };

        var validated = this.presenter.validateGapsDefinition(this.model, true);

        assertEquals(true, validated.isError);
        assertEquals('E01', validated.errorCode);
    },

    'test validateGapsDefinition with valid model and which is not equation' : function() {
        this.model = {
            'gapsDefinition' : '1 [<] 2'
        };

        var validated = this.presenter.validateGapsDefinition(this.model, false);

        assertEquals(false, validated.isError);
        assertEquals(['<'], validated.gapsValues);
    },

    'test validateGapsDefinition with fractional' : function() {
        this.model = {
            'gapsDefinition' : '[1/2] + [1/2] = 1'
        };

        var validated = this.presenter.validateGapsDefinition(this.model, true);
        assertEquals(true, validated.allElements[0].isFraction);
    },

    'test validateGapsDefinition with fractional one and a half' : function() {
        this.model = {
            'gapsDefinition' : '1 [1/2] + [1/2] = 2'
        };

        var validated = this.presenter.validateGapsDefinition(this.model, true);
        assertEquals(true, validated.allElements[0].isHiddenAdditionAfter);
    },

    'test validateGapsDefinition with decimals' : function() {
        this.model = {
            'gapsDefinition' : '1.2 + [2.2] = 3.4'
        };

        var validated = this.presenter.validateGapsDefinition(this.model, true);

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

        assertEquals('', gapWidth.value);
    },

    'test validateGapsWidth with 0 width should be set to default' : function() {
        var gapWidth = this.presenter.validateGapWidth(0);

        assertEquals('', gapWidth.value);
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

TestCase("[Basic Math Gaps] Model validation", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();

        this.validateGapWidthStub = sinon.stub(this.presenter, 'validateGapWidth');
        this.validateGapsDefinitionStub = sinon.stub(this.presenter, 'validateGapsDefinition');
        this.validateDecimalSeparatorStub = sinon.stub(this.presenter, 'validateDecimalSeparator');
    },

    tearDown: function () {
        this.presenter.validateGapWidth.restore();
        this.presenter.validateGapsDefinition.restore();
        this.presenter.validateDecimalSeparator.restore();
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
        assertFalse(this.validateGapsDefinitionStub.called);
    },

    'test gaps definition validation failed': function () {
        this.validateDecimalSeparatorStub.returns({
            isError: false
        });

        this.validateGapWidthStub.returns({
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

        this.model = {
            'ID': 'Basic_Math_Gap_1',
            'Is Visible': 'True',
            'isEquation': 'True',
            'isNotActivity': 'True',
            'isDisabled': 'True'
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
    }
});