TestCase("Model Validation Tests", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.model = {
            'gapsDefinition' : '[1] + [2] = 3'
        };

    },

    'test validateGapsDefinition with valid model': function () {
        var validated = this.presenter.validateGapsDefinition(this.model, true);
        assertEquals(false, validated.isError);
    },

    'test validateGapsDefinition with invalid model' : function() {
        this.model.gapsDefinition = '[1] + 3 = 3';

        var validated = this.presenter.validateGapsDefinition(this.model, true);
        assertEquals(true, validated.isError);
        assertEquals('E01', validated.errorCode);
    },

    'test validateGapsDefinition with valid model and which is not equation' : function() {
        this.model.gapsDefinition = '1 [<] 2';

        var validated = this.presenter.validateGapsDefinition(this.model, false);
        assertEquals(false, validated.isError);
    },

    'test validateGapsDefinition with fractional' : function() {
        this.model.gapsDefinition = '[1/2] + [1/2] = 1';

        var validated = this.presenter.validateGapsDefinition(this.model, true);
        assertEquals(true, validated.allElements[0].isFraction);
    },

    'test validateGapsDefinition with fractional one and a half' : function() {
        this.model.gapsDefinition = '1 [1/2] + [1/2] = 2';

        var validated = this.presenter.validateGapsDefinition(this.model, true);
        assertEquals(true, validated.allElements[0].isHiddenAdditionAfter);
    },

    'test validateGapsDefinition with decimals' : function() {
        this.model.gapsDefinition = '1.2 + [2.2] = 3.4';

        var validated = this.presenter.validateGapsDefinition(this.model, true);
        assertEquals(false, validated.isError);
    }
});