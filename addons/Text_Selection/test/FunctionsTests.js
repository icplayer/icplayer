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
    }

});