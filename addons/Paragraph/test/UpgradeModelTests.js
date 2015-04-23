TestCase("[Paragraph] Upgrade model", {
    setUp: function () {
        this.presenter = AddonParagraph_create();

        this.upgradePlaceholderTextStub = sinon.stub(this.presenter, 'upgradePlaceholderText');
    },

    tearDown: function () {
        this.presenter.upgradePlaceholderText.restore();
    },

    'test upgrade model': function () {
        this.presenter.upgradeModel({});

        assertTrue(this.upgradePlaceholderTextStub.called);
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