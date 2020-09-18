TestCase("[Adaptive_Next] Model validation utils", {
    setUp: function() {
        this.presenter = AddonAdaptive_Next_create();
    },

    'test given model with valid fields when validation model then will return valid model': function() {
        var model = {
            'Is Visible': 'False',
            'Direction': this.presenter.BUTTON_TYPE.NEXT,
            'Is disabled': 'True',
            'Width': '500',
            'Height': '500',
            'ID': 'Adaptive',
            'Image': ''
        };

        var expectedModel = {
            isVisible: false,
            Direction: this.presenter.BUTTON_TYPE.NEXT,
            isDisabled: true,
            Width: 500,
            Height: 500,
            ID: 'Adaptive',
            Image: null
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isValid);
        assertEquals(expectedModel, validatedModel.value);
    },

    'test given model with valid direction config when validation model then will return valid model': function() {
        var model = {
            'Is Visible': 'False',
            'Direction': this.presenter.BUTTON_TYPE.PREV,
            'Is disabled': 'True',
            'Width': '500',
            'Height': '500',
            'ID': 'Adaptive',
            'Image': ''
        };

        var expectedModel = {
            isVisible: false,
            Direction: this.presenter.BUTTON_TYPE.PREV,
            isDisabled: true,
            Width: 500,
            Height: 500,
            ID: 'Adaptive',
            Image: null
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isValid);
        assertEquals(expectedModel, validatedModel.value);
    },

    'test given valid image property when validating model then will return validated model': function () {
        var model = {
            'Is Visible': 'False',
            'Direction': this.presenter.BUTTON_TYPE.PREV,
            'Is disabled': 'True',
            'Width': '500',
            'Height': '500',
            'ID': 'Adaptive',
            'Image': '/file/abcdef'
        };

        var expectedModel = {
            isVisible: false,
            Direction: this.presenter.BUTTON_TYPE.PREV,
            isDisabled: true,
            Width: 500,
            Height: 500,
            ID: 'Adaptive',
            Image: '/file/abcdef'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isValid);
        assertEquals(expectedModel, validatedModel.value);
    },

    'test given not valid direction property when validating model then will return error code EV01': function () {
        var model = {
            'Is Visible': 'False',
            'Direction': 'NOT VALID VALUE',
            'Is disabled': 'True',
            'Width': '500',
            'Height': '500',
            'ID': 'Adaptive',
            'Image': ''
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals('EV01', validatedModel.errorCode);
    }


});
