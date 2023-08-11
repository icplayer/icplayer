TestCase("[PointsLines] Upgrade model - showAllAnswersInGradualShowAnswersMode", {
    setUp: function () {
        this.presenter = AddonPointsLines_create();

        this.model = {
          "ID": "PointsLines1",
          "Layout": "LTWH",
          "Left": "50",
          "Top": "25",
          "Width": "378",
          "Height": "351",
          "Right": "",
          "Bottom": "",
          "Is Visible": "True",
          "Is Tabindex Enabled": "False",
        }
    },

    "test given model without set showAllAnswersInGradualShowAnswersMode when upgradeModel is called then showAllAnswersInGradualShowAnswersMode is added with default value": function () {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["showAllAnswersInGradualShowAnswersMode"]);
        assertEquals("", upgradedModel["showAllAnswersInGradualShowAnswersMode"]);
    },

    "test given model with set showAllAnswersInGradualShowAnswersMode when upgradeModel is called then showAllAnswersInGradualShowAnswersMode value remains unchanged": function () {
        this.model["showAllAnswersInGradualShowAnswersMode"] = true;
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["showAllAnswersInGradualShowAnswersMode"]);
        assertEquals(true, upgradedModel["showAllAnswersInGradualShowAnswersMode"]);
    },
});

TestCase("[PointsLines] Upgrade model - alternativeTexts", {
    setUp: function () {
        this.presenter = AddonPointsLines_create();

        this.model = {
          "ID": "PointsLines1",
          "Layout": "LTWH",
          "Left": "50",
          "Top": "25",
          "Width": "378",
          "Height": "351",
          "Right": "",
          "Bottom": "",
          "Is Visible": "True",
          "Is Tabindex Enabled": "False",
        }
    },

    "test given model without set alternativeTexts when upgradeModel is called then alternativeTexts is added with default value": function () {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["alternativeTexts"]);
        assertEquals("", upgradedModel["alternativeTexts"]);
    },

    "test given model with set alternativeTexts when upgradeModel is called then alternativeTexts value remains unchanged": function () {
        this.model["alternativeTexts"] = "Some text";
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["alternativeTexts"]);
        assertEquals("Some text", upgradedModel["alternativeTexts"]);
    },
});

TestCase("[PointsLines] Upgrade model - langAttribute", {
    setUp: function () {
        this.presenter = AddonPointsLines_create();

        this.model = {
          "ID": "PointsLines1",
          "Layout": "LTWH",
          "Left": "50",
          "Top": "25",
          "Width": "378",
          "Height": "351",
          "Right": "",
          "Bottom": "",
          "Is Visible": "True",
          "Is Tabindex Enabled": "False",
        }
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

TestCase("[PointsLines] Upgrade model - speech texts", {
    setUp: function () {
        this.presenter = AddonPointsLines_create();
    },

    "test given model without set speech texts when upgrading model using empty object then set empty values to presenter.speechTexts": function () {
        const upgradedModel = this.presenter.upgradeModel({});

        const expectedSpeechTexts = {
            Point: {Point: ""},
            Connected: {Connected: ""},
            Disconnected: {Disconnected: ""},
            ConnectedTo: {ConnectedTo: ""},
            Selected: {Selected: ""},
            Deselected: {Deselected: ""},
            Correct: {Correct: ""},
            Wrong: {Wrong: ""},
        };
        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, expectedSpeechTexts);
    },

    "test given model without set speech texts when upgrading model using object with defined speech texts then presenter.speechTexts have values form given model": function () {
        const inputModel = {
            speechTexts: {
                Point: {Point: "punkt"},
                Disconnected: {Disconnected: "Rozłączony"},
                Correct: {Correct: "poprawnie"},
            }
        };

        const upgradedModel = this.presenter.upgradeModel(inputModel);

        const expectedSpeechTexts = {
            Point: {Point: "punkt"},
            Connected: {Connected: ""},
            Disconnected: {Disconnected: "Rozłączony"},
            ConnectedTo: {ConnectedTo: ""},
            Selected: {Selected: ""},
            Deselected: {Deselected: ""},
            Correct: {Correct: "poprawnie"},
            Wrong: {Wrong: ""},
        };
        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, expectedSpeechTexts);
    },

    "test given model without set speech texts when upgrading model with full defined speech texts then presenter.speechTexts have values from given model": function () {
        const inputModel = {
            speechTexts: {
                Point: {Point: "Punkt"},
                Connected: {Connected: "Połączony"},
                Disconnected: {Disconnected: "Rozłączony"},
                ConnectedTo: {ConnectedTo: "Połączony do"},
                Selected: {Selected: "Zaznaczony"},
                Deselected: {Deselected: "Odznaczony"},
                Correct: {Correct: "Poprawnie"},
                Wrong: {Wrong: "Źle"},
            }
        };

        const upgradedModel = this.presenter.upgradeModel(inputModel);

        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, inputModel.speechTexts);
    },
});
