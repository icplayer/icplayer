TestCase("[Shooting_Range - callbacks] callbacks", {
    setUp: function () {
        this.presenter = AddonShooting_Range_create();
        this.presenter.sendValueChangedEvent = sinon.spy();
        this.presenter.configuration.addonID = "someID";

    },

    'test onCorrectAnswerCallback will increment score and send event': function () {
        var expected = {
            source : "someID",
            item : 1 + "-" + 2,
            value : 1,
            score : 1
        };
        this.presenter.onCorrectAnswerCallback(1, 2);
        assertTrue(this.presenter.sendValueChangedEvent.calledOnce);
        assertEquals(expected, this.presenter.sendValueChangedEvent.getCall(0).args[0]);

        assertEquals(1, this.presenter.state.score);
    },

    'test onWrongAnswerCallback will increment errorCount and send event': function () {
        var expected = {
            source : "someID",
            item : 1 + "-" + 2,
            value : 1,
            score : 0
        };
        this.presenter.onWrongAnswerCallback(1, 2);
        assertTrue(this.presenter.sendValueChangedEvent.calledOnce);
        assertEquals(expected, this.presenter.sendValueChangedEvent.getCall(0).args[0]);

        assertEquals(1, this.presenter.state.errorCount);
    },

    'test onDroppedCorrectAnswerCallback will increment errorCount and send event': function () {
        var expected = {
            source : "someID",
            item : 1 + "-" + 2,
            value : 0,
            score : 0
        };
        this.presenter.onDroppedCorrectAnswerCallback(1, 2);
        assertTrue(this.presenter.sendValueChangedEvent.calledOnce);
        assertEquals(expected, this.presenter.sendValueChangedEvent.getCall(0).args[0]);

        assertEquals(1, this.presenter.state.errorCount);
    }
});