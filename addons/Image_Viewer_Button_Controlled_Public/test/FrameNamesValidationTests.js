FrameNamesValidationTests = TestCase("Frame names validation tests");

FrameNamesValidationTests.prototype.testEmptyName = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var frameNames = [{
        name: "",
        frame: "1"
    }];

    var validationResult = presenter.validateFrameNames(frameNames, 6);

    assertTrue(validationResult.isError);
    assertEquals("FN_01", validationResult.errorCode);
};

FrameNamesValidationTests.prototype.testEmptyFrameNumber = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var frameNames = [{
        name: "ImageViewer1",
        frame: ""
    }];

    var validationResult = presenter.validateFrameNames(frameNames, 6);

    assertTrue(validationResult.isError);
    assertEquals("FN_02", validationResult.errorCode);
};

FrameNamesValidationTests.prototype.testFrameNumbersNaN = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var frameNames = [{
        name: "ImageViewer1",
        frame: "aaa"
    }];

    var validationResult = presenter.validateFrameNames(frameNames, 6);

    assertTrue(validationResult.isError);
    assertEquals("FN_03", validationResult.errorCode);
};

FrameNamesValidationTests.prototype.testNegativeFrame = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var frameNames = [{
        name: "ImageViewer1",
        frame: "-1"
    }];

    var validationResult = presenter.validateFrameNames(frameNames, 6);

    assertTrue(validationResult.isError);
    assertEquals("FN_04", validationResult.errorCode);
};

FrameNamesValidationTests.prototype.testFrameNumberZero = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var frameNames = [{
        name: "ImageViewer1",
        frame: "0"
    }];

    var validationResult = presenter.validateFrameNames(frameNames, 6);

    assertTrue(validationResult.isError);
    assertEquals("FN_04", validationResult.errorCode);
};

FrameNamesValidationTests.prototype.testFrameNamesFrameOutOfBounds = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var frameNames = [{
        name: "ImageViewer1",
        frame: "7"
    }];

    var validationResult = presenter.validateFrameNames(frameNames, 6);

    assertTrue(validationResult.isError);
    assertEquals("FN_05", validationResult.errorCode);
};