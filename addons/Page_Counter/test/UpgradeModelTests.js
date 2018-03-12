TestCase("[Page Counter] Upgrade model", {
    setUp: function () {
        this.presenter = AddonPage_Counter_create();

        this.startFromUpgradeStub = sinon.stub(this.presenter, 'upgradeStartFromAndOPT');
        this.upgradeAddTTS = sinon.stub(this.presenter, 'upgradeAddTTS');
    },

    tearDown: function () {
        this.presenter.upgradeStartFromAndOPT.restore();
        this.presenter.upgradeAddTTS.restore();
    },

    'test upgrade model': function () {
        this.presenter.upgradeModel({});

        assertTrue(this.startFromUpgradeStub.called);
        assertTrue(this.upgradeAddTTS.called);
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

TestCase("[Page Counter] Upgrading langAttribute and speechTexts properties", {
    setUp: function () {
        this.presenter = AddonPage_Counter_create();
    },

    'test model should not be upgraded' : function() {
        var model = {
            "ID": "Page_Counter1",
            "langAttribute": "pl-PL",
            "speechTexts": {
                Page: {Page: 'Page number'},
                OutOf: {OutOf: 'from the total of'}
            }
        };

        var upgradedModel = this.presenter.upgradeAddTTS(model);

        assertEquals( "pl-PL", upgradedModel.langAttribute);
        assertEquals('Page number', upgradedModel.speechTexts['Page']['Page']);
        assertEquals('from the total of', upgradedModel.speechTexts['OutOf']['OutOf']);
    },

    'test checking upgrading missing langAttribute & speechTexts property' : function() {
        var model = {
            "ID": "Page_Counter1"
        };

        var upgradedModel = this.presenter.upgradeAddTTS(model);

        assertEquals("", upgradedModel.langAttribute);
        assertEquals("", upgradedModel.speechTexts['Page']['Page']);
        assertEquals("", upgradedModel.speechTexts['OutOf']['OutOf']);
    }
});