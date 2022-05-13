TestCase("[Text Selection] Model upgrade", {
    setUp: function () {
        this.presenter = AddonText_Selection_create();

        this.model = {
          "ID": "Text_Selection1",
          "Layout": "LTWH",
          "Left": "50",
          "Top": "25",
          "Width": "425",
          "Height": "50",
          "Right": "",
          "Bottom": "",
          "Is Visible": "True",
          "Is Tabindex Enabled": "False",
          "Mode": "",
          "Selection type": "Multiselect",
          "Text": "The Text Selection addon allows marking / selecting parts of text as&nbsp;\\correct{correct} and&nbsp;\\wrong{wrong} phrases.",
          "Enable letters selections": "",
          "isNotActivity": "",
          "printable": "",
          "isSplitInPrintBlocked": ""
        };
    },

    "test given model without enableScroll when upgradeModel is called then enableScroll is added with default value": function () {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["enableScroll"]);
        assertEquals(false, upgradedModel["enableScroll"]);
    },

    "test given model with enableScroll when upgradeModel is called then enableScroll value remains unchanged": function () {
        this.model["enableScroll"] = true;
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["enableScroll"]);
        assertEquals(true, upgradedModel["enableScroll"]);
    },

    "test given model without langAttribute when upgradeModel is called then langAttribute is added with default value": function () {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["langAttribute"]);
        assertEquals("", upgradedModel["langAttribute"]);
    },

    "test given model with langAttribute when upgradeModel is called then langAttribute value remains unchanged": function () {
        this.model["langAttribute"] = "PL-pl";
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["langAttribute"]);
        assertEquals("PL-pl", upgradedModel["langAttribute"]);
    },
});

TestCase("[Text Selection] Upgrade model - speech texts", {
    setUp: function () {
        this.presenter = AddonText_Selection_create();
    },

    "test given empty model when upgrading model then sets empty object to speech texts": function () {
        var upgradedModel = this.presenter.upgradeModel({});

        var expectedEmptySpeechTexts = {
            selectedSectionStart: {selectedSectionStart: ""},
            selectedSectionEnd: {selectedSectionEnd: ""},
            selected: {selected: ""},
            deselected: {deselected: ""},
            wrong: {wrong: ""},
            correct: {correct: ""},
            phrase: {phrase: ""},
            phraseEnd: {phraseEnd: ""},
        };
        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, expectedEmptySpeechTexts);
    },

    "test given valid input model with speech texts when upgrading model then speech texts remains unchanged": function () {
        var inputModel = {
            speechTexts: {
                selectedSectionStart: {selectedSectionStart: "start of selected section"},
                selectedSectionEnd: {selectedSectionEnd: "end of selected section"},
                selected: {selected: "selected"},
                deselected: {deselected: "deselected"},
                wrong: {wrong: "wrong"},
                correct: {correct: "correct"},
                phrase: {phrase: "phrase"},
                phraseEnd: {phraseEnd: "end of phrase"},
            }
        };

        var upgradedModel = this.presenter.upgradeModel(inputModel);

        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, inputModel.speechTexts);
    },

    "test given not fully completed speech texts in model when upgrading model then sets correct object to speech texts": function () {
        var inputModel = {
            speechTexts: {
                selectedSectionStart: {selectedSectionStart: "start of selected section"},
                selectedSectionEnd: {selectedSectionEnd: "end of selected section"},
                deselected: {deselected: "deselected"},
                wrong: {wrong: "wrong"},
                phraseEnd: {phraseEnd: "end of phrase"},
            }
        };

        var upgradedModel = this.presenter.upgradeModel(inputModel);

        var expectedSpeechTexts = {
            selectedSectionStart: {selectedSectionStart: "start of selected section"},
            selectedSectionEnd: {selectedSectionEnd: "end of selected section"},
            selected: {selected: ""},
            deselected: {deselected: "deselected"},
            wrong: {wrong: "wrong"},
            correct: {correct: ""},
            phrase: {phrase: ""},
            phraseEnd: {phraseEnd: "end of phrase"},
        }
        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, expectedSpeechTexts);
    },
});
