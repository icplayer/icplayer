ImageSizeValidationTests = TestCase("Image size validation");

ImageSizeValidationTests.prototype.testFrameSizeUndefined = function() {
    var presenter = AddonLayered_Image_create();
    
    var validationResult = presenter.validateImageSize();
    
    assertEquals(presenter.IMAGE_SIZE.ORIGINAL, validationResult);
};

ImageSizeValidationTests.prototype.testFrameSizeOriginal = function() {
    var presenter = AddonLayered_Image_create();
    
    var validationResult = presenter.validateImageSize("Original");
    
    assertEquals(presenter.IMAGE_SIZE.ORIGINAL, validationResult);
};

ImageSizeValidationTests.prototype.testFrameSizeKeepAspectRatio = function() {
    var presenter = AddonLayered_Image_create();
    
    var validationResult = presenter.validateImageSize("Keep aspect ratio");
    
    assertEquals(presenter.IMAGE_SIZE.SCALED, validationResult);
};

ImageSizeValidationTests.prototype.testFrameSizeStretched = function() {
    var presenter = AddonLayered_Image_create();
    
    var validationResult = presenter.validateImageSize("Stretch");
    
    assertEquals(presenter.IMAGE_SIZE.STRETCHED, validationResult);
};