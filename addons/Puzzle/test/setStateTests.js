TestCase("[Puzzle] setState", {

    'test setState for empty state': function () {
        assertEquals(undefined, this.presenter.setState(""));
    }

});