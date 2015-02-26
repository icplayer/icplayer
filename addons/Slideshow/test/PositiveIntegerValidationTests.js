PositiveIntegerValidationTests = TestCase("[Slideshow] Positive integer validation tests");

PositiveIntegerValidationTests.prototype.testUndefinedValues = function()  {
    var presenter = AddonSlideshow_create();

    var validationResult = presenter.validatePositiveInteger();

    assertTrue(validationResult.isError);
};

PositiveIntegerValidationTests.prototype.testDefaultValue = function()  {
    var presenter = AddonSlideshow_create();

    var validationResult = presenter.validatePositiveInteger("", 100);

    assertFalse(validationResult.isError);
    assertEquals(100, validationResult.value);
};

PositiveIntegerValidationTests.prototype.testProperValue = function()  {
    var presenter = AddonSlideshow_create();

    var validationResult = presenter.validatePositiveInteger("150", 100);

    assertFalse(validationResult.isError);
    assertEquals(150, validationResult.value);
};

PositiveIntegerValidationTests.prototype.testNotANumber = function()  {
    var presenter = AddonSlideshow_create();

    var validationResult = presenter.validatePositiveInteger("NotANumber", 100);

    assertTrue(validationResult.isError);
};

PositiveIntegerValidationTests.prototype.testValueBelowMinimum = function()  {
    var presenter = AddonSlideshow_create();

    var validationResult = presenter.validatePositiveInteger("-1", 100);

    assertTrue(validationResult.isError);
};