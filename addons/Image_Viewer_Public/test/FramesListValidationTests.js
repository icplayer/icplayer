FramesListValidationTests = TestCase("Frames list validation");

FramesListValidationTests.prototype.testUndefined = function() {
    var presenter = AddonImage_Viewer_Public_create();

    var validationResult = presenter.validateFramesList();

    assertTrue(validationResult.isError);
    assertEquals("FL_01", validationResult.errorCode);
};

FramesListValidationTests.prototype.testEmpty = function() {
    var presenter = AddonImage_Viewer_Public_create();

    var validationResult = presenter.validateFramesList("");

    assertTrue(validationResult.isError);
    assertEquals("FL_01", validationResult.errorCode);
};

FramesListValidationTests.prototype.testSingleSlide = function() {
    var presenter = AddonImage_Viewer_Public_create();

    var validationResult = presenter.validateFramesList("1", 3);

    assertFalse(validationResult.isError);
    assertArray(validationResult.list);
    assertEquals([1], validationResult.list);
};

FramesListValidationTests.prototype.testMultipleSlides = function() {
    var presenter = AddonImage_Viewer_Public_create();

    var validationResult = presenter.validateFramesList("1,2,3", 3);

    assertFalse(validationResult.isError);
    assertArray(validationResult.list);
    assertEquals([1, 2, 3], validationResult.list);
};

FramesListValidationTests.prototype.testSeparatorError = function() {
    var presenter = AddonImage_Viewer_Public_create();

    var validationResult = presenter.validateFramesList("1;2;3", 3);

    assertTrue(validationResult.isError);
    assertEquals("FL_02", validationResult.errorCode);
};

FramesListValidationTests.prototype.testFrameNumberNaN = function() {
    var presenter = AddonImage_Viewer_Public_create();

    var validationResult = presenter.validateFramesList("1,a,3", 3);

    assertTrue(validationResult.isError);
    assertEquals("FL_03", validationResult.errorCode);
};

FramesListValidationTests.prototype.testFrameNumberLowerThanOne = function() {
    var presenter = AddonImage_Viewer_Public_create();

    var validationResult = presenter.validateFramesList("0", 3);

    assertTrue(validationResult.isError);
    assertEquals("FL_03", validationResult.errorCode);
};

FramesListValidationTests.prototype.testFrameNumberHigherThanCount = function() {
    var presenter = AddonImage_Viewer_Public_create();

    var validationResult = presenter.validateFramesList("5", 3);

    assertTrue(validationResult.isError);
    assertEquals("FL_03", validationResult.errorCode);
};

FramesListValidationTests.prototype.testMissingFrameNumber = function() {
    var presenter = AddonImage_Viewer_Public_create();

    var validationResult = presenter.validateFramesList("1,,3", 3);

    assertTrue(validationResult.isError);
    assertEquals("FL_04", validationResult.errorCode);
};

FramesListValidationTests.prototype.testMultipleFrameNumbersRange = function() {
    var presenter = AddonImage_Viewer_Public_create();

    var validationResult = presenter.validateFramesList("1-3,2-5", 6);

    assertFalse(validationResult.isError);
    assertArray(validationResult.list);
    assertEquals([1, 2, 3, 4, 5], validationResult.list);
};

FramesListValidationTests.prototype.testFrameNumbersRangeReversed = function() {
    var presenter = AddonImage_Viewer_Public_create();

    var validationResult = presenter.validateFramesList("3-1,5", 6);

    assertTrue(validationResult.isError);
    assertEquals("FL_05", validationResult.errorCode);
};

FramesListValidationTests.prototype.testMultipleOccursOfFrameNumbers = function() {
    var presenter = AddonImage_Viewer_Public_create();

    var validationResult = presenter.validateFramesList("1,3,4,3", 6);

    assertFalse(validationResult.isError);
    assertArray(validationResult.list);
    assertEquals([1, 3, 4], validationResult.list);
};