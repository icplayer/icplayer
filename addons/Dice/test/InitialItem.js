TestCase("[Dice] Initial item", {

    setUp: function () {
        this.presenter = AddonDice_create();

        this.presenter.configuration.initialItem = 0;

        sinon.spy(this.presenter, 'setRandomElement');
        this.presenter.setElement = function () {};
    },

    tearDown: function () {
        this.presenter.setRandomElement.restore();
    },

    'test initializeStartElement will set correctly initial item if value if 0': function () {
        this.presenter.initializeStartItem();

        assertFalse(this.presenter.setRandomElement.called);
        assertEquals(0, this.presenter.state.rolledElement);
    }
});