TestCase("[Scoreboard] Model validation", {
    setUp: function () {
        this.presenter = AddonScoreboard_create();

        this.model = {
            ID: "Scoreboard1",
            Broadcast: "Variable_Storage1"
        }
    },

    'test proper model': function () {
        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertEquals("Scoreboard1", validatedModel.ID);
        assertEquals("Variable_Storage1", validatedModel.Broadcast);
    },

    'test empty configuration' : function () {
        this.model["configuration"] = "";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("C01", validatedModel.errorCode);
    },

    'test empty variable storage id' : function () {
        this.model.Broadcast = "";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("B01", validatedModel.errorCode);
    }
});
