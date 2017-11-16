TestCase("[Pseudo_Console - state tests] set state", {
    setUp: function () {
        this.presenter = AddonPseudo_Console_create();

        this.presenter.state.$view = {
            css: function () {}
        }
        
        this.exampleState = {
            isVisible: "xD"
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
    }
});
