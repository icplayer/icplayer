TestCase("Model validation", {
    setUp: function () {
        this.presenter = AddonTable_Of_Contents_create();
    },

    'test proper model': function() {
        var model = {
            "ID": "Table_Of_Contents1",
            "DontShowPages": "3;4;6"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isValid);
    },

    'test value - must be number' : function() {
        var model = {
            "ID": "Table_Of_Contents1",
            "DontShowPages": "1;E"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals("E01", validatedModel.errorCode);
    },

    'test value - less then 0' : function() {
        var model = {
            "ID": "Table_Of_Contents1",
            "DontShowPages": "4;-1"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals("E02", validatedModel.errorCode);
    },

    'test value - identical values' : function() {
        var model = {
            "ID": "Table_Of_Contents1",
            "DontShowPages": "2;3;3;4"
        };
        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
        assertEquals("E03", validatedModel.errorCode);
    }
});