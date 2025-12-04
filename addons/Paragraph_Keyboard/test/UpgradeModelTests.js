TestCase("[Paragraph Keyboard] Upgrade model", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();

        this.stubs = [
            sinon.stub(this.presenter, 'upgradeTitle'),
            sinon.stub(this.presenter, 'upgradeManualGrading'),
            sinon.stub(this.presenter, 'upgradeWeight'),
            sinon.stub(this.presenter, 'upgradeModelAnswer'),
            sinon.stub(this.presenter, 'upgradePlaceholderText'),
            sinon.stub(this.presenter, 'upgradeEditablePlaceholder'),
            sinon.stub(this.presenter, 'upgradeUseCustomCSSFiles'),
            sinon.stub(this.presenter, 'upgradeLangTag'),
            sinon.stub(this.presenter, 'upgradeSpeechTexts')
        ];
    },

    tearDown: function () {
        this.stubs.forEach(stub => stub.restore());
    },

    'test upgrade model': function () {
        this.presenter.upgradeModel({});

        this.stubs.forEach(stub => assertTrue(stub.calledOnce));
    }
});

TestCase("[Paragraph Keyboard] Upgrading placeholder text property", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
        this.model = {
            "ID": "Paragraph1",
        };
    },

    'test given model without set Placeholder Text when upgradePlaceholderText is called then Placeholder Text is added with default value': function () {
        const upgradedModel = this.presenter.upgradePlaceholderText(this.model);

        assertNotUndefined(upgradedModel["Placeholder Text"]);
        assertEquals("", upgradedModel["Placeholder Text"]);
    },

    'test given model with set Placeholder Text when upgradePlaceholderText is called then Placeholder Text value remain unchanged' : function() {
        this.model["Placeholder Text"] = "qaefdasfas";

        const upgradedModel = this.presenter.upgradePlaceholderText(this.model);

        assertNotUndefined(upgradedModel["Placeholder Text"]);
        assertEquals("qaefdasfas", upgradedModel["Placeholder Text"]);
    },
});

TestCase("[Paragraph Keyboard] Upgrading editable placeholder property", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
        this.model = {
            "ID": "Paragraph1",
        };
    },

    'test given model without set Editable placeholder when upgradeEditablePlaceholder is called then Editable placeholder is added with default value' : function() {
        const upgradedModel = this.presenter.upgradeEditablePlaceholder(this.model);

        assertNotUndefined(upgradedModel["Editable placeholder"]);
        assertEquals("", upgradedModel["Editable placeholder"]);
    },

    'test given model with set Editable placeholder when upgradeEditablePlaceholder is called then Editable placeholder value remain unchanged' : function() {
        this.model["Editable placeholder"] = "True";

        const upgradedModel = this.presenter.upgradeEditablePlaceholder(this.model);

        assertNotUndefined(upgradedModel["Editable placeholder"]);
        assertEquals("True", upgradedModel["Editable placeholder"]);
    },
});

TestCase("[Paragraph Keyboard] Upgrading weight property", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
    },

    'test when model has weight property then model should not be upgraded' : function() {
        const model = {
            "ID": "Paragraph1",
            "Weight": "1"
        };

        const upgradedModel = this.presenter.upgradeWeight(model);

        assertEquals("1", upgradedModel["Weight"]);
    },

    'test when model has no weight property then weight should be empty string as default' : function() {
        const model = {
            "ID": "Paragraph1"
        };

        const upgradedModel = this.presenter.upgradeWeight(model);

        assertEquals("", upgradedModel["Weight"]);
    }
});

TestCase("[Paragraph Keyboard] Upgrading Use Custom CSS files property", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
    },

    'test when model has "Use Custom CSS files" property then model should not be upgraded' : function() {
        const model = {
            "ID": "Paragraph1",
            "useCustomCSSFiles": "True"
        };

        const upgradedModel = this.presenter.upgradeUseCustomCSSFiles(model);

        assertEquals("True", upgradedModel["useCustomCSSFiles"]);
    },

    'test when model has no "Use Custom CSS files" property then "Use Custom CSS files" should be empty string as default' : function() {
        const model = {
            "ID": "Paragraph1"
        };

        const upgradedModel = this.presenter.upgradeUseCustomCSSFiles(model);

        assertEquals("False", upgradedModel["useCustomCSSFiles"]);
    }
});

TestCase("[Paragraph Keyboard] Upgrading speechTexts property", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
    },

    'test when model has no speechTexts property then upgradeSpeechTexts adds default speechTexts': function () {
        const model = {};

        const upgradedModel = this.presenter.upgradeSpeechTexts(model);

        assertNotUndefined(upgradedModel.speechTexts);
        assertNotUndefined(upgradedModel.speechTexts.Selected);
        assertNotUndefined(upgradedModel.speechTexts.Shift);
        assertEquals("", upgradedModel.speechTexts.Selected.Selected);
        assertEquals("", upgradedModel.speechTexts.Shift.Shift);
    },

    'test when model has speechTexts property then upgradeSpeechTexts keeps values and adds missing Shift': function () {
        const model = {
            speechTexts: {
                Selected: {Selected: "Wybrano"},
                Bold: {Bold: "Pogrubienie"}
            }
        };
        const upgradedModel = this.presenter.upgradeSpeechTexts(model);

        assertEquals("Wybrano", upgradedModel.speechTexts.Selected.Selected);
        assertEquals("Pogrubienie", upgradedModel.speechTexts.Bold.Bold);
        assertNotUndefined(upgradedModel.speechTexts.Shift);
        assertEquals("", upgradedModel.speechTexts.Shift.Shift);
    },

    'test when model has speechTexts with Shift property then upgradeSpeechTexts does not overwrite Shift': function () {
        const model = {
            speechTexts: {
                Shift: {Shift: "Przesuń"}
            }
        };
        const upgradedModel = this.presenter.upgradeSpeechTexts(model);

        assertEquals("Przesuń", upgradedModel.speechTexts.Shift.Shift);
    }
});

