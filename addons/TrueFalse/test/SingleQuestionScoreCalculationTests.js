SingleQuestionScoreCalculationTests = TestCase("Single question score calculation");

SingleQuestionScoreCalculationTests.prototype.testSingleSelectionCorrect = function() {
    var presenter = AddonTrueFalse_create();
    var question = {
        Question: "Question 1",
        Answer: "1"
    };

    var isSelectionCorrect = presenter.isSelectionCorrect(question, 1);

    assertTrue(isSelectionCorrect);
};

SingleQuestionScoreCalculationTests.prototype.testSingleSelectionWrong = function() {
    var presenter = AddonTrueFalse_create();
    var question = {
        Question: "Question 1",
        Answer: "1"
    };

    var isSelectionCorrect = presenter.isSelectionCorrect(question, 2);

    assertFalse(isSelectionCorrect);
};

SingleQuestionScoreCalculationTests.prototype.testSingleSelectionMultipleAnswers = function() {
    var presenter = AddonTrueFalse_create();
    var question = {
        Question: "Question 1",
        Answer: "1,2,3"
    };

    var isSelectionCorrect = presenter.isSelectionCorrect(question, 2);

    assertTrue(isSelectionCorrect);
};