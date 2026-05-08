TestCase("[Text_Coloring] Parse text with Alt Text - ALL_SELECTABLE mode", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();
    },

    'test single word wrapped with alt text should produce one word token': function () {
        const text = "\\alt{word|alternative text}";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{word|alternative text}")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test single word wrapped with alt text with land definition should produce one word token': function () {
        const text = "\\alt{word|alternative text}[lang en]";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{word|alternative text}[lang en]")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test inline LaTeX expression wrapped with alt text should produce one word token': function () {
        const text = "\\alt{\\(H^+\\)|hydrogen ion}";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{\\(H^+\\)|hydrogen ion}")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test inline LaTeX expression 2 wrapped with alt text should produce one word token': function () {
        const text = "\\alt{\\(\\sqrt{1 + \\frac{1}{2}}\\)|math equation}";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{\\(\\sqrt{1 + \\frac{1}{2}}\\)|math equation}")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test inline LaTeX expression wrapped with alt text with lang definition should produce one word token': function () {
        const text = "\\alt{\\(H^+\\)|hydrogen ion}[lang en]";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{\\(H^+\\)|hydrogen ion}[lang en]")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test alt text preceded by word should produce word token space and word token': function () {
        const text = "Calculate \\alt{\\(H^+\\)|hydrogen ion}";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getWordToken("Calculate"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("\\alt{\\(H^+\\)|hydrogen ion}")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },
    
    'test alt text with lang definition preceded by word should produce word token space and word token': function () {
        const text = "Calculate \\alt{\\(H^+\\)|hydrogen ion}[lang en]";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getWordToken("Calculate"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("\\alt{\\(H^+\\)|hydrogen ion}[lang en]")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test selectable single word with alt text with lang definition should produce selectable token with alt text in value': function () {
        const text = "\\color{red}{\\alt{word|alternative text}[lang en]}";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getSelectableToken("\\alt{word|alternative text}[lang en]", "red")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test multiple alt texts should produce word space word tokens': function () {
        const text = "\\alt{first|alt one} \\alt{second|alt two}";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{first|alt one}"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("\\alt{second|alt two}")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },
    
    'test multiple alt texts with lang definition should produce word space word tokens': function () {
        const text = "\\alt{first|alt one}[lang en] \\alt{second|alt two}[lang pl]";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{first|alt one}[lang en]"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("\\alt{second|alt two}[lang pl]")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    // Complex cases

    'test selectable word with alt text wrapping LaTeX should produce selectable token with alt text wrapping LaTeX in value': function () {
        const text = "\\color{red}{\\alt{\\(H^+\\)|hydrogen ion}}";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getSelectableToken("\\alt{\\(H^+\\)|hydrogen ion}", "red")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test block LaTeX wrapped with alt text should produce one word token': function () {
        const text = "\\alt{\\[ x + y \\]|x plus y}";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{\\[ x + y \\]|x plus y}")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test sentence with word selectable and alt text tokens should produce correct token sequence': function () {
        const text = "The \\color{red}{ion} is \\alt{\\(H^+\\)|hydrogen ion}";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getWordToken("The"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getSelectableToken("ion", "red"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("is"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("\\alt{\\(H^+\\)|hydrogen ion}")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test sentence with multiple selectable tokens and alt texts should produce correct token sequence': function () {
        const text = "\\alt{\\(H^+\\)|hydrogen ion}[lang en] reacts with \\color{blue}{\\alt{\\(OH^-\\)|hydroxide ion}[lang en]}";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{\\(H^+\\)|hydrogen ion}[lang en]"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("reacts"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("with"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getSelectableToken("\\alt{\\(OH^-\\)|hydroxide ion}[lang en]", "blue")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test sentence with plain word alt text word selectable and plain word should produce correct token sequence': function () {
        const text = "\\alt{Calculate|oblicz} \\color{red}{result} carefully";
        const mode = "ALL_SELECTABLE";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{Calculate|oblicz}"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getSelectableToken("result", "red"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("carefully")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    }
});

TestCase("[Text_Coloring] Parse text with Alt Text - MARK_PHRASES mode", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();
    },

    'test single word wrapped with alt text should produce one word token': function () {
        const text = "\\alt{LaTeX|Latech}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{LaTeX|Latech}")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test single word wrapped with alt text with two words should produce one word token': function () {
        const text = "\\alt{word|alternative text}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{word|alternative text}")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },
    
    'test single word wrapped with alt text with lang definition should produce one word token': function () {
        const text = "\\alt{word|alternative text}[lang en]";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{word|alternative text}[lang en]")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test multi-word phrase wrapped with alt text should produce one atomic word token': function () {
        const text = "\\alt{two words|alternative text}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{two words|alternative text}")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },
    
    'test multi-word phrase wrapped with alt text with lang definition should produce one atomic word token': function () {
        const text = "\\alt{two words|alternative text}[lang pl]";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{two words|alternative text}[lang pl]")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test selectable phrase with alt text should produce selectable token with alt text in value': function () {
        const text = "\\color{red}{\\alt{Red phrase|alternative text}}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getSelectableToken("\\alt{Red phrase|alternative text}", "red")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },
    
    'test selectable phrase with alt text with lang definition should produce selectable token with alt text in value': function () {
        const text = "\\color{red}{\\alt{Red phrase|alternative text}[lang pl]}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getSelectableToken("\\alt{Red phrase|alternative text}[lang pl]", "red")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test intruder phrase with alt text should produce intruder token with alt text in value': function () {
        const text = "\\intruder{\\alt{Intruder phrase|alternative text}}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getIntruderToken("\\alt{Intruder phrase|alternative text}")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },
    
    'test intruder phrase with alt text with lang definition should produce intruder token with alt text in value': function () {
        const text = "\\intruder{\\alt{Intruder phrase|alternative text}[lang en]}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getIntruderToken("\\alt{Intruder phrase|alternative text}[lang en]")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test alt text preceded by word should produce word token space and word token': function () {
        const text = "Some \\alt{two words|alternative text}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getWordToken("Some"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("\\alt{two words|alternative text}")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test selectable phrase with alt text followed by word should produce selectable token and word token': function () {
        const text = "\\color{red}{\\alt{Red phrase|alt}} end";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getSelectableToken("\\alt{Red phrase|alt}", "red"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("end")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    // LaTeX in MARK_PHRASES

    'test inline LaTeX wrapped with alt text should produce one word token': function () {
        const text = "\\alt{\\(H^+\\)|hydrogen ion}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{\\(H^+\\)|hydrogen ion}")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test inline complex LaTeX wrapped with alt text should produce one word token': function () {
        const text = "\\alt{\\(\\sqrt{1 + \\frac{1}{2}}\\)|math equation}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{\\(\\sqrt{1 + \\frac{1}{2}}\\)|math equation}")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test inline LaTeX wrapped with alt text with lang definition should produce one word token': function () {
        const text = "\\alt{\\(H^+\\)|hydrogen ion}[lang en]";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{\\(H^+\\)|hydrogen ion}[lang en]")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test selectable LaTeX wrapped with alt text should produce selectable token with alt text in value': function () {
        const text = "\\color{red}{\\alt{\\(H^+\\)|hydrogen ion}}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getSelectableToken("\\alt{\\(H^+\\)|hydrogen ion}", "red")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test intruder LaTeX wrapped with alt text should produce intruder token with alt text in value': function () {
        const text = "\\intruder{\\alt{\\(H^+\\)|hydrogen ion}}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getIntruderToken("\\alt{\\(H^+\\)|hydrogen ion}")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    // Complex combined cases

    'test selectable token containing alt text followed by LaTeX should produce selectable token with both in value': function () {
        const text = "\\color{red}{\\alt{phrase|alt text} \\(x^2\\)}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getSelectableToken("\\alt{phrase|alt text} \\(x^2\\)", "red")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test selectable token containing LaTeX followed by alt text should produce selectable token with both in value': function () {
        const text = "\\color{red}{\\(x^2\\) \\alt{equals x squared|x do kwadratu}}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getSelectableToken("\\(x^2\\) \\alt{equals x squared|x do kwadratu}", "red")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test selectable token containing alt text wrapping LaTeX should produce selectable token with alt text in value': function () {
        const text = "\\color{red}{\\alt{\\(H^+\\)|hydrogen ion}}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getSelectableToken("\\alt{\\(H^+\\)|hydrogen ion}", "red")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test intruder token containing alt text wrapping LaTeX should produce intruder token with alt text in value': function () {
        const text = "\\intruder{\\alt{\\(H^+\\)|hydrogen ion}}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getIntruderToken("\\alt{\\(H^+\\)|hydrogen ion}")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test mixed selectable and word tokens with alt texts and LaTeX should produce correct token sequence': function () {
        const text = "\\color{red}{\\alt{\\(H^+\\)|hydrogen ion}} reacts with \\alt{\\(OH^-\\)|hydroxide ion}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getSelectableToken("\\alt{\\(H^+\\)|hydrogen ion}", "red"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("reacts"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("with"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("\\alt{\\(OH^-\\)|hydroxide ion}")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test selectable token with alt text with lang definition followed by intruder with alt text should produce correct token sequence': function () {
        const text = "\\color{red}{\\alt{correct answer|prawidłowa odpowiedź}[lang pl]} \\intruder{\\alt{wrong answer|błędna odpowiedź}[lang pl]}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getSelectableToken("\\alt{correct answer|prawidłowa odpowiedź}[lang pl]", "red"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getIntruderToken("\\alt{wrong answer|błędna odpowiedź}[lang pl]")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    // Word tokens with alt text

    'test sentence with word tokens where some have alt text should produce correct token sequence': function () {
        const text = "\\alt{word|alternative} plain \\alt{\\(H^+\\)|hydrogen ion}[lang en]";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{word|alternative}"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("plain"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("\\alt{\\(H^+\\)|hydrogen ion}[lang en]")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test sentence with word token with alt text between selectable tokens should produce correct token sequence': function () {
        const text = "\\color{red}{phrase one} \\alt{and|oraz}[lang pl] \\color{red}{phrase two}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getSelectableToken("phrase one", "red"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("\\alt{and|oraz}[lang pl]"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getSelectableToken("phrase two", "red")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    // Multi-word alt text as word token - allowed in MARK_PHRASES

    'test multi-word alt text as standalone word token should produce one atomic word token': function () {
        // In MARK_PHRASES, \alt{...} is always atomic - multiple words inside are allowed for standalone word tokens
        const text = "\\alt{two words|alternative text}";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{two words|alternative text}")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test multi-word alt text word token surrounded by plain words should produce correct token sequence': function () {
        const text = "before \\alt{two words|alternative text} after";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getWordToken("before"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("\\alt{two words|alternative text}"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("after")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    },

    'test multiple multi-word alt text word tokens should produce word space word tokens': function () {
        const text = "\\alt{first phrase|alt one}[lang en] \\alt{second phrase|alt two}[lang pl]";
        const mode = "MARK_PHRASES";
        const expectedTokens = [
            setUpUtils.getWordToken("\\alt{first phrase|alt one}[lang en]"),
            setUpUtils.getSpaceToken(),
            setUpUtils.getWordToken("\\alt{second phrase|alt two}[lang pl]")
        ];

        const result = this.presenter.parseText(text, mode);

        assertEquals(expectedTokens, result);
    }
});

TestCase("[Text_Coloring] Validate model - Alt Text in ALL_SELECTABLE mode", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();
        this.presenter.validateColors = function () {
            return { isValid: true, value: [{id: "red", color: "#FF0000", description: "Red"}], isError: false };
        };
    },

    'test single word wrapped with alt text should be valid': function () {
        const model = {
            text: "\\alt{word|alternative text}",
            colors: [],
            Mode: "All selectable",
            isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isValid);
        assertFalse(result.isError);
    },

    'test inline LaTeX expression wrapped with alt text should be valid': function () {
        const model = {
            text: "\\alt{\\(H^+\\)|hydrogen ion}",
            colors: [],
            Mode: "All selectable",
            isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isValid);
        assertFalse(result.isError);
    },

    'test multiple single-word alt texts should be valid': function () {
        const model = {
            text: "\\alt{first|alt one} and \\alt{second|alt two}",
            colors: [],
            Mode: "All selectable",
            isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isValid);
        assertFalse(result.isError);
    },

    'test selectable single word with alt text should be valid': function () {
        const model = {
            text: "\\color{red}{\\alt{word|alternative text}}",
            colors: [],
            Mode: "All selectable",
            isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isValid);
        assertFalse(result.isError);
    },

    'test two words wrapped with single alt text should return error': function () {
        const model = {
            text: "\\alt{two words|alternative text}",
            colors: [],
            Mode: "All selectable",
            isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isError);
        assertEquals("TC_TEXT_ALT_TEXT_COVERS_MULTIPLE_TOKENS", result.errorCode);
    },

    'test three words wrapped with single alt text should return error': function () {
        const model = {
            text: "\\alt{one two three|alternative text}",
            colors: [],
            Mode: "All selectable",
            isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isError);
        assertEquals("TC_TEXT_ALT_TEXT_COVERS_MULTIPLE_TOKENS", result.errorCode);
    },

    'test one valid and one invalid alt text should return error': function () {
        const model = {
            text: "\\alt{word|valid} and \\alt{two words|invalid}",
            colors: [],
            Mode: "All selectable",
            isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isError);
        assertEquals("TC_TEXT_ALT_TEXT_COVERS_MULTIPLE_TOKENS", result.errorCode);
    },

    'test selectable multi-word phrase with alt text should return error': function () {
        const model = {
            text: "\\color{red}{\\alt{two words|alternative text}}",
            colors: [],
            Mode: "All selectable",
            isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isError);
        assertEquals("TC_TEXT_ALT_TEXT_COVERS_MULTIPLE_TOKENS", result.errorCode);
    },

    'test non selectable multi-word phrase with alt text should return error': function () {
        const model = {
            text: "\\alt{\\(\\sqrt{1+\\frac{1}{2}}\\ is)|math equation is}[lang en]",
            colors: [],
            Mode: "All selectable",
            isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isError);
        assertEquals("TC_TEXT_ALT_TEXT_COVERS_MULTIPLE_TOKENS", result.errorCode);
    },

    'test selectable multi-word phrase 2 with alt text should return error': function () {
        const model = {
            text: "\\color{red}{\\alt{\\(\\sqrt{1+\\frac{1}{2}}\\ is)|math equation is}[lang en]}",
            colors: [],
            Mode: "All selectable",
            isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isError);
        assertEquals("TC_TEXT_ALT_TEXT_COVERS_MULTIPLE_TOKENS", result.errorCode);
    }
});

TestCase("[Text_Coloring] Validate model - Alt Text in MARK_PHRASES mode", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();
        this.presenter.validateColors = function () {
            return { isValid: true, value: [{id: "red", color: "#FF0000", description: "Red"}], isError: false };
        };
    },

    'test single word wrapped with alt text should be valid': function () {
        const model = {
            text: "\\alt{word|alternative text}",
            colors: [],
            Mode: "Mark phrases to select",
            isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isValid);
        assertFalse(result.isError);
    },

    'test multi-word phrase wrapped with alt text should be valid': function () {
        const model = {
            text: "\\alt{two words|alternative text}",
            colors: [],
            Mode: "Mark phrases to select",
            isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isValid);
        assertFalse(result.isError);
    },

    'test selectable phrase with multi-word alt text should be valid': function () {
        const model = {
            text: "\\color{red}{\\alt{Red phrase|alternative text}}",
            colors: [],
            Mode: "Mark phrases to select",
            isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isValid);
        assertFalse(result.isError);
    },

    'test intruder phrase with multi-word alt text should be valid': function () {
        const model = {
            text: "\\intruder{\\alt{Intruder phrase|alternative text}}",
            colors: [],
            Mode: "Mark phrases to select",
            isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isValid);
        assertFalse(result.isError);
    },

    'test mixed selectable and intruder phrases with alt texts should be valid': function () {
        const model = {
            text: "\\color{red}{\\alt{Red phrase|alt one}} \\intruder{\\alt{Wrong phrase|alt two}}",
            colors: [],
            Mode: "Mark phrases to select",
            isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isValid);
        assertFalse(result.isError);
    },

    'test inline LaTeX expression wrapped with alt text should be valid': function () {
        const model = {
            text: "\\alt{\\(H^+\\)|hydrogen ion}",
            colors: [],
            Mode: "Mark phrases to select",
            isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isValid);
        assertFalse(result.isError);
    }
});

TestCase("[Text_Coloring] Validate model - Alt Text wrapping color or intruder", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();
        this.presenter.validateColors = function () {
            return { isValid: true, value: [{id: "red", color: "#FF0000", description: "Red"}], isError: false };
        };
    },

    'test alt text inside color should be valid': function () {
        const model = {
            text: "\\color{red}{\\alt{phrase|alternative}}",
            colors: [], Mode: "Mark phrases to select", isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isValid);
        assertFalse(result.isError);
    },

    'test alt text inside intruder should be valid': function () {
        const model = {
            text: "\\intruder{\\alt{phrase|alternative}}",
            colors: [], Mode: "Mark phrases to select", isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isValid);
        assertFalse(result.isError);
    },

    'test alt text on plain word should be valid': function () {
        const model = {
            text: "\\alt{word|alternative}",
            colors: [], Mode: "All selectable", isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isValid);
        assertFalse(result.isError);
    },

    'test alt text on LaTeX should be valid': function () {
        const model = {
            text: "\\alt{\\(H^+\\)|hydrogen ion}",
            colors: [], Mode: "All selectable", isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isValid);
        assertFalse(result.isError);
    },

    'test alt text wrapping color should return error': function () {
        const model = {
            text: "\\alt{\\color{red}{phrase}|alternative}",
            colors: [], Mode: "All selectable", isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isError);
        assertEquals("TC_TEXT_ALT_TEXT_WRAPS_COLOR_OR_INTRUDER", result.errorCode);
    },

    'test alt text wrapping intruder should return error': function () {
        const model = {
            text: "\\alt{\\intruder{phrase}|alternative}",
            colors: [], Mode: "Mark phrases to select", isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isError);
        assertEquals("TC_TEXT_ALT_TEXT_WRAPS_COLOR_OR_INTRUDER", result.errorCode);
    },

    'test alt text wrapping intruder should return error 2': function () {
        const model = {
            text: "\\alt{\\intruder{\\(\\sqrt{1+\\frac{1}{2}}\\ is)}|math equation is}[lang en]",
            colors: [], Mode: "Mark phrases to select", isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isError);
        assertEquals("TC_TEXT_ALT_TEXT_WRAPS_COLOR_OR_INTRUDER", result.errorCode);
    },

    'test alt text wrapping color in MARK_PHRASES mode should return error': function () {
        const model = {
            text: "\\alt{\\color{red}{phrase}|alternative}",
            colors: [], Mode: "Mark phrases to select", isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isError);
        assertEquals("TC_TEXT_ALT_TEXT_WRAPS_COLOR_OR_INTRUDER", result.errorCode);
    },

    'test alt text wrapping color in MARK_PHRASES mode should return error 2': function () {
        const model = {
            text: "\\alt{\\color{red}{\\(\\sqrt{1+\\frac{1}{2}}\\ is)}|math equation is}[lang en]",
            colors: [], Mode: "Mark phrases to select", isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isError);
        assertEquals("TC_TEXT_ALT_TEXT_WRAPS_COLOR_OR_INTRUDER", result.errorCode);
    },

    'test one valid and one invalid alt text wrapping color should return error': function () {
        const model = {
            text: "\\alt{word|valid} and \\alt{\\color{red}{phrase}|invalid}",
            colors: [], Mode: "All selectable", isNotActivity: "False"
        };

        const result = this.presenter.validateModel(model);

        assertTrue(result.isError);
        assertEquals("TC_TEXT_ALT_TEXT_WRAPS_COLOR_OR_INTRUDER", result.errorCode);
    }
});
