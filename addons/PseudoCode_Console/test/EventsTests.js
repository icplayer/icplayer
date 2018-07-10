TestCase("[PseudoCode_Console - events tests] sending events", {
    setUp: function () {
        this.presenter = AddonPseudoCode_Console_create();

        this.presenter.state.wasChanged = true;
        this.presenter.configuration.isActivity = true;
        this.presenter.configuration.addonID = 'testAddon';

        this.presenter.evaluateScore = function () {
            return 1;
        };

        this.presenter.state.eventBus = {
            sendEvent: sinon.spy()
        };
    },

    'test if code was changed and score returns 1 then even will be sent': function () {
        var expected = {
            'source': 'testAddon',
            'item': 'all',
            'value': '',
            'score': 1
        };

        this.presenter.getScore();

        assertTrue(this.presenter.state.eventBus.sendEvent.calledWith('ValueChanged', expected));
    },

    'test if code wasn\'t changed and score returns 1 then event wont be sent': function () {
        this.presenter.state.wasChanged = false;

        this.presenter.getScore();

        assertFalse(this.presenter.state.eventBus.sendEvent.called);
    },

    'test if code wasn\'t changed and score returns 0 then event wont be sent': function () {
        this.presenter.evaluateScore = function () {
            return 0;
        };

        this.presenter.state.wasChanged = false;

        this.presenter.getScore();

        assertFalse(this.presenter.state.eventBus.sendEvent.called);
    },

    'test if code was changed and score returns 0 then event will be sent': function () {
        this.presenter.evaluateScore = function () {
            return 0;
        };

        var expected = {
            'source': 'testAddon',
            'item': 'all',
            'value': '',
            'score': 0
        };

        this.presenter.getScore();

        assertTrue(this.presenter.state.eventBus.sendEvent.calledWith('ValueChanged', expected));
    }
});
