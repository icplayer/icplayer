TestCase("[Crossword] Model upgrade", {
    setUp: function () {
        this.presenter = Addoncrossword_create();

        this.model = {
          "ID": "crossword1",
          "Layout": "LTWH",
          "Left": "50",
          "Top": "25",
          "Width": "378",
          "Height": "351",
          "Right": "",
          "Bottom": "",
          "Is Visible": "True",
          "Is Tabindex Enabled": "False",
          "Crossword": " !G O S    \nWIELOKĄT  \n L Y W    \n MO!M!B!ASA  \n !ODPÓR    \n !UKULELE  \nBRUSE!KE O \nY P   K   \nK         ",
          "Columns": "10",
          "Rows": "9",
          "Cell width": "41",
          "Cell height": "42",
          "Blank cells border color": "#B0BEC5",
          "Blank cells border style": "solid",
          "Blank cells border width": "1",
          "Letter cells border color": "#bbb",
          "Letter cells border style": "",
          "Letter cells border width": "1",
          "Word numbers": "",
          "Marked column index": "",
          "Marked row index": "",
          "blockWrongAnswers": "",
        }
    },

    "test given model without set showAllAnswersInGradualShowAnswersMode when upgradeModel is called then showAllAnswersInGradualShowAnswersMode is added with default value": function () {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["showAllAnswersInGradualShowAnswersMode"]);
        assertEquals(false, upgradedModel["showAllAnswersInGradualShowAnswersMode"]);
    },

    "test given model with set showAllAnswersInGradualShowAnswersMode when upgradeModel is called then showAllAnswersInGradualShowAnswersMode value remains unchanged": function () {
        this.model["showAllAnswersInGradualShowAnswersMode"] = true;

        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["showAllAnswersInGradualShowAnswersMode"]);
        assertEquals(true, upgradedModel["showAllAnswersInGradualShowAnswersMode"]);
    },

    "test given model without set autoNavigation when upgradeModel is called then autoNavigation is added with default value": function () {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["autoNavigation"]);
        assertEquals("Extended", upgradedModel["autoNavigation"]);
    },

    "test given model with set autoNavigation when upgradeModel is called then autoNavigation value remains unchanged": function () {
        this.model["autoNavigation"] = "Simple";

        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["autoNavigation"]);
        assertEquals("Simple", upgradedModel["autoNavigation"]);
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

TestCase("[Crossword] Upgrade model - speech texts", {
    setUp: function () {
        this.presenter = Addoncrossword_create();
    },

    "test given model without set speech texts when upgrading model using empty object then set empty values to speech texts": function () {
        var upgradedModel = this.presenter.upgradeModel({});

        const expectedSpeechTexts = {
            Cell: {Cell: ""},
            Across: {Across: ""},
            Down: {Down: ""},
            Correct: {Correct: ""},
            Wrong: {Wrong: ""},
            Empty: {Empty: ""},
            Disabled: {Disabled: ""},
            OutOf: {OutOf: ""},
        };
        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, expectedSpeechTexts);
    },

    "test given model without set speech texts when upgrading model using object with defined speech texts then speech texts have values form given model": function () {
        var inputModel = {
            speechTexts: {
                Cell: {Cell: "komórka"},
                Across: {Across: "wzdłuż"},
                Down: {Down: "w dół"},
                Empty: {Empty: "pusty"},
                Disabled: {Disabled: "zablokowany"},
            }
        };

        var upgradedModel = this.presenter.upgradeModel(inputModel);

        const expectedSpeechTexts = {
            Cell: {Cell: "komórka"},
            Across: {Across: "wzdłuż"},
            Down: {Down: "w dół"},
            Correct: {Correct: ""},
            Wrong: {Wrong: ""},
            Empty: {Empty: "pusty"},
            Disabled: {Disabled: "zablokowany"},
            OutOf: {OutOf: ""},
        };
        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, expectedSpeechTexts);
    },

    "test given model without set speech texts when upgrading model with full defined speech texts then all speech texts have values from given model": function () {
        var inputModel = {
            speechTexts: {
                Cell: {Cell: "komórka"},
                Across: {Across: "wzdłuż"},
                Down: {Down: "w dół"},
                Correct: {Correct: "dobrze"},
                Wrong: {Wrong: "źle"},
                Empty: {Empty: "pusty"},
                Disabled: {Disabled: "zablokowany"},
                OutOf: {OutOf: "z"},
            }
        };

        var upgradedModel = this.presenter.upgradeModel(inputModel);

        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, inputModel.speechTexts);
    },
});
