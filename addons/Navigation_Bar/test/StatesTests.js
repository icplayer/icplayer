TestCase("[Navigation_Bar] get state", {
    setUp: function () {
        this.presenter = AddonNavigation_Bar_create();
        this.presenter.state.bookmarks = [1,2,3,4]
    },

    'test given navbar with bookmarks when getting addon state then state contains bookmarks': function () {
        var state = this.presenter.getState();

        assertEquals('{"bookmarks":[1,2,3,4]}', state);
    }
});

TestCase("[Navigation_Bar] set state", {
    setUp: function () {
        this.presenter = AddonNavigation_Bar_create();
    },

    'test given state with bookmarks when setting addon state then addon state contains bookmarks': function () {
        state = '{"bookmarks":[1,2,3,4]}';

        this.presenter.setState(state);

        assertEquals([1,2,3,4], this.presenter.state.bookmarks);
    }
});