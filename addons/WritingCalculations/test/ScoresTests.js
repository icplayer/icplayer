TestCase("[Writing Calculations] Scores Methods Tests", {
    'setUp' : function() {
        this.presenter = AddonWritingCalculations_create();
        this.presenter.correctAnswersList = [
            {"rowIndex" : 1, "cellIndex" : 1, "value" : 3},
            {"rowIndex" : 2, "cellIndex" : 2, "value" : 5}
        ];
    },

    'test getPoints method': function() {
        this.presenter.$view = $("<div><input class='writing-calculations-input' row='1' cell='1' value='3' /><input class='writing-calculations-input' row='2' cell='2' value='4'/></div>");

        var answersCount = this.presenter.getPoints("all");
        var correct = this.presenter.getPoints("correct");
        var incorrect = this.presenter.getPoints("incorrect");

        assertEquals(2, answersCount);
        assertEquals(1, correct);
        assertEquals(1, incorrect);
    },

    'test getPoints method for empty field': function() {
        this.presenter.$view = $("<div><input class='writing-calculations-input' row='1' cell='1' value='3' /><input class='writing-calculations-input' row='2' cell='2' value=''/></div>");

        var answersCount = this.presenter.getPoints("all");
        var correct = this.presenter.getPoints("correct");
        var incorrect = this.presenter.getPoints("incorrect");

        assertEquals(2, answersCount);
        assertEquals(1, correct);
        assertEquals(0, incorrect);
    },

    'test allAnswersCorrect positive': function() {
        this.presenter.$view = $("<div><input class='writing-calculations-input' row='1' cell='1' value='3' /><input class='writing-calculations-input' row='2' cell='2' value='5' /></div>");

        var allAnswersCorrect = this.presenter.allAnswersCorrect();

        assertTrue(allAnswersCorrect);
    },

    'test allAnswersCorrect negative': function() {
        this.presenter.$view = $("<div><input class='writing-calculations-input' row='1' cell='1' value='2' /><input class='writing-calculations-input' row='2' cell='2' value='5' /></div>");

        var allAnswersCorrect = this.presenter.allAnswersCorrect();

        assertFalse(allAnswersCorrect);
    },

    'test allAnswersCorrect negative due to empty field': function() {
        this.presenter.$view = $("<div><input class='writing-calculations-input' row='1' cell='1' value='3' /><input class='writing-calculations-input' row='2' cell='2' value=''/></div>");

        var allAnswersCorrect = this.presenter.allAnswersCorrect();

        assertFalse(allAnswersCorrect);
    }
});