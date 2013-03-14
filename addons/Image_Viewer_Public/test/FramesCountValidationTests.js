FramesCountValidationTests = TestCase("Frames count validation tests");

FramesCountValidationTests.prototype.testFrameCountUndefined = function() {
    var presenter = AddonImage_Viewer_Public_create();
    
    var validationResult = presenter.validateFrameNumber();

    assertTrue(validationResult.isError);
    assertEquals("FN_01", validationResult.errorCode);
};

FramesCountValidationTests.prototype.testFrameCountEmpty = function() {
    var presenter = AddonImage_Viewer_Public_create();
    
    var validationResult = presenter.validateFrameNumber("");

    assertTrue(validationResult.isError);
    assertEquals("FN_01", validationResult.errorCode);
};

FramesCountValidationTests.prototype.testFrameCountNaN = function() {
    var presenter = AddonImage_Viewer_Public_create();

    var validationResult = presenter.validateFrameNumber("aa");

    assertTrue(validationResult.isError);
    assertEquals("FN_02", validationResult.errorCode);
};

FramesCountValidationTests.prototype.testFrameCountNegativeNumber = function() {
    var presenter = AddonImage_Viewer_Public_create();

    var validationResult = presenter.validateFrameNumber(-1);

    assertTrue(validationResult.isError);
    assertEquals("FN_03", validationResult.errorCode);
};