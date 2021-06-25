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
});