TestCase("[MathText] Model validation", {
    setUp: function () {
        this.presenter = AddonMathText_create();
        this.model = {
            'ID': 'ID',
            'type': 'activity',
            'isDisabled': 'True',
            'initialText': 'initial',
            'correctAnswer': 'correct',
            'Is Visible': 'True',
            'Width': '500',
            'Height': '200',
            'language': 'English',
            'formulaColor': '#000000',
            'backgroundColor': '#000000',
            'mathEditorInPopup': 'False'
        };
    },

    'test correct model validation': function () {
        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertTrue(validatedModel.value.isDisabled);
        assertTrue(validatedModel.value.isVisible);
        assertEquals(this.presenter.TYPES_DEFINITIONS.ACTIVITY, validatedModel.value.type);
        assertEquals("initial", validatedModel.value.initialText);
        assertEquals("correct", validatedModel.value.correctAnswer);
        assertEquals(500, validatedModel.value.width);
        assertEquals(200, validatedModel.value.height);
        assertEquals('en', validatedModel.value.language);
        assertEquals('#000000', validatedModel.value.formulaColor);
        assertEquals('#000000', validatedModel.value.backgroundColor);
    },

    'test width too small when isActivity is true': function () {
        this.model.Width = '499';
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals('width', validatedModel.fieldName);
    },

    'test height too small when isActivity is true': function () {
        this.model.Height = '111';
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals('height', validatedModel.fieldName);
    },

    'test default background color should be #FFFFFF': function () {
        this.model.backgroundColor = '';
        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertEquals('#FFFFFF', validatedModel.value.backgroundColor);
    },

    'test default formula color should be #000000': function () {
        this.model.formulaColor = '';
        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertEquals('#000000', validatedModel.value.formulaColor);
    },

    'test background color cant be short hex color': function () {
        this.model.backgroundColor = '#EEE';
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals('backgroundColor', validatedModel.fieldName);
    },

    'test formula color can be short hex color': function () {
        this.model.formulaColor = '#AAA';
        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertEquals('#AAA', validatedModel.value.formulaColor);
    },

    'test language should be changed to pl when Polish was selected': function () {
        this.model.language = 'Polish';
        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertEquals('pl', validatedModel.value.language);
    },

    'test language should be changed to en when English was selected': function () {
        this.model.language = 'English';
        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertEquals('en', validatedModel.value.language);
    },

    'test language should be changed to es when Spanish was selected': function () {
        this.model.language = 'Spanish';
        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertEquals('es', validatedModel.value.language);
    },

    'test language should be changed to fr when French was selected': function () {
        this.model.language = 'French';
        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertEquals('fr', validatedModel.value.language);
    },

    'test given model with mathEditorInPopup set to true when validating model, its value is set correctly': function () {
        this.model.mathEditorInPopup = 'True';
        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertTrue(validatedModel.value.mathEditorInPopup);
    },

    'test given too small width and mathEditorInPopup set to true when validating model then model will be valid': function () {
        this.model.Width = '499';
        this.model.mathEditorInPopup = 'True';
        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
    },

    'test given too small height and mathEditorInPopup set to true when validating model then model will be valid': function () {
        this.model.Height = '111';
        this.model.mathEditorInPopup = 'True';
        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
    },
});