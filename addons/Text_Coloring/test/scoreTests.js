TestCase("[Text_Coloring] Score tests", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();
        this.presenter.configuration = {
            isNotActivity: false
        };
    },

    setUpConfigurationWithColorTokens: function () {
        const tokens = [];
        tokens.push(setUpUtils.getWordToken("precedingWord")); // 0
        tokens.push(setUpUtils.getSpaceToken());
        tokens.push(setUpUtils.getSelectableToken("Some text 1", "red")); // 1
        tokens.push(setUpUtils.getSpaceToken());
        tokens.push(setUpUtils.getSelectableToken("Some text 2", "red")); // 2
        tokens.push(setUpUtils.getSpaceToken());
        tokens.push(setUpUtils.getSelectableToken("Some text 3", "red")); // 3
        tokens.push(setUpUtils.getSpaceToken());
        tokens.push(setUpUtils.getWordToken("followingWord")); // 4
        this.presenter.configuration.textTokens = tokens;
        this.presenter.setFilteredTokensData();

        this.presenter.configuration.filteredTokens.filter((token) => !!token.color).forEach((token) => {
            token.color = "green";
        });
    },

    setUpConfigurationWithColorAndIntruderTokens: function () {
        this.setUpConfigurationWithColorTokens();
        const tokens = this.presenter.configuration.textTokens;
        tokens.push(setUpUtils.getSpaceToken());
        tokens.push(setUpUtils.getIntruderToken("Some text 4")); // 5
        tokens.push(setUpUtils.getSpaceToken());
        tokens.push(setUpUtils.getIntruderToken("Some text 5")); // 6
        this.presenter.configuration.textTokens = tokens;
        this.presenter.setFilteredTokensData();

        this.presenter.configuration.filteredTokens.filter((token) => !!token.color).forEach((token) => {
            token.color = "green";
        });
    },

    selectFilteredToken: function (id) {
        this.presenter.configuration.filteredTokens[id].isSelected = true;
    },

    selectSelectableTokenAsCorrect: function (id) {
        this.selectFilteredToken(id);
        this.presenter.configuration.filteredTokens[id].selectionColorID = "green";
    },

    selectSelectableTokenAsWrong: function (id) {
        this.selectFilteredToken(id);
        this.presenter.configuration.filteredTokens[id].selectionColorID = "red";
    },

    'test given 3 selectable tokens, when calling getMaxScore, then return 3': function () {
        this.setUpConfigurationWithColorTokens();

        const result = this.presenter.getMaxScore();

        assertEquals(3, result);
    },

    'test given 3 selectable tokens, 2 selected and only 1 selected correctly when calling getErrorCount, then return 1': function () {
        this.setUpConfigurationWithColorTokens();
        this.selectSelectableTokenAsCorrect(1);
        this.selectSelectableTokenAsWrong(2);

        const result = this.presenter.getErrorCount();

        assertEquals(1, result);
    },

    'test given 3 selectable tokens, 5 selected and only 1 selected correctly when calling getErrorCount, then return 4': function () {
        this.setUpConfigurationWithColorTokens();
        this.selectFilteredToken(0);
        this.selectSelectableTokenAsCorrect(1);
        this.selectSelectableTokenAsWrong(2);
        this.selectSelectableTokenAsWrong(3);
        this.selectFilteredToken(4);

        const result = this.presenter.getErrorCount();

        assertEquals(4, result);
    },

    'test given 3 selectable tokens, 2 selected and only 1 selected correctly when calling getScore, then return 1': function () {
        this.setUpConfigurationWithColorTokens();
        this.selectSelectableTokenAsCorrect(1);
        this.selectSelectableTokenAsWrong(2);

        const result = this.presenter.getScore();

        assertEquals(1, result);
    },

    'test given 3 selectable tokens, 5 selected and only 1 selected correctly when calling getScore, then return 1': function () {
        this.setUpConfigurationWithColorTokens();
        this.selectFilteredToken(0);
        this.selectSelectableTokenAsCorrect(1);
        this.selectSelectableTokenAsWrong(2);
        this.selectSelectableTokenAsWrong(3);
        this.selectFilteredToken(4);

        const result = this.presenter.getScore();

        assertEquals(1, result);
    },

    'test given 3 selectable tokens and 2 intruder tokens, when calling getMaxScore, then return 3': function () {
        this.setUpConfigurationWithColorAndIntruderTokens();

        const result = this.presenter.getMaxScore();

        assertEquals(3, result);
    },

    'test given 3 selectable tokens, 2 selected words, only 1 selected correctly and 2 intruder tokens, 1 selected when calling getErrorCount, then return 2': function () {
        this.setUpConfigurationWithColorAndIntruderTokens();
        this.selectSelectableTokenAsCorrect(1);
        this.selectSelectableTokenAsWrong(2);
        this.selectFilteredToken(5);

        const result = this.presenter.getErrorCount();

        assertEquals(2, result);
    },

    'test given 3 selectable tokens, 5 selected words, only 1 selected correctly and 2 intruder tokens, 1 selected when calling getErrorCount, then return 5': function () {
        this.setUpConfigurationWithColorAndIntruderTokens();
        this.selectFilteredToken(0);
        this.selectSelectableTokenAsCorrect(1);
        this.selectSelectableTokenAsWrong(2);
        this.selectSelectableTokenAsWrong(3);
        this.selectFilteredToken(4);
        this.selectFilteredToken(5);

        const result = this.presenter.getErrorCount();

        assertEquals(5, result);
    },

    'test given 3 selectable tokens, 2 selected, only 1 selected correctly and 2 intruder tokens, 1 selected when calling getScore, then return 1': function () {
        this.setUpConfigurationWithColorAndIntruderTokens();
        this.selectSelectableTokenAsCorrect(1);
        this.selectSelectableTokenAsWrong(2);
        this.selectFilteredToken(5);

        const result = this.presenter.getScore();

        assertEquals(1, result);
    },

    'test given 3 selectable tokens, 5 selected words, only 1 selected correctly and 2 intruder tokens, 1 selected when calling getScore, then return 5': function () {
        this.setUpConfigurationWithColorAndIntruderTokens();
        this.selectFilteredToken(0);
        this.selectSelectableTokenAsCorrect(1);
        this.selectSelectableTokenAsWrong(2);
        this.selectSelectableTokenAsWrong(3);
        this.selectFilteredToken(4);
        this.selectFilteredToken(5);

        const result = this.presenter.getErrorCount();

        assertEquals(5, result);
    }
});
