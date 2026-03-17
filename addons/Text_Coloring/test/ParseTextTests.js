TestCase("[Text_Coloring] parse text", {

    setUp: function () {
        this.presenter = AddonText_Coloring_create();
    },

    'test parse single word': function () {
        const text = "word";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getWordToken("word")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse single selectable word': function () {
        const text = "\\color{red}{word}";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getSelectableToken("word", "red")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse preceding word and selectable word': function () {
        const text = "precedingWord \\color{red}{word}";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getWordToken("precedingWord"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getSelectableToken("word", "red")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse selectable word and following word': function () {
        const text = "\\color{red}{word} followingWord";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getSelectableToken("word", "red"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getWordToken("followingWord")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse two selectable words': function () {
        const text = "\\color{red}{firstWord} \\color{blue}{secondWord}";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getSelectableToken("firstWord", "red"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getSelectableToken("secondWord", "blue")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse mixed words and selected words': function () {
        const text = "firstWord \\color{blue}{word} secondWord \\color{red}{word} thirdWord";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getWordToken("firstWord"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getSelectableToken("word", "blue"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getWordToken("secondWord"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getSelectableToken("word", "red"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getWordToken("thirdWord")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse word with three selectable characters': function () {
        const text = "firstWord \\color{blue}{w} secondWord \\color{red}{o} \\color{red}{r} thirdWord";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getWordToken("firstWord"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getSelectableToken("w", "blue"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getWordToken("secondWord"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getSelectableToken("o", "red"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getSelectableToken("r", "red"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getWordToken("thirdWord")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse single intruder word': function () {
        const text = "\\intruder{word}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getIntruderToken("word")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse preceding word and intruder word': function () {
        const text = "precedingWord \\intruder{word}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getWordToken("precedingWord"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getIntruderToken("word")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse intruder word and following word': function () {
        const text = "\\intruder{word} followingWord";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getIntruderToken("word"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getWordToken("followingWord")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse two intruder words': function () {
        const text = "\\intruder{firstWord} \\intruder{secondWord}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getIntruderToken("firstWord"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getIntruderToken("secondWord")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse mixed words and intruder words': function () {
        const text = "firstWord \\intruder{word} secondWord \\intruder{word} thirdWord";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getWordToken("firstWord"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getIntruderToken("word"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getWordToken("secondWord"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getIntruderToken("word"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getWordToken("thirdWord")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse mixed words, color words and intruder words': function () {
        const text = "firstWord \\intruder{word} secondWord \\color{red}{word} thirdWord \\intruder{word} fourthWord";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getWordToken("firstWord"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getIntruderToken("word"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getWordToken("secondWord"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getSelectableToken("word", "red"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getWordToken("thirdWord"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getIntruderToken("word"),
            setUpUtils.getSpaceToken("word"),
            setUpUtils.getWordToken("fourthWord")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse selectable LaTeX simple formula': function () {
        const text = "\\color{red}{\\(H^+\\)}";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getSelectableToken("\\(H^+\\)", "red")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse selectable LaTeX chemical formula': function () {
        const text = "\\color{red}{\\(\\ce{H^+}\\)}";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getSelectableToken("\\(\\ce{H^+}\\)", "red")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse selectable LaTeX text formula': function () {
        const text = "\\color{red}{\\(\\text{H}^+\\)}";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getSelectableToken("\\(\\text{H}^+\\)", "red")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse intruder LaTeX simple formula': function () {
        const text = "\\intruder{\\(H^+\\)}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getIntruderToken("\\(H^+\\)")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse intruder LaTeX chemical formula': function () {
        const text = "\\intruder{\\(\\ce{H^+}\\)}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getIntruderToken("\\(\\ce{H^+}\\)")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse intruder LaTeX text formula': function () {
        const text = "\\intruder{\\(\\text{H}^+\\)}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getIntruderToken("\\(\\text{H}^+\\)")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse complex LaTeX formula 1 (Continued Fraction)': function () {
        // \color{red}{\(\phi = 1 + \frac{1}{1 + \frac{1}{1 + \frac{1}{1 + \frac{1}{1 + \dots}}}}\)}
        const text = "\\color{red}{\\(\\phi = 1 + \\frac{1}{1 + \\frac{1}{1 + \\frac{1}{1 + \\frac{1}{1 + \\dots}}}}\\)}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getSelectableToken("\\(\\phi = 1 + \\frac{1}{1 + \\frac{1}{1 + \\frac{1}{1 + \\frac{1}{1 + \\dots}}}}\\)", "red")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse complex LaTeX formula 2 (Integral)': function () {
        // \color{red}{\(\int_{0}^{\infty} \frac{x^{s-1}}{e^x - 1} dx = \Gamma(s) \sum_{n=1}^{\infty} \left( \frac{1}{n^s} \right) = \zeta(s) \Gamma(s)\)}
        const text = "\\color{red}{\\(\\int_{0}^{\\infty} \\frac{x^{s-1}}{e^x - 1} dx = \\Gamma(s) \\sum_{n=1}^{\\infty} \\left( \\frac{1}{n^s} \\right) = \\zeta(s) \\Gamma(s)\\)}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getSelectableToken("\\(\\int_{0}^{\\infty} \\frac{x^{s-1}}{e^x - 1} dx = \\Gamma(s) \\sum_{n=1}^{\\infty} \\left( \\frac{1}{n^s} \\right) = \\zeta(s) \\Gamma(s)\\)", "red")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse complex LaTeX formula 3 (Chemistry)': function () {
        // \color{red}{\(\ce{2MnO4^- + 5C2O4^{2-} + 16H^+ ->[T > 60^\circ C] 2Mn^{2+} + 10CO2 ^ + 8H2O}\)}
        const text = "\\color{red}{\\(\\ce{2MnO4^- + 5C2O4^{2-} + 16H^+ ->[T > 60^\\circ C] 2Mn^{2+} + 10CO2 ^ + 8H2O}\\)}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getSelectableToken("\\(\\ce{2MnO4^- + 5C2O4^{2-} + 16H^+ ->[T > 60^\\circ C] 2Mn^{2+} + 10CO2 ^ + 8H2O}\\)", "red")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse complex LaTeX formula 4 (Sqrt)': function () {
        // \color{red}{\(\sqrt{1+\frac{1}{2}}\)}
        const text = "\\color{red}{\\(\\sqrt{1+\\frac{1}{2}}\\)}";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getSelectableToken("\\(\\sqrt{1+\\frac{1}{2}}\\)", "red")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse intruder complex LaTeX formula 1': function () {
        const text = "\\intruder{\\(\\phi = 1 + \\frac{1}{1 + \\frac{1}{1 + \\frac{1}{1 + \\frac{1}{1 + \\dots}}}}\\)}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getIntruderToken("\\(\\phi = 1 + \\frac{1}{1 + \\frac{1}{1 + \\frac{1}{1 + \\frac{1}{1 + \\dots}}}}\\)")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse intruder complex LaTeX formula 2': function () {
        const text = "\\intruder{\\(\\int_{0}^{\\infty} \\frac{x^{s-1}}{e^x - 1} dx = \\Gamma(s) \\sum_{n=1}^{\\infty} \\left( \\frac{1}{n^s} \\right) = \\zeta(s) \\Gamma(s)\\)}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getIntruderToken("\\(\\int_{0}^{\\infty} \\frac{x^{s-1}}{e^x - 1} dx = \\Gamma(s) \\sum_{n=1}^{\\infty} \\left( \\frac{1}{n^s} \\right) = \\zeta(s) \\Gamma(s)\\)")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse intruder complex LaTeX formula 3': function () {
        const text = "\\intruder{\\(\\ce{2MnO4^- + 5C2O4^{2-} + 16H^+ ->[T > 60^\\circ C] 2Mn^{2+} + 10CO2 ^ + 8H2O}\\)}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getIntruderToken("\\(\\ce{2MnO4^- + 5C2O4^{2-} + 16H^+ ->[T > 60^\\circ C] 2Mn^{2+} + 10CO2 ^ + 8H2O}\\)")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse intruder complex LaTeX formula 4': function () {
        const text = "\\intruder{\\(\\sqrt{1+\\frac{1}{2}}\\)}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getIntruderToken("\\(\\sqrt{1+\\frac{1}{2}}\\)")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse sentence with latex formula - ALL_SELECTABLE (Broken)': function () {
        const text = "Calculate \\( 2 + 2 \\) now";
        const mode = "ALL_SELECTABLE";
        // In ALL_SELECTABLE mode, spaces cause splitting, breaking the LaTeX formula tokens.
        const expectedTokens = [
            setUpUtils.getWordToken("Calculate"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("\\("),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("2"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("+"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("2"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("\\)"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("now")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse colored latex with spaces - ALL_SELECTABLE (Broken)': function () {
        const text = "\\color{red}{\\( x + y \\)}";
        const mode = "ALL_SELECTABLE";
        // In ALL_SELECTABLE mode, even colored phrases are split by spaces if they contain them.
        const expectedTokens = [
            setUpUtils.getWordToken("\\color{red}{\\("),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("x"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("+"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("y"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("\\)}")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test parse multiple latex formulas - ALL_SELECTABLE (Broken)': function () {
        const text = "If \\( x = 2 \\) and \\( y = 3 \\)";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getWordToken("If"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("\\("),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("x"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("="),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("2"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("\\)"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("and"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("\\("),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("y"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("="),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("3"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("\\)")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    }
});
