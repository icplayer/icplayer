TestCase("[Iframe] setState", {
    setUp: function () {
        this.presenter = AddonIframe_create();
        this.validState = JSON.stringify({
            iframeState : "someState",
            iframeScore : "SomeScore",
            isVisible : true
        });
        this.validState2 = JSON.stringify({
            iframeState : "someState",
            iframeScore : "SomeScore",
            isVisible : false
        });

        this.validState3 = JSON.stringify({
            iframeState : "someState",
            iframeScore : "SomeScore",
            isVisible : undefined
        });

        this.undefinedState = JSON.stringify({
            iframeScore : "SomeScore"
        });
        this.presenter.setVisibility = sinon.stub();
    },

    'test state and score and isVisible is true should be set as provided from player' : function () {
        var expectedIFrameState = "someState";
        var expectedIFrameScore = "SomeScore";
        var expectedVisible = true;
        this.presenter.setState(this.validState);

        assertEquals(this.presenter.iframeState, expectedIFrameState);
        assertEquals(this.presenter.iframeScore, expectedIFrameScore);
        assertEquals(this.presenter.isVisible, expectedVisible);
    },

    'test state and score and isVisible is false should be set as provided from player' : function () {
        var expectedIFrameState = "someState";
        var expectedIFrameScore = "SomeScore";
        var expectedVisible = false;
        this.presenter.setState(this.validState2);

        assertEquals(this.presenter.iframeState, expectedIFrameState);
        assertEquals(this.presenter.iframeScore, expectedIFrameScore);
        assertEquals(this.presenter.isVisible, expectedVisible);
    },

    'test when state.isVisible is undefined pesenter.isVisible should be true' : function () {
         var expectedVisible = true;
        this.presenter.setState(this.validState3);

        assertEquals(this.presenter.isVisible, expectedVisible);
    },

    'test when state. is empty String should be undefined iframeState' : function () {
        var expectedIFrameState = undefined;
        this.presenter.setState(this.undefinedState);

        assertEquals(this.presenter.iframeState, expectedIFrameState);
    }
});

TestCase("[Iframe] getState", {
    setUp: function () {
        this.presenter = AddonIframe_create();
        this.presenter.iframeState = "SomeState";
        this.presenter.iframeScore = "someOtherScore";
    },

    'test when state.isVisible is true presenter shoould be the same as from Iframe' : function () {
        this.presenter.isVisible = true;
        var expectedState = JSON.stringify({iframeState: "SomeState", iframeScore: "someOtherScore", isVisible:true});

        var result = this.presenter.getState();
        assertEquals(result, expectedState);
    },

    'test when state.isVisible is false presenter shoould be the same as from Iframe' : function () {
        this.presenter.isVisible = false;
        var expectedState = JSON.stringify({iframeState: "SomeState", iframeScore: "someOtherScore", isVisible:false});

        var result = this.presenter.getState();
        assertEquals(result, expectedState);
    }

});