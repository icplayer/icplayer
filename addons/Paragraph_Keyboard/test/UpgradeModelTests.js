TestCase("[Paragraph Keyboard] Upgrade model", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();

        this.upgradeTitleStub = sinon.stub(this.presenter, 'upgradeTitle');
        this.upgradeManualGradingStub = sinon.stub(this.presenter, 'upgradeManualGrading');
        this.upgradeWeightStub = sinon.stub(this.presenter, 'upgradeWeight');
        this.upgradeModelAnswerStub = sinon.stub(this.presenter, 'upgradeModelAnswer');
        this.upgradePlaceholderTextStub = sinon.stub(this.presenter, 'upgradePlaceholderText');
        this.upgradeEditablePlaceholderStub = sinon.stub(this.presenter, 'upgradeEditablePlaceholder');
        this.upgradeUseCustomCSSFilesStub = sinon.stub(this.presenter, 'upgradeUseCustomCSSFiles');
    },

    tearDown: function () {
        this.presenter.upgradeTitle.restore();
        this.presenter.upgradeManualGrading.restore();
        this.presenter.upgradeWeight.restore();
        this.presenter.upgradeModelAnswer.restore();
        this.presenter.upgradePlaceholderText.restore();
        this.presenter.upgradeEditablePlaceholder.restore();
        this.presenter.upgradeUseCustomCSSFiles.restore();
    },

    'test upgrade model': function () {
        this.presenter.upgradeModel({});

        assertTrue(this.upgradeTitleStub.calledOnce);
        assertTrue(this.upgradeManualGradingStub.calledOnce);
        assertTrue(this.upgradeWeightStub.calledOnce);
        assertTrue(this.upgradeModelAnswerStub.calledOnce);
        assertTrue(this.upgradePlaceholderTextStub.calledOnce);
        assertTrue(this.upgradeEditablePlaceholderStub.calledOnce);
        assertTrue(this.upgradeUseCustomCSSFilesStub.calledOnce);
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
        var upgradedModel = this.presenter.upgradePlaceholderText(this.model);

        assertNotUndefined(upgradedModel["Placeholder Text"]);
        assertEquals("", upgradedModel["Placeholder Text"]);
    },

    'test given model with set Placeholder Text when upgradePlaceholderText is called then Placeholder Text value remain unchanged' : function() {
        this.model["Placeholder Text"] = "qaefdasfas";

        var upgradedModel = this.presenter.upgradePlaceholderText(this.model);

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
        var upgradedModel = this.presenter.upgradeEditablePlaceholder(this.model);

        assertNotUndefined(upgradedModel["Editable placeholder"]);
        assertEquals("", upgradedModel["Editable placeholder"]);
    },

    'test given model with set Editable placeholder when upgradeEditablePlaceholder is called then Editable placeholder value remain unchanged' : function() {
        this.model["Editable placeholder"] = "True";

        var upgradedModel = this.presenter.upgradeEditablePlaceholder(this.model);

        assertNotUndefined(upgradedModel["Editable placeholder"]);
        assertEquals("True", upgradedModel["Editable placeholder"]);
    },
});

TestCase("[Paragraph Keyboard] Upgrading weight property", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
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

TestCase("[Paragraph Keyboard] Upgrading Use Custom CSS files property", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
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
