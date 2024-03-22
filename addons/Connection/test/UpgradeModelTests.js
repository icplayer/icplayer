TestCase("[Connection] Upgrade model tests", {
    setUp: function () {
        this.presenter = AddonConnection_create();

        this.model = {
            "Left column": [{
                id: "",
                content: "",
                "connects to": "",
                "additional class": ""
            }],
            "Right column": [{
                id: "",
                content: "",
                "connects to": "",
                "additional class": ""
            }],
            "Default connection color": "",
            "Correct connection color": "",
            "Incorrect connection color": "",
            "Connection thickness, string": ""
        };

        this.currentModel = {
            "Left column": [{
                id: "",
                content: "",
                "connects to": "",
                "additional class": ""
            }],
            "Right column": [{
                id: "",
                content: "",
                "connects to": "",
                "additional class": ""
            }],
            "Columns width": [{
                left: "",
                middle: "",
                right: ""
            }],
            "Default connection color": "",
            "Correct connection color": "",
            "Incorrect connection color": "",
            "Connection thickness, string": "",
            "disabledConnectionColor": "",
            "initialConnections": [],
            "Orientations": [],
            "langAttribute": "",
            "speechTexts": {
                Connected: {Connected: ""},
                Disconnected: {Disconnected: ""},
                ConnectedTo: {"Connected to": ""},
                Selected: {Selected: ""},
                Deselected: {Deselected: ""},
                Correct: {Correct: ""},
                Wrong: {Wrong: ""},
            }
        };
    },

    'test given simple model when upgradeFromV_01 is called then will return upgraded model': function () {
        var expectedColumnsWidth = [{
            left: "",
            middle: "",
            right: ""
        }];

        var upgradedModel = this.presenter.upgradeFrom_01(this.model);

        assertEquals(expectedColumnsWidth, upgradedModel["Columns width"]);
        assertNotEquals(this.model, upgradedModel); // Ensure that changes were made on copy
    },

    'test given simple model when upgradeModel is called then will return newest version of model': function () {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals(this.currentModel, upgradedModel);
        assertNotEquals(this.model, upgradedModel);
    },

    'test given empty model when upgrade start values is called then returns upgraded model': function () {
        var emptyModel = {};
        var expectedModel = {
            "disabledConnectionColor": "",
            "initialConnections": []
        };
        var upgradedModel = this.presenter.upgradeStartValues(emptyModel);

        assertNotEquals(emptyModel, upgradedModel);
        assertEquals(expectedModel, upgradedModel);
    },

    'test given model with filled disabled fields when upgrade model is called then will return the same object': function () {
        var modelToUpgrade = {
            "disabledConnectionColor": "abc",
            "initialConnections": ["a", "b", "C"]
        };

        var upgradedModel = this.presenter.upgradeStartValues(modelToUpgrade);

        assertEquals(modelToUpgrade, upgradedModel);
    },

    'test given empty model when upgradeOrientations is called then returns upgraded model': function () {
        var emptyModel = {};
        var expectedModel = {
            "Orientations": []
        };
        var upgradedModel = this.presenter.upgradeOrientations(emptyModel);

        assertNotEquals(emptyModel, upgradedModel);
        assertEquals(expectedModel, upgradedModel);
    },

    'test given model with filled Orientations when upgrade model is called then will return the same object': function () {
        var modelToUpgrade = {
            "Orientations": [{
                "Layout": "MOBILE",
                "Orientation": "Horizontal",
            }]
        };

        var upgradedModel = this.presenter.upgradeOrientations(modelToUpgrade);

        assertEquals(modelToUpgrade, upgradedModel);
    },

    "test given model without set langAttribute when upgradeModel is called then langAttribute is added with default value": function () {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["langAttribute"]);
        assertEquals("", upgradedModel["langAttribute"]);
    },

    "test given model with set langAttribute when upgradeModel is called then langAttribute value remains unchanged": function () {
        this.model["langAttribute"] = "PL-pl";
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["langAttribute"]);
        assertEquals("PL-pl", upgradedModel["langAttribute"]);
    },

});

TestCase("[Connection] Upgrade model - speech texts", {
    setUp: function () {
        this.presenter = AddonConnection_create();
    },

    "test given empty model when upgrading model then set empty values to speech texts": function () {
        const inputModel = {};

        const upgradedModel = this.presenter.upgradeModel(inputModel);

        const expectedSpeechTexts = {
            Connected: {Connected: ""},
            Disconnected: {Disconnected: ""},
            ConnectedTo: {"Connected to": ""},
            Selected: {Selected: ""},
            Deselected: {Deselected: ""},
            Correct: {Correct: ""},
            Wrong: {Wrong: ""},
        };
        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, expectedSpeechTexts);
    },

    "test given model with defined all speach texts when upgrading model then speech texts have values form given model": function () {
        const inputModel = {
            speechTexts: {
                Connected: {Connected: "Połączony"},
                Disconnected: {Disconnected: "Rozłączony"},
                ConnectedTo: {"Connected to": "Połączony do"},
                Selected: {Selected: "Zaznaczony"},
                Deselected: {Deselected: "Odznaczony"},
                Correct: {Correct: "Poprawne"},
                Wrong: {Wrong: "Błędne"},
            }
        };

        const upgradedModel = this.presenter.upgradeModel(inputModel);

        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, inputModel.speechTexts);
    },

    "test given model with defined part of speach texts when upgrading model then speech texts have values form given model": function () {
        const inputModel = {
            speechTexts: {
                Connected: {Connected: "Połączony"},
                Disconnected: {Disconnected: "Rozłączony"},
                ConnectedTo: {"Connected to": "Połączony do"},
                Deselected: {Deselected: "Odznaczony"},
                Wrong: {Wrong: "Błędne"},
            }
        };

        const upgradedModel = this.presenter.upgradeModel(inputModel);

        const expectedSpeechTexts = {
            Connected: {Connected: "Połączony"},
            Disconnected: {Disconnected: "Rozłączony"},
            ConnectedTo: {"Connected to": "Połączony do"},
            Selected: {Selected: ""},
            Deselected: {Deselected: "Odznaczony"},
            Correct: {Correct: ""},
            Wrong: {Wrong: "Błędne"},
        };

        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, expectedSpeechTexts);
    }
});
