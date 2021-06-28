TestCase("[MathText] Model upgrade", {
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
        };
    },

    'test given model without mathEditorInPopup when upgrading model, mathEditorInPopup will be added with default value': function () {
        var validatedModel = this.presenter.upgradeModel(this.model);
        
        assertEquals('False', validatedModel['mathEditorInPopup']);
    },

    'test given model with mathEditorInPopup when upgrading model, mathEditorInPopup will be not be changed': function () {
        this.model['mathEditorInPopup'] = 'True';

        var validatedModel = this.presenter.upgradeModel(this.model);

        assertEquals('True', validatedModel['mathEditorInPopup']);
    },

    'test given model without popupTexts when upgrading model, popupTexts will be added with default values': function () {
        var validatedModel = this.presenter.upgradeModel(this.model);

        assertTrue(validatedModel['popupTexts'] !== undefined)
        assertTrue(validatedModel['popupTexts']['cancel'] !== undefined)
        assertEquals('', validatedModel['popupTexts']['cancel']['cancel']);
        assertTrue(validatedModel['popupTexts']['save'] !== undefined)
        assertEquals('', validatedModel['popupTexts']['save']['save']);
    },

    'test given model with popupTexts when upgrading model, popupTexts will be not be changed': function () {
        this.model['popupTexts'] = {
            cancel: {cancel: 'anuluj'},
            save: {save: 'zapisz'}
        };

        var validatedModel = this.presenter.upgradeModel(this.model);

        assertTrue(validatedModel['popupTexts'] !== undefined)
        assertTrue(validatedModel['popupTexts']['cancel'] !== undefined)
        assertEquals('anuluj', validatedModel['popupTexts']['cancel']['cancel']);
        assertTrue(validatedModel['popupTexts']['save'] !== undefined)
        assertEquals('zapisz', validatedModel['popupTexts']['save']['save']);
    },
});