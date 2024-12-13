TestCase("[Paragraph] Upgrade model", {
    setUp: function () {
        this.presenter = AddonParagraph_create();

        this.upgradePlaceholderTextStub = sinon.stub(this.presenter, 'upgradePlaceholderText');
        this.upgradeEditablePlaceholderStub = sinon.stub(this.presenter, 'upgradeEditablePlaceholder');
        this.upgradeManualGradingStub = sinon.stub(this.presenter, 'upgradeManualGrading');
        this.upgradeTitleStub = sinon.stub(this.presenter, 'upgradeTitle');
        this.upgradeWeightStub = sinon.stub(this.presenter, 'upgradeWeight');
        this.upgradeModelAnswerStub = sinon.stub(this.presenter, 'upgradeModelAnswer');
        this.upgradeLangTagStub = sinon.stub(this.presenter, 'upgradeLangTag');
        this.upgradeSpeechTextsStub = sinon.stub(this.presenter, 'upgradeSpeechTexts');
        this.upgradeBlockInErrorCheckingModeStub = sinon.stub(this.presenter, 'upgradeBlockInErrorCheckingMode');
        this.upgradeUseCustomCSSFilesStub = sinon.stub(this.presenter, 'upgradeUseCustomCSSFiles');
    },

    tearDown: function () {
        this.presenter.upgradePlaceholderText.restore();
        this.presenter.upgradeManualGrading.restore();
        this.presenter.upgradeTitle.restore();
        this.presenter.upgradeWeight.restore();
        this.presenter.upgradeModelAnswer.restore();
        this.presenter.upgradeLangTag.restore();
        this.presenter.upgradeSpeechTexts.restore();
        this.presenter.upgradeBlockInErrorCheckingMode.restore();
        this.presenter.upgradeUseCustomCSSFiles.restore();
    },

    'test upgrade model': function () {
        this.presenter.upgradeModel({});

        assertTrue(this.upgradePlaceholderTextStub.calledOnce);
        assertTrue(this.upgradeEditablePlaceholderStub.calledOnce);
        assertTrue(this.upgradeManualGradingStub.calledOnce);
        assertTrue(this.upgradeTitleStub.calledOnce);
        assertTrue(this.upgradeWeightStub.calledOnce);
        assertTrue(this.upgradeModelAnswerStub.calledOnce);
        assertTrue(this.upgradeLangTagStub.calledOnce);
        assertTrue(this.upgradeSpeechTextsStub.calledOnce);
        assertTrue(this.upgradeBlockInErrorCheckingModeStub.calledOnce);
        assertTrue(this.upgradeUseCustomCSSFilesStub.calledOnce);
    }
});

TestCase("[Paragraph] Upgrading placeholder text property", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
    },

    'test model should not be upgraded' : function() {
        var model = {
            "ID": "Paragraph1",
            "Placeholder Text": "qaefdasfas"
        };

        var upgradedModel = this.presenter.upgradePlaceholderText(model);

        assertEquals("qaefdasfas", upgradedModel["Placeholder Text"]);
    },

    'test placeholder text should be empty string as default' : function() {
        var model = {
            "ID": "Paragraph1"
        };

        var upgradedModel = this.presenter.upgradePlaceholderText(model);

        assertEquals(upgradedModel["Placeholder Text"], "");
    }
});

TestCase("[Paragraph] Upgrading editable placeholder property", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
    },

    'test when model has editable placeholder property then model should not be upgraded' : function() {
        var model = {
            "ID": "Paragraph1",
            "Editable placeholder": "True"
        };

        var upgradedModel = this.presenter.upgradeEditablePlaceholder(model);

        assertEquals("True", upgradedModel["Editable placeholder"]);
    },

    'test when model has no editable placeholder property then editable placeholder should be empty string as default' : function() {
        var model = {
            "ID": "Paragraph1"
        };

        var upgradedModel = this.presenter.upgradeEditablePlaceholder(model);

        assertEquals("", upgradedModel["Editable placeholder"]);
    }
});

TestCase("[Paragraph] Upgrading weight property", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
    },

    'test when model has weight property then model should not be upgraded' : function() {
        var model = {
            "ID": "Paragraph1",
            "Weight": "1"
        };

        var upgradedModel = this.presenter.upgradeWeight(model);

        assertEquals("1", upgradedModel["Weight"]);
    },

    'test when model has no weight property then weight should be empty string as default' : function() {
        var model = {
            "ID": "Paragraph1"
        };

        var upgradedModel = this.presenter.upgradeWeight(model);

        assertEquals("", upgradedModel["Weight"]);
    }
});

