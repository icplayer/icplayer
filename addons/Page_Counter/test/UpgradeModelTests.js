TestCase("[Page Counter] Upgrade model", {
    setUp: function () {
        this.presenter = AddonPage_Counter_create();

        this.startFromUpgradeStub = sinon.stub(this.presenter, 'upgradeStartFromAndOPT');
    },

    tearDown: function () {
        this.presenter.upgradeStartFromAndOPT.restore();
    },

    'test upgrade model': function () {
        this.presenter.upgradeModel({});

        assertTrue(this.startFromUpgradeStub.called);
    }
});

TestCase("[Page Counter] Upgrading startFrom and omittedPagesTexts properties", {
    setUp: function () {
        this.presenter = AddonPage_Counter_create();
    },

    'test model should not be upgraded' : function() {
        var model = {
            "ID": "Page_Counter1",
            "startFrom": "3",
            "omittedPagesTexts": [
                {"pages": "1, 2", "text": "qweqwe"}
            ]
        };

        var upgradedModel = this.presenter.upgradeStartFromAndOPT(model);

        assertEquals(upgradedModel.startFrom, "3");
        assertEquals([{"pages": "1, 2", "text": "qweqwe"}], upgradedModel.omittedPagesTexts);
    },

    'test checking upgrading missing startFrom & omittedPagesText property' : function() {
        var model = {
            "ID": "Page_Counter1"
        };

        var upgradedModel = this.presenter.upgradeStartFromAndOPT(model);

        assertEquals(upgradedModel.startFrom, "");
        assertEquals([{"pages": "", "text": ""}], upgradedModel.omittedPagesTexts);
    }
});