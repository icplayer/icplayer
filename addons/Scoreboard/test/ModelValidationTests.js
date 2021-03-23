TestCase("[Scoreboard] Model validation", {
    setUp: function () {
        this.presenter = AddonScoreboard_create();

        this.model = {
            "ID": "Scoreboard1",
            "Broadcast": "Variable_Storage1",
            "isDraggable": "True",
            "VariableStorageLocation": "header",
            "VariableStorageLocationName": "header"
        }
    },

    'test proper model': function () {
        let validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertEquals("Scoreboard1", validatedModel.ID);
        assertEquals("Variable_Storage1", validatedModel.broadcast);
        assertTrue(validatedModel.isDraggable);
        assertEquals("header", validatedModel.variableStorageLocation);
        assertEquals("header", validatedModel.variableStorageLocationName);
        assertFalse(validatedModel.isOnePageScoreboard);
    },

    'test empty configuration' : function () {
        this.model = {
            "ID": "Scoreboard1",
            "Broadcast": "Variable_Storage1",
            "isDraggable": "True",
        }
        let validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("C01", validatedModel.errorCode);
    },

    'test one page mode' : function () {
        this.model = {
            "ID": "Scoreboard1",
            "Broadcast": "",
            "isDraggable": "True",
            "VariableStorageLocation": "header",
            "VariableStorageLocationName": "header"
        }

        let validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertEquals("Scoreboard1", validatedModel.ID);
        assertEquals("", validatedModel.broadcast);
        assertTrue(validatedModel.isDraggable);
        assertEquals("header", validatedModel.variableStorageLocation);
        assertEquals("header", validatedModel.variableStorageLocationName);
        assertTrue(validatedModel.isOnePageScoreboard);
    }
});
