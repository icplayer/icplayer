TestCase("[Text Identification] Model validation", {
    setUp: function () {
        this.presenter = Addontext_identification_create();
    },

    'test proper model': function () {
        var model = {
            'ID': 'Text_Identification1',
            onSelected: "Text1.setText('Module selected!');",
            onDeselected: "Text1.setText('Module deselected!');"
        };

        var validationResult = this.presenter.validateModel(model);

        assertEquals('Text_Identification1', validationResult.addonID);
        assertEquals("Text1.setText('Module selected!');", validationResult.onSelected);
        assertEquals("Text1.setText('Module deselected!');", validationResult.onDeselected);

        assertFalse(validationResult.shouldBeSelected);
        assertFalse(validationResult.isSelected);
        assertFalse(validationResult.isErrorCheckMode);
    }
});