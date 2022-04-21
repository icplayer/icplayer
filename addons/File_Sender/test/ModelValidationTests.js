TestCase("Model validation", {
    setUp: function () {
        this.presenter = AddonFile_Sender_create();
    },

    'test given valid model when validateModel is called then return correct model': function () {
        var model = {
            ID: "File_Sender1",
            ButtonText: "Wyślij",
            DialogTitle: "Wybierz nauczyciela",
            SourceId: "Paragraph1",
            SourceType: "Paragraph",
            disableSendButton: "false"

        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isValid);
        assertEquals(model.ID, validatedModel.ID);
        assertEquals(model.ButtonText, validatedModel.buttonText);
        assertEquals(model.DialogTitle, validatedModel.dialogTitle);
        assertEquals(model.SourceType, validatedModel.sourceType);
        assertEquals(model.SourceID, validatedModel.sourceID);
        assertFalse(validatedModel.disableSendButton);
    },

    'test given model without sourceID and non-file source type when validateModel is called then return invalid model': function () {
        var model = {
            ID: "File_Sender1",
            ButtonText: "Wyślij",
            DialogTitle: "Wybierz nauczyciela",
            SourceId: "",
            SourceType: "Paragraph",
            disableSendButton: "false"

        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals("V01", validatedModel.errorCode);
    },

    'test given model without sourceID and file source type when validateModel is called then return valid model': function () {
        var model = {
            ID: "File_Sender1",
            ButtonText: "Wyślij",
            DialogTitle: "Wybierz nauczyciela",
            SourceId: "",
            SourceType: "File",
            disableSendButton: "false"

        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isValid);
        assertEquals(model.ID, validatedModel.ID);
        assertEquals(model.ButtonText, validatedModel.buttonText);
        assertEquals(model.DialogTitle, validatedModel.dialogTitle);
        assertEquals(model.SourceType, validatedModel.sourceType);
        assertEquals(model.SourceID, validatedModel.sourceID);
        assertFalse(validatedModel.disableSendButton);
    }
});