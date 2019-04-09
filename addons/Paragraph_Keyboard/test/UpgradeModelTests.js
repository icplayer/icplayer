TestCase("[Paragraph_Keyboard] Upgrade model", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();

        this.upgradeTitleStub = sinon.stub(this.presenter, 'upgradeTitle');
        this.upgradeManualGradingStub = sinon.stub(this.presenter, 'upgradeManualGrading');
        this.upgradeWeightStub = sinon.stub(this.presenter, 'upgradeWeight');
    },

    tearDown: function () {
        this.presenter.upgradeTitle.restore();
        this.presenter.upgradeManualGrading.restore();
        this.presenter.upgradeWeight.restore();
    },

    'test upgrade model': function () {
        this.presenter.upgradeModel({});

        assertTrue(this.upgradeTitleStub.called);
        assertTrue(this.upgradeManualGradingStub.called);
        assertTrue(this.upgradeWeightStub.called);
    }
});

TestCase("[Paragraph_Keyboard] Upgrading weight property", {
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