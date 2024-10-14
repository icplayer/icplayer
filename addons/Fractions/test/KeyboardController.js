TestCase("[Fractions] Keyboard controller tests", {
    setUp: function () {
        this.presenter = AddonFractions_create();

        this.presenter.$view = $(document.createElement('div'));

        this.presenter.configuration = getMockedConfiguration();
    },

    'test given presenter without keyboard controller when buildKeyboardController then set keyboard controller to presenter': function () {
        this.presenter.buildKeyboardController();

        assertTrue(this.presenter.keyboardControllerObject !== null);
    },

    'test clicked on enter when it is first enter then set marked index at first element': function () {
        this.presenter.isFirstEnter = true;
        this.presenter.markItem = sinon.stub();
        this.presenter.readOnEnter = sinon.stub();

        this.presenter.enter();

        assertEquals(this.presenter.markedItemIndex, 1);
        assertEquals(this.presenter.orderItemIndex, 1);
        assertFalse(this.presenter.isFirstEnter);
    },

    'test clicked on tab when keyboard navigation is active the move to next element': function () {
        this.presenter.orderItemIndex = 1;
        this.presenter.markedItemIndex = 1;
        this.presenter.markItem = sinon.stub();
        this.presenter.readMarkedElement = sinon.stub();

        this.presenter.nextElement();

        assertEquals(this.presenter.markedItemIndex, 2);
        assertEquals(this.presenter.orderItemIndex, 2);
        assertTrue(this.presenter.markItem.calledWith(this.presenter.markedItemIndex));
    }
});

function getMockedConfiguration() {
    return {
        "figure": 1,
        "circleParts": 5,
    };
}