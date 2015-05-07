TestCase("[Hangman] Get letters in order", {
    setUp: function () {
        this.presenter = AddonHangman_create();
        this.changeLettersOrderStub = sinon.stub(this.presenter, 'changeLettersOrder');
        this.presenter.configuration = {
            isCustomKeyboardLettersOrderSet: false
        };
    },

    tearDown: function () {
        this.presenter.changeLettersOrder.restore();
    },

    'test if custom order is not set, order shouldnt be changed': function () {
        var letters = ['a', 'b', 'c', 'd'];

        var validationResult = this.presenter.getLettersInOrder(letters);

        assertEquals(letters, validationResult);
        assertFalse(this.changeLettersOrderStub.called);
    },

    'test if custom order is set, order should be changed': function () {
        this.presenter.configuration.isCustomKeyboardLettersOrderSet = true;
        var letters = ['a', 'b', 'c', 'd'];

        this.presenter.getLettersInOrder(letters);

        assertTrue(this.changeLettersOrderStub.called);
    }
});

TestCase("[Hangman] Change letters order", {
    setUp: function () {
        this.presenter = AddonHangman_create();
        this.presenter.configuration = {
            keyboardLettersOrder: []
        };
    },

    'test order should change letters and add all missing letters when letters is empty': function () {
        this.presenter.configuration.keyboardLettersOrder = ['C', 'A', 'B', 'D'];

        var expectedResult = ['C', 'A', 'B', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
        'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        var validationResult = this.presenter.changeLettersOrder(this.presenter.DEFAULT_LETTERS);

        assertEquals(expectedResult, validationResult);
    },

    'test order should change letters and add only rest of letters': function () {
        this.presenter.configuration.keyboardLettersOrder = ['A', 'E', 'C', 'D'];

        var expectedResult = ['A', 'E', 'C', 'B'];

        var validationResult = this.presenter.changeLettersOrder(['A', 'C', 'E', 'B']);

        assertEquals(expectedResult, validationResult);
    },

    'test letters outside of custom keyboard letter order, should be alphatebically': function () {
        this.presenter.configuration.keyboardLettersOrder = ['D', 'E', 'F'];

        var expectedResult = ['A', 'B', 'C'];

        var validationResult = this.presenter.changeLettersOrder(['A', 'B', 'C']);

        assertEquals(expectedResult, validationResult);
    }
});