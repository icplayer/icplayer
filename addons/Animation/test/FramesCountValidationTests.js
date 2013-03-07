FramesCountValidationTests = TestCase("Frames count validation");

FramesCountValidationTests.prototype.testProperFramesCount = function() {
    var presenter = AddonAnimation_create();
    
    var validationResult = presenter.validateFramesCount("10");
    
    assertFalse(validationResult.isError);
    assertEquals(10, validationResult.framesCount);
};

FramesCountValidationTests.prototype.testUndefinedFramesCount = function() {
    var presenter = AddonAnimation_create();
    
    var validationResult = presenter.validateFramesCount();
    
    assertTrue(validationResult.isError);
    assertEquals("FC_01", validationResult.errorCode);
};

FramesCountValidationTests.prototype.testInvalidFramesCount = function() {
    var presenter = AddonAnimation_create();
    
    var validationResult = presenter.validateFramesCount("-10");
    
    assertTrue(validationResult.isError);
    assertEquals("FC_01", validationResult.errorCode);
};