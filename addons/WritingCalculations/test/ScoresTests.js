TestCase("[Writing Calculations] Scores Methods Tests", {
    'setUp' : function() {
        this.presenter = AddonWritingCalculations_create();
        this.presenter.correctAnswersList = [
            {"rowIndex" : 0, "cellIndex" : 0, "value" : 3},
            {"rowIndex" : 1, "cellIndex" : 1, "value" : 5}
        ];
    },

    'test getPoints method when finding all': function() {
        this.presenter.$view = $("<div><input class='writing-calculations-input' row='1' cell='1' value='3' /><input class='writing-calculations-input' row='2' cell='2' value='4'/></div>");

        var answersCount = this.presenter.getPoints("all");

        assertEquals(2, answersCount);
    },

    'test getPoints method when finding correct': function() {
        this.presenter.$view = $("<div><input class='writing-calculations-input' row='1' cell='1' value='3' /><input class='writing-calculations-input' row='2' cell='2' value='4'/></div>");

        var correct = this.presenter.getPoints("correct");

        assertEquals(1, correct);
    },

    'test getPoints method when finding incorrect': function() {
        this.presenter.$view = $("<div><input class='writing-calculations-input' row='1' cell='1' value='3' /><input class='writing-calculations-input' row='2' cell='2' value='4'/></div>");

        var incorrect = this.presenter.getPoints("incorrect");

        assertEquals(1, incorrect);
    },

    'test getPoints method for empty field when finding all': function() {
        this.presenter.$view = $("<div><input class='writing-calculations-input' row='1' cell='1' value='3' /><input class='writing-calculations-input' row='2' cell='2' value=''/></div>");

        var answersCount = this.presenter.getPoints("all");

        assertEquals(2, answersCount);
    },

    'test getPoints method for empty field when finding correct': function() {
        this.presenter.$view = $("<div><input class='writing-calculations-input' row='1' cell='1' value='3' /><input class='writing-calculations-input' row='2' cell='2' value=''/></div>");

        var correct = this.presenter.getPoints("correct");

        assertEquals(1, correct);
    },

    'test getPoints method for empty field when finding incorrect': function() {
        this.presenter.$view = $("<div><input class='writing-calculations-input' row='1' cell='1' value='3' /><input class='writing-calculations-input' row='2' cell='2' value=''/></div>");

        var incorrect = this.presenter.getPoints("incorrect");

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
