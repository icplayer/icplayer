FramesCountValidationTests = TestCase("Frames count validation tests");

FramesCountValidationTests.prototype.testFrameCountUndefined = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();

    var validationResult = presenter.validateFramesCount();

    assertTrue(validationResult.isError);
    assertEquals("FN_02", validationResult.errorCode);
};

FramesCountValidationTests.prototype.testFrameCountEmpty = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();

    var validationResult = presenter.validateFramesCount("");

    assertTrue(validationResult.isError);
    assertEquals("FN_02", validationResult.errorCode);
};

FramesCountValidationTests.prototype.testFrameCountNaN = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();

    var validationResult = presenter.validateFramesCount("aa");

    assertTrue(validationResult.isError);
    assertEquals("FN_03", validationResult.errorCode);
};

FramesCountValidationTests.prototype.testFrameCountNegativeNumber = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();

    var validationResult = presenter.validateFramesCount(-1);

    assertTrue(validationResult.isError);
    assertEquals("FN_04", validationResult.errorCode);
};