TestCase("[Paragraph] Upgrade model with lang tag", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
    },

    'test given empty model when upgrade then should add lang tag with empty value': function () {
        var model = {};

        var upgradedModel = this.presenter.upgradeLangTag(model);

        assertEquals("", upgradedModel.langAttribute);
    },

    'test given model with filled langTag when upgrade then should leave value unchanged': function () {
        var model = {
            langAttribute: "pl-PL"
        };

        var upgradedModel = this.presenter.upgradeLangTag(model);

        assertEquals("pl-PL", upgradedModel.langAttribute);
    },
});

TestCase("[Paragraph] Upgrade model with speech texts", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
    },

    'test given empty model when upgrade then should add speech Texts with default value': function () {
        var model = {};
        var defaultValue = {
            Bold: {Bold: ""},
            Italic: {Italic: ""},
            Underline: {Underline: ""},
            AlignLeft: {AlignLeft: ""},
            AlignCenter: {AlignCenter: ""},
            AlignRight: {AlignRight: ""},
            Justify: {Justify: ""},
            Selected:{Selected:""},
            ParagraphContent:{ParagraphContent: ""},
            Deselected:{Deselected:""},
        };
        var upgradedModel = this.presenter.upgradeSpeechTexts(model);

        assertEquals(defaultValue, upgradedModel.speechTexts);
    },

    'test given model with filled langTag when upgrade then should leave value unchanged': function () {
        var model = {
            speechTexts: {
                Bold: {Bold: "wytłuszczone"},
                Italic: {Italic: "kursywa"},
                Underline: {Underline: "podkreslenie"},
                AlignLeft: {AlignLeft: "do lewej"},
                AlignCenter: {AlignCenter: "do srodka"},
                AlignRight: {AlignRight: "do prawej"},
                Justify: {Justify: "wyjustuj"},
                Selected: {Selected: "wybrano"},
                ParagraphContent: {ParagraphContent: "zawartość"},
                Deselected: {Deselected: "Odznaczono"},
            }
        };

        var upgradedModel = this.presenter.upgradeSpeechTexts(model);

        assertEquals(model.speechTexts, upgradedModel.speechTexts);
    },
});

TestCase("[Paragraph] Upgrade model with show answers", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
    },

    'test given no show answer when upgradeModelAnswer then value should be object with empty string': function () {
        var model = {};
        var expected = {
            "Show Answers": [{Text: ""}]
        }


        var upgradedModel = this.presenter.upgradeModelAnswer(model);

        assertEquals(expected, upgradedModel);
    },

    'test given show answer as plain string when upgradeModelAnswer then value should be object with given string': function () {
        var model = {
            "Show Answers": "this is correct answer"
        };
        var expected = {
            "Show Answers": [{Text: "this is correct answer"}]
        }


        var upgradedModel = this.presenter.upgradeModelAnswer(model);

        assertEquals(expected, upgradedModel);
    },

     'test given show answer as correct object when upgradeModelAnswer then value remain unchanged': function () {
        var model = {
            "Show Answers": [{Text: "this is correct answer"}]
        };
        var expected = {
            "Show Answers": [{Text: "this is correct answer"}]
        }


        var upgradedModel = this.presenter.upgradeModelAnswer(model);

        assertEquals(expected, upgradedModel);
    }
});

TestCase("[Paragraph] Upgrade model with Block in error checking mode", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
    },

    'test given empty model when upgrade then should add Block in error checking mode with "False" value': function () {
        const model = {};

        const upgradedModel = this.presenter.upgradeBlockInErrorCheckingMode(model);

        assertEquals("False", upgradedModel["Block in error checking mode"]);
    },

    'test given model with filled Block in error checking mode when upgrade then should leave value unchanged': function () {
        const model = {
            "Block in error checking mode": "True"
        };

        const upgradedModel = this.presenter.upgradeBlockInErrorCheckingMode(model);

        assertEquals("True", upgradedModel["Block in error checking mode"]);
    },
});

TestCase("[Paragraph] Upgrading Use Custom CSS files property", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
    },

    'test when model has "Use Custom CSS files" property then model should not be upgraded' : function() {
        var model = {
            "ID": "Paragraph1",
            "useCustomCSSFiles": "True"
        };

        var upgradedModel = this.presenter.upgradeUseCustomCSSFiles(model);

        assertEquals("True", upgradedModel["useCustomCSSFiles"]);
    },

    'test when model has no "Use Custom CSS files" property then "Use Custom CSS files" should be empty string as default' : function() {
        var model = {
            "ID": "Paragraph1"
        };

        var upgradedModel = this.presenter.upgradeUseCustomCSSFiles(model);

        assertEquals("False", upgradedModel["useCustomCSSFiles"]);
    }
});
