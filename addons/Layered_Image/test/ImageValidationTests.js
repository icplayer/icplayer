ImageListValidationTests = TestCase("Image Validation");

ImageListValidationTests.prototype.testProperImage = function() {
    var presenter = AddonLayered_Image_create();
    var IMAGE_URL = "http://lorepo.com/resources/image.png";
    
    var validationResult = presenter.validateImage(IMAGE_URL);
    
    assertFalse(validationResult.isError);
    assertEquals(IMAGE_URL, validationResult.image);
};

ImageListValidationTests.prototype.testImageUndefined = function() {
    var presenter = AddonLayered_Image_create();
   
    var validationResult = presenter.validateImage();
    
    assertTrue(validationResult.isError);
};

ImageListValidationTests.prototype.testImageEmpty = function() {
    var presenter = AddonLayered_Image_create();
   
    var validationResult = presenter.validateImage("");
    
    assertTrue(validationResult.isError);
};