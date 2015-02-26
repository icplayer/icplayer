TimerSanitizationTests = TestCase("[Slideshow] Timer sanitization");

TimerSanitizationTests.prototype.testInvalidSeparator = function() {
    var presenter = AddonSlideshow_create();
    
    var sanitizationResult = presenter.sanitizeTimer("00-00");
    
    assertTrue(sanitizationResult.isError);
};

TimerSanitizationTests.prototype.testNegative = function() {
    var presenter = AddonSlideshow_create();
    var sanitizationResult = presenter.sanitizeTimer("-1:00");
    
    assertTrue(sanitizationResult.isError);
};

TimerSanitizationTests.prototype.testShortNotation = function() {
    var presenter = AddonSlideshow_create();
    var sanitizationResult = presenter.sanitizeTimer("1:00");
    
    assertFalse(sanitizationResult.isError);
    assertEquals(60, sanitizationResult.sinitizedTimer);
};

TimerSanitizationTests.prototype.testMissingMinutes = function() {
    var presenter = AddonSlideshow_create();
    var sanitizationResult = presenter.sanitizeTimer("20");
    
    assertTrue(sanitizationResult.isError);
};