TestCase("[Paragraph Keyboard] upgradeModel integration", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
    },

    'test given empty model when upgradeModel is called then all properties are added with default values': function () {
        const model = {};

        const upgraded = this.presenter.upgradeModel(model);

        assertNotUndefined(upgraded["Title"]);
        assertNotUndefined(upgraded["Manual grading"]);
        assertNotUndefined(upgraded["Weight"]);
        assertNotUndefined(upgraded["Show Answers"]);
        assertNotUndefined(upgraded["Placeholder Text"]);
        assertNotUndefined(upgraded["Editable placeholder"]);
        assertNotUndefined(upgraded["useCustomCSSFiles"]);
        assertNotUndefined(upgraded["langAttribute"]);
        assertNotUndefined(upgraded.speechTexts);
    },

    'test given model with some properties when upgradeModel is called then existing properties are preserved and missing are added': function () {
        const model = {
            "Title": "MyTitle",
            "Weight": "5",
            "langAttribute": "pl"
        };

        const upgraded = this.presenter.upgradeModel(model);

        assertEquals("MyTitle", upgraded["Title"]);
        assertEquals("5", upgraded["Weight"]);
        assertEquals("pl", upgraded["langAttribute"]);
        assertNotUndefined(upgraded["Manual grading"]);
        assertNotUndefined(upgraded["Show Answers"]);
        assertNotUndefined(upgraded["Placeholder Text"]);
        assertNotUndefined(upgraded["Editable placeholder"]);
        assertNotUndefined(upgraded["useCustomCSSFiles"]);
        assertNotUndefined(upgraded.speechTexts);
    },

    'test given model with all properties when upgradeModel is called then no property is overwritten': function () {
        const model = {
            "Title": "T",
            "Manual grading": true,
            "Weight": "10",
            "Show Answers": "A",
            "Placeholder Text": "P",
            "Editable placeholder": "E",
            "useCustomCSSFiles": "True",
            "langAttribute": "en",
            speechTexts: {Selected: {Selected: "S"}, Shift: {Shift: "Sh"}}
        };

        const upgraded = this.presenter.upgradeModel(model);

        assertEquals("T", upgraded["Title"]);
        assertEquals(true, upgraded["Manual grading"]);
        assertEquals("10", upgraded["Weight"]);
        assertEquals("A", upgraded["Show Answers"]);
        assertEquals("P", upgraded["Placeholder Text"]);
        assertEquals("E", upgraded["Editable placeholder"]);
        assertEquals("True", upgraded["useCustomCSSFiles"]);
        assertEquals("en", upgraded["langAttribute"]);
        assertEquals("S", upgraded.speechTexts.Selected.Selected);
        assertEquals("Sh", upgraded.speechTexts.Shift.Shift);
    }
});

TestCase("[Paragraph Keyboard] upgradeLangTag", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
    },

    'test given model without langAttribute when upgradeLangTag is called then langAttribute is added with default value': function () {
        const model = {};

        const upgraded = this.presenter.upgradeLangTag(model);

        assertNotUndefined(upgraded["langAttribute"]);
        assertEquals("", upgraded["langAttribute"]);
    },

    'test given model with langAttribute when upgradeLangTag is called then langAttribute value remains unchanged': function () {
        const model = { langAttribute: "pl" };

        const upgraded = this.presenter.upgradeLangTag(model);

        assertEquals("pl", upgraded["langAttribute"]);
    }
});

TestCase("[Paragraph Keyboard] upgradeModelAnswer", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
    },

    'test given model without Show Answers when upgradeModelAnswer is called then Show Answers is added with default value': function () {
        const model = {};

        const upgraded = this.presenter.upgradeModelAnswer(model);

        assertNotUndefined(upgraded["Show Answers"]);
        assertEquals("", upgraded["Show Answers"]);
    },

    'test given model with Show Answers when upgradeModelAnswer is called then Show Answers value remains unchanged': function () {
        const model = { "Show Answers": "Odpowiedź" };

        const upgraded = this.presenter.upgradeModelAnswer(model);

        assertEquals("Odpowiedź", upgraded["Show Answers"]);
    }
});

TestCase("[Paragraph Keyboard] upgradeTitle", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
    },

    'test given model without Title when upgradeTitle is called then Title is added with default value': function () {
        const model = {};

        const upgraded = this.presenter.upgradeTitle(model);

        assertNotUndefined(upgraded["Title"]);
        assertEquals("", upgraded["Title"]);
    },

    'test given model with Title when upgradeTitle is called then Title value remains unchanged': function () {
        const model = { Title: "Nagłówek" };

        const upgraded = this.presenter.upgradeTitle(model);

        assertEquals("Nagłówek", upgraded["Title"]);
    }
});

TestCase("[Paragraph Keyboard] upgradeManualGrading", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
    },

    'test given model without Manual grading when upgradeManualGrading is called then Manual grading is added with default value': function () {
        const model = {};

        const upgraded = this.presenter.upgradeManualGrading(model);

        assertNotUndefined(upgraded["Manual grading"]);
        assertEquals(false, upgraded["Manual grading"]);
    },

    'test given model with Manual grading when upgradeManualGrading is called then Manual grading value remains unchanged': function () {
        const model = { "Manual grading": true };

        const upgraded = this.presenter.upgradeManualGrading(model);

        assertEquals(true, upgraded["Manual grading"]);
    }
});
