TestCase("[Magic Boxes] Model upgrade tests", {

    setUp: function () {
        this.presenter = AddonMagic_Boxes_create();
    },

    "test given model without set langAttribute when upgradeModel is called then langAttribute is added with default value": function () {
        var upgradedModel = this.presenter.upgradeModel({});

        assertNotUndefined(upgradedModel["langAttribute"]);
        assertEquals('', upgradedModel["langAttribute"]);
    },

    "test given model with set langAttribute when upgradeModel is called then langAttribute value remains unchanged": function () {
        let model = {
            "langAttribute": "pl-PL",
        };

        var upgradedModel = this.presenter.upgradeModel(model);

        assertNotUndefined(upgradedModel["langAttribute"]);
        assertEquals("pl-PL", upgradedModel["langAttribute"]);
    },

    "test given model without set speech texts when upgrading model using empty object then set empty values to speech texts": function () {
        var upgradedModel = this.presenter.upgradeModel({});

        const expectedSpeechTexts = {
            Cell: {Cell: ""},
            Selected: {Selected: ""},
            Deselected: {Deselected: ""},
            Correct: {Correct: ""},
            Wrong: {Wrong: ""},
        };
        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, expectedSpeechTexts);
    },

    "test given model without set speech texts when upgrading model using object with defined speech texts then speech texts have values form given model": function () {
        var inputModel = {
            speechTexts: {
                Cell: {Cell: "Komórka"},
                Deselected: {Deselected: "Odznaczony"},
                Correct: {Correct: "Poprawne"},
            }
        };

        var upgradedModel = this.presenter.upgradeModel(inputModel);

        const expectedSpeechTexts = {
            Cell: {Cell: "Komórka"},
            Selected: {Selected: ""},
            Deselected: {Deselected: "Odznaczony"},
            Correct: {Correct: "Poprawne"},
            Wrong: {Wrong: ""},
        };
        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, expectedSpeechTexts);
    },

    "test given model without set speech texts when upgrading model with full defined speech texts then all speech texts have values from given model": function () {
        var inputModel = {
            speechTexts: {
                Cell: {Cell: "Komórka"},
                Selected: {Selected: "Zaznaczony"},
                Deselected: {Deselected: "Odznaczony"},
                Correct: {Correct: "Poprawne"},
                Wrong: {Wrong: "Niepoprawnie"},
            }
        };

        var upgradedModel = this.presenter.upgradeModel(inputModel);

        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, inputModel.speechTexts);
    },
});
