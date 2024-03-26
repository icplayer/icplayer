TestCase("[Text_Coloring] block html escape - code freeze", {

    setUp: function () {
        this.presenter = AddonText_Coloring_create();
        this.mode = "ALL_SELECTABLE";
    },

    'test should parse less-than sign': function () {
        // arrange
        var wordToParse = "<";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getWordToken("<"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse, this.mode);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse greater-than sign': function () {
        // arrange
        var wordToParse = ">";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getWordToken(">"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse, this.mode);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse signs combinations': function () {
        // arrange
        var wordToParse = "<>";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getWordToken("<>"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse, this.mode);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse reverse of signs combinations': function () {
        // arrange
        var wordToParse = "><";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getWordToken("><"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse syntax of bold text': function () {
        // arrange
        var wordToParse = "<strong>word</strong>";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getWordToken("<strong>word</strong>"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse, this.mode);

        // assert
        assertEquals(expectedResult, result);
    }
});
