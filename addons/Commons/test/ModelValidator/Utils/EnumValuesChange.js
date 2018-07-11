TestCase("[Commons - EnumChangeValues util] Changing names tests", {
    setUp: function () {
        this.model = {
            'enumProperty': 'value'
        };

       this.propertyName= 'enumProperty';
       this.config = {
            'value': 'vl',
            'test': 'test'
       };

       this.values = {
           'default': 'value',
           'values': ['value', 'value1']
       };
    },

    'test should change value of property': function () {
        var modelValidator = new ModelValidator();

        var validatedModel = modelValidator.validate(this.model, [
            window.ModelValidators.utils.EnumChangeValues(this.propertyName, this.config, window.ModelValidators.Enum(this.propertyName, this.values))
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals('vl', validatedModel.value[this.propertyName]);
    },

    'test should not change value of property': function () {
        this.config = {
            'not_in_values': 'test'
        };
        var modelValidator = new ModelValidator();

        var validatedModel = modelValidator.validate(this.model, [
            window.ModelValidators.utils.EnumChangeValues(this.propertyName, this.config, window.ModelValidators.Enum(this.propertyName, this.values))
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals('value', validatedModel.value[this.propertyName]);
    },

    'test should not change value of property when config is empty': function () {
        this.config = { };
        var modelValidator = new ModelValidator();

        var validatedModel = modelValidator.validate(this.model, [
            window.ModelValidators.utils.EnumChangeValues(this.propertyName, this.config, window.ModelValidators.Enum(this.propertyName, this.values))
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals('value', validatedModel.value[this.propertyName]);
    }
});