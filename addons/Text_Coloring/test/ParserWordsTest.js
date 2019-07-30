TestCase("[Text_Coloring] parse words", {

    setUp: function () {
        this.presenter = AddonText_Coloring_create();
    },

    'test should parse single word': function () {
        // arrange
        var wordToParse = "word";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getWordToken("word"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse single selectable word': function () {
        // arrange
        var wordToParse = "\\color{red}{word}";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getSelectableToken("word", "red"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse preceding word and selectable word glued to each other': function () {
        // arrange
        var wordToParse = "precedingWord\\color{red}{word}";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getWordToken("precedingWord"));
        expectedResult.push(setUpUtils.getSelectableToken("word", "red"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse selectable word and following word glued to each other': function () {
        // arrange
        var wordToParse = "\\color{red}{word}followingWord";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getSelectableToken("word", "red"));
        expectedResult.push(setUpUtils.getWordToken("followingWord"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse two selectable words glued to each other': function () {
        // arrange
        var wordToParse = "\\color{red}{firstWord}\\color{blue}{secondWord}";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getSelectableToken("firstWord", "red"));
        expectedResult.push(setUpUtils.getSelectableToken("secondWord", "blue"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse);

        // assert
        assertEquals(expectedResult, result);
    },

    'test should parse mixed words and selected words glued to each other': function () {
        // arrange
        var wordToParse = "firstWord\\color{blue}{word}secondWord\\color{red}{word}thirdWord";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getWordToken("firstWord"));
        expectedResult.push(setUpUtils.getSelectableToken("word", "blue"));
        expectedResult.push(setUpUtils.getWordToken("secondWord"));
        expectedResult.push(setUpUtils.getSelectableToken("word", "red"));
        expectedResult.push(setUpUtils.getWordToken("thirdWord"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse);

        // assert
        assertEquals(expectedResult, result);
    },

    'test parse word with three selectable characters': function () {
        // arrange
        var wordToParse = "firstWord\\color{blue}{w}secondWord\\color{red}{o}\\color{red}{r}thirdWord";

        var expectedResult = [];
        expectedResult.push(setUpUtils.getWordToken("firstWord"));
        expectedResult.push(setUpUtils.getSelectableToken("w", "blue"));
        expectedResult.push(setUpUtils.getWordToken("secondWord"));
        expectedResult.push(setUpUtils.getSelectableToken("o", "red"));
        expectedResult.push(setUpUtils.getSelectableToken("r", "red"));
        expectedResult.push(setUpUtils.getWordToken("thirdWord"));
        expectedResult.push(setUpUtils.getSpaceToken());

        // act
        var result = this.presenter.parseWords(wordToParse);

        // assert
        assertEquals(expectedResult, result);
    }
});