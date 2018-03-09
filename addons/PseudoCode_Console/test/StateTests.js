TestCase("[PseudoCode_Console - state tests] set state", {
    setUp: function () {
        this.presenter = AddonPseudoCode_Console_create();

        this.presenter.state.$view = {
            css: function () {}
        };
        
        this.exampleState = {
            isVisible: "xD",
            score: 1
        };
    },

    'test addon save visibility to state': function () {
        this.presenter.state.isVisible = "xD";

        var state = JSON.parse(this.presenter.getState());

        assertEquals("xD", state.isVisible);
    },

    'test addon recover visibility': function () {
        var json = JSON.stringify(this.exampleState);

        this.presenter.setState(json);

        assertEquals("xD", this.presenter.state.isVisible);
    },

    'test addon recover last score': function () {
        var json = JSON.stringify(this.exampleState);

        this.presenter.setState(json);

        assertEquals(1, this.presenter.state.lastScore);
    },

    'test addon save last score to state': function () {
        this.presenter.state.lastScore = 1;

        var state = JSON.parse(this.presenter.getState());

        assertEquals(1, state.score);
    },
});
