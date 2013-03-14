FrameSizeValidationTests = TestCase("Frame size validation");

FrameSizeValidationTests.prototype.testFrameSizeUndefined = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    
    var validationResult = presenter.validateFrameSize();
    
    assertEquals(presenter.FRAME_SIZE.ORIGINAL, validationResult);
};

FrameSizeValidationTests.prototype.testFrameSizeOriginal = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    
    var validationResult = presenter.validateFrameSize("Original");
    
    assertEquals(presenter.FRAME_SIZE.ORIGINAL, validationResult);
};

FrameSizeValidationTests.prototype.testFrameSizeKeepAspectRatio = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    
    var validationResult = presenter.validateFrameSize("Keep aspect ratio");
    
    assertEquals(presenter.FRAME_SIZE.SCALED, validationResult);
};

FrameSizeValidationTests.prototype.testFrameSizeStretched = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    
    var validationResult = presenter.validateFrameSize("Stretch");
    
    assertEquals(presenter.FRAME_SIZE.STRETCHED, validationResult);
};