TestCase("[Magic Boxes] Answers validation test", {
    setUp: function () {
        this.presenter = AddonMagic_Boxes_create();
    },

    'test answers undefined': function () {
        var validationResult = this.presenter.validateAnswers();

        assertTrue(validationResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.ANSWERS_NOT_PROVIDED, validationResult.errorMessage);
    },

    'test answers empty': function () {
        var validationResult = this.presenter.validateAnswers("");

        assertTrue(validationResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.ANSWERS_NOT_PROVIDED, validationResult.errorMessage);
    },

    'test chloroplast': function () {
        var answers = "chloroplast,pores,chlorophyll\nleaves";

        var validationResult = this.presenter.validateAnswers(answers);
        assertFalse(validationResult.isError);
    }
});