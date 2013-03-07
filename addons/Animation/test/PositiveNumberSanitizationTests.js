PositiveNumberSanitizationTests = TestCase("Positive number validation");

PositiveNumberSanitizationTests.prototype.testProperFormat = function() {
    var presenter = AddonAnimation_create();
    
    var sanitizedNumber = presenter.sanitizePositiveNumber("100");
    
    assertFalse(sanitizedNumber.isError);
    assertEquals(100, sanitizedNumber.number);
};

PositiveNumberSanitizationTests.prototype.testUndefined = function() {
    var presenter = AddonAnimation_create();
    
    var sanitizedNumber = presenter.sanitizePositiveNumber();
    
    assertTrue(sanitizedNumber.isError);
};

PositiveNumberSanitizationTests.prototype.testEmptyString = function() {
    var presenter = AddonAnimation_create();
    
    var sanitizedNumber = presenter.sanitizePositiveNumber("");
    
    assertTrue(sanitizedNumber.isError);
};

PositiveNumberSanitizationTests.prototype.testNaN = function() {
    var presenter = AddonAnimation_create();
    
    var sanitizedNumber = presenter.sanitizePositiveNumber("kaka");
    
    assertTrue(sanitizedNumber.isError);
};

PositiveNumberSanitizationTests.prototype.testNegative = function() {
    var presenter = AddonAnimation_create();
    
    var sanitizedNumber = presenter.sanitizePositiveNumber("-10");
    
    assertTrue(sanitizedNumber.isError);
};