TestCase("[Scoreboard] Model validation", {
    setUp: function () {
        this.presenter = AddonScoreboard_create();

        this.model = {
            "ID": "Scoreboard1",
            "Broadcast": "Variable_Storage1",
            "isDraggable": "True",
            "VariableStorageLocation": "header",
            "VariableStorageLocationName": "header",
            "initialTeamsCount": "1",
            "maximumTeamsCount": "10",
            "defaultTeamsList": [
                {
                    "teamName": "X",
                    "teamColor": "#000"
                }
            ]
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
            "VariableStorageLocationName": "header",
            "initialTeamsCount": "1",
            "maximumTeamsCount": "10",
            "defaultTeamsList": [
                {
                    "teamName": "X",
                    "teamColor": "#000"
                }
            ]
        }

        let validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertEquals("Scoreboard1", validatedModel.ID);
        assertEquals("", validatedModel.broadcast);
        assertTrue(validatedModel.isDraggable);
        assertEquals("header", validatedModel.variableStorageLocation);
        assertEquals("header", validatedModel.variableStorageLocationName);
        assertTrue(validatedModel.isOnePageScoreboard);
    },

    'test color must be RGB' : function () {
        this.model.defaultTeamsList[0].teamColor = "#00"

        let validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("I04", validatedModel.errorCode);
    },

    'test empty team name' : function () {
        this.model.defaultTeamsList[0].teamColor = "#000"
        this.model.defaultTeamsList[0].teamName = ""

        let validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("I03", validatedModel.errorCode);
    },

    'test number of initial teams not positive integer' : function () {
        this.model.defaultTeamsList[0].teamName = "X"
        this.model.initialTeamsCount = "-1"

        let validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("I02", validatedModel.errorCode);
    },

    'test initial teams count more than maximum teamsCount' : function () {
        this.model = {
            "ID": "Scoreboard1",
            "Broadcast": "",
            "isDraggable": "True",
            "VariableStorageLocation": "header",
            "VariableStorageLocationName": "header",
            "initialTeamsCount": "11",
            "maximumTeamsCount": "10"
        }

        let validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("I01", validatedModel.errorCode);
    },

    'test initial teams data more than maximum teamsCount' : function () {
        this.model = {
            "ID": "Scoreboard1",
            "Broadcast": "",
            "isDraggable": "True",
            "VariableStorageLocation": "header",
            "VariableStorageLocationName": "header",
            "initialTeamsCount": "1",
            "maximumTeamsCount": "2",
            "defaultTeamsList": [
                {
                    "teamName": "X",
                    "teamColor": "#000"
                },
                {
                    "teamName": "X",
                    "teamColor": "#000"
                },
                {
                    "teamName": "X",
                    "teamColor": "#000"
                },
            ]
        }

        let validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("I01", validatedModel.errorCode);
    },

});
