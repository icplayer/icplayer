PositionSanitizationTests = TestCase("Position sanitization");

PositionSanitizationTests.prototype.testProperFormat = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    
    var sanitizationResult = presenter.sanitizePosition("100");
    
    assertFalse(sanitizationResult.isError);
    assertEquals(100, sanitizationResult.position);
};

PositionSanitizationTests.prototype.testPositionUndefined = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    
    var sanitizationResult = presenter.sanitizePosition();
    
    assertTrue(sanitizationResult.isError);
};

PositionSanitizationTests.prototype.testPositionEmptyString = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    
    var sanitizationResult = presenter.sanitizePosition("");
    
    assertTrue(sanitizationResult.isError);
};

PositionSanitizationTests.prototype.testPositionNaN = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    
    var sanitizationResult = presenter.sanitizePosition("kaka");
    
    assertTrue(sanitizationResult.isError);
};

PositionSanitizationTests.prototype.testPositionNegative = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    
    var sanitizationResult = presenter.sanitizePosition("-10");
    
    assertTrue(sanitizationResult.isError);
};