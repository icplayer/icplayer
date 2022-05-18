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

    "test given model without showAllAnswersInGradualShowAnswersMode when upgradeModel is called then showAllAnswersInGradualShowAnswersMode is added with default value": function () {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["showAllAnswersInGradualShowAnswersMode"]);
        assertEquals(false, upgradedModel["showAllAnswersInGradualShowAnswersMode"]);
    },

    "test given model with showAllAnswersInGradualShowAnswersMode when upgradeModel is called then showAllAnswersInGradualShowAnswersMode value remains unchanged": function () {
        this.model["showAllAnswersInGradualShowAnswersMode"] = true;

        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["showAllAnswersInGradualShowAnswersMode"]);
        assertEquals(true, upgradedModel["showAllAnswersInGradualShowAnswersMode"]);
    },

    "test given model without autoNavigation when upgradeModel is called then autoNavigation is added with default value": function () {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["autoNavigation"]);
        assertEquals("Extended", upgradedModel["autoNavigation"]);
    },

    "test given model with autoNavigation when upgradeModel is called then autoNavigation value remains unchanged": function () {
        this.model["autoNavigation"] = "Simple";

        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["autoNavigation"]);
        assertEquals("Simple", upgradedModel["autoNavigation"]);
    },
});
