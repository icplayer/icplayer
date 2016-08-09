TestCase("[Iframe] setState", {
    setUp: function () {
        this.presenter = AddonIframe_create();
        this.validState = JSON.stringify({
            iframeState : "someState",
            iframeScore : "SomeScore"
        });
        this.undefinedState = JSON.stringify({
            iframeScore : "SomeScore"
        });
    },

    'test state and score should be set as provided from player' : function () {
        var expectedIFrameState = "someState";
        var expectedIFrameScore = "SomeScore";
        this.presenter.setState(this.validState);

        assertEquals(this.presenter.iframeState, expectedIFrameState);
        assertEquals(this.presenter.iframeScore, expectedIFrameScore);
    },

    'test when state is empty String should be undefined iframeState' : function () {
        var expectedIFrameState = undefined;
        this.presenter.setState(this.undefinedScore);

        assertEquals(this.presenter.iframeState, expectedIFrameState);
    }
});

TestCase("[Iframe] getState", {
    setUp: function () {
        this.presenter = AddonIframe_create();
        this.presenter.iframeState = "SomeState";
        this.presenter.iframeScore = "someOtherScore";
    },

    'test state shoould be the same as from Iframe' : function () {

        var expectedState = JSON.stringify({iframeState: "SomeState", iframeScore: "someOtherScore"});

        var result = this.presenter.getState();
        assertEquals(result, expectedState);
    }

});