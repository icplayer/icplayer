LabelsValidationTests = TestCase("Labels validation");

LabelsValidationTests.prototype.testProperConfig = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var labels = [{
        Text: "Sky",
        Frames: "1",
        Top: "0",
        Left: "0"
    }, {
        Text: "Mountains",
        Frames: "2",
        Top: "110",
        Left: "50"
    }, {
        Text: "Sun",
        Frames: "3",
        Top: "200",
        Left: "30"
    }];

    var validationResult = presenter.validateLabels(labels, 10);

    assertFalse(validationResult.isError);

    assertEquals("Sky", validationResult.labels[0].text);
    assertEquals([1], validationResult.labels[0].frames);
    assertEquals(0, validationResult.labels[0].top);
    assertEquals(0, validationResult.labels[0].left);

    assertEquals("Mountains", validationResult.labels[1].text);
    assertEquals([2], validationResult.labels[1].frames);
    assertEquals(110, validationResult.labels[1].top);
    assertEquals(50, validationResult.labels[1].left);

    assertEquals("Sun", validationResult.labels[2].text);
    assertEquals([3], validationResult.labels[2].frames);
    assertEquals(200, validationResult.labels[2].top);
    assertEquals(30, validationResult.labels[2].left);
};

LabelsValidationTests.prototype.testUndefinedText = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var labels = [{
        Frames: "2",
        Top: "0",
        Left: "0"
    }];

    var validationResult = presenter.validateLabels(labels, 10);

    assertTrue(validationResult.isError);
    assertEquals("L_01", validationResult.errorCode);
};

LabelsValidationTests.prototype.testEmptyText = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var labels = [{
        Text: "",
        Frames: "2",
        Top: "0",
        Left: "0"
    }];

    var validationResult = presenter.validateLabels(labels);

    assertTrue(validationResult.isError);
    assertEquals("L_01", validationResult.errorCode);
};

LabelsValidationTests.prototype.testTopValueUndefined = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var labels = [{
        Text: "Text",
        Frames: "2",
        Left: "0"
    }];

    var validationResult = presenter.validateLabels(labels, 10);

    assertTrue(validationResult.isError);
    assertEquals("L_02", validationResult.errorCode);
};

LabelsValidationTests.prototype.testInvalidTopValue = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var labels = [{
        Text: "Text",
        Frames: "2",
        Top: "kaka",
        Left: "0"
    }];

    var validationResult = presenter.validateLabels(labels, 10);

    assertTrue(validationResult.isError);
    assertEquals("L_02", validationResult.errorCode);
};

LabelsValidationTests.prototype.testLeftValueUndefined = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var labels = [{
        Text: "Text",
        Frames: "2",
        Top: "0"
    }];

    var validationResult = presenter.validateLabels(labels, 10);

    assertTrue(validationResult.isError);
    assertEquals("L_03", validationResult.errorCode);
};

LabelsValidationTests.prototype.testInvalidLeftValue = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var labels = [{
        Text: "Text",
        Frames: "2",
        Top: "0",
        Left: "kaka"
    }];

    var validationResult = presenter.validateLabels(labels, 10);

    assertTrue(validationResult.isError);
    assertEquals("L_03", validationResult.errorCode);
};

LabelsValidationTests.prototype.testEmptyLabel = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var labels = [{
        Text: "",
        Frames: "",
        Top: "",
        Left: ""
    }];

    var validationResult = presenter.validateLabels(labels, 10);

    assertFalse(validationResult.isError);
    assertEquals(0, validationResult.labels.length);
};

LabelsValidationTests.prototype.testEmptySecondLabels = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var labels = [{
        Text: "Text",
        Frames: "2",
        Top: "0",
        Left: "0"
    }, {
        Text: "",
        Frames: "",
        Top: "",
        Left: ""
    }];

    var validationResult = presenter.validateLabels(labels, 10);

    assertTrue(validationResult.isError);
    assertEquals("L_04", validationResult.errorCode);
};

LabelsValidationTests.prototype.testFrameListError = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var labels = [{
        Text: "Text",
        Frames: "6",
        Top: "0",
        Left: "0"
    }];

    var validationResult = presenter.validateLabels(labels, 5);

    assertTrue(validationResult.isError);
    assertEquals("FL_05", validationResult.errorCode);
};

LabelsValidationTests.prototype.testLabelsUndefined = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();

    var validationResult = presenter.validateLabels();

    assertFalse(validationResult.isError);
    assertEquals(0, validationResult.labels.length);
};