TestCase("[Text Selection] Support Functions", {
	setUp: function() {
        this.presenter = AddonText_Selection_create();
    },

    'test is word marked \\correct{}': function() {
    	var word = "\\correct{some_word}";

    	var isMarkedCorrect = this.presenter.isMarkedCorrect(word);

    	assertTrue(isMarkedCorrect);
    },

    'test passed marker is not \\correct': function() {
        var word = "\\corre{some_word}";

        var isMarkedCorrect = this.presenter.isMarkedCorrect(word);

        assertFalse(isMarkedCorrect);
    },

    'test is word marked \\wrong{}': function() {
        var word = "\\wrong{some_word}";

        var isMarkedWrong = this.presenter.isMarkedWrong(word);

        assertTrue(isMarkedWrong);
    },

    'test passed marker is not \\wrong': function() {
        var word = "\\wrang{some_word}";

        var isMarkedWrong = this.presenter.isMarkedWrong(word);

        assertFalse(isMarkedWrong);
    },

    'test cut word marked correct': function() {
        var word = "\\correct{some_word}";

        var cutMarkedCorrect = this.presenter.cutMarkedCorrect(word);

        assertEquals("some_word", cutMarkedCorrect);
    },

    'test cut word marked wrong': function() {
        var word = "\\wrong{some_word}";

        var cutMarkedWrong = this.presenter.cutMarkedWrong(word);

        assertEquals("some_word", cutMarkedWrong);
    },

    'test cut word marked wrong with latex and missing last bracket (spaces inside wrong)': function() {
        var word = "\\wrong{\\(\\sqrt{x^{10}}\\)";

        var cutMarkedWrong = this.presenter.cutMarkedWrong(word);

        assertEquals("\\(\\sqrt{x^{10}}\\)", cutMarkedWrong);
    },

    'test parse Words with no markers': function() {
        var text = "some text";
        var result = this.presenter.parseWords(text, 'ALL_SELECTABLE', 'MULTISELECT');

        assertTrue(result.isValid);
        assertEquals('<div class=\"text_selection\">some text</div>', result.renderedPreview);
        assertEquals('<div class=\"text_selection\"><span class="selectable" number="0">some</span><span left="0" right="1"> </span><span class="selectable" number="1">text</span></div>'.split('').sort().join(''), result.renderedRun.split('').sort().join(''));
    },

    'test parse Words with markers': function() {
        var text = "\\correct{some} \\wrong{text}";
        var result = this.presenter.parseWords(text, 'MARK_PHRASES', 'MULTISELECT');

        assertTrue(result.isValid);
        assertEquals('<div class="text_selection"><span class="correct selectable">some</span> <span class="wrong selectable">text</span></div>', result.renderedPreview);
        assertEquals('<div class="text_selection"><span class="selectable" number="0">some</span><span left="0" right="1"> </span><span class="selectable" number="1">text</span></div>'.split('').sort().join(''), result.renderedRun.split('').sort().join(''));
    },

    'test parse Words with markers with latex': function() {
        var text = "\\wrong{\\(\\sqrt{x^{10}}\\)}";
        var result = this.presenter.parseWords(text, 'MARK_PHRASES', 'MULTISELECT');

        assertTrue(result.isValid);
        assertEquals('<div class="text_selection"><span class="wrong selectable">\\(\\sqrt{x^{10}}\\)</span></div>', result.renderedPreview);
        assertEquals('<div class="text_selection"><span class="selectable" number="0">\\(\\sqrt{x^{10}}\\)</span></div>'.split('').sort().join(''), result.renderedRun.split('').sort().join(''));
    },

    'test parse Words with markers with latex - extra space': function() {
        var text = "\\wrong{\\(\\sqrt{x^{10}}\\) }";
        var result = this.presenter.parseWords(text, 'MARK_PHRASES', 'MULTISELECT');

        assertTrue(result.isValid);
        assertEquals('<div class="text_selection"><span class="wrong selectable">\\(\\sqrt{x^{10}}\\) </span></div>', result.renderedPreview);
        assertEquals('<div class="text_selection"><span class="selectable" number="0">\\(\\sqrt{x^{10}}\\) </span></div>'.split('').sort().join(''), result.renderedRun.split('').sort().join(''));
    },

    'test parse Words with markers with latex - spaces all over the place': function() {
        var text = "\\wrong{ \\(\\sqrt{ {x ^{ 10 } } } \\) }";
        var result = this.presenter.parseWords(text, 'MARK_PHRASES', 'MULTISELECT');

        assertTrue(result.isValid);
        assertEquals('<div class="text_selection"><span class=\"wrong selectable\"> \\(\\sqrt{ {x ^{ 10 } } } \\) </span></div>', result.renderedPreview);
        assertEquals('<div class="text_selection"><span class=\"selectable\" number="0"> \\(\\sqrt{ {x ^{ 10 } } } \\) </span></div>'.split('').sort().join(''), result.renderedRun.split('').sort().join(''));
    },

    'test parse Words with markers with latex - spaces all over the place another example': function() {
        var text = "\\correct{\\(\\frac{ 2 } { \\sqrt{3}}\\)}";
        var result = this.presenter.parseWords(text, 'MARK_PHRASES', 'MULTISELECT');

        assertTrue(result.isValid);
        assertEquals('<div class="text_selection"><span class=\"correct selectable\">\\(\\frac{ 2 } { \\sqrt{3}}\\)</span></div>', result.renderedPreview);
        assertEquals('<div class="text_selection"><span class=\"selectable\" number="0">\\(\\frac{ 2 } { \\sqrt{3}}\\)</span></div>'.split('').sort().join(''), result.renderedRun.split('').sort().join(''));
    },

    'test count brackets': function() {
        var text = "\\wrong{\\(\\sqrt{x^{10}}\\)";
        var result = this.presenter.countBrackets(text);

        assertEquals(3, result.open);
        assertEquals(2, result.close);
    },

    'test multi word but marked only one': function() {
        var text = "\\correct{affection}full";
        var result = this.presenter.parseWords(text, 'MARK_PHRASES', 'MULTISELECT');

        assertTrue(result.isValid);

        assertEquals('<div class="text_selection"><span class="correct selectable">affection</span>full</div>', result.renderedPreview);

        var expectedRun = '<div class="text_selection"><span class="selectable" number="0">affection</span><span number=\"1\">full</span></div>'.split('').sort().join('');
        assertEquals(expectedRun, result.renderedRun.split('').sort().join(''));
    },

    'test word with special sign after marker': function() {
        var text = "\\wrong{super}.";
        var result = this.presenter.parseWords(text, 'MARK_PHRASES', 'MULTISELECT');

        assertTrue(result.isValid);
        assertEquals('<div class="text_selection"><span class="wrong selectable">super</span>.</div>', result.renderedPreview);
        assertEquals('<div class=\"text_selection\"><span class=\"selectable\" number=\"0\">super</span><span left=\"0\" right=\"1\">.</span></div>'.split('').sort().join(''), result.renderedRun.split('').sort().join(''));
    },

    'test single letter': function() {
        var text = "\\correct{a}";
        var result = this.presenter.parseCharacters(text, 'MARK_PHRASES', 'MULTISELECT');

        assertTrue(result.isValid);
        assertEquals('<div class=\"text_selection\"><span class=\"correct selectable\">a</span></div>', result.renderedPreview);
    },

    'test multi letters but marked only one': function() {
        var text = "\\correct{a}full";
        var result = this.presenter.parseCharacters(text, 'MARK_PHRASES', 'MULTISELECT');

        assertEquals('<div class=\"text_selection\"><span class=\"correct selectable\">a</span><span class=\" \">full</span></div>', result.renderedPreview);

    },

    'test parse Letters with no markers': function() {
        var text = "some text";
        var result = this.presenter.parseCharacters(text, 'ALL_SELECTABLE', 'MULTISELECT');

        assertEquals('<div class=\"text_selection\"><span number=\"0\">some text</span></div>', result.renderedPreview);
    },

    'test parse Letters with markers': function() {
        var text = "\\correct{s} \\wrong{t}";
        var result = this.presenter.parseCharacters(text, 'MARK_PHRASES', 'MULTISELECT');

        assertEquals('<div class=\"text_selection\"><span class=\"correct selectable\">s</span><span class=\" \"> </span><span class=\"wrong selectable\">t</span></div>', result.renderedPreview);
    },

    'test parse Letters with markers without spaces': function() {
        var text = "\\correct{s}\\wrong{t}\\correct{b}";
        var result = this.presenter.parseCharacters(text, 'MARK_PHRASES', 'MULTISELECT');

        assertEquals('<div class=\"text_selection\"><span class=\"correct selectable\">s</span><span class=\"wrong selectable\">t</span><span class=\"correct selectable\">b</span></div>', result.renderedPreview);
    },

    'test parse Letters with markers with spaces': function() {
        var text = "\\correct{s} \\wrong{t} \\correct{b}";
        var result = this.presenter.parseCharacters(text, 'MARK_PHRASES', 'MULTISELECT');

        assertEquals('<div class=\"text_selection\"><span class=\"correct selectable\">s</span><span class=\" \"> </span><span class=\"wrong selectable\">t</span><span class=\" \"> </span><span class=\"correct selectable\">b</span></div>', result.renderedPreview);

    },

    'test parse Letters with markers with letters without markers': function() {
        var text = "g\\correct{s}a\\wrong{t}7\\correct{b}f";
        var result = this.presenter.parseCharacters(text, 'MARK_PHRASES', 'MULTISELECT');

        assertEquals('<div class=\"text_selection\"><span number=\"0\">g</span><span class=\"correct selectable\">s</span><span class=\" \">a</span><span class=\"wrong selectable\">t</span><span class=\" \">7</span><span class=\"correct selectable\">b</span><span class=\" \">f</span></div>', result.renderedPreview);
    },

    'test parse Letters with markers with text': function() {
        var text = "word\\correct{s}word2\\wrong{t}word3\\correct{b}word4";
        var result = this.presenter.parseCharacters(text, 'MARK_PHRASES', 'MULTISELECT');

        assertEquals('<div class=\"text_selection\"><span number=\"0\">word</span><span class=\"correct selectable\">s</span><span class=\" \">word2</span><span class=\"wrong selectable\">t</span><span class=\" \">word3</span><span class=\"correct selectable\">b</span><span class=\" \">word4</span></div>', result.renderedPreview);
    },

    'test parse Letters with markers with text with markers': function() {
        var text = "word\\correct{s}\\wrong{word2}\\wrong{t}\\correct{word3}\\correct{b}word4";
        var result = this.presenter.parseCharacters(text, 'MARK_PHRASES', 'MULTISELECT');

        assertEquals('<div class=\"text_selection\"><span number=\"0\">word</span><span class=\"correct selectable\">s</span><span class=\"wrong selectable\">word2</span><span class=\"wrong selectable\">t</span><span class=\"correct selectable\">word3</span><span class=\"correct selectable\">b</span><span class=\" \">word4</span></div>', result.renderedPreview);
    },

    'test parse Letters with markers with text with markers and spaces': function() {
        var text = "word\\correct{s}\\wrong{word2} \\wrong{t}\\correct{word3}\\correct{b}word4";
        var result = this.presenter.parseCharacters(text, 'MARK_PHRASES', 'MULTISELECT');

        assertEquals('<div class=\"text_selection\"><span number=\"0\">word</span><span class=\"correct selectable\">s</span><span class=\"wrong selectable\">word2</span><span class=\" \"> </span><span class=\"wrong selectable\">t</span><span class=\"correct selectable\">word3</span><span class=\"correct selectable\">b</span><span class=\" \">word4</span></div>', result.renderedPreview);
    },

    'test parseWords with bold 1': function() {
        var text = "\\correct{<b>Te</b> xt}";
        var result = this.presenter.parseWords(text, 'MARK_PHRASES', 'MULTISELECT');

        assertTrue(result.isValid);
        assertEquals('<div class="text_selection"><span class="correct selectable"><b>Te</b> xt</span></div>', result.renderedPreview);
        assertEquals('<div class="text_selection"><span class="selectable" number="0"><b>Te</b> xt</span></div>'.split('').sort().join(''), result.renderedRun.split('').sort().join(''));
    },

    'test parseWords with bold 2': function() {
        var text = "\\correct{<b>Te </b>xt}";
        var result = this.presenter.parseWords(text, 'MARK_PHRASES', 'MULTISELECT');

        assertTrue(result.isValid);
        assertEquals('<div class="text_selection"><span class="correct selectable"><b>Te </b>xt</span></div>', result.renderedPreview);
        assertEquals('<div class="text_selection"><span class="selectable" number="0"><b>Te </b>xt</span></div>'.split('').sort().join(''), result.renderedRun.split('').sort().join(''));
    },

    'test space after bold': function() {
        var text = "\\correct{<b>t</b>est}";
        var result = this.presenter.parseWords(text, 'MARK_PHRASES', 'MULTISELECT');

        assertTrue(result.isValid);
        assertEquals('<div class="text_selection"><span class="correct selectable"><b>t</b>est</span></div>', result.renderedPreview);
        assertEquals('<div class="text_selection"><span class="selectable" number="0"><b>t</b>est</span></div>'.split('').sort().join(''), result.renderedRun.split('').sort().join(''));
    },

    'test mathjax with allselectable': function() {
        var text =  '\\correct{some} text \\(\\sqrt{x^{10}}\\)';
        var result = this.presenter.parseWords(text, 'MARK_PHRASES', 'MULTISELECT');

        assertTrue(result.isValid);
        assertEquals('<div class=\"text_selection\"><span class=\"correct selectable\">some</span> text \\(\\sqrt{x^{10}}\\)</div>', result.renderedPreview);
        assertEquals('<div class=\"text_selection\"><span class=\"selectable\" number=\"0\">some</span><span left=\"0\" right=\"1\"> </span><span number=\"1\">text</span><span left=\"1\" right=\"2\"> </span><span number=\"2\">\\(\\sqrt{x^{10}}\\)</span></div>'.split('').sort().join(''), result.renderedRun.split('').sort().join(''));
    },

    'test allselectable works with amp': function () {
	    var text = 'test&a \n test & b';
	    var result = this.presenter.parseWords(text, 'ALL_SELECTABLE', 'MULTISELECT');
        var expectedResult = '<div class="text_selection"><span class="selectable" number="0">test&amp;a</span><span left="0" right="1"> \n' +
            ' </span><span class="selectable" number="1">test</span><span left="1" right="2"> </span><span class="selectable" number="2">&amp;</span><span left="2" right="3"> </span><span class="selectable" number="3">b</span></div>';
	    assertTrue(result.isValid);
	    assertEquals(expectedResult, result.renderedRun);
    }

});