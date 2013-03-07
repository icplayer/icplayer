FrameDurationValidationTests = TestCase("Frame duration validation");

FrameDurationValidationTests.prototype.testProperFrameDuration = function() {
    var presenter = AddonAnimation_create();
    
    var validationResult = presenter.validateFrameDuration("100");
    
    assertFalse(validationResult.isError);
    assertEquals(100, validationResult.frameDuration);
};

FrameDurationValidationTests.prototype.testUndefinedFrameDuration = function() {
    var presenter = AddonAnimation_create();
    
    var validationResult = presenter.validateFrameDuration();
    
    assertTrue(validationResult.isError);
    assertEquals("FD_01", validationResult.errorCode);
};

FrameDurationValidationTests.prototype.testInvalidFrameDuration = function() {
    var presenter = AddonAnimation_create();
    
    var validationResult = presenter.validateFrameDuration("-10");
    
    assertTrue(validationResult.isError);
    assertEquals("FD_01", validationResult.errorCode);
};