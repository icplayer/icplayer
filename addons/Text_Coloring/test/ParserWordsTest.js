TestCase("[Text_Coloring] parse words", {

    setUp: function () {
        this.presenter = AddonText_Coloring_create();
    },

    'test should parse single word': function () {
        // arrange
        var wordToParse = "word";
        var mode = "ALL_SELECTABLE";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getWordToken("word"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse, mode);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse single selectable word': function () {
        // arrange
        var wordToParse = "\\color{red}{word}";
        var mode = "ALL_SELECTABLE";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getSelectableToken("word", "red"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse, mode);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse preceding word and selectable word glued to each other': function () {
        // arrange
        var wordToParse = "precedingWord\\color{red}{word}";
        var mode = "ALL_SELECTABLE";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getWordToken("precedingWord"));
        expectedResult.push(setUpUtils.getSelectableToken("word", "red"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse, mode);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse selectable word and following word glued to each other': function () {
        // arrange
        var wordToParse = "\\color{red}{word}followingWord";
        var mode = "ALL_SELECTABLE";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getSelectableToken("word", "red"));
        expectedResult.push(setUpUtils.getWordToken("followingWord"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse, mode);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse two selectable words glued to each other': function () {
        // arrange
        var wordToParse = "\\color{red}{firstWord}\\color{blue}{secondWord}";
        var mode = "ALL_SELECTABLE";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getSelectableToken("firstWord", "red"));
        expectedResult.push(setUpUtils.getSelectableToken("secondWord", "blue"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse, mode);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse mixed words and selected words glued to each other': function () {
        // arrange
        var wordToParse = "firstWord\\color{blue}{word}secondWord\\color{red}{word}thirdWord";
        var mode = "ALL_SELECTABLE";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getWordToken("firstWord"));
        expectedResult.push(setUpUtils.getSelectableToken("word", "blue"));
        expectedResult.push(setUpUtils.getWordToken("secondWord"));
        expectedResult.push(setUpUtils.getSelectableToken("word", "red"));
        expectedResult.push(setUpUtils.getWordToken("thirdWord"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse, mode);

        // assert
        assertEquals(expectedResult, result);
    },

    'test parse word with three selectable characters': function () {
        // arrange
        var wordToParse = "firstWord\\color{blue}{w}secondWord\\color{red}{o}\\color{red}{r}thirdWord";
        var mode = "ALL_SELECTABLE";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getWordToken("firstWord"));
        expectedResult.push(setUpUtils.getSelectableToken("w", "blue"));
        expectedResult.push(setUpUtils.getWordToken("secondWord"));
        expectedResult.push(setUpUtils.getSelectableToken("o", "red"));
        expectedResult.push(setUpUtils.getSelectableToken("r", "red"));
        expectedResult.push(setUpUtils.getWordToken("thirdWord"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse, mode);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse single intruder word': function () {
        // arrange
        var wordToParse = "\\intruder{word}";
        var mode = "MARK_PHRASES";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getIntruderToken("word"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse, mode);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse preceding word and intruder word glued to each other': function () {
        // arrange
        var wordToParse = "precedingWord\\intruder{word}";
        var mode = "MARK_PHRASES";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getWordToken("precedingWord"));
        expectedResult.push(setUpUtils.getIntruderToken("word"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse, mode);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse intruder word and following word glued to each other': function () {
        // arrange
        var wordToParse = "\\intruder{word}followingWord";
        var mode = "MARK_PHRASES";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getIntruderToken("word", "red"));
        expectedResult.push(setUpUtils.getWordToken("followingWord"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse, mode);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse two intruder words glued to each other': function () {
        // arrange
        var wordToParse = "\\intruder{firstWord}\\intruder{secondWord}";
        var mode = "MARK_PHRASES";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getIntruderToken("firstWord"));
        expectedResult.push(setUpUtils.getIntruderToken("secondWord"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse, mode);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse mixed words and intruder words glued to each other': function () {
        // arrange
        var wordToParse = "firstWord\\intruder{word}secondWord\\intruder{word}thirdWord";
        var mode = "MARK_PHRASES";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getWordToken("firstWord"));
        expectedResult.push(setUpUtils.getIntruderToken("word"));
        expectedResult.push(setUpUtils.getWordToken("secondWord"));
        expectedResult.push(setUpUtils.getIntruderToken("word"));
        expectedResult.push(setUpUtils.getWordToken("thirdWord"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse, mode);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse mixed words, color words and intruder words glued to each other': function () {
        // arrange
        var wordToParse = "firstWord\\intruder{word}secondWord\\color{red}{word}thirdWord\\intruder{word}fourthWord";
        var mode = "MARK_PHRASES";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getWordToken("firstWord"));
        expectedResult.push(setUpUtils.getIntruderToken("word"));
        expectedResult.push(setUpUtils.getWordToken("secondWord"));
        expectedResult.push(setUpUtils.getSelectableToken("word", "red"));
        expectedResult.push(setUpUtils.getWordToken("thirdWord"));
        expectedResult.push(setUpUtils.getIntruderToken("word"));
        expectedResult.push(setUpUtils.getWordToken("fourthWord"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse, mode);

        // assert
        assertEquals(expectedResult, result);
    }
});
