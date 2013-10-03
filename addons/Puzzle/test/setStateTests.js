TestCase("[Puzzle] setState", {

    setUp: function() {
        this.presenter = AddonPuzzle_create();
    },

    'test setState for empty state': function () {
        assertEquals(undefined, this.presenter.setState(""));
    }

});