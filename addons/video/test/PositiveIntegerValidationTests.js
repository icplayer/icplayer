PositiveIntegerValidationTests = TestCase("Positive integer validation tests");

PositiveIntegerValidationTests.prototype.testUndefinedValues = function()  {
    var presenter = Addonvideo_create();

    var validationResult = presenter.validatePositiveInteger();

    assertTrue(validationResult.isError);
    assertEquals(1, validationResult.value);
};

PositiveIntegerValidationTests.prototype.testDefaultValue = function()  {
    var presenter = Addonvideo_create();

    var validationResult = presenter.validatePositiveInteger("", 100);

    assertFalse(validationResult.isError);
    assertEquals(100, validationResult.value);
};

PositiveIntegerValidationTests.prototype.testProperValue = function()  {
    var presenter = Addonvideo_create();

    var validationResult = presenter.validatePositiveInteger("150", 100);

    assertFalse(validationResult.isError);
    assertEquals(150, validationResult.value);
};

PositiveIntegerValidationTests.prototype.testNotANumber = function()  {
    var presenter = Addonvideo_create();

    var validationResult = presenter.validatePositiveInteger("NotANumber", 100);

    assertTrue(validationResult.isError);
    assertEquals(100, validationResult.value);
};

PositiveIntegerValidationTests.prototype.testValueBelowMinimum = function()  {
    var presenter = Addonvideo_create();

    var validationResult = presenter.validatePositiveInteger("-1", 150);

    assertTrue(validationResult.isError);
    assertEquals(150, validationResult.value);
};