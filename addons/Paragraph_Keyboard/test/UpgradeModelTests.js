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