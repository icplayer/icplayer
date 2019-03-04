TestCase("[Paragraph] Upgrade model", {
    setUp: function () {
        this.presenter = AddonParagraph_create();

        this.upgradePlaceholderTextStub = sinon.stub(this.presenter, 'upgradePlaceholderText');
        this.upgradeEditablePlaceholderStub = sinon.stub(this.presenter, 'upgradeEditablePlaceholder');
        this.upgradeManualGradingStub = sinon.stub(this.presenter, 'upgradeManualGrading');
        this.upgradeTitleStub = sinon.stub(this.presenter, 'upgradeTitle');
    },

    tearDown: function () {
        this.presenter.upgradePlaceholderText.restore();
        this.presenter.upgradeManualGrading.restore();
        this.presenter.upgradeTitle.restore();
    },

    'test upgrade model': function () {
        this.presenter.upgradeModel({});

        assertTrue(this.upgradePlaceholderTextStub.called);
        assertTrue(this.upgradeEditablePlaceholderStub.called);
        assertTrue(this.upgradeManualGradingStub.called);
        assertTrue(this.upgradeTitleStub.called);
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