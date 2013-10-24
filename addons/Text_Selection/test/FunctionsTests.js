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

    	assertEquals('<div class="text_selection">some text </div>', result.renderedPreview);
    },

    'test parse Words with markers': function() {
    	var text = "\\correct{some} \\wrong{text}";
    	var result = this.presenter.parseWords(text, 'MARK_PHRASES', 'MULTISELECT');

    	assertEquals('<div class="text_selection"><span class="correct selectable">some</span> <span class="wrong selectable">text</span> </div>', result.renderedPreview);
    },

    'test parse Words with markers with latex': function() {
    	var text = "\\wrong{\\(\\sqrt{x^{10}}\\)}";
    	var result = this.presenter.parseWords(text, 'MARK_PHRASES', 'MULTISELECT');

    	assertEquals('<div class="text_selection"><span class="wrong selectable">\\(\\sqrt{x^{10}}\\)</span> </div>', result.renderedPreview);
    },

    'test parse Words with markers with latex - extra space': function() {
    	var text = "\\wrong{\\(\\sqrt{x^{10}}\\) }";
    	var result = this.presenter.parseWords(text, 'MARK_PHRASES', 'MULTISELECT');

    	assertEquals('<div class="text_selection"><span class="wrong selectable">\\(\\sqrt{x^{10}}\\) </span> </div>', result.renderedPreview);
    },

    'test parse Words with markers with latex - spaces all over the place': function() {
    	var text = "\\wrong{ \\(\\sqrt{ {x ^{ 10 } } } \\) }";
    	var result = this.presenter.parseWords(text, 'MARK_PHRASES', 'MULTISELECT');

    	assertEquals('<div class="text_selection"><span class="wrong selectable"> \\(\\sqrt{ {x ^{ 10 } } } \\) </span> </div>', result.renderedPreview);
    },

    'test parse Words with markers with latex - spaces all over the place another example': function() {
    	var text = "\\correct{\\(\\frac{ 2 } { \\sqrt{3}}\\)}";
    	var result = this.presenter.parseWords(text, 'MARK_PHRASES', 'MULTISELECT');

    	assertEquals('<div class="text_selection"><span class="correct selectable">\\(\\frac{ 2 } { \\sqrt{3}}\\)</span> </div>', result.renderedPreview);
    },

    'test count brackets' : function() {
    	var text = "\\wrong{\\(\\sqrt{x^{10}}\\)";
    	var result = this.presenter.countBrackets(text);

    	assertEquals(3, result.open);
    	assertEquals(2, result.close);
    }
});