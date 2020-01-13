TestCase('[Commons - Model Validator] Hex color validator', {
    setUp: function () {
        this.exampleModel = {
            validLongColor1: '#FFFFFF',
            validLongColor2: '#afbfcf',
            validLongColor3: '#aFbF12',
            validShortColor1: '#FFF',
            validShortColor2: '#032',

            emptyColor: '',
            notValidColor1: 'afbf',
            notValidColor2: '#dadadad',
            notValidColor3: '#09--90',
            notValidColor4: '#aFbG12',
            notValidColor5: '#aFbF12#aFbF12#aFbF12#aFbF12#aFbF12',
            notValidColor6: '     ',
            notValidColor7: '#afcb',

        };

        this.modelValidator = new ModelValidator();
        this.validator = window.ModelValidators.HEXColor;
    },

    'test valid colors without any options': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator('validLongColor1', {}),
            this.validator('validLongColor2', {}),
            this.validator('validLongColor3', {})
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals(this.exampleModel.validLongColor1, validatedModel.value['validLongColor1']);
        assertEquals(this.exampleModel.validLongColor2, validatedModel.value['validLongColor2']);
        assertEquals(this.exampleModel.validLongColor3, validatedModel.value['validLongColor3']);
    },

    'test short color when no canBeShortSet': function() {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator('validShortColor1', {}),
            this.validator('validShortColor2', {})
        ]);

        assertFalse(validatedModel.isValid);
    },

    'test short valid color': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator('validShortColor1', {canBeShort: true}),
            this.validator('validShortColor2', {canBeShort: true})
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals(this.exampleModel.validShortColor1, validatedModel.value['validShortColor1']);
        assertEquals(this.exampleModel.validShortColor2, validatedModel.value['validShortColor2']);
    },

    'test short valid color with all options specified': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator('validShortColor1', {"default": "#000000", canBeShort: true})
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals(this.exampleModel.validShortColor1, validatedModel.value['validShortColor1']);
    },

    'test shortened color validation when shortened hex is not allowed': function () {
        var validatedModel1 = this.modelValidator.validate(this.exampleModel, [
            this.validator('validShortColor1', {canBeShort: false})
        ]);
        var validatedModel2 = this.modelValidator.validate(this.exampleModel, [
            this.validator('validShortColor2', {canBeShort: false})
        ]);
        var validatedModel3 = this.modelValidator.validate(this.exampleModel, [
            this.validator('validShortColor3', {canBeShort: false})
        ]);

        assertFalse(validatedModel1.isValid);
        assertFalse(validatedModel2.isValid);
        assertFalse(validatedModel3.isValid);
    },

    'test valid color when shortened hex color is not allowed': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator('validLongColor1', {canBeShort: false}),
            this.validator('validLongColor2', {canBeShort: false}),
            this.validator('validLongColor3', {canBeShort: false})
        ]);

        assertTrue(validatedModel.isValid);
    },

    'test default option config': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator('emptyColor', {default: '#000000'})
        ]);

        assertTrue(validatedModel.isValid);
        assertEquals('#000000', validatedModel.value['emptyColor']);
    },

    'test not valid color 1': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator('notValidColor1')
        ]);

        assertFalse(validatedModel.isValid);
    },

    'test not valid color 2': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator('notValidColor2')
        ]);

        assertFalse(validatedModel.isValid);
    },

    'test not valid color 3': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator('notValidColor3')
        ]);

        assertFalse(validatedModel.isValid);
    },


    'test not valid color 4': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator('notValidColor4')
        ]);

        assertFalse(validatedModel.isValid);
    },

    'test not valid color 5': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator('notValidColor5')
        ]);

        assertFalse(validatedModel.isValid);
    },

    'test not valid color 6': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator('notValidColor6')
        ]);

        assertFalse(validatedModel.isValid);
    },

    'test not valid color 7': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator('notValidColor7')
        ]);

        assertFalse(validatedModel.isValid);
    },
    'test empty color': function () {
        var validatedModel = this.modelValidator.validate(this.exampleModel, [
            this.validator('emptyColor')
        ]);

        assertFalse(validatedModel.isValid);
    },



});