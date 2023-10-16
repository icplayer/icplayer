TestCase("[Crossword] Word validation tests", {
    setUp: function () {
        this.presenter = Addoncrossword_create();
    },

    'test given word coordinates and letter from the word when letterIsInWord was called should return true': function () {
        const startPoint = '2:2';
        const endPoints = '2:4';
        const letterPosition = {x:2, y:4};

        const result = this.presenter.letterIsInWord(startPoint, endPoints, letterPosition);

        assertTrue(result);
    },

    'test given word coordinates and letter from outside the word when letterIsInWord was called should return false': function () {
        const startPoint = '2:2';
        const endPoints = '2:4';
        const letterPosition = {x:2, y:5};

        const result = this.presenter.letterIsInWord(startPoint, endPoints, letterPosition);

        assertFalse(result);
    }
});