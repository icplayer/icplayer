ValidateShowTimeStringTests = TestCase("Validate Show Time String Tests");

ValidateShowTimeStringTests.prototype.setUp = function() {
    this.presenter = Addonvideo_create();
};

ValidateShowTimeStringTests.prototype.testValidationOfEmptyString = function() {
    var emptyString = "";

    var result = this.presenter.validateShowTimeString(emptyString);

    assertFalse(result.isCorrect);
};

ValidateShowTimeStringTests.prototype.testValidationOfNotNumbersInString = function() {
    var wrongString = "ab:cd";

    var result = this.presenter.validateShowTimeString(wrongString);

    assertFalse(result.isCorrect);
};

ValidateShowTimeStringTests.prototype.testValidationOfTooManyDigitsInString = function() {
    var wrongString = "01:122";

    var result = this.presenter.validateShowTimeString(wrongString);

    assertFalse(result.isCorrect);
};

ValidateShowTimeStringTests.prototype.testValidationWhenSecondsOrMinutesAreOutOfRange = function() {
    var wrongString = "61:69";

    var result = this.presenter.validateShowTimeString(wrongString);

    assertFalse(result.isCorrect);
};