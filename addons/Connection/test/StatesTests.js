StatesTests = TestCase("States Tests");

StatesTests.prototype.setUp = function() {
    this.presenter = AddonConnection_create();
    this.presenter.lineStack.ids = [
        [1, 3],
        ['a', 5]
    ]
};

StatesTests.prototype.testGetState = function() {
    var expectedState = "[\"1:3\",\"a:5\"]";
    var state = this.presenter.getState();
    assertEquals(expectedState, state);
};