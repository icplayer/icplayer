TestCase("[Commons - StringPrefix util] String prefix tests", {
    setUp: function () {
        this.model = {
            'property': '#value'
        };

       this.propertyName= 'property';
       this.modelValidator = new ModelValidator();

       var validatorDecorator = window.ModelValidator.prototype.__validatorDecorator__;

       this.validatorsStubs = {
            errorCode: validatorDecorator(function () {
                return this.generateErrorCode("ERROR_CODE")
            })
        };
    },

    'test should return good value': function () {
        var validatedModel = this.modelValidator.validate(this.model, [
            window.ModelValidators.utils.StringPrefix(this.propertyName, '#', window.ModelValidators.String(this.propertyName))
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals('#value', validatedModel.value[this.propertyName]);
    },

    'test should return error code PRE01 when string doesnt start with prefix': function () {
        this.model[this.propertyName] = 'value';
        var validatedModel = this.modelValidator.validate(this.model, [
            window.ModelValidators.utils.StringPrefix(this.propertyName, '#', window.ModelValidators.String(this.propertyName))
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals('PRE01', validatedModel.errorCode);
    },

    'test should return error code from string validator if it occured': function () {
        var validatedModel = this.modelValidator.validate(this.model, [
            window.ModelValidators.utils.StringPrefix(this.propertyName, '#', this.validatorsStubs.errorCode())
        ]);

        assertFalse(validatedModel.isValid);
        assertEquals('ERROR_CODE', validatedModel.errorCode);
    }
});